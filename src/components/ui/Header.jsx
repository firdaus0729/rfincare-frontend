import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import Icon from '../AppIcon';
import Button from './Button';
import LanguageSwitcher from './LanguageSwitcher';

const PUBLIC_GUEST_PATHS = new Set([
  '/',
  '/homepage',
  '/about-us',
  '/contact-us',
  '/product-comparison',
  '/eligibility-assessment',
  '/bank-marketplace',
  '/customer-assessment-portal',
  '/login-page',
  '/customer-login',
  '/share-your-story',
]);

function isPublicGuestRoute(pathname) {
  if (!pathname) return true;
  if (pathname.startsWith('/legal/')) return true;
  return PUBLIC_GUEST_PATHS.has(pathname);
}

const Header = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { user, userProfile } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const moreMenuRef = useRef(null);

  const isGuest = !user;
  const currentRole = userProfile?.role || 'customer';
  const showGuestNav = isGuest && isPublicGuestRoute(location?.pathname);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isMoreOpen) return undefined;
    const handlePointerDown = (event) => {
      if (!moreMenuRef.current?.contains(event.target)) {
        setIsMoreOpen(false);
      }
    };
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
    };
  }, [isMoreOpen]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsMoreOpen(false);
  }, [location.pathname]);

  const guestPrimaryNav = useMemo(
    () => [
      { label: t('header.home'), path: '/homepage', icon: 'Home' },
      { label: 'About Us', path: '/about-us', icon: 'Info' },
      { label: 'Product Comparison', path: '/product-comparison', icon: 'GitCompare' },
      { label: 'Check Eligibility', path: '/eligibility-assessment', icon: 'CheckCircle' },
      { label: 'Contact Us', path: '/contact-us', icon: 'Phone' },
    ],
    [t],
  );

  const guestMoreNav = useMemo(
    () => [
      { label: t('header.applyForLoan'), path: '/customer-assessment-portal', icon: 'FileText' },
      { label: t('header.bankMarketplace'), path: '/bank-marketplace', icon: 'Building2' },
      { label: 'Customer Login', path: '/customer-login', icon: 'LogIn' },
    ],
    [t],
  );

  const authenticatedNav = useMemo(
    () => [
      { label: t('header.home'), path: '/homepage', icon: 'Home', roles: ['customer', 'agent', 'admin', 'super_admin', 'employee'] },
      { label: t('header.applyForLoan'), path: '/customer-assessment-portal', icon: 'FileText', roles: ['customer'] },
      { label: t('header.bankMarketplace'), path: '/bank-marketplace', icon: 'Building2', roles: ['customer'] },
      { label: t('header.myDashboard'), path: '/customer-dashboard', icon: 'LayoutDashboard', roles: ['customer'] },
      { label: t('header.agentDashboard'), path: '/agent-dashboard', icon: 'Users', roles: ['agent'] },
      { label: t('header.adminDashboard'), path: '/admin-dashboard', icon: 'Shield', roles: ['admin', 'super_admin'] },
      { label: t('header.employeePortal'), path: '/employee-portal', icon: 'Briefcase', roles: ['employee'] },
      { label: t('header.documents'), path: '/document-management-center', icon: 'FolderOpen', roles: ['agent', 'admin', 'super_admin', 'employee'] },
      { label: t('header.reports'), path: '/reports-and-analytics', icon: 'BarChart3', roles: ['admin', 'super_admin', 'employee'] },
    ],
    [t],
  );

  const authItems = authenticatedNav.filter((item) => item.roles.includes(currentRole));
  const visibleNavItems = showGuestNav ? guestPrimaryNav : authItems.slice(0, 5);
  const moreNavItems = showGuestNav ? guestMoreNav : authItems.slice(5);
  const mobileItems = showGuestNav ? [...guestPrimaryNav, ...guestMoreNav] : authItems;

  const isActive = (path) => location?.pathname === path;

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
    setIsMoreOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((open) => {
      if (!open) setIsMoreOpen(false);
      return !open;
    });
  };

  const toggleMoreMenu = () => {
    setIsMoreOpen((open) => {
      if (!open) setIsMobileMenuOpen(false);
      return !open;
    });
  };

  const menusVisible = isMobileMenuOpen || isMoreOpen;

  const roleLabel = currentRole === 'super_admin' ? 'Admin' : t(`header.${currentRole}`);

  return (
    <>
      <header className={`header-container ${isScrolled ? 'shadow-lg' : ''}`}>
        <div className="header-content">
          <div className="header-inner">
            <div className="header-logo" onClick={() => handleNavigation('/homepage')} role="button" tabIndex={0}>
              <div className="header-logo-icon bg-primary rounded-lg flex items-center justify-center w-10 h-10">
                <span className="text-primary-foreground font-bold text-lg">R</span>
              </div>
              <span className="header-logo-text">Rfincare</span>
            </div>
            <nav
              className={`items-center space-x-1 ${
                isMobileMenuOpen ? 'hidden' : 'hidden md:flex'
              }`}
            >
              {!menusVisible && visibleNavItems.map((item) => (
                <button key={item.path} type="button" onClick={() => handleNavigation(item.path)} className={`header-nav-item ${isActive(item.path) ? 'active' : ''}`}>
                  <div className="flex items-center space-x-2"><Icon name={item.icon} size={16} /><span>{item.label}</span></div>
                </button>
              ))}
              {moreNavItems.length > 0 && (
                <div className="relative" ref={moreMenuRef}>
                  <button
                    type="button"
                    onClick={toggleMoreMenu}
                    className={`header-nav-item flex items-center space-x-1 ${isMoreOpen ? 'active' : ''}`}
                    aria-expanded={isMoreOpen}
                    aria-haspopup="true"
                  >
                    <span>{t('header.more')}</span>
                    <Icon name={isMoreOpen ? 'ChevronUp' : 'ChevronDown'} size={16} />
                  </button>
                  {isMoreOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-popover border border-border rounded-lg shadow-lg z-50">
                      <div className="py-2">
                        {moreNavItems.map((item) => (
                          <button key={item.path} type="button" onClick={() => handleNavigation(item.path)} className="w-full px-4 py-2 text-left text-sm hover:bg-muted flex items-center space-x-2">
                            <Icon name={item.icon} size={16} /><span>{item.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </nav>
            <div className="header-actions">
              <LanguageSwitcher />
              {!isGuest && <span className={`role-badge ${currentRole}`}>{roleLabel}</span>}
              {children}
              <Button variant="ghost" size="icon" className="header-mobile-toggle" onClick={toggleMobileMenu}>
                <Icon name={isMobileMenuOpen ? 'X' : 'Menu'} size={24} />
              </Button>
            </div>
          </div>
        </div>
      </header>
      {isMobileMenuOpen && (
        <div className="mobile-menu animate-slide-in">
          <div className="mobile-menu-content">
            {mobileItems.map((item) => (
              <button key={item.path} type="button" onClick={() => handleNavigation(item.path)} className={`mobile-menu-item ${isActive(item.path) ? 'active' : ''}`}>
                <div className="flex items-center space-x-3"><Icon name={item.icon} size={20} /><span>{item.label}</span></div>
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="h-16" />
    </>
  );
};

export default Header;
