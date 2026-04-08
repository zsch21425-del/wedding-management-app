import { ColorScheme } from '../types';

export const colorPresets: ColorScheme[] = [
  {
    id: 'preset-secret-garden',
    name: 'Secret Garden',
    primary: '#7D9B76',
    secondary: '#C9A9A6',
    accent: '#F7E7CE',
    extra: '#FFFDD0',
    isPreset: true,
  },
  {
    id: 'preset-desert-chic',
    name: 'Desert Chic',
    primary: '#7D9B76',
    secondary: '#C17754',
    accent: '#D4B896',
    extra: '#8B7355',
    isPreset: true,
  },
  {
    id: 'preset-quiet-luxury',
    name: 'Quiet Luxury',
    primary: '#7D9B76',
    secondary: '#FFFFF0',
    accent: '#36454F',
    extra: '#C9A96E',
    isPreset: true,
  },
  {
    id: 'preset-cobalt-fuchsia',
    name: 'Cobalt & Fuchsia',
    primary: '#0047AB',
    secondary: '#FF00FF',
    accent: '#FFFFFF',
    extra: '#C0C0C0',
    isPreset: true,
  },
  {
    id: 'preset-curated-rainbow',
    name: 'Curated Rainbow',
    primary: '#0066FF',
    secondary: '#FFD700',
    accent: '#FF0099',
    extra: '#FFB6C1',
    isPreset: true,
  },
  {
    id: 'preset-blush-navy',
    name: 'Blush & Navy',
    primary: '#E8B4B8',
    secondary: '#002366',
    accent: '#C9A96E',
    extra: '#FFFFF0',
    isPreset: true,
  },
  {
    id: 'preset-modern-meadow',
    name: 'Modern Meadow',
    primary: '#FFF0A0',
    secondary: '#B57EDC',
    accent: '#FF7F6B',
    extra: '#7D9B76',
    isPreset: true,
  },
  {
    id: 'preset-vivid-jewel',
    name: 'Vivid Jewel',
    primary: '#046307',
    secondary: '#800020',
    accent: '#F7E7CE',
    extra: '#B87333',
    isPreset: true,
  },
];

/** Default active scheme on first load */
export const defaultActiveScheme = colorPresets[5]; // Blush & Navy
