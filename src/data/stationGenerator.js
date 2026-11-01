// Generator für dynamische Lernstationen mit immer neuen Zahlen

const pythagoreanTriples = [
  [3, 4, 5],
  [6, 8, 10],
  [5, 12, 13],
  [8, 15, 17],
  [7, 24, 25],
  [9, 12, 15],
  [12, 16, 20],
  [10, 24, 26],
  [15, 20, 25],
  [20, 21, 29]
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

export function generateDynamicStation(stationIndex) {
  // Station 0: Pythagoras Grundlagen (Dreiecksarten & Seiten erkennen)
  if (stationIndex === 0) {
    const trip = pythagoreanTriples[Math.floor(Math.random() * pythagoreanTriples.length)];
    const [a, b, c] = trip;

    // Zufälliges Nicht-Rechtwinkliges Dreieck generieren
    const isAcute = Math.random() > 0.5;
    const testA = Math.floor(Math.random() * 4) + 3;
    const testB = testA + Math.floor(Math.random() * 3) + 1;
    const sumSq = testA * testA + testB * testB;
    // wenn acute -> c² < sumSq; wenn obtuse -> c² > sumSq
    let testC = isAcute ? Math.floor(Math.sqrt(sumSq)) : Math.ceil(Math.sqrt(sumSq)) + 1;
    if (testC <= testB) testC = testB + 1;

    const actualSum = testA * testA + testB * testB;
    const cSq = testC * testC;
    const dreieckTyp = actualSum === cSq ? 'Rechtwinklig (genau 90°)' : (actualSum > cSq ? 'Spitzwinklig (alle < 90°)' : 'Stumpfwinklig (ein Winkel > 90°)');
    const explanation = `Rechnung: a² + b² = ${testA}² + ${testB}² = ${actualSum}. Die längste Seite quadriert: c² = ${testC}² = ${cSq}. Da ${actualSum} ${actualSum === cSq ? '=' : (actualSum > cSq ? '>' : '<')} ${cSq}, ist das Dreieck ${dreieckTyp}!`;

    return [
      {
        id: `s0-ex1-${Date.now()}`,
        title: 'Seitenbezeichnung erkennen',
        question: `In einem rechtwinkligen Dreieck mit rechtem Winkel bei Punkt C ist die gegenüberliegende Seite c = ${c} cm lang, die anderen beiden Seiten sind a = ${a} cm und b = ${b} cm. Welche Seite ist die Hypotenuse?`,
        options: ['Seite a', 'Seite b', `Seite c (${c} cm)`, 'Keine von beiden'],
        correctIndex: 2,
        explanation: `Die Hypotenuse liegt IMMER genau gegenüber dem 90°-Winkel und ist die längste Seite (${c} cm).`
      },
      {
        id: `s0-ex2-${Date.now()}`,
        title: 'Dreiecksart rechnerisch prüfen',
        question: `Gegeben sind die Seiten a = ${testA} cm, b = ${testB} cm und c = ${testC} cm. Welche Art von Dreieck liegt vor?`,
        options: shuffle([
          dreieckTyp,
          dreieckTyp.startsWith('Recht') ? 'Spitzwinklig (alle < 90°)' : 'Rechtwinklig (genau 90°)',
          dreieckTyp.startsWith('Stumpf') ? 'Spitzwinklig (alle < 90°)' : 'Stumpfwinklig (ein Winkel > 90°)'
        ]),
        correctIndex: -1, // wird dynamisch gesetzt
        correctText: dreieckTyp,
        explanation
      }
    ].map(ex => {
      if (ex.correctIndex === -1) {
        ex.correctIndex = ex.options.indexOf(ex.correctText);
      }
      return ex;
    });
  }

  // Station 1: Seiten berechnen (Gleichungen umformen)
  if (stationIndex === 1) {
    const t1 = pythagoreanTriples[Math.floor(Math.random() * pythagoreanTriples.length)];
    const [a1, b1, c1] = t1;

    const t2 = pythagoreanTriples[Math.floor(Math.random() * pythagoreanTriples.length)];
    const [a2, b2, c2] = t2;

    const q1Opts = shuffle([`${c1} cm`, `${c1 + 2} cm`, `${a1 + b1} cm`, `${Math.round(Math.sqrt(a1 + b1))} cm`]);
    const q2Opts = shuffle([`${a2} cm`, `${c2 - b2} cm`, `${a2 + 2} cm`, `${Math.round(Math.sqrt(c2*c2 + b2*b2))} cm`]);

    return [
      {
        id: `s1-ex1-${Date.now()}`,
        title: 'Hypotenuse c berechnen',
        question: `Gegeben sind die beiden Katheten a = ${a1} cm und b = ${b1} cm. Berechne die Hypotenuse c.`,
        options: q1Opts,
        correctIndex: q1Opts.indexOf(`${c1} cm`),
        explanation: `Formel: c² = a² + b² = ${a1}² + ${b1}² = ${a1*a1} + ${b1*b1} = ${c1*c1}. Wurzel daraus: c = √${c1*c1} = ${c1} cm.`
      },
      {
        id: `s1-ex2-${Date.now()}`,
        title: 'Kathete a berechnen (Gleichung umstellen)',
        question: `Gegeben sind die Hypotenuse c = ${c2} cm und die Kathete b = ${b2} cm. Berechne Kathete a.`,
        options: q2Opts,
        correctIndex: q2Opts.indexOf(`${a2} cm`),
        explanation: `Formel umstellen mit Minus: a² = c² - b² = ${c2}² - ${b2}² = ${c2*c2} - ${b2*b2} = ${a2*a2}. Wurzel daraus: a = √${a2*a2} = ${a2} cm.`
      }
    ];
  }

  // Station 2: Sachaufgaben (Leiter, Schrank, Tür)
  if (stationIndex === 2) {
    const ladderLens = [4.5, 5.0, 5.2, 5.5, 6.0, 6.5];
    const wallDists = [1.2, 1.5, 1.8, 2.0, 2.4];
    const L = ladderLens[Math.floor(Math.random() * ladderLens.length)];
    const D = wallDists[Math.floor(Math.random() * wallDists.length)];
    const H = Math.sqrt(L * L - D * D).toFixed(2);

    const sH = (Math.floor(Math.random() * 3) + 20) / 10; // 2.0, 2.1, 2.2
    const sB = 1.5;
    const diag = Math.sqrt(sH * sH + sB * sB).toFixed(2);
    const roomH = (parseFloat(diag) - 0.2).toFixed(2);

    return [
      {
        id: `s2-ex1-${Date.now()}`,
        title: 'Leiter an der Hauswand (Seite 69, Nr. 1)',
        question: `Eine Leiter ist ${L.toFixed(2)} m lang. Sie steht am Boden ${D.toFixed(2)} m von der Wand entfernt. Wie hoch reicht sie an der Wand?`,
        options: shuffle([`${H} m`, `${(L - D).toFixed(2)} m`, `${(parseFloat(H) + 0.5).toFixed(2)} m`, `${(Math.sqrt(L*L + D*D)).toFixed(2)} m`]),
        correctIndex: -1,
        correctText: `${H} m`,
        explanation: `Die Leiter ist die Schräge (Hypotenuse). Wandhöhe = √(${L}² - ${D}²) = √(${(L*L - D*D).toFixed(2)}) ≈ ${H} m.`
      },
      {
        id: `s2-ex2-${Date.now()}`,
        title: 'Schrank aufrichten / Deckenhöhe (Seite 70, Nr. 11)',
        question: `Ein Schrank ist ${sH.toFixed(2)} m hoch und ${sB.toFixed(2)} m breit. Die Decke ist ${roomH} m hoch. Passt der Schrank beim Kippen nach vorne durch?`,
        options: [
          `Nein, weil seine Diagonale √(${sH}² + ${sB}²) = ${diag} m ist und das höher als ${roomH} m ist!`,
          `Ja, weil die Schrankhöhe ${sH.toFixed(2)} m kleiner als ${roomH} m ist.`,
          `Ja, Schränke passen immer beim Kippen.`
        ],
        correctIndex: 0,
        explanation: `Beim Aufrichten dreht sich die Diagonale nach oben! Diagonale = √(${sH}² + ${sB}²) = ${diag} m. Das ist höher als die Zimmerdecke (${roomH} m), er schlägt also an der Decke an!`
      }
    ].map(ex => {
      if (ex.correctIndex === -1) ex.correctIndex = ex.options.indexOf(ex.correctText);
      return ex;
    });
  }

  // Station 3: Rechnen mit Wurzeln (Wie Variablen & Zerlegen)
  if (stationIndex === 3) {
    const k1 = Math.floor(Math.random() * 7) + 2;
    const k2 = Math.floor(Math.random() * 7) + 2;
    const rRoot = [2, 3, 5, 7][Math.floor(Math.random() * 4)];
    const sumK = k1 + k2;

    const sqItem = squareRoots[Math.floor(Math.random() * squareRoots.length)];

    return [
      {
        id: `s3-ex1-${Date.now()}`,
        title: 'Wurzeln wie Variablen addieren',
        question: `Fasse zusammen: ${k1}√${rRoot} + ${k2}√${rRoot}`,
        options: shuffle([`${sumK}√${rRoot}`, `${sumK}√${rRoot * 2}`, `${k1 * k2}√${rRoot}`, `Geht nicht zusammenzufassen`]),
        correctIndex: -1,
        correctText: `${sumK}√${rRoot}`,
        explanation: `Genau wie ${k1}x + ${k2}x = ${sumK}x: Die Wurzel bleibt stehen, du addierst nur die Zahlen davor (${k1} + ${k2} = ${sumK}).`
      },
      {
        id: `s3-ex2-${Date.now()}`,
        title: 'Teilweises Wurzelziehen durch Zerlegen',
        question: `Zerlege die Wurzel so weit wie möglich: √${sqItem.val}`,
        options: shuffle([sqItem.simp, `${sqItem.remain}√${sqItem.factor}`, `${Math.sqrt(sqItem.factor)}√${sqItem.val}`, `${sqItem.val / 2}√2`]),
        correctIndex: -1,
        correctText: sqItem.simp,
        explanation: `√${sqItem.val} = √(${sqItem.factor} · ${sqItem.remain}) = √${sqItem.factor} · √${sqItem.remain} = ${sqItem.simp}.`
      }
    ].map(ex => {
      if (ex.correctIndex === -1) ex.correctIndex = ex.options.indexOf(ex.correctText);
      return ex;
    });
  }

  // Station 4: Spezialregeln (Nenner rational machen)
  if (stationIndex === 4) {
    const pairs = [
      { top: 21, bot: 7, ans: '3√7' },
      { top: 15, bot: 5, ans: '3√5' },
      { top: 18, bot: 3, ans: '6√3' },
      { top: 14, bot: 2, ans: '7√2' },
      { top: 20, bot: 5, ans: '4√5' },
      { top: 12, bot: 3, ans: '4√3' }
    ];
    const p = pairs[Math.floor(Math.random() * pairs.length)];
    const num = Math.floor(Math.random() * 4) + 2; // 2, 3, 4, 5
    const root = [2, 3, 5][Math.floor(Math.random() * 3)];
    const prodSquare = (num * num) * root; // (num√root)²

    return [
      {
        id: `s4-ex1-${Date.now()}`,
        title: 'Nenner rational machen (S. 51, Nr. 20)',
        question: `Schreibe den Bruch ${p.top} / √${p.bot} ohne Wurzel im Nenner:`,
        options: shuffle([p.ans, `${p.top}√${p.bot}`, `${p.bot}√${p.top}`, `${p.top / p.bot}`]),
        correctIndex: -1,
        correctText: p.ans,
        explanation: `Erweitern mit √${p.bot}: (${p.top} · √${p.bot}) / (√${p.bot} · √${p.bot}) = (${p.top}√${p.bot}) / ${p.bot} = ${p.ans}.`
      },
      {
        id: `s4-ex2-${Date.now()}`,
        title: 'Quadrat eines Produkts',
        question: `Berechne: (${num}√${root})²`,
        options: shuffle([`${prodSquare}`, `${num * root}`, `${num * num * root * root}`, `${num * root * 2}`]),
        correctIndex: -1,
        correctText: `${prodSquare}`,
        explanation: `(${num}√${root})² = ${num}² · (√${root})² = ${num * num} · ${root} = ${prodSquare}.`
      }
    ].map(ex => {
      if (ex.correctIndex === -1) ex.correctIndex = ex.options.indexOf(ex.correctText);
      return ex;
    });
  }

  return [];
}
