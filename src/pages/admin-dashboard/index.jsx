import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { trackEvent } from '../../hooks/useGoogleAnalytics';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import StatsCard from './components/StatsCard';
import ApplicationTable from './components/ApplicationTable';
import AgentManagementCard from './components/AgentManagementCard';
import EmployeeCard from './components/EmployeeCard';
import ActivityLog from './components/ActivityLog';

import { useAuth } from '../../contexts/AuthContext';
import { getApiBaseUrl } from '../../lib/runtimeConfig';
import { getAdminTabFromSearch, ADMIN_NAV_ITEMS } from '../../constants/adminNavigation';


import FilterPanel from './components/FilterPanel';
import PendingRegistrationsTab from './components/PendingRegistrationsTab';
import AgentOnboardingModal from './components/AgentOnboardingModal';
import EmployeeOnboardingModal from './components/EmployeeOnboardingModal';
import SystemConfigPanel from './components/SystemConfigPanel';
import CommissionConfigModal from './components/CommissionConfigModal';
import AccessControlModal from './components/AccessControlModal';
import DocumentVerificationModal from './components/DocumentVerificationModal';
import { adminService } from '../../services/adminService';
import { getLoanProductBySlug } from '../../constants/loanProducts';
import { pickCustomerPhotoDocument } from '../../utils/applicationFormDetails';
import { getDocumentPreviewUrl } from '../../utils/documentUrls';
import BankManagementTab from './components/BankManagementTab';
import HomepageCmsTab from './components/HomepageCmsTab';
import LeadsTab from './components/LeadsTab';
import StatusCheckAdminTab from './components/StatusCheckAdminTab';
import LoanProductsTab from './components/LoanProductsTab';


const AdminDashboard = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const activeTab = getAdminTabFromSearch(searchParams);
  const [registrationSubTab, setRegistrationSubTab] = useState('customers');
  const [showAgentModal, setShowAgentModal] = useState(false);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showCommissionModal, setShowCommissionModal] = useState(false);
  const [showAccessControlModal, setShowAccessControlModal] = useState(false);
  const [showDocVerificationModal, setShowDocVerificationModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [applicationsData, setApplicationsData] = useState([]);
  const [agentsData, setAgentsData] = useState([]);
  const [employeesData, setEmployeesData] = useState([]);
  const [statsData, setStatsData] = useState([
    {
      title: 'Total Applications',
      value: '0',
      change: '+0%',
      changeType: 'positive',
      icon: 'FileText',
      iconBg: 'bg-gradient-to-br from-primary to-secondary',
      trend: 'up'
    },
    {
      title: 'Pending Reviews',
      value: '0',
      change: '+0%',
      changeType: 'positive',
      icon: 'Clock',
      iconBg: 'bg-gradient-to-br from-warning to-orange-500',
      trend: 'up'
    },
    {
      title: 'Active Agents',
      value: '0',
      change: '+0%',
      changeType: 'positive',
      icon: 'Users',
      iconBg: 'bg-gradient-to-br from-agent-primary to-pink-600',
      trend: 'up'
    },
    {
      title: 'Approval Rate',
      value: '0%',
      change: '+0%',
      changeType: 'positive',
      icon: 'TrendingUp',
      iconBg: 'bg-gradient-to-br from-success to-emerald-600',
      trend: 'up'
    }
  ]);
  const [loading, setLoading] = useState(true);
  const [tabLoading, setTabLoading] = useState(false);
  const [statsLoaded, setStatsLoaded] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    priority: 'all',
    loanType: 'all'
  });

  const activeTabMeta = ADMIN_NAV_ITEMS.find((i) => i.tab === activeTab);

  useEffect(() => {
    if (!searchParams.get('tab')) {
      navigate('/admin-dashboard?tab=applications', { replace: true });
    }
  }, [searchParams, navigate]);

  useEffect(() => {
    if (authLoading || !user) return;
    loadStats();
  }, [authLoading, user]);

  useEffect(() => {
    if (authLoading || !user) return;
    loadTabData(activeTab);
  }, [activeTab, authLoading, user]);

  const resolveLoanTypeLabel = (app) => {
    if (app?.loanTypeLabel) return app.loanTypeLabel;
    const raw = app?.loanType || app?.data?.loanPurpose || app?.data?.loan_purpose;
    const product = getLoanProductBySlug(raw);
    if (product) return product.label;
    if (raw) {
      return String(raw)
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());
    }
    return 'Not specified';
  };

  const resolveLoanAmount = (app) => {
    const amount =
      app?.loanAmount ??
      app?.requestedLoanAmount ??
      app?.data?.requestedLoanAmount ??
      app?.data?.requested_loan_amount;
    const num = Number(amount);
    return Number.isFinite(num) ? num : 0;
  };

  const mapApplicationRow = (app, customerImage = null) => ({
    id: app?.id,
    rawApplication: app,
    customerName: app?.customer?.fullName || 'Unknown',
    customerEmail: app?.customer?.email || '',
    customerImage,
    customerImageAlt: customerImage
      ? `Photo of ${app?.customer?.fullName || 'customer'}`
      : `Profile of ${app?.customer?.fullName || 'customer'}`,
    loanType: resolveLoanTypeLabel(app),
    amount: resolveLoanAmount(app),
    bankName: app?.bank?.name || 'Not selected',
    bankLogo: app?.bank?.logoUrl || '',
    bankLogoAlt: app?.bank?.name ? `${app.bank.name} logo` : 'Bank',
    status: app?.status || 'pending',
    priority: app?.adminPriority || 'medium',
    date: new Date(app?.createdAt || app?.submittedAt)?.toISOString()?.split('T')?.[0] || '',
  });

  const enrichApplicationsWithPhotos = async (apps) => {
    const rows = await Promise.all(
      apps.map(async (app) => {
        try {
          const { data: docs } = await adminService.getApplicationDocuments(app.id);
          const photo = pickCustomerPhotoDocument(docs || []);
          const url = getDocumentPreviewUrl(photo);
          return mapApplicationRow(app, url);
        } catch {
          return mapApplicationRow(app, null);
        }
      }),
    );
    return rows;
  };

  const loadApplications = async (filterState = filters) => {
    const { data: apps, error } = await adminService.getAllApplications(filterState);
    if (error) {
      setApplicationsData([]);
      return { error };
    }
    const list = Array.isArray(apps) ? apps : [];
    const rows = await enrichApplicationsWithPhotos(list);
    setApplicationsData(rows);
    return { error: null };
  };

  const loadStats = async () => {
    if (statsLoaded) return;
    setLoading(true);
    setLoadError('');

    if (!getApiBaseUrl()) {
      setLoadError('API is not configured. Set VITE_API_BASE_URL or redeploy with runtime config.');
      setLoading(false);
      return;
    }

    const { data: stats, error: statsError } = await adminService.getDashboardStats();
    if (statsError) {
      setLoadError(statsError.message);
    } else if (stats) {
        setStatsData([
          {
            title: 'Total Applications',
            value: stats?.totalApplications?.toString() || '0',
            change: '+12.5%',
            changeType: 'positive',
            icon: 'FileText',
            iconBg: 'bg-gradient-to-br from-primary to-secondary',
            trend: 'up'
          },
          {
            title: 'Pending Reviews',
            value: stats?.pendingReviews?.toString() || '0',
            change: '+8.2%',
            changeType: 'positive',
            icon: 'Clock',
            iconBg: 'bg-gradient-to-br from-warning to-orange-500',
            trend: 'up'
          },
          {
            title: 'Active Agents',
            value: stats?.activeAgents?.toString() || '0',
            change: '+5.3%',
            changeType: 'positive',
            icon: 'Users',
            iconBg: 'bg-gradient-to-br from-agent-primary to-pink-600',
            trend: 'up'
          },
          {
            title: 'Approval Rate',
            value: stats?.approvalRate || '0%',
            change: '-2.1%',
            changeType: 'negative',
            icon: 'TrendingUp',
            iconBg: 'bg-gradient-to-br from-success to-emerald-600',
            trend: 'down'
          }
        ]);
    }
    setStatsLoaded(true);
    setLoading(false);
  };

  const loadTabData = async (tab) => {
    setTabLoading(true);
    const errors = [];

    try {
      if (tab === 'applications') {
        const { error: appsError } = await loadApplications(filters);
        if (appsError) errors.push(appsError.message);
      }

      if (tab === 'agents') {
        if (typeof adminService.getAllAgents !== 'function') {
          errors.push('Agent list is unavailable. Redeploy the frontend to load the latest admin API.');
        } else {
          const { data: agents, error: agentsError } = await adminService.getAllAgents();
          if (agentsError) {
            errors.push(agentsError.message);
          } else if (agents) {
            setAgentsData(agents.map(agent => ({
              id: agent?.id,
              agentId: agent?.agentCode || 'N/A',
              name: agent?.agentName || 'Unknown',
              email: agent?.email || '',
              profileImage: "https://img.rocket.new/generatedImages/rocket_gen_img_14760cf8e-1763296171419.png",
              profileImageAlt: `Profile picture of ${agent?.agentName}`,
              status: agent?.onboardingStatus || 'pending',
              totalClients: agent?.agent?.totalClients || 0,
              totalCommission: agent?.agent?.totalCommission || 0,
              successRate: agent?.agent?.successRate || 0,
              joinedDate: new Date(agent?.createdAt)?.toISOString()?.split('T')?.[0] || ''
            })));
          }
        }
      }

      if (tab === 'employees') {
        if (typeof adminService.getAllEmployees !== 'function') {
          errors.push('Employee list is unavailable. Redeploy the frontend to load the latest admin API.');
        } else {
          const { data: employees, error: employeesError } = await adminService.getAllEmployees();
          if (employeesError) {
            errors.push(employeesError.message);
          } else if (employees) {
            setEmployeesData(employees.map(emp => ({
              id: emp?.id,
              name: emp?.employeeName || 'Unknown',
              email: emp?.email || '',
              profileImage: "https://img.rocket.new/generatedImages/rocket_gen_img_1b80e6770-1763297889591.png",
              profileImageAlt: `Profile picture of ${emp?.employeeName}`,
              role: emp?.userProfile?.role || 'employee',
              department: 'Operations',
              tasksCompleted: 0,
              tasksTotal: 0,
              lastActive: '5 min ago',
              isOnline: emp?.userProfile?.isActive || false,
              permissions: emp?.accessControls?.map(ac => ac?.moduleName) || []
            })));
          }
        }
      }
    } catch (error) {
      console.error('Error loading tab data:', error);
      errors.push(error?.message || 'Failed to load section');
    }

    if (errors.length) {
      setLoadError(errors.join(' '));
    }
    setTabLoading(false);
  };

  const refreshCurrentTab = () => loadTabData(activeTab);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => {
      const next = { ...prev, [key]: value };
      if (activeTab === 'applications') {
        setTimeout(() => loadApplications(next), 0);
      }
      return next;
    });
  };

  const handleResetFilters = () => {
    const reset = {
      search: '',
      status: 'all',
      priority: 'all',
      loanType: 'all',
    };
    setFilters(reset);
    if (activeTab === 'applications') {
      loadApplications(reset);
    }
  };

  const handleViewDetails = (application) => {
    console.log('View application details:', application);
  };

  const handleApproveApplication = async (applicationId, reviewNotes) => {
    const { error } = await adminService?.approveApplication(applicationId, reviewNotes);
    if (!error) {
      await refreshCurrentTab();
      alert('Application approved successfully');
    } else {
      alert('Failed to approve application: ' + error?.message);
    }
  };

  const handleRejectApplication = async (applicationId, rejectionReason) => {
    const { error } = await adminService?.rejectApplication(applicationId, rejectionReason);
    if (!error) {
      await refreshCurrentTab();
      alert('Application rejected');
    } else {
      alert('Failed to reject application: ' + error?.message);
    }
  };

  const handleViewApplicationDetails = (application) => {
    setSelectedApplication(application);
    setShowDocVerificationModal(true);
  };

  const handleApproveAgent = async (agentId) => {
    const { error } = await adminService?.approveAgent(agentId);
    if (!error) {
      await refreshCurrentTab();
      alert('Agent approved successfully');
    } else {
      alert('Failed to approve agent: ' + error?.message);
    }
  };

  const handleRejectAgent = async (agentId) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;

    const { error } = await adminService?.rejectAgent(agentId, reason);
    if (!error) {
      await refreshCurrentTab();
      alert('Agent rejected');
    } else {
      alert('Failed to reject agent: ' + error?.message);
    }
  };

  const handleConfigureCommission = (agent) => {
    setSelectedAgent(agent);
    setShowCommissionModal(true);
  };

  const handleSaveCommission = async (commissionConfig) => {
    if (!selectedAgent) return;

    const { error } = await adminService?.updateAgentCommission(selectedAgent?.id, commissionConfig);
    if (!error) {
      setShowCommissionModal(false);
      alert('Commission configuration saved successfully');
    } else {
      alert('Failed to save commission: ' + error?.message);
    }
  };

  const handleEditEmployeeRole = (employee) => {
    setSelectedEmployee(employee);
    setShowAccessControlModal(true);
  };

  const handleSaveAccessControl = async (accessControls) => {
    if (!selectedEmployee) return;

    const { error } = await adminService?.updateEmployeeAccessControls(selectedEmployee?.id, accessControls);
    if (!error) {
      setShowAccessControlModal(false);
      await refreshCurrentTab();
      alert('Access controls updated successfully');
    } else {
      alert('Failed to update access controls: ' + error?.message);
    }
  };

  const handleViewAgentProfile = (agent) => {
    console.log('View agent profile:', agent);
  };

  const handleViewEmployeeActivity = (employee) => {
    console.log('View employee activity:', employee);
  };

  const handleQuickAction = (actionId) => {
    trackEvent('admin_quick_action', { action: actionId });
    const actionMap = {
      'approve-applications': () => navigate('/admin-dashboard?tab=applications'),
      'review-agents': () => navigate('/admin-dashboard?tab=agents'),
      'manage-employees': () => navigate('/admin-dashboard?tab=employees'),
      'update-matrix': () => navigate('/interest-matrix-management'),
      'view-reports': () => navigate('/reports-and-analytics'),
      'system-settings': () => navigate('/admin-dashboard?tab=system'),
    };

    const action = actionMap?.[actionId];
    if (action) action();
  };

  const showStats = ['applications', 'agents', 'employees', 'registrations', 'leads'].includes(activeTab);

  return (
    <>
        {loadError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
            {loadError}
          </div>
        )}

        {showStats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-5">
            {statsData?.map((stat, index) => (
              <StatsCard key={index} {...stat} />
            ))}
          </div>
        )}

        <div className="mb-4">
          <h1 className="text-xl md:text-2xl font-bold text-foreground">
            {activeTabMeta?.label || 'Dashboard'}
          </h1>
        </div>

        <div className="bg-card rounded-lg border border-border p-4 md:p-6">
            {loading || tabLoading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
                <p className="mt-3 text-sm text-muted-foreground">Loading…</p>
              </div>
            ) : (
              <>
                {/* Applications Tab */}
                {activeTab === 'applications' && (
                  <div className="space-y-6">
                    <FilterPanel filters={filters} onFilterChange={handleFilterChange} onReset={handleResetFilters} />
                    <ApplicationTable
                      applications={applicationsData}
                      onViewDetails={handleViewApplicationDetails}
                      onApprove={handleApproveApplication}
                      onReject={handleRejectApplication}
                    />
                  </div>
                )}

                {/* Registrations Tab */}
                {activeTab === 'registrations' && (
                  <PendingRegistrationsTab />
                )}

                {/* Agents Tab */}
                {activeTab === 'agents' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-foreground">Agent Management</h2>
                      <Button onClick={() => setShowAgentModal(true)} iconName="Plus">
                        Add Agent
                      </Button>
                    </div>
                    <div className="grid gap-4">
                      {agentsData?.map((agent) => (
                        <AgentManagementCard
                          key={agent?.id}
                          agent={agent}
                          onApprove={handleApproveAgent}
                          onReject={handleRejectAgent}
                          onViewProfile={handleConfigureCommission}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Employees Tab */}
                {activeTab === 'employees' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-foreground">Employee Management</h2>
                      <Button onClick={() => setShowEmployeeModal(true)} iconName="Plus">
                        Add Employee
                      </Button>
                    </div>
                    <div className="grid gap-4">
                      {employeesData?.map((employee) => (
                        <EmployeeCard
                          key={employee?.id}
                          employee={employee}
                          onEdit={(emp) => {
                            setSelectedEmployee(emp);
                            setShowEmployeeModal(true);
                          }}
                          onEditRole={handleEditEmployeeRole}
                          onViewActivity={handleViewEmployeeActivity}
                          onAccessControl={(emp) => {
                            setSelectedEmployee(emp);
                            setShowAccessControlModal(true);
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'bank-management' && <BankManagementTab />}

                {activeTab === 'loan-products' && <LoanProductsTab />}

                {activeTab === 'homepage-cms' && <HomepageCmsTab />}

                {activeTab === 'status-check' && <StatusCheckAdminTab />}

                {activeTab === 'leads' && <LeadsTab />}

                {/* System Configuration Tab */}
                {activeTab === 'system' && (
                  <SystemConfigPanel />
                )}

                {/* Activity Tab */}
                {activeTab === 'activity' && (
                  <ActivityLog activities={[]} />
                )}
              </>
            )}
        </div>

      {/* Modals */}
      <AgentOnboardingModal
        isOpen={showAgentModal}
        onClose={() => setShowAgentModal(false)}
        onSuccess={refreshCurrentTab}
      />
      <EmployeeOnboardingModal
        isOpen={showEmployeeModal}
        onClose={() => setShowEmployeeModal(false)}
        onSuccess={refreshCurrentTab}
      />
      <CommissionConfigModal
        agent={selectedAgent}
        isOpen={showCommissionModal}
        onClose={() => setShowCommissionModal(false)}
        onSave={handleSaveCommission}
      />
      <AccessControlModal
        employee={selectedEmployee}
        isOpen={showAccessControlModal}
        onClose={() => setShowAccessControlModal(false)}
        onSave={handleSaveAccessControl}
      />
      <DocumentVerificationModal
        application={selectedApplication}
        isOpen={showDocVerificationModal}
        onClose={() => setShowDocVerificationModal(false)}
        onApprove={handleApproveApplication}
        onReject={handleRejectApplication}
      />
    </>
  );
};

export default AdminDashboard;