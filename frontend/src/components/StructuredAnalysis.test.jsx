import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import StructuredAnalysis from './StructuredAnalysis';

const birth = { day: 15, month: 6, year: 1990, hour: 8, gender: 1 };

function analysisBody(label = 'first') {
  return {
    ok: true,
    statements: [{
      statementId: 'palace:menh',
      functionId: 'menh',
      availabilityStatus: 'insufficient_evidence',
      runtimeMatchStatus: 'matched',
      formationConditions: 'unknown',
      breakingConditions: 'not_implemented',
      stars: [{ starId: 'tu_vi', displayName: 'Tử Vi', brightness: 'M' }],
      relations: { tamHop: [5, 9], xungChieu: 7 },
      ruleEvidence: [{ ruleId: `rule-${label}` }],
      claimApplicability: [{ claimId: 'c1', eligible: false, reasons: ['formula_not_matched'] }],
      sourceReferences: [],
      contradictoryEvidence: [],
      prose: null
    }],
    time: { capabilities: { tieu_han: { status: 'blocked' } } }
  };
}

describe('StructuredAnalysis', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('shows a palace detail without calling an unapproved claim a reading', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({
      ok: true,
      json: async () => analysisBody()
    })));
    const user = userEvent.setup();
    render(<StructuredAnalysis userInfo={birth} />);
    expect(screen.getByRole('status')).toHaveTextContent('Đang đọc');
    expect(screen.getByRole('combobox', { name: 'Chi năm xem', exact: true })).toBeEnabled();
    const pick = await screen.findByRole('button', { name: /Mệnh: Chưa đủ chứng cứ/ });
    await user.click(pick);
    expect(screen.getByText(/Công thức chưa được duyệt nguồn/)).toBeTruthy();
    expect(screen.getByText(/Tử Vi — độ sáng M/)).toBeTruthy();
    expect(screen.getByText(/rule-first/)).toBeTruthy();
    expect(screen.getByText(/thành cách theo nguồn: unknown/i)).toBeTruthy();
    expect(screen.getByText(/formula_not_matched/)).toBeTruthy();
    expect(screen.getByText(/Chưa gắn nguồn/)).toBeTruthy();
    expect(screen.queryByText(/luận giải đã duyệt/i)).toBeTruthy();
  });

  it('shows an error from a failed response', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({
      ok: false,
      json: async () => ({ error: 'Lá số không hợp lệ' })
    })));
    render(<StructuredAnalysis userInfo={birth} />);
    expect(await screen.findByRole('alert')).toHaveTextContent('Lá số không hợp lệ');
  });

  it('shows an empty catalog when the response has no palaces', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({
      ok: true,
      json: async () => ({ statements: [] })
    })));
    render(<StructuredAnalysis userInfo={birth} />);
    expect(await screen.findByText('Phản hồi không có cung.')).toBeTruthy();
  });

  it('ignores a stale response after the birth hour changes', async () => {
    let resolveFirst;
    const first = new Promise((resolve) => { resolveFirst = resolve; });
    const fetchMock = vi.fn((url, options) => {
      const hour = JSON.parse(options.body).hour;
      if (hour === 8) {
        return first.then(() => ({ ok: true, json: async () => analysisBody('old') }));
      }
      return Promise.resolve({ ok: true, json: async () => analysisBody('new') });
    });
    vi.stubGlobal('fetch', fetchMock);
    const user = userEvent.setup();
    const view = render(<StructuredAnalysis userInfo={birth} />);
    view.rerender(<StructuredAnalysis userInfo={{ ...birth, hour: 9 }} />);
    const pick = await screen.findByRole('button', { name: /Mệnh/ });
    await user.click(pick);
    expect(screen.getByText(/rule-new/)).toBeTruthy();
    resolveFirst();
    await waitFor(() => expect(screen.getByText(/rule-new/)).toBeTruthy());
    expect(screen.queryByText(/rule-old/)).toBeNull();
  });

  it('sends the selected view-year branch and does not call it a prediction', async () => {
    const fetchMock = vi.fn(async () => ({
      ok: true,
      json: async () => ({
        ...analysisBody(),
        time: {
          capabilities: {
            tieu_han: { status: 'blocked' },
            thien_duc: { status: 'branch_placed', branch: 'Dậu', interpretation: null },
            nguyet_duc: { status: 'branch_placed', branch: 'Tí', interpretation: null }
          },
          interpretation: null
        }
      })
    }));
    vi.stubGlobal('fetch', fetchMock);
    const user = userEvent.setup();
    render(<StructuredAnalysis userInfo={birth} />);
    await screen.findByRole('button', { name: /Mệnh/ });
    await user.selectOptions(screen.getByLabelText('Chi năm xem'), 'Tí');
    await waitFor(() => {
      const body = JSON.parse(fetchMock.mock.calls.at(-1)[1].body);
      expect(body.viewYearBranch).toBe('Tí');
    });
    expect(await screen.findByText('Thiên Đức: chi Dậu — chưa xác định cung.')).toBeVisible();
    expect(screen.getByText('Nguyệt Đức: chi Tí — chưa xác định cung.')).toBeVisible();
    expect(screen.queryByText(/dự đoán/i)).toBeNull();
  });

  it('retries the committed input and selected branch, then focuses the evidence heading', async () => {
    const fetch = vi.fn().mockResolvedValueOnce({ ok: true, json: async () => analysisBody() })
      .mockResolvedValueOnce({ ok: false, json: async () => ({ error: 'Lỗi phân tích lá số' }) })
      .mockResolvedValueOnce({ ok: true, json: async () => analysisBody('recovered') });
    vi.stubGlobal('fetch', fetch);
    const user = userEvent.setup();
    render(<StructuredAnalysis userInfo={birth} />);
    await screen.findByRole('button', { name: /Mệnh:/ });
    await user.selectOptions(screen.getByLabelText('Chi năm xem'), 'Tí');
    expect(await screen.findByRole('alert')).toHaveTextContent('Lỗi phân tích lá số');
    expect(screen.getByLabelText('Chi năm xem')).toHaveValue('Tí');
    await user.click(screen.getByRole('button', { name: 'Thử lại chứng cứ' }));
    const pick = await screen.findByRole('button', { name: /Mệnh:/ });
    expect(fetch).toHaveBeenCalledTimes(3);
    expect(JSON.parse(fetch.mock.calls[1][1].body)).toEqual({ ...birth, viewYearBranch: 'Tí' });
    expect(JSON.parse(fetch.mock.calls[2][1].body)).toEqual({ ...birth, viewYearBranch: 'Tí' });
    expect(screen.getByRole('heading', { name: 'Trạng thái chứng cứ' })).toHaveFocus();
    await user.click(pick);
    expect(screen.getByText('rule-recovered')).toBeVisible();
  });

  it('restores retry focus after a repeated network failure', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => { throw new Error('offline'); }));
    const user = userEvent.setup();
    render(<StructuredAnalysis userInfo={birth} />);
    const retry = await screen.findByRole('button', { name: 'Thử lại chứng cứ' });
    await user.click(retry);
    expect(await screen.findByRole('button', { name: 'Thử lại chứng cứ' })).toHaveFocus();
  });

  it('suppresses an old response with the same birth key after a newer attempt succeeds', async () => {
    let finish;
    const fetch = vi.fn().mockImplementationOnce(() => new Promise(resolve => { finish = resolve; }))
      .mockResolvedValueOnce({ ok: false, json: async () => ({ error: 'Tạm thời chưa sẵn sàng' }) })
      .mockResolvedValueOnce({ ok: true, json: async () => analysisBody('new') });
    vi.stubGlobal('fetch', fetch);
    const user = userEvent.setup();
    const view = render(<StructuredAnalysis userInfo={birth} />);
    view.rerender(<StructuredAnalysis userInfo={{ ...birth }} />);
    await user.click(await screen.findByRole('button', { name: 'Thử lại chứng cứ' }));
    await user.click(await screen.findByRole('button', { name: /Mệnh:/ }));
    expect(screen.getByText('rule-new')).toBeVisible();
    expect(fetch.mock.calls[0][1].signal.aborted).toBe(true);
    await act(async () => finish({ ok: true, json: async () => analysisBody('old') }));
    expect(screen.queryByText('rule-old')).not.toBeInTheDocument();
    expect(screen.getByText('rule-new')).toBeVisible();
  });

  it.each([
    ['object statements', body => { body.statements = {}; }],
    ['null statement', body => { body.statements = [null]; }],
    ['object stars', body => { body.statements[0].stars = {}; }],
    ['object star name', body => { body.statements[0].stars[0].displayName = {}; }],
    ['object relations', body => { body.statements[0].relations.xungChieu = {}; }],
    ['object rules', body => { body.statements[0].ruleEvidence = [null]; }],
    ['object claim reasons', body => { body.statements[0].claimApplicability[0].reasons = {}; }],
    ['object claim layer', body => { body.statements[0].claimApplicability[0].layers = { sourceReview: {} }; }],
    ['object source', body => { body.statements[0].sourceReferences = [{ sourceId: {} }]; }],
    ['object contradiction', body => { body.statements[0].contradictoryEvidence = [null]; }],
    ['object time', body => { body.time.capabilities.thien_duc = { status: 'branch_placed', branch: {} }; }],
    ['oversized status', body => { body.statements[0].availabilityStatus = 'x'.repeat(1001); }]
  ])('rejects malformed successful %s with a recoverable bounded error', async (_name, mutate) => {
    const body = analysisBody(); mutate(body);
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: true, json: async () => body })));
    render(<StructuredAnalysis userInfo={birth} />);
    expect(await screen.findByRole('alert')).toHaveTextContent('Phản hồi trạng thái chứng cứ không hợp lệ. Vui lòng thử lại.');
    expect(screen.getByRole('button', { name: 'Thử lại chứng cứ' })).toBeVisible();
    expect(screen.queryByRole('button', { name: /Mệnh:/ })).not.toBeInTheDocument();
  });

  it.each([{}, 'x'.repeat(501)])('uses a constant message for nontext or oversized server errors', async error => {
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: false, json: async () => ({ error }) })));
    render(<StructuredAnalysis userInfo={birth} />);
    expect(await screen.findByRole('alert')).toHaveTextContent('Không đọc được trạng thái chứng cứ');
  });

  it('handles a rejected JSON body and ignores nonconsumed prose fields', async () => {
    const body = analysisBody();
    body.statements[0].prose = 'FORGED PUBLIC PROSE';
    body.statements[0].functionId = 'constructor';
    body.statements[0].availabilityStatus = 'constructor';
    const fetch = vi.fn().mockResolvedValueOnce({ ok: true, json: async () => { throw new SyntaxError('private'); } })
      .mockResolvedValueOnce({ ok: true, json: async () => body });
    vi.stubGlobal('fetch', fetch);
    const user = userEvent.setup();
    render(<StructuredAnalysis userInfo={birth} />);
    expect(await screen.findByRole('alert')).toHaveTextContent('Phản hồi trạng thái chứng cứ không hợp lệ');
    await user.click(screen.getByRole('button', { name: 'Thử lại chứng cứ' }));
    await user.click(await screen.findByRole('button', { name: 'constructor: constructor' }));
    expect(screen.queryByText('FORGED PUBLIC PROSE')).not.toBeInTheDocument();
  });

  it('aborts a pending analysis on unmount and ignores its late rejection', async () => {
    let fail;
    const fetch = vi.fn(() => new Promise((_resolve, reject) => { fail = reject; }));
    vi.stubGlobal('fetch', fetch);
    const view = render(<StructuredAnalysis userInfo={birth} />);
    view.unmount();
    expect(fetch.mock.calls[0][1].signal.aborted).toBe(true);
    await act(async () => fail(new Error('late private error')));
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('shows source-scoped annual branches and palaces, then clears the selected year', async () => {
    vi.stubGlobal('fetch', vi.fn(async (_url, request) => {
      const body = analysisBody();
      const selected = JSON.parse(request.body).viewYearBranch;
      body.time.capabilities.thien_duc = selected ? {
        status: 'branch_placed', branch: 'Dậu', palaceMapping: 'mapped', palaceId: '10', functionId: 'tai_bach'
      } : { status: 'not_applied', reason: 'missing_view_year_branch' };
      body.time.capabilities.nguyet_duc = selected ? {
        status: 'branch_placed', branch: 'Tí', palaceMapping: 'mapped', palaceId: '1', functionId: 'phuc_duc'
      } : { status: 'not_applied', reason: 'missing_view_year_branch' };
      return { ok: true, json: async () => body };
    }));
    const user = userEvent.setup();
    render(<StructuredAnalysis userInfo={birth} />);
    expect(await screen.findByText(/Chọn chi năm xem để xem vị trí/)).toBeVisible();
    expect(screen.getByText(/chưa áp dụng vì chưa có công thức/)).not.toHaveTextContent('Thiên Đức');
    await user.selectOptions(screen.getByLabelText('Chi năm xem'), 'Tí');
    expect(await screen.findByText('Thiên Đức: chi Dậu — cung Tài bạch.')).toBeVisible();
    expect(screen.getByText('Nguyệt Đức: chi Tí — cung Phúc đức.')).toBeVisible();
    expect(screen.getByRole('link', { name: 'Tử Vi Đẩu Số Toàn Thư, quyển 2' })).toHaveAttribute('href', expect.stringContaining('wikisource.org'));
    expect(screen.getByText(/chưa có lời luận vận hạn được duyệt/)).toBeVisible();
    await user.selectOptions(screen.getByLabelText('Chi năm xem'), '');
    expect(await screen.findByText(/Chọn chi năm xem để xem vị trí/)).toBeVisible();
    expect(screen.queryByText('Thiên Đức: chi Dậu — cung Tài bạch.')).not.toBeInTheDocument();
  });

  it('keeps an older branch-only response readable without inventing a palace', async () => {
    const body = analysisBody();
    body.time.capabilities.thien_duc = { status: 'branch_placed', branch: 'Dậu' };
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: true, json: async () => body })));
    const user = userEvent.setup();
    render(<StructuredAnalysis userInfo={birth} />);
    await user.selectOptions(await screen.findByLabelText('Chi năm xem'), 'Tí');
    expect(await screen.findByText('Thiên Đức: chi Dậu — chưa xác định cung.')).toBeVisible();
  });

  it.each([
    { palaceMapping: 'forged' },
    { palaceId: {} },
    { palaceId: 10 },
    { palaceId: '0' },
    { palaceId: '1' },
    { functionId: 'constructor' },
    { functionId: {} },
    { functionId: [] },
    { functionId: ['tai_bach'] },
    { status: 'not_applied' }
  ])('rejects inconsistent annual mapping %j', async patch => {
    const body = analysisBody();
    body.time.capabilities.thien_duc = {
      status: 'branch_placed', branch: 'Dậu', palaceMapping: 'mapped', palaceId: '10', functionId: 'tai_bach', ...patch
    };
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: true, json: async () => body })));
    render(<StructuredAnalysis userInfo={birth} />);
    expect(await screen.findByRole('alert')).toHaveTextContent('Phản hồi trạng thái chứng cứ không hợp lệ');
  });

  it('ignores the late placement for a previously selected year', async () => {
    let finishOldYear;
    const fetch = vi.fn(async (_url, request) => {
      const branch = JSON.parse(request.body).viewYearBranch;
      if (branch === 'Tí') return new Promise(resolve => { finishOldYear = resolve; });
      const body = analysisBody();
      body.time.capabilities.nguyet_duc = { status: 'branch_placed', branch };
      return { ok: true, json: async () => body };
    });
    vi.stubGlobal('fetch', fetch);
    const user = userEvent.setup();
    render(<StructuredAnalysis userInfo={birth} />);
    await user.selectOptions(await screen.findByLabelText('Chi năm xem'), 'Tí');
    await user.selectOptions(screen.getByLabelText('Chi năm xem'), 'Ngọ');
    expect(await screen.findByText('Nguyệt Đức: chi Ngọ — chưa xác định cung.')).toBeVisible();
    const stale = analysisBody();
    stale.time.capabilities.nguyet_duc = { status: 'branch_placed', branch: 'Tí' };
    await act(async () => finishOldYear({ ok: true, json: async () => stale }));
    expect(screen.getByText('Nguyệt Đức: chi Ngọ — chưa xác định cung.')).toBeVisible();
    expect(screen.queryByText('Nguyệt Đức: chi Tí — chưa xác định cung.')).not.toBeInTheDocument();
  });
});
