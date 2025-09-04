import React, { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';

const UnifiedFooter = () => {
  const location = useLocation();

  // Determine current page context
  const pageContext = useMemo(() => {
    const path = location.pathname;
    if (path === '/ask-carebow' || path.startsWith('/ask-carebow/')) {
      return 'askcarebow';
    }
    return 'main';
  }, [location.pathname]);

  const scrollToWaitlist = () => {
    // First check if we're on the homepage
    if (window.location.pathname === '/') {
      // We're on homepage, scroll to waitlist section
      const element = document.getElementById('waitlist');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        // If element not found, wait a bit and try again (in case it's still loading)
        setTimeout(() => {
          const retryElement = document.getElementById('waitlist');
          if (retryElement) {
            retryElement.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    } else {
      // If not on homepage, navigate to homepage with hash
      window.location.href = '/#waitlist';
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Footer content based on context
  const footerContent = useMemo(() => {
    if (pageContext === 'askcarebow') {
      return {
        description: "AI-powered health assistant combining modern technology with natural wellness wisdom.",
        contact: {
          email: "support@carebow.com",
          location: "🌍 Available Worldwide • 7 Languages"
        },
        sections: [
          {
            title: "Product",
            items: [
              { name: "How it Works", action: () => scrollToSection('how-it-works'), scroll: true },
              { name: "Remedies", action: () => scrollToSection('remedies'), scroll: true },
              { name: "Success Stories", action: () => scrollToSection('testimonials'), scroll: true },
            ]
          },
          {
            title: "Resources",
            items: [
              { name: "Health Blog", href: "/blog" },
              { name: "Privacy Policy", href: "/privacy-policy" },
              { name: "Terms of Service", href: "/terms-of-service" },
            ]
          },
          {
            title: "Company",
            items: [
              { name: "About Us", href: "/about" },
              { name: "Contact", href: "/contact" },
              { name: "Careers", href: "/careers" },
            ]
          },
          {
            title: "Support",
            items: [
              { name: "Help Center", href: "/contact" },
              { name: "Contact Support", href: "/contact" },
              { name: "HIPAA Compliance", href: "/hipaa-compliance" },
            ]
          }
        ],
        bottomText: "🌟 Trusted by 25,000+ users worldwide"
      };
    } else {
      return {
        description: "USA's innovative tech-enabled in-home care network. Bringing compassionate AI-powered healthcare to your doorstep in Pittsburgh, PA and beyond.",
        contact: {
          email: "info@carebow.com",
          phone: "(412) 735-1957",
          location: "📍 Pittsburgh, PA, USA (Remote Team Worldwide)"
        },
        sections: [
          {
            title: "Company",
            items: [
              { name: "About Us", href: "/about" },
              { name: "Careers", href: "/careers" },
              { name: "Contact", href: "/contact" },
            ]
          },
          {
            title: "Services",
            items: [
              { name: "Elder Care", href: "/services" },
              { name: "Pediatric Care", href: "/services" },
              { name: "Teleconsults", href: "/services" },
            ]
          },
          {
            title: "Resources",
            items: [
              { name: "Blog", href: "/blog" },
              { name: "Technology", href: "/technology" },
              { name: "Join Waitlist", action: scrollToWaitlist, scroll: false },
            ]
          },
          {
            title: "Legal",
            items: [
              { name: "Privacy Policy", href: "/privacy-policy" },
              { name: "Terms of Service", href: "/terms-of-service" },
              { name: "HIPAA Compliance", href: "/hipaa-compliance" },
            ]
          }
        ],
        bottomText: "📧 info@carebow.com"
      };
    }
  }, [pageContext]);

  return (
    <footer className="bg-slate-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start mb-10">
          <div className="mb-8 md:mb-0 md:max-w-md">
            <Link to="/" className="flex items-center space-x-3 mb-4">
              <img 
                src="/images/carebow-logo.png" 
                alt="CareBow Logo" 
                className="w-10 h-10 object-contain"
              />
              <span className="font-bold text-2xl">
                Care<span className="text-purple-400">Bow</span>
              </span>
            </Link>
            <p className="text-gray-300 leading-relaxed mb-4">
              {footerContent.description}
            </p>
            <div className="text-sm text-gray-400">
              <p>📧 {footerContent.contact.email}</p>
              {footerContent.contact.phone && <p>📞 {footerContent.contact.phone}</p>}
              <p>{footerContent.contact.location}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-12 gap-y-8">
            {footerContent.sections.map((section) => (
              <div key={section.title}>
                <h3 className="font-semibold text-lg mb-3">{section.title}</h3>
                <ul className="space-y-2">
                  {section.items.map((item) => (
                    <li key={item.name}>
                      {item.href ? (
                        <Link 
                          to={item.href} 
                          className="text-gray-300 hover:text-white transition"
                        >
                          {item.name}
                        </Link>
                      ) : (
                        <button 
                          onClick={item.action}
                          className="text-gray-300 hover:text-white transition text-left"
                        >
                          {item.name}
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-400">© {new Date().getFullYear()} CareBow. All rights reserved.</p>
          <div className="mt-4 sm:mt-0 flex items-center space-x-4">
            <span className="text-gray-400">{footerContent.bottomText}</span>
            <div className="flex space-x-4">
              <a 
                href="https://x.com/carebowx" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-white transition"
              >
                <span className="sr-only">Twitter</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              <a 
                href="https://linkedin.com/company/carebow" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-white transition"
              >
                <span className="sr-only">LinkedIn</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.047-1.852-3.047-1.853 0-2.136 1.445-2.136 2.939v5.677H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default UnifiedFooter;
