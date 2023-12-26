function runSplit() {
  text = new SplitType('[animation=loading-split]', {
    types: 'lines',
    lineClass: 'loading-animation-split',
  })
  textfade = new SplitType('[animation=split-fade]', {
    types: 'lines',
    lineClass: 'animation-split-fade',
  })

  // Wrap each line in a div with class 'overflow-hidden'
  $('.loading-animation-split').each(function () {
    $(this).wrap("<div class='overflow-hidden'></div>")
  })
  $('.animation-split-fade').each(function () {
    $(this).wrap("<div class='overflow-hidden'></div>")
  })
}

runSplit()

// Update on window resize
let windowWidth = $(window).innerWidth()
window.addEventListener('resize', function () {
  if (windowWidth !== $(window).innerWidth()) {
    windowWidth = $(window).innerWidth()
    text.revert()
    textfade.revert()
    runSplit()
  }
})

gsap.registerPlugin(ScrollTrigger, CustomEase)

let smoother

function initializeScrollSmoother() {
  if (!smoother) {
    gsap.registerPlugin(ScrollSmoother)

    // Check if the screen width is below 991px
    const shouldEnableEffects = window.innerWidth >= 991

    smoother = ScrollSmoother.create({
      smooth: 1,
      effects: shouldEnableEffects, // Enable or disable based on screen width
    })
  }
}

function updateOnResize() {
  // Check if smoother instance exists
  if (smoother) {
    // Update the effects property based on the current window width
    smoother.effects(window.innerWidth >= 991)

    // Update the smoother instance
    if (smoother.update) {
      smoother.update()
    }
  }
}

// Debounce function
function debounce(func, wait) {
  let timeout
  return function () {
    clearTimeout(timeout)
    timeout = setTimeout(func, wait)
  }
}

// Initialize ScrollSmoother on DOMContentLoaded
document.addEventListener('DOMContentLoaded', initializeScrollSmoother)

// Add debounced resize event listener
window.addEventListener('resize', debounce(updateOnResize, 250))

CustomEase.create('smooth', 'M0,0 C0.38,0.005 0.215,1 1,1')

// On Page Load
function pageLoad() {
  let tl = gsap.timeline()

  tl.to('.main-wrapper', {
    opacity: 1,
    ease: 'smooth',
    duration: 0.6,
  })

  // Add a label to mark the starting point of simultaneous animations
  tl.add('loadingAnimationsStart')

  // Add the 'loading' animation and set its position to the label
  tl.from(
    '.loading-animation-split',
    {
      y: '100%',
      opacity: '0',
      stagger: { each: 0.1, from: 'start' },
      ease: 'smooth',
      duration: 0.6,
    },
    'loadingAnimationsStart'
  )
  tl.from(
    '[animation=loading]',
    {
      y: '20rem',
      opacity: '0',
      stagger: { each: 0.1, from: 'start' },
      ease: 'smooth',
      duration: 0.6,
    },
    'loadingAnimationsStart'
  ) // <-- position parameter set to the label

  // Add the 'loading-reverse' animation and set its position to the label
  tl.from(
    '[animation=loading-reverse]',
    {
      y: '-20rem',
      opacity: '0',
      stagger: { each: 0.1, from: 'start' },
      ease: 'smooth',
      duration: 1,
    },
    'loadingAnimationsStart'
  ) // <-- position parameter set to the label
}

pageLoad()

// marquee is--scrolling
const scrollSpeed = 50 // pixels per second, adjust as needed

function updateScrollingSpeed() {
  // Select elements with either 'is--scrolling' or 'is--scrolling2' class
  document
    .querySelectorAll('.is--scrolling, .is--scrolling2')
    .forEach((element) => {
      const scrollWidth = element.offsetWidth
      const duration = scrollWidth / scrollSpeed // seconds

      element.style.setProperty('--scroll-width', `${scrollWidth}px`)
      element.style.animationDuration = `${duration}s`
    })
}

// Call initially
updateScrollingSpeed()

// Update on window resize
window.addEventListener('resize', updateScrollingSpeed)

gsap.utils.toArray('[animation=split-fade]').forEach((container) => {
  const splitFadeElements = container.querySelectorAll('.animation-split-fade')

  gsap.from(splitFadeElements, {
    scrollTrigger: {
      trigger: container,
      start: 'top bottom', // When the top of the container hits the bottom of the viewport
      end: 'bottom top', // When the bottom of the container leaves the top of the viewport
      toggleActions: 'play none none none', // Play the animation when the container enters the viewport
      once: true, // Ensures the animation only triggers once
    },
    opacity: 0,
    y: '100%', // translateY
    duration: 0.6, // Duration of the animation
    ease: 'smooth',
    delay: 0.3, // Custom easing function
    stagger: {
      amount: 0.1, // Total time for the stagger (in seconds)
    },
  })
})
