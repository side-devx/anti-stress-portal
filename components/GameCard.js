import Link from "next/link";

export default function GameCard({ title, desc, link, img }) {
  return (
    <Link href={link}>
      <div className="bg-white shadow-lg rounded-2xl p-4 cursor-pointer hover:scale-105 transition-transform">
        <img src={img} alt={title} className="rounded-lg mb-3 w-full h-32 object-cover" />
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-gray-600 text-sm">{desc}</p>
      </div>
    </Link>
  );
}

