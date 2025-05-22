import { LoadingButton } from '@/_components';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, expect, test } from 'vitest';

afterEach(() => {
  cleanup();
});

test('LoadingButton renders children when isLoading is false', () => {
  render(<LoadingButton isLoading={false}>Test</LoadingButton>);

  expect(screen.getByText('Test')).toBeDefined();
  expect(screen.queryByTestId('loader')).toBeNull();
});

test('LoadingButton renders loader when isLoading is true', () => {
  render(<LoadingButton isLoading>Test</LoadingButton>);

  expect(screen.queryByText('Test')).toBeNull();
  expect(screen.getByTestId('spinner')).toBeDefined();
});

