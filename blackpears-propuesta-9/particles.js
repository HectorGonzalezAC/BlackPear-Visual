(function () {
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    let mouseX = 0, mouseY = 0;

    const PARTICLE_COUNT = 120;
    const CONNECT_DISTANCE = 150;
    const MOUSE_REPEL_RADIUS = 120;
    const MOUSE_REPEL_FORCE = 0.5;

    function resizeCanvas() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.8;
            this.vy = (Math.random() - 0.5) * 0.8;
            this.size = Math.random() * 3 + 1.5; // 1.5 a 4.5
            this.baseOpacity = Math.random() * 0.5 + 0.3; // 0.3 a 0.8
        }

        update() {
            // Movimiento normal
            this.x += this.vx;
            this.y += this.vy;

            // Rebote en bordes con pérdida mínima de energía
            if (this.x < 0 || this.x > width) {
                this.vx *= -0.9;
                this.x = Math.max(0, Math.min(width, this.x));
            }
            if (this.y < 0 || this.y > height) {
                this.vy *= -0.9;
                this.y = Math.max(0, Math.min(height, this.y));
            }

            // Interacción con el mouse (repulsión)
            if (mouseX && mouseY) {
                const dx = this.x - mouseX;
                const dy = this.y - mouseY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < MOUSE_REPEL_RADIUS) {
                    const angle = Math.atan2(dy, dx);
                    const force = (MOUSE_REPEL_RADIUS - distance) / MOUSE_REPEL_RADIUS * MOUSE_REPEL_FORCE;
                    this.x += Math.cos(angle) * force * 5;
                    this.y += Math.sin(angle) * force * 5;
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(159, 140, 255, ${this.baseOpacity})`;
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push(new Particle());
        }
    }

    function drawLines() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < CONNECT_DISTANCE) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(159, 140, 255, ${0.15 * (1 - distance / CONNECT_DISTANCE)})`;
                    ctx.lineWidth = 1.2 * (1 - distance / CONNECT_DISTANCE);
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach(p => p.update());
        drawLines();
        particles.forEach(p => p.draw());

        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
        resizeCanvas();
        initParticles();
    });

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    document.addEventListener('mouseleave', () => {
        mouseX = 0;
        mouseY = 0;
    });

    // Iniciar
    resizeCanvas();
    initParticles();
    animate();
})();