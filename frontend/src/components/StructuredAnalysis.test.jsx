import { render, screen, waitFor } from '@testing-library/react';
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
    expect(await screen.findByText(/Thiên Đức tại Dậu, chỉ là vị trí chi/)).toBeTruthy();
    expect(screen.getByText(/Nguyệt Đức tại Tí, chỉ là vị trí chi/)).toBeTruthy();
    expect(screen.queryByText(/dự đoán/i)).toBeNull();
  });
});
