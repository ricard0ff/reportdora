// DOM elements
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const contactForm = document.getElementById('contactForm');

// Smooth scroll function
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = section.offsetTop - headerHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// Mobile menu functionality
function initMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    let isMenuOpen = false;
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            isMenuOpen = !isMenuOpen;
            
            // Toggle menu visibility
            navLinks.style.display = isMenuOpen ? 'flex' : 'none';
            navLinks.style.position = isMenuOpen ? 'absolute' : 'static';
            navLinks.style.top = isMenuOpen ? '100%' : 'auto';
            navLinks.style.left = isMenuOpen ? '0' : 'auto';
            navLinks.style.right = isMenuOpen ? '0' : 'auto';
            navLinks.style.background = isMenuOpen ? 'var(--color-surface)' : 'transparent';
            navLinks.style.flexDirection = isMenuOpen ? 'column' : 'row';
            navLinks.style.padding = isMenuOpen ? 'var(--space-16)' : '0';
            navLinks.style.borderTop = isMenuOpen ? '1px solid var(--color-border)' : 'none';
            navLinks.style.boxShadow = isMenuOpen ? 'var(--shadow-md)' : 'none';
            
            // Animate hamburger menu
            const spans = mobileMenuToggle.querySelectorAll('span');
            if (isMenuOpen) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
        
        // Close mobile menu when clicking on a link
        const navLinksElements = navLinks.querySelectorAll('a');
        navLinksElements.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    isMenuOpen = false;
                    navLinks.style.display = 'none';
                    const spans = mobileMenuToggle.querySelectorAll('span');
                    spans[0].style.transform = 'none';
                    spans[1].style.opacity = '1';
                    spans[2].style.transform = 'none';
                }
            });
        });
        
        // Close mobile menu when window is resized to desktop
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                isMenuOpen = false;
                navLinks.style.display = 'flex';
                navLinks.style.position = 'static';
                navLinks.style.flexDirection = 'row';
                navLinks.style.background = 'transparent';
                navLinks.style.padding = '0';
                navLinks.style.borderTop = 'none';
                navLinks.style.boxShadow = 'none';
                
                const spans = mobileMenuToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }
}

// Form validation
function validateForm(formData) {
    const errors = [];
    
    if (!formData.get('name').trim()) {
        errors.push('Name is required');
    }
    
    if (!formData.get('email').trim()) {
        errors.push('Email is required');
    } else if (!isValidEmail(formData.get('email'))) {
        errors.push('Please enter a valid email address');
    }
    
    if (!formData.get('company').trim()) {
        errors.push('Organization name is required');
    }
    
    if (!formData.get('message').trim()) {
        errors.push('Please describe your current DORA compliance status');
    }
    
    return errors;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show form status
function showFormStatus(message, isError = false) {
    // Remove existing status messages
    const existingStatus = contactForm.querySelector('.form-status');
    if (existingStatus) {
        existingStatus.remove();
    }
    
    // Create new status message
    const statusDiv = document.createElement('div');
    statusDiv.className = `form-status ${isError ? 'status--error' : 'status--success'}`;
    statusDiv.style.marginBottom = 'var(--space-16)';
    statusDiv.innerHTML = `<p>${message}</p>`;
    
    // Insert status message after the form title
    const formTitle = contactForm.querySelector('h3');
    if (formTitle) {
        formTitle.parentNode.insertBefore(statusDiv, formTitle.nextSibling);
    } else {
        contactForm.insertBefore(statusDiv, contactForm.firstChild);
    }
    
    // Auto-remove after 7 seconds
    setTimeout(() => {
        if (statusDiv.parentNode) {
            statusDiv.remove();
        }
    }, 7000);
}

// Handle form submission
function initContactForm() {
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const errors = validateForm(formData);
            
            if (errors.length > 0) {
                showFormStatus(errors.join(', '), true);
                return;
            }
            
            // Add loading state
            contactForm.classList.add('loading');
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Scheduling Assessment...';
            
            try {
                // Simulate form submission (replace with actual endpoint)
                await simulateFormSubmission(formData);
                
                // Success
                showFormStatus('Thank you for requesting a DORA compliance assessment! Our regulatory experts will contact you within 48 hours to schedule your consultation.');
                contactForm.reset();
                
                // Track conversion (you can replace this with actual analytics)
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'form_submit', {
                        event_category: 'compliance',
                        event_label: 'dora_assessment_request'
                    });
                }
                
            } catch (error) {
                showFormStatus('Sorry, there was an error scheduling your assessment. Please try again or contact us directly at compliance@reportdora.com', true);
            } finally {
                // Remove loading state
                contactForm.classList.remove('loading');
                submitBtn.textContent = originalText;
            }
        });
    }
}

// Simulate form submission (always succeeds for demo purposes)
function simulateFormSubmission(formData) {
    return new Promise((resolve) => {
        // Simulate network delay
        setTimeout(() => {
            // Log form data for demonstration (remove in production)
            console.log('DORA Compliance Assessment Request:', {
                name: formData.get('name'),
                email: formData.get('email'),
                company: formData.get('company'),
                role: formData.get('role'),
                complianceStatus: formData.get('message')
            });
            // Always resolve successfully for this demo
            resolve();
        }, 2000);
    });
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Animate elements on scroll
    const animatedElements = document.querySelectorAll('.service-card, .challenge-card, .value-prop, .timeline-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Header scroll effect
function initHeaderScroll() {
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(var(--color-surface), 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = 'var(--color-surface)';
            header.style.backdropFilter = 'blur(10px)';
        }
    });
}

// DORA urgency messaging
function initUrgencyMessaging() {
    // Add urgency indicators for DORA compliance
    const urgentElements = document.querySelectorAll('.compliance-alert, .urgent-text');
    
    urgentElements.forEach(element => {
        // Add subtle animation to draw attention
        element.style.animation = 'pulse 3s infinite';
    });
    
    // Calculate days since DORA became mandatory
    const doraDate = new Date('2025-01-17');
    const currentDate = new Date();
    const daysSince = Math.floor((currentDate - doraDate) / (1000 * 60 * 60 * 24));
    
    if (daysSince >= 0) {
        // DORA is now mandatory - update messaging
        const statusElements = document.querySelectorAll('.compliance-alert .status');
        statusElements.forEach(status => {
            if (daysSince === 0) {
                status.textContent = '🚨 DORA Mandatory Today - January 17, 2025';
            } else {
                status.textContent = `🚨 DORA Mandatory - ${daysSince} days since enforcement began`;
            }
        });
    }
}

// Enhanced compliance tracking
function initComplianceTracking() {
    // Track key compliance-related interactions
    const complianceButtons = document.querySelectorAll('.btn--primary');
    const doraServiceLinks = document.querySelectorAll('a[href="#services"]');
    
    complianceButtons.forEach(button => {
        button.addEventListener('click', function() {
            const buttonText = this.textContent.toLowerCase();
            if (typeof gtag !== 'undefined') {
                gtag('event', 'compliance_cta_click', {
                    event_category: 'engagement',
                    event_label: buttonText.includes('assessment') ? 'assessment_request' : 'general_cta'
                });
            }
        });
    });
    
    doraServiceLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'dora_services_view', {
                    event_category: 'engagement',
                    event_label: 'services_navigation'
                });
            }
        });
    });
}

// Form field enhancements for compliance context
function initFormEnhancements() {
    const roleSelect = document.getElementById('role');
    const messageField = document.getElementById('message');
    
    if (roleSelect) {
        roleSelect.addEventListener('change', function() {
            const selectedRole = this.value;
            
            // Update message placeholder based on role
            if (messageField) {
                let placeholder = 'Please describe your current compliance status, specific challenges, and urgent requirements...';
                
                switch(selectedRole) {
                    case 'compliance-officer':
                        placeholder = 'Please describe your current DORA compliance status, any gaps identified, and specific regulatory requirements you need assistance with...';
                        break;
                    case 'risk-manager':
                        placeholder = 'Please outline your ICT risk management challenges, current assessment status, and areas where you need compliance support...';
                        break;
                    case 'ciso':
                        placeholder = 'Please describe your organization\'s digital resilience posture, testing requirements, and incident management capabilities...';
                        break;
                    case 'ceo':
                        placeholder = 'Please provide an overview of your organization\'s DORA compliance priorities, timeline concerns, and strategic requirements...';
                        break;
                }
                
                messageField.placeholder = placeholder;
            }
        });
    }
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initContactForm();
    initScrollAnimations();
    initHeaderScroll();
    initUrgencyMessaging();
    initComplianceTracking();
    initFormEnhancements();
    
    // Handle navigation clicks
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });
    
    // Add keyboard navigation support
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // Close mobile menu if open
            const navLinks = document.querySelector('.nav-links');
            if (window.innerWidth <= 768 && navLinks.style.display === 'flex') {
                mobileMenuToggle.click();
            }
        }
    });
    
    // Add focus management for accessibility
    const focusableElements = document.querySelectorAll('button, a, input, select, textarea');
    focusableElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.setAttribute('data-focus-visible', 'true');
        });
        
        element.addEventListener('blur', function() {
            this.removeAttribute('data-focus-visible');
        });
    });
});

// Handle page load performance
window.addEventListener('load', function() {
    // Fade in page content
    document.body.style.opacity = '1';
    
    // Initialize any lazy loading or performance optimizations
    console.log('ReportDora DORA Compliance landing page loaded successfully');
    
    // Preload critical compliance resources
    const criticalLinks = document.querySelectorAll('a[href*="compliance"], a[href*="dora"]');
    criticalLinks.forEach(link => {
        if (link.href && !link.href.startsWith('#')) {
            const preloadLink = document.createElement('link');
            preloadLink.rel = 'prefetch';
            preloadLink.href = link.href;
            document.head.appendChild(preloadLink);
        }
    });
});

// Add utility functions for compliance context
function formatComplianceDate(date) {
    return new Intl.DateTimeFormat('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }).format(date);
}

function calculateComplianceUrgency() {
    const doraDate = new Date('2025-01-17');
    const currentDate = new Date();
    const daysSince = Math.floor((currentDate - doraDate) / (1000 * 60 * 60 * 24));
    
    return {
        daysSinceMandatory: Math.max(0, daysSince),
        isOverdue: daysSince > 0,
        urgencyLevel: daysSince > 90 ? 'critical' : daysSince > 0 ? 'high' : 'medium'
    };
}

// Export functions for potential external use
window.ReportDoraCompliance = {
    scrollToSection,
    calculateComplianceUrgency,
    formatComplianceDate
};