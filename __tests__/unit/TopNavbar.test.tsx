import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, expect, test } from 'vitest';
import TopNavbar from '@/_components/TopNavbar';

afterEach(() => {
  cleanup();
});

test('TopNavbar renders correctly', () => {
  render(<TopNavbar />);
  expect(screen.getByText('Pragma Flights')).toBeDefined();
});

