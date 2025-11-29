// Responsive utility functions

export const breakpoints = {
  xs: 475,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
}

export function getBreakpoint() {
  const width = window.innerWidth
  
  if (width < breakpoints.sm) return 'mobile'
  if (width < breakpoints.md) return 'sm'
  if (width < breakpoints.lg) return 'tablet'
  if (width < breakpoints.xl) return 'desktop'
  return 'large'
}

export function isMobile() {
  return window.innerWidth < breakpoints.sm
}

export function isTablet() {
  return window.innerWidth >= breakpoints.sm && window.innerWidth < breakpoints.lg
}

export function isDesktop() {
  return window.innerWidth >= breakpoints.lg
}

export function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

export function getViewportSize() {
  return {
    width: window.innerWidth,
    height: window.innerHeight
  }
}

export function debounce(func, wait = 300) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export function throttle(func, limit = 100) {
  let inThrottle
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}
