import { getDeviceType } from "../utils/devices.js";

export class Accordion {
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
    const fontSize = parseFloat(
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
