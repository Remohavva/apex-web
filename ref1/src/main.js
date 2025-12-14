import './style.css'
import Lenis from 'lenis'

// Initialize Lenis for smooth scrolling
const lenis = new Lenis({
  autoRaf: true,
});


// --- 1. BOOT SEQUENCE ---
const bootScreen = document.getElementById('boot-screen');
const bootLog = document.getElementById('boot-log');
const bootBar = document.getElementById('boot-bar');
const logs = [
  "INITIALIZING KERNEL...",
  "LOADING ASSETS...",
  "BYPASSING FIREWALLS...",
  "ESTABLISHING CONNECTION...",
  "ACCESS GRANTED."
];

let logIndex = 0;

function runBoot() {
  if (!bootScreen || !bootLog || !bootBar) return;

  // Logic to show boot screen:
  // 1. Show on Refresh (Reload)
  // 2. Show on First Entry (No referrer or external referrer)
  // 3. Hide on Internal Navigation (Referrer is same domain)

  const navEntry = performance.getEntriesByType("navigation")[0];
  const isReload = navEntry ? navEntry.type === 'reload' : false;
  const isInternal = document.referrer && document.referrer.includes(window.location.host);

  // If it's NOT a reload AND it IS internal navigation -> Skip Boot
  // Special check: ensure we don't skip if we are already running (logIndex > 0 prevents loop issue if logic was inside)
  // But wait, this function is recursive. 
  // Should only check this logic ONCE at start.

  if (logIndex === 0) {
    if (!isReload && isInternal) {
      bootScreen.style.display = 'none';
      bootScreen.remove();
      return;
    }
  }

  if (logIndex < logs.length) {
    const div = document.createElement('div');
    div.className = 'boot-line';
    div.textContent = `> ${logs[logIndex]}`;
    bootLog.appendChild(div);

    // Progress bar
    const progress = ((logIndex + 1) / logs.length) * 100;
    bootBar.style.width = `${progress}%`;

    logIndex++;
    setTimeout(runBoot, 300); // Speed of text
  } else {
    setTimeout(() => {
      bootScreen.style.transition = "opacity 0.5s ease";
      bootScreen.style.opacity = "0";
      setTimeout(() => {
        bootScreen.remove();
        // Removed sessionStorage setting to allow refresh to show it again
      }, 500);
    }, 500);
  }
}

// Start boot immediately
runBoot();

// --- 2. MOTHERBOARD CIRCUIT CANVAS ---
const circuitCanvas = document.getElementById('circuit-canvas');
let ctx;
let width, height;
const nodes = [];

if (circuitCanvas) {
  ctx = circuitCanvas.getContext('2d');

  function resizeCircuit() {
    width = document.documentElement.clientWidth; // Fix: Avoid scrollbar issues
    height = window.innerHeight;
    circuitCanvas.width = width;
    circuitCanvas.height = height;
  }
  window.addEventListener('resize', resizeCircuit);
  resizeCircuit();

  class CircuitNode {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.connections = [];
      this.active = Math.random() > 0.8;
      this.timer = 0;
    }
    draw() {
      if (!ctx) return;
      ctx.beginPath();
      ctx.arc(this.x, this.y, 3, 0, Math.PI * 2); // Thicker nodes
      ctx.fillStyle = this.active ? '#FFFFFF' : '#DC2626';
      ctx.fill();
    }
  }

  // Re-initialize nodes on start to fit screen
  function initNodes() {
    nodes.length = 0;
    for (let i = 0; i < 60; i++) {
      nodes.push(new CircuitNode(Math.random() * width, Math.random() * height));
    }
    // Connect nodes
    nodes.forEach(node => {
      const closest = nodes.filter(n => n !== node).sort((a, b) => {
        const distA = Math.hypot(a.x - node.x, a.y - node.y);
        const distB = Math.hypot(b.x - node.x, b.y - node.y);
        return distA - distB;
      }).slice(0, 2);
      node.connections = closest;
    });
  }
  initNodes();

  // Handle resize properly
  window.addEventListener('resize', () => {
    resizeCircuit();
    initNodes();
  });

  function animateCircuits() {
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);

    // Draw connections
    ctx.strokeStyle = '#DC2626';
    ctx.lineWidth = 1.5; // Thicker lines
    nodes.forEach(node => {
      node.connections.forEach(conn => {
        ctx.beginPath();
        ctx.moveTo(node.x, node.y);
        // Draw circuit trace lines (not just straight)
        const midX = (node.x + conn.x) / 2;
        ctx.lineTo(midX, node.y);
        ctx.lineTo(midX, conn.y);
        ctx.lineTo(conn.x, conn.y);
        ctx.stroke();
      });
    });

    // Draw nodes
    nodes.forEach(node => {
      // Optimization: Random flicker
      if (Math.random() > 0.99) node.active = !node.active;
      node.draw();
    });

    requestAnimationFrame(animateCircuits);
  }
  animateCircuits();
}

// --- 3. CURSOR & HOVER ---
const cursor = document.getElementById('cursor');
if (cursor) {
  // Only show custom cursor on non-touch devices
  if (matchMedia('(pointer:fine)').matches) {
    document.addEventListener('mousemove', (e) => {
      // Optimization: Direct style update without complex logic
      cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
    });

    // Dynamic trigger finding (delegation would be better but keeping simple for migration)
    const addHoverListeners = () => {
      const triggers = document.querySelectorAll('.hover-trigger, a, button, input, select');
      triggers.forEach(t => {
        // Prevent duplicate listeners if called multiple times
        t.removeEventListener('mouseenter', hoverEnter);
        t.removeEventListener('mouseleave', hoverLeave);
        t.addEventListener('mouseenter', hoverEnter);
        t.addEventListener('mouseleave', hoverLeave);
      });
    };

    const hoverEnter = () => cursor.classList.add('hovered');
    const hoverLeave = () => cursor.classList.remove('hovered');

    addHoverListeners();
    // Call this again if you dynamically add content
  } else {
    cursor.style.display = 'none'; // Hide custom cursor on mobile
  }
}

// --- 4. OPTIMIZED 3D TILT EFFECT ---
// Uses requestAnimationFrame to prevent layout thrashing

const cards = document.querySelectorAll('.tilt-card');

if (matchMedia('(pointer:fine)').matches) {
  cards.forEach(card => {
    let rect;
    let width, height;
    let mouseX, mouseY;
    let isHovering = false;

    const updateTilt = () => {
      if (!isHovering) return;


      // Calculate percentage (-1 to 1)
      const xPct = (mouseX / width - 0.5) * 2;
      const yPct = (mouseY / height - 0.5) * 2;

      // Rotation
      const rotateX = yPct * -10; // Invert Y for correct tilt
      const rotateY = xPct * 10;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

      requestAnimationFrame(updateTilt);
    };

    card.addEventListener('mouseenter', () => {
      isHovering = true;
      rect = card.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      requestAnimationFrame(updateTilt);
    });

    card.addEventListener('mousemove', (e) => {
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    });

    card.addEventListener('mouseleave', () => {
      isHovering = false;
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
    });
  });
}

// --- 5. TEXT DECRYPTION/SCRAMBLE ---
const scrambleElements = document.querySelectorAll('[data-scramble]');
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";

scrambleElements.forEach(el => {
  // Optimization: Store interval ID to prevent overlapping animations
  let intervalId = null;

  el.addEventListener('mouseenter', () => {
    if (intervalId) clearInterval(intervalId); // Clear any existing interval

    let iterations = 0;
    const targetText = el.dataset.scramble;

    intervalId = setInterval(() => {
      el.innerText = targetText.split("").map((letter, index) => {
        if (index < iterations) return targetText[index];
        return letters[Math.floor(Math.random() * 26)];
      }).join("");

      if (iterations >= targetText.length) {
        clearInterval(intervalId);
        intervalId = null;
      }
      iterations += 1 / 3;
    }, 30);
  });

  el.addEventListener('mouseleave', () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
      el.innerText = el.dataset.scramble; // Reset text instantly
    }
  });
});

// --- 6. SCROLL REVEAL & NAV HIGHLIGHT ---
const revealElements = document.querySelectorAll('.reveal-on-scroll');
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-link');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
    }
  });
}, { threshold: 0.1 });

revealElements.forEach(el => revealObserver.observe(el));

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        if (link.dataset.section === id) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
  });
}, { threshold: 0.5 });

sections.forEach(section => sectionObserver.observe(section));

// --- 7. MOBILE NAVIGATION (NEW) ---
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const mobileMenuClose = document.getElementById('mobile-menu-close');
const mobileLinks = document.querySelectorAll('.mobile-nav-link');

if (mobileMenuBtn && mobileMenu) {
  mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.remove('translate-x-full');
  });

  if (mobileMenuClose) {
    mobileMenuClose.addEventListener('click', () => {
      mobileMenu.classList.add('translate-x-full');
    });
  }

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('translate-x-full');
    });
  });
}
