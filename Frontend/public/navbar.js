/**
 * YOUR HOME - UNIVERSAL NAVBAR DROPDOWN HANDLER
 * Enables tap/click to open and keep dropdown open, with smooth hover & delay behavior.
 */
(function() {
  function initNavDropdowns() {
    const dropdowns = document.querySelectorAll('.nav-dropdown');
    dropdowns.forEach((dd) => {
      const trigger = dd.querySelector(':scope > .nav-link, :scope > a');
      if (trigger && !trigger.dataset.dropdownBound) {
        trigger.dataset.dropdownBound = 'true';
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const isOpen = dd.classList.contains('dropdown-open');
          dropdowns.forEach((other) => {
            if (other !== dd) other.classList.remove('dropdown-open');
          });
          if (isOpen) {
            dd.classList.remove('dropdown-open');
          } else {
            dd.classList.add('dropdown-open');
          }
        });
      }
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.nav-dropdown')) {
        document.querySelectorAll('.nav-dropdown.dropdown-open').forEach((dd) => {
          dd.classList.remove('dropdown-open');
        });
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavDropdowns);
  } else {
    initNavDropdowns();
  }
})();
