import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import PerformanceMetrics from './components/PerformanceMetrics';
import ClientKanbanBoard from './components/ClientKanbanBoard';
import CommissionTracker from './components/CommissionTracker';
import PerformanceChart from './components/PerformanceChart';
import UpcomingAppointments from './components/UpcomingAppointments';
import TrainingResources from './components/TrainingResources';
import QuickActions from './components/QuickActions';
import RecentActivity from './components/RecentActivity';
import SessionTimeout from '../../components/SessionTimeout';
import { authService } from '../../services/authService';
import { agentService } from '../../services/agentService';
import { useAuth } from '../../contexts/AuthContext';

const signOut = async () => {
  try {
    await authService?.signOut();
    localStorage.removeItem('authToken');
    sessionStorage.clear();
  } catch (error) {
    console.error('Sign out error:', error);
  }
};

const AgentDashboard = () => {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const [selectedView, setSelectedView] = useState('overview');
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const data = await agentService.getDashboard();
      setDashboard(data);
    } catch (err) {
      console.error('Agent dashboard load failed:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const agentProfile = {
    name: dashboard?.profile?.name || userProfile?.full_name || 'Agent',
    agentId: dashboard?.profile?.agentId || '—',
    avatar: 'https://img.rocket.new/generatedImages/rocket_gen_img_14da91c34-1763294780479.png',
    avatarAlt: `Profile of ${dashboard?.profile?.name || 'agent'}`,
    joinDate: '—',
    tier: dashboard?.profile?.tier || 'Agent',
    rating: 4.5,
    totalClients: dashboard?.profile?.totalClients ?? 0,
    activeClients: dashboard?.profile?.activeClients ?? 0,
  };

  const performanceMetrics = dashboard?.metrics?.length
    ? dashboard.metrics
    : [
        { id: 1, type: 'customers', label: 'Active Clients', value: '0', subtitle: 'Loading…' },
      ];

  const clients = (dashboard?.clients || []).map((c) => ({
    ...c,
    avatar: c.avatar || agentProfile.avatar,
    avatarAlt: c.avatarAlt || c.name,
  }));

  const commissions = [];

  const chartData = dashboard?.weeklyPerformance || [];
  const circulars = dashboard?.circulars || [];


  const appointments = [
  {
    id: 1,
    clientName: "Michael Rodriguez",
    clientAvatar: "https://img.rocket.new/generatedImages/rocket_gen_img_143b978a3-1763294952544.png",
    clientAvatarAlt: "Professional headshot of Hispanic man with short black hair in navy suit",
    title: "Initial Consultation",
    type: "consultation",
    date: "Jan 16, 2026",
    time: "10:00 AM",
    location: "Video Call"
  },
  {
    id: 2,
    clientName: "Emily Chen",
    clientAvatar: "https://img.rocket.new/generatedImages/rocket_gen_img_18a713e78-1763297858426.png",
    clientAvatarAlt: "Professional headshot of Asian woman with long black hair wearing white blouse",
    title: "Document Review",
    type: "document-review",
    date: "Jan 16, 2026",
    time: "2:30 PM",
    location: "Office Meeting"
  },
  {
    id: 3,
    clientName: "James Wilson",
    clientAvatar: "https://img.rocket.new/generatedImages/rocket_gen_img_130504d21-1763295915180.png",
    clientAvatarAlt: "Professional headshot of Caucasian man with gray hair wearing dark suit",
    title: "Follow-up Call",
    type: "follow-up",
    date: "Jan 17, 2026",
    time: "11:00 AM",
    location: "Phone Call"
  }];


  const trainingResources = [
  {
    id: 1,
    type: 'course',
    title: 'Advanced Loan Processing',
    description: 'Master complex loan scenarios and approval strategies',
    duration: '4 hours',
    progress: 65,
    completedBy: 234,
    isNew: false
  },
  {
    id: 2,
    type: 'certification',
    title: 'Financial Services Certification',
    description: 'Industry-recognized certification for financial advisors',
    duration: '8 hours',
    progress: 0,
    completedBy: 156,
    isNew: true
  },
  {
    id: 3,
    type: 'video',
    title: 'Customer Communication Best Practices',
    description: 'Effective strategies for client engagement and retention',
    duration: '45 minutes',
    progress: 100,
    completedBy: 412,
    isNew: false
  },
  {
    id: 4,
    type: 'webinar',
    title: 'Q1 2026 Product Updates',
    description: 'Latest features and policy changes for loan products',
    duration: '1 hour',
    progress: 0,
    completedBy: 89,
    isNew: true
  }];


  const recentActivities = [
  {
    id: 1,
    type: 'client-added',
    title: 'New client registered',
    description: 'David Thompson added for home loan application',
    clientName: 'David Thompson',
    clientAvatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1a184de25-1763292715446.png",
    clientAvatarAlt: 'Professional headshot of African American man with short hair wearing gray suit',
    timestamp: new Date(Date.now() - 300000),
    metadata: { amount: '₹520,000' }
  },
  {
    id: 2,
    type: 'document-uploaded',
    title: 'Documents submitted',
    description: 'Income verification documents uploaded for Emily Chen',
    clientName: 'Emily Chen',
    clientAvatar: "https://img.rocket.new/generatedImages/rocket_gen_img_18a713e78-1763297858426.png",
    clientAvatarAlt: 'Professional headshot of Asian woman with long black hair wearing white blouse',
    timestamp: new Date(Date.now() - 3600000),
    metadata: null
  },
  {
    id: 3,
    type: 'commission-earned',
    title: 'Commission received',
    description: 'Payment processed for Robert Anderson home loan',
    clientName: 'Robert Anderson',
    timestamp: new Date(Date.now() - 7200000),
    metadata: { amount: '₹4,500', status: 'Paid' }
  },
  {
    id: 4,
    type: 'status-changed',
    title: 'Application status updated',
    description: 'Priya Sharma application moved to submitted stage',
    clientName: 'Priya Sharma',
    clientAvatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1cfa37edb-1763295967528.png",
    clientAvatarAlt: 'Professional headshot of Indian woman with black hair in elegant blue dress',
    timestamp: new Date(Date.now() - 10800000),
    metadata: { status: 'Submitted' }
  },
  {
    id: 5,
    type: 'meeting-scheduled',
    title: 'Appointment scheduled',
    description: 'Initial consultation booked with Michael Rodriguez',
    clientName: 'Michael Rodriguez',
    clientAvatar: "https://img.rocket.new/generatedImages/rocket_gen_img_143b978a3-1763294952544.png",
    clientAvatarAlt: 'Professional headshot of Hispanic man with short black hair in navy suit',
    timestamp: new Date(Date.now() - 14400000),
    metadata: null
  }];


  const handleClientClick = (client) => {
    console.log('Client clicked:', client);
  };

  const handleStatusChange = async (clientId, newStatus) => {
    try {
      await agentService.updateClientStatus(clientId, newStatus);
      await loadDashboard();
    } catch (err) {
      console.error('Status update failed:', err);
    }
  };

  const handleQuickAction = (actionId) => {
    console.log('Quick action:', actionId);
    
    switch(actionId) {
      case 'add-client': navigate('/customer-registration-portal');
        break;
      case 'upload-document':
        navigate('/document-management-center');
        break;
      case 'schedule-meeting':
        // Scroll to appointments section or open scheduling modal
        setSelectedView('overview');
        setTimeout(() => {
          const appointmentsSection = document.querySelector('[data-section="appointments"]');
          appointmentsSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
        break;
      case 'view-commission':
        // Switch to performance view to show commission tracker
        setSelectedView('performance');
        setTimeout(() => {
          const commissionSection = document.querySelector('[data-section="commission"]');
          commissionSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
        break;
      default:
        console.log('Unknown action:', actionId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <SessionTimeout timeoutMinutes={30} warningMinutes={2} />
      
      {/* Header */}
      <Header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-agent-primary to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
              <Icon name="Users" className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-agent-primary to-pink-600 bg-clip-text text-transparent">
                Agent Dashboard
              </h1>
              <p className="text-sm text-gray-600">Manage clients and track performance</p>
            </div>
          </div>
          <Button
            onClick={async () => {
              await signOut();
              navigate('/agent-login');
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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <img
                src={agentProfile?.avatar}
                alt={agentProfile?.avatarAlt}
                className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-4 border-primary/20" />

              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                  Welcome back, {agentProfile?.name}
                </h1>
                <div className="flex items-center space-x-3 mt-1">
                  <span className="text-sm text-muted-foreground">{agentProfile?.agentId}</span>
                  <span className="text-sm px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full font-semibold">
                    {agentProfile?.tier}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Icon name="Star" size={14} color="var(--color-warning)" />
                    <span className="text-sm font-semibold text-foreground">{agentProfile?.rating}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" iconName="Bell">
                Notifications
              </Button>
              <Button variant="default" size="sm" iconName="Settings">
                Settings
              </Button>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center space-x-2 bg-muted rounded-lg p-1">
            <button
              onClick={() => setSelectedView('overview')}
              className={`flex-1 px-4 py-2 rounded text-sm font-medium transition-colors ${
              selectedView === 'overview' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`
              }>

              <div className="flex items-center justify-center space-x-2">
                <Icon name="LayoutDashboard" size={16} />
                <span>Overview</span>
              </div>
            </button>
            <button
              onClick={() => setSelectedView('clients')}
              className={`flex-1 px-4 py-2 rounded text-sm font-medium transition-colors ${
              selectedView === 'clients' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`
              }>

              <div className="flex items-center justify-center space-x-2">
                <Icon name="Users" size={16} />
                <span>Clients</span>
              </div>
            </button>
            <button
              onClick={() => setSelectedView('performance')}
              className={`flex-1 px-4 py-2 rounded text-sm font-medium transition-colors ${
              selectedView === 'performance' ?
              'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`
              }>

              <div className="flex items-center justify-center space-x-2">
                <Icon name="TrendingUp" size={16} />
                <span>Performance</span>
              </div>
            </button>
          </div>
        </div>

        {selectedView === 'overview' &&
        <div className="space-y-6">
            <PerformanceMetrics metrics={performanceMetrics} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <QuickActions onActionClick={handleQuickAction} />
              </div>
              <div>
                <CommissionTracker commissions={commissions} />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div data-section="appointments">
                <UpcomingAppointments appointments={appointments} />
              </div>
              <RecentActivity activities={recentActivities} />
            </div>

            <div className="bg-card rounded-lg border border-border p-4 md:p-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-foreground">Commission Circulars</h2>
                <Icon name="FileText" size={18} className="text-primary" />
              </div>
              {circulars.length === 0 ? (
                <p className="text-sm text-muted-foreground">No circular uploaded yet.</p>
              ) : (
                <div className="space-y-2">
                  {circulars.map((c) => (
                    <a
                      key={c.id}
                      href={c.file_url || c.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="block text-sm text-primary hover:underline"
                    >
                      {c.title}
                    </a>
                  ))}
                </div>
              )}
            </div>

            <TrainingResources resources={trainingResources} />
          </div>
        }

        {selectedView === 'clients' &&
        <div className="space-y-6">
            <ClientKanbanBoard
            clients={clients}
            onClientClick={handleClientClick}
            onStatusChange={handleStatusChange} />

          </div>
        }

        {selectedView === 'performance' &&
        <div className="space-y-6">
            <PerformanceMetrics metrics={performanceMetrics} />
            <PerformanceChart data={chartData} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div data-section="commission">
                <CommissionTracker commissions={commissions} />
              </div>
              <TrainingResources resources={trainingResources} />
            </div>
          </div>
        }
      </main>
    </div>
  );

};

export default AgentDashboard;