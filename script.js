// ===================================
// Loader
// ===================================
const loader = document.getElementById('loader');

window.addEventListener('load', () => {
    document.body.classList.add('loading');
    
    setTimeout(() => {
        loader.classList.add('hidden');
        document.body.classList.remove('loading');
    }, 2500);
});

// ===================================
// Custom Cursor
// ===================================
const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursor-follower');
const cursorText = cursor.querySelector('.cursor-text');

let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateCursor() {
    // Smooth cursor movement
    cursorX += (mouseX - cursorX) * 0.2;
    cursorY += (mouseY - cursorY) * 0.2;
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    
    // Smoother follower
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;
    cursorFollower.style.left = followerX + 'px';
    cursorFollower.style.top = followerY + 'px';
    
    requestAnimationFrame(animateCursor);
}
animateCursor();

// Cursor hover effects
const cursorTargets = document.querySelectorAll('[data-cursor]');
cursorTargets.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.classList.add('expanded');
        cursorFollower.classList.add('hidden');
        cursorText.textContent = el.getAttribute('data-cursor');
    });
    
    el.addEventListener('mouseleave', () => {
        cursor.classList.remove('expanded');
        cursorFollower.classList.remove('hidden');
        cursorText.textContent = '';
    });
});

// Links and buttons hover
const hoverElements = document.querySelectorAll('a, button, .project-card, .skill-category');
hoverElements.forEach(el => {
    if (!el.hasAttribute('data-cursor')) {
        el.addEventListener('mouseenter', () => {
            cursorFollower.style.transform = 'scale(1.5)';
            cursorFollower.style.opacity = '0.3';
        });
        el.addEventListener('mouseleave', () => {
            cursorFollower.style.transform = 'scale(1)';
            cursorFollower.style.opacity = '0.5';
        });
    }
});

// ===================================
// Magnetic Elements
// ===================================
const magneticElements = document.querySelectorAll('[data-magnetic]');

magneticElements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });
    
    el.addEventListener('mouseleave', () => {
        el.style.transform = 'translate(0, 0)';
    });
});

// ===================================
// Theme Toggle
// ===================================
const themeToggle = document.getElementById('theme-toggle');

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

function getTheme() {
    return localStorage.getItem('theme') || 
           (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
}

setTheme(getTheme());

themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
});

// ===================================
// Progress Bar
// ===================================
const progressBar = document.getElementById('progress-bar');

window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = scrollTop / docHeight;
    progressBar.style.transform = `scaleX(${scrollPercent})`;
});

// ===================================
// Particle Background
// ===================================
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');

let particles = [];
const particleCount = 50;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
    constructor() {
        this.reset();
    }
    
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.2;
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }
    
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 255, 136, ${this.opacity})`;
        ctx.fill();
    }
}

for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });
    
    // Draw connections
    particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach(p2 => {
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 150) {
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.strokeStyle = `rgba(0, 255, 136, ${0.1 * (1 - distance / 150)})`;
                ctx.stroke();
            }
        });
    });
    
    requestAnimationFrame(animateParticles);
}

animateParticles();

// ===================================
// Typing Effect
// ===================================
const typingElements = document.querySelectorAll('.typing-text');

typingElements.forEach(el => {
    const text = el.getAttribute('data-text');
    let index = 0;
    
    function type() {
        if (index < text.length) {
            el.textContent = text.slice(0, index + 1);
            index++;
            setTimeout(type, 50 + Math.random() * 50);
        }
    }
    
    // Start typing after loader
    setTimeout(type, 2600);
});

// ===================================
// Smooth Scroll
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===================================
// Video Interaction
// ===================================
const projectFeatured = document.querySelector('.project-featured');
const video = document.querySelector('.project-video');

if (projectFeatured && video) {
    projectFeatured.addEventListener('mouseenter', () => video.play());
    projectFeatured.addEventListener('mouseleave', () => video.pause());
    projectFeatured.addEventListener('click', () => {
        video.paused ? video.play() : video.pause();
    });
}

// ===================================
// Counter Animation
// ===================================
const counters = document.querySelectorAll('[data-count]');

function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    function update() {
        current += step;
        if (current < target) {
            el.textContent = Math.floor(current);
            requestAnimationFrame(update);
        } else {
            el.textContent = target;
        }
    }
    
    update();
}

// ===================================
// Skill Bars Animation
// ===================================
const skillItems = document.querySelectorAll('.skill-item');

function animateSkillBars() {
    skillItems.forEach(item => {
        const level = item.getAttribute('data-skill');
        const fill = item.querySelector('.skill-fill');
        fill.style.setProperty('--skill-level', level + '%');
        item.classList.add('visible');
    });
}

// ===================================
// Intersection Observer
// ===================================
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

// For counters
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

counters.forEach(counter => counterObserver.observe(counter));

// For skill bars
const skillsSection = document.querySelector('.skills');
const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateSkillBars();
            skillsObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

if (skillsSection) skillsObserver.observe(skillsSection);

// For general reveal animations
const revealElements = document.querySelectorAll('.section-header, .project-featured, .project-card, .about-container, .timeline-item, .repo-card, .skill-category');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
        }
    });
}, { ...observerOptions, threshold: 0.05 });

revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(40px)';
    el.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
    revealObserver.observe(el);
});

// ===================================
// Split Text Animation
// ===================================
const splitTextElements = document.querySelectorAll('.split-text');

splitTextElements.forEach(el => {
    const text = el.textContent;
    el.innerHTML = '';
    
    text.split('').forEach((char, i) => {
        const span = document.createElement('span');
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.display = 'inline-block';
        span.style.opacity = '0';
        span.style.transform = 'translateY(40px)';
        span.style.transition = `opacity 0.5s ease ${i * 0.02}s, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.02}s`;
        el.appendChild(span);
    });
});

const splitObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('span').forEach(span => {
                span.style.opacity = '1';
                span.style.transform = 'translateY(0)';
            });
            splitObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

splitTextElements.forEach(el => splitObserver.observe(el));

// ===================================
// Tilt Effect
// ===================================
const tiltElements = document.querySelectorAll('[data-tilt]');

tiltElements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        
        el.style.transform = `perspective(1000px) rotateX(${y * -20}deg) rotateY(${x * 20}deg) scale(1.05)`;
    });
    
    el.addEventListener('mouseleave', () => {
        el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    });
});

// ===================================
// Parallax on Scroll
// ===================================
const parallaxElements = document.querySelectorAll('.hero-gradient, .contact-gradient');

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    
    parallaxElements.forEach(el => {
        const speed = 0.3;
        el.style.transform = `translate(0, ${scrollY * speed}px)`;
    });
});

// ===================================
// Text Scramble Effect
// ===================================
class TextScramble {
    constructor(el) {
        this.el = el;
        this.chars = '!<>-_\\/[]{}—=+*^?#________';
        this.update = this.update.bind(this);
    }
    
    setText(newText) {
        const oldText = this.el.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise(resolve => this.resolve = resolve);
        this.queue = [];
        
        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * 40);
            const end = start + Math.floor(Math.random() * 40);
            this.queue.push({ from, to, start, end });
        }
        
        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }
    
    update() {
        let output = '';
        let complete = 0;
        
        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i];
            
            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.chars[Math.floor(Math.random() * this.chars.length)];
                    this.queue[i].char = char;
                }
                output += `<span style="color: var(--accent)">${char}</span>`;
            } else {
                output += from;
            }
        }
        
        this.el.innerHTML = output;
        
        if (complete === this.queue.length) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }
}

// Apply to section titles on hover
document.querySelectorAll('.section-title:not(.split-text)').forEach(title => {
    const originalText = title.textContent;
    const scramble = new TextScramble(title);
    
    title.addEventListener('mouseenter', () => {
        scramble.setText(originalText);
    });
});

// ===================================
// Hover Sound Effect (Optional)
// ===================================
// Uncomment to enable subtle hover sounds
/*
const hoverSound = new Audio('data:audio/wav;base64,UklGRl9vT19...');
hoverSound.volume = 0.1;

document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => {
        hoverSound.currentTime = 0;
        hoverSound.play().catch(() => {});
    });
});
*/

// ===================================
// Keyboard Shortcuts
// ===================================
document.addEventListener('keydown', (e) => {
    // T for theme toggle
    if (e.key === 't' && e.shiftKey) {
        themeToggle.click();
    }
    
    // Escape to scroll to top
    if (e.key === 'Escape') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

// ===================================
// Console Easter Egg
// ===================================
console.log(`
%c Michael Agbo %c Robotics & Automation Engineer 

%c Looking for opportunities? Let's talk!
%c apochibishop@gmail.com

`, 
'background: #00ff88; color: #000; padding: 8px 16px; font-weight: bold; font-size: 16px;',
'color: #00ff88; padding: 8px 0;',
'color: #888;',
'color: #fff;'
);

// ===================================
// Initialize
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🤖 Portfolio v2 loaded with enhanced animations!');
});

// ===================================
// GitHub Repositories (Auto Sync)
// ===================================
(function () {
    function escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function formatRelativeDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const dayMs = 1000 * 60 * 60 * 24;
        const days = Math.floor(diffMs / dayMs);

        if (days <= 0) return 'Updated today';
        if (days === 1) return 'Updated 1 day ago';
        if (days < 30) return `Updated ${days} days ago`;

        const months = Math.floor(days / 30);
        if (months === 1) return 'Updated 1 month ago';
        if (months < 12) return `Updated ${months} months ago`;

        const years = Math.floor(months / 12);
        return years === 1 ? 'Updated 1 year ago' : `Updated ${years} years ago`;
    }

    function getLangClass(language) {
        if (!language) return 'code';
        return language.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }

    function buildRepoCard(repo) {
        const description = repo.description || 'No description provided.';
        const language = repo.language || 'N/A';

        return `
            <a href="${escapeHtml(repo.html_url)}" target="_blank" rel="noopener noreferrer" class="repo-card" data-cursor="View Repo">
                <div class="repo-header">
                    <svg class="repo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                    </svg>
                    <span class="repo-visibility">${repo.private ? 'Private' : 'Public'}</span>
                </div>
                <h4 class="repo-name">${escapeHtml(repo.name)}</h4>
                <p class="repo-desc">${escapeHtml(description)}</p>
                <div class="repo-footer">
                    <div class="repo-lang">
                        <span class="lang-dot ${escapeHtml(getLangClass(language))}"></span>
                        <span>${escapeHtml(language)}</span>
                    </div>
                    <div class="repo-stats">
                        <span>Stars ${repo.stargazers_count || 0}</span>
                        <span>${formatRelativeDate(repo.updated_at)}</span>
                    </div>
                </div>
            </a>
        `;
    }

    function bindCursorTargets(targets) {
        if (typeof cursor === 'undefined' || typeof cursorFollower === 'undefined' || typeof cursorText === 'undefined') return;

        targets.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('expanded');
                cursorFollower.classList.add('hidden');
                cursorText.textContent = el.getAttribute('data-cursor') || '';
            });

            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('expanded');
                cursorFollower.classList.remove('hidden');
                cursorText.textContent = '';
            });
        });
    }

    function updateGitHubStats(profile, repos) {
        const totalStars = Array.isArray(repos)
            ? repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0)
            : 0;

        const statItems = document.querySelectorAll('.github-stats .stat-item');
        statItems.forEach(item => {
            const label = item.querySelector('.stat-label');
            const number = item.querySelector('.stat-number');
            if (!label || !number) return;

            const key = label.textContent.trim().toLowerCase();
            if (key === 'repositories') number.setAttribute('data-count', String(profile.public_repos || 0));
            if (key === 'stars') number.setAttribute('data-count', String(totalStars));
            if (key === 'followers') number.setAttribute('data-count', String(profile.followers || 0));
        });
    }

    async function loadLatestGitHubRepos() {
        const repoGrid = document.getElementById('repo-grid');
        if (!repoGrid) return;

        const username = repoGrid.getAttribute('data-github-user') || 'mykael02';
        const limit = Number(repoGrid.getAttribute('data-repo-limit') || 6);

        try {
            const [reposResponse, profileResponse] = await Promise.all([
                fetch(`https://api.github.com/users/${username}/repos?sort=updated&direction=desc&per_page=${limit}&type=owner`),
                fetch(`https://api.github.com/users/${username}`)
            ]);

            if (!reposResponse.ok) throw new Error('Failed to load repositories');

            const repos = await reposResponse.json();
            if (!Array.isArray(repos) || repos.length === 0) {
                repoGrid.innerHTML = '<p class="repo-loading">No public repositories found yet.</p>';
                return;
            }

            repoGrid.innerHTML = repos.map(buildRepoCard).join('');
            bindCursorTargets(repoGrid.querySelectorAll('[data-cursor]'));

            if (profileResponse.ok) {
                const profile = await profileResponse.json();
                updateGitHubStats(profile, repos);
            }
        } catch (error) {
            repoGrid.innerHTML = '<p class="repo-loading">Unable to load repositories right now. Please try again later.</p>';
            console.error('GitHub API error:', error);
        }
    }

    document.addEventListener('DOMContentLoaded', loadLatestGitHubRepos);
})();
