import React, { useState, useEffect, useCallback } from 'react';

import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { reportsService } from '../../services/reportsService';

import ReportCard from './components/ReportCard';
import MetricCard from './components/MetricCard';
import ChartContainer from './components/ChartContainer';
import FilterPanel from './components/FilterPanel';
import ApplicationVolumeChart from './components/ApplicationVolumeChart';
import AgentPerformanceChart from './components/AgentPerformanceChart';
import RevenueDistributionChart from './components/RevenueDistributionChart';
import ScheduleReportModal from './components/ScheduleReportModal';
import ExportModal from './components/ExportModal';

const REPORT_ICONS = {
  application_volume: 'BarChart3',
  agent_performance: 'TrendingUp',
  financial_summary: 'IndianRupee',
  compliance_audit: 'Shield',
  customer_analytics: 'Users',
  bank_partnership: 'Building2',
};

const ReportsAndAnalytics = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedReport, setSelectedReport] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [metrics, setMetrics] = useState([]);
  const [reports, setReports] = useState([]);
  const [volumeData, setVolumeData] = useState([]);
  const [agentData, setAgentData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [filters, setFilters] = useState({
    dateRange: 'last30days',
    reportType: 'all',
    status: 'all',
    startDate: '',
    endDate: '',
  });

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [overview, volume, agents, revenue, catalog] = await Promise.all([
        reportsService.getOverview(filters),
        reportsService.getApplicationVolumeChart(),
        reportsService.getAgentPerformanceChart(),
        reportsService.getRevenueDistributionChart(),
        reportsService.getCatalog(),
      ]);
      setMetrics(overview?.metrics || []);
      setVolumeData(volume || []);
      setAgentData(agents || []);
      setRevenueData(revenue || []);
      setReports(
        (catalog || []).map((r) => ({
          ...r,
          icon: REPORT_ICONS[r.key] || 'FileText',
          lastGenerated: r.lastGenerated
            ? new Date(r.lastGenerated).toLocaleString()
            : 'Never',
        })),
      );
    } catch (err) {
      setError(err?.response?.data?.error || err?.message || 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
    { id: 'reports', label: 'Reports', icon: 'FileText' },
    { id: 'analytics', label: 'Analytics', icon: 'BarChart3' },
    { id: 'scheduled', label: 'Scheduled', icon: 'Calendar' },
  ];

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  const handleApplyFilters = () => loadDashboard();

  const handleResetFilters = () => {
    setFilters({
      dateRange: 'last30days',
      reportType: 'all',
      status: 'all',
      startDate: '',
      endDate: '',
    });
  };

  const runReport = async (report) => {
    const key = report?.key || report?.id;
    if (!key) return null;
    return reportsService.generateReport(key, filters);
  };

  const handleGenerateReport = async (report) => {
    try {
      const data = await runReport(report);
      reportsService.downloadCsv(report.key, data);
      alert(`${report.name} generated (${data.rows?.length || 0} rows). CSV downloaded.`);
      loadDashboard();
    } catch (err) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.error || err?.message || 'Report generation failed';
      if (status === 401 || /jwt expired/i.test(String(msg))) {
        alert('Session expired. Please login again, then generate report.');
        window.location.href = '/authentication-management-center';
        return;
      }
      alert(msg);
    }
  };

  const handleScheduleReport = (report) => {
    setSelectedReport(report);
    setShowScheduleModal(true);
  };

  const handleExportReport = (report) => {
    setSelectedReport(report);
    setShowExportModal(true);
  };

  const handleScheduleSubmit = async (scheduleData) => {
    try {
      await reportsService.createSchedule({
        reportKey: selectedReport.key,
        reportName: selectedReport.name,
        frequency: scheduleData.frequency,
        format: scheduleData.format,
        recipients: scheduleData.recipients,
        filters,
      });
      alert('Report scheduled successfully.');
      setShowScheduleModal(false);
      loadDashboard();
    } catch (err) {
      alert(err?.response?.data?.error || err?.message || 'Schedule failed');
    }
  };

  const handleExportSubmit = async (exportData) => {
    try {
      const data = await runReport(selectedReport);
      if (exportData.format === 'csv') {
        reportsService.downloadCsv(selectedReport.key, data);
      } else {
        reportsService.downloadCsv(selectedReport.key, data);
      }
      setShowExportModal(false);
    } catch (err) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.error || err?.message || 'Export failed';
      if (status === 401 || /jwt expired/i.test(String(msg))) {
        alert('Session expired. Please login again, then export report.');
        window.location.href = '/authentication-management-center';
        return;
      }
      alert(msg);
    }
  };

  const handleChartExport = async () => {
    const data = await reportsService.generateReport('application_volume', filters);
    reportsService.downloadCsv('application_volume', data);
  };

  return (
    <div>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2">
                Reports & Analytics
              </h1>
              <p className="text-sm md:text-base text-muted-foreground">
                Live data from your loan platform
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" iconName="RefreshCw" onClick={loadDashboard} loading={loading}>
                Refresh
              </Button>
            </div>
          </div>

          {error && (
            <p className="mb-4 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg p-3">
              {error}
            </p>
          )}

          <div className="flex items-center space-x-2 overflow-x-auto scrollbar-hide border-b border-border">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                type="button"
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                  activeTab === tab?.id
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon name={tab?.icon} size={16} />
                <span>{tab?.label}</span>
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6 md:space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {(metrics?.length ? metrics : [{ id: 'load', label: 'Loading…', value: '—' }])?.map((metric) => (
                <MetricCard key={metric?.id} metric={metric} />
              ))}
            </div>

            <FilterPanel
              filters={filters}
              onFilterChange={handleFilterChange}
              onApply={handleApplyFilters}
              onReset={handleResetFilters}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
              <ChartContainer
                title="Application Volume Trends"
                subtitle="Monthly application submissions and outcomes"
                icon="BarChart3"
                onExport={handleChartExport}
              >
                <ApplicationVolumeChart data={volumeData} />
              </ChartContainer>

              <ChartContainer
                title="Agent Performance Metrics"
                subtitle="Applications and approvals by agent"
                icon="TrendingUp"
                onExport={handleChartExport}
              >
                <AgentPerformanceChart data={agentData} />
              </ChartContainer>
            </div>

            <ChartContainer title="Applications by loan type" subtitle="Distribution" icon="PieChart">
              <RevenueDistributionChart data={revenueData} />
            </ChartContainer>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="space-y-6 animate-fade-in">
            <FilterPanel
              filters={filters}
              onFilterChange={handleFilterChange}
              onApply={handleApplyFilters}
              onReset={handleResetFilters}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {reports?.map((report) => (
                <ReportCard
                  key={report.key}
                  report={report}
                  onGenerate={handleGenerateReport}
                  onSchedule={handleScheduleReport}
                  onExport={handleExportReport}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6 md:space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {metrics?.map((metric) => (
                <MetricCard key={metric?.id} metric={metric} />
              ))}
            </div>
            <ApplicationVolumeChart data={volumeData} />
            <AgentPerformanceChart data={agentData} />
            <RevenueDistributionChart data={revenueData} />
          </div>
        )}

        {activeTab === 'scheduled' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-card border border-border rounded-lg p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {reports?.filter((r) => r?.isScheduled)?.map((report) => (
                  <ReportCard
                    key={report.key}
                    report={report}
                    onGenerate={handleGenerateReport}
                    onSchedule={handleScheduleReport}
                    onExport={handleExportReport}
                  />
                ))}
              </div>
              {!reports?.some((r) => r.isScheduled) && (
                <p className="text-center text-muted-foreground py-8">
                  No scheduled reports yet. Use Schedule on any report card.
                </p>
              )}
            </div>
          </div>
        )}
      </main>

      {showScheduleModal && selectedReport && (
        <ScheduleReportModal
          report={selectedReport}
          onClose={() => setShowScheduleModal(false)}
          onSchedule={handleScheduleSubmit}
        />
      )}
      {showExportModal && selectedReport && (
        <ExportModal
          report={selectedReport}
          onClose={() => setShowExportModal(false)}
          onExport={handleExportSubmit}
        />
      )}
    </div>
  );
};

export default ReportsAndAnalytics;
