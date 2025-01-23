import { getDeviceType } from "../utils/devices.js";

export class Slider {
  //defining the full list of standard parameters
  constructor(options) {
    const defaultOptions = {
      target: false,
      devices: "desktop,mobile,tablet",
      selectors: {
        slides: false,
        slidesContainer: '[qc-slider="content-parent"]',
        swipeArea: false,
        paginationContainer: false,
        markers: false,
        markersActiveClass: ".active",
        leftArrow: '[qc-slider="left-arrow"]',
        rightArrow: '[qc-slider="right-arrow"]',
      },
      animation: {
        delay: 0,
        duration: 0.2,
        ease: "power1.inOut",
      },
      behavior: {
        swipe: false,
        pagination: false,
        infinity: false,
      },
      onStart: false,
      onComplete: false,
      usePreset: false,
      useCustom: false,
    };

    //impose user parameters on the default ones
    this.options = {
      ...defaultOptions,
      ...options,
      selectors: {
        ...defaultOptions.selectors,
        ...options.selectors,
      },
      animation: {
        ...defaultOptions.animation,
        ...options.animation,
      },
      behavior: {
        ...defaultOptions.behavior,
        ...options.behavior,
      },
    };

    //checking the current device to trigger initialization
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

  /**************************************
   *           SLIDER MODULE            *
   **************************************/

  async init() {
    //behavior variables
    const sliderSwipe = this.options.behavior.swipe;
    const sliderInfinity = this.options.behavior.infinity;
    const sliderPagination = this.options.behavior.pagination;

    //selectors variables
    const slider = document.querySelector(`${this.options.target}`);

    const sliderContentParent = slider.querySelector(
      `${this.options.selectors.slidesContainer}`
    );

    const sliderContentElements =
      slider.querySelectorAll(`${this.options.selectors.slides}`).length > 0
        ? slider.querySelectorAll(`${this.options.selectors.slides}`)
        : sliderContentParent.children;

    const sliderLeftArrow = slider.querySelector(
      `${this.options.selectors.leftArrow}`
    );
    const sliderRightArrow = slider.querySelector(
      `${this.options.selectors.rightArrow}`
    );

    const sliderPaginationParent = sliderPagination
      ? slider.querySelector(`${this.options.selectors.paginationContainer}`)
      : null;

    let sliderPaginationMarkers = sliderPagination
      ? slider.querySelector(`${this.options.selectors.markers}`) ||
        sliderPaginationParent?.querySelector(":scope > *")
      : null;

    const sliderPaginationActiveClass = sliderPagination
      ? this.options.selectors.markersActiveClass.slice(1)
      : null;

    const swipeTarget = sliderSwipe
      ? slider.querySelector(`${this.options.selectors.swipeArea}`) ||
        sliderContentParent.parentNode
      : null;

    //animation variables
    const sliderDuration = this.options.animation.duration;
    const sliderDelay = this.options.animation.delay;
    const sliderEase = this.options.animation.ease;

    //callbacks and functions
    const useCustom = this.options.useCustom;
    const usePreset = this.options.usePreset;
    const onStart = this.options.onStart;
    const onComplete = this.options.onComplete;

    //additional variables
    const totalSlides = sliderContentElements.length;
    let sliderWatcher = 0;
    let sliderSafety = true;
    const distance = -(
      sliderContentElements[0].offsetWidth +
      parseInt(getComputedStyle(sliderContentElements[0], true).marginRight)
    );

    //slider pagination setup
    if (sliderPagination) {
      if (totalSlides <= 1) {
        gsap.set(sliderPaginationParent, {
          opacity: 0,
          pointerEvents: "none",
        });
      } else {
        for (let b = 1; b < totalSlides; b++) {
          let copy = sliderPaginationMarkers.cloneNode(false);
          sliderPaginationParent.append(copy);
        }
        sliderPaginationMarkers.classList.add(sliderPaginationActiveClass);
        sliderPaginationMarkers =
          sliderPaginationParent.querySelectorAll(":scope > *");
      }
    }

    //slider preset setup
    if (!useCustom) {
      for (let b = 1; b < totalSlides; b++) {
        if (usePreset == "classic.opacity")
          gsap.set(sliderContentElements[b], {
            opacity: 0.4,
          });
      }
    }

    //assigning attributes for quick access to slides
    const quickIndex = (startIndex) => {
      startIndex = startIndex % totalSlides;
      for (let i = 0; i < totalSlides; i++) {
        const currentBlock =
          sliderContentElements[(startIndex + i) % totalSlides];
        currentBlock.setAttribute("quick-index", i);
      }
    };

    //main animation function
    const unifiedAnimation = (step, direction) => {
      sliderWatcher += step;
      quickIndex(sliderWatcher);

      //slides management
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

      //an object for accessing slides and other content from outside
      const qcApi = {
        get currentSlide() {
          return currentSlide;
        },
        get previousSlide() {
          return previousSlide;
        },
        get nextSlide() {
          return nextSlide;
        },
        get previousSlide2() {
          return previousSlide2;
        },
        get nextSlide2() {
          return nextSlide2;
        },
        get direction() {
          return direction;
        },
      };

      //slider switching
      if (!useCustom) {
        if (usePreset == "classic.opacity") {
          gsap.to(sliderContentParent, {
            delay: sliderDelay,
            ease: sliderEase,
            duration: sliderDuration,
            x: sliderWatcher * distance,
          });

          gsap.to(currentSlide, {
            overwrite: true,
            delay: sliderDelay,
            ease: "power1.inOut",
            duration: sliderDuration,
            opacity: 1,
          });

          gsap.to(previousSlide, {
            overwrite: true,
            delay: sliderDelay,
            ease: "power1.inOut",
            duration: sliderDuration,
            opacity: 0.4,
            onStart: onStart ? onStart({ qcApi }) : null,
            onComplete: onComplete ? onComplete({ qcApi }) : null,
          });
        } else {
          gsap.to(sliderContentParent, {
            delay: sliderDelay,
            ease: sliderEase,
            duration: sliderDuration,
            x: sliderWatcher * distance,
            onStart: onStart ? onStart({ qcApi }) : null,
            onComplete: onComplete ? onComplete({ qcApi }) : null,
          });
        }
      } else {
        useCustom({ qcApi });
      }

      //switching pagination
      if (sliderPagination) {
        sliderPaginationMarkers[sliderWatcher].classList.add(
          sliderPaginationActiveClass
        );
        sliderPaginationMarkers[sliderWatcher - step].classList.remove(
          sliderPaginationActiveClass
        );
      }
    };

    //arrow events
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

    //swipe events
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

    if (sliderSwipe == true) {
      const { swipe } = await import("../core/swipeEvent.js");

      swipe(swipeTarget, {
        maxTime: 2000,
        minTime: 10,
        maxDist: 2000,
        minDist: 10,
      });

      swipeTarget.addEventListener("swipe", (e) => {
        startSwipe(e);
      });
    }
  }
}
