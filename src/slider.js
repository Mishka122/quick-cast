import { getDeviceType } from "./devices.js";
import { swipe } from "./swipe-event.js";
import { gsap } from "gsap";

export class Slider {
  constructor(selector, options) {
    console.log(
      `Slider initialized with selector: ${selector} and options:`,
      options
    );

    const defaultOptions = {
      content: "[slider-content-parent]",
      elements: false,
      target: false,
      pagination: false,
      indicators: false,
      paginationActive: ".active",
      leftArrow: "[slider-left-arrow]",
      rightArrow: "[slider-right-arrow]",
      devices: "desktop,mobile,tablet",
      duration: 500,
      infinity: false,
      custom: false,
    };

    this.slider = selector;
    this.options = { ...defaultOptions, ...options };

    if (this.deviceControl()) {
      this.init();
    } else {
      console.log(`Init skipped: devices does not ${this.options.devices}`);
    }
  }

  deviceControl() {
    const devicesArray = this.options.devices.split(",");
    const currentDevice = getDeviceType();
    return devicesArray.includes(currentDevice);
  }

  init() {
    /**************************************
     *           slider MODULE            *
     **************************************/

    const slider = document.querySelector(`${this.slider}`);
    const sliderContentParent = slider.querySelector(`${this.options.content}`);
    const sliderContentElements =
      slider.querySelectorAll(`${this.options.elements}`).length > 0
        ? slider.querySelectorAll(`${this.options.elements}`)
        : sliderContentParent.children;

    const sliderTarget =
      slider.querySelector(`${this.options.target}`) ||
      sliderContentParent.parentNode;

    const sliderPaginationParent = slider.querySelector(
      `${this.options.pagination}`
    );
    let sliderPaginationIndicators =
      slider.querySelector(`${this.options.indicators}`) ||
      sliderPaginationParent?.querySelector(":scope > *");
    const sliderPaginationActiveClass = this.options.paginationActive.slice(1);

    const sliderLeftArrow = slider.querySelector(`${this.options.leftArrow}`);
    const sliderRightArrow = slider.querySelector(`${this.options.rightArrow}`);

    const sliderDevices = this.options.devices;
    const sliderInfinity = this.options.infinity;
    const sliderDuration = this.options.duration;
    const sliderCustom = this.options.custom;

    const totalSlides = sliderContentElements.length;
    let sliderWatcher = 0;
    let sliderSafety = true;

    console.log(
      slider,
      sliderContentParent,
      sliderContentElements,
      sliderPaginationParent,
      sliderPaginationIndicators,
      sliderPaginationActiveClass,
      sliderLeftArrow,
      sliderRightArrow,
      sliderDevices,
      totalSlides,
      sliderDuration,
      sliderCustom
    );

    const distance = -(
      sliderContentElements[0].offsetWidth +
      parseInt(getComputedStyle(sliderContentElements[0], true).marginRight)
    );

    if (sliderPaginationParent) {
      if (totalSlides <= 1) {
        gsap.set(sliderPaginationParent, {
          opacity: 0,
        });
      } else {
        for (let b = 1; b < totalSlides; b++) {
          let copy = sliderPaginationIndicators.cloneNode(false);
          // sliderPaginationParent.innerHTML = null
          sliderPaginationParent.append(copy);
          if (!sliderCustom) {
            gsap.set(sliderContentElements[b], {
              opacity: 0.4,
            });
          }
        }
        sliderPaginationIndicators.classList.add(sliderPaginationActiveClass);
        sliderPaginationIndicators =
          sliderPaginationParent.querySelectorAll(":scope > *");
      }
    }

    const quickIndex = (startIndex) => {
      startIndex = startIndex % totalSlides;
      for (let i = 0; i < totalSlides; i++) {
        const currentBlock =
          sliderContentElements[(startIndex + i) % totalSlides];
        currentBlock.setAttribute("quick-index", i);
      }
    };

    const unifiedAnimation = (step, direction) => {
      sliderWatcher += step;
      quickIndex(sliderWatcher);

      const currentSlide = sliderContentParent.querySelector(
        `[quick-index="${0}"]`
      );

      const previousSlide =
        direction > 0
          ? sliderContentParent.querySelector(
              `[quick-index="${totalSlides - 1}"]`
            )
          : sliderContentParent.querySelector(`[quick-index="${1}"]`);

      const nextSlide =
        direction > 0
          ? sliderContentParent.querySelector(`[quick-index="${1}"]`)
          : sliderContentParent.querySelector(
              `[quick-index="${totalSlides - 1}"]`
            );

      const previousSlide2 =
        direction > 0
          ? sliderContentParent.querySelector(
              `[quick-index="${totalSlides - 2}"]`
            )
          : sliderContentParent.querySelector(`[quick-index="${2}"]`);

      const nextSlide2 =
        direction > 0
          ? sliderContentParent.querySelector(`[quick-index="${2}"]`)
          : sliderContentParent.querySelector(
              `[quick-index="${totalSlides - 2}"]`
            );

      if (!sliderCustom) {
        gsap.to(sliderContentParent, {
          duration: sliderDuration,
          ease: "power1.out",
          x: sliderWatcher * distance,
        });

        gsap.to(currentSlide, {
          overwrite: true,
          ease: "power1.inOut",
          duration: 0.6,
          opacity: 1,
        });

        gsap.to(previousSlide, {
          overwrite: true,
          ease: "power1.inOut",
          duration: 0.6,
          opacity: 0.4,
        });
      } else {
        sliderCustom({
          currentSlide,
          previousSlide,
          nextSlide,
          previousSlide2,
          nextSlide2,
        });
      }

      if (sliderPaginationParent) {
        sliderPaginationIndicators[sliderWatcher].classList.add(
          sliderPaginationActiveClass
        );
        sliderPaginationIndicators[sliderWatcher - step].classList.remove(
          sliderPaginationActiveClass
        );
      }
    };

    const handleArrowClick = (direction) => {
      if (sliderSafety == true) {
        if (direction === 1) {
          if (sliderWatcher < totalSlides - 1) {
            unifiedAnimation(1, direction);
          } else if (sliderInfinity) {
            // Loop back to the first slide
            unifiedAnimation(-sliderWatcher, direction);
          }
        } else if (direction === -1) {
          if (sliderWatcher > 0) {
            unifiedAnimation(-1, direction);
          } else if (sliderInfinity) {
            // Loop to the last slide
            unifiedAnimation(totalSlides - 1 - sliderWatcher, direction);
          }
        }
      }
    };

    if (sliderRightArrow) {
      sliderRightArrow.addEventListener("click", () => handleArrowClick(1));
    }

    if (sliderLeftArrow) {
      sliderLeftArrow.addEventListener("click", () => handleArrowClick(-1));
    }

    const startSwipe = (event) => {
      if (sliderSafety == true) {
        if (event.detail.dir == "left") {
          if (sliderWatcher < totalSlides - 1) {
            unifiedAnimation(1, 1);
          } else if (sliderInfinity) {
            // Loop back to the first slide
            unifiedAnimation(-sliderWatcher, 1);
          }
        } else if (event.detail.dir == "right") {
          if (sliderWatcher > 0) {
            unifiedAnimation(-1, -1);
          } else if (sliderInfinity) {
            // Loop to the last slide
            unifiedAnimation(totalSlides - sliderWatcher, -1);
          }
        }
      }
    };

    swipe(sliderTarget, {
      maxTime: 2000,
      minTime: 10,
      maxDist: 2000,
      minDist: 10,
    });

    sliderTarget.addEventListener("swipe", (e) => {
      startSwipe(e);
    });
  }
}
