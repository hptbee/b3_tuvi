import { API_BASE } from '../apiBase';

export const METRIC_IDS = ['lifePath', 'birthday', 'attitude', 'expression', 'soulUrge', 'personality', 'maturity'];
export class NumerologyRequestError extends Error {
  constructor(message, fields = [], retryable = false) {
    super(message);
    this.fields = fields;
    this.retryable = retryable;
  }
}
const readableText = value => typeof value === 'string' && value.trim().length > 0 && value.length <= 1500;
const textList = value => Array.isArray(value) && value.length > 0 && value.length <= 4 && value.every(readableText);
function validMeaning(metric, metricId) {
  if (metric.meaningStatus === 'withheld') return metric.meaning === null;
  const meaning = metric.meaning;
  return metric.meaningStatus === 'experimental_editorial' && meaning?.kind === 'original_editorial'
    && meaning.metricId === metricId && meaning.value === metric.value && meaning.reviewStatus === 'editorial_reviewed'
    && meaning.expertVerified === false && meaning.evidenceStatus === 'community_reference'
    && readableText(meaning.title) && readableText(meaning.summary) && textList(meaning.reflectionPrompts) && textList(meaning.limitations)
    && Array.isArray(meaning.sourceReferences) && meaning.sourceReferences.length > 0 && meaning.sourceReferences.length <= 4
    && meaning.sourceReferences.every(source => readableText(source?.id) && readableText(source.title)
      && source.evidenceClass === 'community_reference' && source.relationship === 'general_number_theme'
      && typeof source.url === 'string' && /^https:\/\/github\.com\/[^/?#]+\/[^/?#]+\/blob\/[a-f0-9]{40}\/[^?#]+$/.test(source.url));
}
function validMetric(metric, metricId) {
  if (metric?.status === 'unavailable') return metric.value === null && typeof metric.reason === 'string' && metric.meaning === null && metric.meaningStatus === 'withheld';
  return metric?.status === 'available' && Number.isInteger(metric.value) && Number.isInteger(metric.rootValue)
    && typeof metric.isMaster === 'boolean' && typeof metric.keepMasters === 'boolean' && Array.isArray(metric.parts)
    && metric.parts.every(part => typeof part?.label === 'string' && Array.isArray(part.values) && part.values.every(Number.isFinite) && Number.isFinite(part.total))
    && Array.isArray(metric.steps) && metric.steps.every(step => Array.isArray(step?.digits) && step.digits.every(Number.isFinite) && Number.isFinite(step.input) && Number.isFinite(step.output)) && validMeaning(metric, metricId);
}
function validAdvanced(body) {
  const grid = body.birthGrid;
  const cycle = body.cycles;
  const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const lines = ['1-2-3', '4-5-6', '7-8-9', '1-4-7', '2-5-8', '3-6-9', '1-5-9', '3-5-7'];
  return grid?.layoutVersion === '3-6-9-v1'
    && JSON.stringify(grid.layout) === JSON.stringify([[3, 6, 9], [2, 5, 8], [1, 4, 7]])
    && digits.every(digit => Number.isInteger(grid.counts?.[digit]) && grid.counts[digit] >= 0 && grid.counts[digit] <= 8)
    && Number.isInteger(grid.ignoredZeroCount) && grid.ignoredZeroCount >= 0 && grid.ignoredZeroCount <= 8
    && Array.isArray(grid.lines) && grid.lines.length === 8 && new Set(grid.lines.map(line => line?.id)).size === 8
    && grid.lines.every(line => lines.includes(line?.id) && Array.isArray(line.digits) && line.digits.join('-') === line.id && ['present', 'partial', 'absent'].includes(line.state))
    && cycle?.policy === 'calendar-year-v1' && typeof cycle.targetDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(cycle.targetDate)
    && Number.isInteger(cycle.year)
    && ['personalYear', 'personalMonth', 'personalDay'].every(id => validMetric(cycle[id], id) && cycle[id].status === 'available' && cycle[id].value >= 1 && cycle[id].value <= 9 && cycle[id].isMaster === false && cycle[id].keepMasters === false);
}
export async function calculateRequest(input, signal) {
  let response;
  try {
    response = await fetch(`${API_BASE}/api/numerology/calculate`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input), signal, cache: 'no-store'
    });
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new NumerologyRequestError('Chưa kết nối được máy chủ. Vui lòng thử lại.', [], true);
  }
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    const fields = Array.isArray(body?.error?.fields) ? body.error.fields.filter(field => typeof field?.path === 'string' && typeof field.message === 'string') : [];
    throw new NumerologyRequestError(typeof body?.error?.message === 'string' ? body.error.message : 'Chưa tính được chỉ số. Vui lòng thử lại.', fields, response.status >= 500 || response.status === 429);
  }
  if (body?.ok !== true || typeof body.profile?.id !== 'string' || typeof body.profile?.version !== 'string'
    || (body.contentVersion !== null && (typeof body.contentVersion !== 'string' || !/^\d+\.\d+\.\d+$/.test(body.contentVersion)))
    || (Object.values(body.metrics || {}).concat(Object.values(body.cycles || {})).some(metric => metric?.meaningStatus === 'experimental_editorial') && body.contentVersion === null)
    || typeof body.referenceDate !== 'string' || !validAdvanced(body) || !METRIC_IDS.every(id => validMetric(body.metrics?.[id], id))
    || (body.nameAnalysis !== null && (typeof body.nameAnalysis?.normalized !== 'string' || !Array.isArray(body.nameAnalysis?.letters)
      || !body.nameAnalysis.letters.every(item => typeof item?.letter === 'string' && Number.isFinite(item.value))))) {
    throw new NumerologyRequestError('Phản hồi chưa đầy đủ. Vui lòng thử lại.', [], true);
  }
  return body;
}
