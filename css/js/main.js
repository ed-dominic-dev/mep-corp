// Mobile menu
const toggle = document.querySelector('.menu-toggle');
const links = document.querySelector('.nav-links');
if (toggle && links) {
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
  });
}

// Footer year
document.querySelectorAll('.year').forEach(el => el.textContent = new Date().getFullYear());

// Contact form validation (front-end only)
const form = document.getElementById('contactForm');
if (form) {
  const success = document.querySelector('.form-success');
  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;
    form.querySelectorAll('.field').forEach(field => {
      const input = field.querySelector('input, textarea, select');
      let ok = input.value.trim() !== '';
      if (ok && input.type === 'email') ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value);
      field.classList.toggle('invalid', !ok);
      if (!ok) valid = false;
    });
    if (valid) {
      // TODO: connect to your backend or form service (PHP, Formspree, etc.)
      success.classList.add('show');
      form.reset();
    } else {
      success.classList.remove('show');
    }
  });
}
