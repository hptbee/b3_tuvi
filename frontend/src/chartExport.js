export function chartExportDocument(chartData) {
  return {
    usage: 'user_requested_chart_export',
    approvedInterpretation: false,
    prose: null,
    lunarInfo: chartData?.lunarInfo || null,
    menh: chartData?.tuviInfo?.menh ?? null,
    than: chartData?.tuviInfo?.than ?? null,
    boxes: chartData?.tuviInfo?.boxes || null
  };
}

export function downloadChartJson(chartData) {
  const blob = new Blob([JSON.stringify(chartExportDocument(chartData), null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'la-so.json';
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
