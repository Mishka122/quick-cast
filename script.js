const swiperFirst = new Cast("slider", ".swiper", {
  duration: 0.2,
  devices: "desktop",
  infinity: true,
  pagination: ".pagination",
});

const accordionFirst = new Cast("accordion", ".accordion", {
  devices: "desktop",
  target: ".accordion__head",
  hidden: ".accordion__content",
  onStart: ({ acc }) => {
    gsap.to(acc.querySelector(".accordion__arrow"), {
      rotate: 180,
    });
  },
  onComplete: ({ acc }) => {
    gsap.to(acc.querySelector(".accordion__arrow"), {
      rotate: 0,
    });
  },
});
