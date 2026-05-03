import React, { useRef, useState } from 'react';

export interface ArticleCardData {
  slug: string;
  title: string;
  heroImage?: string;
  excerpt?: string;
  publishDate?: string;
}

interface Props {
  articles: ArticleCardData[];
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase();
}

export default function ArticlesCarousel({ articles }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const dragMovedRef = useRef(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
    dragMovedRef.current = false;
  };

  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    if (Math.abs(x - startX) > 5) dragMovedRef.current = true;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (dragMovedRef.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  if (articles.length === 0) return null;

  return (
    <div className="w-full bg-[#151515] py-6 relative shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-y-[12px] border-[#0a0a0a] my-16 transform rotate-1">
      <div className="w-full h-6 mb-8 opacity-80" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #d8c5a5 0 16px, transparent 16px 32px)' }}></div>

      <div className="text-center mb-10 px-4 transform -rotate-1">
        <h3 className="font-anton text-5xl md:text-6xl text-[#fceeb5] tracking-widest uppercase text-3d">Featured Dispatches</h3>
        <p className="font-oswald text-[#d4b872] tracking-[0.3em] uppercase mt-3 text-sm md:text-base">Stories from the road</p>
      </div>

      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className={`flex overflow-x-auto gap-6 px-8 pb-8 hide-scrollbar transform -rotate-1 ${isDragging ? 'cursor-grabbing snap-none' : 'cursor-grab snap-x snap-mandatory'}`}
      >
        {articles.map((article) => (
          <a
            key={article.slug}
            href={`/articles/${article.slug}`}
            draggable={false}
            onClick={handleCardClick}
            className="min-w-[280px] md:min-w-[320px] flex-shrink-0 snap-center group select-none no-underline"
          >
            <div className="h-full flex flex-col border-[6px] border-[#d4b872] bg-[#fdfbf2] p-4 transform transition-transform duration-500 group-hover:scale-105">
              <div className="w-full h-48 overflow-hidden border-2 border-[#1a2b4c] mb-5 relative pointer-events-none bg-[#1a2b4c]">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10 duration-500"></div>
                {article.heroImage && (
                  <img draggable={false} src={article.heroImage} alt={article.title} className="w-full h-full object-cover filter contrast-110 sepia-[.2] group-hover:scale-110 transition-transform duration-700" />
                )}
              </div>
              <div className="text-center flex-grow flex flex-col pointer-events-none px-1">
                {article.publishDate && (
                  <span className="inline-block border border-[#1a2b4c] px-3 py-1 text-[10px] font-bold tracking-widest mb-3 mx-auto text-[#1a2b4c] font-typewriter uppercase">
                    {formatDate(article.publishDate)}
                  </span>
                )}
                <h4 className="font-serif text-2xl text-[#1a2b4c] mb-2 leading-tight">{article.title}</h4>
                {article.excerpt && (
                  <p className="font-sans text-xs text-[#2b3a55] opacity-80 mt-2 line-clamp-3">{article.excerpt}</p>
                )}
                <span className="mt-4 font-oswald text-xs text-[#c13a3a] uppercase tracking-widest">Read article →</span>
              </div>
            </div>
          </a>
        ))}
      </div>

      <div className="w-full h-6 mt-4 opacity-80" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #d8c5a5 0 16px, transparent 16px 32px)' }}></div>

      <div className="text-center pt-8 pb-2 transform -rotate-1">
        <a
          href="/articles"
          className="inline-block bg-[#fceeb5] text-[#1a2b4c] font-oswald text-lg tracking-[0.2em] uppercase px-10 py-4 border-[3px] border-[#d4b872] shadow-[6px_6px_0px_#0a0a0a] hover:bg-[#d4b872] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_#0a0a0a] transition-all no-underline"
        >
          View All Articles
        </a>
      </div>
    </div>
  );
}
