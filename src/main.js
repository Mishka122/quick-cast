class Cast {
  constructor(type, options) {
    if (!type) {
      console.warn("Warning: 'type' parameter is missing.");
      return;
    }

    if (!options || (!options.target && type !== "settings")) {
      console.warn("Warning: 'target' parameter is missing.");
      return;
    }

    this.type = type;
    this.options = { ...options };
    this.init();
  }

  async init() {
    switch (this.type) {
      case "slider": {
        const { Slider } = await import("./animations/slider.js");
        new Slider(this.options);
        break;
      }

      case "accordion": {
        const { Accordion } = await import("./animations/accordion.js");
        new Accordion(this.options);
        break;
      }

      case "settings": {
        if (this.options.tabletMax && this.options.mobileMax) {
          console.log(this.options.mobileMax, this.options.tabletMax);

          const { setDeviceType } = await import("./utils/devices.js");
          setDeviceType(this.options.mobileMax, this.options.tabletMax);
        }
        break;
      }

      default:
        console.warn(`Warning: Unsupported type: ${this.type}`);
        return;
    }
  }
}

window.Cast = Cast;
