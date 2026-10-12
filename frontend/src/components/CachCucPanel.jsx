import React, { useEffect, useState } from 'react';
import { API_BASE } from '../apiBase';

const TYPE_CONFIG = {
  cat_cach:       { label: 'Cát Cách',       color: '#b8860b', bg: '#fffbeb', badge: '#ffd700', icon: '✦' },
  dac_biet_cach:   { label: 'Đặc Biệt Cách', color: '#6a0080', bg: '#fdf4ff', badge: '#d48aff', icon: '◈' },
  hung_bai_cach:   { label: 'Hung Bại Cách', color: '#8b0000', bg: '#fff5f5', badge: '#ff6b6b', icon: '⚠' },
};

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
  const [result, setResult] = useState({ key: '', combinations: [] });
  const [expanded, setExpanded] = useState(null);
  const loading = Boolean(chartData?.tuviInfo?.boxes) && result.key !== chartKey;

  useEffect(() => {
    if (!chartData?.tuviInfo?.boxes) return;

    const { boxes, menh } = chartData.tuviInfo;
    let menhChi = '';
    Object.values(boxes).forEach(box => {
      if (box.cungName?.includes('MỆNH')) {
        menhChi = box.chi || box.chiName || '';
      }
    });

    const key = chartKey;
    fetch(`${API_BASE}/api/combinations/match`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        boxes,
        menhIndex: menh,
        menhChi
      })
    })
      .then(r => r.json())
      .then(data => setResult({ key, combinations: data.combinations || [] }))
      .catch(err => {
        console.error('Cách cục fetch error:', err);
        setResult({ key, combinations: [] });
      });
  }, [chartData, chartKey]);

  const combinations = result.key === chartKey ? result.combinations : [];

  if (!chartData) return null;

  const grouped = {
    cat_cach: combinations.filter(c => c.type === 'cat_cach'),
    dac_biet_cach: combinations.filter(c => c.type === 'dac_biet_cach'),
    hung_bai_cach: combinations.filter(c => c.type === 'hung_bai_cach'),
  };

  return (
    <div className="cach-cuc-panel">
      <div className="cach-cuc-header">
        <h2 className="cach-cuc-title">
          <span className="cach-cuc-title-icon">☯</span>
          Cách cục
        </h2>
        <p className="cach-cuc-subtitle">
          Tổ hợp sao đặc biệt được phát hiện trong lá số này
        </p>
      </div>

      {loading && (
        <div className="cach-cuc-loading">
          <span className="spinner">⟳</span> Đang phân tích cách cục...
        </div>
      )}

      {!loading && combinations.length === 0 && (
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
              {list.map(combo => (
                <div
                  key={combo._id || combo.name}
                  className={`cach-cuc-card ${expanded === (combo._id || combo.name) ? 'expanded' : ''}`}
                  style={{ background: cfg.bg, borderColor: cfg.color }}
                  onClick={() => setExpanded(expanded === (combo._id || combo.name) ? null : (combo._id || combo.name))}
                >
                  <div className="card-top">
                    <span className="card-icon" style={{ color: cfg.color }}>{cfg.icon}</span>
                    <strong className="card-name" style={{ color: cfg.color }}>{combo.name}</strong>
                    <span className="card-arrow">{expanded === (combo._id || combo.name) ? '▲' : '▼'}</span>
                  </div>
                  <p className="card-desc">{combo.description}</p>
                  {combo.verification_status !== 'matching_ok' && (
                    <p className="card-desc" style={{ fontSize: '12px', opacity: 0.85 }}>Chưa xác thực — không phải kết luận chắc chắn về cuộc đời.</p>
                  )}
                  {combo.verification_status === 'matching_ok' && (
                    <p className="card-desc" style={{ fontSize: '12px', opacity: 0.75 }}>Chỉ khớp điều kiện sao đã khai báo.</p>
                  )}
                  {expanded === (combo._id || combo.name) && (
                    <div className="card-detail">
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
                          {combo.tags.filter(t => t !== combo.type).map(t => (
                            <span key={t} className="tag" style={{ borderColor: cfg.color, color: cfg.color }}>#{t}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
