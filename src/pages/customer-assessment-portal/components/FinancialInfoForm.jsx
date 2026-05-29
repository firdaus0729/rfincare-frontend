import React from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { useLoanProducts } from '../../../contexts/LoanProductsContext';
import {
  FINANCIAL_HISTORY_QUESTIONS,
  FINANCIAL_YES_NO_OPTIONS,
} from '../../../constants/assessmentFinancialHistory';

const FinancialInfoForm = ({ formData, errors, onChange }) => {
  const { products } = useLoanProducts();
  const loanPurposeOptions = [
    ...products.map((p) => ({ value: p.apiKey, label: p.label })),
    { value: 'debt_consolidation', label: 'Debt Consolidation' },
  ];

  const creditScoreRangeOptions = [
    { value: 'excellent', label: 'Excellent (750+)' },
    { value: 'good', label: 'Good (700-749)' },
    { value: 'fair', label: 'Fair (650-699)' },
    { value: 'poor', label: 'Poor (600-649)' },
    { value: 'very_poor', label: 'Very Poor (Below 600)' },
    { value: 'unknown', label: "I don't know" }
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <Select
          label="Loan Purpose"
          description="What will you use this loan for?"
          options={loanPurposeOptions}
          value={formData?.loanPurpose}
          onChange={(value) => onChange('loanPurpose', value)}
          error={errors?.loanPurpose}
          required
        />

        <Input
          label="Requested Loan Amount"
          type="number"
          placeholder="500000"
          description="Enter amount in INR (₹)"
          value={formData?.loanAmount}
          onChange={(e) => onChange('loanAmount', e?.target?.value)}
          error={errors?.loanAmount}
          required
          min={100000}
          max={50000000}
        />
      </div>
      <Select
        label="Estimated Credit Score Range"
        description="Select the range that best matches your credit score"
        options={creditScoreRangeOptions}
        value={formData?.creditScoreRange}
        onChange={(value) => onChange('creditScoreRange', value)}
        error={errors?.creditScoreRange}
        required
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <Input
          label="Total Monthly Debt Payments"
          type="number"
          placeholder="20000"
          description="Include all loans, credit cards, etc. in INR (₹)"
          value={formData?.monthlyDebtPayments}
          onChange={(e) => onChange('monthlyDebtPayments', e?.target?.value)}
          error={errors?.monthlyDebtPayments}
          required
          min={0}
        />

        <Input
          label="Total Savings & Assets"
          type="number"
          placeholder="500000"
          description="Bank accounts, investments, etc. in INR (₹)"
          value={formData?.totalAssets}
          onChange={(e) => onChange('totalAssets', e?.target?.value)}
          error={errors?.totalAssets}
          required
          min={0}
        />
      </div>
      <div className="space-y-4">
        <p className="text-sm md:text-base font-medium text-foreground">Financial history</p>
        <p className="text-xs md:text-sm text-muted-foreground -mt-2">
          Answer each question below. Select Yes or No as applicable.
        </p>
        <div className="space-y-4">
          {FINANCIAL_HISTORY_QUESTIONS.map((question) => (
            <Select
              key={question.field}
              label={question.label}
              description={question.description}
              options={FINANCIAL_YES_NO_OPTIONS}
              value={formData?.[question.field]}
              onChange={(value) => onChange(question.field, value)}
              error={errors?.[question.field]}
              required
              placeholder="Select Yes or No"
            />
          ))}
        </div>
      </div>
      <div className="p-4 md:p-6 bg-muted rounded-lg border border-border">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-1">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-lg md:text-xl">💡</span>
            </div>
          </div>
          <div className="flex-1">
            <h4 className="text-sm md:text-base font-semibold text-foreground mb-2">
              Why We Ask These Questions
            </h4>
            <p className="text-xs md:text-sm text-muted-foreground">
              This information helps us match you with the best loan options and lenders. Your debt-to-income ratio and credit history are key factors in determining loan eligibility and interest rates. All information is kept confidential and secure.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialInfoForm;