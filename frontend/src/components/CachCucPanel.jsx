import React, { useEffect, useId, useRef, useState } from 'react';
import { API_BASE } from '../apiBase';
import './CachCucPanel.css';

const TYPE_CONFIG = {
  cat_cach:       { label: 'Cát Cách',       color: '#b8860b', bg: '#fffbeb', badge: '#ffd700', icon: '✦' },
  dac_biet_cach:   { label: 'Đặc Biệt Cách', color: '#6a0080', bg: '#fdf4ff', badge: '#d48aff', icon: '◈' },
  hung_bai_cach:   { label: 'Hung Bại Cách', color: '#8b0000', bg: '#fff5f5', badge: '#ff6b6b', icon: '⚠' },
};

function validCombinations(data) {
  return Array.isArray(data?.combinations) && data.combinations.every(combo => (
    combo && typeof combo.name === 'string' && combo.name.trim().length > 0
    && Object.hasOwn(TYPE_CONFIG, combo.type)
    && ['description', 'formula_text', 'summary', 'verification_status'].every(field => typeof combo[field] === 'string')
    && (combo.disclaimer === undefined || typeof combo.disclaimer === 'string')
    && (combo.tags === undefined || Array.isArray(combo.tags) && combo.tags.every(tag => typeof tag === 'string'))
  ));
}

function chartFingerprint(chartData, userInfo) {
  const tv = chartData?.tuviInfo;
  const ld = chartData?.lunarInfo;
  if (!tv?.boxes || !tv.menh) return '';
  const starSig = Array.from({ length: 12 }, (_, offset) => {
    const box = tv.boxes[offset + 1];
    if (!box) return '';
    return [
      offset + 1,
      box.cungName,
      ...(box.majorStars || []),
      ...(box.goodStars || []),
      ...(box.badStars || []),
      box.daiHan,
      box.isTuan ? 'T' : '',
      box.isTriet ? 'R' : ''
    ].join(',');
  }).join(';');
  return [
    userInfo?.year, userInfo?.month, userInfo?.day, userInfo?.hour, userInfo?.gender,
    ld?.lunarDay, ld?.lunarMonth, ld?.lunarYear, ld?.isLeapMonth,
    tv.menh, tv.than, tv.textAmDuong, tv.anSaoMonth,
    starSig
  ].join('#');
}

export default function CachCucPanel({ chartData, userInfo }) {
  const chartKey = chartFingerprint(chartData, userInfo);
  const instanceId = useId();
  const [retry, setRetry] = useState(0);
  const requestKey = `${chartKey}:${retry}`;
  const [result, setResult] = useState({ key: '', combinations: [], error: '' });
  const [expanded, setExpanded] = useState(null);
  const heading = useRef(null);
  const retryButton = useRef(null);
  const focusAfterRetry = useRef(null);
  const loading = Boolean(chartData?.tuviInfo?.boxes) && result.key !== requestKey;

  useEffect(() => {
    if (focusAfterRetry.current !== requestKey) {
      focusAfterRetry.current = null;
      return;
    }
    if (result.key !== requestKey) return;
    focusAfterRetry.current = null;
    (result.error ? retryButton.current : heading.current)?.focus();
  }, [result, requestKey]);

  useEffect(() => {
    if (!chartData?.tuviInfo?.boxes) return;

    const { boxes, menh } = chartData.tuviInfo;
    let menhChi = '';
    Object.values(boxes).forEach(box => {
      if (box.cungName?.includes('MỆNH')) {
        menhChi = box.chi || box.chiName || '';
      }
    });

    const key = requestKey;
    const controller = new AbortController();
    fetch(`${API_BASE}/api/combinations/match`, {
      method: 'POST',
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        boxes,
        menhIndex: menh,
        menhChi
      })
    })
      .then(async response => {
        const data = await response.json();
        if (!response.ok || !validCombinations(data)) throw new Error('Invalid combination response');
        return data;
      })
      .then(data => {
        if (controller.signal.aborted) return;
        setResult({ key, combinations: data.combinations, error: '' });
        setExpanded(null);
      })
      .catch(() => {
        if (controller.signal.aborted) return;
        setResult({ key, combinations: [], error: 'Không tải được cách cục. Vui lòng thử lại.' });
      });
    return () => controller.abort();
  }, [chartData, requestKey]);

  const combinations = result.key === requestKey ? result.combinations : [];
  const error = result.key === requestKey ? result.error : '';

  if (!chartData) return null;

  const grouped = {
    cat_cach: combinations.filter(c => c.type === 'cat_cach'),
    dac_biet_cach: combinations.filter(c => c.type === 'dac_biet_cach'),
    hung_bai_cach: combinations.filter(c => c.type === 'hung_bai_cach'),
  };

  return (
    <div className="cach-cuc-panel">
      <div className="cach-cuc-header">
        <h2 className="cach-cuc-title" ref={heading} tabIndex={-1}>
          <span className="cach-cuc-title-icon" aria-hidden="true">☯</span>
          Cách cục
        </h2>
        <p className="cach-cuc-subtitle">
          Tổ hợp sao đặc biệt được phát hiện trong lá số này
        </p>
      </div>

      {loading && (
        <div className="cach-cuc-loading" role="status">
          <span className="spinner">⟳</span> Đang phân tích cách cục...
        </div>
      )}

      {error && <div className="cach-cuc-error"><p className="cach-cuc-empty" role="alert">{error}</p><button type="button" className="cach-cuc-retry" ref={retryButton} onClick={() => {
        focusAfterRetry.current = `${chartKey}:${retry + 1}`;
        setRetry(value => value + 1);
      }}>Thử lại cách cục</button></div>}
      {!loading && !error && combinations.length === 0 && (
        <div className="cach-cuc-empty">
          Không phát hiện cách cục đặc biệt nào trong lá số này.
        </div>
      )}

      {!loading && combinations.length > 0 && (
        <div className="cach-cuc-summary-bar">
          {Object.entries(grouped).map(([type, list]) =>
            list.length > 0 ? (
              <span key={type} className="summary-badge" style={{ background: TYPE_CONFIG[type].badge }}>
                {TYPE_CONFIG[type].icon} {TYPE_CONFIG[type].label}: <strong>{list.length}</strong>
              </span>
            ) : null
          )}
          <span className="summary-total">Tổng: <strong>{combinations.length}</strong> cách cục</span>
        </div>
      )}

      {['cat_cach', 'dac_biet_cach', 'hung_bai_cach'].map(type => {
        const list = grouped[type];
        if (list.length === 0) return null;
        const cfg = TYPE_CONFIG[type];
        return (
          <div key={type} className="cach-cuc-group">
            <h3 className="group-label" style={{ color: cfg.color }}>
              {cfg.icon} {cfg.label} ({list.length})
            </h3>
            <div className="cach-cuc-grid">
              {list.map((combo, index) => {
                const detailId = `${instanceId}-${type}-${index}`;
                const isExpanded = expanded?.key === requestKey && expanded?.id === detailId;
                return (
                <div
                  key={index}
                  className={`cach-cuc-card ${isExpanded ? 'expanded' : ''}`}
                  style={{ background: cfg.bg, borderColor: cfg.color }}
                >
                  <button type="button" className="card-top cach-cuc-toggle" aria-expanded={isExpanded} aria-controls={detailId} onClick={() => setExpanded(isExpanded ? null : { key: requestKey, id: detailId })}>
                    <span className="card-icon" style={{ color: cfg.color }} aria-hidden="true">{cfg.icon}</span>
                    <strong className="card-name" style={{ color: cfg.color }}>{combo.name}</strong>
                    <span className="card-arrow" aria-hidden="true">{isExpanded ? '▲' : '▼'}</span>
                  </button>
                  <p className="card-desc">{combo.description}</p>
                  {combo.verification_status !== 'matching_ok' && (
                    <p className="card-desc" style={{ fontSize: '12px', opacity: 0.85 }}>Chưa xác thực — không phải kết luận chắc chắn về cuộc đời.</p>
                  )}
                  {combo.verification_status === 'matching_ok' && (
                    <p className="card-desc" style={{ fontSize: '12px', opacity: 0.75 }}>Chỉ khớp điều kiện sao đã khai báo.</p>
                  )}
                    <div className="card-detail" id={detailId} hidden={!isExpanded}>
                      <div className="card-formula">
                        <span className="formula-label">Điều kiện:</span>
                        <span>{combo.formula_text}</span>
                      </div>
                      <div className="card-meaning">
                        <span className="formula-label">Mô tả trong catalog:</span>
                        <span>{combo.summary}</span>
                      </div>
                      {combo.disclaimer && (
                        <p className="card-desc" style={{ fontSize: '12px', marginTop: '8px' }}>{combo.disclaimer}</p>
                      )}
                      {combo.tags?.length > 0 && (
                        <div className="card-tags">
                          {combo.tags.filter(t => t !== combo.type).map((t, tagIndex) => (
                            <span key={tagIndex} className="tag" style={{ borderColor: cfg.color, color: cfg.color }}>#{t}</span>
                          ))}
                        </div>
                      )}
                    </div>
                </div>
              ); })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
