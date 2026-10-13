import CalculationTrace from './CalculationTrace';
import MetricMeaning from './MetricMeaning';

const STATES = { present: 'Đủ 3 số', partial: 'Có một phần', absent: 'Không có số nào' };
export default function NumerologyAdvanced({ birthGrid, cycles, pinnacles }) {
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
        <h3 id={`cycle-${id}`}>{label}</h3><output className="num-value" aria-label={label}>{cycles[id].value}</output><CalculationTrace label={label} metric={cycles[id]} /><MetricMeaning label={label} metric={cycles[id]} />
      </article>)}</div>
    </section>
    <section className="num-pinnacle-section" aria-labelledby="num-pinnacle-heading">
      <div className="section-kicker">BỐN GIAI ĐOẠN TUỔI</div><h2 id="num-pinnacle-heading">Đỉnh cao và thử thách</h2>
      <p>Tuổi tính đến {pinnacles.asOf.split('-').reverse().join('/')}: <strong>{pinnacles.completedAge}</strong>. Giai đoạn đầu kết thúc ở tuổi {pinnacles.firstCycleEndAge}, vì gốc Đường đời là {pinnacles.lifePathRoot}. Sinh ngày 29/02 dùng 01/03 trong năm không nhuận.</p>
      <p>Thử thách dùng cùng cửa sổ tuổi với đỉnh cao theo quy ước của hồ sơ này. Một số tài liệu khác chỉ ước lượng thời lượng thử thách và để các giai đoạn chồng lên nhau. Số 0 là một thử thách hợp lệ, không có nghĩa là giai đoạn đó không có gì để để ý. Nhóm này chưa có lời luận.</p>
      <ol className="num-pinnacle-list">{pinnacles.periods.map((period, index) => {
        const label = `Giai đoạn ${index + 1}`;
        const range = period.endAgeInclusive === null ? `Từ ${period.startAgeInclusive} tuổi` : `${period.startAgeInclusive}–${period.endAgeInclusive} tuổi`;
        const dates = period.endDate === null ? `Từ ${period.startDate.split('-').reverse().join('/')}` : `${period.startDate.split('-').reverse().join('/')} – ${period.endDate.split('-').reverse().join('/')}`;
        return <li key={period.id} className="num-pinnacle-period" aria-current={period.active ? 'step' : undefined} aria-labelledby={`pinnacle-${period.id}`}>
          <h3 id={`pinnacle-${period.id}`}>{label}</h3>
          {period.active && <p className="num-pinnacle-active">Đang trong giai đoạn này</p>}
          <p>{range} · {dates}</p>
          <div className="num-pinnacle-values">
            <div><h4>Đỉnh cao</h4><output className="num-value" aria-label={`Đỉnh cao giai đoạn ${index + 1}`}>{period.pinnacle.value}</output>{period.pinnacle.isMaster && <p className="num-master">Số đặc biệt · Gốc {period.pinnacle.rootValue}</p>}<CalculationTrace label={`Đỉnh cao giai đoạn ${index + 1}`} metric={period.pinnacle} /></div>
            <div><h4>Thử thách</h4><output className="num-value" aria-label={`Thử thách giai đoạn ${index + 1}`}>{period.challenge.value}</output><p>Hiệu tuyệt đối của {period.challenge.operands[0]} và {period.challenge.operands[1]}.</p></div>
          </div>
        </li>;
      })}</ol>
    </section>
  </div>;
}
