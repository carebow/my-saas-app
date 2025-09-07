import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { submitToWaitlist, loginUser, getUserProfile } from '../api';

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('API Functions', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('submitToWaitlist', () => {
    it('submits waitlist data successfully', async () => {
      const mockResponse = { success: true, id: 123 };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const data = { email: 'test@example.com', fullName: 'John Doe' };
      const result = await submitToWaitlist(data);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/waitlist'),
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('handles API errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ detail: 'Email already exists' }),
      });

      const data = { email: 'existing@example.com', fullName: 'Jane Doe' };
      
      await expect(submitToWaitlist(data)).rejects.toThrow('Email already exists');
    });
  });

  describe('loginUser', () => {
    it('logs in user successfully', async () => {
      const mockResponse = { 
        access_token: 'mock-token',
        user: { id: 1, email: 'test@example.com' }
      };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const credentials = { email: 'test@example.com', password: 'password123' };
      const result = await loginUser(credentials);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/auth/login'),
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials),
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('handles authentication errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ detail: 'Invalid credentials' }),
      });

      const credentials = { email: 'test@example.com', password: 'wrongpassword' };
      
      await expect(loginUser(credentials)).rejects.toThrow('Invalid credentials');
    });
  });

  describe('getUserProfile', () => {
    it('fetches user profile with valid token', async () => {
      const mockProfile = {
        id: 1,
        email: 'test@example.com',
        full_name: 'John Doe',
        subscription_tier: 'free'
      };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProfile,
      });

      const result = await getUserProfile('mock-token');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/users/me'),
        expect.objectContaining({
          headers: {
            'Authorization': 'Bearer mock-token',
            'Content-Type': 'application/json',
          },
        })
      );
      expect(result).toEqual(mockProfile);
    });

    it('handles unauthorized requests', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ detail: 'Token expired' }),
      });

      await expect(getUserProfile('expired-token')).rejects.toThrow('Token expired');
    });
  });
});