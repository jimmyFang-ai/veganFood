
// 首頁 heroBanner 
const swiperHeroBanner = new Swiper(".swiper-heroBanner", {
  slidesPerView: 1,
  loop: true,
  autoplay: {
    disableOnInteraction: false,
    delay: 4000,
  },
});


// 顧客評價
const swiperRecommend = new Swiper(".swiper-recommend", {
  slidesPerView: 1,
  spaceBetween: 0,
  loop: true,
  autoplay: {
    disableOnInteraction: false,
    delay: 3500,
  },
  pagination: {
    el: '.swiper-pagination',
    type: 'bullets',
    clickable: true
  },
  breakpoints: {
    768: {
      slidesPerView: 2,
      spaceBetween: 30,
    },
  },
});



//  最新消息
const swiperNews = new Swiper(".swiper-news", {
  slidesPerView: 1,
  spaceBetween: 0,
  loop: true,
  autoplay: {
    disableOnInteraction: false,
    delay: 3500,
  },
  effect: 'fade',
  fadeEffect: {
    crossFade: true
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  pagination: {
    el: '.swiper-pagination',
    type: 'bullets',
  },
  breakpoints: {
    768: {
      slidesPerView: 1,
      spaceBetween: 30,
    },
  },
});


