document.addEventListener('DOMContentLoaded', function () {
  const filterButtons = document.querySelectorAll('.filter-nav button');
  const cards = document.querySelectorAll('.gallery .card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', function () {
      // Update aria-pressed and active class
      filterButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      this.classList.add('active');
      this.setAttribute('aria-pressed', 'true');

      const filter = this.getAttribute('data-filter');
      cards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.classList.remove('hide');
          card.setAttribute('tabindex', '0');
        } else {
          card.classList.add('hide');
          card.setAttribute('tabindex', '-1');
        }
      });
    });
  });
});
