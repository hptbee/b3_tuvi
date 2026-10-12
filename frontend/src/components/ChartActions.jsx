import { downloadChartJson } from '../chartExport';

export default function ChartActions({ chartData }) {
  return (
    <div className="chart-actions">
      <button type="button" onClick={() => window.print()}>In lá số</button>
      <button type="button" onClick={() => downloadChartJson(chartData)}>Tải JSON</button>
      <p>Bản in và file JSON là lá số vừa lập. Không kèm luận giải đã duyệt.</p>
    </div>
  );
}
