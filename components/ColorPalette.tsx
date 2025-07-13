import React from 'react';
import { COLOR_PALETTE } from '../constants';

interface ColorPaletteProps {
  selectedColor?: string;
  onSelectColor: (color: string) => void;
  paletteId: string;
}

const ColorPalette: React.FC<ColorPaletteProps> = ({ selectedColor, onSelectColor, paletteId }) => {
  return (
    <div className="grid grid-cols-5 sm:grid-cols-7 gap-2 sm:gap-3 p-2 sm:p-4 bg-[rgba(255,255,255,0.02)] rounded-2xl border border-[rgba(224,255,0,0.1)] backdrop-blur-sm max-w-md mx-auto">
      {COLOR_PALETTE.map((color, index) => (
        <div
          key={`${paletteId}-${index}`}
          onClick={() => onSelectColor(color.hex)}
          className={`aspect-square w-full rounded-full cursor-pointer border-2 transition-all duration-300 ease-in-out relative shadow-lg
            ${color.style}
            ${selectedColor === color.hex
              ? 'border-[#e0ff00] scale-110 shadow-[0_0_0_3px_rgba(224,255,0,0.5),0_0_20px_rgba(224,255,0,0.8)] z-10'
              : 'border-transparent hover:scale-110 hover:border-white/50'
            }
            // --- CORREZIONE 1: L'animazione si attiva solo per il rainbow ---
            ${color.hex === 'rainbow' ? 'rainbow-color animate-[rainbowShift_3s_ease-in-out_infinite]' : ''}
          `}
          title={color.name}
        >
          {(color.hex === '#FFFFFF' || color.hex === '#000000') && (
            <div className={`w-full h-full rounded-full border ${selectedColor === color.hex ? 'border-transparent' : 'border-gray-400'}`}></div>
          )}
           
           {/* --- CORREZIONE 2: L'effetto lucido non appare sul rainbow --- */}
           {color.hex !== 'rainbow' && (
            <div className="absolute top-[15%] left-[20%] w-[30%] h-[30%] bg-[radial-gradient(circle,_rgba(255,255,255,0.8)_0%,_rgba(255,255,255,0.2)_70%,_transparent_100%)] rounded-full pointer-events-none z-2"></div>
           )}
        </div>
      ))}
       <style>{`
        @keyframes rainbowShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .rainbow-color { background-size: 200% 200% !important; }
      `}</style>
    </div>
  );
};

export default ColorPalette;