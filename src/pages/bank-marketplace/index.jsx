import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import BankCard from './components/BankCard';
import BankListItem from './components/BankListItem';
import FilterPanel from './components/FilterPanel';
import SortBar from './components/SortBar';
import ComparisonModal from './components/ComparisonModal';
import { bankService } from '../../services/apiServices';
import { useAuth } from '../../contexts/AuthContext';

const BankMarketplace = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('probability-desc');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [compareList, setCompareList] = useState([]);
  const [showComparison, setShowComparison] = useState(false);
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [filters, setFilters] = useState({
    search: '',
    interestRate: 'all',
    probability: 'all',
    loanAmount: 'all',
    tenure: 'all',
    bankTypes: [],
    features: []
  });

  useEffect(() => {
    loadBanks();
  }, []);

  const loadBanks = async () => {
    try {
      setLoading(true);
      const data = await bankService?.getActiveBanks();
      
      // Transform data to match existing UI structure
      const transformedBanks = data?.map(bank => {
        const products = bank?.bankProducts || [];
        const primaryProduct = products?.[0] || {};
        
        return {
          id: bank?.id,
          name: bank?.name,
          logo: bank?.logoUrl,
          logoAlt: bank?.logoAlt || `${bank?.name} logo`,
          rating: bank?.rating || 4.5,
          reviews: `${bank?.reviewsCount || 0} reviews`,
          probability: 75, // Default, will be calculated based on user profile
          probabilityReason: 'Based on your profile and eligibility criteria',
          interestRate: primaryProduct?.interestRateMin || 8.0,
          processingFee: primaryProduct?.processingFeePercentage 
            ? `${primaryProduct?.processingFeePercentage}% + GST` 
            : 'Contact bank',
          maxAmount: `₹${(primaryProduct?.maxLoanAmount || 2000000)?.toLocaleString('en-IN')}`,
          maxTenure: `${primaryProduct?.maxTenureYears || 20} years`,
          features: primaryProduct?.features || [],
          certifications: bank?.certifications || [],
          customersServed: bank?.customersServed || '10,000+',
          partnershipDuration: bank?.partnershipDuration || 'Partner since 2020',
          type: bank?.bankType || 'private',
          description: `Trusted financial institution offering competitive loan products with ${primaryProduct?.interestRateMin || 8}% interest rate.`
        };
      });
      
      setBanks(transformedBanks);
    } catch (err) {
      setError(err?.message);
      console.error('Failed to load banks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      interestRate: 'all',
      probability: 'all',
      loanAmount: 'all',
      tenure: 'all',
      bankTypes: [],
      features: []
    });
  };

  const handleCompareToggle = (bankId) => {
    setCompareList((prev) => {
      if (prev?.includes(bankId)) {
        return prev?.filter((id) => id !== bankId);
      }
      if (prev?.length >= 3) {
        return prev;
      }
      return [...prev, bankId];
    });
  };

  const handleApply = (bank) => {
    navigate('/bank-selection-and-consent', { state: { selectedBank: bank } });
  };

  const filteredAndSortedBanks = useMemo(() => {
    let result = [...banks];

    if (filters?.search) {
      result = result?.filter((bank) =>
      bank?.name?.toLowerCase()?.includes(filters?.search?.toLowerCase())
      );
    }

    if (filters?.interestRate !== 'all') {
      const [min, max] = filters?.interestRate?.split('-')?.map((v) => v?.replace('+', ''));
      result = result?.filter((bank) => {
        if (max) {
          return bank?.interestRate >= parseFloat(min) && bank?.interestRate <= parseFloat(max);
        }
        return bank?.interestRate >= parseFloat(min);
      });
    }

    if (filters?.probability !== 'all') {
      const [min, max] = filters?.probability?.split('-')?.map((v) => v?.replace('+', ''));
      result = result?.filter((bank) => {
        if (max) {
          return bank?.probability >= parseFloat(min) && bank?.probability <= parseFloat(max);
        }
        return bank?.probability >= parseFloat(min);
      });
    }

    if (filters?.bankTypes?.length > 0) {
      result = result?.filter((bank) => filters?.bankTypes?.includes(bank?.type));
    }

    const [sortKey, sortOrder] = sortBy?.split('-');
    result?.sort((a, b) => {
      let aVal, bVal;
      if (sortKey === 'probability') {
        aVal = a?.probability;
        bVal = b?.probability;
      } else if (sortKey === 'interest') {
        aVal = a?.interestRate;
        bVal = b?.interestRate;
      } else if (sortKey === 'rating') {
        aVal = a?.rating;
        bVal = b?.rating;
      } else if (sortKey === 'name') {
        aVal = a?.name;
        bVal = b?.name;
      }

      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      }
      return aVal < bVal ? 1 : -1;
    });

    return result;
  }, [filters, sortBy]);

  const comparedBanks = banks?.filter((bank) => compareList?.includes(bank?.id));

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 lg:py-12">
        {/* Page Header */}
        <div className="mb-6 md:mb-8 lg:mb-12">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-3 md:mb-4">
            <button onClick={() => navigate('/homepage')} className="hover:text-primary transition-colors">
              Home
            </button>
            <Icon name="ChevronRight" size={16} />
            <span className="text-foreground font-medium">Bank Marketplace</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6">
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2">
                Find Your Perfect Lender
              </h1>
              <p className="text-sm md:text-base text-muted-foreground">
                Compare personalized loan offers from our trusted banking partners
              </p>
            </div>

            {compareList?.length > 0 &&
            <Button
              variant="default"
              onClick={() => setShowComparison(true)}
              iconName="GitCompare"
              iconPosition="left"
              className="w-full md:w-auto">

                Compare Selected ({compareList?.length})
              </Button>
            }
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
          <div className="bg-card rounded-lg border border-border p-3 md:p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Icon name="Shield" size={24} className="text-success" />
            </div>
            <div className="text-lg md:text-xl font-bold text-foreground">100%</div>
            <div className="text-xs md:text-sm text-muted-foreground">Secure Process</div>
          </div>
          <div className="bg-card rounded-lg border border-border p-3 md:p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Icon name="Building2" size={24} className="text-primary" />
            </div>
            <div className="text-lg md:text-xl font-bold text-foreground">25+</div>
            <div className="text-xs md:text-sm text-muted-foreground">Partner Banks</div>
          </div>
          <div className="bg-card rounded-lg border border-border p-3 md:p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Icon name="Users" size={24} className="text-secondary" />
            </div>
            <div className="text-lg md:text-xl font-bold text-foreground">50K+</div>
            <div className="text-xs md:text-sm text-muted-foreground">Happy Customers</div>
          </div>
          <div className="bg-card rounded-lg border border-border p-3 md:p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Icon name="Clock" size={24} className="text-accent" />
            </div>
            <div className="text-lg md:text-xl font-bold text-foreground">48hrs</div>
            <div className="text-xs md:text-sm text-muted-foreground">Avg. Approval</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
          {/* Filter Sidebar */}
          <div className="lg:col-span-1">
            <FilterPanel
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={handleResetFilters}
              isOpen={isFilterOpen}
              onToggle={() => setIsFilterOpen(!isFilterOpen)} />

          </div>

          {/* Bank Listings */}
          <div className="lg:col-span-3">
            <SortBar
              sortBy={sortBy}
              onSortChange={setSortBy}
              resultCount={filteredAndSortedBanks?.length}
              viewMode={viewMode}
              onViewModeChange={setViewMode} />


            {filteredAndSortedBanks?.length === 0 ?
            <div className="bg-card rounded-lg border border-border p-8 md:p-12 text-center">
                <Icon name="Search" size={48} className="text-muted mx-auto mb-4" />
                <h3 className="text-lg md:text-xl font-bold text-foreground mb-2">
                  No banks match your filters
                </h3>
                <p className="text-sm md:text-base text-muted-foreground mb-6">
                  Try adjusting your filter criteria to see more options
                </p>
                <Button variant="outline" onClick={handleResetFilters} iconName="RotateCcw">
                  Reset Filters
                </Button>
              </div> :

            <div className={
            viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6' : 'space-y-4 md:space-y-6'
            }>
                {filteredAndSortedBanks?.map((bank) =>
              viewMode === 'grid' ?
              <BankCard
                key={bank?.id}
                bank={bank}
                onApply={handleApply}
                onCompare={handleCompareToggle}
                isComparing={compareList?.includes(bank?.id)} /> :


              <BankListItem
                key={bank?.id}
                bank={bank}
                onApply={handleApply}
                onCompare={handleCompareToggle}
                isComparing={compareList?.includes(bank?.id)} />


              )}
              </div>
            }
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 md:mt-12 bg-primary/5 rounded-lg border border-primary/20 p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Icon name="HelpCircle" size={24} className="text-primary" />
            </div>
            <div className="flex-grow">
              <h3 className="text-lg md:text-xl font-bold text-foreground mb-2">
                Need Help Choosing?
              </h3>
              <p className="text-sm md:text-base text-muted-foreground">
                Our loan experts are available to help you understand your options and make the best decision for your financial needs.
              </p>
            </div>
            <Button variant="default" iconName="Phone" iconPosition="left" className="w-full md:w-auto">
              Talk to Expert
            </Button>
          </div>
        </div>
      </main>
      {/* Comparison Modal */}
      {showComparison &&
      <ComparisonModal
        banks={comparedBanks}
        onClose={() => setShowComparison(false)}
        onApply={handleApply} />

      }
    </div>);

};

export default BankMarketplace;