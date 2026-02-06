"use client";

import { useState } from "react";
import { X, Search } from "lucide-react";
import { useRouter } from "next/navigation";

export function Hero() {
  const [showVideo, setShowVideo] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (!query.trim()) return;
    router.push(`/search?query=${encodeURIComponent(query)}`);
  };

  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('/luxurious-villa-with-modern-architectural-design.png')",
        }}
      >
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-light text-white leading-tight">
              Welcome to a New
              <br />
              <span className="relative inline-block">
                Era of
                <span className="relative inline-block ml-3">
                  <span className="absolute -inset-2 sm:-inset-3 border-4 border-accent" />
                  <span className="relative">Smart Living</span>
                </span>
              </span>
            </h1>
          </div>

          {/* Subheading */}
          <p className="text-base sm:text-lg text-gray-100 max-w-2xl mx-auto leading-relaxed">
            Step into a realm of unparalleled grandeur,
            <br />
            where the future of luxury is elegantly crafted today
          </p>

          {/* SEARCH BAR (ACTIVATED) */}
          <div className="flex items-center justify-center gap-4 pt-4">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-3 rounded-xl border border-white/20">
              <Search className="w-5 h-5 text-gray-200" />

              <input
                type="text"
                placeholder="Search homes, locations..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
                className="bg-transparent outline-none text-white placeholder-gray-300 w-56 sm:w-72"
              />
            </div>

            <button
              onClick={handleSearch}
              className="p-3 hover:bg-white/10 rounded-xl transition-colors"
            >
              <Search className="w-5 h-5 text-gray-200" />
            </button>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {showVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="relative w-full max-w-4xl aspect-video rounded-lg overflow-hidden">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
              title="Property Showcase Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
            <button
              onClick={() => setShowVideo(false)}
              className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
