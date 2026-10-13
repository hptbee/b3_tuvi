import { useState } from 'react';
import CalculationTrace from './CalculationTrace';
import MetricMeaning from './MetricMeaning';

const STATES = { present: 'Đủ 3 số', partial: 'Có một phần', absent: 'Không có số nào' };
const PRESENCE = { both: 'Có trong ngày sinh và tên', birth: 'Chỉ có trong ngày sinh', name: 'Chỉ có trong tên', neither: 'Không có trong ngày sinh lẫn tên' };
const DATE_METRICS = [['lifePath', 'Đường đời'], ['birthday', 'Ngày sinh'], ['attitude', 'Thái độ']];
const NAME_METRICS = [['expression', 'Biểu đạt'], ['soulUrge', 'Linh hồn'], ['personality', 'Nhân cách'], ['maturity', 'Trưởng thành']];
const CELL = { 3: [0.5, 0.5], 6: [1.5, 0.5], 9: [2.5, 0.5], 2: [0.5, 1.5], 5: [1.5, 1.5], 8: [2.5, 1.5], 1: [0.5, 2.5], 4: [1.5, 2.5], 7: [2.5, 2.5] };
const NODES = { p3: [50, 13], p1: [28, 34], p2: [72, 34], month: [16, 58], day: [50, 58], year: [84, 58], p4: [50, 86] };
const EDGES = [['month', 'p1'], ['day', 'p1'], ['day', 'p2'], ['year', 'p2'], ['p1', 'p3'], ['p2', 'p3'], ['month', 'p4'], ['year', 'p4']];

const format = iso => iso.split('-').reverse().join('/');
const yearsOf = period => period.endDate ? `${period.startDate.slice(0, 4)}–${period.endDate.slice(0, 4)}` : `Từ ${period.startDate.slice(0, 4)}`;
const closedYears = periods => periods.reduce((sum, period) => sum + (period.endAgeInclusive === null ? 0 : period.endAgeInclusive - period.startAgeInclusive + 1), 0);
const trackGrow = (period, total) => (period.endAgeInclusive === null ? Math.max(1, total * 0.22) : period.endAgeInclusive - period.startAgeInclusive + 1);

export default function NumerologyAdvanced({ birthGrid, nameChart, combinedChart, cycles, pinnacles, metrics, indicators, onViewDate, includeName = false }) {
  const [lineId, setLineId] = useState(null);
  const [periodId, setPeriodId] = useState(pinnacles.periods.find(period => period.active).id);
  const selectedLine = birthGrid.lines.find(line => line.id === lineId);
  const selected = pinnacles.periods.find(period => period.id === periodId) || pinnacles.periods.find(period => period.active);
  const highlighted = new Set(selectedLine?.digits || []);
  const month = pinnacles.components.month.value;
  const day = pinnacles.components.day.value;
  const year = pinnacles.components.year.value;
  const nodeText = {
    month: ['Tháng đã rút gọn', month, 'Master tắt'],
    day: ['Ngày đã rút gọn', day, 'Master tắt'],
    year: ['Năm đã rút gọn', year, 'Master tắt'],
    p1: ['Đỉnh 1', pinnacles.periods[0].pinnacle.value, 'Tháng + ngày'],
    p2: ['Đỉnh 2', pinnacles.periods[1].pinnacle.value, 'Ngày + năm'],
    p3: ['Đỉnh 3', pinnacles.periods[2].pinnacle.value, 'Đỉnh 1 + đỉnh 2'],
    p4: ['Đỉnh 4', pinnacles.periods[3].pinnacle.value, 'Tháng + năm']
  };

  return <div className="num-advanced">
    <section className="num-chapter" id="bieu-do-ngay-sinh" aria-labelledby="num-grid-heading">
      <div className="section-kicker">NHỮNG CHỮ SỐ TRONG NGÀY SINH</div><h2 id="num-grid-heading">Biểu đồ ngày sinh</h2>
      <p>Mỗi ô cho biết số lần một chữ số xuất hiện. Ô không có số chỉ mô tả ngày sinh, không phải đánh giá năng lực của bạn. Số lặp chỉ là số lần đếm được.</p>
      <div className="num-grid-layout"><div>
        <p className="num-grid-caption">Chữ số và số lần xuất hiện</p>
        <div className="num-grid-frame">
          <table className="num-birth-grid"><tbody>
            {birthGrid.layout.map(row => <tr key={row.join('-')}>{row.map(digit => <td key={digit} aria-label={`Số ${digit}: ${birthGrid.counts[digit]} lần`} className={`${birthGrid.counts[digit] ? 'num-cell-present' : 'num-cell-empty'}${highlighted.has(digit) ? ' is-lit' : ''}${birthGrid.counts[digit] > 1 ? ' is-repeat' : ''}`}>
              <b>{digit}</b><span>{birthGrid.counts[digit] ? `${birthGrid.counts[digit]} lần` : 'Không xuất hiện'}</span>
            </td>)}</tr>)}
          </tbody></table>
          {selectedLine && <svg className="num-line-overlay" viewBox="0 0 3 3" preserveAspectRatio="none" aria-hidden="true" focusable="false">
            <polyline className={`is-${selectedLine.state}`} points={selectedLine.digits.map(digit => CELL[digit].join(',')).join(' ')} />
          </svg>}
        </div>
        <p className="num-grid-zero">Bỏ qua {birthGrid.ignoredZeroCount} chữ số 0 trong định dạng DDMMYYYY.</p>
      </div><div><h3>Tám tuyến số</h3>
        <ul className="num-lines">{birthGrid.lines.map(line => <li key={line.id}>
          <button type="button" aria-pressed={lineId === line.id} onClick={() => setLineId(lineId === line.id ? null : line.id)}>
            <strong>{line.digits.join(' – ')}</strong><span>{STATES[line.state]}</span>
          </button>
        </li>)}</ul>
        <p className="num-disclaimer">{birthGrid.lineLayer?.disclaimer}</p>
        <p className="num-disclaimer">{selectedLine ? `Đang xem tuyến ${selectedLine.digits.join('–')}: ${STATES[selectedLine.state]}. ${selectedLine.state === 'present' ? selectedLine.note || '' : 'Tuyến chưa đủ số nên không gắn tên mũi tên. Ô trống không phải điểm yếu.'}` : 'Chọn một tuyến để vẽ tuyến đó trên lưới. Tuyến đủ số là nét liền, một phần là nét đứt, không có số là nét chấm.'}</p>
      </div></div>
    </section>

    <section className="num-chapter" id="bieu-do-ten" aria-labelledby="num-name-chart-heading">
      <div className="section-kicker">CHỮ CÁI ĐÃ CHUẨN HÓA</div><h2 id="num-name-chart-heading">Biểu đồ tên</h2>
      {nameChart.status !== 'available' ? <p>Chưa có tên nên không có biểu đồ tên. Biểu đồ này chỉ đếm chữ, không dùng mũi tên của biểu đồ ngày sinh.</p> : <>
        <p className={includeName ? undefined : 'num-omit-print'}>Tên chuẩn hóa <strong>{nameChart.normalized}</strong>. Mỗi chữ cộng một lần vào ô đúng giá trị Pythagorean. Đây không phải mũi tên tính cách.</p>
        {!includeName && <p className="num-print-only">Biểu đồ tên đếm giá trị chữ. Họ tên không được in vì bạn chưa chọn kèm họ tên.</p>}
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
        <p>Mỗi ô đếm riêng ngày sinh và tên. Không kết luận tên làm thay đổi năng lực.</p>
        <ul className="num-legend" aria-label="Chú giải nguồn">
          <li className="is-both">Có ở cả hai</li>
          <li className="is-birth">Chỉ ngày sinh</li>
          <li className="is-name">Chỉ tên</li>
          <li className="is-neither">Không có ở cả hai</li>
        </ul>
        <div className="num-dual-grid" aria-hidden="true">{birthGrid.layout.map(row => row.map(digit => {
          const item = combinedChart.digits.find(entry => entry.digit === digit);
          return <div key={digit} className={`num-dual is-${item.presence}`}><b>{digit}</b><span>Ngày {item.birth}</span><span>Tên {item.name}</span></div>;
        }))}</div>
        <table className="num-combined"><caption>Nguồn của từng chữ số</caption><thead><tr><th>Số</th><th>Ngày sinh</th><th>Tên</th><th>Ở đâu</th></tr></thead><tbody>
          {combinedChart.digits.map(item => <tr key={item.digit}><td>{item.digit}</td><td>{item.birth}</td><td>{item.name}</td><td>{PRESENCE[item.presence]}</td></tr>)}
        </tbody></table>
      </>}
    </section>

    <section className="num-chapter num-cycle-section" id="chu-ky" aria-labelledby="num-cycle-heading">
      <div className="section-kicker">MỘT NGÀY, MỘT GÓC NHÌN</div><h2 id="num-cycle-heading">Chu kỳ cá nhân</h2>
      <p className="num-cycle-date">Ngày xem: <strong>{format(cycles.targetDate)}</strong> · Năm {cycles.year}</p>
      <p>Quy ước năm dương lịch từ 01/01 đến 31/12, không đổi vào sinh nhật. Các chu kỳ rút gọn về 1–9. Chín ô năm là một vòng Năm cá nhân chứa năm đang xem, không phải đường tăng hay giảm. Chọn năm hoặc tháng sẽ xem ngày do máy chủ chỉ định, không sớm hơn ngày sinh. Ô trước ngày sinh không bấm được.</p>
      <div className="num-year-band" role="group" aria-label="Chín năm cá nhân">{cycles.yearBand.map(item => <button type="button" key={item.year} aria-pressed={item.selected} disabled={item.viewDate === null} onClick={() => item.viewDate && onViewDate(item.viewDate)}>
        <span>{item.year}</span><strong>{item.personalYear.value}</strong>
      </button>)}</div>
      <h3>Mười hai tháng của năm {cycles.year}</h3>
      <div className="num-month-band" role="group" aria-label="Mười hai tháng cá nhân">{cycles.months.map(item => <button type="button" key={item.month} aria-pressed={item.selected} disabled={item.viewDate === null} onClick={() => item.viewDate && onViewDate(item.viewDate)}>
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
      <div className="num-diagram" role="group" aria-label="Sơ đồ bốn đỉnh. Đáy là tháng, ngày và năm đã rút gọn với master tắt.">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
          {EDGES.map(([from, to]) => <line key={`${from}-${to}`} data-edge={`${from}-${to}`} className={to === 'p4' ? 'is-base-p4' : undefined} x1={NODES[from][0]} y1={NODES[from][1]} x2={NODES[to][0]} y2={NODES[to][1]} />)}
        </svg>
        {Object.entries(NODES).map(([id, [x, y]]) => {
          const [label, value, edge] = nodeText[id];
          const period = pinnacles.periods.find(item => item.id === id);
          const body = <><span>{label}</span><strong>{value}</strong>{period?.pinnacle.isMaster && <small>Số đặc biệt · Gốc {period.pinnacle.rootValue}</small>}<small>{edge}</small>{period?.active && <small>Đang diễn ra</small>}</>;
          return period ? <button type="button" key={id} className={selected.id === id ? 'num-node is-selected' : 'num-node'} style={{ left: `${x}%`, top: `${y}%` }} aria-pressed={selected.id === id} onClick={() => setPeriodId(id)}>{body}</button>
            : <span key={id} className="num-node is-base" style={{ left: `${x}%`, top: `${y}%` }}>{body}</span>;
        })}
      </div>
      <p className="num-sr">Đỉnh 1 nối tháng {month} và ngày {day}. Đỉnh 2 nối ngày {day} và năm {year}. Đỉnh 3 nối đỉnh 1 và đỉnh 2. Đỉnh 4 nối tháng {month} và năm {year}. Đỉnh 4 không nối với đỉnh 3.</p>
      <p className="num-disclaimer">Nét liền đi tới đỉnh 1, đỉnh 2 và đỉnh 3. Nét đứt đi từ tháng và năm tới đỉnh 4. Ba số đáy có master tắt. Đây không phải chu kỳ period của trường phái khác.</p>
      <div className="num-timeline" role="group" aria-label="Trục tuổi bốn thử thách">
        <div className="num-age-track" aria-hidden="true">{pinnacles.periods.map(period => <span key={period.id} className={`${period.id === selected.id ? 'is-selected' : ''}${period.endAgeInclusive === null ? ' is-open' : ''}`} data-active={period.active ? 'true' : 'false'} style={{ flexGrow: trackGrow(period, closedYears(pinnacles.periods)) }}>{period.startAgeInclusive}</span>)}</div>
        <p className="num-disclaimer">Các giai đoạn đã có tuổi kết thúc được vẽ theo số năm. Giai đoạn cuối không có tuổi kết thúc nên chỉ là đoạn mở, không phải một số năm đã tính.</p>
        {pinnacles.periods.map((period, index) => {
          const range = period.endAgeInclusive === null ? `Từ ${period.startAgeInclusive} tuổi` : `${period.startAgeInclusive}–${period.endAgeInclusive} tuổi`;
          const dates = period.endDate === null ? `Từ ${format(period.startDate)}` : `${format(period.startDate)} – ${format(period.endDate)}`;
          return <button type="button" key={period.id} className={period.id === selected.id ? 'is-selected' : undefined} data-active={period.active ? 'true' : 'false'} aria-pressed={period.id === selected.id} onClick={() => setPeriodId(period.id)}>
            <span>{range}</span>
            <span className="num-timeline-years">{yearsOf(period)}</span>
            <strong>{period.challenge.value}</strong>
            <span>Thử thách {index + 1}</span>
            <small>| {period.challenge.operands[0]} − {period.challenge.operands[1]} |</small>
            <small>{dates}</small>
            {period.challenge.value === 0 && <small>Hiệu 0, không đổi thành 9</small>}
            {period.active && <small>Đang diễn ra</small>}
          </button>;
        })}
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
            <div><h4>Thử thách</h4><output className="num-value" aria-label={`Thử thách giai đoạn ${index + 1}`}>{period.challenge.value}</output><p>Hiệu tuyệt đối của {period.challenge.operands[0]} và {period.challenge.operands[1]}.</p>{period.challenge.value === 0 && <p>Hai thành phần bằng nhau nên hiệu là 0. Số 0 được giữ nguyên, không đổi thành 9. Chưa có bài đã duyệt: một tài liệu gắn chủ đề rộng của số 9 cho hiệu bằng 0, tài liệu khác nói là không có một thử thách riêng. Hai cách đọc khác nhau.</p>}<MetricMeaning label={`Thử thách giai đoạn ${index + 1}`} metric={period.challenge} /></div>
          </div>
        </li>;
      })}</ol>
    </section>

    <section className="num-chapter" id="chi-so-bo-sung" aria-labelledby="num-indicators-heading">
      <div className="section-kicker">CÔNG THỨC ĐÃ ĐỐI CHIẾU NGUỒN</div><h2 id="num-indicators-heading">Chỉ số bổ sung</h2>
      <p>Nhóm này dùng quy ước Hans Decoz đã công bố trên worldnumerology.com, phiên bản {indicators?.version || '1.0.0'}. Không đổi các số của hồ sơ pythagorean-vn-v1 1.2.0. Chưa có bài luận đã duyệt cho các số này.</p>
      {!indicators || indicators.hiddenPassion?.status !== 'available' ? <p>Chưa có tên nên không tính các chỉ số bổ sung từ tên.</p> : <>
        <div className="num-dash-grid">
          <article><span>Đam mê ẩn</span><strong>{indicators.hiddenPassion.values.join(', ')}</strong><small>Giá trị chữ xuất hiện nhiều nhất: {indicators.hiddenPassion.count} lần. Hòa thì giữ mọi giá trị.</small><details className="num-trace"><summary>Cách tính Đam mê ẩn</summary><p>{[1, 2, 3, 4, 5, 6, 7, 8, 9].map(digit => `${digit}: ${indicators.hiddenPassion.counts[digit]}`).join(' · ')}</p></details></article>
          <article><span>Bài học từ tên</span><strong>{indicators.karmicLessons.values.length ? indicators.karmicLessons.values.join(', ') : 'Không thiếu'}</strong><small>Số 1–9 không có trong tên. Khác với ô trống của ngày sinh.</small></article>
          <article><span>Cân bằng</span><strong>{indicators.balance.value}</strong><small>Tổng chữ cái đầu mỗi phần tên, rút gọn, không giữ master.</small><CalculationTrace label="Cân bằng" metric={indicators.balance} /></article>
          <article><span>Tư duy</span><strong>{indicators.rationalThought.value}</strong><small>Phần tên đứng đầu <span className={includeName ? 'num-indicator-token' : 'num-indicator-token num-omit-print'}>“{indicators.rationalThought.token}”</span> đã rút, cộng ngày dương lịch {indicators.rationalThought.calendarDay}, không giữ master.</small><CalculationTrace label="Tư duy" metric={indicators.rationalThought} /></article>
        </div>
        <p className="num-disclaimer">“Phần tên đứng đầu” là token đầu sau khi chuẩn hóa. Với họ tên Việt ghi họ trước, đó là họ, không phải tên gọi. Decoz dùng first name kiểu phương Tây.</p>
      </>}
      {indicators && <ul className="num-relations">{indicators.bridges.map(item => <li key={item.id}>{item.status === 'available' ? `Cầu ${item.id}: hiệu tuyệt đối của ${item.operands[0]} và ${item.operands[1]} là ${item.value}.` : 'Cầu này cần đủ hai số đã tính.'}</li>)}</ul>}
      <p className="num-disclaimer">Cầu lấy đúng số đã công bố, kể cả 11, 22, 33, và không rút tiếp. Hiệu 0 nghĩa là hai số bằng nhau. Hiệu lớn hơn 9 chưa có bài số đơn.</p>
    </section>

    <section className="num-chapter" id="quan-he" aria-labelledby="num-relations-heading">
      <div className="section-kicker">CHỈ NHỮNG MỐI NỐI CÓ PHÉP TÍNH</div><h2 id="num-relations-heading">Các mối nối đã định nghĩa</h2>
      <ul className="num-relations">
        <li>Từ ngày sinh: {DATE_METRICS.map(([id, label]) => `${label} ${metrics[id].value}`).join(', ')}.</li>
        <li>{metrics.expression.status === 'available' ? `Từ tên: ${NAME_METRICS.map(([id, label]) => `${label} ${metrics[id].value}`).join(', ')}.` : 'Chưa có tên nên không có nhóm chỉ số từ tên, và không có số Trưởng thành.'}</li>
        {metrics.maturity.status === 'available' && <li>Trưởng thành = Đường đời {metrics.lifePath.value} + Biểu đạt {metrics.expression.value}.</li>}
        {metrics.lifePath.isMaster && <li>Đường đời giữ số đặc biệt {metrics.lifePath.value}. Gốc dùng cho tuổi đỉnh là {metrics.lifePath.rootValue}.</li>}
        <li>Đỉnh 1 = tháng {month} + ngày {day}. Đỉnh 2 = ngày {day} + năm {year}. Đỉnh 3 = đỉnh 1 + đỉnh 2. Đỉnh 4 = tháng {month} + năm {year}.</li>
        {indicators?.hiddenPassion?.status === 'available' && <li>Đam mê ẩn là giá trị chữ xuất hiện nhiều nhất trong tên: {indicators.hiddenPassion.values.join(', ')}. Bài học từ tên là số vắng trong tên, không phải ô trống của ngày sinh.</li>}
        {indicators?.bridges?.filter(item => item.status === 'available').map(item => <li key={item.id}>Cầu {item.id} = |{item.operands[0]} − {item.operands[1]}| = {item.value}.</li>)}
        <li>Thử thách là hiệu tuyệt đối của cùng các cặp đó. Thử thách 3 là hiệu của thử thách 1 và thử thách 2.</li>
        <li>Năm cá nhân dùng ngày sinh và năm xem. Tháng cá nhân cộng thêm tháng xem. Ngày cá nhân cộng thêm ngày xem.</li>
      </ul>
      <p className="num-disclaimer">Các câu trên chỉ nhắc lại phép tính. Chưa có thang điểm hợp hay mâu thuẫn giữa các chỉ số.</p>
    </section>
  </div>;
}
