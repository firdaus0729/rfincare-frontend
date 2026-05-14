import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';

import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import MatrixFilters from './components/MatrixFilters';
import MatrixGrid from './components/MatrixGrid';
import RateModal from './components/RateModal';
import ImpactAnalyzer from './components/ImpactAnalyzer';
import BulkActions from './components/BulkActions';
import RateHeatmap from './components/RateHeatmap';
import VersionHistory from './components/VersionHistory';

const InterestMatrixManagement = () => {
  const [matrixData, setMatrixData] = useState([
    {
      id: 1,
      productType: "Personal Loan",
      loanType: "Unsecured",
      creditScoreMin: 700,
      creditScoreMax: 850,
      loanAmountMin: 10000,
      loanAmountMax: 50000,
      termMin: 12,
      termMax: 60,
      interestRate: 6.5,
      status: "active",
      effectiveDate: "2026-01-01",
      modifiedBy: "Admin User",
      changeNote: "Initial rate configuration"
    },
    {
      id: 2,
      productType: "Home Loan",
      loanType: "Secured",
      creditScoreMin: 650,
      creditScoreMax: 749,
      loanAmountMin: 100000,
      loanAmountMax: 500000,
      termMin: 120,
      termMax: 360,
      interestRate: 5.75,
      status: "active",
      effectiveDate: "2026-01-01",
      modifiedBy: "Admin User",
      changeNote: "Competitive rate for mid-tier credit"
    },
    {
      id: 3,
      productType: "Business Loan",
      loanType: "Secured",
      creditScoreMin: 680,
      creditScoreMax: 850,
      loanAmountMin: 50000,
      loanAmountMax: 1000000,
      termMin: 24,
      termMax: 120,
      interestRate: 7.25,
      status: "active",
      effectiveDate: "2026-01-05",
      modifiedBy: "Super Admin",
      changeNote: "Business expansion rate"
    },
    {
      id: 4,
      productType: "Personal Loan",
      loanType: "Unsecured",
      creditScoreMin: 600,
      creditScoreMax: 699,
      loanAmountMin: 5000,
      loanAmountMax: 25000,
      termMin: 12,
      termMax: 48,
      interestRate: 9.5,
      status: "pending",
      effectiveDate: "2026-02-01",
      modifiedBy: "Rate Manager",
      changeNote: "Pending approval for lower credit tier"
    },
    {
      id: 5,
      productType: "Auto Loan",
      loanType: "Secured",
      creditScoreMin: 720,
      creditScoreMax: 850,
      loanAmountMin: 15000,
      loanAmountMax: 75000,
      termMin: 24,
      termMax: 84,
      interestRate: 4.99,
      status: "active",
      effectiveDate: "2026-01-10",
      modifiedBy: "Admin User",
      changeNote: "Promotional rate for excellent credit"
    },
    {
      id: 6,
      productType: "Home Loan",
      loanType: "Secured",
      creditScoreMin: 750,
      creditScoreMax: 850,
      loanAmountMin: 200000,
      loanAmountMax: 1000000,
      termMin: 180,
      termMax: 360,
      interestRate: 5.25,
      status: "scheduled",
      effectiveDate: "2026-03-01",
      modifiedBy: "Super Admin",
      changeNote: "Premium rate for high-value properties"
    },
    {
      id: 7,
      productType: "Personal Loan",
      loanType: "Unsecured",
      creditScoreMin: 500,
      creditScoreMax: 599,
      loanAmountMin: 2000,
      loanAmountMax: 15000,
      termMin: 12,
      termMax: 36,
      interestRate: 14.99,
      status: "active",
      effectiveDate: "2026-01-01",
      modifiedBy: "Rate Manager",
      changeNote: "High-risk tier rate"
    },
    {
      id: 8,
      productType: "Business Loan",
      loanType: "Unsecured",
      creditScoreMin: 650,
      creditScoreMax: 749,
      loanAmountMin: 25000,
      loanAmountMax: 250000,
      termMin: 12,
      termMax: 60,
      interestRate: 10.5,
      status: "active",
      effectiveDate: "2026-01-08",
      modifiedBy: "Admin User",
      changeNote: "Small business support rate"
    }
  ]);

  const [filters, setFilters] = useState({
    productType: '',
    loanType: '',
    minCreditScore: '',
    maxCreditScore: '',
    minLoanAmount: '',
    maxLoanAmount: '',
    minTerm: '',
    maxTerm: ''
  });

  const [filteredData, setFilteredData] = useState(matrixData);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isRateModalOpen, setIsRateModalOpen] = useState(false);
  const [isImpactAnalyzerOpen, setIsImpactAnalyzerOpen] = useState(false);
  const [isVersionHistoryOpen, setIsVersionHistoryOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [showHeatmap, setShowHeatmap] = useState(false);

  const productTypes = [
    { value: "Personal Loan", label: "Personal Loan" },
    { value: "Home Loan", label: "Home Loan" },
    { value: "Business Loan", label: "Business Loan" },
    { value: "Auto Loan", label: "Auto Loan" },
    { value: "Education Loan", label: "Education Loan" }
  ];

  const loanTypes = [
    { value: "Secured", label: "Secured" },
    { value: "Unsecured", label: "Unsecured" }
  ];

  const versionHistory = [
    {
      id: 1,
      productType: "Personal Loan",
      loanType: "Unsecured",
      interestRate: 6.5,
      timestamp: "2026-01-15T10:30:00",
      modifiedBy: "Admin User",
      changeNote: "Current active rate"
    },
    {
      id: 2,
      productType: "Personal Loan",
      loanType: "Unsecured",
      interestRate: 7.0,
      timestamp: "2025-12-01T14:20:00",
      modifiedBy: "Rate Manager",
      changeNote: "Reduced rate for competitive positioning"
    },
    {
      id: 3,
      productType: "Personal Loan",
      loanType: "Unsecured",
      interestRate: 7.5,
      timestamp: "2025-10-15T09:15:00",
      modifiedBy: "Super Admin",
      changeNote: "Quarterly rate adjustment"
    }
  ];

  const impactData = {
    affectedApplications: 247,
    revenueImpact: 125000,
    customerImpact: 189
  };

  useEffect(() => {
    applyFilters();
  }, [matrixData]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const applyFilters = () => {
    let filtered = [...matrixData];

    if (filters?.productType) {
      filtered = filtered?.filter(item => item?.productType === filters?.productType);
    }

    if (filters?.loanType) {
      filtered = filtered?.filter(item => item?.loanType === filters?.loanType);
    }

    if (filters?.minCreditScore) {
      filtered = filtered?.filter(item => item?.creditScoreMax >= parseInt(filters?.minCreditScore));
    }

    if (filters?.maxCreditScore) {
      filtered = filtered?.filter(item => item?.creditScoreMin <= parseInt(filters?.maxCreditScore));
    }

    if (filters?.minLoanAmount) {
      filtered = filtered?.filter(item => item?.loanAmountMax >= parseInt(filters?.minLoanAmount));
    }

    if (filters?.maxLoanAmount) {
      filtered = filtered?.filter(item => item?.loanAmountMin <= parseInt(filters?.maxLoanAmount));
    }

    if (filters?.minTerm) {
      filtered = filtered?.filter(item => item?.termMax >= parseInt(filters?.minTerm));
    }

    if (filters?.maxTerm) {
      filtered = filtered?.filter(item => item?.termMin <= parseInt(filters?.maxTerm));
    }

    setFilteredData(filtered);
  };

  const handleResetFilters = () => {
    setFilters({
      productType: '',
      loanType: '',
      minCreditScore: '',
      maxCreditScore: '',
      minLoanAmount: '',
      maxLoanAmount: '',
      minTerm: '',
      maxTerm: ''
    });
    setFilteredData(matrixData);
  };

  const handleSaveRate = (formData) => {
    if (editData) {
      setMatrixData(prev => prev?.map(item => 
        item?.id === editData?.id ? { ...formData, id: item?.id, modifiedBy: "Admin User", changeNote: "Rate updated" } : item
      ));
    } else {
      const newRate = {
        ...formData,
        id: matrixData?.length + 1,
        modifiedBy: "Admin User",
        changeNote: "New rate configuration"
      };
      setMatrixData(prev => [...prev, newRate]);
    }
    setEditData(null);
  };

  const handleEditRate = (row) => {
    setEditData(row);
    setIsRateModalOpen(true);
  };

  const handleDeleteRate = (id) => {
    if (window.confirm('Are you sure you want to delete this rate configuration?')) {
      setMatrixData(prev => prev?.filter(item => item?.id !== id));
      setSelectedRows(prev => prev?.filter(rowId => rowId !== id));
    }
  };

  const handleSelectRow = (id) => {
    setSelectedRows(prev => 
      prev?.includes(id) ? prev?.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedRows(filteredData?.map(item => item?.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedRows?.length} rate configurations?`)) {
      setMatrixData(prev => prev?.filter(item => !selectedRows?.includes(item?.id)));
      setSelectedRows([]);
    }
  };

  const handleBulkExport = () => {
    const selectedData = matrixData?.filter(item => selectedRows?.includes(item?.id));
    const csvContent = "data:text/csv;charset=utf-8," + 
      Object.keys(selectedData?.[0])?.join(",") + "\n" +
      selectedData?.map(row => Object.values(row)?.join(","))?.join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link?.setAttribute("href", encodedUri);
    link?.setAttribute("download", `interest_matrix_export_${new Date()?.toISOString()?.split('T')?.[0]}.csv`);
    document.body?.appendChild(link);
    link?.click();
    document.body?.removeChild(link);
  };

  const handleRestoreVersion = (version) => {
    if (window.confirm('Are you sure you want to restore this version?')) {
      const restoredRate = {
        ...version,
        id: matrixData?.length + 1,
        status: 'pending',
        effectiveDate: new Date()?.toISOString()?.split('T')?.[0],
        modifiedBy: 'Admin User',
        changeNote: 'Restored from version history'
      };
      setMatrixData(prev => [...prev, restoredRate]);
      setIsVersionHistoryOpen(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Interest Matrix Management - Rfincare</title>
        <meta name="description" content="Configure and manage dynamic interest rates across multiple loan products and customer segments" />
      </Helmet>
      <Header />
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <div className="mb-6 md:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2">
                  Interest Matrix Management
                </h1>
                <p className="text-sm md:text-base text-muted-foreground">
                  Configure dynamic interest rates based on customer profiles and loan parameters
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowHeatmap(!showHeatmap)}
                  iconName="Grid3x3"
                  iconPosition="left"
                >
                  {showHeatmap ? 'Hide' : 'Show'} Heatmap
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsVersionHistoryOpen(true)}
                  iconName="History"
                  iconPosition="left"
                >
                  History
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsImpactAnalyzerOpen(true)}
                  iconName="TrendingUp"
                  iconPosition="left"
                >
                  Impact
                </Button>

                <Button
                  variant="default"
                  size="sm"
                  onClick={() => {
                    setEditData(null);
                    setIsRateModalOpen(true);
                  }}
                  iconName="Plus"
                  iconPosition="left"
                >
                  Add Rate
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-card rounded-lg border border-border p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Icon name="Database" size={20} color="var(--color-primary)" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Configurations</p>
                  <p className="text-xl md:text-2xl font-bold text-foreground">{matrixData?.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg border border-border p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
                  <Icon name="CheckCircle" size={20} color="var(--color-success)" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Active Rates</p>
                  <p className="text-xl md:text-2xl font-bold text-foreground">
                    {matrixData?.filter(item => item?.status === 'active')?.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg border border-border p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-warning/20 flex items-center justify-center">
                  <Icon name="Clock" size={20} color="var(--color-warning)" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Pending Approval</p>
                  <p className="text-xl md:text-2xl font-bold text-foreground">
                    {matrixData?.filter(item => item?.status === 'pending')?.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg border border-border p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Icon name="Calendar" size={20} color="var(--color-primary)" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Scheduled</p>
                  <p className="text-xl md:text-2xl font-bold text-foreground">
                    {matrixData?.filter(item => item?.status === 'scheduled')?.length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {showHeatmap && (
            <div className="mb-6">
              <RateHeatmap matrixData={matrixData} />
            </div>
          )}

          <MatrixFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onApplyFilters={applyFilters}
            onResetFilters={handleResetFilters}
            productTypes={productTypes}
            loanTypes={loanTypes}
          />

          <MatrixGrid
            matrixData={filteredData}
            onEditRate={handleEditRate}
            onDeleteRate={handleDeleteRate}
            selectedRows={selectedRows}
            onSelectRow={handleSelectRow}
            onSelectAll={handleSelectAll}
          />

          <BulkActions
            selectedCount={selectedRows?.length}
            onBulkEdit={() => console.log('Bulk edit')}
            onBulkDelete={handleBulkDelete}
            onBulkExport={handleBulkExport}
            onClearSelection={() => setSelectedRows([])}
          />
        </div>
      </div>
      <RateModal
        isOpen={isRateModalOpen}
        onClose={() => {
          setIsRateModalOpen(false);
          setEditData(null);
        }}
        onSave={handleSaveRate}
        editData={editData}
        productTypes={productTypes}
        loanTypes={loanTypes}
      />
      <ImpactAnalyzer
        isOpen={isImpactAnalyzerOpen}
        onClose={() => setIsImpactAnalyzerOpen(false)}
        impactData={impactData}
      />
      <VersionHistory
        isOpen={isVersionHistoryOpen}
        onClose={() => setIsVersionHistoryOpen(false)}
        versions={versionHistory}
        onRestore={handleRestoreVersion}
      />
    </>
  );
};

export default InterestMatrixManagement;