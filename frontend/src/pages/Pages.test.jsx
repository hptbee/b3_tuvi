import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { KienThuc, TaiLieu, LuanGiai, LienHe } from './Pages';

afterEach(cleanup);
const show = element => render(<MemoryRouter>{element}</MemoryRouter>);

it('offers working calculator guidance with published conventions and limits', () => {
  show(<KienThuc />);
  expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
  expect(screen.getByRole('link', { name: /Lập lá số Tử Vi/ })).toHaveAttribute('href', '/la-so');
  expect(screen.getByRole('link', { name: /Tính chỉ số Thần số học/ })).toHaveAttribute('href', '/than-so-hoc');
  expect(screen.getByText(/Y luôn là phụ âm/)).toBeVisible();
  expect(screen.getByText(/chưa được chuyên gia hoặc ấn bản sách xác minh/)).toBeVisible();
  expect(screen.getByRole('complementary', { name: 'Dữ liệu riêng tư' })).toHaveTextContent('Đường dẫn chia sẻ lá số Tử Vi chứa thông tin sinh');
});

it('links actual primary resources and distinguishes their relevance from approval', () => {
  show(<TaiLieu />);
  expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
  const stems = screen.getByRole('link', { name: 'Can Chi và giờ theo Địa Chi' });
  expect(stems).toHaveAttribute('href', 'https://www.hko.gov.hk/en/gts/time/stemsandbranches.htm');
  expect(stems).toHaveAttribute('rel', 'noopener noreferrer');
  expect(screen.getByRole('link', { name: 'Cách tính theo Hans Decoz' })).toHaveAttribute('href', 'https://www.worldnumerology.com/do-your-own-reading/');
  expect(screen.getByText(/không mặc định bảng Hong Kong trùng/)).toBeVisible();
  expect(screen.getByRole('complementary', { name: 'Trạng thái kiểm chứng' })).toHaveTextContent('chưa chứng minh đúng mọi trường phái');
});

it('keeps public Tu Vi prose gated while offering structured evidence and numerology entry', () => {
  show(<LuanGiai />);
  expect(screen.getByText(/Chưa có lời luận Tử Vi công khai đã được duyệt/)).toBeVisible();
  expect(screen.getByRole('link', { name: 'Mở lá số và chứng cứ' })).toHaveAttribute('href', '/la-so');
  expect(screen.getByRole('link', { name: 'Mở báo cáo Thần số học' })).toHaveAttribute('href', '/than-so-hoc');
});

it('uses the repository feedback destination without an invented private inbox', () => {
  show(<LienHe />);
  expect(screen.getByRole('link', { name: 'Mở trang góp ý trên GitHub' })).toHaveAttribute('href', 'https://github.com/hptbee/b3_tuvi/issues');
  expect(screen.getByText(/Trang góp ý công khai/)).toHaveTextContent('Không cần gửi họ tên, ngày giờ sinh thật');
  expect(document.body.textContent).not.toContain('contact@tuvivietnam.vn');
});
