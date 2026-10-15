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

const minorProfile = 'iztro-pinned-age1-sex-triad';
const minorPin = '2f00e2ab0c80b1632e55bc362f2ae26e121245cb';
function minorBody(request, patch = {}) {
  const body = analysisBody();
  const option = request.minorPeriod;
  body.statements[0].palaceId = '5';
  body.time.capabilities.tieu_han_modern = {
    id: 'tieu_han_modern', publicFortune: false, interpretation: null, interpretationStatus: 'blocked',
    profile: option?.profile ?? null, nominalAge: option?.nominalAge ?? null,
    sourceId: 'iztro-modern-software', sourcePin: minorPin,
    ageInput: 'caller_supplied', ageDerivation: 'not_applied',
    calendarCompatibility: 'branch_sex_age_projection_not_full_iztro_astrolabe',
    ...(option ? {
      status: 'branch_placed', branch: 'Thìn', branchPlacement: 'supported',
      palaceMapping: 'mapped', palaceId: '5', functionId: 'menh', functionLabel: 'MỆNH'
    } : {
      status: 'not_applied', reason: 'missing_explicit_profile_and_nominal_age', branch: null,
      branchPlacement: 'not_applied', palaceMapping: 'not_applied', palaceId: null, functionId: null, functionLabel: null
    }), ...patch
  };
  return body;
}
function stubMinorFetch(transform = body => body) {
  const fetch = vi.fn(async (_url, init) => {
    const request = JSON.parse(init.body);
    return { ok: true, json: async () => transform(minorBody(request), request) };
  });
  vi.stubGlobal('fetch', fetch);
  return fetch;
}
async function applyMinorAge(user, age = '1') {
  await user.selectOptions(screen.getByLabelText('Hồ sơ Tiểu hạn'), minorProfile);
  const input = screen.getByLabelText('Tuổi mụ nhập trực tiếp');
  await user.clear(input);
  if (age) await user.type(input, age);
  await user.click(screen.getByRole('button', { name: 'Áp dụng tuổi mụ' }));
}

describe('explicit modern minor placement', () => {
  afterEach(() => vi.unstubAllGlobals());

  it.each(['1', '120'])('only submits an explicitly applied numeric age %s, then clears the profile', async age => {
    const fetch = stubMinorFetch();
    const user = userEvent.setup();
    render(<StructuredAnalysis userInfo={birth} />);
    await screen.findByRole('button', { name: /Mệnh:/ });
    expect(screen.getByLabelText('Hồ sơ Tiểu hạn')).toHaveValue('');
    expect(screen.getByLabelText('Tuổi mụ nhập trực tiếp')).toHaveValue(null);
    expect(JSON.parse(fetch.mock.calls[0][1].body)).not.toHaveProperty('minorPeriod');
    await user.selectOptions(screen.getByLabelText('Hồ sơ Tiểu hạn'), minorProfile);
    await user.type(screen.getByLabelText('Tuổi mụ nhập trực tiếp'), age);
    expect(fetch).toHaveBeenCalledTimes(1);
    await user.click(screen.getByRole('button', { name: 'Áp dụng tuổi mụ' }));
    expect(await screen.findByText(`Tuổi mụ ${age}: chi Thìn — cung Mệnh.`)).toBeVisible();
    expect(JSON.parse(fetch.mock.calls.at(-1)[1].body).minorPeriod).toEqual({ profile: minorProfile, nominalAge: Number(age) });
    expect(screen.getByRole('link', { name: /iztro — mã nguồn Tiểu hạn/ })).toHaveAttribute('href', expect.stringContaining(minorPin));
    await user.selectOptions(screen.getByLabelText('Hồ sơ Tiểu hạn'), '');
    await waitFor(() => expect(JSON.parse(fetch.mock.calls.at(-1)[1].body)).not.toHaveProperty('minorPeriod'));
    expect(screen.queryByText(`Tuổi mụ ${age}: chi Thìn — cung Mệnh.`)).not.toBeInTheDocument();
    expect(screen.getByLabelText('Tuổi mụ nhập trực tiếp')).toHaveValue(null);
  });

  it.each(['', '0', '-1', '121', '1.5'])('rejects draft age %j without losing the existing analysis or sending it', async age => {
    const fetch = stubMinorFetch();
    const user = userEvent.setup();
    render(<StructuredAnalysis userInfo={birth} />);
    await screen.findByRole('button', { name: /Mệnh:/ });
    await applyMinorAge(user, age);
    expect(await screen.findByRole('alert')).toHaveTextContent('số nguyên từ 1 đến 120');
    expect(screen.getByRole('button', { name: /Mệnh:/ })).toBeVisible();
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(screen.getByLabelText('Tuổi mụ nhập trực tiếp')).toHaveAttribute('aria-invalid', 'true');
  });

  it.each([
    { profile: 'another' }, { nominalAge: 2 }, { sourceId: 'forged' }, { sourcePin: 'changed' },
    { ageDerivation: 'automatic' }, { ageInput: 'calculated' }, { calendarCompatibility: 'full_iztro' },
    { publicFortune: true }, { interpretation: 'FORGED PUBLIC PROSE' }, { interpretationStatus: 'approved' },
    { palaceMapping: 'invalid_chart', palaceId: null, functionId: null, functionLabel: null },
    { functionId: 'tai_bach', functionLabel: 'TÀI BẠCH' }, { functionLabel: 'FAKE' },
    { branch: 'Dậu' }, { branchPlacement: 'unknown' }
  ])('withholds forged or unmapped capability %j', async patch => {
    stubMinorFetch((body, request) => {
      if (request.minorPeriod) Object.assign(body.time.capabilities.tieu_han_modern, patch);
      return body;
    });
    const user = userEvent.setup();
    render(<StructuredAnalysis userInfo={birth} />);
    await screen.findByRole('button', { name: /Mệnh:/ });
    await applyMinorAge(user);
    expect(await screen.findByRole('alert')).toHaveTextContent('Phản hồi trạng thái chứng cứ không hợp lệ');
    expect(screen.queryByText('Tuổi mụ 1: chi Thìn — cung Mệnh.')).not.toBeInTheDocument();
    expect(screen.queryByText('FORGED PUBLIC PROSE')).not.toBeInTheDocument();
  });

  it('rejects unexpected placement while omitted and missing capability while enabled', async () => {
    stubMinorFetch((body, request) => {
      if (!request.minorPeriod) return minorBody({ minorPeriod: { profile: minorProfile, nominalAge: 1 } });
      delete body.time.capabilities.tieu_han_modern;
      return body;
    });
    const user = userEvent.setup();
    render(<StructuredAnalysis userInfo={birth} />);
    expect(await screen.findByRole('alert')).toHaveTextContent('Phản hồi trạng thái chứng cứ không hợp lệ');
    await applyMinorAge(user);
    expect(await screen.findByRole('alert')).toHaveTextContent('Phản hồi trạng thái chứng cứ không hợp lệ');
  });

  it('preserves the chart when accepted-profile evidence is unavailable', async () => {
    stubMinorFetch((body, request) => {
      if (request.minorPeriod) Object.assign(body.time.capabilities.tieu_han_modern, {
        status: 'blocked', reason: 'modern_profile_not_approved', branch: null,
        branchPlacement: 'not_applied', palaceMapping: 'not_applied', palaceId: null, functionId: null, functionLabel: null
      });
      return body;
    });
    const user = userEvent.setup();
    render(<StructuredAnalysis userInfo={birth} />);
    await applyMinorAge(user);
    expect(await screen.findByText(/Chưa thể đối chiếu vị trí theo hồ sơ này/)).toBeVisible();
    expect(screen.getByRole('button', { name: /Mệnh:/ })).toBeVisible();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('hides an unapplied edit and immediately clears supplied age on birth changes', async () => {
    const fetch = stubMinorFetch();
    const user = userEvent.setup();
    const view = render(<StructuredAnalysis userInfo={birth} />);
    await applyMinorAge(user);
    expect(await screen.findByText('Tuổi mụ 1: chi Thìn — cung Mệnh.')).toBeVisible();
    await user.clear(screen.getByLabelText('Tuổi mụ nhập trực tiếp'));
    await user.type(screen.getByLabelText('Tuổi mụ nhập trực tiếp'), '2');
    expect(screen.queryByText('Tuổi mụ 1: chi Thìn — cung Mệnh.')).not.toBeInTheDocument();
    expect(screen.getByText(/Chưa áp dụng thay đổi/)).toBeVisible();
    expect(fetch).toHaveBeenCalledTimes(2);
    view.rerender(<StructuredAnalysis userInfo={{ ...birth, gender: -1 }} />);
    expect(screen.getByLabelText('Hồ sơ Tiểu hạn')).toHaveValue('');
    expect(screen.getByLabelText('Tuổi mụ nhập trực tiếp')).toHaveValue(null);
    await waitFor(() => expect(JSON.parse(fetch.mock.calls.at(-1)[1].body)).not.toHaveProperty('minorPeriod'));
    view.rerender(<StructuredAnalysis userInfo={birth} />);
    expect(screen.getByLabelText('Hồ sơ Tiểu hạn')).toHaveValue('');
    expect(screen.getByLabelText('Tuổi mụ nhập trực tiếp')).toHaveValue(null);
    await screen.findByRole('button', { name: /Mệnh:/ });
  });

  it('ignores delayed age responses after newer age, annual change and clear', async () => {
    let finishOld;
    const fetch = vi.fn(async (_url, init) => {
      const request = JSON.parse(init.body);
      if (request.minorPeriod?.nominalAge === 1) return new Promise(resolve => { finishOld = resolve; });
      return { ok: true, json: async () => minorBody(request) };
    });
    vi.stubGlobal('fetch', fetch);
    const user = userEvent.setup();
    render(<StructuredAnalysis userInfo={birth} />);
    await applyMinorAge(user);
    await applyMinorAge(user, '2');
    expect(await screen.findByText('Tuổi mụ 2: chi Thìn — cung Mệnh.')).toBeVisible();
    await user.selectOptions(screen.getByLabelText('Chi năm xem'), 'Ngọ');
    expect(await screen.findByText('Tuổi mụ 2: chi Thìn — cung Mệnh.')).toBeVisible();
    expect(JSON.parse(fetch.mock.calls.at(-1)[1].body)).toMatchObject({ viewYearBranch: 'Ngọ', minorPeriod: { nominalAge: 2 } });
    await act(async () => finishOld({ ok: true, json: async () => minorBody({ minorPeriod: { profile: minorProfile, nominalAge: 1 } }) }));
    expect(screen.queryByText('Tuổi mụ 1: chi Thìn — cung Mệnh.')).not.toBeInTheDocument();
    await user.selectOptions(screen.getByLabelText('Hồ sơ Tiểu hạn'), '');
    expect(screen.queryByText('Tuổi mụ 2: chi Thìn — cung Mệnh.')).not.toBeInTheDocument();
    expect(fetch.mock.calls[1][1].signal.aborted).toBe(true);
  });

  it('retries committed input, ignores an invalid draft, then aborts on unmount', async () => {
    let rejectLate;
    const fetch = stubMinorFetch();
    const user = userEvent.setup();
    const view = render(<StructuredAnalysis userInfo={birth} />);
    await applyMinorAge(user);
    await screen.findByText('Tuổi mụ 1: chi Thìn — cung Mệnh.');
    fetch.mockResolvedValueOnce({ ok: false, json: async () => ({ error: 'Tạm lỗi' }) });
    await user.selectOptions(screen.getByLabelText('Chi năm xem'), 'Tí');
    await screen.findByRole('alert');
    await user.clear(screen.getByLabelText('Tuổi mụ nhập trực tiếp'));
    await user.type(screen.getByLabelText('Tuổi mụ nhập trực tiếp'), '121');
    fetch.mockImplementationOnce(() => new Promise((_resolve, reject) => { rejectLate = reject; }));
    await user.click(screen.getByRole('button', { name: 'Thử lại chứng cứ' }));
    expect(JSON.parse(fetch.mock.calls.at(-1)[1].body)).toMatchObject({ viewYearBranch: 'Tí', minorPeriod: { profile: minorProfile, nominalAge: 1 } });
    view.unmount();
    expect(fetch.mock.calls.at(-1)[1].signal.aborted).toBe(true);
    await act(async () => rejectLate(new Error('private late error')));
  });
});

const majorProfile = 'iztro-pinned-menh-cuc-decadal';
function majorBody(request, patch = {}) {
  const body = minorBody(request);
  const option = request.majorPeriod;
  const age = option?.nominalAge;
  body.time.capabilities.dai_han_modern = {
    id: 'dai_han_modern', profile: option?.profile ?? null, nominalAge: age ?? null,
    sourceId: 'iztro-modern-software', sourcePin: minorPin,
    calendarCompatibility: 'server_natal_menh_cuc_branch_sex_age_projection_not_full_iztro_astrolabe',
    ageInput: 'caller_supplied', ageDerivation: 'not_applied', publicFortune: false,
    interpretation: null, interpretationStatus: 'blocked',
    branch: null, branchPlacement: 'not_applied', palaceMapping: 'not_applied',
    palaceId: null, functionId: null, functionLabel: null,
    decadeIndex: null, decadeStartAge: null, decadeEndAge: null,
    status: 'not_applied', reason: option ? 'before_first_period' : 'missing_explicit_profile_and_nominal_age',
    ...(option && age >= 6 ? { status: 'branch_placed', reason: null, branch: 'Thìn', branchPlacement: 'supported',
      palaceMapping: 'mapped', palaceId: '5', functionId: 'menh', functionLabel: 'MỆNH',
      decadeIndex: age === 125 ? 11 : age >= 16 ? 1 : 0,
      decadeStartAge: age === 125 ? 116 : age >= 16 ? 16 : 6,
      decadeEndAge: age === 125 ? 125 : age >= 16 ? 25 : 15 } : {}), ...patch
  };
  return body;
}
function stubMajorFetch(transform = body => body) {
  const fetch = vi.fn(async (_url, init) => {
    const request = JSON.parse(init.body);
    return { ok: true, json: async () => transform(majorBody(request), request) };
  });
  vi.stubGlobal('fetch', fetch);
  return fetch;
}
async function applyMajorAge(user, age = '6') {
  await user.selectOptions(screen.getByLabelText('Hồ sơ Đại hạn'), majorProfile);
  const input = screen.getByLabelText('Tuổi mụ cho Đại hạn');
  await user.clear(input);
  if (age) await user.type(input, age);
  await user.click(screen.getByRole('button', { name: 'Áp dụng tuổi mụ Đại hạn' }));
}

describe('explicit modern major placement', () => {
  afterEach(() => vi.unstubAllGlobals());
  it.each(['6', '125'])('submits explicit age %s and clears the profile', async age => {
    const fetch = stubMajorFetch(); const user = userEvent.setup();
    render(<StructuredAnalysis userInfo={birth} />);
    await screen.findByRole('button', { name: /Mệnh:/ });
    expect(JSON.parse(fetch.mock.calls[0][1].body)).not.toHaveProperty('majorPeriod');
    await applyMajorAge(user, age);
    expect(await screen.findByText(new RegExp(`Đại hạn tuổi mụ ${age}: chi Thìn`))).toBeVisible();
    expect(JSON.parse(fetch.mock.calls.at(-1)[1].body).majorPeriod).toEqual({ profile: majorProfile, nominalAge: Number(age) });
    await user.selectOptions(screen.getByLabelText('Hồ sơ Đại hạn'), '');
    await screen.findByText('Chọn hồ sơ và nhập tuổi mụ để đối chiếu vị trí Đại hạn.');
    expect(screen.getByLabelText('Tuổi mụ cho Đại hạn')).toHaveValue(null);
    expect(screen.queryByText(new RegExp(`Đại hạn tuổi mụ ${age}:`))).not.toBeInTheDocument();
    await waitFor(() => expect(JSON.parse(fetch.mock.calls.at(-1)[1].body)).not.toHaveProperty('majorPeriod'));
  });
  it.each(['', '0', '-1', '126', '1.5'])('rejects invalid draft %j without sending it', async age => {
    const fetch = stubMajorFetch(); const user = userEvent.setup();
    render(<StructuredAnalysis userInfo={birth} />); await screen.findByRole('button', { name: /Mệnh:/ });
    await applyMajorAge(user); await screen.findByText(/Đại hạn tuổi mụ 6:/);
    const count = fetch.mock.calls.length;
    const input = screen.getByLabelText('Tuổi mụ cho Đại hạn'); await user.clear(input); if (age) await user.type(input, age);
    expect(screen.queryByText(/Đại hạn tuổi mụ 6:/)).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Áp dụng tuổi mụ Đại hạn' }));
    expect(screen.getByRole('alert')).toHaveTextContent('số nguyên từ 1 đến 125');
    expect(fetch).toHaveBeenCalledTimes(count);
  });
  it('shows before-first and after-last nonplacements distinctly', async () => {
    stubMajorFetch((body, request) => {
      if (request.majorPeriod?.nominalAge === 125) body.time.capabilities.dai_han_modern = {
        ...majorBody({ majorPeriod: { profile: majorProfile, nominalAge: 1 } }).time.capabilities.dai_han_modern,
        nominalAge: 125, reason: 'after_last_period' };
      return body;
    });
    const user = userEvent.setup(); render(<StructuredAnalysis userInfo={birth} />);
    await screen.findByRole('button', { name: /Mệnh:/ }); await applyMajorAge(user, '1');
    expect(await screen.findByText(/Tuổi mụ 1 chưa đến khoảng Đại hạn đầu tiên/)).toBeVisible();
    await applyMajorAge(user, '125');
    expect(await screen.findByText(/Tuổi mụ 125 vượt khoảng Đại hạn cuối cùng/)).toBeVisible();
    expect(screen.queryByText(/Đại hạn tuổi mụ 125: chi/)).not.toBeInTheDocument();
  });
  it.each([
    { profile: 'classical' }, { nominalAge: 7 }, { sourceId: 'forged' }, { sourcePin: 'changed' },
    { calendarCompatibility: 'whole_iztro' }, { ageDerivation: 'calendar' }, { ageInput: 'inferred' },
    { publicFortune: true }, { interpretation: 'prediction' }, { interpretationStatus: 'released' },
    { reason: 'invented' }, { palaceId: '6' }, { functionId: 'tai_bach' }, { functionLabel: 'UNKNOWN' },
    { decadeIndex: 12 }, { decadeIndex: -1 }, { decadeStartAge: 7 }, { decadeEndAge: 16 },
    { decadeIndex: 0.5 }, { decadeStartAge: null }, { decadeEndAge: '15' },
    { status: 'not_applied', reason: 'before_first_period' }, { status: 'not_applied', reason: 'after_last_period' }
  ])('rejects forged response %j', async patch => {
    stubMajorFetch((body, request) => { if (request.majorPeriod) Object.assign(body.time.capabilities.dai_han_modern, patch); return body; });
    const user = userEvent.setup(); render(<StructuredAnalysis userInfo={birth} />);
    await screen.findByRole('button', { name: /Mệnh:/ }); await applyMajorAge(user);
    expect(await screen.findByRole('alert')).toHaveTextContent('Phản hồi trạng thái chứng cứ không hợp lệ');
    expect(screen.queryByText(/Đại hạn tuổi mụ 6: chi/)).not.toBeInTheDocument();
  });
  it.each([['modern_profile_not_approved', 'not_applied'], ['invalid_chart', 'invalid_chart']])('accepts blocked reason %s with empty placement', async (reason, palaceMapping) => {
    stubMajorFetch((body, request) => {
      if (request.majorPeriod) body.time.capabilities.dai_han_modern = {
        ...majorBody({ majorPeriod: { profile: majorProfile, nominalAge: 1 } }).time.capabilities.dai_han_modern,
        nominalAge: 6, status: 'blocked', reason, palaceMapping };
      return body;
    });
    const user = userEvent.setup(); render(<StructuredAnalysis userInfo={birth} />);
    await screen.findByRole('button', { name: /Mệnh:/ }); await applyMajorAge(user);
    await screen.findByRole('button', { name: /Mệnh:/ });
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.queryByText(/Đại hạn tuổi mụ 6: chi/)).not.toBeInTheDocument();
  });
  it('rejects a missing capability on an explicit request', async () => {
    stubMajorFetch((body, request) => { if (request.majorPeriod) delete body.time.capabilities.dai_han_modern; return body; });
    const user = userEvent.setup(); render(<StructuredAnalysis userInfo={birth} />);
    await screen.findByRole('button', { name: /Mệnh:/ }); await applyMajorAge(user);
    expect(await screen.findByRole('alert')).toHaveTextContent('Phản hồi trạng thái chứng cứ không hợp lệ');
  });
  it('keeps both periods and year independent and rejects an old major response', async () => {
    let finishOld;
    const fetch = vi.fn(async (_url, init) => { const request = JSON.parse(init.body);
      if (request.majorPeriod?.nominalAge === 6) return new Promise(resolve => { finishOld = resolve; });
      return { ok: true, json: async () => majorBody(request) }; });
    vi.stubGlobal('fetch', fetch); const user = userEvent.setup(); render(<StructuredAnalysis userInfo={birth} />);
    await screen.findByRole('button', { name: /Mệnh:/ }); await applyMinorAge(user, '2');
    await screen.findByText('Tuổi mụ 2: chi Thìn — cung Mệnh.');
    await applyMajorAge(user, '6'); await applyMajorAge(user, '16'); await screen.findByText(/Đại hạn tuổi mụ 16:/);
    await user.selectOptions(screen.getByLabelText('Chi năm xem'), 'Ngọ'); await screen.findByText(/Đại hạn tuổi mụ 16:/);
    expect(JSON.parse(fetch.mock.calls.at(-1)[1].body)).toMatchObject({ viewYearBranch: 'Ngọ', minorPeriod: { nominalAge: 2 }, majorPeriod: { nominalAge: 16 } });
    await act(async () => finishOld({ ok: true, json: async () => majorBody({ majorPeriod: { profile: majorProfile, nominalAge: 6 } }) }));
    expect(screen.getByText(/Đại hạn tuổi mụ 16:/)).toBeVisible(); expect(screen.queryByText(/Đại hạn tuổi mụ 6:/)).not.toBeInTheDocument();
  });
  it('clears both period options on birth change and navigation back', async () => {
    const fetch = stubMajorFetch(); const user = userEvent.setup();
    const { rerender } = render(<StructuredAnalysis userInfo={birth} />); await screen.findByRole('button', { name: /Mệnh:/ });
    await applyMinorAge(user); await screen.findByText('Tuổi mụ 1: chi Thìn — cung Mệnh.');
    await applyMajorAge(user); await screen.findByText(/Đại hạn tuổi mụ 6:/);
    rerender(<StructuredAnalysis userInfo={{ ...birth, gender: -1 }} />); await screen.findByRole('button', { name: /Mệnh:/ });
    rerender(<StructuredAnalysis userInfo={birth} />); await screen.findByRole('button', { name: /Mệnh:/ });
    for (const label of ['Hồ sơ Đại hạn', 'Hồ sơ Tiểu hạn']) expect(screen.getByLabelText(label)).toHaveValue('');
    for (const label of ['Tuổi mụ cho Đại hạn', 'Tuổi mụ nhập trực tiếp']) expect(screen.getByLabelText(label)).toHaveValue(null);
    const request = JSON.parse(fetch.mock.calls.at(-1)[1].body); expect(request).not.toHaveProperty('minorPeriod'); expect(request).not.toHaveProperty('majorPeriod');
  });
  it('retries the committed major option and restores heading focus', async () => {
    let failed = false;
    const fetch = stubMajorFetch((body, request) => { if (request.majorPeriod && !failed) { failed = true; body.time.capabilities.dai_han_modern.sourcePin = 'forged'; } return body; });
    const user = userEvent.setup(); render(<StructuredAnalysis userInfo={birth} />); await screen.findByRole('button', { name: /Mệnh:/ });
    await applyMajorAge(user); await screen.findByRole('alert'); await user.click(screen.getByRole('button', { name: 'Thử lại chứng cứ' }));
    await screen.findByText(/Đại hạn tuổi mụ 6:/); expect(JSON.parse(fetch.mock.calls.at(-1)[1].body).majorPeriod).toEqual({ profile: majorProfile, nominalAge: 6 });
    await waitFor(() => expect(screen.getByRole('heading', { name: 'Trạng thái chứng cứ' })).toHaveFocus());
  });
});
