import { apiClient } from '../lib/apiClient';

// Helper function to convert snake_case to camelCase
const toCamelCase = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(toCamelCase);
  
  return Object.keys(obj).reduce((acc, key) => {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    acc[camelKey] = toCamelCase(obj[key]);
    return acc;
  }, {});
};

// Helper function to convert camelCase to snake_case
const toSnakeCase = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(toSnakeCase);
  
  return Object.keys(obj).reduce((acc, key) => {
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    acc[snakeKey] = toSnakeCase(obj[key]);
    return acc;
  }, {});
};

export const adminService = {
  // ============================================
  // AGENT & EMPLOYEE MANAGEMENT (STUBS)
  // ============================================
  async createAgentOnboarding(agentData) {
    return { data: null, error: { message: 'Agent creation migrated to manual seeding for security.' } };
  },
  async getAgentOnboardingList() {
    return { data: [], error: null };
  },
  async createEmployeeOnboarding(employeeData) {
    return { data: null, error: { message: 'Employee creation migrated to manual seeding.' } };
  },
  async getEmployeeOnboardingList() {
    return { data: [], error: null };
  },

  // ============================================
  // APPLICATION MANAGEMENT
  // ============================================
  async getAllApplications(filters = {}) {
    try {
      const res = await apiClient.get('/loan-applications', { params: filters });
      return { data: toCamelCase(res.data), error: null };
    } catch (error) {
      return { data: null, error: { message: error.response?.data?.error || 'Failed to fetch applications' } };
    }
  },

  async approveApplication(applicationId, reviewNotes = '') {
    try {
      const res = await apiClient.patch(`/loan-applications/${applicationId}`, { 
        status: 'approved', 
        reviewNotes 
      });
      return { data: toCamelCase(res.data), error: null };
    } catch (error) {
      return { data: null, error: { message: error.response?.data?.error || 'Approval failed' } };
    }
  },

  async rejectApplication(applicationId, rejectionReason) {
    try {
      const res = await apiClient.patch(`/loan-applications/${applicationId}`, { 
        status: 'rejected', 
        rejectionReason 
      });
      return { data: toCamelCase(res.data), error: null };
    } catch (error) {
      return { data: null, error: { message: error.response?.data?.error || 'Rejection failed' } };
    }
  },

  // ============================================
  // DASHBOARD STATS
  // ============================================
  async getDashboardStats() {
    try {
      // Assuming a generic dashboard endpoint or aggregating from applications
      const res = await apiClient.get('/loan-applications');
      const apps = res.data || [];
      
      return {
        data: {
          totalApplications: apps.length,
          pendingReviews: apps.filter(a => a.status === 'submitted' || a.status === 'pending').length,
          activeAgents: 0, // Placeholder
          approvalRate: apps.length > 0 ? `${((apps.filter(a => a.status === 'approved').length / apps.length) * 100).toFixed(1)}%` : '0%'
        },
        error: null
      };
    } catch (error) {
      return { data: null, error: { message: 'Failed to fetch dashboard stats' } };
    }
  },

  // ============================================
  // DOCUMENT MANAGEMENT (ADMIN)
  // ============================================
  async getAllDocuments(filters = {}) {
    try {
      const res = await apiClient.get('/documents', { params: filters });
      return { data: toCamelCase(res.data), error: null };
    } catch (error) {
      return { data: null, error: { message: 'Failed to fetch documents' } };
    }
  },

  // Other stubs for audit logs and config
  async getAuditLogs() { return { data: [], error: null }; },
  async getSystemConfigurations() { return { data: [], error: null }; },
  async updateSystemConfiguration() { return { error: null }; },
  async generateReport() { return { data: null, error: { message: 'Reporting service unavailable' } }; }
};