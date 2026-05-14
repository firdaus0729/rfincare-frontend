import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const VideosSection = () => {
  const videos = [
  {
    id: 1,
    title: 'How to Apply for a Home Loan',
    description: 'Step-by-step guide to applying for your dream home loan with minimal documentation',
    duration: '5:30',
    thumbnail: "https://img.rocket.new/generatedImages/rocket_gen_img_115b97cef-1769711211198.png",
    thumbnailAlt: 'Video thumbnail showing home loan application process on computer screen',
    views: '12K'
  },
  {
    id: 2,
    title: 'Understanding Credit Scores',
    description: 'Learn how credit scores work and how to improve yours for better loan approval',
    duration: '8:15',
    thumbnail: "https://img.rocket.new/generatedImages/rocket_gen_img_1b972e948-1771246886450.png",
    thumbnailAlt: 'Infographic explaining credit score ranges and factors',
    views: '25K'
  },
  {
    id: 3,
    title: 'Loan Eligibility Calculator Tutorial',
    description: 'Master our eligibility calculator to find the perfect loan amount for your needs',
    duration: '4:45',
    thumbnail: "https://img.rocket.new/generatedImages/rocket_gen_img_1a35983b6-1767122123348.png",
    thumbnailAlt: 'Calculator interface showing loan eligibility calculation',
    views: '18K'
  }];


  return (
    <section className="py-16 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Educational Videos
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Watch our expert guides to make informed financial decisions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos?.map((video) =>
          <div key={video?.id} className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all duration-300 group">
              <div className="relative aspect-video bg-muted overflow-hidden">
                <img
                src={video?.thumbnail}
                alt={video?.thumbnailAlt}
                className="w-full h-full object-cover" />
              
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                    <Icon name="Play" size={32} color="white" />
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                  {video?.duration}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-foreground mb-2">{video?.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{video?.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Icon name="Eye" size={14} />
                    {video?.views} views
                  </span>
                  <Button variant="link" size="sm" iconName="Play" iconPosition="left">
                    Watch Now
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="text-center mt-8">
          <Button variant="outline" size="lg">
            View All Videos
          </Button>
        </div>
      </div>
    </section>);

};

export default VideosSection;