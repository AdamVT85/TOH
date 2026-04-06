import React, { useState } from 'react';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps';
import { X, Compass } from 'lucide-react';

const geoUrl = "https://unpkg.com/world-atlas@2.0.2/countries-110m.json";

interface Destination {
  name: string;
  coordinates: [number, number];
  articles: string[];
  hotels: string[];
}

const destinations: Destination[] = [
  { name: "France (Riviera)", coordinates: [7.26, 43.71], articles: ["Summer in Cannes", "The Grace Kelly Guide"], hotels: ["Hotel du Cap-Eden-Roc"] },
  { name: "Spain", coordinates: [-3.7, 40.4], articles: ["Hemingway's Madrid", "Flamenco Nights"], hotels: ["Palace Hotel"] },
  { name: "Italy", coordinates: [12.4, 41.9], articles: ["Roman Holiday", "Venetian Canals"], hotels: ["The Gritti Palace"] },
  { name: "New York", coordinates: [-74.0, 40.7], articles: ["Jazz Age Manhattan", "Breakfast at Tiffany's"], hotels: ["The Plaza"] },
  { name: "California", coordinates: [-118.2, 34.0], articles: ["Golden Age of Hollywood", "Palm Springs Retreats"], hotels: ["Beverly Hills Hotel"] },
  { name: "Nevada", coordinates: [-115.1, 36.1], articles: ["Rat Pack Las Vegas", "Desert Oasis"], hotels: ["The Sands (Reimagined)"] },
  { name: "Hawaii", coordinates: [-157.8, 21.3], articles: ["Elvis in Honolulu", "Polynesian Dreams"], hotels: ["Royal Hawaiian"] },
  { name: "Cuba", coordinates: [-79.8, 21.5], articles: ["Havana Nights", "Vintage Cars & Cigars"], hotels: ["Hotel Nacional de Cuba"] },
  { name: "Kenya", coordinates: [37.9, -0.02], articles: ["Out of Africa", "Safari Elegance"], hotels: ["Giraffe Manor"] },
  { name: "UK", coordinates: [-0.1, 51.5], articles: ["Swinging London", "Royalty & Romance"], hotels: ["The Savoy"] },
  { name: "Croatia", coordinates: [15.2, 45.1], articles: ["Adriatic Pearl", "Coastal Glamour"], hotels: ["Esplanade Zagreb"] },
  { name: "Switzerland", coordinates: [8.2, 46.8], articles: ["Alpine Retreats", "Skiing with the Stars"], hotels: ["Badrutt's Palace"] },
  { name: "Dominican Rep.", coordinates: [-70.1, 18.7], articles: ["Caribbean Hideaway", "Tropical Rhythms"], hotels: ["Casa de Campo"] },
  { name: "Mexico", coordinates: [-99.1, 19.4], articles: ["Acapulco Gold", "Silver Screen Escapes"], hotels: ["Hotel Los Flamingos"] },
];

export default function VintageMap() {
  const [selectedDest, setSelectedDest] = useState<Destination | null>(null);

  return (
    <div className="relative w-full max-w-5xl mx-auto my-16 border-8 border-[#c13a3a] bg-[#e8dcb8] shadow-[10px_10px_0px_rgba(26,43,76,1)] overflow-hidden" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/aged-paper.png")' }}>
      <div className="absolute top-4 left-4 pointer-events-none opacity-60">
        <Compass size={80} className="text-[#8b5a2b]" strokeWidth={1} />
      </div>
      <div className="absolute bottom-10 right-10 pointer-events-none opacity-40 font-cursive text-2xl text-[#8b5a2b] transform -rotate-12">
        Here be monsters...
      </div>
      <div className="absolute top-10 right-20 pointer-events-none opacity-40 font-cursive text-xl text-[#8b5a2b] transform rotate-6">
        Mare Nostrum
      </div>

      <ComposableMap projection="geoMercator" projectionConfig={{ scale: 130 }} width={800} height={450} className="w-full h-auto">
        <ZoomableGroup center={[0, 20]} zoom={1} maxZoom={4}>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#d4b872"
                  stroke="#8b5a2b"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: "none" },
                    hover: { fill: "#cdae5a", outline: "none" },
                    pressed: { outline: "none" },
                  }}
                />
              ))
            }
          </Geographies>

          <path d="M -74 40 Q -30 60 -0.1 51.5" fill="transparent" stroke="#c13a3a" strokeWidth={1.5} strokeDasharray="4 4" className="opacity-50" />
          <path d="M 7.26 43.71 Q 20 20 37.9 -0.02" fill="transparent" stroke="#c13a3a" strokeWidth={1.5} strokeDasharray="4 4" className="opacity-50" />
          <path d="M -118.2 34.0 Q -130 25 -157.8 21.3" fill="transparent" stroke="#c13a3a" strokeWidth={1.5} strokeDasharray="4 4" className="opacity-50" />

          {destinations.map((dest) => (
            <Marker
              key={dest.name}
              coordinates={dest.coordinates}
              onClick={() => setSelectedDest(dest)}
              className="cursor-pointer group"
            >
              <g transform="translate(-12, -24)" className="transition-transform group-hover:scale-110 group-hover:-translate-y-1 origin-bottom">
                <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z" fill="#c13a3a" stroke="#1a2b4c" strokeWidth="1.5" />
                <circle cx="12" cy="10" r="3" fill="#fdfbf2" />
              </g>
              <text textAnchor="middle" y={6} style={{ fontFamily: "Oswald", fill: "#1a2b4c", fontSize: "10px", fontWeight: "bold", textShadow: "1px 1px 0px #fdfbf2, -1px -1px 0px #fdfbf2, 1px -1px 0px #fdfbf2, -1px 1px 0px #fdfbf2" }} className="pointer-events-none">
                {dest.name}
              </text>
            </Marker>
          ))}
        </ZoomableGroup>
      </ComposableMap>

      {selectedDest && (
        <div className="absolute inset-0 flex items-center justify-center p-4 z-50 bg-black/20 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-[#fdfbf2] p-6 shadow-2xl transform rotate-1 border-2 border-[#d4b872]" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }}>
            <button onClick={() => setSelectedDest(null)} className="absolute top-3 right-3 text-[#1a2b4c] hover:text-[#c13a3a] transition-colors z-10">
              <X size={24} />
            </button>

            <div className="absolute top-4 right-12 w-16 h-20 border-2 border-[#c13a3a] p-1 opacity-80 transform rotate-6">
              <div className="w-full h-full border border-[#c13a3a] flex flex-col items-center justify-center text-[#c13a3a]">
                <span className="text-[10px] font-oswald uppercase">Postage</span>
                <span className="text-xl font-bold font-serif">5&cent;</span>
              </div>
            </div>

            <div className="absolute top-8 right-24 w-20 h-20 border-4 border-[#1a2b4c] rounded-full opacity-30 flex items-center justify-center transform -rotate-12 pointer-events-none">
              <div className="text-center leading-none">
                <div className="text-[8px] font-bold uppercase tracking-widest">Air Mail</div>
                <div className="text-xs font-bold">1954</div>
              </div>
            </div>

            <div className="pr-20 relative z-10">
              <h4 className="font-handwriting text-4xl text-[#c13a3a] mb-1">{selectedDest.name}</h4>
              <div className="h-px w-full bg-[#d4b872] mb-4"></div>

              <div className="space-y-4 font-typewriter text-sm text-[#1a2b4c]">
                <div>
                  <strong className="font-oswald uppercase tracking-wider text-[#8b5a2b] text-xs block mb-1">Featured Articles:</strong>
                  <ul className="list-disc pl-4 space-y-1">
                    {selectedDest.articles.map((art, i) => (
                      <li key={i} className="hover:text-[#c13a3a] cursor-pointer transition-colors decoration-[#c13a3a] hover:underline underline-offset-2">{art}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <strong className="font-oswald uppercase tracking-wider text-[#8b5a2b] text-xs block mb-1">Where to Stay:</strong>
                  <ul className="list-disc pl-4 space-y-1">
                    {selectedDest.hotels.map((hotel, i) => (
                      <li key={i} className="hover:text-[#c13a3a] cursor-pointer transition-colors decoration-[#c13a3a] hover:underline underline-offset-2">{hotel}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-dashed border-[#d4b872] flex justify-between items-center relative z-10">
              <span className="font-cursive text-xl text-[#8b5a2b]">Wish you were here!</span>
              <button className="bg-[#1a2b4c] text-[#fdfbf2] font-oswald uppercase tracking-widest px-4 py-2 text-xs hover:bg-[#c13a3a] transition-colors">
                Explore Destination
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
