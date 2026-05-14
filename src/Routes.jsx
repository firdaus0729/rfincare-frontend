import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import ProtectedRoute from "components/ProtectedRoute";
import { useGoogleAnalytics } from './hooks/useGoogleAnalytics';
import NotFound from "pages/NotFound";

// Public Pages
import Homepage from './pages/homepage';
import AboutUs from './pages/about-us';
import ContactUs from './pages/contact-us';
import ProductComparison from './pages/product-comparison';
import EligibilityAssessment from './pages/eligibility-assessment';

// Login Pages (Separate for each role)
import LoginPage from './pages/login-page';
import AdminLogin from './pages/admin-login';
import EmployeeLogin from './pages/employee-login';
import AgentLogin from './pages/agent-login';
import CustomerLogin from './pages/customer-login';

// Customer Journey (Public - Pre-Registration)
import CustomerAssessmentPortal from './pages/customer-assessment-portal';
import BankMarketplace from './pages/bank-marketplace';

// Protected Dashboards
import AdminDashboard from './pages/admin-dashboard';
import EmployeePortal from './pages/employee-portal';
import AgentDashboard from './pages/agent-dashboard';
import CustomerDashboard from './pages/customer-dashboard';

// Protected Admin Pages
import AdminSecurityDashboard from './pages/admin-security-dashboard';
import ReportsAndAnalytics from './pages/reports-and-analytics';
import BankMarketplaceManagement from './pages/bank-marketplace-management';
import ApprovalMatrixManagement from './pages/approval-matrix-management';
import InterestMatrixManagement from './pages/interest-matrix-management';

// Protected Customer Pages
import CustomerProfile from './pages/customer-profile';
import DocumentManagementCenter from './pages/document-management-center';
import AdditionalQuestionnaire from './pages/additional-questionnaire';
import BankSelectionAndConsent from './pages/bank-selection-and-consent';

// Legacy Pages (to be deprecated)
import AuthenticationManagementCenter from './pages/authentication-management-center';
import CustomerRegistrationPortal from './pages/customer-registration-portal';
import PasswordManagementSystem from './pages/password-management-system';

// Wrapper component to use Google Analytics inside Router context
const GoogleAnalyticsTracker = () => {
  useGoogleAnalytics();
  return null;
};

function Routes() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <GoogleAnalyticsTracker />
        <ScrollToTop />
        <RouterRoutes>
          {/* ==================== PUBLIC ROUTES ==================== */}
          <Route path="/" element={<Homepage />} />
          <Route path="/homepage" element={<Homepage />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/product-comparison" element={<ProductComparison />} />
          <Route path="/eligibility-assessment" element={<EligibilityAssessment />} />
          
          {/* ==================== LOGIN ROUTES (Separate for each role) ==================== */}
          <Route path="/login-page" element={<LoginPage />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/employee-login" element={<EmployeeLogin />} />
          <Route path="/agent-login" element={<AgentLogin />} />
          <Route path="/customer-login" element={<CustomerLogin />} />
          
          {/* ==================== CUSTOMER JOURNEY (Public - Pre-Registration) ==================== */}
          <Route path="/customer-assessment-portal" element={<CustomerAssessmentPortal />} />
          <Route path="/bank-marketplace" element={<BankMarketplace />} />
          
          {/* ==================== ADMIN PROTECTED ROUTES ==================== */}
          <Route 
            path="/admin-dashboard" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin-security-dashboard" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                <AdminSecurityDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/reports-and-analytics" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                <ReportsAndAnalytics />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/bank-marketplace-management" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                <BankMarketplaceManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/approval-matrix-management" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                <ApprovalMatrixManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/interest-matrix-management" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                <InterestMatrixManagement />
              </ProtectedRoute>
            } 
          />
          
          {/* ==================== EMPLOYEE PROTECTED ROUTES ==================== */}
          <Route 
            path="/employee-portal" 
            element={
              <ProtectedRoute allowedRoles={['employee', 'admin', 'super_admin']}>
                <EmployeePortal />
              </ProtectedRoute>
            } 
          />
          
          {/* ==================== AGENT PROTECTED ROUTES ==================== */}
          <Route 
            path="/agent-dashboard" 
            element={
              <ProtectedRoute allowedRoles={['agent', 'admin', 'super_admin']}>
                <AgentDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* ==================== CUSTOMER PROTECTED ROUTES ==================== */}
          <Route 
            path="/customer-dashboard" 
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <CustomerDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <CustomerProfile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/document-management-center" 
            element={
              <ProtectedRoute allowedRoles={['customer', 'employee', 'admin', 'super_admin']}>
                <DocumentManagementCenter />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/additional-questionnaire" 
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <AdditionalQuestionnaire />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/bank-selection-and-consent" 
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <BankSelectionAndConsent />
              </ProtectedRoute>
            } 
          />
          
          {/* ==================== LEGACY ROUTES (To be deprecated) ==================== */}
          <Route path="/authentication-management-center" element={<AuthenticationManagementCenter />} />
          <Route path="/customer-registration-portal" element={<CustomerRegistrationPortal />} />
          <Route path="/password-management-system" element={<PasswordManagementSystem />} />
          
          {/* Catch-all 404 route - MUST be last */}
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default Routes;
