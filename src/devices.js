export function getDeviceType({ mobileMax = 480, tabletMax = 992 } = {}) {
    const width = window.innerWidth || screen.width;
  
    if (width <= mobileMax) {
      return 'mobile';
    } else if (width <= tabletMax) {
      return 'tablet';
    } else {
      return 'desktop';
    }
  }