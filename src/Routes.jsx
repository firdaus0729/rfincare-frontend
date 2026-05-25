import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import ProtectedRoute from "components/ProtectedRoute";
import AdminRouteShell from "./components/layout/AdminRouteShell";
import { LoanProductsProvider } from "./contexts/LoanProductsContext";
import { SiteContactProvider } from "./contexts/SiteContactContext";
import { useGoogleAnalytics } from './hooks/useGoogleAnalytics';
import NotFound from "pages/NotFound";

// Public Pages
import Homepage from './pages/homepage';
import AboutUs from './pages/about-us';
import ContactUs from './pages/contact-us';
import ProductComparison from './pages/product-comparison';
import ProductLanding from './pages/product-landing';
import EligibilityAssessment from './pages/eligibility-assessment';
import LoanEmiCalculator from './pages/loan-emi-calculator';
import LegalPage from './pages/legal-page';
import ShareYourStory from './pages/share-your-story';
import OAuthCallback from './pages/oauth-callback';
import ResumeApplicationPage from './pages/resume-application';
import DevelopmentPanel from './pages/development';

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
      <LoanProductsProvider>
      <SiteContactProvider>
      <ErrorBoundary>
        <GoogleAnalyticsTracker />
        <ScrollToTop />
        <RouterRoutes>
          {/* ==================== PUBLIC ROUTES ==================== */}
          <Route path="/" element={<Homepage />} />
          <Route path="/homepage" element={<Homepage />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/products/:loanType" element={<ProductLanding />} />
          <Route path="/product-comparison" element={<ProductComparison />} />
          <Route path="/eligibility-assessment" element={<EligibilityAssessment />} />
          <Route path="/resources/loan-emi-calculator" element={<LoanEmiCalculator />} />
          <Route path="/legal/:slug" element={<LegalPage />} />
          <Route path="/share-your-story" element={<ShareYourStory />} />
          <Route path="/oauth/callback" element={<OAuthCallback />} />
          <Route path="/development" element={<DevelopmentPanel />} />
          
          {/* ==================== LOGIN ROUTES (Separate for each role) ==================== */}
          <Route path="/login-page" element={<LoginPage />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/employee-login" element={<EmployeeLogin />} />
          <Route path="/agent-login" element={<AgentLogin />} />
          <Route path="/customer-login" element={<CustomerLogin />} />
          
          {/* ==================== CUSTOMER JOURNEY (Public - Pre-Registration) ==================== */}
          <Route path="/resume-application/:token" element={<ResumeApplicationPage />} />
          <Route path="/customer-assessment-portal" element={<CustomerAssessmentPortal />} />
          <Route path="/bank-marketplace" element={<BankMarketplace />} />
          
          {/* ==================== ADMIN PROTECTED ROUTES (shared top nav) ==================== */}
          <Route element={<AdminRouteShell />}>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/admin-security-dashboard" element={<AdminSecurityDashboard />} />
            <Route path="/reports-and-analytics" element={<ReportsAndAnalytics />} />
            <Route path="/bank-marketplace-management" element={<BankMarketplaceManagement />} />
            <Route path="/approval-matrix-management" element={<ApprovalMatrixManagement />} />
            <Route path="/interest-matrix-management" element={<InterestMatrixManagement />} />
            <Route path="/admin/documents" element={<DocumentManagementCenter />} />
          </Route>
          
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
              <ProtectedRoute allowedRoles={['customer', 'employee', 'agent']}>
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
      </SiteContactProvider>
      </LoanProductsProvider>
    </BrowserRouter>
  );
}

export default Routes;
