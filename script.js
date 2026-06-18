// ============================================
// Mobile nav toggle
// ============================================
const navToggle = document.getElementById('navToggle');
const nav = document.getElementById('nav');

navToggle.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

nav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// ============================================
// Terminal typing effect (respects reduced motion)
// ============================================
const terminalBody = document.getElementById('terminalBody');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const lines = [
  { prompt: '$ whoami', output: '> Gajula Eshwar' },
  { prompt: '$ role --current', output: '> Aspiring Cloud & DevOps Engineer' },
  { prompt: '$ status', output: '> Building. Deploying. Learning.' }
];

function renderFullTerminal() {
  terminalBody.textContent = '';
  lines.forEach((l) => {
    const promptEl = document.createElement('span');
    promptEl.className = 'prompt';
    promptEl.textContent = l.prompt;

    const outputEl = document.createElement('span');
    outputEl.className = 'output';
    outputEl.textContent = l.output;

    terminalBody.append(promptEl, '\n', outputEl, '\n\n');
  });
}

function typeTerminal() {
  const cursor = document.createElement('span');
  cursor.className = 'cursor';
  cursor.innerHTML = '&nbsp;';

  let lineIndex = 0;
  let charIndex = 0;
  let typingPrompt = true;
  let activeSpan = null;

  function startSpan(className) {
    activeSpan = document.createElement('span');
    activeSpan.className = className;
    terminalBody.appendChild(activeSpan);
    terminalBody.appendChild(cursor);
  }

  function tick() {
    if (lineIndex >= lines.length) {
      return;
    }

    const current = lines[lineIndex];
    const text = typingPrompt ? current.prompt : current.output;

    if (charIndex === 0) {
      startSpan(typingPrompt ? 'prompt' : 'output');
    }

    if (charIndex < text.length) {
      activeSpan.textContent += text[charIndex];
      charIndex++;
      terminalBody.appendChild(cursor);
      setTimeout(tick, 28);
      return;
    }

    if (typingPrompt) {
      terminalBody.appendChild(document.createTextNode('\n'));
      typingPrompt = false;
      charIndex = 0;
      setTimeout(tick, 200);
    } else {
      terminalBody.appendChild(document.createTextNode('\n\n'));
      typingPrompt = true;
      charIndex = 0;
      lineIndex++;
      setTimeout(tick, 350);
    }
    terminalBody.appendChild(cursor);
  }

  tick();
}

if (prefersReducedMotion) {
  renderFullTerminal();
} else {
  typeTerminal();
}

// ============================================
// Active nav link highlighting on scroll
// ============================================
const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          link.style.color = link.getAttribute('href') === `#${id}` ? 'var(--ink)' : '';
        });
      }
    });
  },
  { rootMargin: '-40% 0px -50% 0px' }
);
sections.forEach((s) => observer.observe(s));

// ============================================
// Contact form — graceful submit feedback
// (Works once you replace the Formspree endpoint in index.html)
// ============================================
const contactForm = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');

contactForm.addEventListener('submit', async (e) => {
  if (contactForm.action.includes('YOUR_FORM_ID')) {
    // Endpoint not set up yet — let the user know instead of failing silently.
    e.preventDefault();
    formNote.textContent = 'Almost there — connect a Formspree endpoint to enable sending.';
    formNote.hidden = false;
    return;
  }

  e.preventDefault();
  const data = new FormData(contactForm);

  try {
    const response = await fetch(contactForm.action, {
      method: 'POST',
      body: data,
      headers: { Accept: 'application/json' }
    });

    if (response.ok) {
      formNote.textContent = 'Thanks — your message is on its way.';
      formNote.hidden = false;
      contactForm.reset();
    } else {
      formNote.textContent = 'Something went wrong. Please try again or email directly.';
      formNote.hidden = false;
    }
  } catch (err) {
    formNote.textContent = 'Network error — please try again or email directly.';
    formNote.hidden = false;
  }
});

// ============================================
// Footer year
// ============================================
document.getElementById('year').textContent = new Date().getFullYear();
