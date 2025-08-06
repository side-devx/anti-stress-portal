"use client";
import { useEffect, useRef } from "react";

export default function BubbleWrap() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Set ukuran canvas full window
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Setting bubble wrap
    const bubbleRadius = 25; // diameter bubble
    const padding = 10; // jarak antar bubble
    const cols = Math.floor(canvas.width / (bubbleRadius * 2 + padding));
    const rows = Math.floor(canvas.height / (bubbleRadius * 2 + padding));
    let bubbles = [];

    // Buat bubble grid
    function createBubbles() {
      bubbles = [];
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          bubbles.push({
            x: x * (bubbleRadius * 2 + padding) + bubbleRadius + padding,
            y: y * (bubbleRadius * 2 + padding) + bubbleRadius + padding,
            popped: false
          });
        }
      }
    }

    // Gambar bubble
    function drawBubbles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      bubbles.forEach(bubble => {
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubbleRadius, 0, Math.PI * 2);
        ctx.fillStyle = bubble.popped ? "rgba(200,200,200,0.3)" : "rgba(255,255,255,0.8)";
        ctx.fill();
        ctx.strokeStyle = "rgba(150,150,150,0.5)";
        ctx.stroke();
      });
    }

    // Deteksi klik untuk pop
    function handleClick(e) {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      bubbles.forEach(bubble => {
        const dist = Math.sqrt((bubble.x - clickX) ** 2 + (bubble.y - clickY) ** 2);
        if (dist < bubbleRadius) {
          bubble.popped = true;
        }
      });

      // Kalau semua bubble popped, reset
      if (bubbles.every(b => b.popped)) {
        setTimeout(() => {
          createBubbles();
          drawBubbles();
        }, 300);
      }

      drawBubbles();
    }

    // Setup awal
    createBubbles();
    drawBubbles();
    canvas.addEventListener("click", handleClick);

    // Cleanup
    return () => canvas.removeEventListener("click", handleClick);
  }, []);

  return (
    <canvas

