// Mobile menu (event delegation: gagana kahit kailan nabuo ang button)
document.addEventListener('click', function (e) {
  var btn = e.target.closest('.menu-toggle');
  var links = document.querySelector('.nav-links');
  if (!links) return;
  if (btn) {
    var open = links.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
  } else if (!e.target.closest('.nav-links')) {
    links.classList.remove('open'); // pindot sa labas: isara ang menu
  }
});

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

// Logo: hatiin sa bawat letra para sa animation
document.querySelectorAll('.brand').forEach(brand => {
  brand.setAttribute('aria-label', brand.textContent.trim());
  let i = 0;
  brand.querySelectorAll('.b-mep, .b-corp').forEach(part => {
    const text = part.textContent;
    part.textContent = '';
    [...text].forEach(ch => {
      const s = document.createElement('span');
      s.className = 'ltr';
      s.setAttribute('aria-hidden', 'true');
      s.style.setProperty('--i', i++);
      s.textContent = ch;
      part.appendChild(s);
    });
  });
});

// ===== HOME ANIMATIONS =====
(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) return;

  document.documentElement.classList.add('js');

  // [selector, direction, stagger (ms)]
  const targets = [
    ['.section-head',                       'up',    0],
    ['.grid-3 .card',                       'up',    120],
    ['.section.alt .img-box',               'left',  0],
    ['.section.alt .grid-2 > div:last-child > *', 'up', 110],
    ['.checklist li',                       'up',    120],
    ['.cta .wrap > *',                      'zoom',  150],
    ['.site-footer .footer-grid > div',     'up',    120],
  ];

  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target;
      el.classList.add('in');
      io.unobserve(el);
      // tanggalin ang reveal rules pagkatapos para hindi maantala ang hover effects
      const delay = parseInt(el.style.getPropertyValue('--d')) || 0;
      setTimeout(() => el.removeAttribute('data-reveal'), 1400 + delay);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    targets.forEach(([sel, dir, step]) => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.setAttribute('data-reveal', dir);
      el.style.setProperty('--d', (i * step) + 'ms');
      io.observe(el);
    });
  });
})();


// ===== STATS COUNTER =====
(() => {
  const start = () => {
    const nums = document.querySelectorAll('.hero-panel dt');
    if (!nums.length) return;

    const run = (el, end, suffix, dur) => {
      const t0 = performance.now();
      const tick = now => {
        const p = Math.min((now - t0) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 4); // easeOutQuart
        el.textContent = Math.round(end * eased) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    nums.forEach((el, i) => {
      const m = el.textContent.trim().match(/^(\d+)(.*)$/);
      if (!m) return;
      const end = +m[1], suffix = m[2];

      el.textContent = '0' + suffix;
      setTimeout(() => run(el, end, suffix, 2400), 600 + i * 300);

      // pag hover, uulitin
      el.addEventListener('mouseenter', () => run(el, end, suffix, 1400));
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();

// "Real estate is our core": animation kapag nakikita na
const core = document.querySelector('.core-text');
if (core && 'IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  core.classList.add('core-anim');
  new IntersectionObserver(([e], obs) => {
    if (e.isIntersecting) { core.classList.add('in'); obs.disconnect(); }
  }, { threshold: 0.3 }).observe(core);
}

// About: values cards, pasok isa-isa kapag nakikita
const values = document.querySelector('.values');
if (values && 'IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  values.classList.add('values-anim');
  new IntersectionObserver(([e], obs) => {
    if (!e.isIntersecting) return;
    values.classList.add('in');
    setTimeout(() => values.classList.add('done'), 1300);
    obs.disconnect();
  }, { threshold: 0.25 }).observe(values);
}

// About: org chart, gumagawa ng avatar na may initials at nag-a-animate kapag nakikita
(() => {
  const org = document.querySelector('.org');
  if (!org) return;

  const initials = name => {
    const w = name.trim().split(/\s+/).filter(x => !/^[A-Za-z]\.$/.test(x));
    return ((w[0] || '')[0] || '') + (w.length > 1 ? w[w.length - 1][0] : '');
  };

  org.querySelectorAll('.org-ceo, .org-node').forEach(box => {
    if (box.querySelector('.org-avatar')) return;
    const nameEl = box.classList.contains('org-ceo')
      ? box.querySelector('span')
      : box.querySelector('.org-co, strong');
    if (!nameEl) return;

    const av = document.createElement('div');
    av.className = 'org-avatar';
    av.setAttribute('aria-hidden', 'true');
    if (box.dataset.photo) {                       // optional: larawan sa halip na initials
      const img = document.createElement('img');
      img.src = box.dataset.photo; img.alt = '';
      av.appendChild(img);
    } else {
      av.textContent = initials(nameEl.textContent).toUpperCase();
    }
    box.prepend(av);
  });

  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    org.classList.add('org-anim');
    new IntersectionObserver(([e], obs) => {
      if (e.isIntersecting) { org.classList.add('in'); obs.disconnect(); }
    }, { threshold: 0.2 }).observe(org);
  }
})();

// About: "Who is MEP?" animation at nagbibilang na stats
(() => {
  const story = document.querySelector('.story');
  if (!story || !('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  story.classList.add('story-anim');
  const nums = story.querySelectorAll('[data-count]');
  nums.forEach(n => n.textContent = '0' + (n.dataset.suffix || ''));

  new IntersectionObserver(([e], obs) => {
    if (!e.isIntersecting) return;
    story.classList.add('in');
    obs.disconnect();

    nums.forEach((el, i) => {
      const end = +el.dataset.count, suffix = el.dataset.suffix || '';
      setTimeout(() => {
        const t0 = performance.now(), dur = 1800;
        const tick = now => {
          const p = Math.min((now - t0) / dur, 1);
          el.textContent = Math.round(end * (1 - Math.pow(1 - p, 4))) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }, 700 + i * 200);
    });
  }, { threshold: 0.25 }).observe(story);
})();

/* contact.js: ipadala ang contact form diretso sa Gmail compose.
   I-load pagkatapos ng main.js sa contact.html. */
(function () {
  // PALITAN ito ng Gmail address na tatanggap ng mga mensahe
  var TO_EMAIL = 'yourname@gmail.com';

  var form = document.getElementById('contactForm');
  if (!form) return;

  var success = form.querySelector('.form-success');

  function fieldOf(id) {
    var input = document.getElementById(id);
    return { input: input, box: input.closest('.field'), value: input.value.trim() };
  }

  function setInvalid(f, bad) {
    f.box.classList.toggle('invalid', bad);
    return !bad;
  }

  // Capture phase sa document: nauuna ito sa kahit anong submit handler ng main.js,
  // kaya hindi na lalabas ang lumang "Message sent" na hindi naman talaga nagpapadala.
  document.addEventListener('submit', function (e) {
    if (e.target !== form) return;
    e.preventDefault();
    e.stopImmediatePropagation();

    var name = fieldOf('name');
    var email = fieldOf('email');
    var phone = fieldOf('phone');
    var message = fieldOf('message');

    var okName = setInvalid(name, !name.value);
    var okEmail = setInvalid(email, !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value));
    var okPhone = setInvalid(phone, !phone.value);
    var okMsg = setInvalid(message, !message.value);

    if (!(okName && okEmail && okPhone && okMsg)) {
      var firstBad = form.querySelector('.field.invalid input, .field.invalid textarea');
      if (firstBad) firstBad.focus();
      return;
    }

    var subject = 'Website inquiry from ' + name.value;
    var body =
      'Name: ' + name.value + '\n' +
      'Email: ' + email.value + '\n' +
      'Phone: ' + phone.value + '\n\n' +
      message.value;

    var url =
      'https://mail.google.com/mail/?view=cm&fs=1' +
      '&to=' + encodeURIComponent(TO_EMAIL) +
      '&su=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(body);

    var win = window.open(url, '_blank', 'noopener');
    if (!win) window.location.href = url; // kung na-block ang popup

    if (success) {
      success.textContent = 'Gmail has opened with your message ready. Press Send there to complete your inquiry.';
      success.classList.add('show');
    }
  }, true);

  // Alisin ang pulang error habang nagta-type
  form.addEventListener('input', function (e) {
    var box = e.target.closest('.field');
    if (box) box.classList.remove('invalid');
  });
})();

// ===== BOOKING: i-disable ang office na booked na sa napiling date at time =====
(() => {
  const API_URL = 'PASTE_DITO_YUNG_/exec_URL'; // pareho sa nasa index.html

  const picker = document.getElementById('officePicker');
  const date = document.getElementById('bkDate');
  const timeInput = document.getElementById('bkTime');
  if (!picker || !date || !timeInput) return; // ibang page: huwag gumana

  let booked = [];

  const refreshOffices = () => {
    picker.querySelectorAll('.office-card').forEach(card => {
      const input = card.querySelector('input[name="office"]');
      const small = card.querySelector('.oc-body small');
      const taken = !!(date.value && timeInput.value && booked.some(b =>
        b.office === input.value && b.date === date.value && b.time === timeInput.value));

      input.disabled = taken;
      card.classList.toggle('is-booked', taken);
      if (!small.dataset.orig) small.dataset.orig = small.textContent;
      small.textContent = taken ? 'Already booked' : small.dataset.orig;
      if (taken && input.checked) input.checked = false;
    });
  };

  const loadBooked = () => {
    fetch(API_URL)
      .then(r => r.json())
      .then(res => { booked = res.booked || []; refreshOffices(); })
      .catch(() => {});
  };

  date.addEventListener('change', refreshOffices);
  timeInput.addEventListener('change', refreshOffices);
  window.loadBooked = loadBooked; // para matawag ng index.html pagkatapos mag-submit
  loadBooked();
})();