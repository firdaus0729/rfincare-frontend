import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { trackEvent } from '../../hooks/useGoogleAnalytics';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import StatsCard from './components/StatsCard';
import ApplicationTable from './components/ApplicationTable';
import AgentManagementCard from './components/AgentManagementCard';
import EmployeeCard from './components/EmployeeCard';
import ActivityLog from './components/ActivityLog';

import { useAuth } from '../../contexts/AuthContext';


import FilterPanel from './components/FilterPanel';
import PendingRegistrationsTab from './components/PendingRegistrationsTab';
import AgentOnboardingModal from './components/AgentOnboardingModal';
import EmployeeOnboardingModal from './components/EmployeeOnboardingModal';
import SystemConfigPanel from './components/SystemConfigPanel';
import CommissionConfigModal from './components/CommissionConfigModal';
import AccessControlModal from './components/AccessControlModal';
import DocumentVerificationModal from './components/DocumentVerificationModal';
import { adminService } from '../../services/adminService';
import BankManagementTab from './components/BankManagementTab';
import HomepageCmsTab from './components/HomepageCmsTab';


const AdminDashboard = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('applications');
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
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    priority: 'all',
    loanType: 'all'
  });

  const tabs = [
    { id: 'applications', label: 'Applications', icon: 'FileText' },
    { id: 'registrations', label: 'Registrations', icon: 'UserPlus' },
    { id: 'agents', label: 'Agents', icon: 'Users' },
    { id: 'employees', label: 'Employees', icon: 'Briefcase' },
    { id: 'system', label: 'System Config', icon: 'Settings' },
    { id: 'activity', label: 'Activity', icon: 'Activity' },
    { id: 'bank-marketplace', label: 'Bank Marketplace', icon: 'Building' },
    { id: 'approval-matrix', label: 'Approval Matrix', icon: 'Grid' },
    { id: 'reports', label: 'Reports', icon: 'BarChart' },
    { id: 'audit-logs', label: 'Audit Logs', icon: 'Shield' },
    { id: 'homepage-cms', label: 'Homepage CMS', icon: 'Layout' },
  ];

  useEffect(() => {
    loadDashboardData();
  }, [activeTab]);

  const mapApplicationRow = (app) => ({
    id: app?.id,
    customerName: app?.customer?.fullName || 'Unknown',
    customerEmail: app?.customer?.email || '',
    customerImage: 'https://img.rocket.new/generatedImages/rocket_gen_img_14da91c34-1763294780479.png',
    customerImageAlt: `Profile picture of ${app?.customer?.fullName}`,
    loanType: app?.loanType || 'Unknown',
    amount: app?.loanAmount || 0,
    bankName: app?.bank?.name || 'Unknown',
    bankLogo: app?.bank?.logoUrl || '',
    bankLogoAlt: `${app?.bank?.name} logo`,
    status: app?.status || 'pending',
    priority: app?.adminPriority || 'medium',
    date: new Date(app?.createdAt)?.toISOString()?.split('T')?.[0] || '',
  });

  const loadApplications = async (filterState = filters) => {
    const { data: apps } = await adminService?.getAllApplications(filterState);
    if (apps) {
      setApplicationsData(apps.map(mapApplicationRow));
    }
  };

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Load dashboard stats
      const { data: stats } = await adminService?.getDashboardStats();
      if (stats) {
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

      if (activeTab === 'applications') {
        await loadApplications(filters);
      }

      // Load agents if on agents tab
      if (activeTab === 'agents') {
        const { data: agents } = await adminService?.getAllAgents();
        if (agents) {
          setAgentsData(agents?.map(agent => ({
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

      // Load employees if on employees tab
      if (activeTab === 'employees') {
        const { data: employees } = await adminService?.getAllEmployees();
        if (employees) {
          setEmployeesData(employees?.map(emp => ({
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
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabClick = (tabId) => {
    trackEvent('admin_tab_change', { tab: tabId });
    if (tabId === 'bank-marketplace') {
      navigate('/bank-marketplace-management');
    } else if (tabId === 'approval-matrix') {
      navigate('/approval-matrix-management');
    } else if (tabId === 'reports') {
      navigate('/reports-and-analytics');
    } else if (tabId === 'audit-logs') {
      navigate('/admin-security-dashboard');
    } else {
      setActiveTab(tabId);
    }
  };

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
      await loadDashboardData();
      alert('Application approved successfully');
    } else {
      alert('Failed to approve application: ' + error?.message);
    }
  };

  const handleRejectApplication = async (applicationId, rejectionReason) => {
    const { error } = await adminService?.rejectApplication(applicationId, rejectionReason);
    if (!error) {
      await loadDashboardData();
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
      await loadDashboardData();
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
      await loadDashboardData();
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
      await loadDashboardData();
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
      'approve-applications': () => setActiveTab('applications'),
      'review-agents': () => setActiveTab('agents'),
      'manage-employees': () => setActiveTab('employees'),
      'update-matrix': () => navigate('/interest-matrix-management'),
      'view-reports': () => navigate('/reports-and-analytics'),
      'system-settings': () => console.log('Open system settings')
    };

    const action = actionMap?.[actionId];
    if (action) action();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-primary to-secondary p-3 rounded-lg">
              <Icon name="Shield" className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Admin Dashboard</h2>
              <p className="text-sm text-gray-600">Manage applications, agents, and system configuration</p>
            </div>
          </div>
          <Button
            onClick={async () => {
              await signOut();
              navigate('/admin-login');
            }}
            variant="outline"
            className="flex items-center gap-2 border-red-200 text-red-600 hover:bg-red-50"
          >
            <Icon name="LogOut" className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </Header>
      <div className="container mx-auto px-4 py-6 md:py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage applications, agents, employees, and system configuration
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
          {statsData?.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="border-b border-border overflow-x-auto">
            <div className="flex space-x-1 p-2 min-w-max">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => handleTabClick(tab?.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                    activeTab === tab?.id
                      ? 'bg-primary text-white' : 'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  <Icon name={tab?.icon} size={18} />
                  <span className="text-sm font-medium">{tab?.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 md:p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="mt-4 text-muted-foreground">Loading...</p>
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

                {activeTab === 'homepage-cms' && <HomepageCmsTab />}

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
        </div>
      </div>

      {/* Modals */}
      <AgentOnboardingModal
        isOpen={showAgentModal}
        onClose={() => setShowAgentModal(false)}
        onSuccess={loadDashboardData}
      />
      <EmployeeOnboardingModal
        isOpen={showEmployeeModal}
        onClose={() => setShowEmployeeModal(false)}
        onSuccess={loadDashboardData}
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
    </div>
  );
};

export default AdminDashboard;