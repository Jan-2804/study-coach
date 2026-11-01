// Generator für unendliche Probeklassenarbeiten und dynamische Aufgaben
// Jedes Mal werden neue Zahlen generiert, sodass man nie dieselbe Arbeit zweimal schreibt!

const pythagoreanTriples = [
  [3, 4, 5],
  [6, 8, 10],
  [5, 12, 13],
  [8, 15, 17],
  [7, 24, 25],
  [9, 12, 15],
  [12, 16, 20],
  [10, 24, 26]
];

const squareRoots = [
  { val: 8, simp: '2√2', factor: 4, remain: 2 },
  { val: 12, simp: '2√3', factor: 4, remain: 3 },
  { val: 18, simp: '3√2', factor: 9, remain: 2 },
  { val: 20, simp: '2√5', factor: 4, remain: 5 },
  { val: 24, simp: '2√6', factor: 4, remain: 6 },
  { val: 27, simp: '3√3', factor: 9, remain: 3 },
  { val: 32, simp: '4√2', factor: 16, remain: 2 },
  { val: 45, simp: '3√5', factor: 9, remain: 5 },
  { val: 48, simp: '4√3', factor: 16, remain: 3 },
  { val: 50, simp: '5√2', factor: 25, remain: 2 },
  { val: 72, simp: '6√2', factor: 36, remain: 2 },
  { val: 75, simp: '5√3', factor: 25, remain: 3 },
  { val: 98, simp: '7√2', factor: 49, remain: 2 },
  { val: 108, simp: '6√3', factor: 36, remain: 3 }
];

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function generateExam() {
  const questions = [];

  // 1. Hypotenuse gesucht (c = √(a² + b²))
  const triple1 = pythagoreanTriples[Math.floor(Math.random() * pythagoreanTriples.length)];
  const [a1, b1, c1] = triple1;
  const q1Options = shuffle([
    `${c1} cm`,
    `${c1 + 2} cm`,
    `${a1 + b1} cm`,
    `${Math.round(Math.sqrt(a1 + b1))} cm`
  ]);
  questions.push({
    id: 'exam-1',
    category: 'Satz des Pythagoras',
    title: 'Aufgabe 1: Hypotenuse berechnen',
    question: `In einem rechtwinkligen Dreieck sind die Katheten a = ${a1} cm und b = ${b1} cm gegeben. Berechne die Hypotenuse c.`,
    options: q1Options,
    correctAnswer: `${c1} cm`,
    steps: [
      `Schritt 1: Formel notieren -> a² + b² = c²`,
      `Schritt 2: Zahlen einsetzen -> ${a1}² + ${b1}² = c²`,
      `Schritt 3: Quadrieren -> ${a1 * a1} + ${b1 * b1} = ${c1 * c1}`,
      `Schritt 4: Wurzel ziehen -> c = √${c1 * c1} = ${c1} cm`
    ]
  });

  // 2. Kathete gesucht (a = √(c² - b²))
  const triple2 = pythagoreanTriples[Math.floor(Math.random() * pythagoreanTriples.length)];
  const [a2, b2, c2] = triple2;
  const q2Options = shuffle([
    `${a2} cm`,
    `${c2 - b2} cm`,
    `${a2 + 3} cm`,
    `${Math.round(Math.sqrt(c2 * c2 + b2 * b2))} cm`
  ]);
  questions.push({
    id: 'exam-2',
    category: 'Satz des Pythagoras',
    title: 'Aufgabe 2: Kathete gesucht (Umkehrung)',
    question: `Ein rechtwinkliges Dreieck hat die Hypotenuse c = ${c2} cm und die Kathete b = ${b2} cm. Berechne die fehlende Kathete a.`,
    options: q2Options,
    correctAnswer: `${a2} cm`,
    steps: [
      `Schritt 1: Grundformel a² + b² = c² umstellen nach a²:`,
      `Schritt 2: a² = c² - b² (immer Hypotenuse² minus gegebene Kathete²!)`,
      `Schritt 3: Einsetzen: a² = ${c2}² - ${b2}² = ${c2 * c2} - ${b2 * b2} = ${a2 * a2}`,
      `Schritt 4: Wurzel ziehen: a = √${a2 * a2} = ${a2} cm`
    ]
  });

  // 3. Dreiecksart prüfen (rechtwinklig / spitzwinklig / stumpfwinklig)
  const types = ['right', 'acute', 'obtuse'];
  const chosenType = types[Math.floor(Math.random() * types.length)];
  let sa, sb, sc, corrType, expText;
  if (chosenType === 'right') {
    [sa, sb, sc] = pythagoreanTriples[Math.floor(Math.random() * 4)];
    corrType = 'Rechtwinklig (genau 90°)';
    expText = `Weil ${sa}² + ${sb}² = ${sa*sa + sb*sb} exakt gleich ${sc}² (${sc*sc}) ist!`;
  } else if (chosenType === 'acute') {
    sa = 5; sb = 6; sc = 7; // 25 + 36 = 61 > 49
    corrType = 'Spitzwinklig (alle Winkel < 90°)';
    expText = `Weil a² + b² (${sa*sa + sb*sb}) GRÖSSER ist als c² (${sc*sc})!`;
  } else {
    sa = 3; sb = 4; sc = 6; // 9 + 16 = 25 < 36
    corrType = 'Stumpfwinklig (ein Winkel > 90°)';
    expText = `Weil a² + b² (${sa*sa + sb*sb}) KLEINER ist als c² (${sc*sc})!`;
  }
  questions.push({
    id: 'exam-3',
    category: 'Dreiecksarten',
    title: 'Aufgabe 3: Dreiecksart bestimmen',
    question: `Ein Dreieck hat die Seiten a = ${sa} cm, b = ${sb} cm und c = ${sc} cm. Welche Art von Dreieck liegt vor?`,
    options: ['Rechtwinklig (genau 90°)', 'Spitzwinklig (alle Winkel < 90°)', 'Stumpfwinklig (ein Winkel > 90°)'],
    correctAnswer: corrType,
    steps: [
      `Schritt 1: Berechne a² + b² = ${sa}² + ${sb}² = ${sa*sa} + ${sb*sb} = ${sa*sa + sb*sb}`,
      `Schritt 2: Berechne c² = ${sc}² = ${sc*sc}`,
      `Schritt 3: Vergleichen -> ${expText}`
    ]
  });

  // 4. Echte Sachaufgabe: Leiter an der Wand
  const ladderLengths = [4.5, 5.0, 5.2, 5.5, 6.0];
  const wallDistances = [1.5, 1.8, 2.0, 2.2];
  const lLen = ladderLengths[Math.floor(Math.random() * ladderLengths.length)];
  const wDist = wallDistances[Math.floor(Math.random() * wallDistances.length)];
  const wHeight = Math.sqrt(lLen * lLen - wDist * wDist).toFixed(2);
  const q4Options = shuffle([
    `${wHeight} m`,
    `${(lLen - wDist).toFixed(2)} m`,
    `${(Math.sqrt(lLen * lLen + wDist * wDist)).toFixed(2)} m`,
    `${(lLen + 0.5).toFixed(2)} m`
  ]);
  questions.push({
    id: 'exam-4',
    category: 'Sachaufgaben',
    title: 'Aufgabe 4: Sachaufgabe – Leiter an der Hauswand (aus eurem Buch)',
    question: `Eine Leiter ist ${lLen.toFixed(2)} m lang. Sie wird so an eine Wand gelehnt, dass ihr Fußpunkt ${wDist.toFixed(2)} m von der Wand entfernt ist. Wie hoch reicht die Leiter an der Wand hinauf?`,
    options: q4Options,
    correctAnswer: `${wHeight} m`,
    steps: [
      `Schritt 1: Skizze erstellen. Die schräge Leiter ist die Hypotenuse c = ${lLen} m.`,
      `Schritt 2: Der Abstand am Boden ist Kathete a = ${wDist} m. Die Wandhöhe ist Kathete h.`,
      `Schritt 3: Formel umstellen: h² = c² - a²`,
      `Schritt 4: Einsetzen: h = √(${lLen}² - ${wDist}²) = √(${(lLen*lLen).toFixed(2)} - ${(wDist*wDist).toFixed(2)}) = √${(lLen*lLen - wDist*wDist).toFixed(2)} ≈ ${wHeight} m`,
      `Antwort: Die Leiter reicht ca. ${wHeight} m an der Wand hinauf.`
    ]
  });

  // 5. Wurzeln wie Variablen addieren / subtrahieren
  const num1 = Math.floor(Math.random() * 8) + 2;
  const num2 = Math.floor(Math.random() * 8) + 2;
  const rootVal = [2, 3, 5, 7][Math.floor(Math.random() * 4)];
  const sumCoeff = num1 + num2;
  questions.push({
    id: 'exam-5',
    category: 'Rechnen mit Wurzeln',
    title: 'Aufgabe 5: Wurzeln wie Variablen addieren',
    question: `Fasse den folgenden Term so weit wie möglich zusammen: ${num1}√${rootVal} + ${num2}√${rootVal}`,
    options: shuffle([
      `${sumCoeff}√${rootVal}`,
      `${sumCoeff}√${rootVal * 2}`,
      `${num1 * num2}√${rootVal}`,
      `Geht nicht zusammenzufassen`
    ]),
    correctAnswer: `${sumCoeff}√${rootVal}`,
    steps: [
      `Regel aus eurem Heft: Man verwendet bei Addition Wurzeln wie Variablen!`,
      `Denke an: ${num1}x + ${num2}x = ${sumCoeff}x`,
      `Also: (${num1} + ${num2}) · √${rootVal} = ${sumCoeff}√${rootVal}`
    ]
  });

  // 6. Teilweises Wurzelziehen (Zerlegen)
  const item = squareRoots[Math.floor(Math.random() * squareRoots.length)];
  questions.push({
    id: 'exam-6',
    category: 'Rechnen mit Wurzeln',
    title: 'Aufgabe 6: Teilweises Wurzelziehen (Zerlegen)',
    question: `Ziehe die Wurzel teilweise durch Zerlegen: √${item.val}`,
    options: shuffle([
      item.simp,
      `${Math.sqrt(item.factor)}√${item.val}`,
      `${item.remain}√${item.factor}`,
      `${item.val / 2}√2`
    ]),
    correctAnswer: item.simp,
    steps: [
      `Schritt 1: Zerlege die Zahl ${item.val} in eine Quadratzahl (${item.factor}) und einen Rest (${item.remain}):`,
      `√${item.val} = √(${item.factor} · ${item.remain})`,
      `Schritt 2: Wurzel aus der Quadratzahl ziehen: √${item.factor} = ${Math.sqrt(item.factor)}`,
      `Ergebnis: ${item.simp}`
    ]
  });

  // 7. Kombinationsaufgabe: Zerlegen und Addieren (wie S. 50 Nr. 11)
  // z.B. √5 + √20 = √5 + 2√5 = 3√5
  const comboOptions = shuffle([
    '3√5',
    '√25 = 5',
    '4√5',
    '2√5'
  ]);
  questions.push({
    id: 'exam-7',
    category: 'Rechnen mit Wurzeln',
    title: 'Aufgabe 7: Heft-Klassiker (S. 50, Nr. 11)',
    question: `Fasse zusammen: √5 + √20`,
    options: comboOptions,
    correctAnswer: '3√5',
    steps: [
      `Schritt 1: Die beiden Wurzeln haben noch nicht den gleichen Inhalt. Wir zerlegen √20:`,
      `√20 = √(4 · 5) = 2√5`,
      `Schritt 2: Jetzt haben beide dieselbe Wurzel (√5):`,
      `1√5 + 2√5 = 3√5`
    ]
  });

  // 8. Nenner rational machen (S. 51, Nr. 20)
  const denFactors = [
    { top: 21, bot: 7, res: '3√7' },
    { top: 15, bot: 5, res: '3√5' },
    { top: 18, bot: 3, res: '6√3' },
    { top: 14, bot: 2, res: '7√2' }
  ];
  const denChoice = denFactors[Math.floor(Math.random() * denFactors.length)];
  questions.push({
    id: 'exam-8',
    category: 'Spezialregeln',
    title: 'Aufgabe 8: Nenner rational machen (Keine Wurzel unten im Bruch)',
    question: `Schreibe den Bruch so, dass keine Wurzel mehr im Nenner steht: ${denChoice.top} / √${denChoice.bot}`,
    options: shuffle([
      denChoice.res,
      `${denChoice.top}√${denChoice.bot}`,
      `${denChoice.bot}√${denChoice.top}`,
      `${Math.floor(denChoice.top / denChoice.bot)}`
    ]),
    correctAnswer: denChoice.res,
    steps: [
      `Schritt 1: Erweitere den Bruch oben und unten mit der Wurzel des Nenners (√${denChoice.bot}):`,
      `(${denChoice.top} · √${denChoice.bot}) / (√${denChoice.bot} · √${denChoice.bot})`,
      `Schritt 2: Im Nenner ergibt √${denChoice.bot} · √${denChoice.bot} = ${denChoice.bot}`,
      `Schritt 3: Kürzen: ${denChoice.top} geteilt durch ${denChoice.bot} = ${denChoice.top / denChoice.bot}`,
      `Ergebnis: ${denChoice.res}`
    ]
  });

  return questions;
}
