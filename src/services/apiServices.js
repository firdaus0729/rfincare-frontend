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

export const bankService = {
  async getAllBanks() {
    const res = await apiClient.get('/banks', { params: { includeInactive: true } });
    return toCamelCase(res?.data);
  },
  async getActiveBanks(options = {}) {
    const params = { includeProducts: true };
    if (options.loanType) params.loanType = options.loanType;
    const res = await apiClient.get('/banks', { params });
    return toCamelCase(res?.data);
  },
  async getBankById(bankId) {
    const res = await apiClient.get(`/banks/${bankId}`);
    return toCamelCase(res?.data);
  },
  async createBank(bankData) {
    const res = await apiClient.post('/banks', toSnakeCase(bankData));
    return toCamelCase(res?.data);
  },
  async updateBank(bankId, bankData) {
    const res = await apiClient.patch(`/banks/${bankId}`, toSnakeCase(bankData));
    return toCamelCase(res?.data);
  },
  async deleteBank(bankId) {
    await apiClient.delete(`/banks/${bankId}`);
  },
  async getBankProducts(bankId) {
    const res = await apiClient.get(`/banks/${bankId}/products`);
    return toCamelCase(res?.data);
  },
  async createBankProduct(productData) {
    const res = await apiClient.post(`/banks/${productData?.bankId}/products`, toSnakeCase(productData));
    return toCamelCase(res?.data);
  },
  async updateBankProduct(productId, productData) {
    const res = await apiClient.patch(`/bank-products/${productId}`, toSnakeCase(productData));
    return toCamelCase(res?.data);
  },
  async deleteBankProduct(productId) {
    await apiClient.delete(`/bank-products/${productId}`);
  },
  async getBanksWithProbability(userProfile) {
    const res = await apiClient.post('/banks/probability', userProfile);
    return toCamelCase(res?.data);
  }
};

export const approvalMatrixService = {
  async getAllRules() {
    const res = await apiClient.get('/approval-matrix-rules');
    return toCamelCase(res?.data);
  },
  async getRulesByBank(bankId) {
    const res = await apiClient.get(`/banks/${bankId}/approval-matrix-rules`);
    return toCamelCase(res?.data);
  },
  async createRule(ruleData) {
    const res = await apiClient.post('/approval-matrix-rules', toSnakeCase(ruleData));
    return toCamelCase(res?.data);
  },
  async updateRule(ruleId, ruleData) {
    const res = await apiClient.patch(`/approval-matrix-rules/${ruleId}`, toSnakeCase(ruleData));
    return toCamelCase(res?.data);
  },
  async deleteRule(ruleId) {
    await apiClient.delete(`/approval-matrix-rules/${ruleId}`);
  },
  async calculateProbability(bankId, userProfile) {
    const res = await apiClient.post(`/banks/${bankId}/calculate-approval-probability`, userProfile);
    return res?.data;
  }
};

export const applicationService = {
  async getUserApplications() {
    const res = await apiClient.get('/loan-applications/me');
    return toCamelCase(res?.data);
  },
  async createApplication(applicationData) {
    const res = await apiClient.post('/loan-applications', toSnakeCase(applicationData));
    return toCamelCase(res?.data);
  },
  async updateApplication(applicationId, applicationData) {
    const res = await apiClient.patch(`/loan-applications/${applicationId}`, toSnakeCase(applicationData));
    return toCamelCase(res?.data);
  },
  async submitApplication(applicationId) {
    const res = await apiClient.post(`/loan-applications/${applicationId}/submit`);
    return toCamelCase(res?.data);
  },
  async getAllApplications(filters = {}) {
    const res = await apiClient.get('/loan-applications', { params: filters });
    return toCamelCase(res?.data);
  }
};

export const stateService = {
  async getAllStates() {
    const res = await apiClient.get('/states');
    return toCamelCase(res?.data);
  }
};

export const localizationService = {
  async getSettings() {
    const res = await apiClient.get('/localization/settings');
    return res?.data;
  },
  formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  },
  formatPhoneNumber(phone) {
    const cleaned = phone?.replace(/\D/g, '');
    if (cleaned?.length === 10) {
      return cleaned?.replace(/(\d{5})(\d{5})/, '$1 $2');
    }
    return phone;
  },
  validatePinCode(pinCode) {
    const cleaned = pinCode?.replace(/\D/g, '');
    return cleaned?.length === 6;
  },
  validatePhoneNumber(phone) {
    const cleaned = phone?.replace(/\D/g, '');
    return cleaned?.length === 10 && /^[6-9]/.test(cleaned);
  }
};

export const auditService = {
  async logAction(actionType, tableName, recordId, oldValues, newValues) {
    try {
      await apiClient.post('/audit-logs', {
        actionType,
        tableName,
        recordId,
        oldValues,
        newValues,
      });
    } catch (e) {
      console.error('Audit log failed:', e);
    }
  },
  async getLogs(filters = {}) {
    const res = await apiClient.get('/audit-logs', { params: filters });
    return toCamelCase(res?.data);
  }
};
