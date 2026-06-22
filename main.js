import './style.css'

// Navbar scroll effect
const navbar = document.querySelector('.navbar')

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled')
  } else {
    navbar.classList.remove('scrolled')
  }
})

// Set dynamic year in footer
document.getElementById('year').textContent = new Date().getFullYear()

// Scroll animations
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
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
const animatedElements = document.querySelectorAll('.fade-in, .slide-up')
animatedElements.forEach(el => observer.observe(el))
