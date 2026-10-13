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
    || typeof body.referenceDate !== 'string' || !METRIC_IDS.every(id => validMetric(body.metrics?.[id]))
    || (body.nameAnalysis !== null && (typeof body.nameAnalysis?.normalized !== 'string' || !Array.isArray(body.nameAnalysis?.letters)
      || !body.nameAnalysis.letters.every(item => typeof item?.letter === 'string' && Number.isFinite(item.value))))) {
    throw new NumerologyRequestError('Phản hồi chưa đầy đủ. Vui lòng thử lại.', [], true);
  }
  return body;
}
