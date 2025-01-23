new Cast("settings", {
  mobileMax: 480,
  tabletMax: 992,
});

const swiperFirst = new Cast("slider", {
  target: ".swiper",
  devices: "desktop",

  selectors: {
    paginationContainer: ".pagination",
  },
  animation: {
    duration: 0.2,
  },
  behavior: {
    pagination: true,
    infinity: true,
   // swipe: true,
  },
  onStart: ({ qcApi }) => {
    console.log(qcApi.direction);
  },
});

const accordionFirst = new Cast("accordion", {
  target: ".accordion",
  devices: "desktop",
  structure: {
    accordionHeader: ".accordion__head",
    accordionContent: ".accordion__content",
  },
  behavior: {
    initialPanel: 1,
  },
  onStart: ({ qcApi }) => {
    gsap.to(qcApi.currentPanel.querySelector(".accordion__arrow"), {
      rotate: 180,
    });
    console.log("c ", qcApi.event);
    //   console.log("p ", qcApi.previousPanel);
  },
  onComplete: ({ qcApi }) => {
    gsap.to(qcApi.currentPanel.querySelector(".accordion__arrow"), {
      rotate: 0,
    });
    console.log("c ", qcApi.event);
    //    console.log("p ", qcApi.previousPanel);
  },
});

/*
target:
devices:
structure: {
  accordionHeader
  accordionContent
  leftArrow
}
animation: {
  duration:
  ease:
  delay:
}
behavior: {
  infinity
}
*/
