import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

api.interceptors.request.use((config) => {
  let token = localStorage.getItem('hireos_token');
  
  // Also check zustand state just in case of page reload where hireos_token wasn't set locally outside of login
  const authStore = localStorage.getItem('hireos-auth');
  if (authStore && !token) {
    try {
      const parsed = JSON.parse(authStore);
      if (parsed?.state?.token) {
        token = parsed.state.token;
      }
    } catch (e) {
      console.error('Error parsing auth store for token', e);
    }
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('hireos_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  register: (data) => api.post('/auth/register', data).then(res => res.data),
  login: (data) => api.post('/auth/login', data).then(res => res.data),
  forgotPassword: (data) => api.post('/auth/forgot-password', data).then(res => res.data),
  resetPassword: (data) => api.post('/auth/reset-password', data).then(res => res.data),
  getMe: () => api.get('/auth/me').then(res => res.data),
  updateProfile: (data) => api.patch('/auth/me', data).then(res => res.data)
};

export const jobService = {
  getJobs: (params) => api.get('/jobs', { params }).then(res => res.data),
  getJobById: (id) => api.get(`/jobs/${id}`).then(res => res.data),
  createJob: (data) => api.post('/jobs', data).then(res => res.data),
  updateJob: (id, data) => api.put(`/jobs/${id}`, data).then(res => res.data),
  deleteJob: (id) => api.delete(`/jobs/${id}`).then(res => res.data),
  getMyJobs: () => api.get('/jobs/recruiter/mine').then(res => res.data)
};

// Convenience export used by shared pages.
export const getJobs = (params) => api.get('/jobs', { params });

export const applicationService = {
  apply: (data) => api.post('/applications', data).then(res => res.data),
  createApplication: (data) => api.post('/applications', data).then(res => res.data),
  getApplications: () => api.get('/applications').then(res => res.data),
  getApplicationById: (id) => api.get(`/applications/${id}`).then(res => res.data),
  updateStatus: (id, data) => api.patch(`/applications/${id}/status`, data).then(res => res.data),
  getMyApplications: () => api.get('/applications/candidate/me').then(res => res.data)
};

export const interviewService = {
  getInterviews: () => api.get('/interviews').then(res => res.data),
  getMyInterviews: () => api.get('/interviews/candidate/me').then(res => res.data),
  getInterviewById: (id) => api.get(`/interviews/${id}`).then(res => res.data),
  createInterview: (data) => api.post('/interviews', data).then(res => res.data),
  updateInterview: (id, data) => api.put(`/interviews/${id}`, data).then(res => res.data),
  submitAnswer: (id, data) => api.post(`/interviews/${id}/answers`, data).then(res => res.data),
  completeInterview: (id) => api.patch(`/interviews/${id}/complete`).then(res => res.data)
};

// Named export for simple usage in forms.
export const createInterview = (data) => api.post('/interviews', data);

export const analyticsService = {
  getDashboardStats: () => api.get('/analytics/dashboard').then(res => res.data),
  getApplicationsOverTime: () => api.get('/analytics/applications-over-time').then(res => res.data),
  getFunnel: () => api.get('/analytics/hiring-funnel').then(res => res.data),
  getTopCandidates: () => api.get('/analytics/top-candidates').then(res => res.data)
};

export const aiService = {
  parseResume: (data) => api.post('/ai/parse-resume', data).then(res => res.data),
  scoreCandidate: (data) => api.post('/ai/score', data).then(res => res.data),
  generateInterviewQuestions: (data) => api.post('/ai/interview-questions', data).then(res => res.data),
  detectBias: (data) => api.post('/ai/detect-bias', data).then(res => res.data)
};

export const messageService = {
  send: (recipientId, content) => api.post('/messages', { recipientId, content }).then(res => res.data),
  getConversation: (userId) => api.get(`/messages/${userId}`).then(res => res.data),
};

export const notificationService = {
  getNotifications: () => api.get('/notifications').then(res => res.data),
  markAsRead: (id) => api.patch(`/notifications/${id}/read`).then(res => res.data),
  markAllAsRead: () => api.patch('/notifications/mark-all-read').then(res => res.data)
};

export default api;
