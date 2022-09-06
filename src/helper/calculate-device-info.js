import { curry } from 'ramda';

export const calculateDeviceInfo = curry((width, height) => {
  if (width <= 639) {
    return {
      isMobile: true,
      isTablet: false,
      isDesktop: false,
      device: 'mobile',
      width,
      height
    };
  }

  if (width <= 767) {
    return {
      isMobile: false,
      isTablet: true,
      isDesktop: false,
      device: 'tablet',
      width,
      height
    };
  }

  return {
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    device: 'desktop',
    width,
    height
  };
});
