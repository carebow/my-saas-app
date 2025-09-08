# CareBow Landing Page

## 🚀 Production-Ready React + Tailwind Landing Page

A modern, responsive landing page built with React, TypeScript, and Tailwind CSS for CareBow healthcare services.

## ✨ Features

### **Design & UX**
- **Mobile-first responsive design** - Works perfectly on all devices
- **Modern UI/UX** - Clean, professional healthcare-focused design
- **Smooth animations** - Subtle transitions and hover effects
- **Accessibility** - WCAG compliant with proper focus states
- **Performance optimized** - Fast loading and smooth interactions

### **Sections Included**
1. **Hero Section** - Compelling headline with clear CTAs
2. **Trust Indicators** - Ratings, user count, compliance badges
3. **Testimonials** - Real customer stories and reviews
4. **How It Works** - 3-step process explanation
5. **Services** - Comprehensive healthcare services showcase
6. **Comparison Table** - Why choose CareBow vs traditional healthcare
7. **FAQ** - Common questions and answers
8. **Waitlist Form** - Email capture with loading states
9. **Footer** - Contact info and links

### **Interactive Features**
- **Smooth scrolling navigation** - Click nav items to scroll to sections
- **Mobile hamburger menu** - Responsive navigation
- **Form handling** - Email validation and submission states
- **Scroll-to-top button** - Appears after scrolling down
- **Loading states** - Professional form submission feedback

## 🛠️ Technical Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icons
- **Vite** - Fast build tool and dev server

## 📁 File Structure

```
src/
├── CareBowLanding.tsx    # Main landing page component
├── App.tsx              # Updated to show landing page
├── AppSimple.tsx        # Simple version (no routing)
└── index.css            # Tailwind imports
```

## 🚀 Quick Start

### **Option 1: Use Simple Version (Recommended)**
```bash
# Replace main App.tsx with simple version
cp src/AppSimple.tsx src/App.tsx
npm run dev
```

### **Option 2: Keep Existing Routing**
The landing page is already set as the main route (`/`) in your existing App.tsx.

## 🎨 Customization

### **Brand Colors**
The page uses `indigo-600` as the primary color. To change:
1. Update Tailwind classes in `CareBowLanding.tsx`
2. Or modify `tailwind.config.ts` theme

### **Content Updates**
- **Hero text**: Update headline and description
- **Services**: Modify service cards and descriptions
- **Testimonials**: Replace with real customer quotes
- **FAQ**: Add/remove questions
- **Contact info**: Update footer details

### **Form Integration**
The waitlist form is ready for backend integration:

```typescript
// Replace this in handleSubmit function:
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  
  try {
    // Add your API call here
    await fetch('/api/waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    
    setIsSubmitted(true);
    setEmail('');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    setIsLoading(false);
  }
};
```

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start dev server (http://localhost:8081)

# Production
npm run build        # Build for production
npm run preview      # Preview production build
```

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

## 🎯 SEO Features

- **Semantic HTML** - Proper heading structure
- **Meta tags** - Title, description, keywords
- **Accessibility** - ARIA labels and focus management
- **Performance** - Optimized images and code splitting

## 🚀 Deployment

### **Vercel (Recommended)**
```bash
# Build command
npm run build

# Output directory
dist

# Environment variables (if needed)
VITE_API_BASE=your_api_url
```

### **Other Platforms**
- **Netlify**: Works with standard Vite build
- **AWS S3**: Upload `dist` folder
- **GitHub Pages**: Use `vite.config.ts` base path

## 🔍 Testing

The landing page has been tested for:
- ✅ **Responsive design** - All screen sizes
- ✅ **Form validation** - Email input and submission
- ✅ **Navigation** - Smooth scrolling and mobile menu
- ✅ **Performance** - Fast loading and smooth animations
- ✅ **Accessibility** - Keyboard navigation and screen readers

## 📞 Support

For questions or customization help:
- Check the component code in `src/CareBowLanding.tsx`
- Modify Tailwind classes for styling changes
- Update content directly in the JSX

---

**Ready to launch!** 🚀 Your production-ready landing page is complete and optimized for conversion.
