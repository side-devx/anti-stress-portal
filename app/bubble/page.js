"use client";
import { useEffect } from "react";

export default function BubblePop() {
  useEffect(() => {
    const canvas = document.getElementById("bubbleCanvas");
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let bubbles = [];
    const bubbleCount = 30;

    class Bubble {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius = 30 + Math.random() * 20;
        this.color = `rgba(255,255,255,0.7)`;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
      }
    }

    function createBubbles() {
      bubbles = [];
      for (let i = 0; i < bubbleCount; i++) {
        bubbles.push(new Bubble());
      }
    }

    function popBubble(x, y) {
      bubbles = bubbles.filter(b => {
        const dist = Math.sqrt((b.x - x) ** 2 + (b.y - y) ** 2);
        return dist > b.radius; // bubble hilang kalau diklik
      });
      if (bubbles.length === 0) createBubbles(); // refill
    }

    canvas.addEventListener("click", (e) => {
      popBubble(e.clientX, e.clientY);
    });

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      bubbles.forEach(b => b.draw());
      requestAnimationFrame(animate);
    }

    createBubbles();
    animate();
  }, []);

  return (
    <canvas id="bubbleCanvas" className="w-full h-full bg-gradient-to-b from-blue-300 to-purple-400"></canvas>
  );
}

