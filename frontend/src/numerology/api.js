import { API_BASE } from '../apiBase';

export const METRIC_IDS = ['lifePath', 'birthday', 'attitude', 'expression', 'soulUrge', 'personality', 'maturity'];
export class NumerologyRequestError extends Error {
  constructor(message, fields = [], retryable = false) {
    super(message);
    this.fields = fields;
    this.retryable = retryable;
  }
}
function validMetric(metric) {
  if (metric?.status === 'unavailable') return metric.value === null && typeof metric.reason === 'string';
  return metric?.status === 'available' && Number.isInteger(metric.value) && Number.isInteger(metric.rootValue)
    && typeof metric.isMaster === 'boolean' && typeof metric.keepMasters === 'boolean' && Array.isArray(metric.parts)
    && metric.parts.every(part => typeof part?.label === 'string' && Array.isArray(part.values) && part.values.every(Number.isFinite) && Number.isFinite(part.total))
    && Array.isArray(metric.steps) && metric.steps.every(step => Array.isArray(step?.digits) && step.digits.every(Number.isFinite) && Number.isFinite(step.input) && Number.isFinite(step.output));
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
    && ['personalYear', 'personalMonth', 'personalDay'].every(id => validMetric(cycle[id]) && cycle[id].status === 'available' && cycle[id].value >= 1 && cycle[id].value <= 9 && cycle[id].isMaster === false && cycle[id].keepMasters === false);
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
    || typeof body.referenceDate !== 'string' || !validAdvanced(body) || !METRIC_IDS.every(id => validMetric(body.metrics?.[id]))
    || (body.nameAnalysis !== null && (typeof body.nameAnalysis?.normalized !== 'string' || !Array.isArray(body.nameAnalysis?.letters)
      || !body.nameAnalysis.letters.every(item => typeof item?.letter === 'string' && Number.isFinite(item.value))))) {
    throw new NumerologyRequestError('Phản hồi chưa đầy đủ. Vui lòng thử lại.', [], true);
  }
  return body;
}
