import { useEffect, useRef, useState } from 'react';
import { calculateRequest, METRIC_IDS } from './api';
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
  useEffect(() => () => { sequence.current += 1; controller.current?.abort(); }, []);
  useEffect(() => {
    if (request.status === 'ready') resultHeading.current?.focus();
    if (request.status === 'error' && !request.error.fields.length) errorBox.current?.focus();
  }, [request]);
  const currentPayload = payload(draft);
  const sameInput = request.input && JSON.stringify(request.input) === JSON.stringify(currentPayload);
  const fields = request.status === 'error' && sameInput ? request.error.fields : [];
  const dateError = fields.find(field => field.path === 'birthDate');
  const nameError = fields.find(field => field.path === 'fullName');
  const targetError = fields.find(field => field.path === 'targetDate');
  const change = event => setDraft(current => ({ ...current, [event.target.name]: event.target.value }));
  const run = async input => {
    controller.current?.abort();
    const next = new AbortController();
    controller.current = next;
    const id = ++sequence.current;
    setRequest({ status: 'loading', result: null, input, error: null });
    try {
      const result = await calculateRequest(input, next.signal);
      if (next.signal.aborted || id !== sequence.current) return;
      setRequest({ status: 'ready', result, input, error: null });
    } catch (error) {
      if (next.signal.aborted || id !== sequence.current || error.name === 'AbortError') return;
      setRequest({ status: 'error', result: null, input, error });
      if (error.fields?.some(field => field.path === 'targetDate')) targetInput.current?.focus();
      else if (error.fields?.some(field => field.path === 'fullName')) nameInput.current?.focus();
      else if (error.fields?.some(field => field.path === 'birthDate')) dayInput.current?.focus();
    }
  };
  const submit = event => { event.preventDefault(); run(currentPayload); };
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
          <p className="field-hint" id="num-target-hint">Để trống để xem ngày hiện tại theo giờ Việt Nam, hoặc chọn một ngày từ ngày sinh trở đi.</p>
          {targetError && <p className="num-field-error" id="num-target-error">{targetError.message}</p>}
          <button className="primary-button" disabled={request.status === 'loading' && Boolean(sameInput)} type="submit">{request.status === 'loading' && sameInput ? 'Đang tính…' : 'Xem kết quả'} <span aria-hidden="true">→</span></button>
          <p className="privacy-note">Không cần tài khoản. Tên và ngày sinh không được lưu vào cơ sở dữ liệu hoặc đường dẫn.</p>
        </form>
      </section>
    </section>
    {request.status === 'loading' && <div className="num-request-status" role="status">Đang tính các chỉ số theo thông tin bạn đã gửi…</div>}
    {request.status === 'error' && <div className="num-error" role="alert" ref={errorBox} tabIndex={-1}><h2>Chưa thể tính chỉ số</h2><p>{request.error.message}</p>{request.error.retryable && <button className="primary-button" onClick={() => run(request.input)}>Thử lại</button>}</div>}
    {result && <section className="num-results" aria-labelledby="num-results-heading">
      <div className="num-results-heading"><div><div className="section-kicker">KẾT QUẢ CỦA BẠN</div><h2 id="num-results-heading" ref={resultHeading} tabIndex={-1}>Các chỉ số của bạn</h2><p>{request.input.fullName?.trim() || 'Theo ngày sinh'} · {request.input.birthDate.day}/{request.input.birthDate.month}/{request.input.birthDate.year}</p></div><p>Quy ước Pythagorean {result.profile.version}<br />Bản thử nghiệm · lời luận tham khảo</p></div>
      {!sameInput && <p className="num-draft-note" role="status">Bạn đang chỉnh sửa thông tin. Kết quả vẫn thuộc dữ liệu đã gửi; chọn “Xem kết quả” để tính lại.</p>}
      {result.contentVersion && <aside className="num-content-notice" aria-label="Lời luận thử nghiệm"><h3>Một lời gợi mở, để bạn tự suy ngẫm</h3><p>Mở lời luận ở từng chỉ số để xem góc nhìn và câu hỏi tham khảo. Chủ đề số được đối chiếu nguồn cộng đồng; nội dung và ngữ cảnh do ứng dụng biên tập, không quyết định tính cách hoặc tương lai của bạn.</p><p>Phiên bản nội dung {result.contentVersion} · biên tập thử nghiệm</p></aside>}
      <div className="num-metric-grid">{METRIC_IDS.map(id => <MetricSection key={id} id={id} metric={result.metrics[id]} />)}</div>
      {result.nameAnalysis && <details className="num-name-trace"><summary>Tên được chuyển sang chữ số như thế nào?</summary><p>Tên chuẩn hóa: <strong>{result.nameAnalysis.normalized}</strong></p><p>Đ → D · bỏ dấu · A, E, I, O, U là nguyên âm · Y là phụ âm.</p><div className="num-letter-list">{result.nameAnalysis.letters.map((item, index) => <span key={index} aria-label={`${item.letter} bằng ${item.value}`}>{item.letter}<b>{item.value}</b></span>)}</div></details>}
      <NumerologyAdvanced birthGrid={result.birthGrid} cycles={result.cycles} />
      <p className="num-disclaimer">Các con số không phải đánh giá khoa học về tính cách hoặc tương lai. Đỉnh cao/thử thách sẽ được triển khai ở giai đoạn tiếp theo.</p>
    </section>}
  </div>;
}
