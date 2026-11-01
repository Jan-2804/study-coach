// Spiel-Logik für Boss-Fights, Ränge & XP

export const RANKS = [
  { title: 'Mathe-Novize', minXp: 0, icon: '🌱' },
  { title: 'Zahlen-Lehrling', minXp: 100, icon: '📐' },
  { title: 'Pythagoras-Krieger', minXp: 300, icon: '⚔️' },
  { title: 'Wurzel-Meister', minXp: 600, icon: '🛡️' },
  { title: 'Klassenarbeits-Legende', minXp: 1000, icon: '👑' }
];

export function getRank(xp) {
  let currentRank = RANKS[0];
  for (const r of RANKS) {
    if (xp >= r.minXp) {
      currentRank = r;
    }
  }
  return currentRank;
}

export const BOSSES = [
  {
    id: 'boss-1',
    name: 'Das Hypotenusen-Monster',
    description: 'Beherrscht rechtwinklige Dreiecke und fordert dich heraus, fehlende Seiten im Kopf zu berechnen.',
    avatar: '👹',
    category: 'Satz des Pythagoras',
    maxHp: 100,
    topics: ['c berechnen', 'a berechnen', 'Dreieckstyp prüfen'],
    rewardXp: 150
  },
  {
    id: 'boss-2',
    name: 'Der Wurzel-Golem',
    description: 'Besteht aus massiven Quadratzahlen. Zerlege seine Wurzeln, um seine Rüstung zu knacken!',
    avatar: '🗿',
    category: 'Wurzelrechnung & Zerlegen',
    maxHp: 120,
    topics: ['Teilweises Wurzelziehen', 'Wurzeln wie Variablen addieren'],
    rewardXp: 200
  },
  {
    id: 'boss-3',
    name: 'Der Geometrie-Titan (Endboss)',
    description: 'Meister der realen Anwendungsaufgaben: Leitern, kippende Schränke und Raumdiagonalen!',
    avatar: '🐉',
    category: 'Sachaufgaben der 9a',
    maxHp: 150,
    topics: ['Leiter an Wand', 'Schrank kippen', 'Nenner rational machen'],
    rewardXp: 300
  }
];
