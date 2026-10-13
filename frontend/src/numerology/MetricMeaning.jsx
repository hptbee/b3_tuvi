export default function MetricMeaning({ label, metric }) {
  if (metric.status !== 'available') return null;
  if (metric.meaningStatus === 'withheld') {
    if (metric.value === 0 && metric.meaningReason === 'content_not_in_scope') return null;
    return <p className="num-meaning-withheld">{metric.meaningReason === 'source_unavailable' ? `Chưa có lời luận đủ căn cứ cho số ${metric.value}.` : 'Lời luận đang chờ đủ điều kiện hiển thị.'}</p>;
  }
  const meaning = metric.meaning;
  return <section className="num-reading">
    <h4>Lời luận tham khảo · {label}</h4>
    <p className="num-reading-title">{meaning.title}</p><p>{meaning.summary}</p>
    <h5>Câu hỏi để tự suy ngẫm</h5><ul>{meaning.reflectionPrompts.map((prompt, index) => <li key={index}>{prompt}</li>)}</ul>
    <details className="num-reading-source"><summary>Nguồn và giới hạn của lời luận</summary>
      <p>Nội dung biên tập thử nghiệm, dùng chủ đề số từ nguồn cộng đồng để gợi suy ngẫm. Câu hỏi và ngữ cảnh từng chỉ số do ứng dụng biên tập; đây không phải lời luận đã được chuyên gia xác minh.</p>
      <ul>{meaning.sourceReferences.map(source => <li key={source.id}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.title}</a> · tham khảo chủ đề số {meaning.value}</li>)}</ul>
      {meaning.limitations.map((limit, index) => <p key={index}>{limit}</p>)}
    </details>
  </section>;
}
