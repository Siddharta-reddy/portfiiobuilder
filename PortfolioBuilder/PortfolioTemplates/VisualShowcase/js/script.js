document.addEventListener('DOMContentLoaded', () => {
    // --- Element Selectors ---
    const portfolioGrid = document.querySelector('.portfolio-grid');
    const filterContainer = document.querySelector('.portfolio-filters');
    const modal = document.getElementById('project-modal');
    const closeModalButton = modal.querySelector('.close-button');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    let projects = []; // This will be populated with data from the JSON file

    // --- General Page Logic (runs immediately) ---
    // Mobile Navigation
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });
    navLinks.addEventListener('click', (e) => {
        if (e.target.tagName === 'A' && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
        }
    });

    // --- Fetch Project Data and Start the App ---
    async function fetchProjects() {
        try {
            const response = await fetch('data/portfolio-data.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            projects = await response.json();
            initializePortfolio(projects);
        } catch (error) {
            console.error("Could not fetch project data:", error);
            portfolioGrid.innerHTML = '<p class="error-message" style="text-align: center; color: var(--secondary-text-color);">Could not load portfolio projects. Please try running this from a local web server.</p>';
        }
    }

    // --- Portfolio and Modal Logic (runs after data is fetched) ---
    function initializePortfolio(projectData) {
        projects = projectData;

        const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

        const renderPortfolioItems = (items) => {
            portfolioGrid.innerHTML = items.map(project => `
                <div class="portfolio-item" data-project-id="${project.id}">
                    <img src="${project.image}" alt="${project.title}">
                    <div class="portfolio-overlay">
                        <h3>${project.title}</h3>
                        <p>${capitalize(project.category)}</p>
                    </div>
                </div>
            `).join('');
        };

        const openModal = (projectId) => {
            const project = projects.find(p => p.id == projectId);
            if (!project) return;

            modal.querySelector('.modal-img').src = project.image;
            modal.querySelector('.modal-title').textContent = project.title;
            modal.querySelector('.modal-description').textContent = project.description;
            modal.querySelector('.modal-process').textContent = project.process;
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        };

        const closeModal = () => {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        };

        // Attach portfolio-related event listeners
        filterContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-btn')) {
                filterContainer.querySelector('.active').classList.remove('active');
                e.target.classList.add('active');
                const filterValue = e.target.dataset.filter;
                const filteredProjects = filterValue === 'all'
                    ? projects
                    : projects.filter(p => p.category === filterValue);
                renderPortfolioItems(filteredProjects);
            }
        });

        portfolioGrid.addEventListener('click', (e) => {
            const projectItem = e.target.closest('.portfolio-item');
            if (projectItem) {
                openModal(projectItem.dataset.projectId);
            }
        });

        closeModalButton.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('show')) closeModal();
        });

        renderPortfolioItems(projects);
    }

    // --- Scroll Reveal Animation (runs immediately) ---
    const sections = document.querySelectorAll('main > section');
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    sections.forEach(section => sectionObserver.observe(section));

    fetchProjects();
});
