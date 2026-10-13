import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NumerologyPage from './NumerologyPage';

function result(value = 4, normalized = null) {
  const available = number => ({ status: 'available', value: number, rootValue: number, isMaster: false, keepMasters: true,
    parts: [{ label: 'day', values: [1, 5], total: 6 }], steps: [] });
  return { ok: true, referenceDate: '2026-10-13', profile: { id: 'pythagorean-vn-v1', version: '1.0.0' },
    nameAnalysis: normalized ? { normalized, letters: [{ letter: 'A', value: 1 }] } : null,
    metrics: {
      lifePath: available(value), birthday: available(6), attitude: available(3),
      expression: { status: 'unavailable', value: null, reason: 'missing_name' },
      soulUrge: { status: 'unavailable', value: null, reason: 'missing_name' },
      personality: { status: 'unavailable', value: null, reason: 'missing_name' },
      maturity: { status: 'unavailable', value: null, reason: 'missing_name' }
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
