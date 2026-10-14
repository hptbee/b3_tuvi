import { Link } from 'react-router-dom';
import './Pages.css';

function GuidePage({ kicker, title, intro, children }) {
  return <section className="product-guide" aria-labelledby="guide-title">
    <header className="page-intro"><div className="section-kicker">{kicker}</div><h1 id="guide-title">{title}</h1><p>{intro}</p></header>
    {children}
  </section>;
}

const RESOURCES = [
  { title: 'Can Chi và giờ theo Địa Chi', publisher: 'Hong Kong Observatory · tài liệu lịch',
    href: 'https://www.hko.gov.hk/en/gts/time/stemsandbranches.htm',
    description: 'Tham khảo thuật ngữ, thứ tự Thiên Can, Địa Chi và chu kỳ Can Chi. Đây không phải nguồn duyệt lời luận Tử Vi.' },
  { title: 'Bảng đối chiếu dương lịch và âm lịch', publisher: 'Hong Kong Observatory · bảng theo năm',
    href: 'https://www.hko.gov.hk/en/gts/time/conversion.htm',
    description: 'Bảng lịch tham khảo cho năm 1901–2100. Khi đối chiếu ngày sinh, cần xét quy ước lịch và múi giờ; không mặc định bảng Hong Kong trùng mọi ngày âm lịch Việt Nam.' },
  { title: 'Cách tính theo Hans Decoz', publisher: 'World Numerology · phương pháp của tác giả',
    href: 'https://www.worldnumerology.com/do-your-own-reading/',
    description: 'Hướng dẫn tính thủ công. Một số quy ước khác hồ sơ đang dùng trong ứng dụng, gồm cách cộng Đường đời và cách xử lý Y. Đọc nguồn không tự đổi các số của báo cáo hiện tại.' },
  { title: 'Đỉnh cao và các giai đoạn', publisher: 'World Numerology · phương pháp Decoz',
    href: 'https://www.worldnumerology.com/numerology-pinnacles/',
    description: 'Nguồn tham khảo cho phép tính và các giai đoạn đỉnh cao. Hồ sơ của ứng dụng công bố riêng quy ước rút gọn và cửa sổ tuổi.' },
  { title: 'Thử thách và giới hạn thời lượng', publisher: 'World Numerology · phương pháp Decoz',
    href: 'https://www.worldnumerology.com/numerology-challenges/',
    description: 'Tham khảo phép tính thử thách. Thời lượng và cách diễn giải có thể khác quy ước của báo cáo; ứng dụng vẫn giữ thử thách 0 và chưa có bài luận đã duyệt cho số này.' }
];

export const KienThuc = () => <GuidePage kicker="ĐỌC KẾT QUẢ CÓ CĂN CỨ" title="Hiểu cách đọc kết quả" intro="Bắt đầu từ dữ liệu đã tính, mở cách tính và xem nguồn trước khi đọc lời gợi suy ngẫm.">
  <div className="guide-grid">
    <article className="guide-card"><h2>Lá số Tử Vi</h2><p>Nhập ngày sinh dương lịch, giờ sinh theo giờ Việt Nam và giới tính để lập lá số. Lá số hiển thị 12 cung, vị trí sao và các cách cục khớp quy tắc đang dùng.</p><p>Mục chứng cứ giúp xem trạng thái nguồn và điều kiện của từng kết quả. Khớp quy tắc chưa đồng nghĩa với một lời luận đã được duyệt.</p><Link className="text-link" to="/la-so">Lập lá số Tử Vi →</Link></article>
    <article className="guide-card"><h2>Báo cáo Thần số học</h2><p>Ngày sinh đủ để tính Đường đời, Ngày sinh và Thái độ. Thêm họ tên để tính nhóm chỉ số từ tên, xem biểu đồ tên và biểu đồ ghép.</p><p>Chọn ngày xem chu kỳ, mở từng bước tính, xem các giai đoạn đỉnh cao, tải hoặc nhập JSON và in kết quả.</p><Link className="text-link" to="/than-so-hoc">Tính chỉ số Thần số học →</Link></article>
    <article className="guide-card"><h2>Quy ước tên và ngày</h2><p>Hồ sơ pythagorean-vn-v1 1.2.0 cộng toàn bộ chữ số ngày sinh cho Đường đời. Tên được bỏ dấu, Đ thành D và Y luôn là phụ âm; chu kỳ dùng năm dương lịch.</p><p>Các phương pháp khác có thể cho kết quả khác. Hãy xem quy ước trong báo cáo trước khi so sánh hai công cụ.</p><Link className="text-link" to="/tai-lieu">Xem nguồn để đối chiếu →</Link></article>
    <article className="guide-card"><h2>Lời luận và giới hạn</h2><p>Lời Thần số học hiện có là nội dung biên tập thử nghiệm để gợi suy ngẫm, chưa được chuyên gia hoặc ấn bản sách xác minh. Số 33, thử thách 0 và nhóm chỉ số bổ sung chưa có bài luận đã duyệt.</p><p>Tử Vi giữ riêng kết quả tính, trạng thái nguồn và điều kiện luận giải. Các con số và học thuyết không phải đánh giá khoa học về tính cách hoặc tương lai.</p><Link className="text-link" to="/luan-giai">Hiểu trạng thái luận giải →</Link></article>
  </div>
  <aside className="guide-note" aria-label="Dữ liệu riêng tư"><h2>Giữ quyền chọn khi chia sẻ</h2><p>Không cần tài khoản. JSON và bản in là dữ liệu bạn chủ động xuất; bỏ họ tên không biến các con số thành dữ liệu ẩn danh. Đường dẫn chia sẻ lá số Tử Vi chứa thông tin sinh và có thể xuất hiện trong lịch sử trình duyệt.</p></aside>
</GuidePage>;

export const TaiLieu = () => <GuidePage kicker="NGUỒN VÀ QUY ƯỚC" title="Nguồn để đối chiếu" intro="Các liên kết giúp kiểm tra lịch và phương pháp tính. Đọc được một trang không đồng nghĩa mọi công thức hoặc lời luận đã được xác minh.">
  <div className="guide-grid">{RESOURCES.map(resource => <article className="guide-card" key={resource.href}><p className="guide-publisher">{resource.publisher}</p><h2><a href={resource.href} target="_blank" rel="noopener noreferrer">{resource.title}</a></h2><p>{resource.description}</p><span className="guide-link-note">Mở nguồn trong thẻ mới</span></article>)}</div>
  <aside className="guide-note" aria-label="Trạng thái kiểm chứng"><h2>Nguồn, công thức và lời luận là các lớp riêng</h2><p>Một nguồn lịch có thể giải thích thứ tự Can Chi mà không xác minh phép an sao. Một phép tính chạy đúng theo hồ sơ chưa chứng minh đúng mọi trường phái. Bài biên tập được hiển thị trong bản thử nghiệm chưa phải kết luận được chuyên gia duyệt.</p><Link className="text-link" to="/kien-thuc">Trở lại hướng dẫn đọc kết quả →</Link></aside>
</GuidePage>;

export const LuanGiai = () => <GuidePage kicker="TRẠNG THÁI NỘI DUNG" title="Hiểu trạng thái luận giải" intro="Xem kết quả đã tính cùng điều kiện và chứng cứ để biết điều gì đã có, điều gì còn thiếu.">
  <div className="guide-grid">
    <article className="guide-card"><h2>Tử Vi: xem phân tích có cấu trúc</h2><p>Chưa có lời luận Tử Vi công khai đã được duyệt. Trên lá số, bạn có thể mở chứng cứ theo cung, quan hệ và cách cục; trạng thái cho biết điều kiện hoặc nguồn nào còn thiếu.</p><p>Vị trí sao theo năm xem không tự tạo lời dự đoán vận hạn. Khớp quy tắc và đối chiếu nguồn vẫn tách khỏi quyền xuất bản lời luận hoặc lời kể của AI.</p><Link className="primary-button" to="/la-so">Mở lá số và chứng cứ</Link></article>
    <article className="guide-card"><h2>Thần số học: đọc cùng cách tính</h2><p>Báo cáo có lời gợi suy ngẫm ở các chỉ số đã có bài biên tập thử nghiệm. Mỗi mục giữ cách tính và giới hạn; khi chưa đủ căn cứ, ứng dụng không mượn lời của số khác.</p><p>Số 33, thử thách 0 và các chỉ số bổ sung vẫn chưa có bài luận đã duyệt.</p><Link className="primary-button" to="/than-so-hoc">Mở báo cáo Thần số học</Link></article>
  </div><p className="guide-followup"><Link className="text-link" to="/tai-lieu">Đọc nguồn và các quy ước trước khi đối chiếu →</Link></p>
</GuidePage>;

export const LienHe = () => <GuidePage kicker="CÙNG CẢI THIỆN SẢN PHẨM" title="Góp ý cho dự án" intro="Báo lỗi hoặc đề xuất cải thiện qua trang góp ý của repository đang phát triển sản phẩm.">
  <article className="guide-card guide-feedback"><h2>Mô tả để có thể kiểm tra lại</h2><ol><li>Nêu trang và các bước đã thực hiện.</li><li>Mô tả kết quả bạn thấy và kết quả mong đợi.</li><li>Nếu đối chiếu phương pháp, kèm liên kết nguồn và quy ước bạn sử dụng.</li></ol><p>Trang góp ý công khai. Không cần gửi họ tên, ngày giờ sinh thật hoặc tệp kết quả cá nhân; hãy dùng dữ liệu mẫu khi minh họa.</p><a className="primary-button" href="https://github.com/hptbee/b3_tuvi/issues" target="_blank" rel="noopener noreferrer">Mở trang góp ý trên GitHub</a><p className="guide-link-note">Mở trong thẻ mới; cần tài khoản GitHub để đăng góp ý.</p></article>
</GuidePage>;
