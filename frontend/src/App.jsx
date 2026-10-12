import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import './App.css';
import TuViChart from './components/TuViChart';
import CachCucPanel from './components/CachCucPanel';
import { LuanGiai, KienThuc, TaiLieu, LienHe } from './pages/Pages';
import { API_BASE } from './apiBase';

/**
 * Helper: Gọi API tạo lá số
 */
async function generateChart(info, setChartData) {
  try {
    const response = await fetch(`${API_BASE}/api/charts/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(info)
    });
    const data = await response.json();
    if (!response.ok) {
      const detail = Array.isArray(data.details) ? data.details.join('\n') : data.error;
      alert(detail || 'Không lập được lá số');
      return;
    }
    setChartData(data);
  } catch (error) {
    console.error("Lỗi kết nối Backend:", error);
    alert("Không thể kết nối đến máy chủ Backend. Vui lòng chạy lệnh 'npm start' trong thư mục backend.");
  }
}

/**
 * Component: FORM nhập liệu (Tách ra để tránh mất focus khi render App)
 */
const TuviFormBox = ({ userInfo, setUserInfo, onSubmit, onBack }) => (
  <div className="form-container">
    <h2>Nhập Mệnh Tạo</h2>
    <form onSubmit={onSubmit} className="tuviform">
      <input 
        type="text" 
        placeholder="Họ Tên" 
        value={userInfo.name} 
        onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })} 
      />

      <input 
        type="number" 
        placeholder="Ngày dương" 
        min="1" max="31" 
        value={userInfo.day || ''} 
        onChange={(e) => setUserInfo({ ...userInfo, day: parseInt(e.target.value) || 0 })} 
        required 
      />
      <input 
        type="number" 
        placeholder="Tháng dương" 
        min="1" max="12" 
        value={userInfo.month || ''} 
        onChange={(e) => setUserInfo({ ...userInfo, month: parseInt(e.target.value) || 0 })} 
        required 
      />
      <input 
        type="number" 
        placeholder="Năm dương" 
        min="1900" max="2100" 
        value={userInfo.year || ''} 
        onChange={(e) => setUserInfo({ ...userInfo, year: parseInt(e.target.value) || 0 })} 
        required 
      />

      <select value={userInfo.hour} onChange={(e) => setUserInfo({ ...userInfo, hour: parseInt(e.target.value) })}>
        {Array.from({ length: 24 }, (_, i) => i).map(h => {
          const mapCanh = ["Tí", "Sửu", "Dần", "Mão", "Thìn", "Tị", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"];
          let canhGio = Math.floor((h + 1) / 2);
          if (canhGio === 12) canhGio = 0;
          return <option key={h} value={h}>{h}:00 - {h}:59 (Giờ {mapCanh[canhGio]})</option>
        })}
      </select>

      <select value={userInfo.gender} onChange={(e) => setUserInfo({ ...userInfo, gender: parseInt(e.target.value) })}>
        <option value="1">Nam</option>
        <option value="-1">Nữ</option>
      </select>

      <div style={{ display: 'flex', gap: '10px' }}>
        <button type="submit" style={{ flex: 1 }}>Lập Lá Số</button>
        <button type="button" onClick={onBack} style={{ flex: 1, backgroundColor: '#555' }}>Làm Mới</button>
      </div>
    </form>
  </div>
);

function readInfoFromSearch(searchParams) {
  if (!searchParams.has('year') || !searchParams.has('month') || !searchParams.has('day')) {
    return { name: '', day: 1, month: 1, year: 1990, hour: 1, gender: 1 };
  }
  return {
    name: searchParams.get('name') ?? '',
    day: parseInt(searchParams.get('day')) || 1,
    month: parseInt(searchParams.get('month')) || 1,
    year: parseInt(searchParams.get('year')) || 1990,
    hour: searchParams.has('hour') ? parseInt(searchParams.get('hour')) : 1,
    gender: parseInt(searchParams.get('gender')) || 1
  };
}

function App() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [userInfo, setUserInfo] = useState(() => readInfoFromSearch(searchParams));
  const [chartData, setChartData] = useState(null);
  const navigate = useNavigate();

  const hasChartQuery = searchParams.has('year') && searchParams.has('month') && searchParams.has('day');

  useEffect(() => {
    if (!hasChartQuery) return;
    const info = readInfoFromSearch(searchParams);
    generateChart(info, setChartData);
  }, [searchParams, hasChartQuery]);

  const handleHomeSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    Object.keys(userInfo).forEach(key => params.set(key, userInfo[key]));
    navigate(`/la-so?${params.toString()}`);
  };

  const handleBack = () => {
    setChartData(null);
    navigate('/');
  };

  const handleLaSoSubmit = (e) => {
    e.preventDefault();
    setSearchParams(userInfo);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <Link to="/" className="logo-container" style={{ textDecoration: 'none' }}>
          <div className="logo-icon">☯</div>
          <h1 className="logo-text" style={{ color: '#fff' }}>Tử Vi Việt Nam</h1>
        </Link>
        <nav className="main-menu">
          <ul>
            <li><NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>Trang Chủ</NavLink></li>
            <li><NavLink to="/luan-giai" className={({ isActive }) => isActive ? "active" : ""}>Luận Giải</NavLink></li>
            <li><NavLink to="/kien-thuc" className={({ isActive }) => isActive ? "active" : ""}>Kiến Thức</NavLink></li>
            <li><NavLink to="/tai-lieu" className={({ isActive }) => isActive ? "active" : ""}>Tài Liệu</NavLink></li>
            <li><NavLink to="/lien-he" className={({ isActive }) => isActive ? "active" : ""}>Liên Hệ</NavLink></li>
          </ul>
        </nav>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={
            <TuviFormBox 
              userInfo={userInfo} 
              setUserInfo={setUserInfo} 
              onSubmit={handleHomeSubmit} 
              onBack={handleBack} 
            />
          } />
          <Route path="/la-so" element={
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '30px', width: '100%' }}>
              <TuviFormBox 
                userInfo={userInfo} 
                setUserInfo={setUserInfo} 
                onSubmit={handleLaSoSubmit} 
                onBack={handleBack} 
              />
              {hasChartQuery && chartData && (
                <div className="chart-view">
                  <TuViChart lunarInfo={chartData.lunarInfo} tuviInfo={chartData.tuviInfo} userInfo={userInfo} />
                </div>
              )}
              {hasChartQuery && chartData && <CachCucPanel chartData={chartData} userInfo={userInfo} />}
            </div>
          } />
          <Route path="/luan-giai" element={<LuanGiai />} />
          <Route path="/kien-thuc" element={<KienThuc />} />
          <Route path="/tai-lieu" element={<TaiLieu />} />
          <Route path="/lien-he" element={<LienHe />} />
        </Routes>
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Tử Vi Việt Nam</h3>
            <p>Khám phá bản mệnh, vận hạn qua lăng kính Tử Vi.</p>
          </div>
          <div className="footer-section">
            <h3>Liên Hệ (Contact)</h3>
            <p>🗺️ Địa chỉ: TP.HCM, Việt Nam</p>
            <p>📧 Email: contact@tuvivietnam.vn</p>
            <p>☎️ SĐT: 0123 456 789</p>
          </div>
          <div className="footer-section">
            <h3>Cộng Đồng</h3>
            <p><a href="#">🌐 Fanpage Facebook</a></p>
            <p><a href="#">👥 Nhóm Luận Giải</a></p>
            <p><a href="#">▶️ Kênh YouTube</a></p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 Tử Vi Việt Nam. Bảo lưu mọi quyền.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;

