import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChartActions from './ChartActions';

it('prints and downloads the current chart', async () => {
  const user = userEvent.setup();
  const print = vi.fn();
  window.print = print;
  render(<ChartActions chartData={{ tuviInfo: { menh: 1, boxes: {} }, lunarInfo: {} }} />);
  await user.click(screen.getByRole('button', { name: 'In lá số' }));
  expect(print).toHaveBeenCalled();

  const click = vi.fn();
  const original = document.createElement.bind(document);
  vi.spyOn(document, 'createElement').mockImplementation((tag) => {
    const element = original(tag);
    if (tag === 'a') element.click = click;
    return element;
  });
  URL.createObjectURL = () => 'blob:chart';
  URL.revokeObjectURL = () => {};
  await user.click(screen.getByRole('button', { name: 'Tải JSON' }));
  expect(click).toHaveBeenCalled();
  expect(screen.getByText(/Không kèm luận giải đã duyệt/)).toBeTruthy();
  vi.restoreAllMocks();
});
