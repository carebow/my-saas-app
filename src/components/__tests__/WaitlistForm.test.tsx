import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import WaitlistForm from '../WaitlistForm';

// Mock the API call
vi.mock('../../lib/api', () => ({
  submitToWaitlist: vi.fn(),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('WaitlistForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders form fields correctly', () => {
    render(<WaitlistForm />, { wrapper: createWrapper() });
    
    expect(screen.getByPlaceholderText(/your email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/full name/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /join waitlist/i })).toBeInTheDocument();
  });

  it('validates email format', async () => {
    render(<WaitlistForm />, { wrapper: createWrapper() });
    
    const emailInput = screen.getByPlaceholderText(/your email/i);
    const submitButton = screen.getByRole('button', { name: /join waitlist/i });
    
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
    });
  });

  it('validates required fields', async () => {
    render(<WaitlistForm />, { wrapper: createWrapper() });
    
    const submitButton = screen.getByRole('button', { name: /join waitlist/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    const mockSubmit = vi.fn().mockResolvedValue({ success: true });
    const { submitToWaitlist } = await import('../../lib/api');
    vi.mocked(submitToWaitlist).mockImplementation(mockSubmit);
    
    render(<WaitlistForm />, { wrapper: createWrapper() });
    
    const emailInput = screen.getByPlaceholderText(/your email/i);
    const nameInput = screen.getByPlaceholderText(/full name/i);
    const submitButton = screen.getByRole('button', { name: /join waitlist/i });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        fullName: 'John Doe',
      });
    });
  });

  it('shows success message after submission', async () => {
    const mockSubmit = vi.fn().mockResolvedValue({ success: true });
    const { submitToWaitlist } = await import('../../lib/api');
    vi.mocked(submitToWaitlist).mockImplementation(mockSubmit);
    
    render(<WaitlistForm />, { wrapper: createWrapper() });
    
    const emailInput = screen.getByPlaceholderText(/your email/i);
    const nameInput = screen.getByPlaceholderText(/full name/i);
    const submitButton = screen.getByRole('button', { name: /join waitlist/i });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/successfully added to waitlist/i)).toBeInTheDocument();
    });
  });
});