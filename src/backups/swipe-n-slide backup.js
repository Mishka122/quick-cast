let slideSwipeWatcher = 1;
const initialUnified = () => {
  const wrappers = document.querySelectorAll("[slide], [swipe]");

  if (wrappers.length == 0) return;

  for (let a = 0; a < wrappers.length; a++) {
    const wrapper = wrappers[a];
    const slideDevices = wrapper.getAttribute("slide-devices") || "desktop";
    const swipeDevices =
      wrapper.getAttribute("swipe-devices") || "mobile,tablet";

    const isSlideActive =
      slideDevices &&
      isDeviceMatch(slideDevices) &&
      wrapper.hasAttribute("slide");
    const isSwipeActive =
      swipeDevices &&
      isDeviceMatch(swipeDevices) &&
      wrapper.hasAttribute("swipe");

    if (!isSlideActive && !isSwipeActive) continue;

    const contentParent = wrapper.querySelector(
      "[slide-content-parent], [swipe-content-parent]"
    );
    if (!contentParent) continue;

    const blocks = contentParent.childNodes;
    const totalSlides = blocks.length;
    const paginationWrapper = wrapper.querySelector("[pagination]");
    let paginationBlocks = paginationWrapper?.firstChild;
    const paginationActiveClass =
      paginationBlocks?.getAttribute("pagination-active-class") ||
      "pagination__block--active";
    const leftArrow = wrapper.querySelector("[pagination-arrow-left]");
    const rightArrow = wrapper.querySelector("[pagination-arrow-right]");

    const slideDuration = wrapper.hasAttribute("slide-duration")
      ? parseFloat(wrapper.getAttribute("slide-duration"))
      : 1.2;
    const swipeDuration = wrapper.hasAttribute("swipe-duration")
      ? parseFloat(wrapper.getAttribute("swipe-duration"))
      : 0.5;

    const slideCustom = wrapper.hasAttribute("slide-custom")
      ? parseFloat(wrapper.getAttribute("slide-custom"))
      : false;
    const swipeCustom = wrapper.hasAttribute("swipe-custom")
      ? parseFloat(wrapper.getAttribute("swipe-custom"))
      : false;

    const swipeTag = wrapper.hasAttribute("swipe-tag")
      ? wrapper.getAttribute("swipe-tag")
      : false;

    const slideInfiniti = wrapper.hasAttribute("slide-infiniti");
    const swipeInfiniti = wrapper.hasAttribute("swipe-infiniti");

    const distance = -(
      blocks[0].offsetWidth +
      parseInt(getComputedStyle(blocks[0], true).marginRight)
    );

    if (paginationWrapper) {
      if (blocks.length <= 1) {
        gsap.set(paginationWrapper, {
          opacity: "0%",
        });
      } else {
        for (let b = 1; b < blocks.length; b++) {
          let copy = paginationBlocks.cloneNode(false);
          paginationWrapper.append(copy);
          if (!swipeCustom && !slideCustom) {
            gsap.set(blocks[b], {
              opacity: 0.4,
            });
          }
        }
        paginationBlocks.classList.add(paginationActiveClass);
        paginationBlocks = paginationWrapper.querySelectorAll(":scope > *");
      }
    }
    let watcher = 0;

    const quickIndex = (startIndex) => {
      const totalBlocks = blocks.length;
      startIndex = startIndex % totalBlocks;
      for (let i = 0; i < totalBlocks; i++) {
        const currentBlock = blocks[(startIndex + i) % totalBlocks];
        currentBlock.setAttribute("quick-index", i);
      }
    };

    const unifiedAnimation = (step, direction) => {
      watcher += step;
      quickIndex(watcher);

      const currentSlide = contentParent.querySelector(`[quick-index="${0}"]`);

      const previousSlide =
        direction > 0
          ? contentParent.querySelector(`[quick-index="${totalSlides - 1}"]`)
          : contentParent.querySelector(`[quick-index="${1}"]`);

      const nextSlide =
        direction > 0
          ? contentParent.querySelector(`[quick-index="${1}"]`)
          : contentParent.querySelector(`[quick-index="${totalSlides - 1}"]`);

      const previouslide2 =
        direction > 0
          ? contentParent.querySelector(`[quick-index="${totalSlides - 2}"]`)
          : contentParent.querySelector(`[quick-index="${2}"]`);

      const nextSlide2 =
        direction > 0
          ? contentParent.querySelector(`[quick-index="${2}"]`)
          : contentParent.querySelector(`[quick-index="${totalSlides - 2}"]`);

      if ((isSlideActive && !slideCustom) || (isSwipeActive && !swipeCustom)) {
        gsap.to(contentParent, {
          duration: isSlideActive ? slideDuration : swipeDuration,
          ease: isSlideActive ? "power1.out" : "power1.out",
          x: watcher * distance,
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
      } else if (isSlideActive && slideCustom == 1) {
        slideSwipeWatcher = 0;
        /*
        const currentSlide = blocks[watcher];
        const previouslide = blocks[watcher - step];
        const nextSlide = blocks[watcher + step];
        const previouslide2 =
          step > 0 ? blocks[watcher - step - 1] : blocks[watcher - step + 1];
        */
        gsap.fromTo(
          previousSlide,
          {
            scale: 1,
            x: "0%",
          },
          {
            ease: "power2.out",
            duration: 0.6,
            x: direction > 0 ? "-22%" : "22%",
            scale: 0.59,
          }
        );
        gsap.fromTo(
          previousSlide,
          {
            opacity: 1,
          },
          {
            ease: "power1.out",
            duration: 0.5,
            opacity: 0.5,
          }
        );

        gsap.set(previousSlide, {
          zIndex: 1,
        });
        gsap.set(currentSlide, {
          zIndex: 2,
        });

        gsap.fromTo(
          currentSlide,
          {
            opacity: 0.5,
          },
          {
            ease: "power1.out",
            duration: 0.2,
            opacity: 1,
          }
        );

        gsap.fromTo(
          currentSlide,
          {
            x: direction > 0 ? "22%" : "-22%",
            scale: 0.59,
          },
          {
            ease: "power2.out",
            duration: 1.1,
            x: "0%",
            scale: 1,
            onComplete: () => {
              slideSwipeWatcher = 1;
            },
          }
        );

        gsap.set(nextSlide, {
          zIndex: 1,
        });
        gsap.set(nextSlide, {
          x: direction > 0 ? "22%" : "-22%",
        });
        gsap.fromTo(
          nextSlide,
          {
            scale: 0.3,
            opacity: 0,
          },
          {
            ease: "power1.out",
            duration: 0.75,
            scale: 0.59,
            opacity: 0.5,
          }
        );

        gsap.set(previouslide2, {
          zIndex: 0,
        });
        gsap.set(previouslide2, {
          x: direction > 0 ? "-22%" : "22%",
        });
        gsap.fromTo(
          previouslide2,
          {
            scale: 0.59,
            opacity: 0.5,
          },
          {
            ease: "power1.out",
            duration: 0.75,
            scale: 0.3,
            opacity: 0,
          }
        );
      } else if (isSwipeActive && swipeCustom == 1) {
        slideSwipeWatcher = 0;

        gsap.fromTo(
          previousSlide,
          {
            scale: 1,
            x: "0%",
          },
          {
            ease: "power1.out",
            duration: 0.6,
            x: direction > 0 ? "-80%" : "80%",
            scale: 0.8,
            onComplete: () => {
              slideSwipeWatcher = 1;
            },
          }
        );
        gsap.fromTo(
          previousSlide,
          {
            opacity: 1,
          },
          {
            ease: "power1.out",
            duration: 0.5,
            opacity: 0.5,
          }
        );

        gsap.fromTo(
          currentSlide,
          {
            opacity: 0.5,
          },
          {
            ease: "power1.out",
            duration: 0.2,
            opacity: 1,
          }
        );
        gsap.fromTo(
          currentSlide,
          {
            x: direction > 0 ? "80%" : "-80%",
            scale: 0.8,
          },
          {
            ease: "power2.out",
            duration: 1,
            x: "0%",
            scale: 1,
          }
        );

        gsap.set(previousSlide, {
          zIndex: 1,
        });
        gsap.set(currentSlide, {
          zIndex: 2,
        });

        gsap.fromTo(
          previouslide2,
          {
            x: direction > 0 ? "-80%" : "80%",
            opacity: 0.5,
            scale: 0.8,
          },
          {
            ease: "power1.out",
            duration: 0.75,
            x: direction > 0 ? "-100%" : "100%",
            opacity: 0,
            scale: 0.8,
          }
        );

        gsap.fromTo(
          nextSlide,
          { opacity: 0 },
          { ease: "power1.out", duration: 0.2, opacity: 0.5 }
        );
        gsap.fromTo(
          nextSlide,
          {
            x: direction > 0 ? "100%" : "-100%",
            scale: 0.8,
          },
          {
            ease: "power1.out",
            duration: 1,
            x: direction > 0 ? "80%" : "-80%",
            scale: 0.8,
          }
        );

        gsap.set(nextSlide, {
          zIndex: 1,
        });
        gsap.set(previouslide2, {
          zIndex: 0,
        });
      } else if (isSwipeActive && swipeCustom == 2) {
        slideSwipeWatcher = 0;

        if (swipeTag === "cards") {
          if (direction > 0) {
            tariffsMobileIndex = 2;
            tariffsCardsMobileIndex = 2;
          } else {
            tariffsMobileIndex = 1;
            tariffsCardsMobileIndex = 1;
          }
        }

        gsap.fromTo(
          previousSlide,
          {
            scale: 1.02,
            x: "0%",
          },
          {
            ease: "power1.out",
            duration: 0.64,
            x: direction > 0 ? "-56%" : "56%",
            scale: 0.6,
            onComplete: () => {
              slideSwipeWatcher = 1;
            },
          }
        );

        gsap.fromTo(
          currentSlide,
          {
            x: direction > 0 ? "56%" : "-56%",
            scale: 0.6,
          },
          {
            ease: "power2.out",
            duration: 1,
            x: "0%",
            scale: 1.02,
          }
        );
      }

      if (paginationWrapper) {
        paginationBlocks[watcher].classList.add(paginationActiveClass);
        paginationBlocks[watcher - step].classList.remove(
          paginationActiveClass
        );
      }
    };

    /*
    if (slideCustom) {
      unifiedAnimation(Math.floor(blocks.length / 2));
      console.log(Math.floor(blocks.length / 2))
    }
    */

    function handleArrowClick(direction) {
      if (slideSwipeWatcher == 1) {
        if (direction === 1) {
          if (watcher < blocks.length - 1) {
            unifiedAnimation(1, direction);
          } else if (slideInfiniti) {
            // Loop back to the first slide
            unifiedAnimation(-watcher, direction);
          }
        } else if (direction === -1) {
          if (watcher > 0) {
            unifiedAnimation(-1, direction);
          } else if (slideInfiniti) {
            // Loop to the last slide
            unifiedAnimation(blocks.length - 1 - watcher, direction);
          }
        }
      }
    }

    if (isSlideActive) {
      if (rightArrow) {
        rightArrow.addEventListener("click", () => handleArrowClick(1));
      }

      if (leftArrow) {
        leftArrow.addEventListener("click", () => handleArrowClick(-1));
      }
      if (paginationWrapper) {
        paginationBlocks.forEach((block, index) => {
          block.addEventListener("click", () => {
            const step = index - watcher;
            if (step !== 0) unifiedAnimation(step);
          });
        });
      }
    }

    if (isSwipeActive) {
      const swipeTarget = wrapper.querySelector("[swipe-target]")
        ? wrapper.querySelector("[swipe-target]")
        : contentParent.parentNode;

      const startSwipe = (event) => {
        if (slideSwipeWatcher == 1) {
          if (event.detail.dir == "left") {
            if (watcher < blocks.length - 1) {
              unifiedAnimation(1, 1);
            } else if (swipeInfiniti) {
              // Loop back to the first slide
              unifiedAnimation(-watcher, 1);
            }
          } else if (event.detail.dir == "right") {
            if (watcher > 0) {
              unifiedAnimation(-1, -1);
            } else if (swipeInfiniti) {
              // Loop to the last slide
              unifiedAnimation(blocks.length - 1 - watcher, -1);
            }
          }
        }
      };

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
};

const isDeviceMatch = (deviceString) => {
  const devices = deviceString.split(",");
  return (
    (devices.includes("mobile") && isMobileActive()) ||
    (devices.includes("tablet") && isMobileActive()) ||
    (devices.includes("desktop") && !isMobileActive())
  );
};

initialUnified();
