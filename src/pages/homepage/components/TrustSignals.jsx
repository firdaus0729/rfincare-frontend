import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const TrustSignals = () => {
  const statistics = [
  {
    id: 'applications',
    value: '50,000+',
    label: 'Applications Processed',
    icon: 'FileCheck',
    color: 'var(--color-primary)'
  },
  {
    id: 'approval',
    value: '87%',
    label: 'Average Approval Rate',
    icon: 'TrendingUp',
    color: 'var(--color-success)'
  },
  {
    id: 'processing',
    value: '48 Hours',
    label: 'Average Processing Time',
    icon: 'Clock',
    color: 'var(--color-secondary)'
  },
  {
    id: 'satisfaction',
    value: '4.8/5',
    label: 'Customer Satisfaction',
    icon: 'Star',
    color: 'var(--color-warning)'
  }];


  const certifications = [
  {
    id: 'ssl',
    name: 'SSL Secured',
    icon: 'Lock',
    description: '256-bit encryption'
  },
  {
    id: 'pci',
    name: 'PCI Compliant',
    icon: 'CreditCard',
    description: 'Payment security'
  },
  {
    id: 'iso',
    name: 'ISO 27001',
    icon: 'Shield',
    description: 'Information security'
  },
  {
    id: 'gdpr',
    name: 'GDPR Compliant',
    icon: 'FileText',
    description: 'Data protection'
  }];


  const bankPartners = [
  {
    id: 'bank1',
    name: 'First National Bank',
    logo: "https://img.rocket.new/generatedImages/rocket_gen_img_110ddeab1-1767460670898.png",
    logoAlt: 'First National Bank logo featuring blue shield emblem with gold accents on white background',
    years: '5+ years',
    volume: '10,000+ loans'
  },
  {
    id: 'bank2',
    name: 'Capital Trust Bank',
    logo: "https://img.rocket.new/generatedImages/rocket_gen_img_1b56d2e4b-1768453455755.png",
    logoAlt: 'Capital Trust Bank logo with modern green and blue geometric design on white background',
    years: '4+ years',
    volume: '8,500+ loans'
  },
  {
    id: 'bank3',
    name: 'United Financial',
    logo: "https://img.rocket.new/generatedImages/rocket_gen_img_1686bead5-1768453457417.png",
    logoAlt: 'United Financial logo featuring red and white corporate branding with professional typography',
    years: '6+ years',
    volume: '12,000+ loans'
  },
  {
    id: 'bank4',
    name: 'Metro Credit Union',
    logo: "https://img.rocket.new/generatedImages/rocket_gen_img_135b6439b-1767605395048.png",
    logoAlt: 'Metro Credit Union logo with orange circular emblem and modern sans-serif text on white',
    years: '3+ years',
    volume: '6,000+ loans'
  }];


  return (
    <section className="bg-background py-12 md:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3 md:mb-4">
            Trusted by Thousands
          </h2>
          <p className="text-sm md:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto">
            Our commitment to security, transparency, and customer success speaks for itself
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12 md:mb-16">
          {statistics?.map((stat) =>
          <div key={stat?.id} className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full mb-3 md:mb-4" style={{ backgroundColor: `${stat?.color}20` }}>
                <Icon name={stat?.icon} size={24} color={stat?.color} />
              </div>
              <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-1 md:mb-2">
                {stat?.value}
              </div>
              <div className="text-xs md:text-sm text-muted-foreground">
                {stat?.label}
              </div>
            </div>
          )}
        </div>

        <div className="bg-muted rounded-2xl p-6 md:p-8 lg:p-10 mb-12 md:mb-16">
          <h3 className="text-xl md:text-2xl font-bold text-foreground text-center mb-6 md:mb-8">
            Security & Compliance Certifications
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {certifications?.map((cert) =>
            <div key={cert?.id} className="trust-badge flex-col text-center">
                <Icon name={cert?.icon} size={32} color="var(--color-primary)" className="mb-3" />
                <div className="font-semibold text-sm md:text-base text-foreground mb-1">{cert?.name}</div>
                <div className="text-xs text-muted-foreground">{cert?.description}</div>
              </div>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-xl md:text-2xl font-bold text-foreground text-center mb-6 md:mb-8">
            Our Banking Partners
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {bankPartners?.map((bank) =>
            <div key={bank?.id} className="feature-card text-center">
                <div className="w-full h-16 md:h-20 mb-4 flex items-center justify-center overflow-hidden rounded-lg bg-muted">
                  <Image
                  src={bank?.logo}
                  alt={bank?.logoAlt}
                  className="w-full h-full object-contain p-2" />

                </div>
                <h4 className="font-semibold text-sm md:text-base text-foreground mb-2 line-clamp-2">
                  {bank?.name}
                </h4>
                <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
                  <span className="flex items-center space-x-1">
                    <Icon name="Calendar" size={12} />
                    <span>{bank?.years}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Icon name="FileCheck" size={12} />
                    <span>{bank?.volume}</span>
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>);

};

export default TrustSignals;