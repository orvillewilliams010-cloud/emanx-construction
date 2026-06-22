import './style.css'

// Navbar scroll effect
const navbar = document.querySelector('.navbar')
const heroBg = document.querySelector('.parallax-bg')

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY
  
  // Navbar Glassmorphism trigger
  if (scrollY > 50) {
    navbar.classList.add('scrolled')
  } else {
    navbar.classList.remove('scrolled')
  }

  // Parallax effect on hero background
  if (heroBg) {
    heroBg.style.transform = `translateY(${scrollY * 0.4}px)`
  }
})

// Set dynamic year in footer
document.getElementById('year').textContent = new Date().getFullYear()

// Scroll observer for animating elements into view
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.15
}

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible')
      observer.unobserve(entry.target)
    }
  })
}, observerOptions)

// Elements to animate
const animatedElements = document.querySelectorAll('.slide-up')
animatedElements.forEach(el => observer.observe(el))

// Counter animation
const counters = document.querySelectorAll('.stat-number')
let hasCounted = false

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !hasCounted) {
      hasCounted = true
      counters.forEach(counter => {
        const target = +counter.getAttribute('data-target')
        const duration = 2000 // ms
        const increment = target / (duration / 16) // 60fps
        
        let current = 0
        const updateCounter = () => {
          current += increment
          if (current < target) {
            counter.innerText = Math.ceil(current)
            requestAnimationFrame(updateCounter)
          } else {
            counter.innerText = target
          }
        }
        updateCounter()
      })
    }
  })
}, { threshold: 0.5 })

const statsSection = document.querySelector('.stats')
if (statsSection) {
  counterObserver.observe(statsSection)
}
