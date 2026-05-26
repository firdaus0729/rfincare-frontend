import { apiClient } from '../lib/apiClient';

function toParams(filters = {}) {
  const p = {};
  if (filters.dateRange) p.dateRange = filters.dateRange;
  if (filters.startDate) p.startDate = filters.startDate;
  if (filters.endDate) p.endDate = filters.endDate;
  if (filters.status && filters.status !== 'all') p.status = filters.status;
  return p;
}

export const reportsService = {
  async getOverview(filters) {
    const res = await apiClient.get('/reports/overview', { params: toParams(filters) });
    return res.data;
  },

  async getApplicationVolumeChart() {
    const res = await apiClient.get('/reports/charts/application-volume');
    return res.data;
  },

  async getAgentPerformanceChart() {
    const res = await apiClient.get('/reports/charts/agent-performance');
    return res.data;
  },

  async getRevenueDistributionChart() {
    const res = await apiClient.get('/reports/charts/revenue-distribution');
    return res.data;
  },

  async getCatalog() {
    const res = await apiClient.get('/reports/catalog');
    return res.data;
  },

  async generateReport(reportKey, filters) {
    const res = await apiClient.get(`/reports/generate/${reportKey}`, { params: toParams(filters) });
    return res.data;
  },

  async getSchedules() {
    const res = await apiClient.get('/reports/schedules');
    return res.data;
  },

  async createSchedule(payload) {
    const res = await apiClient.post('/reports/schedules', payload);
    return res.data;
  },

  downloadCsv(reportKey, data) {
    const { columns, rows } = data;
    const header = columns.join(',');
    const lines = rows.map((row) =>
      columns
        .map((col) => {
          const v = row[col];
          const s = v == null ? '' : String(v);
          return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
        })
        .join(','),
    );
    const blob = new Blob([[header, ...lines].join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportKey}-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  },
};
