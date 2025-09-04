
// Native smooth scrolling utility to replace Lenis
export const smoothScrollTo = (target: string | number, options?: { offset?: number; duration?: number }) => {
  if (typeof target === 'string') {
    const element = document.getElementById(target.replace('#', ''));
    if (element) {
      const offsetTop = element.offsetTop - (options?.offset || 0);
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  } else if (typeof target === 'number') {
    window.scrollTo({
      top: target,
      behavior: 'smooth'
    });
  }
};

export const scrollToElement = (elementId: string, offset: number = 0) => {
  const element = document.getElementById(elementId);
  if (element) {
    const rect = element.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const targetPosition = rect.top + scrollTop - offset;
    
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }
};
