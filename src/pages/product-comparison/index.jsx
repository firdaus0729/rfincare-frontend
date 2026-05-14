import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Footer from '../homepage/components/Footer';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const ProductComparison = () => {
  const navigate = useNavigate();
  const [selectedProducts, setSelectedProducts] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const loanProducts = [
    {
      id: 1,
      name: 'Home Loan',
      icon: 'Home',
      interestRate: '6.5% - 9.5%',
      maxAmount: '₹5 Crore',
      tenure: 'Up to 30 years',
      processingFee: '0.5% - 1%',
      features: ['Tax benefits', 'Flexible repayment', 'Balance transfer', 'Top-up facility']
    },
    {
      id: 2,
      name: 'Personal Loan',
      icon: 'User',
      interestRate: '10.5% - 24%',
      maxAmount: '₹40 Lakhs',
      tenure: 'Up to 5 years',
      processingFee: '1% - 3%',
      features: ['No collateral', 'Quick disbursal', 'Minimal documentation', 'Flexible use']
    },
    {
      id: 3,
      name: 'Car Loan',
      icon: 'Car',
      interestRate: '7.5% - 12%',
      maxAmount: '₹1 Crore',
      tenure: 'Up to 7 years',
      processingFee: '0.5% - 2%',
      features: ['Up to 90% funding', 'New & used cars', 'Insurance included', 'Fast approval']
    },
    {
      id: 4,
      name: 'Business Loan',
      icon: 'Briefcase',
      interestRate: '9% - 18%',
      maxAmount: '₹50 Crore',
      tenure: 'Up to 10 years',
      processingFee: '1% - 2.5%',
      features: ['Working capital', 'Equipment finance', 'Expansion funding', 'Overdraft facility']
    },
    {
      id: 5,
      name: 'Education Loan',
      icon: 'GraduationCap',
      interestRate: '7.5% - 15%',
      maxAmount: '₹1.5 Crore',
      tenure: 'Up to 15 years',
      processingFee: '0% - 1%',
      features: ['Moratorium period', 'Tax benefits', 'Covers tuition & living', 'Study abroad']
    },
    {
      id: 6,
      name: 'Gold Loan',
      icon: 'Award',
      interestRate: '7% - 12%',
      maxAmount: '₹1 Crore',
      tenure: 'Up to 3 years',
      processingFee: '0% - 1%',
      features: ['Instant approval', 'Minimal documentation', 'Flexible repayment', 'Safe storage']
    }
  ];

  const toggleProduct = (productId) => {
    if (selectedProducts?.includes(productId)) {
      setSelectedProducts(selectedProducts?.filter(id => id !== productId));
    } else if (selectedProducts?.length < 3) {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };

  const selectedProductDetails = loanProducts?.filter(p => selectedProducts?.includes(p?.id));

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary via-secondary to-accent text-white py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Compare Loan Products</h1>
            <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
              Select up to 3 loan products to compare features, interest rates, and benefits side-by-side
            </p>
          </div>
        </section>

        {/* Product Selection */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Select Products to Compare</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loanProducts?.map((product) => (
                <div
                  key={product?.id}
                  onClick={() => toggleProduct(product?.id)}
                  className={`bg-white rounded-xl p-6 shadow-md cursor-pointer transition-all ${
                    selectedProducts?.includes(product?.id)
                      ? 'ring-4 ring-primary shadow-xl'
                      : 'hover:shadow-lg'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Icon name={product?.icon} size={24} color="#6366f1" />
                    </div>
                    {selectedProducts?.includes(product?.id) && (
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <Icon name="Check" size={16} color="white" />
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{product?.name}</h3>
                  <p className="text-sm text-gray-600">Interest: {product?.interestRate}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        {selectedProductDetails?.length > 0 && (
          <section className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Comparison Details</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-4 text-left font-semibold">Feature</th>
                      {selectedProductDetails?.map((product) => (
                        <th key={product?.id} className="p-4 text-left font-semibold">
                          <div className="flex items-center space-x-2">
                            <Icon name={product?.icon} size={20} color="#6366f1" />
                            <span>{product?.name}</span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-4 font-medium">Interest Rate</td>
                      {selectedProductDetails?.map((product) => (
                        <td key={product?.id} className="p-4">{product?.interestRate}</td>
                      ))}
                    </tr>
                    <tr className="border-b bg-gray-50">
                      <td className="p-4 font-medium">Max Amount</td>
                      {selectedProductDetails?.map((product) => (
                        <td key={product?.id} className="p-4">{product?.maxAmount}</td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="p-4 font-medium">Tenure</td>
                      {selectedProductDetails?.map((product) => (
                        <td key={product?.id} className="p-4">{product?.tenure}</td>
                      ))}
                    </tr>
                    <tr className="border-b bg-gray-50">
                      <td className="p-4 font-medium">Processing Fee</td>
                      {selectedProductDetails?.map((product) => (
                        <td key={product?.id} className="p-4">{product?.processingFee}</td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="p-4 font-medium align-top">Key Features</td>
                      {selectedProductDetails?.map((product) => (
                        <td key={product?.id} className="p-4">
                          <ul className="space-y-2">
                            {product?.features?.map((feature, idx) => (
                              <li key={idx} className="flex items-start space-x-2">
                                <Icon name="Check" size={16} color="#10b981" className="mt-1" />
                                <span className="text-sm">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-8 text-center">
                <Button
                  variant="default"
                  size="lg"
                  onClick={() => navigate('/customer-assessment-portal')}
                >
                  Apply Now
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-primary to-secondary text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Need Help Choosing?</h2>
            <p className="text-lg mb-8">Our experts can guide you to the perfect loan product for your needs</p>
            <Button
              variant="default"
              size="lg"
              className="bg-white text-primary hover:bg-white/90"
              onClick={() => navigate('/contact-us')}
            >
              Talk to an Expert
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ProductComparison;