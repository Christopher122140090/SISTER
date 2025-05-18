import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Kontrol Rumah Pintar heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/Kontrol Rumah Pintar/i);
  expect(headingElement).toBeInTheDocument();
});
