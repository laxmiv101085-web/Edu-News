import { render, screen } from '@testing-library/react';
import Home from '../pages/index';

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('Home Page', () => {
  it('renders the landing page', () => {
    render(<Home />);
    expect(screen.getByText(/Stay Updated with Educational News/i)).toBeInTheDocument();
  });

  it('has a sign up button', () => {
    render(<Home />);
    expect(screen.getByText(/Get Started/i)).toBeInTheDocument();
  });
});

