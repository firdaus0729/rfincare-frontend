import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const LoanTypesShowcase = () => {
  const navigate = useNavigate();
  const loanTypes = [
    {
      id: 1,
      loanType: 'personal',
      title: 'Personal Loans',
      description: 'Flexible financing for life\'s important moments - weddings, education, medical expenses, or debt consolidation',
      icon: 'Wallet',
      color: 'var(--color-primary)',
      features: ['Up to ₹50,000', 'Flexible terms 1-5 years', 'Quick approval', 'No collateral required'],
      interestRange: '8.5% - 15.9%'
    },
    {
      id: 2,
      loanType: 'home',
      title: 'Home Loans',
      description: 'Make your dream home a reality with competitive rates and personalized mortgage solutions',
      icon: 'Home',
      color: 'var(--color-secondary)',
      features: ['Up to ₹500,000', 'Terms up to 30 years', 'Fixed & variable rates', 'First-time buyer programs'],
      interestRange: '6.2% - 8.5%'
    },
    {
      id: 3,
      loanType: 'business',
      title: 'Business Loans',
      description: 'Fuel your entrepreneurial vision with capital designed to help your business grow and thrive',
      icon: 'Briefcase',
      color: 'var(--color-accent)',
      features: ['Up to ₹250,000', 'Flexible repayment', 'Working capital', 'Equipment financing'],
      interestRange: '9.0% - 18.0%'
    },
    {
      id: 4,
      loanType: 'auto',
      title: 'Auto Loans',
      description: 'Drive away in your perfect vehicle with affordable financing options for new and used cars',
      icon: 'Car',
      color: 'var(--color-conversion)',
      features: ['Up to ₹75,000', 'Terms 2-7 years', 'New & used vehicles', 'Refinancing available'],
      interestRange: '5.5% - 12.0%'
    }
  ];

  return (
    <section className="bg-muted py-12 md:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3 md:mb-4">
            Loan Solutions for Every Need
          </h2>
          <p className="text-sm md:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto">
            From personal milestones to business growth, we connect you with the right financing options
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {loanTypes?.map((loan) => (
            <div key={loan?.id} className="feature-card">
              <div className="flex items-start space-x-4 mb-4">
                <div
                  className="w-14 h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: loan?.color }}
                >
                  <Icon name={loan?.icon} size={28} color="white" />
                </div>
                <div className="flex-grow min-w-0">
                  <h3 className="text-lg md:text-xl font-bold text-foreground mb-2">{loan?.title}</h3>
                  <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">
                    {loan?.description}
                  </p>
                </div>
              </div>

              <div className="bg-muted rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs md:text-sm font-medium text-muted-foreground">Interest Rate Range</span>
                  <span className="text-sm md:text-base font-bold" style={{ color: loan?.color }}>
                    {loan?.interestRange}
                  </span>
                </div>
              </div>

              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {loan?.features?.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-2 text-xs md:text-sm">
                    <Icon name="Check" size={16} color={loan?.color} className="flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                variant="default"
                size="sm"
                className="mt-4 w-full"
                onClick={() => navigate(`/customer-assessment-portal?loanType=${loan.loanType}`)}
              >
                Apply Now
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LoanTypesShowcase;