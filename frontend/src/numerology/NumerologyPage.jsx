import { useEffect, useRef, useState } from 'react';
import { calculateRequest, METRIC_IDS } from './api';
import { downloadNumerologyJson, parseNumerologyImport } from './numerologyExport';
import './numerology.css';
import CalculationTrace from './CalculationTrace';
import NumerologyAdvanced from './NumerologyAdvanced';
import MetricMeaning from './MetricMeaning';

const LABELS = {
  lifePath: ['Đường đời', 'Từ tổng các chữ số trong ngày sinh.'],
  birthday: ['Ngày sinh', 'Từ số ngày bạn chào đời.'],
  attitude: ['Thái độ', 'Từ ngày và tháng sinh.'],
  expression: ['Biểu đạt', 'Từ toàn bộ chữ cái trong họ tên.'],
  soulUrge: ['Linh hồn', 'Từ các nguyên âm A, E, I, O, U.'],
  personality: ['Nhân cách', 'Từ các phụ âm trong họ tên.'],
  maturity: ['Trưởng thành', 'Từ Đường đời và Biểu đạt.']
};
const UNAVAILABLE = {
  missing_name: 'Thêm họ tên để tính chỉ số này.',
  no_vowels: 'Tên chuẩn hóa không có nguyên âm A, E, I, O, U.',
  no_consonants: 'Tên chuẩn hóa không có phụ âm.'
};
function payload(draft) {
  return { birthDate: { year: Number(draft.year), month: Number(draft.month), day: Number(draft.day) }, ...(draft.fullName !== '' ? { fullName: draft.fullName } : {}), ...(draft.targetDate ? { targetDate: draft.targetDate } : {}) };
}
function MetricSection({ id, metric }) {
  const [label, note] = LABELS[id];
  return <article className="num-metric" aria-labelledby={`metric-${id}`}>
    <h3 id={`metric-${id}`}>{label}</h3><p className="num-metric-note">{note}</p>
    {metric.status === 'available' ? <>
      <output className="num-value" aria-label={label}>{metric.value}</output>
      {metric.isMaster && <p className="num-master">Số đặc biệt · Gốc {metric.rootValue}</p>}
      <CalculationTrace label={label} metric={metric} /><MetricMeaning label={label} metric={metric} />
    </> : <p className="num-unavailable">{UNAVAILABLE[metric.reason] || 'Chưa đủ thông tin để tính.'}</p>}
  </article>;
}
export default function NumerologyPage() {
  const [draft, setDraft] = useState({ day: '', month: '', year: '', fullName: '', targetDate: '' });
  const [request, setRequest] = useState({ status: 'idle', result: null, input: null, error: null });
  const controller = useRef(null);
  const sequence = useRef(0);
  const dayInput = useRef(null);
  const nameInput = useRef(null);
  const targetInput = useRef(null);
  const errorBox = useRef(null);
  const resultHeading = useRef(null);
  const focusResult = useRef(true);
  const fileInput = useRef(null);
  const [includeName, setIncludeName] = useState(false);
  const [importError, setImportError] = useState('');
  useEffect(() => () => { sequence.current += 1; controller.current?.abort(); }, []);
  useEffect(() => {
    const previousTitle = document.title;
    const previousLang = document.documentElement.lang;
    document.title = 'Thần số học · Chiêm nghiệm';
    document.documentElement.lang = 'vi';
    return () => {
      document.title = previousTitle;
      document.documentElement.lang = previousLang;
    };
  }, []);
  useEffect(() => {
    if (request.status === 'ready' && focusResult.current) resultHeading.current?.focus();
    if (request.status === 'error' && !request.error.fields.length) errorBox.current?.focus();
  }, [request]);
  useEffect(() => {
    if (request.status !== 'ready' || typeof IntersectionObserver === 'undefined') return undefined;
    const nav = document.querySelector('.num-toc');
    if (!nav) return undefined;
    const links = [...nav.querySelectorAll('a[href^="#"]')];
    const sections = links.map(link => document.getElementById(link.getAttribute('href').slice(1))).filter(Boolean);
    const mark = id => links.forEach(link => (link.getAttribute('href') === `#${id}` ? link.setAttribute('aria-current', 'true') : link.removeAttribute('aria-current')));
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) mark(visible.target.id);
    }, { rootMargin: '-15% 0px -55% 0px', threshold: [0.15, 0.4, 0.75] });
    sections.forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, [request]);
  const currentPayload = payload(draft);
  const sameInput = request.input && JSON.stringify(request.input) === JSON.stringify(currentPayload);
  const fields = request.status === 'error' && sameInput ? request.error.fields : [];
  const dateError = fields.find(field => field.path === 'birthDate');
  const nameError = fields.find(field => field.path === 'fullName');
  const targetError = fields.find(field => field.path === 'targetDate');
  const change = event => setDraft(current => ({ ...current, [event.target.name]: event.target.value }));
  const run = async (input, { focus = true, keepResult = false } = {}) => {
    focusResult.current = focus;
    controller.current?.abort();
    const next = new AbortController();
    controller.current = next;
    const id = ++sequence.current;
    setRequest(current => ({ status: 'loading', result: keepResult ? current.result : null, input, error: null }));
    try {
      const result = await calculateRequest(input, next.signal);
      if (next.signal.aborted || id !== sequence.current) return;
      setRequest({ status: 'ready', result, input, error: null });
    } catch (error) {
      if (next.signal.aborted || id !== sequence.current || error.name === 'AbortError') return;
      setRequest(current => ({ status: 'error', result: keepResult ? current.result : null, input, error }));
      if (error.fields?.some(field => field.path === 'targetDate')) targetInput.current?.focus();
      else if (error.fields?.some(field => field.path === 'fullName')) nameInput.current?.focus();
      else if (error.fields?.some(field => field.path === 'birthDate')) dayInput.current?.focus();
    }
  };
  const submit = event => { event.preventDefault(); run(currentPayload); };
  const onImport = async event => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (file.size > 256 * 1024) {
      setImportError('Tệp trống hoặc lớn hơn 256 KB.');
      return;
    }
    const text = typeof file.text === 'function' ? await file.text() : await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
    const parsed = parseNumerologyImport(text);
    if (!parsed.ok) {
      setImportError(parsed.message);
      return;
    }
    setImportError('');
    const birth = parsed.input.birthDate;
    setDraft({
      day: String(birth.day), month: String(birth.month), year: String(birth.year),
      fullName: parsed.input.fullName || '', targetDate: parsed.input.targetDate || ''
    });
    run(parsed.input);
  };
  const result = request.result;
  return <div className="numerology-page num-page">
    <section className="num-hero"><div>
      <div className="section-kicker">KHÔNG GIAN THẦN SỐ HỌC</div><span className="coming-badge">Bản thử nghiệm</span>
      <h1>Những con số.<br /><em>Một góc nhìn về bạn.</em></h1>
      <p>Khám phá các chỉ số từ ngày sinh và họ tên. Bắt đầu với một phép tính, rồi mở từng bước để hiểu kết quả đến từ đâu.</p>
      <a className="primary-button" href="#tinh-chi-so">Tính chỉ số của bạn <span aria-hidden="true">→</span></a>
    </div><div className="number-art" aria-hidden="true"><span>3</span><span>9</span><span>6</span></div></section>
    <section id="tinh-chi-so" className="num-start" aria-labelledby="num-form-heading">
      <div className="num-start-copy"><div className="section-kicker">BẮT ĐẦU TỪ NGÀY SINH</div><h2>Một vài thông tin.<br />Bảy chỉ số để khám phá.</h2>
        <p>Chỉ ngày sinh đã đủ để xem Đường đời, Ngày sinh và Thái độ. Thêm họ tên khai sinh nếu bạn muốn tính nhóm chỉ số từ tên.</p>
        <div className="num-method"><h3>Quy ước đang sử dụng</h3><p>Pythagorean · tổng tất cả chữ số ngày sinh · giữ 11/22/33 theo từng chỉ số.</p><p>Tên tiếng Việt được bỏ dấu và chuyển Đ thành D; Y luôn được tính là phụ âm. Các phương pháp khác có thể cho kết quả khác.</p></div>
        <p className="num-disclaimer">Bản thử nghiệm có con số, cách tính và lời luận gợi suy ngẫm. Nội dung biên tập tham khảo nguồn cộng đồng, chưa phải đánh giá khoa học hay lời luận được chuyên gia xác minh.</p>
      </div>
      <section className="form-container num-form" aria-labelledby="num-form-heading"><h2 id="num-form-heading">Tính chỉ số của bạn</h2>
        <form className="tuviform" onSubmit={submit} aria-busy={request.status === 'loading'}>
          <fieldset className="date-fields" aria-describedby={dateError ? 'num-date-error' : undefined}><legend>Ngày sinh dương lịch</legend>
            {[['day', 'Ngày', 1, 31], ['month', 'Tháng', 1, 12], ['year', 'Năm', 1200, 2199]].map(([key, label, min, max]) => <label key={key} htmlFor={`num-${key}`}>{label}<input ref={key === 'day' ? dayInput : undefined} id={`num-${key}`} name={key} type="number" inputMode="numeric" required min={min} max={max} value={draft[key]} onChange={change} aria-invalid={Boolean(dateError)} /></label>)}
          </fieldset>
          {dateError && <p className="num-field-error" id="num-date-error">{dateError.message}</p>}
          <label htmlFor="num-name">Họ tên khai sinh <span className="optional">(không bắt buộc)</span><input ref={nameInput} id="num-name" name="fullName" autoComplete="name" value={draft.fullName} onChange={change} aria-invalid={Boolean(nameError)} aria-describedby={nameError ? 'num-name-hint num-name-error' : 'num-name-hint'} /></label>
          <p className="field-hint" id="num-name-hint">Nhập tên có dấu như bình thường. Bạn sẽ xem được tên đã chuẩn hóa trong kết quả.</p>
          {nameError && <p className="num-field-error" id="num-name-error">{nameError.message}</p>}
          <label htmlFor="num-target">Ngày xem chu kỳ <span className="optional">(không bắt buộc)</span><input ref={targetInput} id="num-target" name="targetDate" type="date" min="1200-01-01" max="2199-12-31" value={draft.targetDate} onChange={change} aria-invalid={Boolean(targetError)} aria-describedby={targetError ? 'num-target-hint num-target-error' : 'num-target-hint'} /></label>
          <p className="field-hint" id="num-target-hint">Để trống để xem ngày hiện tại theo giờ Việt Nam. Ngày này cũng chọn giai đoạn đỉnh cao đang diễn ra.</p>
          {targetError && <p className="num-field-error" id="num-target-error">{targetError.message}</p>}
          <button className="primary-button" disabled={request.status === 'loading' && Boolean(sameInput)} type="submit">{request.status === 'loading' && sameInput ? 'Đang tính…' : 'Xem kết quả'} <span aria-hidden="true">→</span></button>
          <p className="privacy-note">Không cần tài khoản. Tên và ngày sinh không được lưu vào cơ sở dữ liệu hoặc đường dẫn.</p>
        </form>
      </section>
    </section>
    {request.status === 'loading' && <div className="num-request-status" role="status">Đang tính các chỉ số theo thông tin bạn đã gửi…</div>}
    {request.status === 'error' && <div className="num-error" role="alert" ref={errorBox} tabIndex={-1}><h2>Chưa thể tính chỉ số</h2><p>{request.error.message}</p>{request.error.retryable && <button className="primary-button" onClick={() => run(request.input)}>Thử lại</button>}</div>}
    {result && <section className="num-results" aria-labelledby="num-results-heading">
      <div className="num-results-heading"><div><div className="section-kicker">KẾT QUẢ CỦA BẠN</div><h2 id="num-results-heading" ref={resultHeading} tabIndex={-1}>Các chỉ số của bạn</h2>{(() => {
        const enteredName = request.input.fullName?.trim();
        const dateLabel = `${request.input.birthDate.day}/${request.input.birthDate.month}/${request.input.birthDate.year}`;
        const hideNameInPrint = Boolean(enteredName) && !includeName;
        return <>
          <p className={hideNameInPrint ? 'num-omit-print' : undefined}>{enteredName || 'Theo ngày sinh'} · {dateLabel}</p>
          {hideNameInPrint && <p className="num-print-only">Theo ngày sinh · {dateLabel}</p>}
        </>;
      })()}</div><p>Quy ước {result.profile.id} · {result.profile.version}<br />Ngày lập {result.referenceDate.split('-').reverse().join('/')}<br />Bản thử nghiệm · lời luận tham khảo</p></div>
      <div className="num-actions">
        <label className="num-include-name"><input type="checkbox" checked={includeName} onChange={event => setIncludeName(event.target.checked)} /> Kèm họ tên khi tải JSON và khi in</label>
        <button type="button" onClick={() => {
          try { downloadNumerologyJson(result, request.input, { includeName }); setImportError(''); }
          catch (error) { setImportError(error instanceof Error ? error.message : 'Không xuất được tệp.'); }
        }}>Tải JSON</button>
        <button type="button" onClick={() => fileInput.current?.click()}>Nhập JSON</button>
        <input ref={fileInput} className="num-file-input" type="file" accept="application/json,.json" aria-label="Chọn tệp JSON đã xuất" onChange={onImport} />
        <button type="button" onClick={() => window.print()}>In kết quả</button>
      </div>
      {importError && <p className="num-field-error" role="alert">{importError}</p>}
      {!sameInput && <p className="num-draft-note" role="status">Bạn đang chỉnh sửa thông tin. Kết quả vẫn thuộc dữ liệu đã gửi; chọn “Xem kết quả” để tính lại.</p>}
      {result.contentVersion && <aside className="num-content-notice" aria-label="Lời luận thử nghiệm"><h3>Một lời gợi mở, để bạn tự suy ngẫm</h3><p>Lời luận hiện ngay dưới mỗi chỉ số đã có bài. Chủ đề số được đối chiếu nguồn cộng đồng; nội dung và ngữ cảnh do ứng dụng biên tập, không quyết định tính cách hoặc tương lai của bạn.</p><p>Phiên bản nội dung {result.contentVersion} · biên tập thử nghiệm</p></aside>}
      <nav className="num-toc" aria-label="Mục lục lá số">
        {[['#tong-quan', 'Tổng quan'], ['#chi-so-cot-loi', 'Chỉ số cốt lõi'], ['#bieu-do-ngay-sinh', 'Biểu đồ ngày sinh'], ['#bieu-do-ten', 'Biểu đồ tên'], ['#bieu-do-gop', 'Ngày sinh và tên'], ['#dinh-cao', 'Đỉnh cao và thử thách'], ['#chu-ky', 'Chu kỳ'], ['#chi-so-bo-sung', 'Chỉ số bổ sung'], ['#quan-he', 'Mối nối'], ['#nguon', 'Nguồn']].map(([href, label]) => <a key={href} href={href}>{label}</a>)}
      </nav>
      <section className="num-chapter num-overview" id="tong-quan" aria-labelledby="num-overview-heading">
        <h3 id="num-overview-heading">Tổng quan</h3>
        {(() => {
          const active = result.pinnacles.periods.find(period => period.active);
          const birthLabel = `${request.input.birthDate.day}/${request.input.birthDate.month}/${request.input.birthDate.year}`;
          const facts = [
            ['Đường đời', result.metrics.lifePath.value, result.metrics.lifePath.isMaster ? `Số đặc biệt, gốc ${result.metrics.lifePath.rootValue}` : 'Từ ngày sinh'],
            ['Ngày sinh', result.metrics.birthday.value, 'Từ số ngày'],
            ['Thái độ', result.metrics.attitude.value, 'Từ ngày và tháng'],
            ['Năm cá nhân', result.cycles.personalYear.value, `Ngày xem ${result.cycles.targetDate.split('-').reverse().join('/')}`],
            ['Đỉnh đang diễn ra', active.pinnacle.value, 'Cùng cửa sổ tuổi với thử thách'],
            ['Thử thách cùng giai đoạn', active.challenge.value, active.challenge.value === 0 ? 'Hiệu 0, không đổi thành 9' : 'Hiệu tuyệt đối']
          ];
          const named = result.metrics.expression.status === 'available';
          return <>
            <p className="num-dash-identity">{birthLabel}{request.input.fullName ? ' · Tên đã nhập được chuẩn hóa khi tính các chỉ số từ tên.' : ' · Chưa nhập tên. Nhóm chỉ số từ tên không được tính.'}</p>
            <div className="num-dash-grid">
              {facts.map(([label, value, note]) => <article key={label}><span>{label}</span><strong>{value}</strong><small>{note}</small></article>)}
              {named ? [['Biểu đạt', result.metrics.expression.value], ['Linh hồn', result.metrics.soulUrge.value], ['Nhân cách', result.metrics.personality.value], ['Trưởng thành', result.metrics.maturity.value]].map(([label, value]) => <article key={label}><span>{label}</span><strong>{value}</strong><small>Từ tên</small></article>) : <article className="num-dash-missing"><span>Chỉ số từ tên</span><strong>—</strong><small>Biểu đạt, Linh hồn, Nhân cách và Trưởng thành chưa có vì thiếu tên.</small></article>}
            </div>
            <p className="num-disclaimer">Quy ước {result.profile.id} {result.profile.version}. Các con số là quy ước biểu tượng của hồ sơ này, không phải đánh giá khoa học hay lời đã được chuyên gia xác minh.</p>
          </>;
        })()}
      </section>
      <div className="num-metric-grid" id="chi-so-cot-loi">{METRIC_IDS.map(id => <MetricSection key={id} id={id} metric={result.metrics[id]} />)}</div>
      {result.nameAnalysis && <details className={includeName ? 'num-name-trace' : 'num-name-trace num-omit-print'}><summary>Tên được chuyển sang chữ số như thế nào?</summary><p>Tên chuẩn hóa: <strong>{result.nameAnalysis.normalized}</strong></p><p>Đ → D · bỏ dấu · A, E, I, O, U là nguyên âm · Y là phụ âm.</p><div className="num-letter-list">{result.nameAnalysis.letters.map((item, index) => <span key={index} aria-label={`${item.letter} bằng ${item.value}`}>{item.letter}<b>{item.value}</b></span>)}</div></details>}
      <NumerologyAdvanced birthGrid={result.birthGrid} nameChart={result.nameChart} combinedChart={result.combinedChart} cycles={result.cycles} pinnacles={result.pinnacles} metrics={result.metrics} indicators={result.indicators} includeName={includeName} onViewDate={iso => {
        const next = { birthDate: request.input.birthDate, ...(request.input.fullName ? { fullName: request.input.fullName } : {}), targetDate: iso };
        setDraft(current => ({ ...current, targetDate: iso }));
        run(next, { focus: false, keepResult: true });
      }} />
      <section className="num-chapter" id="nguon" aria-labelledby="num-source-heading">
        <h2 id="num-source-heading">Cách tính và nguồn</h2>
        <p>Hồ sơ {result.profile.id} {result.profile.version}. Đường đời cộng mọi chữ số của ngày sinh và có thể giữ 11, 22, 33. Tên bỏ dấu, Đ thành D, Y là phụ âm. Biểu đồ tên chỉ đếm các chữ đó. Đỉnh dùng tháng, ngày, năm đã rút gọn với master tắt, rồi giữ master ở tổng. Thử thách là hiệu tuyệt đối và dùng cùng cửa sổ tuổi.</p>
        <p className="num-disclaimer">Các con số không phải đánh giá khoa học về tính cách hoặc tương lai. Lời nào chưa có bài đã duyệt thì được ghi là chưa đủ căn cứ, không mượn bài của chỉ số khác.</p>
      </section>
    </section>}
  </div>;
}
