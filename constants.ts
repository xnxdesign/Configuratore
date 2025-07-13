import { ColorInfo, Prices, ProductIds, FinishType } from './types';


// Dentro src/constants.ts
export const STRADALE_MODEL_URL = '/cerchiostradaleDEFF.glb';
export const MOTARD_MODEL_URL = '/cerchiomotardDEFF.glb';

export const PRICES: Prices = {
  'kit-canale-meta': 47.00,
  'kit-canale-intero': 97.00,
  'kit-raggi': 14.90,
  'kit-nipples': 27.90,
  'finitura-opaca': 20.00,
  'finitura-cromata': 40.00,
  'finitura-olografica': 40.00,
  'finitura-glitter': 40.00,
};

// NOTE: These are placeholder Shopify Variant IDs.
export const PRODUCT_IDS: ProductIds = {
  'kit-canale-meta': '1234567890123',
  'kit-canale-intero': '1234567890124',
  'kit-raggi': '1234567890125',
  'kit-nipples': '1234567890126',
  'finitura-opaca': '1234567890127',
  'finitura-cromata': '1234567890128',
  'finitura-olografica': '1234567890129',
  'finitura-glitter': '1234567890130',
};

// --- PALETTE COLORI MODIFICATA ---
export const COLOR_PALETTE: ColorInfo[] = [
  { name: 'Black', hex: '#000000', style: 'bg-[#000000]' },
  { name: 'Gray', hex: '#808080', style: 'bg-[#808080]' },
  { name: 'White', hex: '#FFFFFF', style: 'bg-[#FFFFFF]' },
  { name: 'Yellow', hex: '#FFFF00', style: 'bg-[#FFFF00]' },
  { name: 'Orange', hex: '#FFA500', style: 'bg-[#FFA500]' },
  { name: 'Red', hex: '#FF0000', style: 'bg-[#FF0000]' },
  { name: 'Pink', hex: '#FF69B4', style: 'bg-[#FF69B4]' },
  { name: 'Purple', hex: '#8A2BE2', style: 'bg-[#8A2BE2]' },
  { name: 'Blue', hex: '#0000FF', style: 'bg-[#0000FF]' },
  { name: 'Sky Blue', hex: '#87CEEB', style: 'bg-[#87CEEB]' },
  { name: 'Green', hex: '#00FF00', style: 'bg-[#00FF00]' },
  // Verde Petrolio Aggiunto
  { name: 'Verde Petrolio', hex: '#008080', style: 'bg-[#008080]' },
  { name: 'Beige', hex: '#F5DEB3', style: 'bg-[#F5DEB3]' },
  { name: 'Brown', hex: '#8B4513', style: 'bg-[#8B4513]' },
  // Rainbow Spostato alla fine
  { name: 'Rainbow', hex: 'rainbow', style: 'bg-gradient-to-tr from-fuchsia-500 via-yellow-500 to-sky-500' },
];

export const MAPPED_FINISHES: { [key in FinishType]: { roughness: number; metallic: number } } = {
  lucida: { roughness: 0.1, metallic: 0.2 },
  opaca: { roughness: 0.9, metallic: 0.1 },
  cromata: { roughness: 0.05, metallic: 1.0 },
  olografica: { roughness: 0.2, metallic: 1.0 },
  glitter: { roughness: 0.4, metallic: 0.8 },
};