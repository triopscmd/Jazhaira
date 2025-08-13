import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import AuthLayout from '../../src/components/auth/AuthLayout';

describe('AuthLayout', () => {
  it('should render its children content', () => {
    const testContent = 'This is authentication content';
    render(<AuthLayout>{testContent}</AuthLayout>);
    expect(screen.getByText(testContent)).toBeInTheDocument();
  });
});