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
        const { Slider } = await Promise.resolve().then(function () { return slider; });
        new Slider(this.options);
        break;
      }

      case "accordion": {
        const { Accordion } = await Promise.resolve().then(function () { return accordion; });
        new Accordion(this.options);
        break;
      }

      case "settings": {
        if (this.options.tabletMax && this.options.mobileMax) {
          console.log(this.options.mobileMax, this.options.tabletMax);

          const { setDeviceType } = await Promise.resolve().then(function () { return devices; });
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

let mobileMaxMain = 480;
let tabletMaxMain = 992;

function getDeviceType() {
  const width = window.innerWidth || screen.width;

  if (width <= mobileMaxMain) {
    return "mobile";
  } else if (width <= tabletMaxMain) {
    return "tablet";
  } else {
    return "desktop";
  }
}

function setDeviceType(mobileMax, tabletMax) {
  mobileMaxMain = mobileMax;
  tabletMaxMain = tabletMax;
}

var devices = /*#__PURE__*/Object.freeze({
  __proto__: null,
  getDeviceType: getDeviceType,
  setDeviceType: setDeviceType
});

class Slider {
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
      {
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
      {
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
      const { swipe } = await Promise.resolve().then(function () { return swipeEvent; });

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

var slider = /*#__PURE__*/Object.freeze({
  __proto__: null,
  Slider: Slider
});

class Accordion {
  //defining the full list of standard parameters
  constructor(options) {
    const defaultOptions = {
      target: false,
      devices: "desktop,mobile,tablet",
      selectors: {
        panels: false,
        header: false,
        content: false,
      },
      animation: {
        delayStart: 0,
        delayComplete: 0,
        durationStart: 0.8,
        durationComplete: 0.8,
        easeStart: "power1.inOut",
        easeComplete: "power2.out",
      },
      behavior: {
        initialPanel: false,
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
   *           ACCORDION MODULE         *
   **************************************/

  init() {
    //behavior variables
    const initialPanel = this.options.behavior.initialPanel;

    //selectors variables
    const accMainBlock = document.querySelector(`${this.options.target}`);
    const accArrPanels =
      accMainBlock.querySelectorAll(`${this.options.selectors.panels}`).length >
      0
        ? accMainBlock.querySelectorAll(`${this.options.selectors.panels}`)
        : accMainBlock.querySelectorAll(":scope > *");

    //animation variables
    const accDurationStart = this.options.animation.durationStart;
    const accDelayStart = this.options.animation.delayStart;
    const accEaseStart = this.options.animation.easeStart;

    const accDurationComplete = this.options.animation.durationComplete;
    const accDelayComplete = this.options.animation.delayComplete;
    const accEaseComplete = this.options.animation.easeComplete;

    //callbacks and functions
    const useCustom = this.options.useCustom;
    const usePreset = this.options.usePreset;
    const onStart = this.options.onStart;
    const onComplete = this.options.onComplete;

    //additional variables
    parseFloat(
      window.getComputedStyle(document.querySelector("html")).fontSize
    );

    let prevAccIndex = null;
    let accPanelPrev = null;

    accArrPanels.forEach((accPanel, index) => {
      //internal selectors for each panel target
      const accTop =
        accPanel.querySelector(`${this.options.selectors.header}`) ||
        accPanel.querySelector(":scope > *");

      if (accTop) {
        //height constants for open and closed states
        const startHeight = accTop.offsetHeight;
        const contentHeight = accPanel.scrollHeight;

        //pre-configuring panels
        gsap.set(accPanel, {
          height: `${startHeight}px`,
        });
        gsap.set(accPanel, {
          overflow: "hidden",
        });
        gsap.set(accTop, {
          cursor: "pointer",
        });

        //opening the panel
        const openPanel = (accCurrentPanel) => {
          //an individual object for external interaction
          const qcApi = {
            get currentPanel() {
              return accCurrentPanel;
            },
            get previousPanel() {
              return accPanelPrev;
            },
            get event() {
              return "open";
            },
          };

          if (!useCustom) {
            if (usePreset == "classic" || !usePreset) {
              const accBottom =
                accCurrentPanel.querySelector(
                  `${this.options.selectors.content}`
                ) || accCurrentPanel.querySelectorAll(":scope > *")[1];

              gsap.to(accCurrentPanel, {
                delay: accDelayStart,
                duration: accDurationStart,
                ease: accEaseStart,
                height: `${contentHeight}px`,
              });

              gsap.fromTo(
                accBottom,
                {
                  y: "1rem",
                  opacity: 0,
                },
                {
                  delay: accDelayStart,
                  y: "0rem",
                  opacity: 1,
                  duration: accDurationStart / 2,
                  ease: "power1.out",
                  onStart: onStart ? onStart({ qcApi }) : null,
                }
              );
            }
          } else {
            useCustom({ qcApi });
          }
        };

        //closing the panel
        const closePanel = (accCurrentPanel) => {
          //an individual object for external interaction
          const qcApi = {
            get currentPanel() {
              return accCurrentPanel;
            },
            get previousPanel() {
              return accPanelPrev;
            },
            get event() {
              return "close";
            },
          };

          if (!useCustom) {
            if (usePreset == "classic" || !usePreset) {
              const accBottom =
                accCurrentPanel.querySelector(
                  `${this.options.selectors.content}`
                ) || accCurrentPanel.querySelectorAll(":scope > *")[1];

              gsap.to(accCurrentPanel, {
                delay: accDelayComplete,
                duration: accDurationComplete,
                ease: accEaseComplete,
                height: `${startHeight}px`,
              });

              gsap.to(
                accBottom,
                {
                  delay: accDelayComplete,
                  y: "1rem",
                  opacity: 0,
                  duration: accDurationComplete / 2,
                  ease: "power1.out",
                  onStart: onComplete ? onComplete({ qcApi }) : null,
                },
                "<"
              );
            }
          } else {
            useCustom({ qcApi });
          }
        };

        //listening to the interaction
        accTop.addEventListener("click", () => {
          //the previous panel is equal to the current one (close current panel)
          if (prevAccIndex === index) {
            closePanel(accPanel);
            prevAccIndex = null;

            //the previous panel is missing (open current panel)
          } else if (prevAccIndex === null) {
            openPanel(accPanel);
            prevAccIndex = index;

            //the previous panel exists and differs from the current one (сlose previous panel & open current)
          } else {
            closePanel(accPanelPrev);
            openPanel(accPanel);
            prevAccIndex = index;
          }
          accPanelPrev = accArrPanels[prevAccIndex];
        });

        //pre-opening of the initial panel
        if (index === initialPanel) {
          openPanel(accPanel);
          prevAccIndex = index;
          accPanelPrev = accArrPanels[prevAccIndex];
        }
      }
    });
  }
}

var accordion = /*#__PURE__*/Object.freeze({
  __proto__: null,
  Accordion: Accordion
});

/**
 * Object.assign() polyfill
 */
Object.assign ||
  Object.defineProperty(Object, "assign", {
    enumerable: false,
    configurable: true,
    writable: true,
    value: function (a, b) {
      if (undefined === a || null === a)
        throw new TypeError("Cannot convert first argument to object");
      for (var c = Object(a), d = 1; d < arguments.length; d++) {
        var e = arguments[d];
        if (undefined !== e && null !== e)
          for (
            var f = Object.keys(Object(e)), g = 0, h = f.length;
            g < h;
            g++
          ) {
            var i = f[g],
              j = Object.getOwnPropertyDescriptor(e, i);
            undefined !== j && j.enumerable && (c[i] = e[i]);
          }
      }
      return c;
    },
  });

/**
 * CustomEvent() polyfill
 */
!(function () {
  if ("function" == typeof window.CustomEvent) return;
  function t(t, e) {
    e = e || { bubbles: false, cancelable: false, detail: undefined };
    var n = document.createEvent("CustomEvent");
    return n.initCustomEvent(t, e.bubbles, e.cancelable, e.detail), n;
  }
  (t.prototype = window.Event.prototype), (window.CustomEvent = t);
})();

/*
 * Функция определения события swipe на элементе.
 * @param {Object} el - элемент DOM.
 * @param {Object} settings - объект с предварительными настройками.
 */
let swipe = function (el, settings) {
  // настройки по умолчанию
  var settings = Object.assign(
    {},
    {
      minDist: 60, // минимальная дистанция, которую должен пройти указатель, чтобы жест считался как свайп (px)
      maxDist: 120, // максимальная дистанция, не превышая которую может пройти указатель, чтобы жест считался как свайп (px)
      maxTime: 700, // максимальное время, за которое должен быть совершен свайп (ms)
      minTime: 5, // минимальное время, за которое должен быть совершен свайп (ms)
    },
    settings
  );

  // коррекция времени при ошибочных значениях
  if (settings.maxTime < settings.minTime)
    settings.maxTime = settings.minTime + 500;
  if (settings.maxTime < 100 || settings.minTime < 5) {
    settings.maxTime = 100;
    settings.minTime = 5;
  }

  var dir, // направление свайпа (horizontal, vertical)
    swipeType, // тип свайпа (up, down, left, right)
    dist, // дистанция, пройденная указателем
    isMouse = false, // поддержка мыши (не используется для тач-событий)
    isMouseDown = false, // указание на активное нажатие мыши (не используется для тач-событий)
    startX = 0, // начало координат по оси X (pageX)
    distX = 0, // дистанция, пройденная указателем по оси X
    startY = 0, // начало координат по оси Y (pageY)
    distY = 0, // дистанция, пройденная указателем по оси Y
    startTime = 0, // время начала касания
    swipeFired = false, // флаг для предотвращения повторного срабатывания события свайпа
    support = {
      // поддерживаемые браузером типы событий
      pointer: !!(
        "PointerEvent" in window || "msPointerEnabled" in window.navigator
      ),
      touch: !!("ontouchstart" in window || navigator.maxTouchPoints),
    };

  /*
   * Определение доступных в браузере событий: pointer, touch и mouse.
   * @returns {Object} - возвращает объект с доступными событиями.
   */
  var getSupportedEvents = function () {
    if (support.pointer) {
      return {
        type: "pointer",
        start: "pointerdown",
        move: "pointermove",
        end: "pointerup",
        cancel: "pointercancel",
        leave: "pointerleave",
      };
    } else if (support.touch) {
      return {
        type: "touch",
        start: "touchstart",
        move: "touchmove",
        end: "touchend",
        cancel: "touchcancel",
      };
    } else {
      return {
        type: "mouse",
        start: "mousedown",
        move: "mousemove",
        end: "mouseup",
        leave: "mouseleave",
      };
    }
  };

  /*
   * Объединение событий mouse/pointer и touch.
   * @param e {Event} - принимает в качестве аргумента событие.
   * @returns {TouchList|Event} - возвращает либо TouchList, либо оставляет событие без изменения.
   */
  var eventsUnify = function (e) {
    return e.changedTouches ? e.changedTouches[0] : e;
  };

  /*
   * Обрабочик начала касания указателем.
   * @param e {Event} - получает событие.
   */
  var checkStart = function (e) {
    var event = eventsUnify(e);
    if (
      support.touch &&
      typeof e.touches !== "undefined" &&
      e.touches.length !== 1
    )
      return; // игнорирование касания несколькими пальцами
    dir = "none";
    swipeType = "none";
    dist = 0;
    startX = event.pageX;
    startY = event.pageY;
    startTime = new Date().getTime();
    swipeFired = false;
    if (isMouse) isMouseDown = true; // поддержка мыши
  };

  /*
   * Обработчик движения указателя.
   * @param e {Event} - получает событие.
   */
  var checkMove = function (e) {
    if (isMouse && !isMouseDown) return; // выход из функции, если мышь перестала быть активна во время движения
    var event = eventsUnify(e);
    distX = event.pageX - startX;
    distY = event.pageY - startY;
    if (Math.abs(distX) > Math.abs(distY)) dir = distX < 0 ? "left" : "right";
    else dir = distY < 0 ? "up" : "down";
  };

  /*
   * Обработчик окончания касания указателем.
   * @param e {Event} - получает событие.
   */
  var checkEnd = function (e) {
    if (isMouse && !isMouseDown) {
      // выход из функции и сброс проверки нажатия мыши
      isMouseDown = false;
      return;
    }
    var endTime = new Date().getTime();
    var time = endTime - startTime;
    if (time >= settings.minTime && time <= settings.maxTime) {
      // проверка времени жеста
      if (
        Math.abs(distX) >= settings.minDist &&
        Math.abs(distY) <= settings.maxDist
      ) {
        swipeType = dir; // опредление типа свайпа как "left" или "right"
      } else if (
        Math.abs(distY) >= settings.minDist &&
        Math.abs(distX) <= settings.maxDist
      ) {
        swipeType = dir; // опредление типа свайпа как "top" или "down"
      }
    }
    dist =
      dir === "left" || dir === "right" ? Math.abs(distX) : Math.abs(distY); // опредление пройденной указателем дистанции

    // генерация кастомного события swipe
    if (!swipeFired && swipeType !== "none" && dist >= settings.minDist) {
      swipeFired = true; // предотвратить повторное срабатывание
      var swipeEvent = new CustomEvent("swipe", {
        bubbles: true,
        cancelable: true,
        detail: {
          full: e, // полное событие Event
          dir: swipeType, // направление свайпа
          dist: dist, // дистанция свайпа
          time: time, // время, потраченное на свайп
        },
      });
      el.dispatchEvent(swipeEvent);
    }
  };

  // добавление поддерживаемых событий
  var events = getSupportedEvents();

  // проверка наличия мыши
  if ((support.pointer && !support.touch) || events.type === "mouse")
    isMouse = true;

  // добавление обработчиков на элемент
  el.addEventListener(events.start, checkStart);
  el.addEventListener(events.move, checkMove);
  el.addEventListener(events.end, checkEnd);
  if (support.pointer && support.touch) {
    el.addEventListener("lostpointercapture", checkEnd);
  }
};

var swipeEvent = /*#__PURE__*/Object.freeze({
  __proto__: null,
  swipe: swipe
});
