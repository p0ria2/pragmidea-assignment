import { NumSelector } from '@/_components';
import { cleanup, render, screen } from '@testing-library/react';
import { test, expect, afterEach } from 'vitest';

afterEach(() => {
  cleanup();
});

test('NumSelector renders correctly', () => {
  render(<NumSelector value={10} />);
  expect(screen.getByText('10')).toBeDefined();
});

test('NumSelector clamps value less than min', () => {
  render(<NumSelector value={1} min={5} max={15} />);
  expect(screen.getByText('5')).toBeDefined();
});

test('NumSelector clamps value greater than max', () => {
  render(<NumSelector value={20} min={5} max={15} />);
  expect(screen.getByText('15')).toBeDefined();
});

