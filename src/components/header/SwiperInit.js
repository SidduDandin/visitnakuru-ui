// "use client";
// import { useEffect } from "react";
// import Swiper from "swiper";
// import { Navigation, Pagination, Autoplay, Thumbs, Mousewheel, FreeMode } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/pagination";
// import "swiper/css/thumbs";
// import "swiper/css/free-mode";

// function initSwipers() {
//   // Prevent double initialization
//   if(document.querySelector('.hero-banner-slider') && !document.querySelector('.hero-banner-slider').swiper){
//     new Swiper(".hero-banner-slider", {
//       modules: [Pagination, Navigation],
//       slidesPerView: 1,
//       spaceBetween: 0,
//       speed: 600,
//       pagination: {
//         el: ".swiper-pagination",
//         clickable: true,
//       },
//       navigation: {
//         nextEl: ".swiper-button-next",
//         prevEl: ".swiper-button-prev",
//       }
//     });
//   }


//   if(document.querySelector('.whatson-slider') && !document.querySelector('.whatson-slider').swiper){
//     new Swiper(".whatson-slider", {
//       modules: [Navigation],
//       spaceBetween: 30,
//       speed: 600,
//       navigation: {
//         nextEl: ".whatson-slider-outer .swiper-button-next",
//         prevEl: ".whatson-slider-outer .swiper-button-prev",
//       },
//       breakpoints :{
//         0: {
//           slidesPerView: 1,
//         },
//         767:{
//           slidesPerView: 2,
//         },
//         992: {
//           slidesPerView: 4,
//         }
//       }
//     });
//   }
//   if(document.querySelector('.trendings-slider') && !document.querySelector('.trendings-slider').swiper){
//     new Swiper(".trendings-slider", {
//       modules: [Navigation],
//       spaceBetween: 30,
//       speed: 600,
//       navigation: {
//         nextEl: ".trendings-slider-outer .swiper-button-next",
//         prevEl: ".trendings-slider-outer .swiper-button-prev",
//       },
//       breakpoints :{
//         0: {
//           slidesPerView: 1,
//         },
//         767:{
//           slidesPerView: 2,
//         },
//         992: {
//           slidesPerView: 4,
//         }
//       }
//     });
//   }
//   if(document.querySelector('.stays-slider') && !document.querySelector('.stays-slider').swiper){
//     new Swiper(".stays-slider", {
//       modules: [Navigation],
//       spaceBetween: 30,
//       speed: 600,
//       navigation: {
//         nextEl: ".stays-slider-outer .swiper-button-next",
//         prevEl: ".stays-slider-outer .swiper-button-prev",
//       },
//       breakpoints :{
//         0: {
//           slidesPerView: 1,
//         },
//         767:{
//           slidesPerView: 2,
//         },
//         992: {
//           slidesPerView: 4,
//         }
//       }
//     });
//   }
//   if(document.querySelector('.events-slider') && !document.querySelector('.events-slider').swiper){
//     new Swiper(".events-slider", {
//       modules: [Navigation],
//       spaceBetween: 30,
//       speed: 600,
//       navigation: {
//         nextEl: ".events-slider-outer .swiper-button-next",
//         prevEl: ".events-slider-outer .swiper-button-prev",
//       },
//       breakpoints :{
//         0: {
//           slidesPerView: 1,
//         },
//         767:{
//           slidesPerView: 2,
//         },
//         992: {
//           slidesPerView: 4,
//         }
//       }
//     });
//   }

// }

// export default function SwiperInit() {
//   useEffect(() => {
//     // Initial try in case HTML is already present
//     initSwipers();
//     // Observe for DOM changes
//     const observer = new MutationObserver(() => {
//       initSwipers();
//     });
//     observer.observe(document.body, { childList: true, subtree: true });
//     return () => observer.disconnect();
//   }, []);
//   return null;
// } 


// ./src/components/header/SwiperInit.js
"use client";
import { useEffect } from "react";
import Swiper from "swiper";
// FIXED: Removed unused modules: Autoplay, Thumbs, Mousewheel, FreeMode
import { Navigation, Pagination } from "swiper/modules"; 
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
// Corresponding unused CSS imports removed:
// import "swiper/css/thumbs"; 
// import "swiper/css/free-mode"; 

function initSwipers() {
  // Prevent double initialization
  if(document.querySelector('.hero-banner-slider') && !document.querySelector('.hero-banner-slider').swiper){
    new Swiper(".hero-banner-slider", {
      modules: [Pagination, Navigation],
      slidesPerView: 1,
      spaceBetween: 0,
      speed: 600,
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      }
    });
  }


  if(document.querySelector('.whatson-slider') && !document.querySelector('.whatson-slider').swiper){
    new Swiper(".whatson-slider", {
      modules: [Navigation],
      spaceBetween: 30,
      speed: 600,
      navigation: {
        nextEl: ".whatson-slider-outer .swiper-button-next",
        prevEl: ".whatson-slider-outer .swiper-button-prev",
      },
      breakpoints :{
        0: {
          slidesPerView: 1,
        },
        767:{
          slidesPerView: 2,
        },
        992: {
          slidesPerView: 4,
        }
      }
    });
  }
  if(document.querySelector('.trendings-slider') && !document.querySelector('.trendings-slider').swiper){
    new Swiper(".trendings-slider", {
      modules: [Navigation],
      spaceBetween: 30,
      speed: 600,
      navigation: {
        nextEl: ".trendings-slider-outer .swiper-button-next",
        prevEl: ".trendings-slider-outer .swiper-button-prev",
      },
      breakpoints :{
        0: {
          slidesPerView: 1,
        },
        767:{
          slidesPerView: 2,
        },
        992: {
          slidesPerView: 4,
        }
      }
    });
  }
  if(document.querySelector('.stays-slider') && !document.querySelector('.stays-slider').swiper){
    new Swiper(".stays-slider", {
      modules: [Navigation],
      spaceBetween: 30,
      speed: 600,
      navigation: {
        nextEl: ".stays-slider-outer .swiper-button-next",
        prevEl: ".stays-slider-outer .swiper-button-prev",
      },
      breakpoints :{
        0: {
          slidesPerView: 1,
        },
        767:{
          slidesPerView: 2,
        },
        992: {
          slidesPerView: 4,
        }
      }
    });
  }
  if(document.querySelector('.events-slider') && !document.querySelector('.events-slider').swiper){
    new Swiper(".events-slider", {
      modules: [Navigation],
      spaceBetween: 30,
      speed: 600,
      navigation: {
        nextEl: ".events-slider-outer .swiper-button-next",
        prevEl: ".events-slider-outer .swiper-button-prev",
      },
      breakpoints :{
        0: {
          slidesPerView: 1,
        },
        767:{
          slidesPerView: 2,
        },
        992: {
          slidesPerView: 4,
        }
      }
    });
  }

}

export default function SwiperInit() {
  useEffect(() => {
    // Initial try in case HTML is already present
    initSwipers();
    // Observe for DOM changes
    const observer = new MutationObserver(() => {
      initSwipers();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);
  return null;
}