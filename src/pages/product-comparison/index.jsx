import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Footer from '../homepage/components/Footer';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { LOAN_PRODUCTS, getLoanProductBySlug } from '../../constants/loanProducts';

const ProductComparison = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const filterSlug = searchParams.get('loanType');
  const [selectedSlugs, setSelectedSlugs] = useState([]);

  const catalog = useMemo(
    () =>
      LOAN_PRODUCTS.map((p, index) => ({
        id: index + 1,
        slug: p.slug,
        name: p.label,
        icon: p.icon,
        interestRate: p.interestRange,
        maxAmount: p.features[0]?.replace('Up to ', '') || '—',
        tenure: p.features[1] || '—',
        processingFee: 'Varies by lender',
        features: p.features,
      })),
    [],
  );

  const visibleProducts = useMemo(() => {
    if (!filterSlug) return catalog;
    const match = getLoanProductBySlug(filterSlug);
    if (!match) return catalog;
    return catalog.filter((p) => p.slug === match.slug);
  }, [catalog, filterSlug]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (filterSlug && visibleProducts.length === 1) {
      setSelectedSlugs([visibleProducts[0].slug]);
    }
  }, [filterSlug, visibleProducts]);

  const toggleProduct = (slug) => {
    if (selectedSlugs.includes(slug)) {
      setSelectedSlugs(selectedSlugs.filter((s) => s !== slug));
    } else if (selectedSlugs.length < 3) {
      setSelectedSlugs([...selectedSlugs, slug]);
    }
  };

  const selectedProductDetails = catalog.filter((p) => selectedSlugs.includes(p.slug));

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        <section className="bg-gradient-to-br from-primary via-secondary to-accent text-white py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Compare Loan Products</h1>
            <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
              Select up to 3 loan types to compare, then check bank offers for your chosen product
            </p>
          </div>
        </section>

        <section className="py-6 bg-muted border-b border-border">
          <div className="max-w-7xl mx-auto px-4 flex flex-wrap gap-2 justify-center">
            <Link
              to="/product-comparison"
              className={`px-4 py-2 rounded-full text-sm border ${
                !filterSlug ? 'bg-primary text-primary-foreground border-primary' : 'border-border bg-card'
              }`}
            >
              All products
            </Link>
            {LOAN_PRODUCTS.map((p) => (
              <Link
                key={p.slug}
                to={`/product-comparison?loanType=${p.slug}`}
                className={`px-4 py-2 rounded-full text-sm border ${
                  filterSlug === p.slug ? 'bg-primary text-primary-foreground border-primary' : 'border-border bg-card'
                }`}
              >
                {p.shortLabel}
              </Link>
            ))}
          </div>
        </section>

        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Select products to compare</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleProducts.map((product) => (
                <div
                  key={product.slug}
                  role="button"
                  tabIndex={0}
                  onClick={() => toggleProduct(product.slug)}
                  onKeyDown={(e) => e.key === 'Enter' && toggleProduct(product.slug)}
                  className={`bg-white rounded-xl p-6 shadow-md cursor-pointer transition-all ${
                    selectedSlugs.includes(product.slug) ? 'ring-4 ring-primary shadow-xl' : 'hover:shadow-lg'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Icon name={product.icon} size={24} color="#6366f1" />
                    </div>
                    {selectedSlugs.includes(product.slug) && (
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <Icon name="Check" size={16} color="white" />
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                  <p className="text-sm text-gray-600">Interest: {product.interestRate}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-3 w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/products/${product.slug}`);
                    }}
                  >
                    View product page
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {selectedProductDetails.length > 0 && (
          <section className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Comparison details</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-4 text-left font-semibold">Feature</th>
                      {selectedProductDetails.map((product) => (
                        <th key={product.slug} className="p-4 text-left font-semibold">
                          <div className="flex items-center space-x-2">
                            <Icon name={product.icon} size={20} color="#6366f1" />
                            <span>{product.name}</span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-4 font-medium">Interest rate</td>
                      {selectedProductDetails.map((product) => (
                        <td key={product.slug} className="p-4">{product.interestRate}</td>
                      ))}
                    </tr>
                    <tr className="border-b bg-gray-50">
                      <td className="p-4 font-medium">Highlights</td>
                      {selectedProductDetails.map((product) => (
                        <td key={product.slug} className="p-4">
                          <ul className="space-y-1 text-sm">
                            {product.features.slice(0, 3).map((f) => (
                              <li key={f}>{f}</li>
                            ))}
                          </ul>
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="p-4 font-medium">Actions</td>
                      {selectedProductDetails.map((product) => (
                        <td key={product.slug} className="p-4 space-y-2">
                          <Button size="sm" className="w-full" onClick={() => navigate(`/bank-marketplace?loanType=${product.slug}`)}>
                            Compare banks
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full"
                            onClick={() => navigate(`/customer-assessment-portal?loanType=${product.slug}`)}
                          >
                            Apply now
                          </Button>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ProductComparison;
