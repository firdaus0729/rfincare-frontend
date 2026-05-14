import React, { useState } from 'react';

import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

import ReportCard from './components/ReportCard';
import MetricCard from './components/MetricCard';
import ChartContainer from './components/ChartContainer';
import FilterPanel from './components/FilterPanel';
import ApplicationVolumeChart from './components/ApplicationVolumeChart';
import AgentPerformanceChart from './components/AgentPerformanceChart';
import RevenueDistributionChart from './components/RevenueDistributionChart';
import ScheduleReportModal from './components/ScheduleReportModal';
import ExportModal from './components/ExportModal';

const ReportsAndAnalytics = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedReport, setSelectedReport] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [filters, setFilters] = useState({
    dateRange: 'last30days',
    reportType: 'all',
    status: 'all',
    startDate: '',
    endDate: ''
  });

  const metrics = [
    {
      id: 1,
      label: 'Total Applications',
      value: '5,234',
      change: '+12.5%',
      trend: 'up',
      icon: 'FileText',
      color: 'var(--color-customer-primary)',
      subtitle: 'vs. last month'
    },
    {
      id: 2,
      label: 'Approval Rate',
      value: '87.3%',
      change: '+3.2%',
      trend: 'up',
      icon: 'CheckCircle',
      color: 'var(--color-conversion)',
      subtitle: 'Industry avg: 82%'
    },
    {
      id: 3,
      label: 'Active Agents',
      value: '342',
      change: '+18',
      trend: 'up',
      icon: 'Users',
      color: 'var(--color-agent-primary)',
      subtitle: 'New this month: 18'
    },
    {
      id: 4,
      label: 'Total Revenue',
      value: '₹2.4M',
      change: '+15.8%',
      trend: 'up',
      icon: 'DollarSign',
      color: 'var(--color-admin-primary)',
      subtitle: 'Commission paid: ₹180K'
    },
    {
      id: 5,
      label: 'Avg. Processing Time',
      value: '4.2 days',
      change: '-0.8 days',
      trend: 'up',
      icon: 'Clock',
      color: 'var(--color-secondary)',
      subtitle: 'Target: 5 days'
    },
    {
      id: 6,
      label: 'Customer Satisfaction',
      value: '4.7/5.0',
      change: '+0.2',
      trend: 'up',
      icon: 'Star',
      color: 'var(--color-warning)',
      subtitle: 'Based on 1,234 reviews'
    }
  ];

  const reports = [
    {
      id: 1,
      name: 'Application Volume Report',
      description: 'Comprehensive analysis of application submissions, approvals, and rejections across all loan types and time periods.',
      category: 'application',
      icon: 'BarChart3',
      frequency: 'Daily',
      lastGenerated: '2 hours ago',
      isScheduled: true
    },
    {
      id: 2,
      name: 'Agent Performance Dashboard',
      description: 'Detailed metrics on agent productivity, conversion rates, customer assignments, and commission earnings.',
      category: 'agent',
      icon: 'TrendingUp',
      frequency: 'Weekly',
      lastGenerated: 'Yesterday',
      isScheduled: true
    },
    {
      id: 3,
      name: 'Financial Summary Report',
      description: 'Complete financial overview including revenue, commissions, processing fees, and profit margins by product type.',
      category: 'financial',
      icon: 'DollarSign',
      frequency: 'Monthly',
      lastGenerated: '3 days ago',
      isScheduled: true
    },
    {
      id: 4,
      name: 'Compliance Audit Report',
      description: 'Regulatory compliance tracking, document verification status, and audit trail for all platform activities.',
      category: 'compliance',
      icon: 'Shield',
      frequency: 'Monthly',
      lastGenerated: '1 week ago',
      isScheduled: false
    },
    {
      id: 5,
      name: 'Customer Analytics Report',
      description: 'Customer behavior analysis, satisfaction scores, loan preferences, and demographic insights for targeted marketing.',
      category: 'customer',
      icon: 'Users',
      frequency: 'Weekly',
      lastGenerated: 'Today',
      isScheduled: true
    },
    {
      id: 6,
      name: 'Bank Partnership Report',
      description: 'Performance metrics for partner banks including approval rates, processing times, and customer satisfaction scores.',
      category: 'financial',
      icon: 'Building2',
      frequency: 'Monthly',
      lastGenerated: '5 days ago',
      isScheduled: false
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
    { id: 'reports', label: 'Reports', icon: 'FileText' },
    { id: 'analytics', label: 'Analytics', icon: 'BarChart3' },
    { id: 'scheduled', label: 'Scheduled', icon: 'Calendar' }
  ];

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  const handleApplyFilters = () => {
    console.log('Applying filters:', filters);
  };

  const handleResetFilters = () => {
    setFilters({
      dateRange: 'last30days',
      reportType: 'all',
      status: 'all',
      startDate: '',
      endDate: ''
    });
  };

  const handleGenerateReport = (report) => {
    console.log('Generating report:', report);
    alert(`Generating ${report?.name}...\n\nThis will take a few moments. You'll receive a notification when it's ready.`);
  };

  const handleScheduleReport = (report) => {
    setSelectedReport(report);
    setShowScheduleModal(true);
  };

  const handleExportReport = (report) => {
    setSelectedReport(report);
    setShowExportModal(true);
  };

  const handleScheduleSubmit = (scheduleData) => {
    console.log('Scheduling report:', scheduleData);
    alert(`Report scheduled successfully!\n\nFrequency: ${scheduleData?.frequency}\nFormat: ${scheduleData?.format}\nRecipients: ${scheduleData?.recipients}`);
    setShowScheduleModal(false);
  };

  const handleExportSubmit = (exportData) => {
    console.log('Exporting report:', exportData);
    alert(`Exporting report...\n\nFormat: ${exportData?.format}\nDate Range: ${exportData?.dateRange}\n\nYour download will begin shortly.`);
    setShowExportModal(false);
  };

  const handleChartExport = (chartName) => {
    console.log('Exporting chart:', chartName);
    alert(`Exporting ${chartName}...\n\nYour download will begin shortly.`);
  };

  const handleChartFullscreen = (chartName) => {
    console.log('Opening fullscreen:', chartName);
    alert(`Opening ${chartName} in fullscreen mode...`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2">
                Reports & Analytics
              </h1>
              <p className="text-sm md:text-base text-muted-foreground">
                Comprehensive reporting suite with real-time analytics and insights
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                iconName="RefreshCw"
                iconPosition="left"
                onClick={() => alert('Refreshing data...')}
              >
                Refresh
              </Button>
              <Button
                variant="default"
                iconName="Download"
                iconPosition="left"
                onClick={() => alert('Exporting all reports...')}
              >
                Export All
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto scrollbar-hide border-b border-border">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                  activeTab === tab?.id
                    ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'
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
              {metrics?.map((metric) => (
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
                onExport={() => handleChartExport('Application Volume Trends')}
                onFullscreen={() => handleChartFullscreen('Application Volume Trends')}
              >
                <ApplicationVolumeChart />
              </ChartContainer>

              <ChartContainer
                title="Agent Performance Metrics"
                subtitle="Weekly conversion and customer acquisition trends"
                icon="TrendingUp"
                onExport={() => handleChartExport('Agent Performance Metrics')}
                onFullscreen={() => handleChartFullscreen('Agent Performance Metrics')}
              >
                <AgentPerformanceChart />
              </ChartContainer>
            </div>

            <ChartContainer
              title="Revenue Distribution by Loan Type"
              subtitle="Total revenue breakdown across product categories"
              icon="PieChart"
              onExport={() => handleChartExport('Revenue Distribution')}
              onFullscreen={() => handleChartFullscreen('Revenue Distribution')}
            >
              <RevenueDistributionChart />
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
                  key={report?.id}
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

            <div className="grid grid-cols-1 gap-6 md:gap-8">
              <ChartContainer
                title="Application Volume Trends"
                subtitle="Comprehensive monthly analysis"
                icon="BarChart3"
                onExport={() => handleChartExport('Application Volume Trends')}
                onFullscreen={() => handleChartFullscreen('Application Volume Trends')}
              >
                <ApplicationVolumeChart />
              </ChartContainer>

              <ChartContainer
                title="Agent Performance Metrics"
                subtitle="Weekly performance tracking"
                icon="TrendingUp"
                onExport={() => handleChartExport('Agent Performance Metrics')}
                onFullscreen={() => handleChartFullscreen('Agent Performance Metrics')}
              >
                <AgentPerformanceChart />
              </ChartContainer>

              <ChartContainer
                title="Revenue Distribution"
                subtitle="Product category breakdown"
                icon="PieChart"
                onExport={() => handleChartExport('Revenue Distribution')}
                onFullscreen={() => handleChartFullscreen('Revenue Distribution')}
              >
                <RevenueDistributionChart />
              </ChartContainer>
            </div>
          </div>
        )}

        {activeTab === 'scheduled' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-card border border-border rounded-lg p-6 md:p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon name="Calendar" size={24} color="var(--color-primary)" />
                </div>
                <div>
                  <h2 className="text-lg md:text-xl font-semibold text-foreground">
                    Scheduled Reports
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Automated report generation and distribution
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {reports?.filter(r => r?.isScheduled)?.map((report) => (
                  <ReportCard
                    key={report?.id}
                    report={report}
                    onGenerate={handleGenerateReport}
                    onSchedule={handleScheduleReport}
                    onExport={handleExportReport}
                  />
                ))}
              </div>
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