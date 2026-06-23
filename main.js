import './style.css'

// Navbar scroll effect
const navbar = document.querySelector('.navbar')
const heroBg = document.querySelector('.parallax-bg')

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY
  
  // Navbar Glassmorphism trigger
  if (navbar) {
    if (scrollY > 50) {
      navbar.classList.add('scrolled')
    } else {
      navbar.classList.remove('scrolled')
    }
  }

  // Parallax effect on hero background
  if (heroBg) {
    heroBg.style.transform = `translateY(${scrollY * 0.4}px)`
  }
})

// Set dynamic year in footer
const yearEls = document.querySelectorAll('.footer-year');
yearEls.forEach(el => {
  el.textContent = new Date().getFullYear();
});

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

// Mobile Drawer Interaction
const menuToggle = document.getElementById('menuToggle') || document.querySelector('.menu-toggle')
const mobileDrawer = document.getElementById('navDrawer') || document.getElementById('mobileDrawer') || document.querySelector('.nav-drawer') || document.querySelector('.mobile-drawer') || document.querySelector('.drawer')
const closeBtn = document.getElementById('closeBtn') || document.querySelector('.close-btn') || document.querySelector('.drawer-close')
const drawerOverlay = document.getElementById('drawerOverlay') || document.querySelector('.drawer-overlay')

if (menuToggle && mobileDrawer) {
  // Ensure default accessibility attributes are set
  if (!menuToggle.hasAttribute('aria-expanded')) {
    menuToggle.setAttribute('aria-expanded', 'false')
  }
  if (!mobileDrawer.hasAttribute('aria-hidden')) {
    mobileDrawer.setAttribute('aria-hidden', 'true')
  }

  const openDrawer = () => {
    mobileDrawer.classList.add('active')
    menuToggle.classList.add('active')
    if (drawerOverlay) {
      drawerOverlay.classList.add('active')
    }
    document.body.classList.add('no-scroll')
    document.body.style.overflow = 'hidden'
    menuToggle.setAttribute('aria-expanded', 'true')
    mobileDrawer.setAttribute('aria-hidden', 'false')
    
    // Set focus to close button inside drawer for a11y
    if (closeBtn) {
      closeBtn.focus()
    }
  }

  const closeDrawer = () => {
    mobileDrawer.classList.remove('active')
    menuToggle.classList.remove('active')
    if (drawerOverlay) {
      drawerOverlay.classList.remove('active')
    }
    document.body.classList.remove('no-scroll')
    document.body.style.overflow = ''
    menuToggle.setAttribute('aria-expanded', 'false')
    mobileDrawer.setAttribute('aria-hidden', 'true')
    
    // Return focus to menu toggle button
    menuToggle.focus()
  }

  // Toggle drawer open/close
  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true'
    if (isOpen) {
      closeDrawer()
    } else {
      openDrawer()
    }
  })

  // Close with close button
  if (closeBtn) {
    closeBtn.addEventListener('click', closeDrawer)
  }

  // Close with overlay click
  if (drawerOverlay) {
    drawerOverlay.addEventListener('click', closeDrawer)
  }

  // Close drawer on anchor link clicks
  const drawerLinks = mobileDrawer.querySelectorAll('a')
  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer()
    })
  })

  // Accessibility: close drawer on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
      closeDrawer()
    }
  })
}

// Toast system implementation
export function showToast(title, message, type = 'info', duration = 4000) {
  // Find or create toast container
  let toastContainer = document.getElementById('toastContainer') || document.getElementById('toast-container')
  if (!toastContainer) {
    toastContainer = document.createElement('div')
    toastContainer.id = 'toastContainer'
    toastContainer.className = 'toast-container'
    toastContainer.setAttribute('aria-live', 'polite')
    document.body.appendChild(toastContainer)
  }

  // Create toast element
  const toast = document.createElement('div')
  toast.className = `toast toast-${type} slide-in`
  toast.setAttribute('role', type === 'error' ? 'alert' : 'status')
  toast.setAttribute('aria-live', type === 'error' ? 'assertive' : 'polite')

  toast.innerHTML = `
    <div class="toast-content">
      <div class="toast-header">
        <strong class="toast-title">${title}</strong>
        <button type="button" class="toast-close-btn" aria-label="Close notification">&times;</button>
      </div>
      <div class="toast-body">${message}</div>
    </div>
    <div class="toast-progress"></div>
  `

  toastContainer.appendChild(toast)

  // Animate progress bar
  const progressBar = toast.querySelector('.toast-progress')
  if (progressBar) {
    progressBar.style.transform = 'scaleX(1)'
    progressBar.style.transformOrigin = 'left'
    progressBar.style.transition = `transform ${duration}ms linear`
    // Trigger reflow
    progressBar.offsetHeight
    progressBar.style.transform = 'scaleX(0)'
  }

  let dismissTimeout

  const dismissToast = () => {
    clearTimeout(dismissTimeout)
    toast.classList.remove('slide-in')
    toast.classList.add('slide-out')
    
    // Fallback: remove after 300ms if animationend doesn't fire
    const fallbackTimeout = setTimeout(() => {
      toast.remove()
    }, 300)

    toast.addEventListener('animationend', () => {
      clearTimeout(fallbackTimeout)
      toast.remove()
    }, { once: true })
  }

  const closeBtn = toast.querySelector('.toast-close-btn')
  if (closeBtn) {
    closeBtn.addEventListener('click', dismissToast)
  }

  // Auto remove after duration
  dismissTimeout = setTimeout(dismissToast, duration)
}

// Expose to window so other pages/scripts can show toasts
window.showToast = showToast

// Contact Form Interception & Validation
const contactForm = document.getElementById('projectContactForm')
if (contactForm) {
  // Sync aria-invalid with native validity
  const syncAriaInvalid = (el) => {
    if (el.checkValidity) {
      if (!el.checkValidity()) {
        el.setAttribute('aria-invalid', 'true')
      } else {
        el.removeAttribute('aria-invalid')
      }
    }
  }

  // Sync on blur when user leaves an input
  contactForm.addEventListener('blur', (e) => {
    if (e.target.matches('input, textarea, select')) {
      syncAriaInvalid(e.target)
    }
  }, true) // Capture phase to catch blur events

  // Remove error state immediately on input correction
  contactForm.addEventListener('input', (e) => {
    if (e.target.matches('input, textarea, select')) {
      if (e.target.hasAttribute('aria-invalid') && e.target.checkValidity()) {
        e.target.removeAttribute('aria-invalid')
      }
    }
  })

  contactForm.addEventListener('submit', (event) => {
    event.preventDefault()

    // Trigger native validation layout & check validity
    if (!contactForm.checkValidity()) {
      contactForm.reportValidity()
      
      // Sync ARIA states for assistive technologies
      contactForm.querySelectorAll('input, textarea, select').forEach(syncAriaInvalid)
      
      showToast('Error', 'Please fill out all required fields correctly.', 'error', 4000)
      return
    }

    const submitBtn = contactForm.querySelector('button[type="submit"]')
    if (submitBtn) {
      const originalText = submitBtn.innerHTML
      submitBtn.disabled = true

      // Append spinner
      const spinner = document.createElement('span')
      spinner.className = 'btn-spinner'
      submitBtn.appendChild(spinner)

      // Mock 1.8-second loading state
      setTimeout(() => {
        // Reset form
        contactForm.reset()

        // Restore button state
        spinner.remove()
        submitBtn.disabled = false

        // Clear all ARIA invalid attributes
        contactForm.querySelectorAll('input, textarea, select').forEach(el => {
          el.removeAttribute('aria-invalid')
        });

        // Show success toast
        showToast('Success', 'Your message has been sent successfully!', 'success', 5000)
      }, 1800)
    }
  })
}

