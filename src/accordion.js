import { getDeviceType } from "./devices.js";
import { gsap } from "gsap";

export class Accordion {
  constructor(selector, options) {
    console.log(
      `Accordion initialized with selector: ${selector} and options:`,
      options
    );

    const defaultOptions = {
      //content: "[accordion-content-parent]",
      elements: false,
      target: false,
      hidden: false,
      devices: "desktop,mobile,tablet",
      duration: 500,
      onStart: false,
      onComplete: false,
    };

    this.acc = selector;
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
    const accMainBlock = document.querySelector(`${this.acc}`);

    const accArr =
      accMainBlock.querySelectorAll(`${this.options.elements}`).length > 0
        ? accMainBlock.querySelectorAll(`${this.options.elements}`)
        : accMainBlock.querySelectorAll(":scope > *");

    const fontSize = parseFloat(
      window.getComputedStyle(document.querySelector("html")).fontSize
    );

    const accCustomStart = this.options.onStart;
    const accCustomComplete = this.options.onComplete;

    let prevAccIndex = null;

    accArr.forEach((acc, index) => {
      const accTop =
        acc.querySelector(`${this.options.target}`) ||
        acc.querySelector(":scope > *");

      const accBottom =
        acc.querySelector(`${this.options.hidden}`) ||
        acc.querySelectorAll(":scope > *")[1];

      let startHeight = null;

      if (accTop) {
        const accTopHeight = accTop.offsetHeight;
        startHeight = accTopHeight / fontSize;
        gsap.set(acc, {
          height: `${startHeight}rem`,
        });
        gsap.set(acc, {
          overflow: "hidden",
        });
        gsap.set(accTop, {
          cursor: "pointer",
        });
      }

      const contentHeight = acc.scrollHeight / fontSize;

      const openTl = gsap.timeline({
        overwrite: true,
        paused: true,
        defaults: { duration: 0.82, ease: "power1.inOut" },
      });

      openTl.to(acc, {
        duration: 0.8,
        height: `${contentHeight}rem`,
      });

      openTl.fromTo(
        accBottom,
        {
          y: "1rem",
          opacity: 0,
        },
        {
          y: "0rem",
          opacity: 1,
          duration: 0.4,
          ease: "power1.out",
          onStart: () => {
            if (accCustomStart) {
              accCustomStart({ acc });
            }
          },
        },
        "<"
      );

      const closeTl = gsap.timeline({
        overwrite: true,
        paused: true,
        defaults: { duration: 0.82, ease: "power2.out" },
      });

      closeTl.to(acc, {
        duration: 0.8,
        height: `${startHeight}rem`,
      });

      closeTl.to(
        accBottom,
        {
          y: "1rem",
          opacity: 0,
          duration: 0.4,
          ease: "power1.out",
          onStart: () => {
            if (accCustomComplete) {
              accCustomComplete({ acc });
            }
          },
        },
        "<"
      );

      accTop.addEventListener("click", () => {
        if (prevAccIndex === index) {
          closeTl.restart();
          prevAccIndex = null;
        } else {
          if (prevAccIndex !== null) {
            const prevAcc = accArr[prevAccIndex];

            const accTopPrev =
              prevAcc.querySelector(`${this.options.target}`) ||
              prevAcc.querySelector(":scope > *");

            const accBottomPrev =
              prevAcc.querySelector(`${this.options.hidden}`) ||
              prevAcc.querySelectorAll(":scope > *")[1];

            const startHeightPrev = accTopPrev.offsetHeight / fontSize;
            const prevAccCloseTl = gsap.timeline({
              overwrite: true,
              paused: true,
              defaults: { duration: 0.82, ease: "power2.out" },
            });

            prevAccCloseTl.to(prevAcc, {
              duration: 0.8,
              height: `${startHeightPrev}rem`,
            });

            prevAccCloseTl.to(
              accBottomPrev,
              {
                y: "1rem",
                opacity: 0,
                duration: 0.4,
                ease: "power1.out",
                onStart: () => {
                  if (accCustomComplete) {
                    accCustomComplete({ prevAcc });
                  }
                },
              },
              "<"
            );

            prevAccCloseTl.restart();
          }

          openTl.restart();
          prevAccIndex = index;
        }
      });
      if (index === 0) {
        openTl.restart();
        prevAccIndex = 0;
      }
    });
  }
}
