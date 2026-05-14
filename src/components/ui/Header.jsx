import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Icon from '../AppIcon';
import Button from './Button';
import LanguageSwitcher from './LanguageSwitcher';

const Header = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState('customer');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const path = location?.pathname;
    if (path?.includes('agent')) {
      setCurrentRole('agent');
    } else if (path?.includes('admin')) {
      setCurrentRole('admin');
    } else if (path?.includes('employee')) {
      setCurrentRole('employee');
    } else {
      setCurrentRole('customer');
    }
  }, [location?.pathname]);

  const navigationItems = [
  {
    label: t('header.home'),
    path: '/homepage',
    icon: 'Home',
    roles: ['customer', 'agent', 'admin', 'employee']
  },
  {
    label: 'About Us',
    path: '/about-us',
    icon: 'Info',
    roles: ['customer']
  },
  {
    label: 'Product Comparison',
    path: '/product-comparison',
    icon: 'GitCompare',
    roles: ['customer']
  },
  {
    label: 'Check Eligibility',
    path: '/eligibility-assessment',
    icon: 'CheckCircle',
    roles: ['customer']
  },
  {
    label: 'Contact Us',
    path: '/contact-us',
    icon: 'Phone',
    roles: ['customer']
  },
  {
    label: 'Login',
    path: '/login-page',
    icon: 'LogIn',
    roles: ['customer']
  },
  {
    label: t('header.applyForLoan'),
    path: '/customer-assessment-portal',
    icon: 'FileText',
    roles: ['customer']
  },
  {
    label: t('header.bankMarketplace'),
    path: '/bank-marketplace',
    icon: 'Building2',
    roles: ['customer']
  },
  {
    label: t('header.myDashboard'),
    path: '/authentication-management-center',
    icon: 'LayoutDashboard',
    roles: ['customer']
  },
  {
    label: t('header.agentDashboard'),
    path: '/agent-dashboard',
    icon: 'Users',
    roles: ['agent']
  },
  {
    label: t('header.adminDashboard'),
    path: '/admin-dashboard',
    icon: 'Shield',
    roles: ['admin']
  },
  {
    label: 'Security Monitor',
    path: '/admin-security-dashboard',
    icon: 'ShieldAlert',
    roles: ['admin']
  },
  {
    label: t('header.interestMatrix'),
    path: '/interest-matrix-management',
    icon: 'TrendingUp',
    roles: ['admin']
  },
  {
    label: t('header.employeePortal'),
    path: '/employee-portal',
    icon: 'Briefcase',
    roles: ['employee']
  },
  {
    label: t('header.documents'),
    path: '/document-management-center',
    icon: 'FolderOpen',
    roles: ['agent', 'admin', 'employee']
  },
  {
    label: t('header.reports'),
    path: '/reports-and-analytics',
    icon: 'BarChart3',
    roles: ['admin', 'employee']
  }];


  const visibleNavItems = navigationItems?.filter((item) =>
  item?.roles?.includes(currentRole)
  )?.slice(0, 5);

  const moreNavItems = navigationItems?.filter((item) =>
  item?.roles?.includes(currentRole)
  )?.slice(5);

  const isActive = (path) => location?.pathname === path;

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const getRoleBadgeClass = () => {
    const baseClass = 'role-badge';
    return `${baseClass} ${currentRole}`;
  };

  const getRoleColor = () => {
    const colors = {
      customer: 'var(--color-customer-primary)',
      agent: 'var(--color-agent-primary)',
      admin: 'var(--color-admin-primary)',
      employee: 'var(--color-employee-primary)'
    };
    return colors?.[currentRole];
  };

  return (
    <>
      <header className={`header-container ${isScrolled ? 'shadow-lg' : ''}`}>
        <div className="header-content">
          <div className="header-inner">
            <div className="header-logo" onClick={() => handleNavigation('/homepage')}>
              <div className="header-logo-icon">
                <img
                  src="/assets/images/Logo_-_Copy_-_Copy-1771484476490.jpg"
                  alt="Rfincare Logo"
                  className="w-10 h-10 rounded-lg object-cover"
                />
              </div>
              <span className="header-logo-text">Rfincare</span>
            </div>

            <nav className="header-nav">
              {visibleNavItems?.map((item) =>
              <button
                key={item?.path}
                onClick={() => handleNavigation(item?.path)}
                className={`header-nav-item ${isActive(item?.path) ? 'active' : ''}`}>

                  <div className="flex items-center space-x-2">
                    <Icon name={item?.icon} size={16} />
                    <span>{item?.label}</span>
                  </div>
                </button>
              )}

              {moreNavItems?.length > 0 &&
              <div className="relative group">
                  <button className="header-nav-item flex items-center space-x-1">
                    <span>{t('header.more')}</span>
                    <Icon name="ChevronDown" size={16} />
                  </button>
                  <div className="absolute right-0 mt-2 w-56 bg-popover border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-2">
                      {moreNavItems?.map((item) =>
                    <button
                      key={item?.path}
                      onClick={() => handleNavigation(item?.path)}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors flex items-center space-x-2 ${
                      isActive(item?.path) ? 'bg-muted text-primary font-semibold' : ''}`
                      }>

                          <Icon name={item?.icon} size={16} />
                          <span>{item?.label}</span>
                        </button>
                    )}
                    </div>
                  </div>
                </div>
              }
            </nav>

            <div className="header-actions">
              <LanguageSwitcher />
              
              <span className={getRoleBadgeClass()}>
                {t(`header.${currentRole}`)}
              </span>

              {children}

              <Button
                variant="ghost"
                size="icon"
                className="header-mobile-toggle"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>

                <Icon name={isMobileMenuOpen ? 'X' : 'Menu'} size={24} />
              </Button>
            </div>
          </div>
        </div>

        {isMobileMenuOpen &&
        <div className="mobile-menu animate-slide-in">
            <div className="mobile-menu-content">
              {navigationItems?.filter((item) => item?.roles?.includes(currentRole))?.map((item) =>
            <button
              key={item?.path}
              onClick={() => handleNavigation(item?.path)}
              className={`mobile-menu-item ${isActive(item?.path) ? 'active' : ''}`}>

                    <div className="flex items-center space-x-3">
                      <Icon name={item?.icon} size={20} />
                      <span>{item?.label}</span>
                    </div>
                  </button>
            )}
            </div>
          </div>
        }
      </header>
      <div className="h-16"></div>
    </>
  );

};

export default Header;