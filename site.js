(() => {
  const dock = document.querySelector(".mobile-download-dock");
  const dockLink = dock?.querySelector("a");
  const heroDownload = document.querySelector("#hero-download");
  const finalDownload = document.querySelector("#final-download");

  if (!dock || !dockLink || !heroDownload || !finalDownload) return;

  const mobileQuery = window.matchMedia("(max-width: 720px)");
  let heroIsVisible = true;
  let finalIsVisible = false;

  const updateDock = () => {
    const shouldShow = mobileQuery.matches && !heroIsVisible && !finalIsVisible;
    dock.classList.toggle("is-visible", shouldShow);
    dock.setAttribute("aria-hidden", String(!shouldShow));
    dock.toggleAttribute("inert", !shouldShow);
    if (shouldShow) {
      dockLink.removeAttribute("tabindex");
    } else {
      dockLink.tabIndex = -1;
    }
  };

  if ("IntersectionObserver" in window) {
    const heroObserver = new IntersectionObserver(
      ([entry]) => {
        heroIsVisible = entry.isIntersecting;
        updateDock();
      },
      { threshold: 0.15 }
    );

    const finalObserver = new IntersectionObserver(
      ([entry]) => {
        finalIsVisible = entry.isIntersecting;
        updateDock();
      },
      { threshold: 0.1 }
    );

    heroObserver.observe(heroDownload);
    finalObserver.observe(finalDownload);
  } else {
    const updateFromScroll = () => {
      const heroRect = heroDownload.getBoundingClientRect();
      const finalRect = finalDownload.getBoundingClientRect();
      heroIsVisible = heroRect.bottom > 0 && heroRect.top < window.innerHeight;
      finalIsVisible = finalRect.bottom > 0 && finalRect.top < window.innerHeight;
      updateDock();
    };

    window.addEventListener("scroll", updateFromScroll, { passive: true });
    updateFromScroll();
  }

  mobileQuery.addEventListener?.("change", updateDock);
  updateDock();
})();
