"use client";
import Link from "next/link";
import GameCard from "../components/GameCard";

export default function Home() {
  const games = [
    { title: "Bubble Pop", desc: "Pecahkan gelembung untuk melepas stres", link: "/bubble", img: "/images/bubble.png" },
    { title: "Bubble Wrap", desc: "Pecahkan plastik gelembung virtual", link: "/wrap", img: "/images/wrap.png" },
    { title: "Zen Sand", desc: "Buat pola santai di pasir virtual", link: "/sand", img: "/images/sand.png" },
    { title: "Slime", desc: "Mainkan slime digital yang elastis", link: "/slime", img: "/images/slime.png" },
    { title: "Breathing", desc: "Ikuti panduan napas menenangkan", link: "/breath", img: "/images/breath.png" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 to-blue-400 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-6 text-white">Portal Anti Stres</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {games.map((game, i) => (
          <GameCard key={i} {...game} />
        ))}
      </div>
    </div>
  );
}

