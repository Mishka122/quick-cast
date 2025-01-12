document.addEventListener("DOMContentLoaded", () => {
  const tabArr = document.querySelectorAll(".metals__list-item");
  const fontSize = parseFloat(
    window.getComputedStyle(document.querySelector("html")).fontSize
  );

  let prevTabIndex = null;

  tabArr.forEach((tab, index) => {
    const tabTop = tab.querySelector(".metals__item-head");
    let startHeight = null;

    if (tabTop) {
      const tabTopHeight = tabTop.offsetHeight;
      startHeight = tabTopHeight / fontSize;
      gsap.set(tab, {
        maxHeight: `${startHeight}rem`,
      });
    }

    const contentHeight = tab.scrollHeight / fontSize;

    const openTl = gsap.timeline({
      overwrite: true,
      paused: true,
      defaults: { duration: 0.82, ease: "power1.inOut" },
    });

    openTl.to(tab, {
      duration: 0.8,
      maxHeight: `${contentHeight}rem`,
    });

    openTl.fromTo(
      tab.querySelector(".metals__item-bottom"),
      {
        y: "1rem",
        opacity: 0,
      },
      {
        y: "0rem",
        opacity: 1,
        duration: 0.4,
        ease: "power1.out",
      },
      "<"
    );
    openTl.fromTo(
      tab.querySelector(".metals__control-svg"),
      {
        rotate: 0,
      },
      {
        duration: 0.4,
        rotate: 180,
      },
      "<"
    );

    const closeTl = gsap.timeline({
      overwrite: true,
      paused: true,
      defaults: { duration: 0.82, ease: "power2.out" },
    });

    closeTl.to(tab, {
      duration: 0.8,
      maxHeight: `${startHeight}rem`,
    });

    closeTl.to(
      tab.querySelector(".metals__item-bottom"),
      {
        y: "1rem",
        opacity: 0,
        duration: 0.4,
        ease: "power1.out",
      },
      "<"
    );
    closeTl.to(
      tab.querySelector(".metals__control-svg"),
      {
        duration: 0.4,
        rotate: 0,
      },
      "<"
    );

    tabTop.addEventListener("click", () => {
      if (prevTabIndex === index) {
        closeTl.restart();
        prevTabIndex = null;
      } else {
        if (prevTabIndex !== null) {
          const prevTab = tabArr[prevTabIndex];
          const tabTopPrev = prevTab.querySelector(".metals__item-head");
          const startHeightPrev = tabTopPrev.offsetHeight / fontSize;
          const prevTabCloseTl = gsap.timeline({
            overwrite: true,
            paused: true,
            defaults: { duration: 0.82, ease: "power2.out" },
          });

          prevTabCloseTl.to(prevTab, {
            duration: 0.8,
            maxHeight: `${startHeightPrev}rem`,
          });

          prevTabCloseTl.to(
            prevTab.querySelector(".metals__item-bottom"),
            {
              y: "1rem",
              opacity: 0,
              duration: 0.4,
              ease: "power1.out",
            },
            "<"
          );
          prevTabCloseTl.to(
            prevTab.querySelector(".metals__control-svg"),
            {
              duration: 0.4,
              rotate: 0,
            },
            "<"
          );

          prevTabCloseTl.restart();
        }

        openTl.restart();
        prevTabIndex = index;
      }
    });
    if (index === 0) {
      openTl.restart();
      prevTabIndex = 0;
    }
  });
});
