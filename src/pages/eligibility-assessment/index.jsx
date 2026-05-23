import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { LOAN_PRODUCTS, getLoanProductBySlug, normalizeLoanApiKey } from '../../constants/loanProducts';
import Header from '../../components/ui/Header';
import Footer from '../homepage/components/Footer';

import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { customerJourneyService } from '../../services/customerJourneyService';
import { homepageService } from '../../services/homepageService';
import { useAuth } from '../../contexts/AuthContext';
import EligibilityLeadGate from './components/EligibilityLeadGate';
import { leadService, saveEligibilityResults } from '../../services/leadService';
import { apiClient } from '../../lib/apiClient';

const EligibilityAssessment = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { user } = useAuth();
  const prefillProduct = getLoanProductBySlug(searchParams.get('loanType'));
  const [formData, setFormData] = useState({
    loanType: prefillProduct?.apiKey || '',
    loanAmount: '',
    monthlyIncome: '',
    employmentType: '',
    creditScore: '',
    existingLoans: ''
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [leadVerified, setLeadVerified] = useState(!!user);
  const [leadMeta, setLeadMeta] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const quick = location.state?.quickCheck;
    if (!quick) return;
    setFormData((prev) => ({
      ...prev,
      loanType: normalizeLoanApiKey(quick.loanType) || prev.loanType,
      loanAmount: quick.loanAmount || prev.loanAmount,
      monthlyIncome: quick.monthlyIncome || prev.monthlyIncome,
      creditScore: quick.creditScore || prev.creditScore,
    }));
  }, [location.state]);

  const loanTypes = LOAN_PRODUCTS.map((p) => ({ value: p.apiKey, label: p.label }));

  const employmentTypes = [
    { value: 'salaried', label: 'Salaried' },
    { value: 'self_employed', label: 'Self-Employed' },
    { value: 'business_owner', label: 'Business Owner' },
    { value: 'professional', label: 'Professional' }
  ];

  const creditScoreRanges = [
    { value: 'excellent', label: 'Excellent (750+)' },
    { value: 'good', label: 'Good (700-749)' },
    { value: 'fair', label: 'Fair (650-699)' },
    { value: 'poor', label: 'Below 650' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const calculateEligibility = async (e) => {
    e?.preventDefault();
    if (!user && !leadVerified) {
      setResult({ score: 0, status: 'low', message: 'Please verify your mobile number above first.' });
      return;
    }
    setLoading(true);
    try {
      const apiResult = await homepageService.calculateEligibility({
        loanType: formData?.loanType,
        loanAmount: formData?.loanAmount,
        monthlyIncome: formData?.monthlyIncome,
        employmentType: formData?.employmentType,
        creditScore: formData?.creditScore,
        creditScoreRange: formData?.creditScore,
        existingLoans: formData?.existingLoans || 0,
      });

      const probability = apiResult.overallProbability ?? 0;
      const status =
        probability >= 80 ? 'high' : probability >= 60 ? 'medium' : 'low';

      const calculatedResult = {
        score: probability,
        status,
        message: apiResult.message,
        eligibleAmount: apiResult.eligibleAmount,
        requestedAmount: parseFloat(formData?.loanAmount),
        banks: apiResult.banks || [],
        overallProbability: probability,
      };
      setResult(calculatedResult);
      saveEligibilityResults(calculatedResult, formData);

      if (leadMeta?.leadId) {
        try {
          await leadService.updateLead(leadMeta.leadId, {
            status: 'eligible_calculated',
            eligibilityScore: probability,
            eligibilityData: { ...calculatedResult, formData },
          });
        } catch {
          /* optional */
        }
      }

      const assessmentPayload = {
        loanType: formData?.loanType,
        loanAmount: parseFloat(formData?.loanAmount),
        monthlyIncome: parseFloat(formData?.monthlyIncome),
        employmentType: formData?.employmentType,
        creditScoreRange: formData?.creditScore,
        existingLoans: parseFloat(formData?.existingLoans) || 0,
        eligibilityScore: probability,
        eligibilityStatus: status,
        eligibleAmount: apiResult.eligibleAmount,
        message: apiResult.message,
        leadId: leadMeta?.leadId,
        bankResults: apiResult.banks,
      };
      try {
        if (user) {
          await customerJourneyService?.createEligibilityAssessment(assessmentPayload);
        } else {
          await apiClient.post('/eligibility-assessments', {
            loan_type: assessmentPayload.loanType,
            loan_amount: assessmentPayload.loanAmount,
            monthly_income: assessmentPayload.monthlyIncome,
            employment_type: assessmentPayload.employmentType,
            credit_score_range: assessmentPayload.creditScoreRange,
            existing_loans: assessmentPayload.existingLoans,
            eligibility_score: assessmentPayload.eligibilityScore,
            eligibility_status: assessmentPayload.eligibilityStatus,
            eligible_amount: assessmentPayload.eligibleAmount,
            lead_id: assessmentPayload.leadId,
            bank_results: assessmentPayload.bankResults,
          });
        }
      } catch {
        /* optional until migration / auth */
      }
    } catch {
      setResult({ score: 0, status: 'low', message: 'Could not calculate eligibility. Please try again.' });
    }
    setLoading(false);
  };

  const handleApplyNow = () => {
    const slug = LOAN_PRODUCTS.find((p) => p.apiKey === formData.loanType)?.slug;
    const qs = slug ? `?loanType=${slug}` : '';
    if (user) {
      navigate(`/customer-assessment-portal${qs}`, { state: { eligibilityData: { ...formData, ...result } } });
    } else {
      navigate(`/customer-assessment-portal${qs}`, {
        state: { quickCheck: formData, eligibilityData: { ...formData, ...result } },
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary via-secondary to-accent text-white py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Check Your Loan Eligibility</h1>
            <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
              Get instant insights into your loan approval chances with our intelligent eligibility calculator
            </p>
          </div>
        </section>

        {/* Eligibility Form */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-card rounded-2xl shadow-lg p-6 md:p-8 border border-border">
              {!user && (
                <EligibilityLeadGate
                  loanType={formData.loanType}
                  onVerified={(meta) => {
                    setLeadMeta(meta);
                    setLeadVerified(true);
                    setFormData((prev) => ({
                      ...prev,
                      ...(meta.email ? {} : {}),
                    }));
                  }}
                />
              )}
              <form onSubmit={calculateEligibility} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Select
                    label="Loan Type"
                    placeholder="Select loan type"
                    options={loanTypes}
                    value={formData?.loanType}
                    onChange={(value) => setFormData({ ...formData, loanType: value })}
                    required
                  />

                  <Input
                    label="Loan Amount Needed (₹)"
                    type="number"
                    name="loanAmount"
                    placeholder="Enter amount"
                    value={formData?.loanAmount}
                    onChange={handleInputChange}
                    required
                  />

                  <Input
                    label="Monthly Income (₹)"
                    type="number"
                    name="monthlyIncome"
                    placeholder="Enter monthly income"
                    value={formData?.monthlyIncome}
                    onChange={handleInputChange}
                    required
                  />

                  <Select
                    label="Employment Type"
                    placeholder="Select employment type"
                    options={employmentTypes}
                    value={formData?.employmentType}
                    onChange={(value) => setFormData({ ...formData, employmentType: value })}
                    required
                  />

                  <Select
                    label="Credit Score Range"
                    placeholder="Select credit score"
                    options={creditScoreRanges}
                    value={formData?.creditScore}
                    onChange={(value) => setFormData({ ...formData, creditScore: value })}
                    required
                  />

                  <Input
                    label="Existing Monthly Loan EMI (₹)"
                    type="number"
                    name="existingLoans"
                    placeholder="Enter existing EMI"
                    value={formData?.existingLoans}
                    onChange={handleInputChange}
                  />
                </div>

                <Button
                  type="submit"
                  variant="default"
                  size="lg"
                  className="w-full"
                  iconName="Calculator"
                  iconPosition="left"
                  disabled={loading}
                >
                  {loading ? 'Calculating...' : 'Check Eligibility'}
                </Button>
              </form>

              {/* Result Display */}
              {result && (
                <div className="mt-8 p-6 bg-muted rounded-xl border border-border">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-foreground">Eligibility Result</h3>
                    <div className={`px-4 py-2 rounded-full font-semibold ${
                      result?.status === 'high' ? 'bg-green-100 text-green-800' :
                      result?.status === 'medium'? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {result?.status === 'high' ? 'High Eligibility' :
                       result?.status === 'medium'? 'Medium Eligibility' : 'Low Eligibility'}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Eligibility Score</span>
                      <span className="text-2xl font-bold text-primary">{result?.score}/100</span>
                    </div>

                    <div className="w-full bg-muted-foreground/20 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full transition-all duration-500 ${
                          result?.status === 'high' ? 'bg-green-500' :
                          result?.status === 'medium'? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${result?.score}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between pt-4">
                      <span className="text-muted-foreground">Eligible Loan Amount</span>
                      <span className="text-xl font-bold text-foreground">
                        ₹{result?.eligibleAmount?.toLocaleString()}
                      </span>
                    </div>

                    <div className="bg-card p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground">{result?.message}</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                      <Button
                        variant="default"
                        size="lg"
                        className="flex-1"
                        iconName="ArrowRight"
                        iconPosition="right"
                        onClick={handleApplyNow}
                      >
                        Apply Now
                      </Button>
                      <Button
                        variant="outline"
                        size="lg"
                        className="flex-1"
                        iconName="GitCompare"
                        iconPosition="left"
                        onClick={() => {
                          const slug = LOAN_PRODUCTS.find((p) => p.apiKey === formData.loanType)?.slug;
                          navigate(
                            slug
                              ? `/product-comparison?loanType=${slug}#bank-comparison`
                              : '/product-comparison',
                          );
                        }}
                      >
                        Compare bank offers
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default EligibilityAssessment;