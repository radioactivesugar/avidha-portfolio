document.addEventListener("DOMContentLoaded", () => {
  // 1. Smooth Fade-In on Page Load
  gsap.to("body", { opacity: 1, duration: 0.6, ease: "power2.out" });

  // 2. Intercept Click Events for Page Fade-Out Transition
  const links = document.querySelectorAll(".transition-trigger");
  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetUrl = link.getAttribute("href");

      // STRICT CHECK: Skip interception if the target is empty, a hash link, or an internal filter
      if (!targetUrl || targetUrl === "#" || targetUrl.startsWith("#")) {
        return;
      }

      e.preventDefault();

      gsap.to("body", {
        opacity: 0,
        duration: 0.4,
        ease: "power2.inOut",
        onComplete: () => {
          window.location.href = targetUrl;
        },
      });
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

// 4. bfcache Fix — restores fade-in when user navigates back/forward
window.addEventListener("pageshow", (e) => {
  if (e.persisted) {
    gsap.to("body", { opacity: 1, duration: 0.6, ease: "power2.out" });
  }
});

// 5. Animated Internal Project Filtering Engine
const filterItems = document.querySelectorAll("#category-filters li");
const projectItems = document.querySelectorAll(".stream-item");

function applyProjectFilterAnimated(category) {
  // 1. Fade out all currently visible items
  gsap.to(".stream-item", {
    opacity: 0,
    y: 15, // Subtle downward slide out
    duration: 0.25,
    ease: "power2.in",
    onComplete: () => {
      // 2. Once fade-out completes, toggle layout display properties
      projectItems.forEach((item) => {
        if (item.getAttribute("data-category") === category) {
          item.style.display = "block";
        } else {
          item.style.display = "none";
        }
      });

      // 3. Fade in the targeted category items cleanly
      gsap.fromTo(
        `[data-category="${category}"]`,
        { opacity: 0, y: -15 }, // Start slightly higher up
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out", stagger: 0.1 }, // Stagger creates a cascading entrance
      );
    },
  });
}

// Initialize layout seamlessly with the default active filter ('documentary')
const initialActive = document.querySelector("#category-filters li.active");
if (initialActive) {
  const defaultCategory = initialActive.getAttribute("data-filter");
  // Set initial structural display state without triggering an entrance animation on page load
  projectItems.forEach((item) => {
    if (item.getAttribute("data-category") === defaultCategory) {
      item.style.display = "block";
      gsap.set(item, { opacity: 1, y: 0 });
    } else {
      item.style.display = "none";
      gsap.set(item, { opacity: 0, y: 15 });
    }
  });
}

// Add click event listeners to filter selectors
filterItems.forEach((filterLi) => {
  filterLi.addEventListener("click", (e) => {
    e.preventDefault();

    // Guard clause: Do nothing if clicking the already active filter
    if (filterLi.classList.contains("active")) return;

    // Toggle active classes on the sidebar links
    filterItems.forEach((li) => li.classList.remove("active"));
    filterLi.classList.add("active");

    // Run animated visibility shift based on selection
    const targetedCategory = filterLi.getAttribute("data-filter");
    applyProjectFilterAnimated(targetedCategory);
  });
});
