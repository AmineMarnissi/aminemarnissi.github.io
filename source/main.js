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
});

// Language toggle functionality
function initLanguageToggle() {
    const languageToggle = document.getElementById('toggleLanguage');
    if (!languageToggle) return;

    const storedLang = localStorage.getItem('preferred-language') || 'en';
    switchLanguage(storedLang);

    languageToggle.addEventListener('click', function () {
        const currentLang = document.documentElement.getAttribute('lang') || 'en';
        const newLang = currentLang === 'en' ? 'fr' : 'en';
        switchLanguage(newLang);
        localStorage.setItem('preferred-language', newLang);
    });

    function switchLanguage(lang) {
        document.documentElement.setAttribute('lang', lang);
        document.querySelectorAll('[data-en][data-fr]').forEach(el => {
            el.textContent = el.getAttribute(`data-${lang}`);
        });
        languageToggle.textContent = lang === 'en' ? 'Français' : 'English';
    }
}

// Dark/Light mode toggle functionality
function initDarkModeToggle() {
    const darkModeToggle = document.getElementById('toggleMode');
    if (!darkModeToggle) return;

    const savedTheme = localStorage.getItem('theme');
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
        document.body.classList.toggle('light-mode', savedTheme === 'light');
        updateDarkModeIcon(savedTheme === 'light');
    } else if (prefersDarkMode) {
        document.body.classList.remove('light-mode');
        updateDarkModeIcon(false);
    } else {
        document.body.classList.add('light-mode');
        updateDarkModeIcon(true);
    }

    darkModeToggle.addEventListener('click', function () {
        document.body.classList.toggle('light-mode');
        const isLightMode = document.body.classList.contains('light-mode');
        localStorage.setItem('theme', isLightMode ? 'light' : 'dark');
        updateDarkModeIcon(isLightMode);
    });
}

function updateDarkModeIcon(isLightMode) {
    const darkModeToggle = document.getElementById('toggleMode');
    if (!darkModeToggle) return;
    darkModeToggle.innerHTML = isLightMode ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    darkModeToggle.setAttribute('aria-label', isLightMode ? 'Switch to dark mode' : 'Switch to light mode');
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
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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
            document.querySelectorAll('.project-item').forEach(item => {
                if (filter === 'all' || item.classList.contains(filter)) {
                    item.style.display = 'block';
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
            typeSpeed = 1500;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 500;
        }
        setTimeout(type, typeSpeed);
    }
    setTimeout(type, 1000);
}

function initNavHandlers() {
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
            if (window.innerWidth < 992) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                bsCollapse.hide();
            }
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
  
// Publication filter functionality
const filterButtons = document.querySelectorAll('.filter-btn');
const publications = document.querySelectorAll('.publication-item');

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    document.querySelector('.filter-btn.active').classList.remove('active');
    button.classList.add('active');

    const filter = button.getAttribute('data-filter');

    publications.forEach(item => {
      if (filter === 'all') {
        item.style.display = 'flex';
      } else {
        item.style.display = item.classList.contains(filter) ? 'flex' : 'none';
      }
    });
  });
});

// Copy BibTeX function
function copyBibtex(elementId) {
  const bibText = document.getElementById(elementId).innerText;
  navigator.clipboard.writeText(bibText).then(() => {
    alert("BibTeX copied to clipboard!");
  }).catch(err => {
    console.error('Could not copy text: ', err);
  });
}

// Typewriter effect
document.addEventListener('DOMContentLoaded', function() {
  const element = document.getElementById('typedText');
  if (!element) return;
  
  const words = JSON.parse(element.getAttribute('data-words'));
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 100;
  
  function type() {
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
      element.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
    } else {
      element.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
    }
    
    if (!isDeleting && charIndex === currentWord.length) {
      isDeleting = true;
      typeSpeed = 50;
      setTimeout(type, 1500);
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typeSpeed = 150;
      setTimeout(type, 500);
    } else {
      setTimeout(type, typeSpeed);
    }
  }
  
  type();
});