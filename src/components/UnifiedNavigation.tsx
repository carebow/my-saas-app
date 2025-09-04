import React, { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, Stethoscope, UserCircle, LogOut, Heart, BookOpen, Phone, Users, Shield, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { AuthModal } from './auth/AuthModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const UnifiedNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const location = useLocation();
  const { user, logout } = useAuth();

  // Determine current page context
  const pageContext = useMemo(() => {
    const path = location.pathname;
    if (path === '/ask-carebow' || path.startsWith('/ask-carebow/')) {
      return 'askcarebow';
    }
    return 'main';
  }, [location.pathname]);

  // Memoize navigation items based on context
  const navItems = useMemo(() => {
    if (pageContext === 'askcarebow') {
      return [
        { name: 'How It Works', href: '#how-it-works', scroll: true },
        { name: 'Natural Remedies', href: '#remedies', scroll: true },
        { name: 'Success Stories', href: '#testimonials', scroll: true },
        { name: 'Wellness Blog', href: '/blog', scroll: false },
        { name: 'Upgrade', href: '#premium', scroll: true },
      ];
    } else {
      return [
        { name: "Home", href: "/" },
        { name: "Services", href: "/services" },
        { name: "Ask CareBow", href: "/ask-carebow", icon: <Stethoscope className="h-4 w-4" />, highlight: true },
        { name: "Technology", href: "/technology" },
        { name: "About", href: "/about" },
        { name: "Blog", href: "/blog" },
      ];
    }
  }, [pageContext]);



  // Handle navigation actions
  const handleNavAction = useCallback((item: { href: string; scroll?: boolean }) => {
    if (item.scroll) {
      const element = document.getElementById(item.href.slice(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsOpen(false);
  }, []);

  const handleAppAccess = useCallback(() => {
    setIsOpen(false);
    window.location.href = '/ask-carebow/app';
  }, []);

  const handleBookDemo = useCallback(() => {
    window.open('https://cal.com/carebow/30min', '_blank', 'noopener,noreferrer');
  }, []);

  const handleAuthAction = useCallback((mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
    setIsOpen(false);
  }, []);

  const handleLogout = useCallback(() => {
    logout();
    setIsOpen(false);
  }, [logout]);

  // Render navigation items
  const renderNavItems = () => {
    return navItems.map((item) => {
      if (item.scroll) {
        return (
          <button
            key={item.name}
            onClick={() => handleNavAction(item)}
            className="text-foreground hover:text-primary font-medium transition-colors relative group text-sm lg:text-base"
          >
            {item.icon && <span className="text-lg mr-1">{item.icon}</span>}
            {item.name}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
          </button>
        );
      } else {
        return (
          <Link
            key={item.name}
            to={item.href}
            className={`text-foreground hover:text-primary font-medium transition-colors relative group text-sm lg:text-base flex items-center gap-1 ${
              item.highlight ? 'text-primary font-semibold' : ''
            }`}
          >
            {item.icon && <span className="text-lg">{item.icon}</span>}
            {item.name}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
          </Link>
        );
      }
    });
  };

  // Render CTA buttons based on context
  const renderCTAs = () => {
    if (user) {
      // Authenticated user
      return (
        <div className="flex items-center space-x-3">
          <Button
            size="sm"
            className="bg-gradient-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 h-9 px-4 text-sm"
            onClick={handleAppAccess}
          >
            <Stethoscope className="w-4 h-4 mr-2" />
            Dashboard
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 px-3">
                <User className="w-4 h-4 mr-2" />
                {user.full_name || user.email.split('@')[0]}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleAppAccess}>
                <Stethoscope className="w-4 h-4 mr-2" />
                Dashboard
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    }

    if (pageContext === 'askcarebow') {
      return (
        <div className="flex items-center space-x-3">
          <Button
            size="sm"
            className="bg-gradient-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 h-9 px-4 text-sm"
            onClick={handleAppAccess}
          >
            <Stethoscope className="w-4 h-4 mr-2" />
            Try CareBow
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-blue-200 text-blue-600 hover:bg-blue-50 h-9 px-3 text-sm"
            onClick={() => handleAuthAction('login')}
          >
            Sign In
          </Button>
        </div>
      );
    } else {
      return (
        <div className="flex items-center space-x-3">
          <Button
            size="sm"
            className="bg-gradient-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 h-9 px-4 text-sm"
            onClick={handleAppAccess}
          >
            <Stethoscope className="w-4 h-4 mr-2" />
            Try CareBow
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-blue-200 text-blue-600 hover:bg-blue-50 h-9 px-3 text-sm"
            onClick={() => handleAuthAction('login')}
          >
            Sign In
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-green-200 text-green-600 hover:bg-green-50 h-9 px-3 text-sm"
            onClick={handleBookDemo}
          >
            Book Demo
          </Button>
        </div>
      );
    }
  };

  // Render mobile CTA section
  const renderMobileCTAs = () => {
    if (user) {
      return (
        <>
          <Button
            className="bg-gradient-primary text-primary-foreground h-12 text-base"
            onClick={handleAppAccess}
          >
            <Stethoscope className="w-4 h-4 mr-2" />
            Dashboard
          </Button>
          <Button
            variant="outline"
            className="border-red-200 text-red-600 hover:bg-red-50 h-12 text-base"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </>
      );
    }

    if (pageContext === 'askcarebow') {
      return (
        <>
          <Button
            className="bg-gradient-primary text-primary-foreground h-12 text-base"
            onClick={handleAppAccess}
          >
            <Stethoscope className="w-4 h-4 mr-2" />
            Try CareBow
          </Button>
          <Button
            variant="outline"
            className="border-blue-200 text-blue-600 hover:bg-blue-50 h-12 text-base"
            onClick={() => handleAuthAction('login')}
          >
            Sign In
          </Button>
        </>
      );
    } else {
      return (
        <>
          <Button
            className="bg-gradient-primary text-primary-foreground h-12 text-base"
            onClick={handleAppAccess}
          >
            <Stethoscope className="w-4 h-4 mr-2" />
            Try CareBow
          </Button>
          <Button
            variant="outline"
            className="border-blue-200 text-blue-600 hover:bg-blue-50 h-12 text-base"
            onClick={() => handleAuthAction('login')}
          >
            Sign In
          </Button>
          <Button
            variant="outline"
            className="border-green-200 text-green-600 hover:bg-green-50 h-12 text-base"
            onClick={handleBookDemo}
          >
            Book Demo
          </Button>
        </>
      );
    }
  };

  return (
    <nav className={`fixed top-0 w-full z-50 border-b transition-all duration-300 ${
      pageContext === 'askcarebow' 
        ? 'bg-background/80 backdrop-blur-md border-border' 
        : 'bg-white/90 backdrop-blur-md border-gray-100'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 md:space-x-3">
            <img 
              src="/images/carebow-logo.png" 
              alt="CareBow Logo" 
              className="w-10 h-10 md:w-12 md:h-12 object-contain"
            />
            <span className={`text-xl md:text-2xl font-bold ${
              pageContext === 'askcarebow' 
                ? 'gradient-text' 
                : 'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'
            }`}>
              CareBow
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {renderNavItems()}
          </div>

          {/* CTA Buttons - Desktop */}
          <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
            {renderCTAs()}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="text-foreground h-10 w-10 p-0"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={`md:hidden py-4 border-t ${
              pageContext === 'askcarebow' 
                ? 'border-border bg-background' 
                : 'border-gray-100 bg-white'
            }`}
          >
            <div className="flex flex-col space-y-1">
              {navItems.map((item) => (
                item.scroll ? (
                  <button
                    key={item.name}
                    onClick={() => handleNavAction(item)}
                    className="text-foreground hover:text-primary hover:bg-muted font-medium py-3 px-4 rounded-lg transition-colors text-base text-left"
                  >
                    {item.icon && <span className="text-lg mr-2">{item.icon}</span>}
                    {item.name}
                  </button>
                ) : (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`text-foreground hover:text-primary hover:bg-muted font-medium py-3 px-4 rounded-lg transition-colors text-base ${
                      item.highlight ? 'text-primary font-semibold' : ''
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.icon && <span className="text-lg mr-2">{item.icon}</span>}
                    {item.name}
                  </Link>
                )
              ))}
              
              {/* Mobile CTA Section */}
              <div className="flex flex-col space-y-3 pt-4 mt-4 border-t border-border px-4">
                {renderMobileCTAs()}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultMode={authMode}
      />
    </nav>
  );
};

export default UnifiedNavigation;