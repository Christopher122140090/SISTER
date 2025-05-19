import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Status Perangkat Rumah Pintar heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/Status Perangkat Rumah Pintar/i);
  expect(headingElement).toBeInTheDocument();
});
