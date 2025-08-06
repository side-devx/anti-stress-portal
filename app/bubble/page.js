"use client";
import { useEffect } from "react";
import { Howl } from "howler";

export default function BubblePop() {
  useEffect(() => {
    const canvas = document.getElementById("bubbleCanvas");
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Suara variasi
    const popSounds = [
      new Howl({ src: ["/sounds/pop1.mp3"], volume: 0.5 }),
      new Howl({ src: ["/sounds/pop2.mp3"], volume: 0.5 }),
      new Howl({ src: ["/sounds/pop3.mp3"], volume: 0.5 }),
      new Howl({ src: ["/sounds/pop4.mp3"], volume: 0.5 }),
      new Howl({ src: ["/sounds/pop5.mp3"], volume: 0.5 }),
    ];

    const colors = ["#FFB3BA", "#FFDFBA", "#FFFFBA", "#BAFFC9", "#BAE1FF"];
    const bubbleCount = 30;

    let bubbles = [];
    let points = [];
    let particles = [];
    let score = 0;

    class Bubble {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius = 20 + Math.random() * 30;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.vx = (Math.random() - 0.5) * 2.5;
        this.vy = (Math.random() - 0.5) * 2.5;
        this.popped = false;
        this.soundIndex = Math.floor(Math.random() * popSounds.length);
      }
      update() {
        if (!this.popped) {
          this.x += this.vx;
          this.y += this.vy;
          if (this.x - this.radius < 0 || this.x + this.radius > canvas.width) this.vx *= -1;
          if (this.y - this.radius < 0 || this.y + this.radius > canvas.height) this.vy *= -1;
        }
      }
      draw() {
        if (!this.popped) {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
          ctx.fillStyle = this.color;
          ctx.fill();
          ctx.closePath();
        }
      }
      pop() {
        this.popped = true;
        popSounds[this.soundIndex].play();
        score += 10;

        // Efek poin
        points.push({
          x: this.x,
          y: this.y,
          text: "+10",
          alpha: 1
        });

        // Efek partikel ledakan
        for (let i = 0; i < 10; i++) {
          particles.push(new Particle(this.x, this.y, this.color));
        }
      }
    }

    // Partikel ledakan
    class Particle {
      constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.radius = 3 + Math.random() * 3;
        this.vx = (Math.random() - 0.5) * 6;
        this.vy = (Math.random() - 0.5) * 6;
        this.alpha = 1;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= 0.02;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${hexToRgb(this.color)}, ${this.alpha})`;
        ctx.fill();
        ctx.closePath();
      }
    }

    // Helper konversi HEX ke RGB
    function hexToRgb(hex) {
      const bigint = parseInt(hex.slice(1), 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;
      return `${r}, ${g}, ${b}`;
    }

    // Efek poin
    function drawPoints() {
      points.forEach((p, i) => {
        ctx.font = "24px Arial";
        ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
        ctx.fillText(p.text, p.x, p.y);
        p.y -= 1;
        p.alpha -= 0.02;
        if (p.alpha <= 0) points.splice(i, 1);
      });
    }

    // Inisialisasi bubbles
    function initBubbles() {
      bubbles = [];
      for (let i = 0; i < bubbleCount; i++) {
        bubbles.push(new Bubble());
      }
    }

    initBubbles();

    // Klik bubble
    canvas.addEventListener("click", (e) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      bubbles.forEach(b => {
        if (!b.popped) {
          const dist = Math.sqrt((b.x - clickX) ** 2 + (b.y - clickY) ** 2);
          if (dist < b.radius) {
            b.pop();
          }
        }
      });
    });

    // Reset tombol
    document.getElementById("resetBtn").addEventListener("click", () => {
      score = 0;
      initBubbles();
      particles = [];
      points = [];
    });

    // Animasi utama
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      bubbles.forEach(b => {
        b.update();
        b.draw();
      });

      particles.forEach((p, i) => {
        p.update();
        p.draw();
        if (p.alpha <= 0) particles.splice(i, 1);
      });

      drawPoints();

      // Tampilkan skor
      ctx.font = "28px Arial";
      ctx.fillStyle = "#fff";
      ctx.fillText(`Score: ${score}`, 20, 40);

      requestAnimationFrame(animate);
    }

    animate();
  }, []);

  return (
    <>
      <button
        id="resetBtn"
        className="absolute top-4 right-4 px-4 py-2 bg-white/70 rounded-lg shadow hover:bg-white"
      >
        Reset
      </button>
      <canvas
        id="bubbleCanvas"
        className="w-full h-full bg-gradient-to-b from-blue-400 to-purple-600"
      ></canvas>
    </>
  );
}
