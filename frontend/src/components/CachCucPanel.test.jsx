import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CachCucPanel from './CachCucPanel';

const birth = { day: 15, month: 6, year: 1990, hour: 8, gender: 1 };
const chart = { lunarInfo: { lunarDay: 23, lunarMonth: 5, lunarYear: 1990 }, tuviInfo: { menh: 1, than: 2, boxes: {
  1: { cungName: 'MỆNH', chiName: 'Tí', majorStars: ['Tử Vi'], goodStars: [], badStars: [] }
} } };
const combination = { _id: 'same-id', name: 'Cách thử', type: 'cat_cach', description: 'Mô tả hiện có.',
  formula_text: 'Điều kiện từ catalog.', summary: 'Mô tả catalog đã có.', tags: ['cat_cach', 'tham khảo'],
  verification_status: 'provisional', disclaimer: 'Không phải kết luận chắc chắn về cuộc đời.' };
const success = combinations => ({ ok: true, json: async () => ({ combinations }) });
afterEach(() => vi.unstubAllGlobals());

it('opens a native disclosure with Enter and closes it with Space, preserving catalog copy', async () => {
  vi.stubGlobal('fetch', vi.fn(async () => success([combination])));
  const user = userEvent.setup();
  render(<CachCucPanel chartData={chart} userInfo={birth} />);
  const toggle = await screen.findByRole('button', { name: 'Cách thử', exact: true });
  expect(toggle).toHaveAttribute('aria-expanded', 'false');
  const detail = document.getElementById(toggle.getAttribute('aria-controls'));
  expect(detail).not.toBeVisible();
  toggle.focus();
  await user.keyboard('{Enter}');
  expect(toggle).toHaveAttribute('aria-expanded', 'true');
  expect(detail).toBeVisible();
  expect(detail).toHaveTextContent(combination.formula_text);
  expect(detail).toHaveTextContent(combination.summary);
  expect(detail).toHaveTextContent(combination.disclaimer);
  expect(detail).toHaveTextContent('#tham khảo');
  expect(screen.getByText('Chưa xác thực — không phải kết luận chắc chắn về cuộc đời.')).toBeVisible();
  await user.keyboard(' ');
  expect(toggle).toHaveAttribute('aria-expanded', 'false');
  expect(detail).not.toBeVisible();
  expect(toggle).toHaveFocus();
});

it('uses distinct controls for duplicate catalog IDs and separate panel instances', async () => {
  vi.stubGlobal('fetch', vi.fn(async () => success([combination, { ...combination, name: 'Cách khác' }])));
  const user = userEvent.setup();
  render(<><CachCucPanel chartData={chart} userInfo={birth} /><CachCucPanel chartData={chart} userInfo={birth} /></>);
  const toggles = await screen.findAllByRole('button', { name: /^Cách (thử|khác)$/ });
  expect(new Set(toggles.map(button => button.getAttribute('aria-controls'))).size).toBe(4);
  await user.click(toggles[0]);
  expect(toggles[0]).toHaveAttribute('aria-expanded', 'true');
  for (const toggle of toggles.slice(1)) expect(toggle).toHaveAttribute('aria-expanded', 'false');
});

it('retries matching with the committed chart payload and keeps the chart available', async () => {
  const fetch = vi.fn().mockResolvedValueOnce({ ok: false, json: async () => ({ error: 'private error' }) }).mockResolvedValueOnce(success([combination]));
  vi.stubGlobal('fetch', fetch);
  const user = userEvent.setup();
  render(<CachCucPanel chartData={chart} userInfo={birth} />);
  expect(await screen.findByRole('alert')).toHaveTextContent('Không tải được cách cục');
  expect(screen.getByRole('alert')).not.toHaveTextContent('private error');
  await user.click(screen.getByRole('button', { name: 'Thử lại cách cục' }));
  await screen.findByRole('button', { name: 'Cách thử', exact: true });
  expect(fetch).toHaveBeenCalledTimes(2);
  const first = JSON.parse(fetch.mock.calls[0][1].body);
  expect(first).toEqual({ boxes: chart.tuviInfo.boxes, menhIndex: 1, menhChi: 'Tí' });
  expect(JSON.parse(fetch.mock.calls[1][1].body)).toEqual(first);
  expect(fetch.mock.calls.every(([url]) => url.endsWith('/api/combinations/match'))).toBe(true);
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /Cách cục/ })).toHaveFocus();
});

it.each([null, {}, { combinations: {} }, { combinations: [null] },
  { combinations: [{ ...combination, type: 'constructor' }] },
  { combinations: [{ ...combination, summary: {} }] },
  { combinations: [{ ...combination, tags: ['safe', {}] }] },
  { combinations: [{ ...combination, disclaimer: {} }] }
])('rejects malformed successful match data without crashing or claiming an empty match: %j', async body => {
  vi.stubGlobal('fetch', vi.fn(async () => ({ ok: true, json: async () => body })));
  render(<CachCucPanel chartData={chart} userInfo={birth} />);
  expect(await screen.findByRole('alert')).toHaveTextContent('Không tải được cách cục');
  expect(screen.getByRole('button', { name: 'Thử lại cách cục' })).toBeVisible();
  expect(screen.queryByText('Không phát hiện cách cục đặc biệt nào trong lá số này.')).not.toBeInTheDocument();
});

it('restores keyboard focus to retry after another failure', async () => {
  vi.stubGlobal('fetch', vi.fn(async () => { throw new Error('offline'); }));
  const user = userEvent.setup();
  render(<CachCucPanel chartData={chart} userInfo={birth} />);
  const retry = await screen.findByRole('button', { name: 'Thử lại cách cục' });
  await user.click(retry);
  expect(await screen.findByRole('button', { name: 'Thử lại cách cục' })).toHaveFocus();
});

it('treats an empty valid match array as an empty result, with no retry error', async () => {
  vi.stubGlobal('fetch', vi.fn(async () => success([])));
  render(<CachCucPanel chartData={chart} userInfo={birth} />);
  expect(await screen.findByText('Không phát hiện cách cục đặc biệt nào trong lá số này.')).toBeVisible();
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
});

it('closes expansion for a changed chart even when the same catalog ID appears again', async () => {
  vi.stubGlobal('fetch', vi.fn(async () => success([combination])));
  const user = userEvent.setup();
  const view = render(<CachCucPanel chartData={chart} userInfo={birth} />);
  const toggle = await screen.findByRole('button', { name: 'Cách thử', exact: true });
  await user.click(toggle);
  expect(toggle).toHaveAttribute('aria-expanded', 'true');
  view.rerender(<CachCucPanel chartData={chart} userInfo={{ ...birth, hour: 10 }} />);
  expect(await screen.findByRole('button', { name: 'Cách thử', exact: true })).toHaveAttribute('aria-expanded', 'false');
});

it.each(['new chart', 'unmount'])('ignores a delayed match after %s and aborts it', async action => {
  let finish;
  const fetch = vi.fn().mockImplementationOnce(() => new Promise(resolve => { finish = resolve; })).mockResolvedValue(success([{ ...combination, name: 'Cách mới' }]));
  vi.stubGlobal('fetch', fetch);
  const view = render(<CachCucPanel chartData={chart} userInfo={birth} />);
  if (action === 'new chart') {
    view.rerender(<CachCucPanel chartData={chart} userInfo={{ ...birth, hour: 10 }} />);
    await screen.findByRole('button', { name: 'Cách mới', exact: true });
  } else view.unmount();
  expect(fetch.mock.calls[0][1].signal.aborted).toBe(true);
  await act(async () => finish(success([combination])));
  expect(screen.queryByRole('button', { name: 'Cách thử', exact: true })).not.toBeInTheDocument();
});

it('keeps category labels and rule-only wording for all three existing types', async () => {
  vi.stubGlobal('fetch', vi.fn(async () => success([
    { ...combination, verification_status: 'matching_ok' },
    { ...combination, name: 'Cách đặc biệt', type: 'dac_biet_cach' },
    { ...combination, name: 'Cách hung', type: 'hung_bai_cach' }
  ])));
  render(<CachCucPanel chartData={chart} userInfo={birth} />);
  await screen.findByRole('button', { name: 'Cách thử', exact: true });
  for (const name of ['Cát Cách', 'Đặc Biệt Cách', 'Hung Bại Cách']) expect(screen.getByRole('heading', { name: new RegExp(name) })).toBeVisible();
  expect(screen.getByText('Chỉ khớp điều kiện sao đã khai báo.')).toBeVisible();
  expect(within(screen.getByText('Tổng:', { exact: false })).getByText('3')).toBeVisible();
});
