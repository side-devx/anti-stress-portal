"use client";
import { useEffect } from "react";
import { Howl } from "howler";

export default function BubblePop() {
  useEffect(() => {
    const canvas = document.getElementById("bubbleCanvas");
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Sound effect
    const popSound = new Howl({ src: ["/sounds/pop.mp3"], volume: 0.5 });

    // Bubble properties
    let bubbles = [];
    const bubbleCount = 30;
    const colors = ["#FFB3BA","#FFDFBA","#FFFFBA","#BAFFC9","#BAE1FF"];

    class Bubble {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius = 30 + Math.random() * 20;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.vx = (Math.random() - 0.5) * 1.5; // kecepatan horizontal
        this.vy = (Math.random() - 0.5) * 1.5; // kecepatan vertikal
        this.exploding = false;
        this.explosionRadius = 0;
      }
      update() {
        if (!this.exploding) {
          this.x += this.vx;
          this.y += this.vy;

          // Bounce dari tepi
          if (this.x - this.radius < 0 || this.x + this.radius > canvas.width) this.vx *= -1;
          if (this.y - this.radius < 0 || this.y + this.radius > canvas.height) this.vy *= -1;
        } else {
          this.explosionRadius += 3;
          if (this.explosionRadius > this.radius * 2) {
            this.reset(); // setelah ledakan selesai, respawn bubble
          }
        }
      }
      draw() {
        if (!this.exploding) {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
          ctx.fillStyle = this.color;
          ctx.fill();
          ctx.closePath();
        } else {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.explosionRadius, 0, Math.PI * 2);
          ctx.strokeStyle = this.color;
          ctx.lineWidth = 3;
          ctx.globalAlpha = 1 - this.explosionRadius / (this.radius * 2);
          ctx.stroke();
          ctx.globalAlpha = 1;
          ctx.closePath();
        }
      }
    }

    // Init bubbles
    for (let i = 0; i < bubbleCount; i++) {
      bubbles.push(new Bubble());
    }

    // Handle click pop
    function popBubble(x, y) {
      bubbles.forEach(b => {
        if (!b.exploding) {
          const dist = Math.sqrt((b.x - x) ** 2 + (b.y - y) ** 2);
          if (dist < b.radius) {
            b.exploding = true;
            b.explosionRadius = b.radius / 2;
            popSound.play(); // play pop sound
          }
        }
      });
    }

    canvas.addEventListener("click", (e) => {
      popBubble(e.clientX, e.clientY);
    });

    // Animation loop
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      bubbles.forEach(b => {
        b.update();
        b.draw();
      });
      requestAnimationFrame(animate);
    }

    animate();
  }, []);

  return (
    <canvas id="bubbleCanvas" className="w-full h-full bg-gradient-to-b from-blue-300 to-purple-400"></canvas>
  );
}
