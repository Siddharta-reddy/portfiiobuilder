// Automate section numbering for navigation and section titles
document.addEventListener('DOMContentLoaded', function () {
  // Section names in order
  const sectionNames = [
    'Home',
    'About',
    'Projects',
    'Skills',
    'Resume',
    'Contact'
  ];

  // Update nav links (desktop and mobile)
  const navLinks = document.querySelectorAll('.nav-link .section-number, .mobile-nav-link .section-number');
  navLinks.forEach((el, idx) => {
    el.textContent = (idx + 1).toString().padStart(2, '0') + '.';
  });

  // Update section titles
  const sectionTitles = document.querySelectorAll('.section-title .section-number');
  sectionTitles.forEach((el, idx) => {
    el.textContent = (idx + 1).toString().padStart(2, '0') + '.';
  });
});
