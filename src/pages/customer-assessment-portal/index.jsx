import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { apiClient } from '../../lib/apiClient';
import { applicationService } from '../../services/apiServices';

import Header from '../../components/ui/Header';
import ProgressIndicator from './components/ProgressIndicator';
import FormNavigation from './components/FormNavigation';
import PersonalInfoForm from './components/PersonalInfoForm';
import AddressInfoForm from './components/AddressInfoForm';
import EmploymentInfoForm from './components/EmploymentInfoForm';
import FinancialInfoForm from './components/FinancialInfoForm';
import ReviewSubmitForm from './components/ReviewSubmitForm';
import AutoSaveIndicator from './components/AutoSaveIndicator';
import Icon from '../../components/AppIcon';

const SESSION_KEY = 'loan_assessment_session';

const getOrCreateSessionKey = () => {
  let key = localStorage.getItem(SESSION_KEY);
  if (!key) {
    key = 'session_' + Date.now() + '_' + Math.random()?.toString(36)?.substring(2, 9);
    localStorage.setItem(SESSION_KEY, key);
  }
  return key;
};

const generateCredentials = (formData) => {
  const firstName = (formData?.firstName || '')?.toLowerCase()?.replace(/[^a-z0-9]/g, '');
  const phone = (formData?.phone || '')?.replace(/[^0-9]/g, '')?.slice(-4);
  const timestamp = Date.now()?.toString()?.slice(-4);
  const username = `${firstName}${phone || timestamp}`;
  const email = `${username}@rfincare.customer`;
  const password = `RFC${phone || timestamp}${Math.random()?.toString(36)?.substring(2, 6)?.toUpperCase()}@`;
  return { email, password, username };
};

const LOAN_TYPE_MAP = {
  personal: 'personal_loan',
  home: 'home_loan',
  business: 'business_loan',
  auto: 'auto_loan',
  personal_loan: 'personal_loan',
  home_loan: 'home_loan',
};

const CustomerAssessmentPortal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const sessionKey = useRef(getOrCreateSessionKey());
  const [currentStep, setCurrentStep] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedCredentials, setGeneratedCredentials] = useState(null);
  const [submitError, setSubmitError] = useState('');
  const autoSaveTimer = useRef(null);

  const steps = [
    { id: 'personal', label: 'Personal', description: 'Tell us about yourself' },
    { id: 'address', label: 'Address', description: 'Where do you live?' },
    { id: 'employment', label: 'Employment', description: 'Your work and income details' },
    { id: 'financial', label: 'Financial', description: 'Your loan requirements' },
    { id: 'review', label: 'Review', description: 'Verify and submit' }
  ];

  const [formData, setFormData] = useState({
    title: '', firstName: '', middleName: '', lastName: '',
    dateOfBirth: '', gender: '', maritalStatus: '',
    email: '', phone: '', aadhaar: '', pan: '',
    addressLine1: '', addressLine2: '', city: '', district: '',
    state: '', pinCode: '', residenceType: '', yearsAtAddress: '', monthlyRent: '',
    employmentType: '', employerName: '', jobTitle: '', industry: '',
    yearsEmployed: '', annualIncome: '', monthlyIncome: '', employerPhone: '', retirementIncome: '',
    loanPurpose: '', loanAmount: '', creditScoreRange: '',
    monthlyDebtPayments: '', totalAssets: '',
    hasBankruptcy: false, hasForeclosure: false, hasTaxLiens: false, hasCoSignedLoans: false,
    certifyAccuracy: false, authorizeCredit: false, agreeTerms: false, consentCommunications: false
  });

  const [errors, setErrors] = useState({});

  // Prefill from eligibility quick check / product links
  useEffect(() => {
    const quick = location.state?.quickCheck || location.state?.eligibilityData;
    const loanTypeParam = searchParams.get('loanType');
    if (quick || loanTypeParam) {
      setFormData((prev) => ({
        ...prev,
        loanAmount: quick?.loanAmount || prev.loanAmount,
        monthlyIncome: quick?.monthlyIncome || prev.monthlyIncome,
        creditScoreRange: quick?.creditScore || quick?.creditScoreRange || prev.creditScoreRange,
        loanPurpose: LOAN_TYPE_MAP[quick?.loanType] || LOAN_TYPE_MAP[loanTypeParam] || prev.loanPurpose,
        employmentType: quick?.employmentType || prev.employmentType,
      }));
    }
  }, [location.state, searchParams]);

  // Load saved progress on mount
  useEffect(() => {
    const loadSavedProgress = async () => {
      try {
        // Try localStorage first (fast)
        const localData = localStorage.getItem('loan_assessment_form_data');
        const localStep = localStorage.getItem('loan_assessment_step');
        if (localData) {
          setFormData(prev => ({ ...prev, ...JSON.parse(localData) }));
        }
        if (localStep) {
          setCurrentStep(parseInt(localStep, 10));
        }
      } catch (err) {
        // Silently fail - use localStorage fallback
      }

    };
    loadSavedProgress();
  }, []);

  const saveProgress = useCallback(async (data, step) => {
    setIsSaving(true);
    try {
      // Always save to localStorage
      localStorage.setItem('loan_assessment_form_data', JSON.stringify(data));
      localStorage.setItem('loan_assessment_step', String(step));
      setLastSaved(new Date());

    } catch (err) {
      // localStorage save still succeeded
      setLastSaved(new Date());
    } finally {
      setIsSaving(false);
    }
  }, []);

  // Auto-save on form data change (debounced 3 seconds)
  useEffect(() => {
    if (autoSaveTimer?.current) clearTimeout(autoSaveTimer?.current);
    autoSaveTimer.current = setTimeout(() => {
      saveProgress(formData, currentStep);
    }, 3000);
    return () => clearTimeout(autoSaveTimer?.current);
  }, [formData, currentStep, saveProgress]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 0:
        if (!formData?.title) newErrors.title = 'Title is required';
        if (!formData?.firstName) newErrors.firstName = 'First name is required';
        if (!formData?.lastName) newErrors.lastName = 'Last name is required';
        if (!formData?.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
        if (!formData?.gender) newErrors.gender = 'Gender is required';
        if (!formData?.maritalStatus) newErrors.maritalStatus = 'Marital status is required';
        if (!formData?.email) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/?.test(formData?.email)) newErrors.email = 'Invalid email format';
        if (!formData?.phone) newErrors.phone = 'Phone number is required';
        else if (!/^[6-9]\d{9}$/?.test(formData?.phone)) newErrors.phone = 'Enter valid 10-digit mobile number';
        if (!formData?.aadhaar) newErrors.aadhaar = 'Aadhaar number is required';
        else if (!/^\d{12}$/?.test(formData?.aadhaar?.replace(/[-\s]/g, ''))) newErrors.aadhaar = 'Enter valid 12-digit Aadhaar number';
        if (!formData?.pan) newErrors.pan = 'PAN number is required';
        else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/?.test(formData?.pan)) newErrors.pan = 'Enter valid PAN (e.g. ABCDE1234F)';
        break;

      case 1:
        if (!formData?.addressLine1) newErrors.addressLine1 = 'Address is required';
        if (!formData?.city) newErrors.city = 'City is required';
        if (!formData?.state) newErrors.state = 'State is required';
        if (!formData?.pinCode) newErrors.pinCode = 'PIN code is required';
        else if (!/^\d{6}$/?.test(formData?.pinCode)) newErrors.pinCode = 'Enter valid 6-digit PIN code';
        if (!formData?.residenceType) newErrors.residenceType = 'Residence type is required';
        if (!formData?.yearsAtAddress && formData?.yearsAtAddress !== 0) newErrors.yearsAtAddress = 'Years at address is required';
        if (formData?.residenceType === 'rented' && !formData?.monthlyRent) {
          newErrors.monthlyRent = 'Monthly rent is required';
        }
        break;

      case 2:
        if (!formData?.employmentType) newErrors.employmentType = 'Employment status is required';
        if (['salaried', 'business_owner', 'professional', 'self_employed']?.includes(formData?.employmentType)) {
          if (!formData?.employerName) newErrors.employerName = 'Employer/Business name is required';
          if (!formData?.jobTitle) newErrors.jobTitle = 'Job title is required';
          if (!formData?.industry) newErrors.industry = 'Industry is required';
          if (!formData?.yearsEmployed && formData?.yearsEmployed !== 0) newErrors.yearsEmployed = 'Years employed is required';
          if (!formData?.annualIncome) newErrors.annualIncome = 'Annual income is required';
          if (!formData?.monthlyIncome) newErrors.monthlyIncome = 'Monthly income is required';
        }
        if (formData?.employmentType === 'retired' && !formData?.retirementIncome) {
          newErrors.retirementIncome = 'Retirement income is required';
        }
        break;

      case 3:
        if (!formData?.loanPurpose) newErrors.loanPurpose = 'Loan purpose is required';
        if (!formData?.loanAmount) newErrors.loanAmount = 'Loan amount is required';
        if (!formData?.creditScoreRange) newErrors.creditScoreRange = 'Credit score range is required';
        if (!formData?.monthlyDebtPayments && formData?.monthlyDebtPayments !== 0) newErrors.monthlyDebtPayments = 'Monthly debt payments is required';
        if (!formData?.totalAssets && formData?.totalAssets !== 0) newErrors.totalAssets = 'Total assets is required';
        break;

      case 4:
        if (!formData?.certifyAccuracy) newErrors.certifyAccuracy = 'You must certify the accuracy of information';
        if (!formData?.authorizeCredit) newErrors.authorizeCredit = 'Credit authorization is required';
        if (!formData?.agreeTerms) newErrors.agreeTerms = 'You must agree to terms and conditions';
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      // Save progress immediately on next
      saveProgress(formData, currentStep + 1);
      if (currentStep === steps?.length - 1) {
        handleSubmit();
      } else {
        setCurrentStep(prev => prev + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handlePrevious = () => {
    saveProgress(formData, currentStep - 1);
    setCurrentStep(prev => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveProgress = () => {
    saveProgress(formData, currentStep);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError('');
    try {
      const credentials = generateCredentials(formData);
      setGeneratedCredentials(credentials);

      // Create Node API auth user with auto-generated credentials (also logs them in)
      const res = await apiClient.post('/auth/signup', {
        email: credentials?.email,
        password: credentials?.password,
        fullName: `${formData?.firstName || ''} ${formData?.lastName || ''}`?.trim(),
        phone: formData?.phone || '',
        role: 'customer'
      });

      const userId = res?.data?.user?.id;

      // Save the complete loan application as draft/submitted
      const applicationData = {
        title: formData?.title || null,
        first_name: formData?.firstName,
        middle_name: formData?.middleName || null,
        last_name: formData?.lastName,
        date_of_birth: formData?.dateOfBirth,
        gender: formData?.gender || null,
        marital_status: formData?.maritalStatus || null,
        email: formData?.email,
        phone: formData?.phone,
        aadhaar_number: formData?.aadhaar || null,
        pan_number: formData?.pan || null,
        address_line1: formData?.addressLine1,
        address_line2: formData?.addressLine2 || null,
        city: formData?.city,
        district: formData?.district || null,
        state: formData?.state,
        pin_code: formData?.pinCode,
        residence_type: formData?.residenceType || null,
        years_at_address: formData?.yearsAtAddress ? parseInt(formData?.yearsAtAddress) : null,
        monthly_rent: formData?.monthlyRent ? parseFloat(formData?.monthlyRent) : null,
        employment_type: formData?.employmentType,
        employer_name: formData?.employerName || null,
        job_title: formData?.jobTitle || null,
        industry: formData?.industry || null,
        years_employed: formData?.yearsEmployed ? parseInt(formData?.yearsEmployed) : null,
        annual_income: formData?.annualIncome ? parseFloat(formData?.annualIncome) : 0,
        monthly_income: formData?.monthlyIncome ? parseFloat(formData?.monthlyIncome) : 0,
        employer_phone: formData?.employerPhone || null,
        loan_purpose: formData?.loanPurpose,
        requested_loan_amount: formData?.loanAmount ? parseFloat(formData?.loanAmount) : 0,
        credit_score_range: formData?.creditScoreRange || null,
        monthly_debt_payments: formData?.monthlyDebtPayments ? parseFloat(formData?.monthlyDebtPayments) : null,
        total_assets: formData?.totalAssets ? parseFloat(formData?.totalAssets) : null,
        has_bankruptcy: formData?.hasBankruptcy || false,
        has_foreclosure: formData?.hasForeclosure || false,
        has_tax_liens: formData?.hasTaxLiens || false,
        has_co_signed_loans: formData?.hasCoSignedLoans || false,
        status: 'submitted',
        submitted_at: new Date()?.toISOString(),
        application_number: `RFC${Date.now()}`,
        customer_id: userId || null
      };

      await applicationService.createApplication(applicationData);

      localStorage.removeItem('loan_assessment_form_data');
      localStorage.removeItem('loan_assessment_step');
      localStorage.removeItem(SESSION_KEY);


      setShowSuccessModal(true);
    } catch (err) {
      console.error('Submit error:', err);
      setSubmitError(err?.message || 'Submission failed. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleSuccessRedirect = () => {
    navigate('/customer-dashboard');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <PersonalInfoForm formData={formData} errors={errors} onChange={handleChange} />;
      case 1:
        return <AddressInfoForm formData={formData} errors={errors} onChange={handleChange} />;
      case 2:
        return <EmploymentInfoForm formData={formData} errors={errors} onChange={handleChange} />;
      case 3:
        return <FinancialInfoForm formData={formData} errors={errors} onChange={handleChange} />;
      case 4:
        return <ReviewSubmitForm formData={formData} errors={errors} onChange={handleChange} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-16">
        {/* Page Header */}
        <div className="text-center mb-8 md:mb-12 lg:mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full bg-gradient-to-br from-primary to-secondary mb-4 md:mb-6">
            <Icon name="FileText" size={32} color="white" className="md:w-10 md:h-10 lg:w-12 lg:h-12" />
          </div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3 md:mb-4">
            Loan Assessment Portal
          </h1>
          <p className="text-sm md:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto">
            Complete your financial profile to get matched with the best loan options tailored to your needs
          </p>
          <div className="mt-4 md:mt-6">
            <AutoSaveIndicator lastSaved={lastSaved} isSaving={isSaving} />
          </div>
        </div>

        {/* Progress Indicator */}
        <ProgressIndicator
          currentStep={currentStep}
          totalSteps={steps?.length}
          steps={steps}
        />

        {/* Form Content */}
        <div className="form-section animate-fade-in">
          {renderStepContent()}

          {submitError && (
            <div className="mt-4 p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-sm text-destructive">
              {submitError}
            </div>
          )}

          {/* Navigation */}
          <FormNavigation
            currentStep={currentStep}
            totalSteps={steps?.length}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onSave={handleSaveProgress}
            isValid={true}
            isSaving={isSaving || isSubmitting}
          />
        </div>

        {/* Help Section */}
        <div className="mt-8 md:mt-12 p-4 md:p-6 bg-card rounded-lg border border-border">
          <div className="flex items-start space-x-3 md:space-x-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon name="HelpCircle" size={20} className="text-primary md:w-6 md:h-6" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-base md:text-lg font-semibold text-foreground mb-2">Need Help?</h3>
              <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-4">
                Our support team is available 24/7 to assist you with any questions about the assessment process.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
                <a href="tel:+917300069952" className="inline-flex items-center justify-center px-4 py-2 text-xs md:text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                  <Icon name="Phone" size={16} className="mr-2" />
                  Call: +91-7300069952
                </a>
                <a href="tel:+917696664657" className="inline-flex items-center justify-center px-4 py-2 text-xs md:text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                  <Icon name="Phone" size={16} className="mr-2" />
                  Call: +91-7696664657
                </a>
                <a href="mailto:support@rfincare.com" className="inline-flex items-center justify-center px-4 py-2 text-xs md:text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                  <Icon name="Mail" size={16} className="mr-2" />
                  Email Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Success Modal with Credentials */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-card rounded-lg shadow-lg max-w-md w-full p-6 md:p-8 animate-scale-in">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-success/10 mb-4 md:mb-6">
                <Icon name="CheckCircle2" size={40} className="text-success md:w-12 md:h-12" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-3 md:mb-4">
                Assessment Complete!
              </h2>
              <p className="text-sm md:text-base text-muted-foreground mb-4">
                Your account has been created automatically. Please save your login credentials below.
              </p>

              {generatedCredentials && (
                <div className="bg-muted rounded-lg p-4 mb-6 text-left border border-border">
                  <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Icon name="Key" size={16} className="text-primary" />
                    Your Login Credentials
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Email / Username:</span>
                      <span className="text-xs font-mono font-semibold text-foreground bg-background px-2 py-1 rounded border">
                        {generatedCredentials?.email}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Password:</span>
                      <span className="text-xs font-mono font-semibold text-foreground bg-background px-2 py-1 rounded border">
                        {generatedCredentials?.password}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-warning mt-3 flex items-start gap-1">
                    <Icon name="AlertTriangle" size={12} className="mt-0.5 flex-shrink-0" />
                    Please save these credentials. You will need them to log in to your account.
                  </p>
                </div>
              )}

              <button
                onClick={handleSuccessRedirect}
                className="w-full inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                <Icon name="LayoutDashboard" size={16} className="mr-2" />
                Go to My Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerAssessmentPortal;