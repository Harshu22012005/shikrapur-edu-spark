
// Main JavaScript for RS Classes Website

// DOM Elements
const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const navClose = document.getElementById('nav-close');
const navLinks = document.querySelectorAll('.nav__link');
const header = document.getElementById('header');
const enquiryModal = document.getElementById('enquiry-modal');
const contactForm = document.getElementById('contact-form');
const enquiryForm = document.getElementById('enquiry-form');

// Mobile Navigation
if (navToggle) {
  navToggle.addEventListener('click', () => {
    navMenu.classList.add('show-menu');
  });
}

if (navClose) {
  navClose.addEventListener('click', () => {
    navMenu.classList.remove('show-menu');
  });
}

// Close mobile menu when clicking nav links
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('show-menu');
  });
});

// Header scroll effect
window.addEventListener('scroll', () => {
  if (window.scrollY >= 100) {
    header.classList.add('scroll-header');
  } else {
    header.classList.remove('scroll-header');
  }
});

// Smooth scrolling for navigation links
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    
    if (targetSection) {
      const offsetTop = targetSection.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
    
    // Update active link
    navLinks.forEach(navLink => navLink.classList.remove('active-link'));
    link.classList.add('active-link');
  });
});

// Active section highlighting
window.addEventListener('scroll', () => {
  const sections = document.querySelectorAll('section[id]');
  const scrollY = window.pageYOffset;

  sections.forEach(section => {
    const sectionHeight = section.offsetHeight;
    const sectionTop = section.offsetTop - 100;
    const sectionId = section.getAttribute('id');
    const navLink = document.querySelector(`.nav__link[href="#${sectionId}"]`);

    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      navLinks.forEach(link => link.classList.remove('active-link'));
      if (navLink) navLink.classList.add('active-link');
    }
  });
});

// Counter Animation for Statistics
function animateCounter(element, target, duration = 2000) {
  let start = 0;
  const increment = target / (duration / 16);
  
  const updateCounter = () => {
    start += increment;
    if (start < target) {
      element.textContent = Math.floor(start);
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = target;
    }
  };
  
  updateCounter();
}

// Intersection Observer for scroll animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate');
      
      // Animate counters when about section is visible
      if (entry.target.id === 'about') {
        const counters = entry.target.querySelectorAll('.stat__number');
        counters.forEach(counter => {
          const target = parseInt(counter.getAttribute('data-target'));
          animateCounter(counter, target);
        });
      }
    }
  });
}, observerOptions);

// Observe all sections for scroll animations
document.querySelectorAll('section').forEach(section => {
  section.classList.add('scroll-animation');
  observer.observe(section);
});

// Testimonials Carousel
class TestimonialsCarousel {
  constructor() {
    this.currentSlide = 0;
    this.slides = document.querySelectorAll('.testimonial__card');
    this.dots = document.querySelectorAll('.dot');
    this.prevBtn = document.querySelector('.testimonial__btn--prev');
    this.nextBtn = document.querySelector('.testimonial__btn--next');
    
    this.init();
  }
  
  init() {
    this.showSlide(0);
    this.bindEvents();
    this.autoPlay();
  }
  
  bindEvents() {
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.prevSlide());
    }
    
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.nextSlide());
    }
    
    this.dots.forEach((dot, index) => {
      dot.addEventListener('click', () => this.showSlide(index));
    });
  }
  
  showSlide(index) {
    // Hide all slides
    this.slides.forEach(slide => slide.classList.remove('active'));
    this.dots.forEach(dot => dot.classList.remove('active'));
    
    // Show current slide
    if (this.slides[index]) {
      this.slides[index].classList.add('active');
      this.dots[index].classList.add('active');
      this.currentSlide = index;
    }
  }
  
  nextSlide() {
    const next = (this.currentSlide + 1) % this.slides.length;
    this.showSlide(next);
  }
  
  prevSlide() {
    const prev = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
    this.showSlide(prev);
  }
  
  autoPlay() {
    setInterval(() => {
      this.nextSlide();
    }, 5000);
  }
}

// Initialize testimonials carousel
if (document.querySelector('.testimonials__carousel')) {
  new TestimonialsCarousel();
}

// Enquiry Modal Functions
function openEnquiryForm(courseName = '') {
  enquiryModal.classList.add('active');
  document.body.style.overflow = 'hidden';
  
  // Pre-fill course if specified
  if (courseName) {
    const courseSelect = document.getElementById('enquiry-course');
    if (courseSelect) {
      const options = courseSelect.options;
      for (let i = 0; i < options.length; i++) {
        if (options[i].text.includes(courseName)) {
          courseSelect.selectedIndex = i;
          break;
        }
      }
    }
  }
}

function closeEnquiryForm() {
  enquiryModal.classList.remove('active');
  document.body.style.overflow = 'auto';
}

// Close modal when clicking outside
enquiryModal.addEventListener('click', (e) => {
  if (e.target === enquiryModal) {
    closeEnquiryForm();
  }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && enquiryModal.classList.contains('active')) {
    closeEnquiryForm();
  }
});

// Form Submissions
function handleFormSubmission(form, successMessage) {
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);
  
  // Simulate form submission
  console.log('Form submitted:', data);
  
  // Show success message
  showNotification(successMessage, 'success');
  
  // Reset form
  form.reset();
  
  // Close modal if it's the enquiry form
  if (form.id === 'enquiry-form') {
    closeEnquiryForm();
  }
}

// Contact Form
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    handleFormSubmission(contactForm, 'Thank you! Your message has been sent successfully. We will contact you soon.');
  });
}

// Enquiry Form
if (enquiryForm) {
  enquiryForm.addEventListener('submit', (e) => {
    e.preventDefault();
    handleFormSubmission(enquiryForm, 'Thank you for your enquiry! Our team will contact you within 24 hours.');
  });
}

// Notification System
function showNotification(message, type = 'success') {
  // Remove existing notifications
  const existingNotifications = document.querySelectorAll('.notification');
  existingNotifications.forEach(notification => notification.remove());
  
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification--${type}`;
  notification.innerHTML = `
    <div class="notification__content">
      <span class="notification__icon">${type === 'success' ? '✓' : '⚠'}</span>
      <span class="notification__message">${message}</span>
      <button class="notification__close" onclick="this.parentElement.parentElement.remove()">✕</button>
    </div>
  `;
  
  // Add styles
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#10b981' : '#ef4444'};
    color: white;
    padding: 1rem;
    border-radius: 0.5rem;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    z-index: 10000;
    animation: slideInRight 0.3s ease;
    max-width: 400px;
  `;
  
  // Add to document
  document.body.appendChild(notification);
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }
  }, 5000);
}

// Add notification animations
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
  
  .notification__content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .notification__close {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    font-size: 1.2rem;
    margin-left: auto;
  }
`;
document.head.appendChild(notificationStyles);

// Utility Functions
function scrollToSection(selector) {
  const element = document.querySelector(selector);
  if (element) {
    const offsetTop = element.offsetTop - 80;
    window.scrollTo({
      top: offsetTop,
      behavior: 'smooth'
    });
  }
}

// Gallery lightbox effect (simple version)
document.querySelectorAll('.gallery__item').forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('.gallery__img');
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
      <div class="lightbox__content">
        <img src="${img.src}" alt="${img.alt}" class="lightbox__img">
        <button class="lightbox__close">✕</button>
      </div>
    `;
    
    lightbox.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.9);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      animation: fadeIn 0.3s ease;
    `;
    
    const lightboxContent = lightbox.querySelector('.lightbox__content');
    lightboxContent.style.cssText = `
      position: relative;
      max-width: 90%;
      max-height: 90%;
    `;
    
    const lightboxImg = lightbox.querySelector('.lightbox__img');
    lightboxImg.style.cssText = `
      width: 100%;
      height: 100%;
      object-fit: contain;
      border-radius: 0.5rem;
    `;
    
    const lightboxClose = lightbox.querySelector('.lightbox__close');
    lightboxClose.style.cssText = `
      position: absolute;
      top: -40px;
      right: 0;
      background: none;
      border: none;
      color: white;
      font-size: 2rem;
      cursor: pointer;
    `;
    
    lightboxClose.addEventListener('click', () => {
      lightbox.style.animation = 'fadeOut 0.3s ease';
      setTimeout(() => lightbox.remove(), 300);
    });
    
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => lightbox.remove(), 300);
      }
    });
    
    document.body.appendChild(lightbox);
  });
});

// Add fadeOut animation for lightbox
const lightboxStyles = document.createElement('style');
lightboxStyles.textContent = `
  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }
`;
document.head.appendChild(lightboxStyles);

// Loading animation for page
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  
  setTimeout(() => {
    document.body.style.opacity = '1';
  }, 100);
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
  const hero = document.querySelector('.hero');
  const scrolled = window.pageYOffset;
  const rate = scrolled * -0.5;
  
  if (hero) {
    hero.style.transform = `translateY(${rate}px)`;
  }
});

// Add smooth hover effects to buttons
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('mouseenter', function() {
    this.style.transform = 'translateY(-2px)';
  });
  
  btn.addEventListener('mouseleave', function() {
    this.style.transform = 'translateY(0)';
  });
});

console.log('RS Classes Website initialized successfully! 🎓');
