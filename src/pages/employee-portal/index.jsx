import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

import Input from '../../components/ui/Input';

import DocumentViewer from './components/DocumentViewer';
import PerformanceMetrics from './components/PerformanceMetrics';
import ActivityLog from './components/ActivityLog';
import TrainingResources from './components/TrainingResources';
import AgentVerificationModal from './components/AgentVerificationModal';
import ApplicationReviewModal from './components/ApplicationReviewModal';
import StatusUpdateModal from './components/StatusUpdateModal';
import { employeeService } from '../../services/employeeService';
import SessionTimeout from '../../components/SessionTimeout';
import { useAuth } from '../../contexts/AuthContext';


const EmployeePortal = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('applications');
  const [loading, setLoading] = useState(false);
  
  // Real data from Supabase
  const [pendingAgents, setPendingAgents] = useState([]);
  const [assignedApplications, setAssignedApplications] = useState([]);
  const [pendingDocuments, setPendingDocuments] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [activityLog, setActivityLog] = useState([]);

  const mockTrainingResources = [
  {
    id: 1,
    title: "Advanced Document Fraud Detection",
    description: "Learn to identify sophisticated document forgeries and manipulation techniques using AI-powered tools and manual verification methods.",
    category: "Fraud Detection",
    duration: "45 min",
    completions: "234",
    isNew: true
  },
  {
    id: 2,
    title: "KYC Compliance Updates 2026",
    description: "Stay updated with the latest KYC regulations and compliance requirements for financial institutions in 2026.",
    category: "Compliance",
    duration: "30 min",
    completions: "567",
    isNew: true
  },
  {
    id: 3,
    title: "Income Verification Best Practices",
    description: "Master the techniques for verifying income documents including salary slips, bank statements, and tax returns.",
    category: "Document Verification",
    duration: "60 min",
    completions: "892",
    isNew: false
  },
  {
    id: 4,
    title: "Customer Communication Excellence",
    description: "Enhance your communication skills for handling customer queries and document clarification requests professionally.",
    category: "Customer Service",
    duration: "40 min",
    completions: "445",
    isNew: false
  }];


  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Load dashboard stats
      const { data: stats } = await employeeService?.getEmployeeDashboardStats();
      setDashboardStats(stats);

      // Load pending agents
      const { data: agents } = await employeeService?.getPendingAgentOnboarding();
      setPendingAgents(agents || []);

      // Load assigned applications
      const { data: applications } = await employeeService?.getAssignedApplications();
      setAssignedApplications(applications || []);

      // Load pending documents
      const { data: documents } = await employeeService?.getPendingDocuments();
      setPendingDocuments(documents || []);

      // Load activity log
      const { data: activities } = await employeeService?.getEmployeeActivityLog();
      setActivityLog(activities || []);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveAgent = async (agentId, credentials) => {
    const { error } = await employeeService?.approveAgentOnboarding(agentId, credentials);
    if (!error) {
      setSelectedAgent(null);
      loadDashboardData();
    }
  };

  const handleRejectAgent = async (agentId, reason) => {
    const { error } = await employeeService?.rejectAgentOnboarding(agentId, reason);
    if (!error) {
      setSelectedAgent(null);
      loadDashboardData();
    }
  };

  const handleReviewApplication = async (applicationId, reviewData) => {
    const { error } = await employeeService?.reviewApplication(applicationId, reviewData);
    if (!error) {
      setSelectedApplication(null);
      loadDashboardData();
    }
  };

  const handleUpdateStatus = async (applicationId, statusData) => {
    const { error } = await employeeService?.updateApplicationStatus(applicationId, statusData);
    if (!error) {
      setShowStatusModal(false);
      loadDashboardData();
    }
  };

  const handleVerifyDocument = async (documentId, verificationData) => {
    const { error } = await employeeService?.verifyDocument(documentId, verificationData);
    if (!error) {
      setSelectedDocument(null);
      loadDashboardData();
    }
  };

  const handleRequestReupload = async (documentId, reason) => {
    const { error } = await employeeService?.requestDocumentReupload(documentId, reason);
    if (!error) {
      setSelectedDocument(null);
      loadDashboardData();
    }
  };

  const priorityOptions = [
  { value: 'all', label: 'All Priorities' },
  { value: 'high', label: 'High Priority' },
  { value: 'medium', label: 'Medium Priority' },
  { value: 'low', label: 'Low Priority' }];


  const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' }];


  const filteredApplications = assignedApplications?.filter((app) => {
    const matchesSearch = app?.customer?.fullName?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
      app?.applicationNumber?.toLowerCase()?.includes(searchQuery?.toLowerCase());
    return matchesSearch;
  });

  const tabs = [
  { id: 'applications', label: 'Applications', icon: 'FileText', count: assignedApplications?.length },
  { id: 'agents', label: 'Agent Verification', icon: 'UserCheck', count: pendingAgents?.length },
  { id: 'documents', label: 'Document Review', icon: 'FolderOpen', count: pendingDocuments?.length },
  { id: 'activity', label: 'Activity Log', icon: 'Activity' },
  { id: 'training', label: 'Training', icon: 'GraduationCap' }];


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <SessionTimeout timeoutMinutes={30} warningMinutes={2} />
      
      {/* Header */}
      <Header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-employee-primary to-employee-secondary rounded-xl flex items-center justify-center shadow-lg">
              <Icon name="Briefcase" className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-employee-primary to-employee-secondary bg-clip-text text-transparent">
                Employee Portal
              </h1>
              <p className="text-sm text-gray-600">Document verification and application processing</p>
            </div>
          </div>
          <Button
            onClick={async () => {
              await signOut();
              navigate('/employee-login');
            }}
            variant="outline"
            className="flex items-center gap-2 border-red-200 text-red-600 hover:bg-red-50"
          >
            <Icon name="LogOut" className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </Header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2">
                Employee Portal
              </h1>
              <p className="text-sm md:text-base text-muted-foreground">
                Manage verifications, applications, and customer support tasks
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => navigate('/document-management-center')}>

                <Icon name="FolderOpen" size={16} className="mr-2" />
                Documents
              </Button>
              <Button
                variant="default"
                onClick={() => loadDashboardData()}>
                <Icon name="RefreshCw" size={16} className="mr-2" />
                Refresh
              </Button>
            </div>
          </div>

          {dashboardStats && (
            <PerformanceMetrics metrics={{
              tasksCompletedToday: dashboardStats?.completedToday,
              pendingTasks: dashboardStats?.assignedApplications + dashboardStats?.pendingAgents,
              avgProcessingTime: "18 min",
              qualityScore: 96
            }} />
          )}
        </div>

        <div className="mb-6">
          <div className="flex flex-wrap gap-2 border-b border-border">
            {tabs?.map((tab) =>
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-colors ${
              activeTab === tab?.id
                ? 'border-primary text-primary font-semibold' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
              }`}>

                <Icon name={tab?.icon} size={18} />
                <span className="text-sm md:text-base">{tab?.label}</span>
                {tab?.count !== undefined && (
                  <span className="ml-1 px-2 py-0.5 bg-primary text-primary-foreground rounded-full text-xs font-semibold">
                    {tab?.count}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>

        {activeTab === 'applications' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Search by customer name or application ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e?.target?.value)}
                  className="w-full"
                />
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <Icon name="Loader" size={32} className="animate-spin mx-auto text-primary" />
                <p className="text-muted-foreground mt-4">Loading applications...</p>
              </div>
            ) : filteredApplications?.length > 0 ? (
              <div className="space-y-4">
                {filteredApplications?.map((app) => (
                  <div key={app?.id} className="bg-card border border-border rounded-lg p-4 md:p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="text-lg font-semibold text-foreground">{app?.customer?.fullName}</h3>
                          <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">
                            {app?.applicationNumber}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                          <div>
                            <span className="text-muted-foreground">Loan Type:</span>
                            <p className="font-medium text-foreground">{app?.loanPurpose}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Amount:</span>
                            <p className="font-medium text-foreground">₹{app?.requestedLoanAmount?.toLocaleString()}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Status:</span>
                            <p className="font-medium text-foreground">{app?.status}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Submitted:</span>
                            <p className="font-medium text-foreground">{new Date(app?.submittedAt)?.toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedApplication(app)}>
                          <Icon name="Eye" size={14} className="mr-1" />
                          Review
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => {
                            setSelectedApplication(app);
                            setShowStatusModal(true);
                          }}>
                          <Icon name="RefreshCw" size={14} className="mr-1" />
                          Update Status
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-card border border-border rounded-lg">
                <Icon name="Inbox" size={48} className="mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No applications assigned</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'agents' && (
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-12">
                <Icon name="Loader" size={32} className="animate-spin mx-auto text-primary" />
                <p className="text-muted-foreground mt-4">Loading agents...</p>
              </div>
            ) : pendingAgents?.length > 0 ? (
              pendingAgents?.map((agent) => (
                <div key={agent?.id} className="bg-card border border-border rounded-lg p-4 md:p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-lg font-semibold text-foreground">{agent?.agentName}</h3>
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-medium">
                          Pending Verification
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div>
                          <span className="text-muted-foreground">Agent Code:</span>
                          <p className="font-medium text-foreground">{agent?.agentCode}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Email:</span>
                          <p className="font-medium text-foreground">{agent?.email}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Mobile:</span>
                          <p className="font-medium text-foreground">{agent?.mobileNumber}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Submitted:</span>
                          <p className="font-medium text-foreground">{new Date(agent?.createdAt)?.toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => setSelectedAgent(agent)}>
                      <Icon name="UserCheck" size={14} className="mr-1" />
                      Verify Agent
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-card border border-border rounded-lg">
                <Icon name="UserCheck" size={48} className="mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No pending agent verifications</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-12">
                <Icon name="Loader" size={32} className="animate-spin mx-auto text-primary" />
                <p className="text-muted-foreground mt-4">Loading documents...</p>
              </div>
            ) : pendingDocuments?.length > 0 ? (
              <div className="space-y-4">
                {pendingDocuments?.map((doc) => (
                  <div key={doc?.id} className="bg-card border border-border rounded-lg p-4 md:p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="text-lg font-semibold text-foreground">{doc?.title}</h3>
                          <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">
                            {doc?.type}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                          <div>
                            <span className="text-muted-foreground">Submitted:</span>
                            <p className="font-medium text-foreground">{new Date(doc?.createdAt)?.toLocaleDateString()}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Status:</span>
                            <p className="font-medium text-foreground">{doc?.status}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Size:</span>
                            <p className="font-medium text-foreground">{doc?.size} bytes</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Pages:</span>
                            <p className="font-medium text-foreground">{doc?.pages}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedDocument(doc)}>
                          <Icon name="Eye" size={14} className="mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-card border border-border rounded-lg">
                <Icon name="FolderOpen" size={48} className="mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No documents pending</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'activity' && (
          <ActivityLog activities={activityLog} />
        )}

        {activeTab === 'training' && (
          <TrainingResources resources={mockTrainingResources} />
        )}
      </main>

      {selectedDocument && (
        <DocumentViewer
          document={selectedDocument}
          onClose={() => setSelectedDocument(null)}
          onApprove={handleVerifyDocument}
          onReject={handleRequestReupload}
        />
      )}

      {selectedAgent && (
        <AgentVerificationModal
          agent={selectedAgent}
          isOpen={!!selectedAgent}
          onClose={() => setSelectedAgent(null)}
          onApprove={handleApproveAgent}
          onReject={handleRejectAgent}
        />
      )}

      {selectedApplication && !showStatusModal && (
        <ApplicationReviewModal
          application={selectedApplication}
          isOpen={!!selectedApplication}
          onClose={() => setSelectedApplication(null)}
          onReview={handleReviewApplication}
        />
      )}

      {showStatusModal && selectedApplication && (
        <StatusUpdateModal
          application={selectedApplication}
          isOpen={showStatusModal}
          onClose={() => {
            setShowStatusModal(false);
            setSelectedApplication(null);
          }}
          onUpdate={handleUpdateStatus}
        />
      )}
    </div>
  );
};

export default EmployeePortal;