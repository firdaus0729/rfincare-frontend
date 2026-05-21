import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Icon from '../../../components/AppIcon';
import BrandLogo from '../../../components/ui/BrandLogo';
import { LOAN_PRODUCTS } from '../../../constants/loanProducts';

const Footer = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const currentYear = new Date()?.getFullYear();

  const footerLinks = {
    products: LOAN_PRODUCTS.map((p) => ({
      label: p.label,
      path: `/products/${p.slug}`,
    })),
    company: [
      { label: t('footer.aboutUs'), path: '/about-us' },
      { label: t('footer.howItWorks'), path: '/homepage#how-it-works' },
      { label: t('footer.bankPartners'), path: '/bank-marketplace' },
      { label: t('footer.careers'), path: '/legal/careers' },
    ],
    resources: [
      { label: t('footer.helpCenter'), path: '/legal/help-center' },
      { label: t('footer.financialGuides'), path: '/legal/financial-guides' },
      { label: t('footer.loanCalculator'), path: '/eligibility-assessment' },
      { label: 'Share Your Story', path: '/share-your-story' },
    ],
    legal: [
      { label: t('footer.privacyPolicy'), path: '/legal/privacy-policy' },
      { label: t('footer.termsOfService'), path: '/legal/terms-of-service' },
      { label: t('footer.cookiePolicy'), path: '/legal/cookie-policy' },
      { label: t('footer.compliance'), path: '/legal/help-center' },
    ],
  };

  const socialLinks = [
    { name: 'Facebook', icon: 'Facebook', url: '#' },
    { name: 'Twitter', icon: 'Twitter', url: '#' },
    { name: 'Linkedin', icon: 'Linkedin', url: '#' },
    { name: 'Instagram', icon: 'Instagram', url: '#' }
  ];

  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 md:gap-10 mb-8 md:mb-10">
          <div className="lg:col-span-2">
            <div className="mb-4">
              <BrandLogo size="md" />
            </div>
            <p className="text-sm md:text-base text-muted-foreground mb-4 max-w-sm">
              {t('footer.tagline')}
            </p>
            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Icon name="Mail" size={16} />
                <a href={`mailto:${t('footer.email')}`} className="hover:text-primary transition-colors">
                  {t('footer.email')}
                </a>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Icon name="Phone" size={16} />
                <a href={`tel:${t('footer.phone')}`} className="hover:text-primary transition-colors">
                  {t('footer.phone')}
                </a>
              </div>
            </div>
            <div className="space-y-3 mb-4 text-xs text-muted-foreground">
              <div>
                <p className="font-semibold text-foreground mb-1">{t('footer.registeredOffice')}</p>
                <p>{t('footer.registeredAddress')}</p>
              </div>
              <div>
                <p className="font-semibold text-foreground mb-1">{t('footer.branchOffice')}</p>
                <p>{t('footer.branchAddress')}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {socialLinks?.map((social) => (
                <a
                  key={social?.name}
                  href={social?.url}
                  className="w-9 h-9 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"
                  aria-label={social?.name}
                >
                  <Icon name={social?.icon} size={18} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm md:text-base font-semibold text-foreground mb-4">{t('footer.products')}</h3>
            <ul className="space-y-2">
              {footerLinks?.products?.map((link) => (
                <li key={link?.label}>
                  <button
                    onClick={() => navigate(link?.path)}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link?.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm md:text-base font-semibold text-foreground mb-4">{t('footer.company')}</h3>
            <ul className="space-y-2">
              {footerLinks?.company?.map((link) => (
                <li key={link?.label}>
                  <button
                    onClick={() => navigate(link?.path)}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link?.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm md:text-base font-semibold text-foreground mb-4">{t('footer.resources')}</h3>
            <ul className="space-y-2">
              {footerLinks?.resources?.map((link) => (
                <li key={link?.label}>
                  <button
                    onClick={() => navigate(link?.path)}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link?.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm md:text-base font-semibold text-foreground mb-4">{t('footer.legal')}</h3>
            <ul className="space-y-2">
              {footerLinks?.legal?.map((link) => (
                <li key={link?.label}>
                  <button
                    onClick={() => navigate(link?.path)}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link?.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-6 md:pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <p className="text-xs md:text-sm text-muted-foreground text-center md:text-left">
              &copy; {currentYear} Rfincare. {t('footer.allRightsReserved')}
            </p>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-xs md:text-sm text-muted-foreground">
                <Icon name="Shield" size={16} color="var(--color-success)" />
                <span>{t('footer.sslSecured')}</span>
              </div>
              <div className="flex items-center space-x-2 text-xs md:text-sm text-muted-foreground">
                <Icon name="Lock" size={16} color="var(--color-success)" />
                <span>{t('footer.pciCompliant')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;