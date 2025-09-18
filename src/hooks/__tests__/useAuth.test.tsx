import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuth } from '../useAuth';

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

// Mock API functions
vi.mock('../../lib/api', () => ({
  loginUser: vi.fn(),
  getUserProfile: vi.fn(),
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

describe('useAuth Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
  });

  it('initializes with no authenticated user', () => {
    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });
    
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
  });

  it('loads token from localStorage on init', () => {
    mockLocalStorage.getItem.mockReturnValue('stored-token');
    
    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });
    
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('authToken');
    expect(result.current.token).toBe('stored-token');
  });

  it('logs in user successfully', async () => {
    const mockLoginResponse = {
      access_token: 'new-token',
      user: { id: 1, email: 'test@example.com' }
    };
    
    const { loginUser } = await import('../../lib/api');
    vi.mocked(loginUser).mockResolvedValue(mockLoginResponse);
    
    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });
    
    await act(async () => {
      await result.current.login({ email: 'test@example.com', password: 'password123' });
    });
    
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('authToken', 'new-token');
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.token).toBe('new-token');
  });

  it('logs out user and clears storage', () => {
    mockLocalStorage.getItem.mockReturnValue('existing-token');
    
    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });
    
    act(() => {
      result.current.logout();
    });
    
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('authToken');
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
  });

  it('handles login errors', async () => {
    const mockError = new Error('Invalid credentials');
    const { loginUser } = await import('../../lib/api');
    vi.mocked(loginUser).mockRejectedValue(mockError);
    
    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });
    
    await expect(
      act(async () => {
        await result.current.login({ email: 'test@example.com', password: 'wrong' });
      })
    ).rejects.toThrow('Invalid credentials');
    
    expect(result.current.isAuthenticated).toBe(false);
    expect(mockLocalStorage.setItem).not.toHaveBeenCalled();
  });

  it('fetches user profile when token exists', async () => {
    const mockProfile = {
      id: 1,
      email: 'test@example.com',
      full_name: 'John Doe'
    };
    
    mockLocalStorage.getItem.mockReturnValue('valid-token');
    const { getUserProfile } = await import('../../lib/api');
    vi.mocked(getUserProfile).mockResolvedValue(mockProfile);
    
    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });
    
    // Wait for the profile to be fetched
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    expect(result.current.user).toEqual(mockProfile);
  });
});