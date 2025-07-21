import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import * as auth from '../utils/auth';

// Mock the auth module
jest.mock('../utils/auth');

const mockedAuth = auth;

// Mock component for testing
const TestComponent = () => <div>Protected Content</div>;

// Helper function to render with router
const renderWithRouter = (component, initialEntries = ['/']) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      {component}
    </MemoryRouter>
  );
};

describe('ProtectedRoute', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders children when user has school role', () => {
    mockedAuth.getUser.mockReturnValue({ email: 'school@example.com', role: 'school' });
    mockedAuth.getRole.mockReturnValue('school');

    renderWithRouter(
      <ProtectedRoute role="school">
        <TestComponent />
      </ProtectedRoute>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  test('redirects to login when user has different role', () => {
    mockedAuth.getUser.mockReturnValue({ email: 'student@example.com', role: 'student' });
    mockedAuth.getRole.mockReturnValue('student');

    renderWithRouter(
      <ProtectedRoute role="school">
        <TestComponent />
      </ProtectedRoute>
    );

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  test('redirects to login when user is not authenticated', () => {
    mockedAuth.getUser.mockReturnValue(null);
    mockedAuth.getRole.mockReturnValue(null);

    renderWithRouter(
      <ProtectedRoute role="school">
        <TestComponent />
      </ProtectedRoute>
    );

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  test('renders children when no role is specified and user is authenticated', () => {
    mockedAuth.getUser.mockReturnValue({ email: 'user@example.com' });
    mockedAuth.getRole.mockReturnValue('student');

    renderWithRouter(
      <ProtectedRoute>
        <TestComponent />
      </ProtectedRoute>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  test('redirects to login when no role is specified and user is not authenticated', () => {
    mockedAuth.getUser.mockReturnValue(null);
    mockedAuth.getRole.mockReturnValue(null);

    renderWithRouter(
      <ProtectedRoute>
        <TestComponent />
      </ProtectedRoute>
    );

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });
});
