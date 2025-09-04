
import { smoothScrollTo, scrollToElement } from './smoothScroll';

// Re-export for backwards compatibility
export { smoothScrollTo as scrollToElement };
export { scrollToElement as scrollToElementById };

// Legacy function for backwards compatibility
export const scrollTo = (target: string | number, options?: { offset?: number; duration?: number }) => {
  smoothScrollTo(target, options);
};
