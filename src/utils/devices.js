let mobileMaxMain = 480;
let tabletMaxMain = 992;

export function getDeviceType() {
  const width = window.innerWidth || screen.width;

  if (width <= mobileMaxMain) {
    return "mobile";
  } else if (width <= tabletMaxMain) {
    return "tablet";
  } else {
    return "desktop";
  }
}

export function setDeviceType(mobileMax, tabletMax) {
  mobileMaxMain = mobileMax;
  tabletMaxMain = tabletMax;
}
