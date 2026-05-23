import React, { useState, useEffect, useMemo, useCallback } from 'react';

import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { approvalMatrixService, bankService, auditService } from '../../services/apiServices';


const ApprovalMatrixManagement = () => {
  const [rules, setRules] = useState([]);
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [formData, setFormData] = useState({
    ruleName: '',
    bankId: '',
    loanType: '',
    minAnnualIncome: '',
    maxAnnualIncome: '',
    minCreditScore: '',
    maxCreditScore: '',
    employmentTypes: [],
    eligibleStates: [],
    eligibleCities: [],
    minLoanAmount: '',
    maxLoanAmount: '',
    minAge: '',
    maxAge: '',
    approvalProbability: 75,
    isActive: true,
    priority: 0
  });

  // Helper function to convert empty strings to null for numeric fields
  const sanitizeNumericFields = (data) => {
    const numericFields = [
      'minAnnualIncome',
      'maxAnnualIncome',
      'minCreditScore',
      'maxCreditScore',
      'minLoanAmount',
      'maxLoanAmount',
      'minAge',
      'maxAge',
      'approvalProbability',
      'priority'
    ];

    const sanitized = { ...data };
    
    numericFields?.forEach(field => {
      if (sanitized?.[field] === '' || sanitized?.[field] === null || sanitized?.[field] === undefined) {
        sanitized[field] = null;
      } else {
        // Convert to number for numeric fields
        const value = parseFloat(sanitized?.[field]);
        sanitized[field] = isNaN(value) ? null : value;
      }
    });

    // Ensure approvalProbability and priority have default values if null
    if (sanitized?.approvalProbability === null) {
      sanitized.approvalProbability = 75;
    }
    if (sanitized?.priority === null) {
      sanitized.priority = 0;
    }

    return sanitized;
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadBanks = useCallback(async () => {
    try {
      const data = await bankService.getAllBanks();
      setBanks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load banks:', err);
      setBanks([]);
    }
  }, []);

  const bankOptions = useMemo(
    () =>
      (banks || [])
        .filter((b) => b?.id && (b?.name || b?.bankName))
        .map((b) => ({
          value: b.id,
          label: b.name || b.bankName,
        }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    [banks],
  );

  const loadData = async () => {
    setLoading(true);
    setError('');
    const [rulesResult, banksResult] = await Promise.allSettled([
      approvalMatrixService.getAllRules(),
      bankService.getAllBanks(),
    ]);

    if (rulesResult.status === 'fulfilled') {
      setRules(Array.isArray(rulesResult.value) ? rulesResult.value : []);
    } else {
      setRules([]);
      const status = rulesResult.reason?.response?.status;
      const msg =
        rulesResult.reason?.response?.data?.error
        || rulesResult.reason?.message
        || 'Failed to load approval rules';
      setError(
        status === 404
          ? 'Approval matrix API is not available on the server. Redeploy the backend (Render) with the latest code, then refresh this page.'
          : msg,
      );
    }

    if (banksResult.status === 'fulfilled') {
      setBanks(Array.isArray(banksResult.value) ? banksResult.value : []);
    } else {
      await loadBanks();
    }

    setLoading(false);
  };

  const handleOpenModal = async (rule = null) => {
    await loadBanks();
    if (rule) {
      setEditingRule(rule);
      setFormData({
        ruleName: rule?.ruleName,
        bankId: rule?.bankId,
        loanType: rule?.loanType || '',
        minAnnualIncome: rule?.minAnnualIncome || '',
        maxAnnualIncome: rule?.maxAnnualIncome || '',
        minCreditScore: rule?.minCreditScore || '',
        maxCreditScore: rule?.maxCreditScore || '',
        employmentTypes: rule?.employmentTypes || [],
        eligibleStates: rule?.eligibleStates || [],
        eligibleCities: rule?.eligibleCities || [],
        minLoanAmount: rule?.minLoanAmount || '',
        maxLoanAmount: rule?.maxLoanAmount || '',
        minAge: rule?.minAge || '',
        maxAge: rule?.maxAge || '',
        approvalProbability: rule?.approvalProbability,
        isActive: rule?.isActive,
        priority: rule?.priority
      });
    } else {
      setEditingRule(null);
      setFormData({
        ruleName: '',
        bankId: '',
        loanType: '',
        minAnnualIncome: '',
        maxAnnualIncome: '',
        minCreditScore: '',
        maxCreditScore: '',
        employmentTypes: [],
        eligibleStates: [],
        eligibleCities: [],
        minLoanAmount: '',
        maxLoanAmount: '',
        minAge: '',
        maxAge: '',
        approvalProbability: 75,
        isActive: true,
        priority: 0
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingRule(null);
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    try {
      // Sanitize numeric fields before submission
      const sanitizedData = sanitizeNumericFields(formData);
      
      if (editingRule) {
        await approvalMatrixService?.updateRule(editingRule?.id, sanitizedData);
        await auditService?.logAction('UPDATE', 'approval_matrix_rules', editingRule?.id, editingRule, sanitizedData);
      } else {
        await approvalMatrixService?.createRule(sanitizedData);
        await auditService?.logAction('CREATE', 'approval_matrix_rules', null, null, sanitizedData);
      }
      await loadData();
      handleCloseModal();
    } catch (err) {
      setError(err?.message);
    }
  };

  const handleDelete = async (rule) => {
    if (!window.confirm(`Are you sure you want to delete rule "${rule?.ruleName}"?`)) return;
    
    try {
      await approvalMatrixService?.deleteRule(rule?.id);
      await auditService?.logAction('DELETE', 'approval_matrix_rules', rule?.id, rule, null);
      await loadData();
    } catch (err) {
      setError(err?.message);
    }
  };

  const handleToggleActive = async (rule) => {
    try {
      await approvalMatrixService?.updateRule(rule?.id, { isActive: !rule?.isActive });
      await auditService?.logAction('UPDATE', 'approval_matrix_rules', rule?.id, { isActive: rule?.isActive }, { isActive: !rule?.isActive });
      await loadData();
    } catch (err) {
      setError(err?.message);
    }
  };

  const loanTypeOptions = [
    { value: '', label: 'All Loan Types' },
    { value: 'home_loan', label: 'Home Loan' },
    { value: 'personal_loan', label: 'Personal Loan' },
    { value: 'business_loan', label: 'Business Loan' },
    { value: 'auto_loan', label: 'Auto Loan' },
    { value: 'education_loan', label: 'Education Loan' },
    { value: 'debt_consolidation', label: 'Debt Consolidation' }
  ];

  const employmentTypeOptions = [
    { value: 'salaried', label: 'Salaried' },
    { value: 'self_employed', label: 'Self-Employed' },
    { value: 'business_owner', label: 'Business Owner' },
    { value: 'professional', label: 'Professional' },
    { value: 'retired', label: 'Retired' }
  ];

  return (
    <div>
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              Bank Approval Matrix
            </h1>
            <p className="text-muted-foreground">
              Configure dynamic eligibility rules for bank suggestions
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={loadBanks} iconName="RefreshCw">
              Refresh banks
            </Button>
            <Button onClick={() => handleOpenModal()} iconName="Plus">
              Add Rule
            </Button>
          </div>
        </div>

        {error && (
          <div className="bg-error/10 border border-error text-error px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Loading rules...</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {rules?.map((rule) => (
              <div key={rule?.id} className="feature-card">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-bold text-foreground">{rule?.ruleName}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        rule?.isActive ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
                      }`}>
                        {rule?.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        Priority: {rule?.priority}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Bank: {rule?.banks?.name || 'Unknown'} | Loan Type: {rule?.loanType || 'All'}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleActive(rule)}
                      iconName={rule?.isActive ? 'ToggleRight' : 'ToggleLeft'}
                    >
                      {rule?.isActive ? 'Disable' : 'Enable'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenModal(rule)}
                      iconName="Edit"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(rule)}
                      iconName="Trash2"
                      className="text-error hover:bg-error/10"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Income Range:</span>
                    <span className="ml-2 font-medium">
                      {rule?.minAnnualIncome ? `₹${rule?.minAnnualIncome?.toLocaleString('en-IN')}` : 'Any'} - 
                      {rule?.maxAnnualIncome ? `₹${rule?.maxAnnualIncome?.toLocaleString('en-IN')}` : 'Any'}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Credit Score:</span>
                    <span className="ml-2 font-medium">
                      {rule?.minCreditScore || 'Any'} - {rule?.maxCreditScore || 'Any'}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Age Range:</span>
                    <span className="ml-2 font-medium">
                      {rule?.minAge || 'Any'} - {rule?.maxAge || 'Any'} years
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Approval Probability:</span>
                    <span className="ml-2 font-medium text-success">{rule?.approvalProbability}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-bold text-foreground">
                {editingRule ? 'Edit Approval Rule' : 'Add New Approval Rule'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <Input
                label="Rule Name"
                value={formData?.ruleName}
                onChange={(e) => setFormData({ ...formData, ruleName: e?.target?.value })}
                required
                placeholder="e.g., High Income Salaried - Home Loan"
              />
              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Bank"
                  options={bankOptions}
                  value={formData?.bankId}
                  onChange={(value) => setFormData({ ...formData, bankId: value })}
                  required
                  searchable
                  placeholder={bankOptions.length ? 'Select bank' : 'No banks — add banks in Bank Marketplace first'}
                />
                <Select
                  label="Loan Type"
                  options={loanTypeOptions}
                  value={formData?.loanType}
                  onChange={(value) => setFormData({ ...formData, loanType: value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Min Annual Income (INR)"
                  type="number"
                  value={formData?.minAnnualIncome}
                  onChange={(e) => setFormData({ ...formData, minAnnualIncome: e?.target?.value })}
                  placeholder="e.g., 600000"
                />
                <Input
                  label="Max Annual Income (INR)"
                  type="number"
                  value={formData?.maxAnnualIncome}
                  onChange={(e) => setFormData({ ...formData, maxAnnualIncome: e?.target?.value })}
                  placeholder="Leave empty for no limit"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Min Credit Score"
                  type="number"
                  value={formData?.minCreditScore}
                  onChange={(e) => setFormData({ ...formData, minCreditScore: e?.target?.value })}
                  placeholder="e.g., 700"
                />
                <Input
                  label="Max Credit Score"
                  type="number"
                  value={formData?.maxCreditScore}
                  onChange={(e) => setFormData({ ...formData, maxCreditScore: e?.target?.value })}
                  placeholder="e.g., 850"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Min Age"
                  type="number"
                  value={formData?.minAge}
                  onChange={(e) => setFormData({ ...formData, minAge: e?.target?.value })}
                  placeholder="e.g., 21"
                />
                <Input
                  label="Max Age"
                  type="number"
                  value={formData?.maxAge}
                  onChange={(e) => setFormData({ ...formData, maxAge: e?.target?.value })}
                  placeholder="e.g., 65"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Approval Probability (%)"
                  type="number"
                  min="0"
                  max="100"
                  value={formData?.approvalProbability}
                  onChange={(e) => setFormData({ ...formData, approvalProbability: parseInt(e?.target?.value) })}
                  required
                />
                <Input
                  label="Priority"
                  type="number"
                  value={formData?.priority}
                  onChange={(e) => setFormData({ ...formData, priority: parseInt(e?.target?.value) })}
                  description="Higher priority rules are evaluated first"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="outline" onClick={handleCloseModal}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingRule ? 'Update Rule' : 'Create Rule'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovalMatrixManagement;