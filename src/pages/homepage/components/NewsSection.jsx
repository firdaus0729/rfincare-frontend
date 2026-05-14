import React from 'react';

import Button from '../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';

const NewsSection = () => {
  const navigate = useNavigate();

  const newsItems = [
  {
    id: 1,
    title: 'New Home Loan Rates Starting at 6.5%',
    excerpt: 'Get the best home loan rates in the market with flexible tenure options and minimal documentation.',
    date: 'Feb 15, 2026',
    category: 'Home Loans',
    image: "https://images.unsplash.com/photo-1613232218235-06b473107ca9",
    imageAlt: 'Modern residential building exterior with glass windows and balconies'
  },
  {
    id: 2,
    title: 'Instant Personal Loan Approval in 24 Hours',
    excerpt: 'Experience lightning-fast loan approvals with our streamlined digital process and minimal paperwork.',
    date: 'Feb 12, 2026',
    category: 'Personal Loans',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_12f035801-1766489709151.png",
    imageAlt: 'Professional woman reviewing financial documents on laptop'
  },
  {
    id: 3,
    title: 'Business Loan Special Offer - Up to ₹50 Lakhs',
    excerpt: 'Grow your business with our special business loan offers featuring competitive rates and flexible repayment.',
    date: 'Feb 10, 2026',
    category: 'Business Loans',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_19af4827d-1766492566153.png",
    imageAlt: 'Business meeting with entrepreneurs discussing financial plans'
  }];


  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Latest News & Updates
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stay informed with the latest loan offers, interest rate updates, and financial news
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsItems?.map((news) =>
          <div key={news?.id} className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className="aspect-video bg-muted overflow-hidden">
                <img
                src={news?.image}
                alt={news?.imageAlt}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
              
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                    {news?.category}
                  </span>
                  <span className="text-xs text-muted-foreground">{news?.date}</span>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{news?.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{news?.excerpt}</p>
                <Button variant="link" size="sm" iconName="ArrowRight" iconPosition="right">
                  Read More
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="text-center mt-8">
          <Button variant="outline" size="lg" onClick={() => navigate('/about-us')}>
            View All News
          </Button>
        </div>
      </div>
    </section>);

};

export default NewsSection;