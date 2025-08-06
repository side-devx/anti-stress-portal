"use client";
import { useEffect, useState } from "react";
import { Howl } from "howler";

export default function BubblePop() {
  const [gameFinished, setGameFinished] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  useEffect(() => {
    const canvas = document.getElementById("bubbleCanvas");
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Variasi suara ledakan balon
    const blastSounds = [
      new Howl({ src: ["/sounds/balloon_blast1.mp3"], volume: 0.8 }),
      new Howl({ src: ["/sounds/balloon_blast2.mp3"], volume: 0.8 }),
      new Howl({ src: ["/sounds/balloon_blast3.mp3"], volume: 0.8 })
    ];

    const colors = ["#FFB3BA", "#FFDFBA", "#FFFFBA", "#BAFFC9", "#BAE1FF"];
    const bubbleCount = 30;

    let bubbles = [];
    let points = [];
    let particles = [];
    let score = 0;

    // Bubble class
    class Bubble {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius = 20 + Math.random() * 30;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.vx = (Math.random() - 0.5) * 2.5;
        this.vy = (Math.random() - 0.5) * 2.5;
        this.popped = false;

        // Tentukan suara berdasar ukuran
        if (this.radius > 40) this.soundIndex = 2;
        else if (this.radius > 30) this.soundIndex = 1;
        else this.soundIndex = 0;
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
        blastSounds[this.soundIndex].play();
        score += 10;

        // Efek poin
        points.push({
          x: this.x,
          y: this.y,
          text: "+10",
          alpha: 1
        });

        // Partikel ledakan
        for (let i = 0; i < 30; i++) {
          particles.push(new Particle(this.x, this.y, this.color));
        }

        // Cek semua bubble pecah
        if (bubbles.every(b => b.popped)) {
          setTimeout(() => {
            setFinalScore(score);
            setGameFinished(true);
          }, 600);
        }
      }
    }

    // Partikel ledakan
    class Particle {
      constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.radius = 2 + Math.random() * 4;
        this.vx = (Math.random() - 0.5) * 10;
        this.vy = (Math.random() - 0.5) * 10;
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

    // Inisialisasi bubble
    for (let i = 0; i < bubbleCount; i++) {
      bubbles.push(new Bubble());
    }

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

      // Skor
      ctx.font = "28px Arial";
      ctx.fillStyle = "#fff";
      ctx.fillText(`Score: ${score}`, 20, 40);

      requestAnimationFrame(animate);
    }

    animate();
  }, []);

  // Confetti animasi
  useEffect(() => {
    if (!gameFinished) return;
    const confettiCanvas = document.getElementById("confettiCanvas");
    const ctx = confettiCanvas.getContext("2d");

    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;

    const confettiCount = 150;
    const confetti = [];

    for (let i = 0; i < confettiCount; i++) {
      confetti.push({
        x: Math.random() * confettiCanvas.width,
        y: Math.random() * confettiCanvas.height - confettiCanvas.height,
        r: Math.random() * 6 + 4,
        d: Math.random() * 150 + 50,
        color: `hsl(${Math.random() * 360}, 100%, 50%)`,
        tilt: Math.random() * 10 - 10
      });
    }

    function drawConfetti() {
      ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      confetti.forEach((c) => {
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2, false);
        ctx.fillStyle = c.color;
        ctx.fill();
        ctx.closePath();
      });

      updateConfetti();
      requestAnimationFrame(drawConfetti);
    }

    function updateConfetti() {
      confetti.forEach((c) => {
        c.y += 2 + Math.random() * 3;
        if (c.y > confettiCanvas.height) {
          c.y = -10;
          c.x = Math.random() * confettiCanvas.width;
        }
      });
    }

    drawConfetti();
  }, [gameFinished]);

  return (
    <>
      <canvas
        id="bubbleCanvas"
        className="w-full h-full bg-gradient-to-b from-blue-400 to-purple-600"
      ></canvas>

      {/* Overlay Selamat */}
      {gameFinished && (
        <>
          <canvas
            id="confettiCanvas"
            className="absolute inset-0 pointer-events-none"
          ></canvas>
          <div className="absolute inset-0 flex flex-col justify-center items-center bg-black/60 animate-fadein">
            <h1 className="text-6xl font-bold text-white animate-bounce">SELAMAT!</h1>
            <p className="text-2xl text-white mt-4">Skor Kamu: {finalScore}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 px-6 py-3 bg-white text-black rounded-lg shadow hover:scale-105 transition"
            >
              Main Lagi
            </button>
          </div>
        </>
      )}
    </>
  );
}
