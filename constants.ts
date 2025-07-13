import { ColorInfo, Prices, ProductIds, FinishType } from './types';

// URL dei modelli 3D
export const STRADALE_MODEL_URL = '/cerchiostradaleDEFF.glb';
export const MOTARD_MODEL_URL = '/cerchiomotardDEFF.glb';

// Prezzi (invariati)
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

// --- ID DELLE VARIANTI DI SHOPIFY (AGGIORNATI CON GLI ID PRODOTTO) ---
export const PRODUCT_IDS: ProductIds = {
  // Varianti del prodotto "Kit Canale"
  'kit-canale-meta': '55459668066639',
  'kit-canale-intero': '55459668099407',

  // Prodotti semplici (usando l'ID del prodotto come ID variante)
  'kit-raggi': '15467250680143',
  'kit-nipples': '15467252482383',
  'finitura-opaca': '15476629897551',
  'finitura-cromata': '15476630192463', // Corretto da screenshot
  'finitura-olografica': '15476630028623', // Corretto da screenshot
  'finitura-glitter': '15476630290767', // Corretto da screenshot
};


// Palette Colori (corretta)
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
  { name: 'Verde Petrolio', hex: '#008080', style: 'bg-[#008080]' },
  { name: 'Beige', hex: '#F5DEB3', style: 'bg-[#F5DEB3]' },
  { name: 'Brown', hex: '#8B4513', style: 'bg-[#8B4513]' },
  { name: 'Rainbow', hex: 'rainbow', style: 'bg-gradient-to-tr from-fuchsia-500 via-yellow-500 to-sky-500' },
];

// Finiture (invariate)
export const MAPPED_FINISHES: { [key in FinishType]: { roughness: number; metallic: number } } = {
  lucida: { roughness: 0.1, metallic: 0.2 },
  opaca: { roughness: 0.9, metallic: 0.1 },
  cromata: { roughness: 0.05, metallic: 1.0 },
  olografica: { roughness: 0.2, metallic: 1.0 },
  glitter: { roughness: 0.4, metallic: 0.8 },
};