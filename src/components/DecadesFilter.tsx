import React, { useRef, useState } from 'react';

const decades = [
  {
    years: "1920s-30s",
    title: "The Pre-Code Era",
    desc: "Art Deco & Silent Shadows",
    bg: "bg-[#111]",
    border: "border-[#d4b872]",
    text: "text-[#d4b872]",
    titleFont: "font-oswald tracking-[0.2em] uppercase",
    img: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=400&auto=format&fit=crop"
  },
  {
    years: "1940s",
    title: "Wartime Hollywood",
    desc: "Noir, Espionage & Romance",
    bg: "bg-[#2c241b]",
    border: "border-[#8b5a2b]",
    text: "text-[#e8dcb8]",
    titleFont: "font-typewriter tracking-widest uppercase",
    img: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=400&auto=format&fit=crop"
  },
  {
    years: "1950s",
    title: "The Golden Age",
    desc: "Technicolor & Grand Musicals",
    bg: "bg-[#1a4b6b]",
    border: "border-[#f7d068]",
    text: "text-[#fdfbf2]",
    titleFont: "font-cursive text-3xl",
    img: "https://images.unsplash.com/photo-1572177215152-32f247303126?q=80&w=400&auto=format&fit=crop"
  },
  {
    years: "1960s",
    title: "New Hollywood Begins",
    desc: "Mod, Rebellion & Pop Art",
    bg: "bg-[#8c2a2a]",
    border: "border-[#fceeb5]",
    text: "text-[#fceeb5]",
    titleFont: "font-anton tracking-wide uppercase text-2xl",
    img: "https://images.unsplash.com/photo-1551316679-9c6ae9dec224?q=80&w=400&auto=format&fit=crop"
  }
];

export default function DecadesFilter() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div className="w-full bg-[#151515] py-6 relative shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-y-[12px] border-[#0a0a0a] my-16 transform rotate-1">
      <div className="w-full h-6 mb-8 opacity-80" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #d8c5a5 0 16px, transparent 16px 32px)' }}></div>

      <div className="text-center mb-10 px-4 transform -rotate-1">
        <h3 className="font-anton text-5xl md:text-6xl text-[#fceeb5] tracking-widest uppercase text-3d">Browse by Era</h3>
        <p className="font-oswald text-[#d4b872] tracking-[0.3em] uppercase mt-3 text-sm md:text-base">Select your timeline</p>
      </div>

      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className={`flex overflow-x-auto gap-6 px-8 pb-8 hide-scrollbar transform -rotate-1 ${isDragging ? 'cursor-grabbing snap-none' : 'cursor-grab snap-x snap-mandatory'}`}
      >
        {decades.map((decade, i) => (
          <div key={i} className="min-w-[280px] md:min-w-[320px] flex-shrink-0 snap-center group select-none">
            <div className={`h-full flex flex-col border-[6px] ${decade.border} ${decade.bg} p-4 transform transition-transform duration-500 ${isDragging ? '' : 'group-hover:scale-105'}`}>
              <div className="w-full h-48 overflow-hidden border-2 border-inherit mb-5 relative pointer-events-none">
                <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors z-10 duration-500"></div>
                <img draggable="false" src={decade.img} alt={decade.title} className="w-full h-full object-cover filter contrast-125 sepia-[.4] group-hover:scale-110 transition-transform duration-700" />
              </div>
              <div className="text-center flex-grow flex flex-col justify-center pointer-events-none">
                <span className={`inline-block border border-inherit px-3 py-1 text-xs font-bold tracking-widest mb-4 mx-auto ${decade.text}`}>{decade.years}</span>
                <h4 className={`${decade.titleFont} ${decade.text} mb-2 leading-tight`}>{decade.title}</h4>
                <p className={`font-sans text-xs opacity-80 ${decade.text} uppercase tracking-widest mt-2`}>{decade.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="w-full h-6 mt-4 opacity-80" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #d8c5a5 0 16px, transparent 16px 32px)' }}></div>
    </div>
  );
}
