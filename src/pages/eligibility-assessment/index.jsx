import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Footer from '../homepage/components/Footer';

import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { customerJourneyService } from '../../services/customerJourneyService';
import { useAuth } from '../../contexts/AuthContext';

const EligibilityAssessment = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    loanType: '',
    loanAmount: '',
    monthlyIncome: '',
    employmentType: '',
    creditScore: '',
    existingLoans: ''
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const loanTypes = [
    { value: 'home_loan', label: 'Home Loan' },
    { value: 'personal_loan', label: 'Personal Loan' },
    { value: 'auto_loan', label: 'Car Loan' },
    { value: 'business_loan', label: 'Business Loan' },
    { value: 'education_loan', label: 'Education Loan' }
  ];

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
    setLoading(true);
    
    const income = parseFloat(formData?.monthlyIncome);
    const requestedAmount = parseFloat(formData?.loanAmount);
    const existingEMI = parseFloat(formData?.existingLoans) || 0;

    // Simple eligibility calculation
    const maxEMI = income * 0.5; // 50% of income
    const availableEMI = maxEMI - existingEMI;
    const eligibleAmount = availableEMI * 60; // Assuming 5-year tenure

    let eligibilityScore = 0;
    let status = '';
    let message = '';

    // Credit score impact
    if (formData?.creditScore === 'excellent') eligibilityScore += 40;
    else if (formData?.creditScore === 'good') eligibilityScore += 30;
    else if (formData?.creditScore === 'fair') eligibilityScore += 20;
    else eligibilityScore += 10;

    // Income to loan ratio
    if (requestedAmount <= eligibleAmount) eligibilityScore += 40;
    else if (requestedAmount <= eligibleAmount * 1.2) eligibilityScore += 25;
    else eligibilityScore += 10;

    // Employment type
    if (formData?.employmentType === 'salaried') eligibilityScore += 20;
    else eligibilityScore += 15;

    if (eligibilityScore >= 80) {
      status = 'high';
      message = 'Excellent! You have high chances of loan approval with competitive interest rates.';
    } else if (eligibilityScore >= 60) {
      status = 'medium';
      message = 'Good! You are eligible for a loan. Some banks may offer you favorable terms.';
    } else {
      status = 'low';
      message = 'You may face challenges in loan approval. Consider improving your credit score or reducing existing debts.';
    }

    const calculatedResult = {
      score: eligibilityScore,
      status,
      message,
      eligibleAmount: Math.floor(eligibleAmount),
      requestedAmount
    };

    setResult(calculatedResult);

    // Save assessment if user is logged in
    if (user) {
      await customerJourneyService?.createEligibilityAssessment({
        loanType: formData?.loanType,
        loanAmount: requestedAmount,
        monthlyIncome: income,
        employmentType: formData?.employmentType,
        creditScoreRange: formData?.creditScore,
        existingLoans: existingEMI,
        eligibilityScore,
        eligibilityStatus: status,
        eligibleAmount: Math.floor(eligibleAmount),
        message
      });
    }

    setLoading(false);
  };

  const handleApplyNow = () => {
    if (user) {
      navigate('/customer-assessment-portal', { state: { eligibilityData: { ...formData, ...result } } });
    } else {
      navigate('/authentication-management-center?role=customer', { state: { returnTo: '/customer-assessment-portal', eligibilityData: { ...formData, ...result } } });
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
                        onClick={() => navigate('/bank-marketplace')}
                      >
                        Compare Banks
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