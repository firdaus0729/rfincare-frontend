import React, { useState } from 'react';
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
  const [selectedView, setSelectedView] = useState('overview');

  const agentProfile = {
    name: "Sarah Mitchell",
    agentId: "AG-2024-1547",
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_14da91c34-1763294780479.png",
    avatarAlt: "Professional headshot of Sarah Mitchell, female agent with shoulder-length brown hair wearing navy blue blazer",
    joinDate: "March 2024",
    tier: "Gold Agent",
    rating: 4.8,
    totalClients: 47,
    activeClients: 12
  };

  const performanceMetrics = [
  {
    id: 1,
    type: 'customers',
    label: 'Active Clients',
    value: '12',
    subtitle: 'Total: 47 clients',
    change: '+15%',
    trend: 'up'
  },
  {
    id: 2,
    type: 'conversions',
    label: 'Conversion Rate',
    value: '68%',
    subtitle: '8 of 12 approved',
    change: '+8%',
    trend: 'up'
  },
  {
    id: 3,
    type: 'earnings',
    label: 'This Month',
    value: '₹12,450',
    subtitle: 'Pending: ₹3,200',
    change: '+22%',
    trend: 'up'
  },
  {
    id: 4,
    type: 'satisfaction',
    label: 'Client Rating',
    value: '4.8',
    subtitle: 'Based on 35 reviews',
    change: '+0.3',
    trend: 'up'
  }];


  const clients = [
  {
    id: 1,
    name: "Michael Rodriguez",
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_143b978a3-1763294952544.png",
    avatarAlt: "Professional headshot of Hispanic man with short black hair in navy suit",
    loanType: "Home Loan",
    amount: "₹450,000",
    status: "new",
    priority: "high",
    daysActive: "2 days ago",
    nextAction: "Schedule consultation"
  },
  {
    id: 2,
    name: "Emily Chen",
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_18a713e78-1763297858426.png",
    avatarAlt: "Professional headshot of Asian woman with long black hair wearing white blouse",
    loanType: "Personal Loan",
    amount: "₹25,000",
    status: "in-progress",
    priority: "medium",
    daysActive: "5 days ago",
    nextAction: "Review income documents"
  },
  {
    id: 3,
    name: "James Wilson",
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_130504d21-1763295915180.png",
    avatarAlt: "Professional headshot of Caucasian man with gray hair wearing dark suit",
    loanType: "Business Loan",
    amount: "₹150,000",
    status: "documents",
    priority: "high",
    daysActive: "3 days ago",
    nextAction: "Upload tax returns"
  },
  {
    id: 4,
    name: "Priya Sharma",
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1cfa37edb-1763295967528.png",
    avatarAlt: "Professional headshot of Indian woman with black hair in elegant blue dress",
    loanType: "Auto Loan",
    amount: "₹35,000",
    status: "submitted",
    priority: "low",
    daysActive: "1 day ago",
    nextAction: null
  },
  {
    id: 5,
    name: "David Thompson",
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1a184de25-1763292715446.png",
    avatarAlt: "Professional headshot of African American man with short hair wearing gray suit",
    loanType: "Home Loan",
    amount: "₹520,000",
    status: "new",
    priority: "high",
    daysActive: "Just now",
    nextAction: "Initial assessment"
  },
  {
    id: 6,
    name: "Maria Garcia",
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1892fec82-1763293711662.png",
    avatarAlt: "Professional headshot of Hispanic woman with curly brown hair wearing red blazer",
    loanType: "Personal Loan",
    amount: "₹18,000",
    status: "in-progress",
    priority: "medium",
    daysActive: "4 days ago",
    nextAction: "Credit verification"
  }];


  const commissions = [
  {
    id: 1,
    clientName: "Robert Anderson",
    loanType: "Home Loan",
    amount: 4500,
    status: "paid",
    date: "Jan 10, 2026"
  },
  {
    id: 2,
    clientName: "Lisa Martinez",
    loanType: "Business Loan",
    amount: 3200,
    status: "pending",
    date: "Jan 12, 2026"
  },
  {
    id: 3,
    clientName: "Thomas Brown",
    loanType: "Auto Loan",
    amount: 850,
    status: "paid",
    date: "Jan 8, 2026"
  },
  {
    id: 4,
    clientName: "Jennifer Lee",
    loanType: "Personal Loan",
    amount: 1200,
    status: "processing",
    date: "Jan 14, 2026"
  },
  {
    id: 5,
    clientName: "Christopher Davis",
    loanType: "Home Loan",
    amount: 5100,
    status: "pending",
    date: "Jan 13, 2026"
  }];


  const chartData = [
  { name: 'Week 1', clients: 8, conversions: 5, earnings: 2800 },
  { name: 'Week 2', clients: 12, conversions: 7, earnings: 3500 },
  { name: 'Week 3', clients: 10, conversions: 6, earnings: 3100 },
  { name: 'Week 4', clients: 15, conversions: 10, earnings: 5050 }];


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

  const handleStatusChange = (clientId, newStatus) => {
    console.log('Status changed:', clientId, newStatus);
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