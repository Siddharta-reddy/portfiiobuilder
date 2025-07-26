// DOM Elements that exist at page load
const header = document.querySelector('.header');
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const mobileNav = document.getElementById('mobile-nav');
const themeToggle = document.getElementById('theme-toggle');
const menuIcon = document.querySelector('.menu-icon');
const closeIcon = document.querySelector('.close-icon');
const moonIcon = document.querySelector('.moon-icon');
const sunIcon = document.querySelector('.sun-icon');
const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
const skillBars = document.querySelectorAll('.skill-bar-fill');

// Variables for dynamically loaded elements
let contactForm;
let formStatus;

// Set current year in footer if present at load
const currentYearEl = document.getElementById('current-year');
if (currentYearEl) currentYearEl.textContent = new Date().getFullYear();

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
  const revealElements = document.querySelectorAll('.reveal-element');
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

// Fetch and render data from JSON file
async function fetchAndRenderData() {
  try {
    const response = await fetch('data.json');
    if (!response.ok) throw new Error('Failed to fetch data');
    const data = await response.json();

    // HERO SECTION
    if (data.hero) {
      document.getElementById('hero-content').innerHTML = `
        <div class="hero-content reveal-element">
          <p class="font-mono text-primary-accent mb-6">${data.hero.greeting}</p>
          <h1 class="hero-title">${data.hero.name}</h1>
          <h2 class="hero-subtitle">${data.hero.subtitle}</h2>
          <p class="hero-description">${data.hero.description}</p>
          <a href="#projects" class="btn-primary"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>${data.hero.buttonText}</a>
        </div>
      `;
    }

    // ABOUT SECTION
    if (data.about) {
      document.getElementById('about-content').innerHTML = `
        <h2 class="section-title reveal-element">About Me <span class="title-line"></span></h2>
        <div class="about-grid reveal-element">
          <div class="about-text">
            ${data.about.paragraphs.map(p => `<p>${p}</p>`).join('')}
            <ul class="skills-list">
              ${data.about.skills.map(skill => `<li><span class="text-primary-accent">▹</span> ${skill}</li>`).join('')}
            </ul>
          </div>
          <div class="about-image-container">
            <div class="about-image">
              <div class="image-overlay"></div>
              <div class="image-placeholder"><span class="font-mono text-primary-accent">Profile Photo</span></div>
              <div class="image-border"></div>
            </div>
          </div>
        </div>
      `;
    }

    // PROJECTS SECTION
    if (data.projects) {
      document.getElementById('projects-content').innerHTML = `
        <h2 class="section-title reveal-element">Projects <span class="title-line"></span></h2>
        <div class="projects-grid">
          ${data.projects.map((project, i) => `
            <div class="project${i % 2 === 1 ? ' project-reverse' : ''} reveal-element">
              <div class="project-content">
                <div class="project-image">
                  <div class="image-placeholder"><span class="font-mono text-primary-accent">Project Image</span></div>
                </div>
                <div class="project-details">
                  <p class="project-overline font-mono text-primary-accent">${project.overline}</p>
                  <h3 class="project-title text-headings">${project.title}</h3>
                  <div class="project-description"><p>${project.description}</p></div>
                  <ul class="project-tech-list">
                    ${project.tech.map(t => `<li>${t}</li>`).join('')}
                  </ul>
                  <div class="project-links">
                    <a href="${project.github}" class="project-link" aria-label="GitHub Repository" target="_blank">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                        <path d="M9 18c-4.51 2-5-2-7-2"></path>
                      </svg>
                    </a>
                    <a href="${project.demo}" class="project-link" aria-label="Live Demo" target="_blank">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" x2="21" y1="14" y2="3"></line>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }

    // SKILLS SECTION
    if (data.skills) {
      document.getElementById('skills-content').innerHTML = `
            <h2 class="section-title reveal-element">
              <span class="section-number text-primary-accent font-mono"></span> Skills
              <span class="title-line"></span>
            </h2>
            <div class="skills-grid">
              ${Object.entries(data.skills).map(([cat, arr]) => `
                <div class="skills-category reveal-element">
                  <h3 class="skill-category-title">${cat}</h3>
                  <div class="flex flex-wrap gap-2">
                    ${arr.map(skill => `<span class="skill-tag" >${skill}</span>`).join('')}
                  </div>
                </div>
              `).join('')}
            </div>
      `;
    }

    // RESUME SECTION
    if (data.resume) {
      document.getElementById('resume-content').innerHTML = `
        <h2 class="section-title reveal-element">Resume <span class="title-line"></span></h2>
        <div class="resume-content reveal-element">
          <div class="resume-section">
            <h3 class="resume-section-title">Work Experience</h3>
            <div class="timeline">
              ${data.resume.work.map(job => `
                <div class="timeline-item">
                  <div class="timeline-marker"></div>
                  <h4 class="timeline-title">${job.title}</h4>
                  <div class="timeline-info">${job.company} | ${job.date}</div>
                  <ul class="timeline-list">
                    ${job.details.map(d => `<li><span>▹</span> ${d}</li>`).join('')}
                  </ul>
                </div>
              `).join('')}
            </div>
          </div>
          <div class="resume-section">
            <h3 class="resume-section-title">Education</h3>
            <div class="timeline">
              ${data.resume.education.map(edu => `
                <div class="timeline-item">
                  <div class="timeline-marker"></div>
                  <h4 class="timeline-title">${edu.degree}</h4>
                  <div class="timeline-info">${edu.school} | ${edu.date}</div>
                  <p class="timeline-description">${edu.description}</p>
                </div>
              `).join('')}
            </div>
          </div>
          <div class="resume-download">
            <a href="#" class="btn-primary">Download Resume</a>
          </div>
        </div>
      `;
    }

    // CONTACT SECTION
    if (data.contact) {
      document.getElementById('contact-content').innerHTML = `
        <h2 class="section-title reveal-element">Contact <span class="title-line"></span></h2>
        <div class="text-center max-w-2xl mx-auto mb-12 reveal-element">
          <h3 class="text-2xl font-bold text-headings mb-4">Get In Touch</h3>
          <p>I'm currently open for new opportunities. Whether you have a question or just want to say hi, I'll do my best to get back to you!</p>
        </div>
        <div class="contact-grid">
          <div class="contact-form-container reveal-element">
            <h3 class="contact-subtitle">Send a Message</h3>
            <form id="contact-form">
              <div class="form-group">
                <label for="name" class="form-label">Name</label>
                <input type="text" id="name" name="name" class="form-input" required>
              </div>
              <div class="form-group">
                <label for="email" class="form-label">Email</label>
                <input type="email" id="email" name="email" class="form-input" required>
              </div>
              <div class="form-group">
                <label for="message" class="form-label">Message</label>
                <textarea id="message" name="message" rows="5" class="form-input" required></textarea>
              </div>
              <button type="submit" class="btn-primary w-full">Send Message</button>
              <div id="form-status" class="form-status hidden"></div>
            </form>
          </div>
          <div class="reveal-element">
            <div class="contact-details">
              <div class="contact-item">
                <div class="contact-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                    </svg>
                </div>
                <div>
                <div class="contact-label">Email</div>
                  <a href="mailto:${data.contact.email}" class="contact-value">
                  ${data.contact.email}
                  </a>
                  </div>
              </div>
              <div class="contact-item">
                <div class="contact-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                      <path d="M9 18c-4.51 2-5-2-7-2"></path>
                    </svg>
                  </div>
                <div>
                  <div class="contact-label">GitHub</div>
                  <a href="${data.contact.github}" target="_blank" class="contact-value">
                    ${data.contact.github}
                    </a>
                </div>
              </div>
              <div class="contact-item">
              <div class="contact-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                      <rect width="4" height="12" x="2" y="9"></rect>
                      <circle cx="4" cy="4" r="2"></circle>
                    </svg>
                  </div>
                  <div>
                <div class="contact-label">LinkedIn</div>
                  <a href="${data.contact.linkedin}" target="_blank" class="contact-value">
                  ${data.contact.linkedin}
                  </a>
                  </div>
              </div>
            </div>
            <div class="location-info">
              <h3 class="contact-subtitle">Location</h3>
              <p class="location-text">${data.contact.location}</p>
            </div>
            <div class="availability-info">
              <h3 class="contact-subtitle">Availability</h3>
              <p class="availability-text">${data.contact.availability}</p>
            </div>
          </div>
        </div>
      `;
    }

    // FOOTER
    if (data.footer) {
      document.getElementById('footer-content').innerHTML = `
        <div class="footer-content">
          <div class="footer-text">
            <p>Designed & Built by ${data.footer.designedBy}</p>
            <p class="copyright">&copy; <span id="current-year">${data.footer.copyrightYear}</span> All Rights Reserved</p>
          </div>
        </div>
      `;
      // Set current year in footer after rendering
      const currentYearEl = document.getElementById('current-year');
      if (currentYearEl) currentYearEl.textContent = new Date().getFullYear();
    }

    // Re-attach event listeners for dynamically injected elements
    contactForm = document.getElementById('contact-form');
    formStatus = document.getElementById('form-status');
    if (contactForm) {
      contactForm.addEventListener('submit', handleFormSubmit);
    }

    // Now that dynamic elements are on the page, set up observers
    setupIntersectionObserver();
  } catch (error) {
    console.error('Error loading data:', error);
  }
}

// Event Listeners
window.addEventListener('scroll', handleScroll);

mobileMenuToggle.addEventListener('click', toggleMobileMenu);
themeToggle.addEventListener('click', toggleTheme);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadSavedTheme();
  setupSmoothScrolling();
  handleScroll(); // Check initial scroll position

  fetchAndRenderData(); // Fetch and render JSON data
});
