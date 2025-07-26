// DOM Elements
const header = document.querySelector('.header');
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const mobileNav = document.getElementById('mobile-nav');
const themeToggle = document.getElementById('theme-toggle');
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');
const currentYearEl = document.getElementById('current-year');
const menuIcon = document.querySelector('.menu-icon');
const closeIcon = document.querySelector('.close-icon');
const moonIcon = document.querySelector('.moon-icon');
const sunIcon = document.querySelector('.sun-icon');
const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
const revealElements = document.querySelectorAll('.reveal-element');
const skillBars = document.querySelectorAll('.skill-bar-fill');

// Set current year in footer
currentYearEl.textContent = new Date().getFullYear();

// Header scroll effect
function handleScroll() {
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}

// Mobile menu toggle
function toggleMobileMenu() {
  mobileNav.classList.toggle('hidden');
  menuIcon.classList.toggle('hidden');
  closeIcon.classList.toggle('hidden');
  
  // Prevent scrolling when mobile menu is open
  document.body.style.overflow = mobileNav.classList.contains('hidden') ? 'auto' : 'hidden';
}

// Close mobile menu when a link is clicked
function closeMobileMenu() {
  if (!mobileNav.classList.contains('hidden')) {
    mobileNav.classList.add('hidden');
    menuIcon.classList.remove('hidden');
    closeIcon.classList.add('hidden');
    document.body.style.overflow = 'auto';
  }
}

// Theme toggle
function toggleTheme() {
  const isDark = document.body.hasAttribute('data-theme');
  
  if (isDark) {
    document.body.removeAttribute('data-theme');
    localStorage.setItem('theme', 'light');
    moonIcon.classList.remove('hidden');
    sunIcon.classList.add('hidden');
  } else {
    document.body.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
    moonIcon.classList.add('hidden');
    sunIcon.classList.remove('hidden');
  }
}

// Check saved theme preference
function loadSavedTheme() {
  const savedTheme = localStorage.getItem('theme');
  
  if (savedTheme === 'dark') {
    document.body.setAttribute('data-theme', 'dark');
    moonIcon.classList.add('hidden');
    sunIcon.classList.remove('hidden');
  } else {
    document.body.removeAttribute('data-theme');
    moonIcon.classList.remove('hidden');
    sunIcon.classList.add('hidden');
  }
}

// Contact form submission
function handleFormSubmit(e) {
  e.preventDefault();
  
  const formData = new FormData(contactForm);
  const name = formData.get('name');
  const email = formData.get('email');
  const message = formData.get('message');
  
  // Form validation
  if (!name || !email || !message) {
    showFormStatus('Please fill in all fields', 'error');
    return;
  }
  
  // In a real application, you would send this data to a server
  // For now, we'll just simulate a successful submission
  
  // Show loading state
  const submitButton = contactForm.querySelector('button[type="submit"]');
  const originalText = submitButton.textContent;
  submitButton.textContent = 'Sending...';
  submitButton.disabled = true;
  
  // Simulate server request
  setTimeout(() => {
    // Reset form
    contactForm.reset();
    
    // Show success message
    showFormStatus('Thanks for your message! I\'ll get back to you soon.', 'success');
    
    // Reset button
    submitButton.textContent = originalText;
    submitButton.disabled = false;
    
    // Hide status after 5 seconds
    setTimeout(() => {
      formStatus.classList.add('hidden');
    }, 5000);
  }, 1500);
}

// Show form status message
function showFormStatus(message, type) {
  formStatus.textContent = message;
  formStatus.classList.remove('hidden', 'success', 'error');
  formStatus.classList.add(type);
}

// Smooth scrolling for navigation links
function setupSmoothScrolling() {
  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      
      // Close mobile menu if open
      closeMobileMenu();
      
      // Get the target section id from href
      const targetId = link.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      // Scroll to the target section
      targetSection.scrollIntoView({
        behavior: 'smooth'
      });
    });
  });
}

// Intersection Observer for reveal animations
function setupIntersectionObserver() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        
        // If the target has skill items, animate them
        if (entry.target.querySelectorAll('.skill-item').length > 0) {
          const skillItems = entry.target.querySelectorAll('.skill-item');
          skillItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(10px)';
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'translateY(0)';
            }, 100 * index);
          });
        }
      }
    });
  }, {
    threshold: 0.1
  });
  
  revealElements.forEach(el => observer.observe(el));
}

// Event Listeners
window.addEventListener('scroll', handleScroll);
mobileMenuToggle.addEventListener('click', toggleMobileMenu);
themeToggle.addEventListener('click', toggleTheme);
contactForm.addEventListener('submit', handleFormSubmit);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadSavedTheme();
  setupSmoothScrolling();
  setupIntersectionObserver();
  handleScroll(); // Check initial scroll position
  
  // Skills items animation
  const skillItems = document.querySelectorAll('.skill-item');
  skillItems.forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(10px)';
    setTimeout(() => {
      item.style.opacity = '1';
      item.style.transform = 'translateY(0)';
    }, 100 * index);
  });
});
