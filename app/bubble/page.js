"use client";
import { useEffect, useState } from "react";
import { Howl } from "howler";

export default function BubblePop() {
  const GAME_DURATION = 30;

  const [gameFinished, setGameFinished] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [leaderboard, setLeaderboard] = useState([]);
  const [newRecord, setNewRecord] = useState(false);

  useEffect(() => {
    const canvas = document.getElementById("bubbleCanvas");
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Variasi suara ledakan
    const blastSounds = [
      new Howl({ src: ["/sounds/balloon_blast1.mp3"], volume: 0.8 }),
      new Howl({ src: ["/sounds/balloon_blast2.mp3"], volume: 0.8 }),
      new Howl({ src: ["/sounds/balloon_blast3.mp3"], volume: 0.8 })
    ];

    const colors = ["#FFB3BA", "#FFDFBA", "#FFFFBA", "#BAFFC9", "#BAE1FF"];
    const bubbleCount = 20;

    let bubbles = [];
    let points = [];
    let particles = [];
    let score = 0;
    let timerInterval;

    // Skor berdasar ukuran
    const getScoreValue = (radius) => {
      if (radius > 40) return 30;
      if (radius > 30) return 20;
      return 10;
    };

    // Bubble class
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

        // Tentukan suara berdasar ukuran
        if (this.radius > 40) this.soundIndex = 2;
        else if (this.radius > 30) this.soundIndex = 1;
        else this.soundIndex = 0;

        this.scoreValue = getScoreValue(this.radius);
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
        score += this.scoreValue;

        // Efek poin
        points.push({
          x: this.x,
          y: this.y,
          text: `+${this.scoreValue}`,
          alpha: 1
        });

        // Efek partikel
        for (let i = 0; i < 30; i++) {
          particles.push(new Particle(this.x, this.y, this.color));
        }

        // Respawn bubble baru
        setTimeout(() => {
          this.reset();
          this.popped = false;
        }, 100);
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

    // Timer countdown
    function startTimer() {
      let time = GAME_DURATION;
      setTimeLeft(time);

      timerInterval = setInterval(() => {
        time--;
        setTimeLeft(time);
        if (time <= 0) {
          clearInterval(timerInterval);
          setFinalScore(score);
          saveScore(score);
          setGameFinished(true);
        }
      }, 1000);
    }

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

      if (!gameFinished) requestAnimationFrame(animate);
    }

    // Mulai game
    startTimer();
    animate();

    return () => clearInterval(timerInterval);
  }, []);

  // Simpan skor ke localStorage
  function saveScore(score) {
    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    let scores = JSON.parse(localStorage.getItem("bubbleScores")) || [];
    scores.push({ time: timestamp, score });
    scores.sort((a, b) => b.score - a.score);

    if (scores.length > 0 && score === scores[0].score) {
      setNewRecord(true);
    }

    localStorage.setItem("bubbleScores", JSON.stringify(scores));
    setLeaderboard(scores.slice(0, 5));
  }

  // Hitung warna progress bar
  const getTimerColor = () => {
    if (timeLeft > 20) return "text-green-400 border-green-400";
    if (timeLeft > 10) return "text-yellow-400 border-yellow-400";
    return "text-red-500 border-red-500 animate-pulse";
  };

  const timerPercentage = (timeLeft / 30) * 100;

  return (
    <>
      <canvas
        id="bubbleCanvas"
        className="w-full h-full bg-gradient-to-b from-blue-400 to-purple-600"
      ></canvas>

      {/* Timer animasi */}
      {!gameFinished && (
        <div className="absolute top-4 right-4 flex items-center justify-center">
          <div
            className={`relative w-20 h-20 rounded-full border-4 ${getTimerColor()} flex items-center justify-center`}
            style={{
              background: `conic-gradient(currentColor ${timerPercentage}%, transparent 0%)`
            }}
          >
            <span className="absolute text-white text-xl font-bold">
              {timeLeft}
            </span>
          </div>
        </div>
      )}

      {/* Overlay Game Selesai */}
      {gameFinished && (
        <div className="absolute inset-0 flex flex-col justify-center items-center bg-black/60 animate-fadein">
          <h1 className="text-6xl font-bold text-white animate-bounce">
            Game Over
          </h1>
          <p className="text-2xl text-white mt-4">Skor Kamu: {finalScore}</p>
          {newRecord && (
            <p className="text-yellow-300 text-xl mt-2 animate-pulse">
              Rekor Baru! 🎉
            </p>
          )}

          <h2 className="text-2xl text-white mt-6">Leaderboard</h2>
          <ul className="text-white mt-2">
            {leaderboard.map((entry, index) => (
              <li key={index}>
                {entry.time} - {entry.score}
              </li>
            ))}
          </ul>

          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-3 bg-white text-black rounded-lg shadow hover:scale-105 transition"
          >
            Main Lagi
          </button>
        </div>
      )}
    </>
  );
}
