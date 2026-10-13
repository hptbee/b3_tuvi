import CalculationTrace from './CalculationTrace';

const STATES = { present: 'Đủ 3 số', partial: 'Có một phần', absent: 'Không có số nào' };
export default function NumerologyAdvanced({ birthGrid, cycles }) {
  return <div className="num-advanced">
    <section className="num-grid-section" aria-labelledby="num-grid-heading">
      <div className="section-kicker">NHỮNG CHỮ SỐ TRONG NGÀY SINH</div><h2 id="num-grid-heading">Biểu đồ ngày sinh</h2>
      <p>Mỗi ô cho biết số lần một chữ số xuất hiện. Ô không có số chỉ mô tả ngày sinh, không phải đánh giá năng lực của bạn.</p>
      <div className="num-grid-layout"><div>
        <table className="num-birth-grid"><caption>Chữ số và số lần xuất hiện</caption><tbody>
          {birthGrid.layout.map((row, index) => <tr key={index}>{row.map(digit => <td key={digit} aria-label={`Số ${digit}: ${birthGrid.counts[digit]} lần`} className={birthGrid.counts[digit] ? 'num-cell-present' : 'num-cell-empty'}>
            <b>{digit}</b><span>{birthGrid.counts[digit] ? `${birthGrid.counts[digit]} lần` : 'Không xuất hiện'}</span>
          </td>)}</tr>)}
        </tbody></table>
        <p className="num-grid-zero">Bỏ qua {birthGrid.ignoredZeroCount} chữ số 0 trong định dạng DDMMYYYY.</p>
      </div><div><h3>Tám tuyến số</h3><ul className="num-lines">{birthGrid.lines.map(line => <li key={line.id}><strong>{line.digits.join(' – ')}</strong><span>{STATES[line.state]}</span></li>)}</ul><p className="num-disclaimer">Chỉ nhận diện sự xuất hiện của các số; chưa diễn giải ý nghĩa mũi tên.</p></div></div>
    </section>
    <section className="num-cycle-section" aria-labelledby="num-cycle-heading">
      <div className="section-kicker">MỘT NGÀY, MỘT GÓC NHÌN</div><h2 id="num-cycle-heading">Chu kỳ cá nhân</h2>
      <p className="num-cycle-date">Ngày xem: <strong>{cycles.targetDate.split('-').reverse().join('/')}</strong> · Năm {cycles.year}</p>
      <p>Quy ước năm dương lịch từ 01/01 đến 31/12, không đổi vào sinh nhật. Các chu kỳ rút gọn về 1–9.</p>
      <div className="num-cycle-grid">{[['personalYear', 'Năm cá nhân'], ['personalMonth', 'Tháng cá nhân'], ['personalDay', 'Ngày cá nhân']].map(([id, label]) => <article key={id} className="num-metric" aria-labelledby={`cycle-${id}`}>
        <h3 id={`cycle-${id}`}>{label}</h3><output className="num-value" aria-label={label}>{cycles[id].value}</output><CalculationTrace label={label} metric={cycles[id]} />
      </article>)}</div>
    </section>
  </div>;
}
