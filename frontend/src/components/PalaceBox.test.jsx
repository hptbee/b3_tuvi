import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PalaceBox from './PalaceBox';

const data = {
  cungName: 'MỆNH',
  fullCanChi: 'Giáp Tý',
  chiName: 'Tý',
  majorStars: ['Tử Vi'],
  goodStars: ['Tả Phù'],
  badStars: ['Kình Dương'],
  trangSinh: 'Tràng Sinh',
  daiHan: 22,
  thang: 1,
  isTuan: false,
  isTriet: false
};

it('exposes palace and star controls to the keyboard', async () => {
  const onPalaceClick = vi.fn();
  const onStarClick = vi.fn();
  const user = userEvent.setup();
  render(<PalaceBox data={data} position={1} onPalaceClick={onPalaceClick} onStarClick={onStarClick} />);
  const palace = screen.getByRole('button', { name: /MỆNH/ });
  palace.focus();
  await user.keyboard('{Enter}');
  expect(onPalaceClick).toHaveBeenCalledWith('MỆNH');
  await user.click(screen.getByRole('button', { name: 'Tử Vi' }));
  expect(onStarClick).toHaveBeenCalledWith('Tử Vi', 'MỆNH');
});

it('renders an empty palace when data is missing', () => {
  const { container } = render(<PalaceBox data={null} position={1} />);
  expect(container.querySelector('.empty')).toBeTruthy();
});
