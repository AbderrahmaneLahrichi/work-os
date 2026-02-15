// Smooth scroll helper
export const smoothScroll = (e, targetId) => {
  e.preventDefault()
  const target = document.getElementById(targetId)
  if (target) {
    target.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  }
}

// Intersection Observer helper for animations
export const observeElements = (elements) => {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible')
      }
    })
  }, observerOptions)

  elements.forEach(el => {
    if (el) observer.observe(el)
  })

  // Cleanup function
  return () => {
    elements.forEach(el => {
      if (el) observer.unobserve(el)
    })
  }
}
