import { useEffect, useRef, useState } from 'react';
import { Routes, Route, Link, NavLink, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import './App.css';
import './Landing.css';
import TuViChart from './components/TuViChart';
import CachCucPanel from './components/CachCucPanel';
import StructuredAnalysis from './components/StructuredAnalysis';
import ChartActions from './components/ChartActions';
import { LuanGiai, KienThuc, TaiLieu, LienHe } from './pages/Pages';
import { API_BASE } from './apiBase';
import NumerologyPage from './numerology/NumerologyPage';

const DEFAULT_INPUT = { name: '', day: 1, month: 1, year: 1990, hour: 1, gender: 1 };
const BRANCHES = ['Tí', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tị', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];
function YinIcon() {
  return <svg viewBox="0 0 100 100" fill="currentColor" aria-hidden="true"><circle cx="50" cy="50" r="48" /><path d="M50 2a48 48 0 0 1 0 96 24 24 0 0 0 0-48 24 24 0 0 1 0-48" fill="#e9eddf" /><circle cx="50" cy="26" r="7" /><circle cx="50" cy="74" r="7" fill="#e9eddf" /></svg>;
}
function readInput(params) {
  return Object.fromEntries(Object.entries(DEFAULT_INPUT).map(([key, fallback]) => [key,
    key === 'name' ? (params.get(key) ?? fallback) : (params.has(key) ? Number(params.get(key)) : fallback)
  ]));
}
function BirthForm({ input, onChange, onSubmit, loading }) {
  const change = (key, value) => onChange({ ...input, [key]: value });
  return <section className="form-container" aria-labelledby="form-heading">
    <div className="section-kicker">BẮT ĐẦU TỪ BẠN</div>
    <h2 id="form-heading">Lập lá số của bạn</h2>
    <p className="form-description">Nhập ngày sinh dương lịch và giờ sinh để xem lá số.</p>
    <form onSubmit={onSubmit} className="tuviform">
      <label>Họ và tên <span className="optional">(không bắt buộc)</span>
        <input autoComplete="name" maxLength={100} placeholder="Họ Tên" value={input.name} onChange={e => change('name', e.target.value)} />
      </label>
      <fieldset className="date-fields"><legend>Ngày sinh dương lịch</legend>
        {[['day', 'Ngày', 'Ngày dương', 1, 31], ['month', 'Tháng', 'Tháng dương', 1, 12], ['year', 'Năm', 'Năm dương', 1200, 2199]].map(([key, label, placeholder, min, max]) =>
          <label key={key}>{label}<input type="number" inputMode="numeric" min={min} max={max} required placeholder={placeholder} value={input[key] || ''} onChange={e => change(key, e.target.value === '' ? '' : Number(e.target.value))} /></label>)}
      </fieldset>
      <div className="form-pair"><label>Giờ sinh
        <select value={input.hour} onChange={e => change('hour', Number(e.target.value))}>{Array.from({ length: 24 }, (_, h) => <option key={h} value={h}>{String(h).padStart(2, '0')}:00 – {BRANCHES[Math.floor((h + 1) / 2) % 12]}</option>)}</select>
      </label><label>Giới tính
        <select value={input.gender} onChange={e => change('gender', Number(e.target.value))}><option value="1">Nam</option><option value="-1">Nữ</option></select>
      </label></div>
      <p className="field-hint">Giờ sinh theo giờ Việt Nam. Nếu chưa biết chính xác, lá số có thể thay đổi theo giờ.</p>
      <button className="primary-button" type="submit" disabled={loading}>{loading ? 'Đang lập lá số…' : 'Lập Lá Số'} <span aria-hidden="true">→</span></button>
      <p className="privacy-note">Ngày giờ sinh không được lưu vào cơ sở dữ liệu. Đường dẫn chia sẻ sẽ chứa thông tin bạn nhập.</p>
    </form>
  </section>;
}
function Landing({ form }) {
  return <div className="landing-page">
    <section className="landing-hero">
      <div className="hero-copy">
        <div className="section-kicker">MỘT KHOẢNG LẶNG ĐỂ HIỂU MÌNH</div>
        <h1>Hiểu mình hơn.<br /><em>Sống theo cách bạn.</em></h1>
        <p>Từ những vì sao đến những con số, mỗi góc nhìn mở ra một điều để suy ngẫm. Bắt đầu hành trình khám phá của riêng bạn.</p>
        <div className="hero-actions"><a className="primary-button" href="#lap-la-so">Khám phá lá số của bạn <span aria-hidden="true">→</span></a><a className="text-link" href="#hai-goc-nhin">Tìm góc nhìn phù hợp</a></div>
        <p className="hero-footnote">Không cần tài khoản · Bắt đầu từ ngày sinh</p>
      </div>
      <div className="hero-cosmos" aria-hidden="true">
        <div className="cosmos-ring ring-outer" /><div className="cosmos-ring ring-inner" />
        <span className="cosmos-star star-one">✦</span><span className="cosmos-star star-two">✧</span>
        <span className="cosmos-star star-three">✦</span><span className="cosmos-center"><YinIcon /></span>
        <span className="cosmos-number">9</span><span className="cosmos-caption">NHỮNG GÓC NHÌN, MỘT HÀNH TRÌNH</span>
      </div>
    </section>
    <section id="hai-goc-nhin" className="explore-section" aria-labelledby="explore-heading">
      <div className="landing-section-heading"><div><div className="section-kicker">CHỌN CÁCH BẠN KHÁM PHÁ</div><h2 id="explore-heading">Hai góc nhìn. Một chính bạn.</h2></div><p>Không cần có tất cả câu trả lời.<br />Chỉ cần bắt đầu bằng sự tò mò.</p></div>
      <div className="discipline-grid">
        <article className="discipline-card tuvi-card"><div className="discipline-art" aria-hidden="true"><span className="discipline-yin"><YinIcon /></span><span className="discipline-star">✧</span></div><span className="discipline-label">01 / TỬ VI</span><h3>Đọc những vì sao.<br />Mở thêm góc nhìn.</h3><p>Lập lá số từ ngày giờ sinh, khám phá 12 cung và tìm hiểu ý nghĩa của các sao.</p><a className="discipline-link" href="#lap-la-so">Lập lá số Tử Vi <span aria-hidden="true">→</span></a></article>
        <article className="discipline-card numbers-card"><div className="discipline-art number-composition" aria-hidden="true"><span>3</span><span>9</span><span>6</span></div><span className="discipline-label">02 / THẦN SỐ HỌC <span className="card-soon">Bản thử nghiệm</span></span><h3>Những con số.<br />Một câu chuyện riêng.</h3><p>Tính chỉ số, xem biểu đồ ngày sinh, chu kỳ cá nhân và mở lời luận gợi suy ngẫm.</p><Link className="discipline-link" to="/than-so-hoc">Khám phá không gian mới <span aria-hidden="true">→</span></Link></article>
      </div>
    </section>
    <section id="lap-la-so" className="landing-start" aria-labelledby="start-heading">
      <div className="start-copy"><div className="section-kicker">HÀNH TRÌNH BẮT ĐẦU Ở ĐÂY</div><h2 id="start-heading">Một ngày sinh.<br />Một lá số của riêng bạn.</h2><p>Điền vài thông tin để xem lá số. Sau đó, bạn có thể chạm vào tên sao hoặc cung để đọc thêm, in hoặc lưu lại khi muốn.</p><ol className="landing-steps"><li><span>01</span><div><h3>Nhập thông tin sinh</h3><p>Dùng ngày dương lịch và giờ sinh tại Việt Nam.</p></div></li><li><span>02</span><div><h3>Khám phá từng cung, từng sao</h3><p>Đọc theo nhịp của bạn, từ tổng quan đến chi tiết.</p></div></li><li><span>03</span><div><h3>Lưu lại góc nhìn của mình</h3><p>In lá số, tải JSON hoặc chia sẻ đường dẫn.</p></div></li></ol></div>
      {form}
    </section>
    <section className="landing-philosophy"><span aria-hidden="true">✧</span><p>Mỗi góc nhìn là một lời gợi mở.<br /><em>Bạn vẫn là người chọn hành trình.</em></p></section>
    <section className="landing-faq" aria-labelledby="faq-heading"><div><div className="section-kicker">TRƯỚC KHI BẮT ĐẦU</div><h2 id="faq-heading">Có thể bạn đang hỏi.</h2></div><div className="faq-list"><details><summary>Tôi nên nhập ngày âm hay ngày dương?</summary><p>Hãy nhập ngày sinh dương lịch. Công cụ sẽ chuyển sang âm lịch để lập lá số.</p></details><details><summary>Nếu tôi chưa biết chính xác giờ sinh?</summary><p>Vị trí cung và sao có thể thay đổi theo giờ sinh. Bạn nên xác nhận giờ sinh trước khi sử dụng kết quả để tham khảo.</p></details><details><summary>Thông tin sinh của tôi có được lưu không?</summary><p>API lập lá số không lưu ngày giờ sinh vào cơ sở dữ liệu. Đường dẫn chia sẻ chứa thông tin bạn nhập, vì vậy hãy cân nhắc trước khi gửi cho người khác.</p></details><details><summary>Thần Số Học đã sử dụng được chưa?</summary><p>Đã có bản thử nghiệm với 7 chỉ số, biểu đồ ngày sinh, chu kỳ cá nhân và lời luận biên tập tham khảo nguồn cộng đồng. Mỗi phần ghi rõ cách tính, căn cứ và giới hạn.</p></details></div></section>
  </div>;
}
function App() {
  const [params, setParams] = useSearchParams();
  const [draft, setDraft] = useState(() => ({ query: params.toString(), input: readInput(params) }));
  const [request, setRequest] = useState({ key: '', status: 'idle', error: '', result: null });
  const [retry, setRetry] = useState(0);
  const sequence = useRef(0);
  const navigate = useNavigate();
  const location = useLocation();
  const isNumerology = location.pathname === '/than-so-hoc';
  const hasQuery = ['day', 'month', 'year'].every(key => params.has(key));
  const query = params.toString();
  const input = draft.query === query ? draft.input : readInput(params);
  const setInput = value => setDraft({ query, input: value });
  const requestKey = `${query}:${retry}`;
  const status = hasQuery && location.pathname === '/la-so' && request.key !== requestKey ? 'loading' : request.status;
  const error = request.error;
  const result = request.result;
  useEffect(() => {
    const id = ++sequence.current;
    if (!hasQuery || location.pathname !== '/la-so') return undefined;
    const birth = readInput(new URLSearchParams(query));
    const controller = new AbortController();
    fetch(`${API_BASE}/api/charts/generate`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(birth), signal: controller.signal })
      .then(async response => {
        const body = await response.json();
        if (!response.ok) throw new Error(body.details?.join('. ') || body.error || 'Không lập được lá số.');
        if (sequence.current !== id) return;
        setRequest({ key: requestKey, status: 'ready', error: '', result: { chart: body, input: birth, query } });
      }).catch(err => {
        if (err.name === 'AbortError' || sequence.current !== id) return;
        setRequest({ key: requestKey, status: 'error', result: null, error: err instanceof TypeError ? 'Chưa kết nối được máy chủ. Vui lòng thử lại sau ít phút.' : err.message });
      });
    return () => controller.abort();
  }, [query, hasQuery, location.pathname, requestKey]);
  const submit = e => {
    e.preventDefault();
    const next = new URLSearchParams(Object.entries(input));
    if (location.pathname === '/la-so') {
      if (next.toString() === query) setRetry(value => value + 1);
      else setParams(next);
    } else navigate(`/la-so?${next}`);
  };
  const form = <BirthForm input={input} onChange={setInput} onSubmit={submit} loading={location.pathname === '/la-so' && status === 'loading'} />;
  const current = result?.query === query && status === 'ready' ? result : null;
  return <div className={`app-container${isNumerology ? ' theme-numbers' : ''}`}>
    <a className="skip-link" href="#main-content">Đến nội dung chính</a>
    <header className="site-nav">
      <Link to="/" className="brand"><span className="brand-symbol" aria-hidden="true">✧</span><span>Chiêm nghiệm</span></Link>
      <nav className="landing-menu" aria-label="Chọn lĩnh vực">
        <NavLink to="/" end>Tử Vi</NavLink>
        <NavLink to="/than-so-hoc">Thần Số Học</NavLink>
        <NavLink to="/kien-thuc">Kiến thức</NavLink>
        <NavLink to="/tai-lieu">Tài liệu</NavLink>
      </nav>
      <Link className="nav-cta" to="/la-so">Lập lá số <span aria-hidden="true">→</span></Link>
    </header>
    <div className="app-workspace">
      <main id="main-content" className="app-main"><Routes>
        <Route path="/" element={<Landing form={form} />} />
        <Route path="/la-so" element={<><section className="results-heading"><div><div className="section-kicker">KHÔNG GIAN TỬ VI</div><h1>Lá số của bạn</h1><p>Chạm vào tên sao hoặc cung để tìm hiểu ý nghĩa.</p></div><Link className="text-link" to="/">← Về trang bắt đầu</Link></section><div className="results-layout"><div className="input-column">{form}</div><section className="result-column" aria-label="Kết quả lá số" aria-busy={status === 'loading'}>{status === 'loading' && <div className="result-message" role="status"><span className="loading-orbit"><YinIcon /></span><h2>Đang lập lá số của bạn</h2><p>Chờ một chút, các cung và sao đang được sắp xếp.</p></div>}{status === 'error' && <div className="result-message error-message" role="alert"><h2>Chưa thể lập lá số</h2><p>{error}</p><button className="primary-button" onClick={() => setRetry(value => value + 1)}>Thử lại</button></div>}{!hasQuery && <div className="result-message"><h2>Bắt đầu với thông tin sinh</h2><p>Điền biểu mẫu và chọn “Lập Lá Số” để xem kết quả.</p></div>}{current && <><div className="chart-view"><ChartActions chartData={current.chart} /><p className="chart-scroll-hint">Trên màn hình nhỏ, vuốt ngang để xem đủ 12 cung.</p><div className="chart-scroll" tabIndex={0} role="region" aria-label="Lá số 12 cung, có thể cuộn ngang"><TuViChart lunarInfo={current.chart.lunarInfo} tuviInfo={current.chart.tuviInfo} userInfo={current.input} /></div></div><CachCucPanel chartData={current.chart} userInfo={current.input} /><StructuredAnalysis userInfo={current.input} /></>}</section></div></>} />
        <Route path="/than-so-hoc" element={<NumerologyPage />} /><Route path="/luan-giai" element={<LuanGiai />} /><Route path="/kien-thuc" element={<KienThuc />} /><Route path="/tai-lieu" element={<TaiLieu />} /><Route path="/lien-he" element={<LienHe />} /><Route path="*" element={<div className="result-message"><h1>Trang chưa có nội dung</h1><Link className="text-link" to="/">Về trang bắt đầu →</Link></div>} />
      </Routes></main><footer className="app-footer"><span>© {new Date().getFullYear()} Chiêm nghiệm</span><p>Nội dung mang tính tham khảo, không thay thế quyết định của bạn.</p></footer>
    </div>
  </div>;
}
export default App;
