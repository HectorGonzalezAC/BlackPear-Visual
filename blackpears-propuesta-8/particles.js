// particles.js - Fondo de partículas entrelazadas (conexiones dinámicas)
// particles.js - Fondo de partículas entrelazadas en tonos morados más brillantes
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];
let mouseX = null, mouseY = null;

const COUNT = 120;
const MAX_DIST = 200;
const MOUSE_RADIUS = 300;
const MOUSE_FORCE = 0.3;

class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.radius = Math.random() * 2.5 + 1.5;
        // tonos morados más brillantes
        const purpleShades = ['183, 148, 244', '155, 93, 229', '139, 92, 246', '168, 85, 247'];
        const chosen = purpleShades[Math.floor(Math.random() * purpleShades.length)];
        this.color = `rgba(${chosen}, ${Math.random() * 0.5 + 0.3})`;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        if (mouseX && mouseY) {
            const dx = this.x - mouseX;
            const dy = this.y - mouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < MOUSE_RADIUS) {
                const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
                const angle = Math.atan2(dy, dx);
                this.x += Math.cos(angle) * force * MOUSE_FORCE;
                this.y += Math.sin(angle) * force * MOUSE_FORCE;
            }
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

function init() {
    particles = [];
    for (let i = 0; i < COUNT; i++) {
        particles.push(new Particle());
    }
}

function connect() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < MAX_DIST) {
                const opacity = 1 - dist / MAX_DIST;
                ctx.strokeStyle = `rgba(183, 148, 244, ${opacity * 0.3})`; // conexiones más visibles
                ctx.lineWidth = 0.8;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}

function animate() {
    ctx.clearRect(0, 0, width, height);
    connect();
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animate);
}

function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    init();
}

window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

window.addEventListener('mouseleave', () => {
    mouseX = null;
    mouseY = null;
});

window.addEventListener('resize', resize);

resize();
animate();