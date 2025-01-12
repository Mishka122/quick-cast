import { Slider } from "./slider.js";
import { Accordion } from "./accordion.js";

class Cast {
  constructor(type, selector, options) {
    this.type = type;
    this.selector = selector;
    this.options = options;

    this.init();
  }

  init() {
    switch (this.type) {
      case "slider":
        new Slider(this.selector, this.options);
        break;
      case "swiper":
        new Swiper(this.selector, this.options);
        break;
      case "accordion":
        new Accordion(this.selector, this.options);
        break;
      default:
        throw new Error(`Unsupported type: ${this.type}`);
    }
  }
}

window.Cast = Cast;
//const swiperFirst = new Cast("swiper", ".swiper", { duration: 1, devices: 'desktop' });
