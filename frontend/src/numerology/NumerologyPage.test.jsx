import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NumerologyPage from './NumerologyPage';

function samplePinnacles(asOf = '2026-10-13') {
  const metric = (value, keepMasters = true) => ({ status: 'available', value, rootValue: value, isMaster: false, keepMasters,
    meaning: null, meaningStatus: 'withheld', parts: [{ label: 'reducedMonth', values: [value], total: value }], steps: [] });
  const period = (id, pinnacle, challengeValue, start, end, active, operands = null) => ({
    id, pinnacle: metric(pinnacle), startAgeInclusive: start, endAgeInclusive: end, active,
    challenge: { status: 'available', value: challengeValue, operands: operands || (challengeValue === 0 ? [6, 6] : [challengeValue, 0]), meaning: null, meaningStatus: 'withheld' },
    startDate: '1990-06-15', endDate: end === null ? null : '2032-06-14'
  });
  return { version: '1.0.0', policy: 'component-reduce-root-age-v1', anniversaryPolicy: 'feb29-mar1-nonleap-v1', asOf, completedAge: 36, lifePathRoot: 4, firstCycleEndAge: 32,
    components: { month: metric(6, false), day: metric(6, false), year: metric(1, false) },
    periods: [period('p1', 3, 0, 0, 32, false), period('p2', 7, 5, 33, 41, true), period('p3', 1, 5, 42, 50, false, [0, 5]), period('p4', 7, 5, 51, null, false)] };
}
function result(value = 4, normalized = null) {
  const available = number => ({ status: 'available', value: number, rootValue: number, isMaster: false, keepMasters: true,
    meaning: null, meaningStatus: 'withheld', parts: [{ label: 'day', values: [1, 5], total: 6 }], steps: [] });
  return { ok: true, contentVersion: null, referenceDate: '2026-10-13', profile: { id: 'pythagorean-vn-v1', version: '1.1.0' },
    birthGrid: { layoutVersion: '3-6-9-v1', layout: [[3,6,9],[2,5,8],[1,4,7]], counts: {1:2,2:0,3:0,4:0,5:1,6:1,7:0,8:0,9:2}, ignoredZeroCount: 2,
      lines: ['1-2-3','4-5-6','7-8-9','1-4-7','2-5-8','3-6-9','1-5-9','3-5-7'].map(id => ({ id, digits: id.split('-').map(Number), state: id === '1-5-9' ? 'present' : 'partial' })) },
    cycles: { policy: 'calendar-year-v1', targetDate: '2026-10-13', year: 2026,
      personalYear: { ...available(4), keepMasters: false }, personalMonth: { ...available(5), keepMasters: false }, personalDay: { ...available(9), keepMasters: false } },
    pinnacles: samplePinnacles(),
    nameAnalysis: normalized ? { normalized, letters: [{ letter: 'A', value: 1 }] } : null,
    metrics: {
      lifePath: available(value), birthday: available(6), attitude: available(3),
      expression: { status: 'unavailable', value: null, reason: 'missing_name', meaning: null, meaningStatus: 'withheld' },
      soulUrge: { status: 'unavailable', value: null, reason: 'missing_name', meaning: null, meaningStatus: 'withheld' },
      personality: { status: 'unavailable', value: null, reason: 'missing_name', meaning: null, meaningStatus: 'withheld' },
      maturity: { status: 'unavailable', value: null, reason: 'missing_name', meaning: null, meaningStatus: 'withheld' }
    }
  };
}
const success = body => ({ ok: true, status: 200, json: async () => body });
async function fillDate(user, day = '15') {
  await user.type(screen.getByRole('spinbutton', { name: 'Ngày', exact: true }), day);
  await user.type(screen.getByRole('spinbutton', { name: 'Tháng', exact: true }), '6');
  await user.type(screen.getByRole('spinbutton', { name: 'Năm', exact: true }), '1990');
}
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

it('submits date-only without a name and explains unavailable metrics', async () => {
  const fetch = vi.fn(async () => success(result()));
  vi.stubGlobal('fetch', fetch);
  const user = userEvent.setup();
  render(<NumerologyPage />);
  expect(fetch).not.toHaveBeenCalled();
  await fillDate(user);
  await user.click(screen.getByRole('button', { name: 'Xem kết quả' }));
  expect(await screen.findByRole('status', { name: 'Đường đời', exact: true })).toHaveTextContent('4');
  expect(JSON.parse(fetch.mock.calls[0][1].body)).toEqual({ birthDate: { year: 1990, month: 6, day: 15 } });
  expect(screen.getAllByText('Thêm họ tên để tính chỉ số này.')).toHaveLength(4);
  expect(screen.getByRole('status', { name: 'Thử thách giai đoạn 1', exact: true })).toHaveTextContent(/^0$/);
  expect(screen.getByRole('listitem', { name: 'Giai đoạn 3' })).toHaveTextContent('Hiệu tuyệt đối của 0 và 5');
  expect(screen.queryByText('0 − 5 = 5')).not.toBeInTheDocument();
  expect(screen.getByText('Đang trong giai đoạn này')).toBeVisible();
  expect(screen.getByRole('heading', { name: 'Các chỉ số của bạn' })).toHaveFocus();
});

it('retains the submitted snapshot while the form is edited', async () => {
  vi.stubGlobal('fetch', vi.fn(async () => success(result(4, 'AN'))));
  const user = userEvent.setup();
  render(<NumerologyPage />);
  await fillDate(user);
  const name = screen.getByRole('textbox', { name: /Họ tên khai sinh/ });
  await user.type(name, 'An');
  await user.click(screen.getByRole('button', { name: 'Xem kết quả' }));
  await screen.findByRole('status', { name: 'Đường đời', exact: true });
  await user.clear(name);
  await user.type(name, 'Bình');
  expect(screen.getByText('An · 15/6/1990')).toBeVisible();
  expect(screen.getByText(/Bạn đang chỉnh sửa thông tin/)).toHaveTextContent('Kết quả vẫn thuộc dữ liệu đã gửi');
});

it('shows field errors and focuses the submitted name field', async () => {
  vi.stubGlobal('fetch', vi.fn(async () => ({ ok: false, status: 400, json: async () => ({ error: {
    message: 'Tên chứa ký tự chưa hỗ trợ', fields: [{ path: 'fullName', message: 'Chỉ hỗ trợ tên Latin/tiếng Việt' }]
  } }) })));
  const user = userEvent.setup();
  render(<NumerologyPage />);
  await fillDate(user);
  const name = screen.getByRole('textbox', { name: /Họ tên khai sinh/ });
  await user.type(name, '漢');
  await user.click(screen.getByRole('button', { name: 'Xem kết quả' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('Tên chứa ký tự chưa hỗ trợ');
  expect(name).toHaveFocus();
  expect(name).toHaveAttribute('aria-invalid', 'true');
  expect(screen.queryByRole('button', { name: 'Thử lại' })).not.toBeInTheDocument();
});

it('sends a hidden-only raw name and displays the backend rejection', async () => {
  const fetch = vi.fn(async () => ({ ok: false, status: 400, json: async () => ({ error: {
    message: 'Tên chứa ký tự chưa hỗ trợ', fields: [{ path: 'fullName', message: 'Tên không được chứa ký tự ẩn' }]
  } }) }));
  vi.stubGlobal('fetch', fetch);
  const user = userEvent.setup();
  render(<NumerologyPage />);
  await fillDate(user);
  const name = screen.getByRole('textbox', { name: /Họ tên khai sinh/ });
  await user.type(name, '\uFEFF');
  await user.click(screen.getByRole('button', { name: 'Xem kết quả' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('Tên chứa ký tự chưa hỗ trợ');
  expect(JSON.parse(fetch.mock.calls[0][1].body).fullName).toBe('\uFEFF');
  expect(screen.getByText('Tên không được chứa ký tự ẩn')).toBeVisible();
  expect(name).toHaveAttribute('aria-invalid', 'true');
  expect(name).toHaveFocus();
});

it.each([undefined, null, 'true', 1])('rejects a successful response with invalid keepMasters %s', async keepMasters => {
  const body = result();
  if (keepMasters === undefined) delete body.metrics.lifePath.keepMasters;
  else body.metrics.lifePath.keepMasters = keepMasters;
  vi.stubGlobal('fetch', vi.fn(async () => success(body)));
  const user = userEvent.setup();
  render(<NumerologyPage />);
  await fillDate(user);
  await user.click(screen.getByRole('button', { name: 'Xem kết quả' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('Phản hồi chưa đầy đủ');
  expect(screen.queryByRole('heading', { name: 'Các chỉ số của bạn' })).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Thử lại' })).toBeVisible();
});

it('retries the failed submitted snapshot rather than unsent edits', async () => {
  const fetch = vi.fn().mockRejectedValueOnce(new TypeError('offline')).mockResolvedValueOnce(success(result()));
  vi.stubGlobal('fetch', fetch);
  const user = userEvent.setup();
  render(<NumerologyPage />);
  await fillDate(user);
  await user.click(screen.getByRole('button', { name: 'Xem kết quả' }));
  await screen.findByRole('alert');
  const day = screen.getByRole('spinbutton', { name: 'Ngày', exact: true });
  await user.clear(day); await user.type(day, '16');
  await user.click(screen.getByRole('button', { name: 'Thử lại' }));
  await screen.findByRole('status', { name: 'Đường đời', exact: true });
  expect(JSON.parse(fetch.mock.calls[1][1].body).birthDate.day).toBe(15);
  expect(screen.getByText('Theo ngày sinh · 15/6/1990')).toBeVisible();
});

it('ignores a stale calculation and aborts it when a changed input is submitted', async () => {
  let firstResolve;
  const first = new Promise(resolve => { firstResolve = resolve; });
  const fetch = vi.fn().mockReturnValueOnce(first).mockResolvedValueOnce(success(result(5)));
  vi.stubGlobal('fetch', fetch);
  const user = userEvent.setup();
  render(<NumerologyPage />);
  await fillDate(user);
  await user.click(screen.getByRole('button', { name: 'Xem kết quả' }));
  expect(screen.getByRole('button', { name: 'Đang tính…' })).toBeDisabled();
  const day = screen.getByRole('spinbutton', { name: 'Ngày', exact: true });
  await user.clear(day); await user.type(day, '16');
  await user.click(screen.getByRole('button', { name: 'Xem kết quả' }));
  expect(await screen.findByRole('status', { name: 'Đường đời', exact: true })).toHaveTextContent('5');
  expect(fetch.mock.calls[0][1].signal.aborted).toBe(true);
  await act(async () => { firstResolve(success(result(4))); });
  expect(screen.getByRole('status', { name: 'Đường đời', exact: true })).toHaveTextContent('5');
  expect(screen.getByText('Theo ngày sinh · 16/6/1990')).toBeVisible();
});

it('rejects an incomplete successful response and aborts requests on unmount', async () => {
  const fetch = vi.fn(async () => success({ ok: true }));
  vi.stubGlobal('fetch', fetch);
  const user = userEvent.setup();
  const view = render(<NumerologyPage />);
  await fillDate(user);
  await user.click(screen.getByRole('button', { name: 'Xem kết quả' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('Phản hồi chưa đầy đủ');
  fetch.mockImplementation(() => new Promise(() => {}));
  await user.click(screen.getByRole('button', { name: 'Thử lại' }));
  await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));
  view.unmount();
  expect(fetch.mock.calls[1][1].signal.aborted).toBe(true);
});


it('submits an explicit target date and retains its result while editing', async () => {
  const body = result(); body.cycles.targetDate = '2027-01-01'; body.cycles.year = 2027; body.pinnacles.asOf = '2027-01-01';
  const fetch = vi.fn(async () => success(body)); vi.stubGlobal('fetch', fetch);
  const user = userEvent.setup(); render(<NumerologyPage />); await fillDate(user);
  const target = screen.getByLabelText(/Ngày xem chu kỳ/);
  await user.type(target, '2027-01-01');
  await user.click(screen.getByRole('button', { name: 'Xem kết quả' }));
  expect(await screen.findByRole('status', { name: 'Năm cá nhân', exact: true })).toHaveTextContent('4');
  expect(JSON.parse(fetch.mock.calls[0][1].body).targetDate).toBe('2027-01-01');
  expect(screen.getByText('01/01/2027')).toBeVisible();
  expect(screen.getByRole('cell', { name: 'Số 1: 2 lần' })).toBeVisible();
  await user.clear(target); await user.type(target, '2028-01-01');
  expect(screen.getByText('01/01/2027')).toBeVisible();
  expect(screen.getByText(/Bạn đang chỉnh sửa thông tin/)).toBeVisible();
});

it('focuses a rejected target date and links its field error', async () => {
  vi.stubGlobal('fetch', vi.fn(async () => ({ ok: false, status: 400, json: async () => ({ error: {
    message: 'Ngày xem không được trước ngày sinh.', fields: [{ path: 'targetDate', message: 'Ngày xem không được trước ngày sinh.' }]
  } }) })));
  const user = userEvent.setup(); render(<NumerologyPage />); await fillDate(user);
  const target = screen.getByLabelText(/Ngày xem chu kỳ/); await user.type(target, '1989-01-01');
  await user.click(screen.getByRole('button', { name: 'Xem kết quả' }));
  await screen.findByRole('alert'); expect(target).toHaveFocus();
  expect(target).toHaveAttribute('aria-invalid', 'true');
  expect(target).toHaveAttribute('aria-describedby', 'num-target-hint num-target-error');
  expect(screen.queryByRole('heading', { name: 'Chu kỳ cá nhân' })).not.toBeInTheDocument();
});

it.each([
  ['missing grid', body => { body.birthGrid = null; }],
  ['invalid layout', body => { body.birthGrid.layout = [[1]]; }],
  ['missing count', body => { delete body.birthGrid.counts[9]; }],
  ['unknown line', body => { body.birthGrid.lines[0].state = 'unknown'; }],
  ['master cycle', body => { body.cycles.personalYear.value = 11; }],
  ['missing cycle', body => { delete body.cycles.personalDay; }],
  ['missing pinnacles', body => { body.pinnacles = null; }],
  ['challenge zero removed', body => { body.pinnacles.periods[0].challenge.value = null; }],
  ['two active periods', body => { body.pinnacles.periods[0].active = true; }],
  ['closed final period', body => { body.pinnacles.periods[3].endDate = '2090-06-14'; }]
])('rejects malformed advanced response: %s', async (_, corrupt) => {
  const body = result(); corrupt(body);
  vi.stubGlobal('fetch', vi.fn(async () => success(body)));
  const user = userEvent.setup(); render(<NumerologyPage />); await fillDate(user);
  await user.click(screen.getByRole('button', { name: 'Xem kết quả' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('Phản hồi chưa đầy đủ');
  expect(screen.queryByRole('heading', { name: 'Biểu đồ ngày sinh' })).not.toBeInTheDocument();
});


function readingResult() {
  const body = result(); body.contentVersion = '1.0.0';
  body.metrics.lifePath.meaningStatus = 'experimental_editorial';
  body.metrics.lifePath.meaning = {
    metricId: 'lifePath', value: 4, kind: 'original_editorial', title: 'Đường đời 4 · Nền tảng', summary: 'Gợi ý nhìn lại một thói quen đang giúp bạn tiến lên.',
    reflectionPrompts: ['Thói quen nào bạn muốn giữ?'], limitations: ['Không quyết định tính cách hoặc tương lai.'],
    reviewStatus: 'editorial_reviewed', expertVerified: false, evidenceStatus: 'community_reference',
    sourceReferences: [{ id: 'community', title: 'Nguồn cộng đồng để tham khảo', url: 'https://github.com/evoluteur/motivational-numerology/blob/c0535c9c9e7bcdc340b7eed255f89f64146dd8d5/i18n/meaning_en.js', evidenceClass: 'community_reference', relationship: 'general_number_theme' }]
  };
  return body;
}

it('expands original reflective reading, questions, source and limits', async () => {
  vi.stubGlobal('fetch', vi.fn(async () => success(readingResult())));
  const user = userEvent.setup(); render(<NumerologyPage />); await fillDate(user);
  await user.click(screen.getByRole('button', { name: 'Xem kết quả' }));
  await screen.findByRole('status', { name: 'Đường đời', exact: true });
  const summary = screen.getByText('Lời luận tham khảo · Đường đời');
  expect(screen.getByText('Gợi ý nhìn lại một thói quen đang giúp bạn tiến lên.')).not.toBeVisible();
  await user.click(summary);
  expect(screen.getByText('Thói quen nào bạn muốn giữ?')).toBeVisible();
  await user.click(screen.getByText('Nguồn và giới hạn của lời luận'));
  const source = screen.getByRole('link', { name: 'Nguồn cộng đồng để tham khảo' });
  expect(source).toHaveAttribute('href', expect.stringContaining('/blob/c0535c9'));
  expect(source).toHaveAttribute('rel', 'noopener noreferrer');
  expect(screen.getByText(/đây không phải lời luận đã được chuyên gia xác minh/)).toBeVisible();
});

it('shows master33 withholding without displaying a root6 substitute', async () => {
  const body = result(33); body.metrics.lifePath.rootValue = 6; body.metrics.lifePath.isMaster = true;
  body.metrics.lifePath.meaningReason = 'source_unavailable';
  vi.stubGlobal('fetch', vi.fn(async () => success(body)));
  const user = userEvent.setup(); render(<NumerologyPage />); await fillDate(user);
  await user.click(screen.getByRole('button', { name: 'Xem kết quả' }));
  expect(await screen.findByText('Chưa có lời luận đủ căn cứ cho số 33.')).toBeVisible();
  expect(screen.queryByText('Lời luận tham khảo · Đường đời')).not.toBeInTheDocument();
});

it.each([
  ['unsafe source', body => { body.metrics.lifePath.meaning.sourceReferences[0].url = 'javascript:alert(1)'; }],
  ['expert flag', body => { body.metrics.lifePath.meaning.expertVerified = true; }],
  ['wrong metric', body => { body.metrics.lifePath.meaning.metricId = 'soulUrge'; }],
  ['wrong number', body => { body.metrics.lifePath.meaning.value = 6; }],
  ['unreviewed status', body => { body.metrics.lifePath.meaning.reviewStatus = 'draft'; }],
  ['missing prompts', body => { body.metrics.lifePath.meaning.reflectionPrompts = []; }],
  ['missing content version', body => { body.contentVersion = null; }],
  ['withheld but nonnull', body => { body.metrics.lifePath.meaningStatus = 'withheld'; }]
])('rejects malformed or ineligible reading: %s', async (_, corrupt) => {
  const body = readingResult(); corrupt(body); vi.stubGlobal('fetch', vi.fn(async () => success(body)));
  const user = userEvent.setup(); render(<NumerologyPage />); await fillDate(user);
  await user.click(screen.getByRole('button', { name: 'Xem kết quả' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('Phản hồi chưa đầy đủ');
  expect(screen.queryByText('Lời luận tham khảo · Đường đời')).not.toBeInTheDocument();
});
