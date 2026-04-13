// Document ready function
// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
    // Initialize components
    initLanguageToggle();
    initDarkModeToggle();
    initAnimations();
    initFormValidation();
    initSmoothScrolling();
    initTypewriter();
    initProjectFilter();
    initNavHandlers();
    initBackToTop();
});

// Global reference for typewriter timeout to allow resetting
let typewriterTimeout;

// Language toggle functionality
function initLanguageToggle() {
  const languageToggles = document.querySelectorAll('.toggle-language');
  if (!languageToggles.length) return;

  const storedLang = localStorage.getItem('preferred-language') || 'en';
  switchLanguage(storedLang);

  languageToggles.forEach(languageToggle => {
    languageToggle.addEventListener('click', function (e) {
      e.preventDefault();
      const currentLang = document.documentElement.getAttribute('lang') || 'en';
      const newLang = currentLang === 'en' ? 'fr' : 'en';
      switchLanguage(newLang);
      localStorage.setItem('preferred-language', newLang);
    });
  });
}

function switchLanguage(lang) {
  document.documentElement.setAttribute('lang', lang);
  document.querySelectorAll('[data-en][data-fr]').forEach(el => {
    if (el.classList.contains('typewriter')) {
      // Special handling for typewriter: update data-words and restart
      const newWords = el.getAttribute(`data-${lang}`);
      el.setAttribute('data-words', newWords);
      initTypewriter(); // Restart typewriter with new words
    } else {
      el.textContent = el.getAttribute(`data-${lang}`);
    }
  });
  // Re-apply theme to ensure toggle button icons and aria-labels are correct after language switch
  applyTheme(document.body.classList.contains('light-mode'));
}


// Dark/Light mode toggle functionality
function initDarkModeToggle() {
  const darkModeToggles = document.querySelectorAll('.toggle-mode');
  if (!darkModeToggles.length) return;

  const savedTheme = localStorage.getItem('theme');
  const isLightMode = savedTheme === 'light';

  applyTheme(isLightMode);

  darkModeToggles.forEach(toggle => {
    toggle.addEventListener('click', function (e) {
      e.preventDefault();
      const currentlyLight = document.body.classList.toggle('light-mode');
      localStorage.setItem('theme', currentlyLight ? 'light' : 'dark');
      applyTheme(currentlyLight);
    });
  });
}

function applyTheme(isLightMode) {
  const body = document.body;
  const navbar = document.querySelector('.navbar');
  const settingsBtn = document.getElementById('settingsDropdown');

  // 1. Toggle light-mode class on <body>
  if (isLightMode) {
    body.classList.add('light-mode');
  } else {
    body.classList.remove('light-mode');
  }

  // 2. Update navbar color scheme
  if (navbar) {
    navbar.classList.toggle('navbar-light', isLightMode);
    navbar.classList.toggle('navbar-dark', !isLightMode);
  }

  // 3. Update settings button style (desktop)
  if (settingsBtn) {
    settingsBtn.classList.remove('btn-outline-light', 'btn-outline-dark');
    settingsBtn.classList.add(isLightMode ? 'btn-outline-dark' : 'btn-outline-light');
  }

  // 4. Update toggler icon color via class (optional)
  const togglerIcon = document.querySelector('.navbar-toggler-icon');
  if (togglerIcon) {
    togglerIcon.style.backgroundImage = isLightMode
      ? "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath stroke='black' stroke-width='2' stroke-linecap='round' stroke-miterlimit='10' d='M4 7h22M4 15h22M4 23h22'/%3E%3C/svg%3E\")"
      : "";
  }

  // 5. Update icon for all toggles, text content will be handled by language toggle
  document.querySelectorAll('.toggle-mode').forEach(toggle => {
    const icon = toggle.querySelector('i');
    if (icon) {
      icon.classList.remove('fas', 'fa-moon', 'fa-sun');
      icon.classList.add('fas', isLightMode ? 'fa-moon' : 'fa-sun');
    }
    toggle.setAttribute('aria-label', isLightMode ? 'Switch to dark mode' : 'Switch to light mode');
  });
}




// Scroll animations
function initAnimations() {
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('section').forEach(section => {
            section.classList.add('section-hidden');
            observer.observe(section);
        });

        document.querySelectorAll('.timeline-item').forEach((item, index) => {
            item.style.transitionDelay = `${index * 0.1}s`;
            item.classList.add('timeline-item-hidden');
            observer.observe(item);
        });

        document.querySelectorAll('.service-card').forEach((card, index) => {
            card.style.transitionDelay = `${index * 0.1}s`;
            card.classList.add('card-hidden');
            observer.observe(card);
        });
    }
}

// Form validation
function initFormValidation() {
    const contactForm = document.querySelector('#contact form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const nameField = document.getElementById('name');
        const emailField = document.getElementById('email');
        const messageField = document.getElementById('message');
        let isValid = true;

        if (!nameField.value.trim()) {
            markInvalid(nameField, 'Name is required');
            isValid = false;
        } else markValid(nameField);

        if (!emailField.value.trim()) {
            markInvalid(emailField, 'Email is required');
            isValid = false;
        } else if (!isValidEmail(emailField.value)) {
            markInvalid(emailField, 'Please enter a valid email address');
            isValid = false;
        } else markValid(emailField);

        if (!messageField.value.trim()) {
            markInvalid(messageField, 'Message is required');
            isValid = false;
        } else markValid(messageField);

        if (isValid) {
            showFormFeedback('success', 'Your message has been sent successfully!');
            contactForm.reset();
        }
    });

    const emailField = document.getElementById('email');
    if (emailField) {
        emailField.addEventListener('blur', function () {
            if (emailField.value.trim() && !isValidEmail(emailField.value)) {
                markInvalid(emailField, 'Please enter a valid email address');
            } else if (emailField.value.trim()) {
                markValid(emailField);
            }
        });
    }
}

function isValidEmail(email) {
    const re = /^[^S@]+@[^S@]+\.[^S@]+$/;
    return re.test(String(email).toLowerCase());
}

function markInvalid(field, message) {
    field.classList.add('is-invalid');
    field.classList.remove('is-valid');
    let feedback = field.nextElementSibling;
    if (!feedback || !feedback.classList.contains('invalid-feedback')) {
        feedback = document.createElement('div');
        feedback.className = 'invalid-feedback';
        field.parentNode.insertBefore(feedback, field.nextSibling);
    }
    feedback.textContent = message;
}

function markValid(field) {
    field.classList.remove('is-invalid');
    field.classList.add('is-valid');
    const feedback = field.nextElementSibling;
    if (feedback && feedback.classList.contains('invalid-feedback')) {
        feedback.textContent = '';
    }
}

function showFormFeedback(type, message) {
    const contactForm = document.querySelector('#contact form');
    if (!contactForm) return;
    const existingAlert = contactForm.querySelector('.alert');
    if (existingAlert) existingAlert.remove();
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} mt-3`;
    alert.textContent = message;
    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'btn-close';
    closeButton.setAttribute('data-bs-dismiss', 'alert');
    closeButton.setAttribute('aria-label', 'Close');
    alert.appendChild(closeButton);
    contactForm.parentNode.insertBefore(alert, contactForm.nextSibling);
    setTimeout(() => {
        alert.classList.add('fade');
        setTimeout(() => alert.remove(), 500);
    }, 5000);
}

function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          e.preventDefault();
          const yOffset = -70;
          const y = targetElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
          history.pushState(null, null, `#${targetId}`);
        }
      });
    });
  }
  
  

function initProjectFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    if (!filterButtons.length) return;

    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            const filter = this.getAttribute('data-filter');
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            document.querySelectorAll('.publication-item').forEach(item => { 
                if (filter === 'all' || item.classList.contains(filter)) {
                    item.style.display = 'flex'; 
                    setTimeout(() => item.classList.remove('filtered-out'), 10);
                } else {
                    item.classList.add('filtered-out');
                    setTimeout(() => item.style.display = 'none', 500);
                }
            });
        });
    });
}

function initTypewriter() {
    const element = document.querySelector('.typewriter');
    if (!element) return;
    
    // Clear existing timeout if restarting
    if (typewriterTimeout) clearTimeout(typewriterTimeout);

    const words = JSON.parse(element.getAttribute('data-words'));
    if (!words || !words.length) return;
    
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
        const currentWord = words[wordIndex];
        if (isDeleting) {
            element.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50;
        } else {
            element.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 150;
        }

        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            typeSpeed = 50;
            typewriterTimeout = setTimeout(type, 1500); // Pause after typing a word
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 150;
            typewriterTimeout = setTimeout(type, 500); // Pause before typing next word
        } else {
            typewriterTimeout = setTimeout(type, typeSpeed);
        }
    }
    type();
}

function initNavHandlers() {
    // Check if Bootstrap is available
    if (typeof bootstrap === 'undefined') {
        console.warn('Bootstrap is not loaded. Navigation handlers may not work correctly.');
        return;
    }

    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    const sections = document.querySelectorAll('section');

    function setActiveNavLink() {
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', setActiveNavLink);
    setActiveNavLink();

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 992 && navbarCollapse.classList.contains('show')) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                bsCollapse.hide();
            }
        });
    });
}

function initBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    if (!backToTopBtn) return;

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

function copyBibtex(id) {
    const text = document.getElementById(id).innerText;
    navigator.clipboard.writeText(text).then(() => {
      alert('BibTeX copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
}
