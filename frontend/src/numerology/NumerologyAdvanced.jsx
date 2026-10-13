import { useState } from 'react';
import CalculationTrace from './CalculationTrace';
import MetricMeaning from './MetricMeaning';

const STATES = { present: 'Đủ 3 số', partial: 'Có một phần', absent: 'Không có số nào' };
const PRESENCE = { both: 'Có trong ngày sinh và tên', birth: 'Chỉ có trong ngày sinh', name: 'Chỉ có trong tên', neither: 'Không có trong ngày sinh lẫn tên' };
const DATE_METRICS = [['lifePath', 'Đường đời'], ['birthday', 'Ngày sinh'], ['attitude', 'Thái độ']];
const NAME_METRICS = [['expression', 'Biểu đạt'], ['soulUrge', 'Linh hồn'], ['personality', 'Nhân cách'], ['maturity', 'Trưởng thành']];

const format = iso => iso.split('-').reverse().join('/');
function PeakButton({ period, index, selected, onSelect, edge }) {
  return <button type="button" className={selected ? 'num-peak is-selected' : 'num-peak'} aria-pressed={selected} onClick={() => onSelect(period.id)}>
    <span>Đỉnh {index + 1}</span>
    <strong>{period.pinnacle.value}</strong>
    {period.pinnacle.isMaster && <small>Số đặc biệt · Gốc {period.pinnacle.rootValue}</small>}
    <small>{edge}</small>
    {period.active && <small>Đang diễn ra</small>}
  </button>;
}

export default function NumerologyAdvanced({ birthGrid, nameChart, combinedChart, cycles, pinnacles, metrics, onViewDate }) {
  const [lineId, setLineId] = useState(null);
  const [periodId, setPeriodId] = useState(pinnacles.periods.find(period => period.active).id);
  const selectedLine = birthGrid.lines.find(line => line.id === lineId);
  const selected = pinnacles.periods.find(period => period.id === periodId) || pinnacles.periods.find(period => period.active);
  const highlighted = new Set(selectedLine?.digits || []);
  const viewYear = year => onViewDate(`${year}-${String(cycles.month).padStart(2, '0')}-01`);
  const viewMonth = month => onViewDate(`${cycles.year}-${String(month).padStart(2, '0')}-01`);

  return <div className="num-advanced">
    <section className="num-chapter" id="bieu-do-ngay-sinh" aria-labelledby="num-grid-heading">
      <div className="section-kicker">NHỮNG CHỮ SỐ TRONG NGÀY SINH</div><h2 id="num-grid-heading">Biểu đồ ngày sinh</h2>
      <p>Mỗi ô cho biết số lần một chữ số xuất hiện. Ô không có số chỉ mô tả ngày sinh, không phải đánh giá năng lực của bạn. Số lặp chỉ là số lần đếm được.</p>
      <div className="num-grid-layout"><div>
        <table className="num-birth-grid"><caption>Chữ số và số lần xuất hiện</caption><tbody>
          {birthGrid.layout.map(row => <tr key={row.join('-')}>{row.map(digit => <td key={digit} aria-label={`Số ${digit}: ${birthGrid.counts[digit]} lần`} className={`${birthGrid.counts[digit] ? 'num-cell-present' : 'num-cell-empty'}${highlighted.has(digit) ? ' is-lit' : ''}${birthGrid.counts[digit] > 1 ? ' is-repeat' : ''}`}>
            <b>{digit}</b><span>{birthGrid.counts[digit] ? `${birthGrid.counts[digit]} lần` : 'Không xuất hiện'}</span>
          </td>)}</tr>)}
        </tbody></table>
        <p className="num-grid-zero">Bỏ qua {birthGrid.ignoredZeroCount} chữ số 0 trong định dạng DDMMYYYY.</p>
      </div><div><h3>Tám tuyến số</h3>
        <ul className="num-lines">{birthGrid.lines.map(line => <li key={line.id}>
          <button type="button" aria-pressed={lineId === line.id} onClick={() => setLineId(lineId === line.id ? null : line.id)}>
            <strong>{line.digits.join(' – ')}</strong><span>{STATES[line.state]}</span>
          </button>
        </li>)}</ul>
        <p className="num-disclaimer">{selectedLine ? `Đang xem tuyến ${selectedLine.digits.join('–')}: ${STATES[selectedLine.state]}.` : 'Chọn một tuyến để tô các ô của tuyến đó.'} Chỉ nhận diện sự xuất hiện của các số; chưa diễn giải ý nghĩa mũi tên.</p>
      </div></div>
    </section>

    <section className="num-chapter" id="bieu-do-ten" aria-labelledby="num-name-chart-heading">
      <div className="section-kicker">CHỮ CÁI ĐÃ CHUẨN HÓA</div><h2 id="num-name-chart-heading">Biểu đồ tên</h2>
      {nameChart.status !== 'available' ? <p>Chưa có tên nên không có biểu đồ tên. Biểu đồ này chỉ đếm chữ, không dùng mũi tên của biểu đồ ngày sinh.</p> : <>
        <p>Tên chuẩn hóa <strong>{nameChart.normalized}</strong>. Mỗi chữ cộng một lần vào ô đúng giá trị Pythagorean. Đây không phải mũi tên tính cách.</p>
        <table className="num-birth-grid"><caption>Số lần mỗi giá trị xuất hiện trong tên</caption><tbody>
          {nameChart.layout.map(row => <tr key={row.join('-')}>{row.map(digit => <td key={digit} className={nameChart.counts[digit] ? 'num-cell-present' : 'num-cell-empty'}>
            <b>{digit}</b><span>{nameChart.counts[digit] ? `${nameChart.counts[digit]} lần` : 'Không có trong tên'}</span>
          </td>)}</tr>)}
        </tbody></table>
      </>}
    </section>

    <section className="num-chapter" id="bieu-do-gop" aria-labelledby="num-combined-heading">
      <div className="section-kicker">HAI NGUỒN, KHÔNG TRỘN THÀNH MỘT ĐIỂM</div><h2 id="num-combined-heading">Biểu đồ ngày sinh và tên</h2>
      {combinedChart.status !== 'available' ? <p>Cần họ tên để đặt số trong tên cạnh số trong ngày sinh. Việc tên có một chữ số mà ngày sinh không có không có nghĩa là tên đã bù một thiếu sót.</p> : <>
        <p>Mỗi hàng chỉ nói chữ số đó nằm ở đâu. Không kết luận tên làm thay đổi năng lực.</p>
        <table className="num-combined"><caption>Nguồn của từng chữ số</caption><thead><tr><th>Số</th><th>Ngày sinh</th><th>Tên</th><th>Ở đâu</th></tr></thead><tbody>
          {combinedChart.digits.map(item => <tr key={item.digit}><td>{item.digit}</td><td>{item.birth}</td><td>{item.name}</td><td>{PRESENCE[item.presence]}</td></tr>)}
        </tbody></table>
      </>}
    </section>

    <section className="num-chapter num-cycle-section" id="chu-ky" aria-labelledby="num-cycle-heading">
      <div className="section-kicker">MỘT NGÀY, MỘT GÓC NHÌN</div><h2 id="num-cycle-heading">Chu kỳ cá nhân</h2>
      <p className="num-cycle-date">Ngày xem: <strong>{format(cycles.targetDate)}</strong> · Năm {cycles.year}</p>
      <p>Quy ước năm dương lịch từ 01/01 đến 31/12, không đổi vào sinh nhật. Các chu kỳ rút gọn về 1–9. Chín ô năm là một vòng Năm cá nhân chứa năm đang xem, không phải đường tăng hay giảm.</p>
      <div className="num-year-band" role="group" aria-label="Chín năm cá nhân">{cycles.yearBand.map(item => <button type="button" key={item.year} aria-pressed={item.selected} onClick={() => viewYear(item.year)}>
        <span>{item.year}</span><strong>{item.personalYear.value}</strong>
      </button>)}</div>
      <h3>Mười hai tháng của năm {cycles.year}</h3>
      <div className="num-month-band" role="group" aria-label="Mười hai tháng cá nhân">{cycles.months.map(item => <button type="button" key={item.month} aria-pressed={item.selected} onClick={() => viewMonth(item.month)}>
        <span>Tháng {item.month}</span><strong>{item.personalMonth.value}</strong>
      </button>)}</div>
      <div className="num-cycle-grid">{[['personalYear', 'Năm cá nhân'], ['personalMonth', 'Tháng cá nhân'], ['personalDay', 'Ngày cá nhân']].map(([id, label]) => <article key={id} className="num-metric" aria-labelledby={`cycle-${id}`}>
        <h3 id={`cycle-${id}`}>{label}</h3><output className="num-value" aria-label={label}>{cycles[id].value}</output><CalculationTrace label={label} metric={cycles[id]} /><MetricMeaning label={label} metric={cycles[id]} />
      </article>)}</div>
    </section>

    <section className="num-chapter num-pinnacle-section" id="dinh-cao" aria-labelledby="num-pinnacle-heading">
      <div className="section-kicker">BỐN GIAI ĐOẠN TUỔI</div><h2 id="num-pinnacle-heading">Đỉnh cao và thử thách</h2>
      <p>Tuổi tính đến {format(pinnacles.asOf)}: <strong>{pinnacles.completedAge}</strong>. Giai đoạn đầu kết thúc ở tuổi {pinnacles.firstCycleEndAge}, vì gốc Đường đời là {pinnacles.lifePathRoot}. Sinh ngày 29/02 dùng 01/03 trong năm không nhuận.</p>
      <p>Thử thách dùng cùng cửa sổ tuổi với đỉnh cao theo quy ước của hồ sơ này. Một số tài liệu khác chỉ ước lượng thời lượng thử thách và để các giai đoạn chồng lên nhau. Số 0 là một thử thách hợp lệ, không có nghĩa là giai đoạn đó không có gì để để ý. Hồ sơ không gọi thử thách thứ ba là thử thách chính.</p>
      <div className="num-pyramid" role="group" aria-label="Kim tự tháp bốn đỉnh. Đáy là tháng, ngày và năm đã rút gọn với master tắt.">
        <PeakButton period={pinnacles.periods[2]} index={2} selected={selected.id === 'p3'} onSelect={setPeriodId} edge="Đỉnh 1 + đỉnh 2" />
        <div className="num-pyramid-row">
          <PeakButton period={pinnacles.periods[0]} index={0} selected={selected.id === 'p1'} onSelect={setPeriodId} edge="Tháng + ngày" />
          <PeakButton period={pinnacles.periods[1]} index={1} selected={selected.id === 'p2'} onSelect={setPeriodId} edge="Ngày + năm" />
        </div>
        <PeakButton period={pinnacles.periods[3]} index={3} selected={selected.id === 'p4'} onSelect={setPeriodId} edge="Tháng + năm" />
        <div className="num-pyramid-base">
          <span>Tháng đã rút gọn <b>{pinnacles.components.month.value}</b></span>
          <span>Ngày đã rút gọn <b>{pinnacles.components.day.value}</b></span>
          <span>Năm đã rút gọn <b>{pinnacles.components.year.value}</b></span>
        </div>
      </div>
      <p className="num-disclaimer">Ba số đáy là thành phần của hồ sơ này, master tắt. Đỉnh 4 cộng tháng và năm. Đỉnh 4 không được suy ra từ đỉnh 3. Đây không phải chu kỳ period của trường phái khác.</p>
      <div className="num-challenge" role="group" aria-label="Bốn thử thách cùng cửa sổ tuổi với đỉnh">
        {pinnacles.periods.map((period, index) => <button type="button" key={period.id} className={period.id === selected.id ? 'is-selected' : undefined} aria-pressed={period.id === selected.id} onClick={() => setPeriodId(period.id)}>
          <span>Thử thách {index + 1}</span><strong>{period.challenge.value}</strong><small>| {period.challenge.operands[0]} − {period.challenge.operands[1]} |</small>
        </button>)}
      </div>
      <ol className="num-pinnacle-list">{pinnacles.periods.map((period, index) => {
        const label = `Giai đoạn ${index + 1}`;
        const range = period.endAgeInclusive === null ? `Từ ${period.startAgeInclusive} tuổi` : `${period.startAgeInclusive}–${period.endAgeInclusive} tuổi`;
        const dates = period.endDate === null ? `Từ ${format(period.startDate)}` : `${format(period.startDate)} – ${format(period.endDate)}`;
        return <li key={period.id} className="num-pinnacle-period" aria-current={period.active ? 'step' : undefined} aria-labelledby={`pinnacle-${period.id}`}>
          <h3 id={`pinnacle-${period.id}`}>{label}</h3>
          {period.active && <p className="num-pinnacle-active">Đang trong giai đoạn này</p>}
          <p>{range} · {dates}</p>
          <div className="num-pinnacle-values">
            <div><h4>Đỉnh cao</h4><output className="num-value" aria-label={`Đỉnh cao giai đoạn ${index + 1}`}>{period.pinnacle.value}</output>{period.pinnacle.isMaster && <p className="num-master">Số đặc biệt · Gốc {period.pinnacle.rootValue}</p>}<CalculationTrace label={`Đỉnh cao giai đoạn ${index + 1}`} metric={period.pinnacle} /><MetricMeaning label={`Đỉnh cao giai đoạn ${index + 1}`} metric={period.pinnacle} /></div>
            <div><h4>Thử thách</h4><output className="num-value" aria-label={`Thử thách giai đoạn ${index + 1}`}>{period.challenge.value}</output><p>Hiệu tuyệt đối của {period.challenge.operands[0]} và {period.challenge.operands[1]}.</p>{period.challenge.value === 0 && <p>Hai thành phần bằng nhau nên hiệu là 0. Số 0 được giữ nguyên, không đổi thành 9.</p>}<MetricMeaning label={`Thử thách giai đoạn ${index + 1}`} metric={period.challenge} /></div>
          </div>
        </li>;
      })}</ol>
    </section>

    <section className="num-chapter" id="quan-he" aria-labelledby="num-relations-heading">
      <div className="section-kicker">CHỈ NHỮNG MỐI NỐI CÓ PHÉP TÍNH</div><h2 id="num-relations-heading">Các mối nối đã định nghĩa</h2>
      <ul className="num-relations">
        <li>Từ ngày sinh: {DATE_METRICS.map(([id, label]) => `${label} ${metrics[id].value}`).join(', ')}.</li>
        <li>{metrics.expression.status === 'available' ? `Từ tên: ${NAME_METRICS.map(([id, label]) => `${label} ${metrics[id].value}`).join(', ')}.` : 'Chưa có tên nên không có nhóm chỉ số từ tên, và không có số Trưởng thành.'}</li>
        {metrics.maturity.status === 'available' && <li>Trưởng thành = Đường đời {metrics.lifePath.value} + Biểu đạt {metrics.expression.value}.</li>}
        {metrics.lifePath.isMaster && <li>Đường đời giữ số đặc biệt {metrics.lifePath.value}. Gốc dùng cho tuổi đỉnh là {metrics.lifePath.rootValue}.</li>}
        <li>Đỉnh 1 = tháng {pinnacles.components.month.value} + ngày {pinnacles.components.day.value}. Đỉnh 2 = ngày {pinnacles.components.day.value} + năm {pinnacles.components.year.value}. Đỉnh 3 = đỉnh 1 + đỉnh 2. Đỉnh 4 = tháng {pinnacles.components.month.value} + năm {pinnacles.components.year.value}.</li>
        <li>Thử thách là hiệu tuyệt đối của cùng các cặp đó. Thử thách 3 là hiệu của thử thách 1 và thử thách 2.</li>
        <li>Năm cá nhân dùng ngày sinh và năm xem. Tháng cá nhân cộng thêm tháng xem. Ngày cá nhân cộng thêm ngày xem.</li>
      </ul>
      <p className="num-disclaimer">Các câu trên chỉ nhắc lại phép tính. Chưa có thang điểm hợp hay mâu thuẫn giữa các chỉ số.</p>
    </section>
  </div>;
}
