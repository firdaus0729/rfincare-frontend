import { apiClient } from '../lib/apiClient';

const toCamelCase = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(toCamelCase);
  return Object.keys(obj).reduce((acc, key) => {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    acc[camelKey] = toCamelCase(obj[key]);
    return acc;
  }, {});
};

function apiError(error, fallback) {
  return { message: error?.response?.data?.error || error?.message || fallback };
}

export const adminService = {
  async getAllApplications(filters = {}) {
    try {
      const res = await apiClient.get('/loan-applications', { params: filters });
      return { data: toCamelCase(res.data), error: null };
    } catch (error) {
      return { data: null, error: apiError(error, 'Failed to fetch applications') };
    }
  },

  async getApplicationById(applicationId) {
    try {
      const res = await apiClient.get(`/loan-applications/${applicationId}`);
      return { data: toCamelCase(res.data), error: null };
    } catch (error) {
      return { data: null, error: apiError(error, 'Failed to fetch application') };
    }
  },

  async getApplicationDocuments(applicationId) {
    try {
      const res = await apiClient.get('/documents', { params: { applicationId } });
      const list = toCamelCase(res.data);
      return { data: Array.isArray(list) ? list : [], error: null };
    } catch (error) {
      return { data: [], error: apiError(error, 'Failed to fetch documents') };
    }
  },

  async approveApplication(applicationId, reviewNotes = '') {
    try {
      const res = await apiClient.patch(`/loan-applications/${applicationId}`, {
        status: 'approved',
        review_notes: reviewNotes,
      });
      return { data: toCamelCase(res.data), error: null };
    } catch (error) {
      return { data: null, error: apiError(error, 'Approval failed') };
    }
  },

  async rejectApplication(applicationId, rejectionReason) {
    try {
      const res = await apiClient.patch(`/loan-applications/${applicationId}`, {
        status: 'rejected',
        rejection_reason: rejectionReason,
      });
      return { data: toCamelCase(res.data), error: null };
    } catch (error) {
      return { data: null, error: apiError(error, 'Rejection failed') };
    }
  },

  async getDashboardStats() {
    try {
      const res = await apiClient.get('/admin/stats');
      const stats = toCamelCase(res.data);
      return {
        data: {
          totalApplications: stats?.totalApplications ?? 0,
          pendingReviews: stats?.pendingReviews ?? 0,
          activeAgents: stats?.activeAgents ?? 0,
          approvalRate: stats?.approvalRate ?? '0%',
        },
        error: null,
      };
    } catch (error) {
      return { data: null, error: apiError(error, 'Failed to fetch dashboard stats') };
    }
  },

  async getAllAgents() {
    try {
      const res = await apiClient.get('/admin/agents');
      return { data: toCamelCase(res.data), error: null };
    } catch (error) {
      return { data: [], error: apiError(error, 'Failed to fetch agents') };
    }
  },

  async getAllEmployees() {
    try {
      const res = await apiClient.get('/admin/employees');
      return { data: toCamelCase(res.data), error: null };
    } catch (error) {
      return { data: [], error: apiError(error, 'Failed to fetch employees') };
    }
  },

  async approveAgent(agentId) {
    try {
      const res = await apiClient.patch(`/admin/agents/${agentId}`, {
        account_status: 'active',
        onboarding_status: 'active',
      });
      return { data: toCamelCase(res.data), error: null };
    } catch (error) {
      return { data: null, error: apiError(error, 'Failed to approve agent') };
    }
  },

  async rejectAgent(agentId, reason) {
    try {
      const res = await apiClient.patch(`/admin/agents/${agentId}`, {
        account_status: 'inactive',
        onboarding_status: 'suspended',
        rejection_reason: reason,
      });
      return { data: toCamelCase(res.data), error: null };
    } catch (error) {
      return { data: null, error: apiError(error, 'Failed to reject agent') };
    }
  },

  async updateAgentCommission() {
    return { error: { message: 'Commission configuration is not available in this release.' } };
  },

  async updateEmployeeAccessControls() {
    return { error: null };
  },

  async createAgentOnboarding() {
    return { data: null, error: { message: 'Agent creation migrated to manual seeding for security.' } };
  },

  async getAgentOnboardingList() {
    return { data: [], error: null };
  },

  async createEmployeeOnboarding() {
    return { data: null, error: { message: 'Employee creation migrated to manual seeding.' } };
  },

  async getEmployeeOnboardingList() {
    return { data: [], error: null };
  },

  async getAllDocuments(filters = {}) {
    try {
      const res = await apiClient.get('/documents', { params: filters });
      return { data: toCamelCase(res.data), error: null };
    } catch (error) {
      return { data: null, error: apiError(error, 'Failed to fetch documents') };
    }
  },

  async getAuditLogs() {
    return { data: [], error: null };
  },

  async getSystemConfigurations() {
    return { data: [], error: null };
  },

  async updateSystemConfiguration() {
    return { error: null };
  },

  async generateReport() {
    return { data: null, error: { message: 'Reporting service unavailable' } };
  },

  async lookupApplications({ email, applicationNumber }) {
    const res = await apiClient.get('/admin/status-check/lookup', {
      params: { email, applicationNumber },
    });
    return res.data;
  },

  async getStatusCheckOtpLog() {
    const res = await apiClient.get('/admin/status-check/otp-log');
    return res.data;
  },

  async sendStatusCheckOtp(payload) {
    const res = await apiClient.post('/admin/status-check/send-otp', payload);
    return res.data;
  },

  async verifyStatusCheck(payload) {
    const res = await apiClient.post('/admin/status-check/verify', payload);
    return res.data;
  },
};
