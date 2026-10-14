import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach } from 'vitest';
import TuViChart from './TuViChart';

const chart = () => ({ boxes: Object.fromEntries(Array.from({ length: 12 }, (_, index) => [index + 1, {
  cungName: index === 0 ? 'MỆNH' : `Cung ${index + 1}`, majorStars: index === 0 ? ['Tử Vi'] : index === 1 ? ['Thiên Cơ'] : [],
  goodStars: [], badStars: [], fullCanChi: 'Giáp Tý', chiName: 'Tý', daiHan: 22, trangSinh: 'Tràng Sinh', thang: 1
}])) });
const success = body => ({ ok: true, json: async () => body });
const show = info => render(<TuViChart tuviInfo={info || chart()} lunarInfo={null} userInfo={{ hour: 8 }} />);
const star = () => screen.getByRole('button', { name: 'Tử Vi', exact: true });
const palace = () => screen.getByRole('button', { name: /^MỆNH/ });
const nativeShow = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, 'showModal');
const nativeClose = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, 'close');

beforeEach(() => {
  // jsdom lacks native modal methods; browser tests verify containment and Escape.
  Object.defineProperties(HTMLDialogElement.prototype, {
    showModal: { configurable: true, value() { this.setAttribute('open', ''); this.querySelector('button')?.focus(); } },
    close: { configurable: true, value() { this.removeAttribute('open'); } }
  });
});
afterEach(() => {
  cleanup(); vi.unstubAllGlobals(); vi.restoreAllMocks();
  for (const [name, descriptor] of [['showModal', nativeShow], ['close', nativeClose]]) {
    if (descriptor) Object.defineProperty(HTMLDialogElement.prototype, name, descriptor);
    else delete HTMLDialogElement.prototype[name];
  }
});

it('opens loading immediately, cancels on close and cannot reopen from its delayed result', async () => {
  let finish;
  const fetch = vi.fn(() => new Promise(resolve => { finish = resolve; }));
  vi.stubGlobal('fetch', fetch);
  const user = userEvent.setup(); show();
  const origin = star();
  await user.click(origin);
  expect(screen.getByRole('dialog', { name: 'Sao Tử Vi' })).toBeVisible();
  expect(screen.getByRole('status')).toHaveTextContent('Đang tải thông tin');
  await user.click(screen.getByRole('button', { name: 'Đóng thông tin' }));
  expect(fetch.mock.calls[0][1].signal.aborted).toBe(true);
  expect(origin).toHaveFocus();
  await act(async () => { finish(success({ text: 'Old result' })); });
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});

it.each([
  ['star', success({ text: { private: 'do not render' } })],
  ['star', { ok: false, json: async () => ({ error: 'Private Name 1990' }) }],
  ['palace', success({ error: 'do not map' })],
  ['palace', success([{ title: 'Mệnh', desc: {} }])],
  ['palace', { ok: true, json: async () => { throw new SyntaxError('Private JSON'); } }]
])('rejects malformed or failed %s details without crashing the chart', async (kind, response) => {
  vi.stubGlobal('fetch', vi.fn(async () => response));
  const user = userEvent.setup(); show();
  await user.click(kind === 'star' ? star() : palace());
  expect(await screen.findByRole('alert')).toHaveTextContent('Không tải được thông tin. Vui lòng thử lại.');
  expect(document.body.textContent).not.toContain('Private');
  expect(screen.getByRole('button', { name: 'Thiên Cơ' })).toBeInTheDocument();
});

it('retries the same detail and keeps focus on a stable dialog heading', async () => {
  const fetch = vi.fn().mockResolvedValueOnce({ ok: false }).mockResolvedValueOnce(success({ text: 'Existing lookup content' }));
  vi.stubGlobal('fetch', fetch);
  const user = userEvent.setup(); show();
  await user.click(star());
  await screen.findByRole('alert');
  await user.click(screen.getByRole('button', { name: 'Thử lại' }));
  expect(await screen.findByText('Existing lookup content')).toBeVisible();
  expect(fetch.mock.calls[1][0]).toBe(fetch.mock.calls[0][0]);
  expect(screen.getByRole('heading', { name: 'Sao Tử Vi' })).toHaveFocus();
});

it('renders a valid palace list and handles native cancellation with focus restoration', async () => {
  vi.stubGlobal('fetch', vi.fn(async () => success([{ title: 'Mệnh', desc: 'Existing palace content' }])));
  const user = userEvent.setup(); show();
  const origin = palace();
  await user.click(origin);
  await screen.findByText('Existing palace content');
  fireEvent(screen.getByRole('dialog'), new Event('cancel', { cancelable: true }));
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(origin).toHaveFocus();
});

it('ignores an older selection after a new one has completed', async () => {
  let finish;
  const fetch = vi.fn().mockImplementationOnce(() => new Promise(resolve => { finish = resolve; })).mockResolvedValueOnce(success({ text: 'Latest result' }));
  vi.stubGlobal('fetch', fetch);
  const user = userEvent.setup(); show();
  await user.click(star());
  await user.click(screen.getByRole('button', { name: 'Đóng thông tin' }));
  await user.click(screen.getByRole('button', { name: 'Thiên Cơ' }));
  await screen.findByText('Latest result');
  await act(async () => { finish(success({ text: 'Stale result' })); });
  expect(screen.getByRole('dialog', { name: 'Sao Thiên Cơ' })).toBeVisible();
  expect(screen.queryByText('Stale result')).not.toBeInTheDocument();
});

it('aborts and hides details when the committed chart changes or the component unmounts', async () => {
  let finish;
  const fetch = vi.fn(() => new Promise(resolve => { finish = resolve; }));
  vi.stubGlobal('fetch', fetch);
  const user = userEvent.setup();
  const view = show();
  await user.click(star());
  view.rerender(<TuViChart tuviInfo={chart()} lunarInfo={null} userInfo={{ hour: 10 }} />);
  expect(fetch.mock.calls[0][1].signal.aborted).toBe(true);
  await act(async () => { finish(success({ text: 'Earlier chart' })); });
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  await user.click(star());
  view.unmount();
  expect(fetch.mock.calls[1][1].signal.aborted).toBe(true);
  await act(async () => { finish(success({ text: 'After unmount' })); });
});

it.each([['star', { text: '' }], ['palace', []]])('explains empty %s lookup content', async (kind, body) => {
  vi.stubGlobal('fetch', vi.fn(async () => success(body)));
  const user = userEvent.setup(); show();
  await user.click(kind === 'star' ? star() : palace());
  expect(await screen.findByText('Chưa có nội dung tra cứu.')).toBeVisible();
});
