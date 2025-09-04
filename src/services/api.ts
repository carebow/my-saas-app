const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('access_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Network error' }));
      throw new Error(error.detail || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Auth methods
  async register(userData: {
    email: string;
    password: string;
    full_name?: string;
  }) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(email: string, password: string) {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);

    const response = await this.request<{
      access_token: string;
      token_type: string;
      user: any;
    }>('/auth/login', {
      method: 'POST',
      headers: {},
      body: formData,
    });

    this.token = response.access_token;
    localStorage.setItem('access_token', response.access_token);
    
    return response;
  }

  async getCurrentUser() {
    return this.request('/users/me');
  }

  async updateProfile(userData: any) {
    return this.request('/users/me', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // AI methods
  async chatWithAI(message: string, context?: any) {
    return this.request('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message, context }),
    });
  }

  async createConsultation(symptoms: string, consultationType?: string) {
    return this.request('/ai/consultation', {
      method: 'POST',
      body: JSON.stringify({
        symptoms,
        consultation_type: consultationType,
      }),
    });
  }

  async getConsultations(skip = 0, limit = 10) {
    return this.request(`/ai/consultations?skip=${skip}&limit=${limit}`);
  }

  // Health methods
  async createHealthProfile(profileData: any) {
    return this.request('/health/profile', {
      method: 'POST',
      body: JSON.stringify(profileData),
    });
  }

  async getHealthProfile() {
    return this.request('/health/profile');
  }

  async addHealthMetric(metricData: {
    metric_type: string;
    value: string;
    unit?: string;
    notes?: string;
  }) {
    return this.request('/health/metrics', {
      method: 'POST',
      body: JSON.stringify(metricData),
    });
  }

  async getHealthMetrics(metricType?: string, skip = 0, limit = 50) {
    const params = new URLSearchParams({
      skip: skip.toString(),
      limit: limit.toString(),
      ...(metricType && { metric_type: metricType }),
    });
    
    return this.request(`/health/metrics?${params}`);
  }

  // Payment methods
  async createSubscription(priceId: string) {
    return this.request('/payments/create-subscription', {
      method: 'POST',
      body: JSON.stringify({ price_id: priceId }),
    });
  }

  async getSubscriptionStatus() {
    return this.request('/payments/subscription-status');
  }

  // Utility methods
  logout() {
    this.token = null;
    localStorage.removeItem('access_token');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('access_token', token);
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }
}

export const apiService = new ApiService();
export default apiService;