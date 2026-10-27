export interface ZuraHouse {
  id: 'datura' | 'iboga' | 'peyote' | 'ayahuasca' | 'kava';
  name: string;
  title: string;
  color: string;
  colorRgb: string;
  symbol: string;
  description: string;
  philosophy: string;
  traits: string[];
  karmaPerk: string;
  image: string;
}

export const HOUSES: ZuraHouse[] = [
  {
    id: 'datura',
    name: 'DATURA',
    title: 'The Philosophers',
    color: '#38bdf8',
    colorRgb: '56, 189, 248',
    symbol: '✧',
    description: 'Seekers of wisdom, consciousness and cosmic understanding.',
    philosophy: 'Through deep contemplation and quantum clarity, Datura pierces the veil of multidimensional reality, deciphering cosmic truths.',
    traits: ['Cosmic Wisdom', 'Mental Fortitude', 'Truth Seeking'],
    karmaPerk: '+20% Astral Insight & Knowledge KP',
    image: '/Houses/house1.png',
  },
  {
    id: 'iboga',
    name: 'IBOGA',
    title: 'The Dreamers',
    color: '#a78bfa',
    colorRgb: '167, 139, 250',
    symbol: '◈',
    description: 'Explorers of imagination, art and possibility.',
    philosophy: 'Iboga transforms thoughts into constellations, weaving visionary dreams and psychedelic frequencies that shape the metaverse.',
    traits: ['Astral Vision', 'Artistic Alchemy', 'Lucid Creation'],
    karmaPerk: '+20% Transmedia Art & Music KP',
    image: '/Houses/house2.png',
  },
  {
    id: 'peyote',
    name: 'PEYOTE',
    title: 'The Optimists',
    color: '#fbbf24',
    colorRgb: '251, 191, 36',
    symbol: '☼',
    description: 'Believers in hope, joy and the infinite potential of life.',
    philosophy: 'Radiating the warmth of ancient suns, Peyote fosters unity, harmony, and unshakeable celebration across all galaxies.',
    traits: ['Harmonic Joy', 'Solar Vitality', 'Infinite Hope'],
    karmaPerk: '+20% Community Unity & Fellowship KP',
    image: '/Houses/house3.png',
  },
  {
    id: 'ayahuasca',
    name: 'AYAHUASCA',
    title: 'The Stewards',
    color: '#4ade80',
    colorRgb: '74, 222, 128',
    symbol: '❋',
    description: 'Protectors of nature, ecosystems and living worlds.',
    philosophy: 'Custodians of biological balance, Ayahuasca heals wounded biomes and bridges organic flora with cosmic technology.',
    traits: ['Eco-Regeneration', 'Plant Communion', 'Planetary Balance'],
    karmaPerk: '+20% Biophilic Stewardship & Ecology KP',
    image: '/Houses/house4.png',
  },
  {
    id: 'kava',
    name: 'KAVA',
    title: 'The Adventurers',
    color: '#f87171',
    colorRgb: '248, 113, 113',
    symbol: '✦',
    description: 'Pioneers of exploration and discovery.',
    philosophy: 'Undaunted by dark matter or unknown voids, Kava charters daring paths through unmapped nebulae and cosmic frontiers.',
    traits: ['Deep Space Nav', 'Courageous Grit', 'Wormhole Flight'],
    karmaPerk: '+20% Deep Frontier Discovery KP',
    image: '/Houses/house5.png',
  },
];
