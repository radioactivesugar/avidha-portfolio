document.addEventListener("DOMContentLoaded", () => {
  // 1. Smooth Fade-In on Page Load
  gsap.to("body", { opacity: 1, duration: 0.6, ease: "power2.out" });

  // 2. Intercept Click Events for Page Fade-Out Transition
  const links = document.querySelectorAll(".transition-trigger");
  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetUrl = link.getAttribute("href");

      // Check if it's a valid local link change
      if (targetUrl && targetUrl !== "#" && !targetUrl.startsWith("#")) {
        e.preventDefault();

        gsap.to("body", {
          opacity: 0,
          duration: 0.4,
          ease: "power2.inOut",
          onComplete: () => {
            window.location.href = targetUrl;
          },
        });
      }
    });
  });

  // 3. Hero Carousel Auto-rotation (Runs only if hero element exists)
  const slides = document.querySelectorAll(".carousel-slide");
  if (slides.length > 0) {
    let currentSlideIndex = 0;

    setInterval(() => {
      slides[currentSlideIndex].classList.remove("active");
      currentSlideIndex = (currentSlideIndex + 1) % slides.length;
      slides[currentSlideIndex].classList.add("active");
    }, 5000); // Transitions slide image every 5 seconds
  }
});
