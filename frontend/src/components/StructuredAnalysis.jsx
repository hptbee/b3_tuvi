import React, { useEffect, useRef, useState } from 'react';
import { API_BASE } from '../apiBase';

const PALACE_LABELS = {
  menh: 'Mệnh',
  phu_mau: 'Phụ mẫu',
  phuc_duc: 'Phúc đức',
  dien_trach: 'Điền trạch',
  quan_loc: 'Quan lộc',
  no_boc: 'Nô bộc',
  thien_di: 'Thiên di',
  tat_ach: 'Tật ách',
  tai_bach: 'Tài bạch',
  tu_tuc: 'Tử tức',
  phu_the: 'Phu thê',
  huynh_de: 'Huynh đệ'
};

const AVAILABILITY_LABELS = {
  insufficient_evidence: 'Chưa đủ chứng cứ',
  eligible_claims_present: 'Có claim đủ điều kiện — chưa phải lời luận',
  contradiction: 'Các claim mâu thuẫn',
  missing_palace: 'Thiếu cung'
};

const YEAR_BRANCHES = ['Tí', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tị', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];

const CYCLE_LABELS = {
  tieu_han: 'Tiểu hạn',
  luu_nien: 'Lưu niên',
  luu_tinh: 'Lưu tinh',
  tu_hoa_han: 'Tứ hóa hạn',
  leap_month_fortune: 'Vận hạn tháng nhuận',
  thien_duc: 'Thiên Đức',
  nguyet_duc: 'Nguyệt Đức'
};

const INVALID_ANALYSIS_MESSAGE = 'Phản hồi trạng thái chứng cứ không hợp lệ. Vui lòng thử lại.';
const UNREADABLE_ANALYSIS_MESSAGE = 'Phản hồi trạng thái chứng cứ không hợp lệ';
const DEFAULT_SERVER_ERROR = 'Không đọc được trạng thái chứng cứ';

function labelFrom(map, id, fallback) {
  if (typeof id !== 'string' || id.length === 0) return fallback;
  return Object.hasOwn(map, id) ? map[id] : id;
}

function palaceLabel(statement) {
  if (statement?.thanOverlay) return 'Thân (lớp phủ, không phải cung thứ 13)';
  return labelFrom(PALACE_LABELS, statement?.functionId, statement?.functionId || 'Cung');
}

function birthKey(userInfo) {
  return [userInfo?.year, userInfo?.month, userInfo?.day, userInfo?.hour, userInfo?.gender].join('-');
}

function relationText(relations) {
  if (!relations) return 'Chưa có quan hệ cung.';
  const join = (ids) => (Array.isArray(ids) && ids.length ? ids.join(', ') : 'không có');
  return `Tam hợp: ${join(relations.tamHop)}. Xung chiếu: ${relations.xungChieu ?? 'không có'}.`;
}

function boundedString(value, max) {
  return typeof value === 'string' && value.length > 0 && value.length <= max;
}

function validStringList(value) {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

function validStatement(statement) {
  if (!statement || typeof statement !== 'object') return false;
  if (!boundedString(statement.statementId, 200) || !boundedString(statement.functionId, 200)) return false;
  if (!boundedString(statement.availabilityStatus, 1000)) return false;
  if (statement.stars !== undefined) {
    if (!Array.isArray(statement.stars)) return false;
    if (!statement.stars.every((star) => (
      star
      && typeof star === 'object'
      && (star.displayName === undefined || typeof star.displayName === 'string')
      && (star.starId === undefined || typeof star.starId === 'string')
      && (star.brightness === undefined || typeof star.brightness === 'string')
      && (star.displayName || star.starId)
    ))) return false;
  }
  if (statement.relations !== undefined) {
    const { relations } = statement;
    if (!relations || typeof relations !== 'object') return false;
    if (relations.tamHop !== undefined && !Array.isArray(relations.tamHop)) return false;
    if (relations.xungChieu !== undefined && relations.xungChieu !== null && typeof relations.xungChieu !== 'number') return false;
  }
  if (statement.ruleEvidence !== undefined) {
    if (!Array.isArray(statement.ruleEvidence)) return false;
    if (!statement.ruleEvidence.every((item) => item && typeof item === 'object' && boundedString(item.ruleId, 500))) return false;
  }
  if (statement.claimApplicability !== undefined) {
    if (!Array.isArray(statement.claimApplicability)) return false;
    if (!statement.claimApplicability.every((item) => {
      if (!item || typeof item !== 'object' || !boundedString(item.claimId, 200)) return false;
      if (item.reasons !== undefined && !validStringList(item.reasons)) return false;
      if (item.layers !== undefined) {
        if (!item.layers || typeof item.layers !== 'object') return false;
        if (!Object.values(item.layers).every((layer) => typeof layer === 'string')) return false;
      }
      return true;
    })) return false;
  }
  if (statement.sourceReferences !== undefined) {
    if (!Array.isArray(statement.sourceReferences)) return false;
    if (!statement.sourceReferences.every((item) => (
      item && typeof item === 'object' && (item.sourceId === undefined || typeof item.sourceId === 'string')
    ))) return false;
  }
  if (statement.contradictoryEvidence !== undefined) {
    if (!Array.isArray(statement.contradictoryEvidence)) return false;
    if (!statement.contradictoryEvidence.every((item) => item && typeof item === 'object')) return false;
  }
  return true;
}

function validAnalysisBody(body) {
  if (!body || typeof body !== 'object') return false;
  if (!Array.isArray(body.statements) || !body.statements.every(validStatement)) return false;
  const capabilities = body.time?.capabilities;
  if (capabilities !== undefined) {
    if (!capabilities || typeof capabilities !== 'object') return false;
    if (!Object.values(capabilities).every((value) => {
      if (!value || typeof value !== 'object') return false;
      if (value.branch !== undefined && typeof value.branch !== 'string') return false;
      if (value.status !== undefined && typeof value.status !== 'string') return false;
      return true;
    })) return false;
  }
  return true;
}

function serverErrorMessage(error) {
  if (typeof error !== 'string' || error.length === 0 || error.length > 500) return DEFAULT_SERVER_ERROR;
  return error;
}

function Detail({ statement }) {
  const claims = statement.claimApplicability || [];
  return (
    <div className="evidence-detail">
      <h3>{palaceLabel(statement)}</h3>
      <p>{labelFrom(AVAILABILITY_LABELS, statement.availabilityStatus, statement.availabilityStatus)}</p>
      <p>Nhận diện vị trí sao và khớp rule là việc của engine. Công thức chưa được duyệt nguồn thì không phải luận giải.</p>
      <h4>Sao trong cung</h4>
      {(statement.stars || []).length === 0 && <p>Không có sao trong dữ liệu cung này.</p>}
      <ul>
        {(statement.stars || []).map((star) => (
          <li key={star.starId || star.displayName}>
            {star.displayName || star.starId} — độ sáng {star.brightness || 'chưa ghi'}
          </li>
        ))}
      </ul>
      <h4>Quan hệ</h4>
      <p>{relationText(statement.relations)}</p>
      <h4>Khớp rule lúc chạy</h4>
      <p>Trạng thái runtime: {statement.runtimeMatchStatus || 'không có'}. Thành cách theo nguồn: {statement.formationConditions || 'unknown'}. Phá cách: {statement.breakingConditions || 'not_implemented'}.</p>
      <ul>
        {(statement.ruleEvidence || []).map((item) => (
          <li key={item.ruleId}>{item.ruleId}</li>
        ))}
      </ul>
      {(statement.ruleEvidence || []).length === 0 && <p>Không có rule khớp cung này.</p>}
      <h4>Claim</h4>
      {claims.length === 0 && <p>Không có claim áp vào cung này.</p>}
      <ul>
        {claims.map((item) => (
          <li key={item.claimId}>
            {item.claimId}: {item.eligible ? 'đủ điều kiện nội bộ, lời luận công khai vẫn bị giữ' : `chưa đủ (${(item.reasons || []).join(', ')})`}
            {item.layers ? ` — nguồn ${item.layers.sourceReview}, công thức ${item.layers.formulaComparison}, điều kiện ${item.layers.runtimeConditions}, duyệt luận ${item.layers.interpretationApproval}, phát hành ${item.layers.releasePermission}` : ''}
          </li>
        ))}
      </ul>
      <h4>Nguồn</h4>
      {(statement.sourceReferences || []).length === 0 && <p>Chưa gắn nguồn.</p>}
      <ul>
        {(statement.sourceReferences || []).map((item) => (
          <li key={`${item.claimId}-${item.sourceId}`}>{item.sourceId || 'thiếu sourceId'} {item.section || ''}</li>
        ))}
      </ul>
      {(statement.contradictoryEvidence || []).length > 0 && (
        <>
          <h4>Mâu thuẫn</h4>
          <ul>
            {statement.contradictoryEvidence.map((item) => (
              <li key={`${item.fromClaimId}-${item.toClaimId}`}>{item.fromClaimId} mâu thuẫn {item.toClaimId}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default function StructuredAnalysis({ userInfo }) {
  const key = birthKey(userInfo);
  const [viewYearBranch, setViewYearBranch] = useState('');
  const [attempt, setAttempt] = useState(0);
  const requestKey = `${key}:${viewYearBranch}:${attempt}`;
  const [state, setState] = useState({ key: '', status: 'idle', body: null, error: '' });
  const [selectedId, setSelectedId] = useState(null);
  const sequence = useRef(0);
  const activeKey = useRef('');
  const heading = useRef(null);
  const retryButton = useRef(null);
  const focusAfterRetry = useRef(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  useEffect(() => {
    const nextRequestKey = `${key}:${viewYearBranch}:${attempt}`;
    activeKey.current = nextRequestKey;
    const day = userInfo?.day;
    const month = userInfo?.month;
    const year = userInfo?.year;
    const hour = userInfo?.hour;
    const gender = userInfo?.gender;
    if (![day, month, year, hour, gender].every((value) => Number.isInteger(value))) return undefined;

    const id = ++sequence.current;
    setState((current) => (current.key === nextRequestKey ? current : { key: nextRequestKey, status: 'loading', body: null, error: '' }));

    const controller = new AbortController();
    fetch(`${API_BASE}/api/interpretations/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ day, month, year, hour, gender, viewYearBranch }),
      signal: controller.signal
    })
      .then(async (response) => {
        let body;
        try {
          body = await response.json();
        } catch {
          throw new Error('invalid_json');
        }
        if (!mounted.current || id !== sequence.current || activeKey.current !== nextRequestKey) return;
        if (!response.ok) {
          setState({ key: nextRequestKey, status: 'error', body: null, error: serverErrorMessage(body?.error) });
          return;
        }
        if (!validAnalysisBody(body)) {
          setState({ key: nextRequestKey, status: 'error', body: null, error: INVALID_ANALYSIS_MESSAGE });
          return;
        }
        setState({ key: nextRequestKey, status: 'ready', body, error: '' });
        setSelectedId(null);
      })
      .catch((error) => {
        if (error.name === 'AbortError') return;
        if (!mounted.current || id !== sequence.current || activeKey.current !== nextRequestKey) return;
        if (error.message === 'invalid_json') {
          setState({ key: nextRequestKey, status: 'error', body: null, error: UNREADABLE_ANALYSIS_MESSAGE });
          return;
        }
        setState({ key: nextRequestKey, status: 'error', body: null, error: 'Không kết nối được máy chủ phân tích' });
      });
    return () => controller.abort();
  }, [key, userInfo, viewYearBranch, attempt]);

  useEffect(() => {
    if (focusAfterRetry.current !== requestKey) {
      focusAfterRetry.current = null;
      return;
    }
    if (state.key !== requestKey || (state.status !== 'error' && state.status !== 'ready')) return;
    focusAfterRetry.current = null;
    (state.status === 'error' ? retryButton.current : heading.current)?.focus();
  }, [state, requestKey]);

  const current = state.key === requestKey ? state : { key: requestKey, status: 'loading', body: null, error: '' };
  const loading = current.status === 'idle' || current.status === 'loading';
  const statements = current.status === 'ready' && Array.isArray(current.body?.statements) ? current.body.statements : [];
  const selected = statements.find((item) => item.statementId === selectedId) || null;
  const blocked = Object.entries(current.body?.time?.capabilities || {}).filter(([, value]) => (
    value && (value.status === 'blocked' || value.status === 'not_applied')
  ));

  const retry = () => {
    const nextAttempt = attempt + 1;
    focusAfterRetry.current = `${key}:${viewYearBranch}:${nextAttempt}`;
    setAttempt(nextAttempt);
  };

  const showYearBranch = current.status === 'ready' || current.status === 'error';

  return (
    <section className="evidence-panel" aria-labelledby="evidence-heading">
      <div className="evidence-header">
        <h2 id="evidence-heading" ref={heading} tabIndex={-1}>Trạng thái chứng cứ</h2>
        <p>Không phải luận giải đã duyệt. Không có lời luận và không có điểm cuộc đời.</p>
      </div>
      <div className="evidence-body">
        {loading && <p role="status">Đang đọc trạng thái chứng cứ...</p>}
        {current.status === 'error' && (
          <>
            <p role="alert">{current.error}</p>
            <button type="button" ref={retryButton} onClick={retry}>Thử lại chứng cứ</button>
          </>
        )}
        {showYearBranch && (
          <label className="evidence-note">
            Chi năm xem
            <select aria-label="Chi năm xem" value={viewYearBranch} onChange={(event) => setViewYearBranch(event.target.value)}>
              <option value="">Chưa chọn</option>
              {YEAR_BRANCHES.map((branch) => <option key={branch} value={branch}>{branch}</option>)}
            </select>
          </label>
        )}
        {current.status === 'ready' && statements.length === 0 && <p>Phản hồi không có cung.</p>}
        {current.status === 'ready' && statements.length > 0 && (
          <>
            <div className="evidence-picks" role="list">
              {statements.map((statement) => (
                <button
                  key={statement.statementId}
                  type="button"
                  className={statement.statementId === selectedId ? 'evidence-pick is-selected' : 'evidence-pick'}
                  aria-pressed={statement.statementId === selectedId}
                  onClick={() => setSelectedId(statement.statementId)}
                >
                  {palaceLabel(statement)}: {labelFrom(AVAILABILITY_LABELS, statement.availabilityStatus, statement.availabilityStatus)}
                </button>
              ))}
            </div>
            {selected && <Detail statement={selected} />}
            {blocked.length > 0 && (
              <p className="evidence-note">
                {blocked.map(([id]) => CYCLE_LABELS[id] || id).join(', ')}: chưa áp dụng vì chưa có công thức được duyệt. Số đại hạn trên lá số là nhãn nguyên cục, không phải phép tính vận hạn đã duyệt.
                {['thien_duc', 'nguyet_duc'].filter((id) => current.body?.time?.capabilities?.[id]?.status === 'branch_placed').map((id) => ` ${CYCLE_LABELS[id] || id} tại ${current.body.time.capabilities[id].branch}, chỉ là vị trí chi.`)}
              </p>
            )}
          </>
        )}
      </div>
    </section>
  );
}
