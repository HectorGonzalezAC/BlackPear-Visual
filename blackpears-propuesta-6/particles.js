(function () {
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    const PARTICLE_COUNT = 90;
    const CONNECT_DISTANCE = 150;
    const PARTICLE_SPEED = 0.25;
    const PARTICLE_COLOR = 'rgba(166, 139, 255, 0.4)';
    const LINE_COLOR = 'rgba(166, 139, 255, 0.15)';

    function init() {
        resizeCanvas();
        createParticles();
        animate();
    }

    function resizeCanvas() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }

    function createParticles() {
        particles = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * PARTICLE_SPEED,
                vy: (Math.random() - 0.5) * PARTICLE_SPEED,
            });
        }
    }

    function drawParticles() {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < CONNECT_DISTANCE) {
                    ctx.beginPath();
                    ctx.strokeStyle = LINE_COLOR;
                    ctx.lineWidth = 1.0 * (1 - distance / CONNECT_DISTANCE);
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }

        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, 2.2, 0, Math.PI * 2);
            ctx.fillStyle = PARTICLE_COLOR;
            ctx.fill();
        });
    }

    function updateParticles() {
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;

            p.x = Math.max(0, Math.min(width, p.x));
            p.y = Math.max(0, Math.min(height, p.y));
        });
    }

    function animate() {
        updateParticles();
        drawParticles();
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
        resizeCanvas();
        createParticles();
    });

    init();
})();