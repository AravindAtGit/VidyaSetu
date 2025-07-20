import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Students from './Students';
import * as storage from '../../utils/storage';
import * as auth from '../../utils/auth';

// Mock the modules
jest.mock('../../utils/auth');
jest.mock('../../components/ProtectedRoute', () => ({ children }) => children);

// Mock fetch globally
global.fetch = jest.fn();

const mockedStorage = storage;
const mockedAuth = auth;

// Mock data
const mockStudents = [
  {
    id: 'STU123456',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '1234567890',
    class: '10th Grade',
    grade: '10th',
    createdAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 'STU789012',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '0987654321',
    class: '11th Grade',
    grade: '11th',
    createdAt: '2024-01-02T00:00:00.000Z',
    updatedAt: '2024-01-03T00:00:00.000Z'
  }
];

const renderWithRouter = (component) => {
  return render(
    <MemoryRouter>
      {component}
    </MemoryRouter>
  );
};

// Mock data for API
const mockStudentsResponse = {
  students: [
    {
      _id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
      class: '10',
      grade: 'A',
      updatedAt: new Date().toISOString()
    },
    {
      _id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '0987654321',
      class: '11',
      grade: 'B',
      updatedAt: new Date().toISOString()
    }
  ]
};

describe('Students Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  const renderStudentsComponent = () => {
    return render(
      <MemoryRouter>
        <Students />
      </MemoryRouter>
    );
  };

  describe('Students List Fetch Logic', () => {
    test('should fetch students list on component mount with correct credentials', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockStudentsResponse
      });

      renderStudentsComponent();

      // Verify fetch was called with correct parameters
      expect(fetch).toHaveBeenCalledWith('/api/school/students', {
        credentials: 'include'
      });

      // Wait for students to be loaded
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      });

      // Verify total count is displayed
      expect(screen.getByText('Total Students: 2')).toBeInTheDocument();
    });

    test('should handle fetch error gracefully', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 401
      });

      renderStudentsComponent();

      await waitFor(() => {
        expect(screen.getByText('Failed to load students. Please try again.')).toBeInTheDocument();
      });

      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });

    test('should handle network error gracefully', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      fetch.mockRejectedValueOnce(new Error('Network error'));

      renderStudentsComponent();

      await waitFor(() => {
        expect(screen.getByText('Failed to load students. Please try again.')).toBeInTheDocument();
      });

      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });

    test('should display "No students found" when empty array is returned', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ students: [] })
      });

      renderStudentsComponent();

      await waitFor(() => {
        expect(screen.getByText('No students found. Add your first student!')).toBeInTheDocument();
      });

      expect(screen.getByText('Total Students: 0')).toBeInTheDocument();
    });

    test('should include credentials in fetch request for cookie-based authentication', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockStudentsResponse
      });

      renderStudentsComponent();

      expect(fetch).toHaveBeenCalledWith(
        '/api/school/students',
        expect.objectContaining({
          credentials: 'include'
        })
      );
    });

    test('should handle student deletion with correct API call', async () => {
      // Mock initial fetch
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockStudentsResponse
      });

      // Mock delete fetch
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: 'Student deleted successfully' })
      });

      // Mock window.confirm
      window.confirm = jest.fn(() => true);

      renderStudentsComponent();

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      // Click delete button for first student
      const deleteButtons = screen.getAllByText('Delete');
      fireEvent.click(deleteButtons[0]);

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith('/api/school/students/1', {
          method: 'DELETE',
          credentials: 'include'
        });
      });
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockedAuth.getUser.mockReturnValue({ email: 'school@example.com', role: 'school' });
    mockedAuth.getRole.mockReturnValue('school');
    mockedStorage.load.mockReturnValue(mockStudents);
  });

  test('renders student management page', () => {
    renderWithRouter(<Students />);
    
    expect(screen.getByText('Student Management')).toBeInTheDocument();
    expect(screen.getByText('Total Students: 2')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  test('displays empty state when no students', () => {
    mockedStorage.load.mockReturnValue([]);
    
    renderWithRouter(<Students />);
    
    expect(screen.getByText('No students found. Add your first student!')).toBeInTheDocument();
  });

  test('opens add student form when clicking add button', () => {
    renderWithRouter(<Students />);
    
    const addButton = screen.getByText('+ Add New Student');
    fireEvent.click(addButton);
    
    expect(screen.getByText('Add New Student')).toBeInTheDocument();
    expect(screen.getByLabelText('Name *')).toBeInTheDocument();
    expect(screen.getByLabelText('Email *')).toBeInTheDocument();
  });

  test('validates required fields', async () => {
    renderWithRouter(<Students />);
    
    const addButton = screen.getByText('+ Add New Student');
    fireEvent.click(addButton);
    
    const submitButton = screen.getByText('Add Student');
    fireEvent.click(submitButton);
    
    // Should show validation error alert
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        expect.stringContaining('Name is required')
      );
    });
  });

  test('prevents duplicate email addresses', async () => {
    renderWithRouter(<Students />);
    
    const addButton = screen.getByText('+ Add New Student');
    fireEvent.click(addButton);
    
    const nameInput = screen.getByLabelText('Name *');
    const emailInput = screen.getByLabelText('Email *');
    const classInput = screen.getByLabelText('Class *');
    
    fireEvent.change(nameInput, { target: { value: 'Test Student' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } }); // Duplicate email
    fireEvent.change(classInput, { target: { value: '9th Grade' } });
    
    const submitButton = screen.getByText('Add Student');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        expect.stringContaining('A student with this email already exists')
      );
    });
  });

  test('edits existing student', async () => {
    renderWithRouter(<Students />);
    
    const editButtons = screen.getAllByText('Edit');
    fireEvent.click(editButtons[0]);
    
    expect(screen.getByText('Edit Student')).toBeInTheDocument();
    expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
    
    const nameInput = screen.getByLabelText('Name *');
    fireEvent.change(nameInput, { target: { value: 'John Updated' } });
    
    const submitButton = screen.getByText('Update Student');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockedStorage.save).toHaveBeenCalledWith(
        'students',
        expect.arrayContaining([
          expect.objectContaining({
            id: 'STU123456',
            name: 'John Updated',
            updatedAt: expect.any(String)
          })
        ])
      );
    });
  });

  test('deletes student after confirmation', async () => {
    window.confirm = jest.fn(() => true);
    
    renderWithRouter(<Students />);
    
    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);
    
    await waitFor(() => {
      expect(mockedStorage.save).toHaveBeenCalledWith(
        'students',
        expect.arrayContaining([
          expect.objectContaining({
            id: 'STU789012'
          })
        ])
      );
    });
  });

  test('shows updatedAt timestamp in tooltip', () => {
    renderWithRouter(<Students />);
    
    const idCell = screen.getByText('STU789012');
    expect(idCell).toHaveAttribute('title', expect.stringContaining('Last updated:'));
  });

  test('handles storage errors gracefully', () => {
    mockedStorage.load.mockImplementation(() => {
      throw new Error('Storage error');
    });
    
    renderWithRouter(<Students />);
    
    expect(screen.getByText('Total Students: 0')).toBeInTheDocument();
  });
});

// Mock window.alert for tests
window.alert = jest.fn();
window.confirm = jest.fn(() => false);
