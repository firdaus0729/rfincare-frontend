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

export const customerJourneyService = {
  // Eligibility Assessment
  async createEligibilityAssessment(assessmentData) {
    try {
      const res = await apiClient.post('/eligibility-assessments', toSnakeCase(assessmentData));
      return { data: toCamelCase(res.data), error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async getEligibilityAssessments(customerId) {
    try {
      const res = await apiClient.get(`/eligibility-assessments`, { params: { customerId } });
      return { data: toCamelCase(res.data), error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Document Management
  async uploadDocument(file, documentData) {
    try {
      const form = new FormData();
      form.append('file', file);
      if (documentData?.applicationId) form.append('applicationId', documentData.applicationId);
      if (documentData?.documentType) form.append('documentType', documentData.documentType);
      const res = await apiClient.post('/documents', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return { data: toCamelCase(res.data), error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async getDocuments(customerId, applicationId = null) {
    try {
      const res = await apiClient.get('/documents', { params: { customerId, applicationId } });
      return { data: toCamelCase(res.data), error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async getDocumentUrl(filePath) {
    // API provides direct download links or we can return the path if it's already a URL
    return { data: filePath, error: null };
  },

  async deleteDocument(documentId) {
    try {
      await apiClient.delete(`/documents/${documentId}`);
      return { error: null };
    } catch (error) {
      return { error };
    }
  },

  // Application Management
  async getApplications(customerId) {
    try {
      const res = await apiClient.get('/loan-applications/me');
      return { data: toCamelCase(res.data), error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async getApplicationTimeline(applicationId) {
    try {
      const res = await apiClient.get(`/loan-applications/${applicationId}/timeline`);
      return { data: toCamelCase(res.data), error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async updateApplicationStatus(applicationId, status) {
    try {
      const res = await apiClient.patch(`/loan-applications/${applicationId}`, { status });
      return { data: toCamelCase(res.data), error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Notifications
  async getNotifications(customerId) {
    try {
      const res = await apiClient.get(`/customers/${customerId}/notifications`);
      return { data: toCamelCase(res.data), error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async markNotificationAsRead(notificationId) {
    try {
      await apiClient.patch(`/notifications/${notificationId}/read`);
      return { error: null };
    } catch (error) {
      return { error };
    }
  },

  // Update user profile
  async updateProfile(userId, profileData) {
    try {
      const res = await apiClient.patch('/profiles/me', toSnakeCase(profileData));
      return { data: toCamelCase(res.data.profile), error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Compatibility methods
  async getMyDocuments(applicationId = null) {
    return this.getDocuments(null, applicationId);
  },

  async downloadDocument(documentId) {
    try {
      const res = await apiClient.get(`/documents/${documentId}/download`, { responseType: 'blob' });
      return { data: { blob: res.data, fileName: 'document' }, error: null };
    } catch (error) {
      return { data: null, error: { message: 'Download failed' } };
    }
  },

  // Real-time subscriptions (Polling fallback)
  subscribeToApplicationUpdates(applicationId, callback) {
    const interval = setInterval(async () => {
      try {
        const res = await apiClient.get(`/loan-applications/${applicationId}`);
        callback({ new: res.data });
      } catch {}
    }, 5000);
    return { __polling: interval };
  },

  unsubscribe(channel) {
    if (channel?.__polling) clearInterval(channel.__polling);
  }
};