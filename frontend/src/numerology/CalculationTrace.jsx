const PART_LABELS = { day: 'Ngày', month: 'Tháng', year: 'Năm', lifePath: 'Đường đời', expression: 'Biểu đạt', soulUrge: 'Nguyên âm', personality: 'Phụ âm', birthDay: 'Ngày sinh', birthMonth: 'Tháng sinh', targetYear: 'Năm xem', targetMonth: 'Tháng xem', targetDay: 'Ngày xem', personalYear: 'Năm cá nhân', personalMonth: 'Tháng cá nhân', reducedMonth: 'Tháng đã rút gọn', reducedDay: 'Ngày đã rút gọn', reducedYear: 'Năm đã rút gọn', pinnacle1: 'Đỉnh cao 1', pinnacle2: 'Đỉnh cao 2', initials: 'Chữ cái đầu', firstToken: 'Phần tên đứng đầu', namePlusDay: 'Phần tên đã rút và ngày dương lịch' };
export default function CalculationTrace({ label, metric }) {
  return <details className="num-trace"><summary>Cách tính {label}</summary>
    {metric.parts.map((part, index) => <p key={index}>{PART_LABELS[part.label] || part.label}: {part.values.join(' + ')} = {part.total}</p>)}
    {metric.steps.map((step, index) => <p key={index}>{step.input} → {step.digits.join(' + ')} = {step.output}</p>)}
    <p>{metric.keepMasters ? 'Giữ 11, 22, 33 khi xuất hiện trong quá trình rút gọn.' : 'Rút gọn về một chữ số từ 1 đến 9.'}</p>
  </details>;
}
