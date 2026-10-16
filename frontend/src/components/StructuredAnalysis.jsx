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
const ANNUAL_STARS = ['thien_duc', 'nguyet_duc'];
const MINOR_PROFILE = 'iztro-pinned-age1-sex-triad';
const MINOR_SOURCE = 'iztro-modern-software';
const MINOR_PIN = '2f00e2ab0c80b1632e55bc362f2ae26e121245cb';
const MINOR_COMPATIBILITY = 'branch_sex_age_projection_not_full_iztro_astrolabe';
const MAJOR_PROFILE = 'iztro-pinned-menh-cuc-decadal';
const MAJOR_COMPATIBILITY = 'server_natal_menh_cuc_branch_sex_age_projection_not_full_iztro_astrolabe';
const EMPTY_MINOR_DRAFT = { profile: '', age: '' };

function minorSignature(option) {
  return option ? `${option.profile}:${option.nominalAge}` : 'omitted';
}

function validMinorResponse(body, option) {
  const cap = body.time?.capabilities?.tieu_han_modern;
  if (cap === undefined) return option === null;
  if (!cap || typeof cap !== 'object' || cap.id !== 'tieu_han_modern'
    || cap.publicFortune !== false || cap.interpretation !== null || cap.interpretationStatus !== 'blocked') return false;
  const emptyPlacement = cap.branch === null && cap.palaceId === null
    && cap.functionId === null && cap.functionLabel === null;
  if (!option) return cap.status === 'not_applied'
    && cap.reason === 'missing_explicit_profile_and_nominal_age'
    && cap.profile === null && cap.nominalAge === null
    && cap.palaceMapping === 'not_applied' && cap.branchPlacement === 'not_applied' && emptyPlacement;
  if (cap.profile !== option.profile || cap.nominalAge !== option.nominalAge
    || cap.sourceId !== MINOR_SOURCE || cap.sourcePin !== MINOR_PIN
    || cap.ageInput !== 'caller_supplied' || cap.ageDerivation !== 'not_applied'
    || cap.calendarCompatibility !== MINOR_COMPATIBILITY) return false;
  if (cap.status === 'blocked') return ['modern_profile_not_approved', 'invalid_chart'].includes(cap.reason)
    && cap.palaceMapping === 'not_applied' && emptyPlacement;
  if (cap.status !== 'branch_placed' || cap.branchPlacement !== 'supported' || cap.palaceMapping !== 'mapped'
    || !YEAR_BRANCHES.includes(cap.branch) || cap.palaceId !== String(YEAR_BRANCHES.indexOf(cap.branch) + 1)
    || !Object.hasOwn(PALACE_LABELS, cap.functionId)
    || cap.functionLabel !== PALACE_LABELS[cap.functionId].toLocaleUpperCase('vi')) return false;
  return body.statements.filter(statement => !statement.thanOverlay
    && statement.palaceId === cap.palaceId && statement.functionId === cap.functionId).length === 1;
}

function validMajorResponse(body, option) {
  const cap = body.time?.capabilities?.dai_han_modern;
  if (cap === undefined) return option === null;
  if (!cap || typeof cap !== 'object' || cap.id !== 'dai_han_modern'
    || cap.publicFortune !== false || cap.interpretation !== null || cap.interpretationStatus !== 'blocked'
    || cap.sourceId !== MINOR_SOURCE || cap.sourcePin !== MINOR_PIN
    || cap.ageInput !== 'caller_supplied' || cap.ageDerivation !== 'not_applied'
    || cap.calendarCompatibility !== MAJOR_COMPATIBILITY) return false;
  const emptyPlacement = cap.branch === null && cap.palaceId === null
    && cap.functionId === null && cap.functionLabel === null
    && cap.decadeIndex === null && cap.decadeStartAge === null && cap.decadeEndAge === null;
  const closed = emptyPlacement && cap.branchPlacement === 'not_applied';
  if (!option) return cap.status === 'not_applied'
    && cap.reason === 'missing_explicit_profile_and_nominal_age'
    && cap.profile === null && cap.nominalAge === null && cap.palaceMapping === 'not_applied' && closed;
  if (cap.profile !== option.profile || cap.nominalAge !== option.nominalAge) return false;
  if (cap.status === 'blocked') return closed && (
    (cap.reason === 'modern_profile_not_approved' && cap.palaceMapping === 'not_applied')
    || (cap.reason === 'invalid_chart' && cap.palaceMapping === 'invalid_chart'));
  if (cap.status === 'not_applied') return closed && cap.palaceMapping === 'not_applied'
    && ((cap.reason === 'before_first_period' && option.nominalAge < 6)
      || (cap.reason === 'after_last_period' && option.nominalAge > 121));
  if (cap.status !== 'branch_placed' || cap.reason !== null
    || cap.branchPlacement !== 'supported' || cap.palaceMapping !== 'mapped'
    || !YEAR_BRANCHES.includes(cap.branch) || cap.palaceId !== String(YEAR_BRANCHES.indexOf(cap.branch) + 1)
    || !Object.hasOwn(PALACE_LABELS, cap.functionId)
    || cap.functionLabel !== PALACE_LABELS[cap.functionId].toLocaleUpperCase('vi')
    || !Number.isInteger(cap.decadeIndex) || cap.decadeIndex < 0 || cap.decadeIndex > 11
    || !Number.isInteger(cap.decadeStartAge) || !Number.isInteger(cap.decadeEndAge)
    || cap.decadeEndAge !== cap.decadeStartAge + 9
    || cap.decadeStartAge - 10 * cap.decadeIndex < 2 || cap.decadeStartAge - 10 * cap.decadeIndex > 6
    || option.nominalAge < cap.decadeStartAge || option.nominalAge > cap.decadeEndAge) return false;
  return body.statements.filter(statement => !statement.thanOverlay
    && statement.palaceId === cap.palaceId && statement.functionId === cap.functionId).length === 1;
}

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
      && (star.brightness === undefined || star.brightness === null || typeof star.brightness === 'string')
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
      if (value.branch !== undefined && value.branch !== null && typeof value.branch !== 'string') return false;
      if (value.status !== undefined && typeof value.status !== 'string') return false;
      if (value.palaceMapping !== undefined) {
        if (!['mapped', 'invalid_chart', 'not_applied'].includes(value.palaceMapping)) return false;
        if (value.palaceMapping === 'mapped' && (
          value.status !== 'branch_placed'
          || typeof value.palaceId !== 'string'
          || !/^(?:[1-9]|1[0-2])$/.test(value.palaceId)
          || YEAR_BRANCHES[Number(value.palaceId) - 1] !== value.branch
          || typeof value.functionId !== 'string'
          || !Object.hasOwn(PALACE_LABELS, value.functionId)
        )) return false;
      }
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
  const [minorDraftState, setMinorDraftState] = useState(null);
  const [minorCommittedState, setMinorCommittedState] = useState(null);
  const [minorError, setMinorError] = useState('');
  const [majorDraftState, setMajorDraftState] = useState(null);
  const [majorCommittedState, setMajorCommittedState] = useState(null);
  const [majorError, setMajorError] = useState('');
  const [minorBirthKey, setMinorBirthKey] = useState(key);
  // Supplied age belongs to one birth input, including when navigating back.
  if (minorBirthKey !== key) {
    setMinorBirthKey(key);
    setMinorDraftState(null);
    setMinorCommittedState(null);
    setMinorError('');
    setMajorDraftState(null);
    setMajorCommittedState(null);
    setMajorError('');
  }
  const minorDraft = minorDraftState?.key === key ? minorDraftState : EMPTY_MINOR_DRAFT;
  const minorOption = minorCommittedState?.key === key ? minorCommittedState.option : null;
  const minorKey = minorSignature(minorOption);
  const minorDirty = minorDraft.profile !== (minorOption?.profile || '')
    || minorDraft.age !== (minorOption ? String(minorOption.nominalAge) : '');
  const majorDraft = majorDraftState?.key === key ? majorDraftState : EMPTY_MINOR_DRAFT;
  const majorOption = majorCommittedState?.key === key ? majorCommittedState.option : null;
  const majorKey = minorSignature(majorOption);
  const majorDirty = majorDraft.profile !== (majorOption?.profile || '')
    || majorDraft.age !== (majorOption ? String(majorOption.nominalAge) : '');
  const requestKey = `${key}:${viewYearBranch}:${minorKey}:${majorKey}:${attempt}`;
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
    const nextRequestKey = `${key}:${viewYearBranch}:${minorKey}:${majorKey}:${attempt}`;
    activeKey.current = nextRequestKey;
    const day = userInfo?.day;
    const month = userInfo?.month;
    const year = userInfo?.year;
    const hour = userInfo?.hour;
    const gender = userInfo?.gender;
    if (![day, month, year, hour, gender].every((value) => Number.isInteger(value))) return undefined;

    const id = ++sequence.current;

    const controller = new AbortController();
    fetch(`${API_BASE}/api/interpretations/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ day, month, year, hour, gender, viewYearBranch, ...(minorOption ? { minorPeriod: minorOption } : {}),
        ...(majorOption ? { majorPeriod: majorOption } : {}) }),
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
        if (!validAnalysisBody(body) || !validMinorResponse(body, minorOption) || !validMajorResponse(body, majorOption)) {
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
  }, [key, userInfo, viewYearBranch, minorKey, minorOption, majorKey, majorOption, attempt]);

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
  )).filter(([id]) => !ANNUAL_STARS.includes(id) && id !== 'tieu_han_modern' && id !== 'dai_han_modern');

  const retry = () => {
    const nextAttempt = attempt + 1;
    focusAfterRetry.current = `${key}:${viewYearBranch}:${minorKey}:${majorKey}:${nextAttempt}`;
    setAttempt(nextAttempt);
  };

  const changeMinorDraft = (patch) => {
    setMinorError('');
    setMinorDraftState({ ...minorDraft, ...patch, key });
    if (patch.profile === '') {
      setMinorDraftState({ key, profile: '', age: '' });
      setMinorCommittedState(null);
    }
  };
  const applyMinor = (event) => {
    event.preventDefault();
    const age = Number(minorDraft.age);
    if (minorDraft.profile !== MINOR_PROFILE || minorDraft.age.trim() === ''
      || !Number.isInteger(age) || age < 1 || age > 120) {
      setMinorDraftState({ ...minorDraft, key });
      setMinorError('Chọn hồ sơ và nhập tuổi mụ là số nguyên từ 1 đến 120.');
      return;
    }
    setMinorError('');
    setMinorDraftState({ key, profile: MINOR_PROFILE, age: String(age) });
    setMinorCommittedState({ key, option: { profile: MINOR_PROFILE, nominalAge: age } });
  };
  const changeMajorDraft = (patch) => {
    setMajorError('');
    setMajorDraftState({ ...majorDraft, ...patch, key });
    if (patch.profile === '') {
      setMajorDraftState({ key, profile: '', age: '' });
      setMajorCommittedState(null);
    }
  };
  const applyMajor = (event) => {
    event.preventDefault();
    const age = Number(majorDraft.age);
    if (majorDraft.profile !== MAJOR_PROFILE || majorDraft.age.trim() === ''
      || !Number.isInteger(age) || age < 1 || age > 125) {
      setMajorError('Chọn hồ sơ và nhập tuổi mụ là số nguyên từ 1 đến 125.');
      return;
    }
    setMajorError('');
    setMajorDraftState({ key, profile: MAJOR_PROFILE, age: String(age) });
    setMajorCommittedState({ key, option: { profile: MAJOR_PROFILE, nominalAge: age } });
  };
  const majorPlacement = current.body?.time?.capabilities?.dai_han_modern;
  const minorPlacement = current.body?.time?.capabilities?.tieu_han_modern;

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
        <label className="evidence-note">
          Chi năm xem
          <select aria-label="Chi năm xem" value={viewYearBranch} onChange={(event) => setViewYearBranch(event.target.value)}>
            <option value="">Chưa chọn</option>
            {YEAR_BRANCHES.map((branch) => <option key={branch} value={branch}>{branch}</option>)}
          </select>
        </label>
        {current.status === 'ready' && (
          <section aria-labelledby="annual-placement-heading" className="evidence-note">
            <h3 id="annual-placement-heading">Vị trí sao theo chi năm xem</h3>
            {!viewYearBranch ? <p>Chọn chi năm xem để xem vị trí Thiên Đức và Nguyệt Đức trên lá số.</p> : (
              <ul>
                {ANNUAL_STARS.map((id) => {
                  const placement = current.body?.time?.capabilities?.[id];
                  return (
                    <li key={id}>
                      {CYCLE_LABELS[id]}: {placement?.status === 'branch_placed' && YEAR_BRANCHES.includes(placement.branch)
                        ? `chi ${placement.branch} — ${placement.palaceMapping === 'mapped' ? `cung ${PALACE_LABELS[placement.functionId]}` : 'chưa xác định cung'}`
                        : 'chưa xác định vị trí'}.
                    </li>
                  );
                })}
              </ul>
            )}
            <p>
              Nguồn truyền thống: <a href="https://zh.wikisource.org/zh-hant/紫微斗數全書/卷二">Tử Vi Đẩu Số Toàn Thư, quyển 2</a>, mục an Thiên Đức, Nguyệt Đức; bản chép Wikisource.
              {' '}Chỉ hiển thị vị trí trên lá số, chưa có lời luận vận hạn được duyệt.
            </p>
          </section>
        )}
        <section className="modern-minor-panel" aria-labelledby="modern-minor-heading">
          <h3 id="modern-minor-heading">Vị trí Tiểu hạn — hồ sơ phần mềm iztro</h3>
          <p id="modern-minor-help">Bạn nhập tuổi mụ; ứng dụng không tự tính tuổi từ ngày hoặc năm xem. Chỉ đối chiếu vị trí trên lá số, chưa có luận vận hạn.</p>
          <p>Dùng chi năm sinh của lá số này; đây là phép đối chiếu theo hồ sơ phần mềm, không xác nhận toàn bộ lịch và lá số iztro.</p>
          <form className="modern-minor-controls" onSubmit={applyMinor} noValidate>
            <label>Hồ sơ Tiểu hạn
              <select aria-label="Hồ sơ Tiểu hạn" value={minorDraft.profile} onChange={event => changeMinorDraft({ profile: event.target.value })}>
                <option value="">Chưa chọn</option>
                <option value={MINOR_PROFILE}>iztro — tuổi mụ nhập trực tiếp</option>
              </select>
            </label>
            <label>Tuổi mụ nhập trực tiếp
              <input aria-label="Tuổi mụ nhập trực tiếp" type="number" inputMode="numeric" min="1" max="120" step="1" value={minorDraft.age}
                aria-describedby={`modern-minor-help${minorError && minorDraftState?.key === key ? ' modern-minor-error' : ''}`}
                aria-invalid={Boolean(minorError && minorDraftState?.key === key)}
                onChange={event => changeMinorDraft({ age: event.target.value })} />
            </label>
            <button type="submit">Áp dụng tuổi mụ</button>
          </form>
          {minorError && minorDraftState?.key === key && <p id="modern-minor-error" role="alert">{minorError}</p>}
          <div aria-live="polite">
            {minorDirty ? <p>Chưa áp dụng thay đổi. Chọn hồ sơ, nhập tuổi mụ rồi chọn “Áp dụng tuổi mụ”.</p>
              : !minorOption ? <p>Chọn hồ sơ và nhập tuổi mụ để đối chiếu vị trí Tiểu hạn.</p>
                : current.status === 'ready' && minorPlacement?.status === 'branch_placed'
                  ? <p>Tuổi mụ {minorOption.nominalAge}: chi {minorPlacement.branch} — cung {PALACE_LABELS[minorPlacement.functionId]}.</p>
                  : current.status === 'ready' ? <p>Chưa thể đối chiếu vị trí theo hồ sơ này; chưa có vị trí được xác nhận.</p>
                    : <p>Chưa có vị trí được xác nhận cho tuổi mụ đã áp dụng.</p>}
          </div>
          <p>Nguồn phần mềm: <a href={`https://github.com/SylarLong/iztro/blob/${MINOR_PIN}/src/astro/palace.ts#L185-L233`}>iztro — mã nguồn Tiểu hạn tại phiên bản đã đối chiếu</a>.</p>
        </section>
        <section className="modern-minor-panel" aria-labelledby="modern-major-heading">
          <h3 id="modern-major-heading">Vị trí Đại hạn — hồ sơ phần mềm iztro</h3>
          <p id="modern-major-help">Bạn nhập tuổi mụ; ứng dụng không tự tính tuổi từ ngày hoặc năm xem. Chỉ đối chiếu vị trí trên lá số, chưa có luận vận hạn.</p>
          <p>Đối chiếu trên Mệnh, Cục và chi năm sinh của lá số này; không xác nhận toàn bộ lịch hoặc lá số iztro. Hồ sơ này độc lập với nhãn Đại hạn có sẵn và nguồn Toàn Thư cổ điển.</p>
          <form className="modern-minor-controls" onSubmit={applyMajor} noValidate>
            <label>Hồ sơ Đại hạn
              <select aria-label="Hồ sơ Đại hạn" value={majorDraft.profile} onChange={event => changeMajorDraft({ profile: event.target.value })}>
                <option value="">Chưa chọn</option>
                <option value={MAJOR_PROFILE}>iztro — Mệnh, Cục, tuổi mụ nhập trực tiếp</option>
              </select>
            </label>
            <label>Tuổi mụ cho Đại hạn
              <input aria-label="Tuổi mụ cho Đại hạn" type="number" inputMode="numeric" min="1" max="125" step="1" value={majorDraft.age}
                aria-describedby={`modern-major-help${majorError ? ' modern-major-error' : ''}`}
                aria-invalid={Boolean(majorError)} onChange={event => changeMajorDraft({ age: event.target.value })} />
            </label>
            <button type="submit">Áp dụng tuổi mụ Đại hạn</button>
          </form>
          {majorError && <p id="modern-major-error" role="alert">{majorError}</p>}
          <div aria-live="polite">
            {majorDirty ? <p>Chưa áp dụng thay đổi Đại hạn. Chọn hồ sơ, nhập tuổi mụ rồi áp dụng.</p>
              : !majorOption ? <p>Chọn hồ sơ và nhập tuổi mụ để đối chiếu vị trí Đại hạn.</p>
                : current.status === 'ready' && majorPlacement?.status === 'branch_placed'
                  ? <p>Đại hạn tuổi mụ {majorOption.nominalAge}: chi {majorPlacement.branch} — cung {PALACE_LABELS[majorPlacement.functionId]}; khoảng tuổi mụ {majorPlacement.decadeStartAge}–{majorPlacement.decadeEndAge}.</p>
                  : current.status === 'ready' && majorPlacement?.reason === 'before_first_period'
                    ? <p>Tuổi mụ {majorOption.nominalAge} chưa đến khoảng Đại hạn đầu tiên theo hồ sơ này; không gán cung tuổi nhỏ.</p>
                    : current.status === 'ready' && majorPlacement?.reason === 'after_last_period'
                      ? <p>Tuổi mụ {majorOption.nominalAge} vượt khoảng Đại hạn cuối cùng theo hồ sơ này; không lặp lại chu kỳ.</p>
                      : <p>Chưa có vị trí Đại hạn được xác nhận cho tuổi mụ đã áp dụng.</p>}
          </div>
          <p>Nguồn phần mềm: <a href={`https://github.com/SylarLong/iztro/blob/${MINOR_PIN}/src/astro/palace.ts#L174-L214`}>iztro — mã nguồn Đại hạn tại phiên bản đã đối chiếu</a>.</p>
        </section>
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
              </p>
            )}
          </>
        )}
      </div>
    </section>
  );
}
