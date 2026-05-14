import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const TestimonialsSection = () => {
  const [activeTab, setActiveTab] = useState('customer');

  const testimonials = {
    customers: [
    {
      id: 1,
      name: 'Sarah Mitchell',
      location: 'Mumbai, Maharashtra',
      image: "https://img.rocket.new/generatedImages/rocket_gen_img_170699746-1763294878713.png",
      imageAlt: 'Professional woman with shoulder-length brown hair wearing navy blazer smiling warmly at camera',
      rating: 5,
      text: 'Rfincare made my home loan journey incredibly smooth. The bank matching was spot-on, and I got approved within 48 hours. The transparency throughout the process gave me complete peace of mind.',
      loanAmount: '₹350,000',
      processingTime: '2 days'
    },
    {
      id: 2,
      name: 'Rajesh Kumar',
      location: 'Bangalore, Karnataka',
      image: "https://img.rocket.new/generatedImages/rocket_gen_img_1d95f6486-1763295644260.png",
      imageAlt: 'Asian businessman with short black hair in gray suit and blue tie with confident professional expression',
      rating: 5,
      text: 'As a small business owner, getting financing was always a nightmare. Rfincare connected me with the perfect lender who understood my business needs. The entire process was digital and hassle-free.',
      loanAmount: '₹125,000',
      processingTime: '3 days'
    },
    {
      id: 3,
      name: 'Priya Sharma',
      location: 'Delhi NCR',
      image: "https://img.rocket.new/generatedImages/rocket_gen_img_11984bfac-1763296141464.png",
      imageAlt: 'Hispanic woman with long dark hair wearing white blouse with warm friendly smile in professional setting',
      rating: 5,
      text: 'I needed funds urgently for medical expenses. Rfincare\'s quick eligibility check showed me exactly what I qualified for, and the approval was lightning fast. Truly a lifesaver!',
      loanAmount: '₹25,000',
      processingTime: '1 day'
    }],

    agents: [
    {
      id: 1,
      name: 'Michael Chen',
      location: 'Pune, Maharashtra',
      image: "https://img.rocket.new/generatedImages/rocket_gen_img_1da91affa-1763293647230.png",
      imageAlt: 'Middle-aged Caucasian man with salt-and-pepper hair in charcoal suit with professional confident demeanor',
      rating: 5,
      text: 'Joining Rfincare as an agent was the best career decision I made. The platform handles all the complexity, letting me focus on helping clients. My monthly commissions have tripled in just 6 months.',
      clients: '150+ clients',
      earnings: '₹8,500/month'
    },
    {
      id: 2,
      name: 'Anita Desai',
      location: 'Chennai, Tamil Nadu',
      image: "https://img.rocket.new/generatedImages/rocket_gen_img_160d57367-1763300679418.png",
      imageAlt: 'Indian woman with long black hair in professional burgundy blazer with confident professional smile',
      rating: 5,
      text: 'The training and support from Rfincare are exceptional. Even as a newcomer to financial services, I was able to build a successful practice. The commission structure is transparent and rewarding.',
      clients: '85+ clients',
      earnings: '₹5,200/month'
    }]

  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 })?.map((_, index) =>
    <Icon
      key={index}
      name="Star"
      size={16}
      color={index < rating ? 'var(--color-warning)' : 'var(--color-border)'}
      className={index < rating ? 'fill-current' : ''} />

    );
  };

  return (
    <section className="bg-muted py-12 md:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3 md:mb-4">
            Success Stories That Inspire
          </h2>
          <p className="text-sm md:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto">
            Real experiences from customers and agents who achieved their financial goals with Rfincare
          </p>
        </div>

        <div className="flex justify-center mb-8 md:mb-10">
          <div className="inline-flex bg-card rounded-lg p-1 border border-border">
            <button
              onClick={() => setActiveTab('customer')}
              className={`px-6 py-2 md:px-8 md:py-3 rounded-md text-sm md:text-base font-medium transition-all ${
              activeTab === 'customer' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`
              }>

              Customer Stories
            </button>
            <button
              onClick={() => setActiveTab('agent')}
              className={`px-6 py-2 md:px-8 md:py-3 rounded-md text-sm md:text-base font-medium transition-all ${
              activeTab === 'agent' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`
              }>

              Agent Success
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {testimonials?.[activeTab]?.map((testimonial) =>
          <div key={testimonial?.id} className="feature-card">
              <div className="flex items-start space-x-4 mb-4">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                  src={testimonial?.image}
                  alt={testimonial?.imageAlt}
                  className="w-full h-full object-cover" />

                </div>
                <div className="flex-grow min-w-0">
                  <h4 className="font-bold text-base md:text-lg text-foreground mb-1 line-clamp-1">
                    {testimonial?.name}
                  </h4>
                  <p className="text-xs md:text-sm text-muted-foreground mb-2 line-clamp-1">
                    {testimonial?.role}
                  </p>
                  <div className="flex items-center space-x-1">
                    {renderStars(testimonial?.rating)}
                  </div>
                </div>
              </div>

              <p className="text-sm md:text-base text-muted-foreground mb-4 line-clamp-4">
                "{testimonial?.text}"
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                {activeTab === 'customer' ?
              <>
                    <div className="text-center flex-1">
                      <div className="text-xs text-muted-foreground mb-1">Loan Amount</div>
                      <div className="text-sm md:text-base font-bold text-foreground whitespace-nowrap">
                        {testimonial?.loanAmount}
                      </div>
                    </div>
                    <div className="w-px h-8 bg-border"></div>
                    <div className="text-center flex-1">
                      <div className="text-xs text-muted-foreground mb-1">Processing Time</div>
                      <div className="text-sm md:text-base font-bold text-success whitespace-nowrap">
                        {testimonial?.processingTime}
                      </div>
                    </div>
                  </> :

              <>
                    <div className="text-center flex-1">
                      <div className="text-xs text-muted-foreground mb-1">Active Clients</div>
                      <div className="text-sm md:text-base font-bold text-foreground whitespace-nowrap">
                        {testimonial?.clients}
                      </div>
                    </div>
                    <div className="w-px h-8 bg-border"></div>
                    <div className="text-center flex-1">
                      <div className="text-xs text-muted-foreground mb-1">Avg. Earnings</div>
                      <div className="text-sm md:text-base font-bold text-success whitespace-nowrap">
                        {testimonial?.earnings}
                      </div>
                    </div>
                  </>
              }
              </div>
            </div>
          )}
        </div>
      </div>
    </section>);

};

export default TestimonialsSection;