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

const CYCLE_LABELS = {
  tieu_han: 'Tiểu hạn',
  luu_nien: 'Lưu niên',
  luu_tinh: 'Lưu tinh',
  tu_hoa_han: 'Tứ hóa hạn',
  leap_month_fortune: 'Vận hạn tháng nhuận'
};

function palaceLabel(statement) {
  if (statement?.thanOverlay) return 'Thân (lớp phủ, không phải cung thứ 13)';
  return PALACE_LABELS[statement?.functionId] || statement?.functionId || 'Cung';
}

function birthKey(userInfo) {
  return [userInfo?.year, userInfo?.month, userInfo?.day, userInfo?.hour, userInfo?.gender].join('-');
}

function relationText(relations) {
  if (!relations) return 'Chưa có quan hệ cung.';
  const join = (ids) => (Array.isArray(ids) && ids.length ? ids.join(', ') : 'không có');
  return `Tam hợp: ${join(relations.tamHop)}. Xung chiếu: ${relations.xungChieu ?? 'không có'}.`;
}

function Detail({ statement }) {
  const claims = statement.claimApplicability || [];
  return (
    <div className="evidence-detail">
      <h3>{palaceLabel(statement)}</h3>
      <p>{AVAILABILITY_LABELS[statement.availabilityStatus] || statement.availabilityStatus}</p>
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
  const activeKey = useRef(key);
  const [state, setState] = useState({ key: '', status: 'idle', body: null, error: '' });
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    activeKey.current = key;
    const day = userInfo?.day;
    const month = userInfo?.month;
    const year = userInfo?.year;
    const hour = userInfo?.hour;
    const gender = userInfo?.gender;
    if (![day, month, year, hour, gender].every((value) => Number.isInteger(value))) return undefined;

    const controller = new AbortController();
    const requestKey = key;
    fetch(`${API_BASE}/api/interpretations/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ day, month, year, hour, gender }),
      signal: controller.signal
    })
      .then(async (response) => {
        const body = await response.json().catch(() => ({}));
        if (activeKey.current !== requestKey) return;
        if (!response.ok) {
          setState({ key: requestKey, status: 'error', body: null, error: body.error || 'Không đọc được trạng thái chứng cứ' });
          return;
        }
        setState({ key: requestKey, status: 'ready', body, error: '' });
        setSelectedId(null);
      })
      .catch((error) => {
        if (error.name === 'AbortError') return;
        if (activeKey.current !== requestKey) return;
        setState({ key: requestKey, status: 'error', body: null, error: 'Không kết nối được máy chủ phân tích' });
      });
    return () => controller.abort();
  }, [key, userInfo]);

  const current = state.key === key ? state : { key, status: 'loading', body: null, error: '' };
  const loading = current.status === 'idle' || current.status === 'loading';
  const statements = current.body?.statements || [];
  const selected = statements.find((item) => item.statementId === selectedId) || null;
  const blocked = Object.entries(current.body?.time?.capabilities || {}).filter(([, value]) => (
    value && (value.status === 'blocked' || value.status === 'not_applied')
  ));

  return (
    <section className="evidence-panel" aria-labelledby="evidence-heading">
      <div className="evidence-header">
        <h2 id="evidence-heading">Trạng thái chứng cứ</h2>
        <p>Không phải luận giải đã duyệt. Không có lời luận và không có điểm cuộc đời.</p>
      </div>
      <div className="evidence-body">
        {loading && <p role="status">Đang đọc trạng thái chứng cứ...</p>}
        {current.status === 'error' && <p role="alert">{current.error}</p>}
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
                  {palaceLabel(statement)}: {AVAILABILITY_LABELS[statement.availabilityStatus] || statement.availabilityStatus}
                </button>
              ))}
            </div>
            {selected && <Detail statement={selected} />}
            {blocked.length > 0 && (
              <p className="evidence-note">
                {blocked.map(([id]) => CYCLE_LABELS[id] || id).join(', ')}: chưa áp dụng vì chưa có công thức được duyệt.
              </p>
            )}
          </>
        )}
      </div>
    </section>
  );
}
