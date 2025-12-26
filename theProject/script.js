document.addEventListener("DOMContentLoaded", function () {
  const bar = document.querySelector(".testimonials-bar");
  const track = document.querySelector(".testimonials-track");

  if (!bar || !track) return;

  // width of original content before duplication
  const originalWidth = track.scrollWidth;

  // duplicate content to create seamless loop
  track.innerHTML += track.innerHTML;

  let position = 0;
  const speed = 0.3; // pixels per frame – tweak for slower/faster

  function animate() {
    position -= speed;

    // when we've scrolled one full original width, reset
    if (Math.abs(position) >= originalWidth) {
      position = 0;
    }

    track.style.transform = "translateX(" + position + "px)";
    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
});











document.addEventListener("DOMContentLoaded", function () {
  const parallaxEls = document.querySelectorAll("[data-parallax]");
  if (!parallaxEls.length) return;

  function updateParallax() {
    const scrollY = window.scrollY;

    parallaxEls.forEach(el => {
      const speed = parseFloat(el.dataset.speed) || 0.15; // subtle
      let translateY = scrollY * speed * -1;              // move slightly up

      // clamp so we never move beyond the extra height
      const maxOffset = 120; 
      if (translateY < -maxOffset) translateY = -maxOffset;
      if (translateY > maxOffset) translateY = maxOffset;

      el.style.transform = `translateY(${translateY}px)`;
    });
  }

  window.addEventListener("scroll", updateParallax);
  updateParallax();
});






function myFunction() {
  var x = document.getElementById("myLinks");
  if (x.style.display === "flex" || x.style.display === "block") {
    x.style.display = "none";
  } else {
    x.style.display = "flex";  // keep flex so it uses the flex-direction from CSS
  }
}

