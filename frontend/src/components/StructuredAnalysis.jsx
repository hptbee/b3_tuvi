import React, { useEffect, useState } from 'react';
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

function birthKey(userInfo) {
  return [userInfo?.year, userInfo?.month, userInfo?.day, userInfo?.hour, userInfo?.gender].join('-');
}

export default function StructuredAnalysis({ userInfo }) {
  const key = birthKey(userInfo);
  const [state, setState] = useState({ key: '', status: 'idle', body: null, error: '' });

  useEffect(() => {
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
        const body = await response.json();
        if (!response.ok) {
          setState({ key: requestKey, status: 'error', body: null, error: body.error || 'Không đọc được trạng thái chứng cứ' });
          return;
        }
        setState({ key: requestKey, status: 'ready', body, error: '' });
      })
      .catch((error) => {
        if (error.name === 'AbortError') return;
        setState({ key: requestKey, status: 'error', body: null, error: 'Không kết nối được máy chủ phân tích' });
      });
    return () => controller.abort();
  }, [key, userInfo]);

  const current = state.key === key ? state : { key, status: 'loading', body: null, error: '' };
  const loading = current.status === 'idle' || current.status === 'loading';
  const statements = current.body?.statements || [];
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
        {current.status === 'ready' && (
          <>
            <ul className="evidence-list">
              {statements.map((statement) => {
                const label = statement.thanOverlay
                  ? 'Thân (lớp phủ, không phải cung thứ 13)'
                  : (PALACE_LABELS[statement.functionId] || statement.functionId);
                const availability = AVAILABILITY_LABELS[statement.availabilityStatus] || statement.availabilityStatus;
                return (
                  <li key={statement.statementId}>
                    <strong>{label}:</strong> {availability}
                  </li>
                );
              })}
            </ul>
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
