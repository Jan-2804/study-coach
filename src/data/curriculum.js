export const mathChapters = [
  {
    id: 'pythagoras-basics',
    title: '1. Satz des Pythagoras – Die Grundlagen von Null auf',
    description: 'Was ist Pythagoras, wann darf man ihn anwenden und wie heißen die Seiten?',
    summary: `
Der Satz des Pythagoras gilt **NUR in rechtwinkligen Dreiecken** (ein Winkel ist genau 90°).

### 1. Die Seiten benennen:
- **Hypotenuse:** Die **längste Seite**. Sie liegt immer direkt **gegenüber dem 90°-Winkel**.
- **Katheten:** Die beiden kürzeren Seiten, die den 90°-Winkel einschließen (berühren).

### 2. Die Grundformel:
> **Kathete² + Kathete² = Hypotenuse²**
> Wenn die Katheten $a$ und $b$ heißen und die Hypotenuse $c$:
> $$a^2 + b^2 = c^2$$

### 3. Wann ist ein Dreieck rechtwinklig, spitzwinklig oder stumpfwinklig?
- Wenn $a^2 + b^2 = c^2$ $\rightarrow$ **rechtwinklig** (90°)
- Wenn $a^2 + b^2 > c^2$ $\rightarrow$ **spitzwinklig** (alle Winkel < 90°)
- Wenn $a^2 + b^2 < c^2$ $\rightarrow$ **stumpfwinklig** (ein Winkel > 90°)
    `,
    exercises: [
      {
        id: 'p1',
        title: 'Seiten erkennen',
        question: 'In einem rechtwinkligen Dreieck mit rechtem Winkel bei Punkt C heißt die gegenüberliegende Seite c. Welche Seite ist die Hypotenuse?',
        options: ['Seite a', 'Seite b', 'Seite c', 'Es gibt keine'],
        correctIndex: 2,
        explanation: 'Die Hypotenuse liegt IMMER genau gegenüber des 90°-Rechten-Winkels. Liegt der rechte Winkel bei C, ist c die Hypotenuse.'
      },
      {
        id: 'p2',
        title: 'Dreieckstyp bestimmen',
        question: 'Ein Dreieck hat die Seiten a = 3 cm, b = 4 cm und c = 5 cm. Ist es rechtwinklig? (Rechne: 3² + 4² und vergleiche mit 5²)',
        options: [
          'Ja, weil 9 + 16 = 25 (also 3² + 4² = 5²)',
          'Nein, es ist spitzwinklig',
          'Nein, es ist stumpfwinklig'
        ],
        correctIndex: 0,
        explanation: '3² + 4² = 9 + 16 = 25. Und 5² = 25. Da beide Seiten exakt gleich sind (25 = 25), ist das Dreieck rechtwinklig!'
      },
      {
        id: 'p3',
        title: 'Spitz- oder Stumpfwinklig?',
        question: 'Die Seiten sind a = 4, b = 5, c = 7. Was für ein Dreieck ist das? (4² + 5² = 16 + 25 = 41; c² = 49)',
        options: [
          'Rechtwinklig, weil Dreiecke immer 180° haben',
          'Spitzwinklig, da 41 < 49',
          'Stumpfwinklig, da a² + b² (41) kleiner ist als c² (49)'
        ],
        correctIndex: 2,
        explanation: 'Weil a² + b² (41) kleiner ist als c² (49), hat die Hypotenuse Überlänge und drückt den Winkel über 90° auf $\\rightarrow$ stumpfwinklig!'
      }
    ]
  },
  {
    id: 'pythagoras-calc',
    title: '2. Seiten ausrechnen (Gleichungen umformen)',
    description: 'Wie rechnet man die fehlende Seite Schritt für Schritt aus?',
    summary: `
Es gibt nur **2 Fälle**, die du kennen musst:

### Fall 1: Die Hypotenuse (längste Seite c) wird gesucht:
1. Formel aufstellen: $a^2 + b^2 = c^2$
2. Zahlen einsetzen: z. B. $6^2 + 8^2 = c^2$ $\rightarrow$ $36 + 64 = c^2$ $\rightarrow$ $100 = c^2$
3. **Wurzel ziehen:** $c = \\sqrt{100} = 10$

### Fall 2: Eine Kathete (kurze Seite a oder b) wird gesucht:
1. Formel: $a^2 + b^2 = c^2$
2. Umstellen: Die andere Kathete rüberziehen mit Minus:
   $$a^2 = c^2 - b^2$$
   $$a = \\sqrt{c^2 - b^2}$$
3. **Merke:** Wenn die Hypotenuse gesucht ist $\\rightarrow$ **Plus** unter der Wurzel. Wenn eine Kathete gesucht ist $\\rightarrow$ **Minus** unter der Wurzel (immer Hypotenuse² minus gegebene Kathete²)!
    `,
    exercises: [
      {
        id: 'pc1',
        title: 'Hypotenuse berechnen',
        question: 'Ein rechtwinkliges Dreieck hat die Katheten a = 6 cm und b = 8 cm. Wie lang ist die Hypotenuse c?',
        options: ['10 cm', '14 cm', '48 cm', '7 cm'],
        correctIndex: 0,
        explanation: 'Rechnung: c² = 6² + 8² = 36 + 64 = 100. Wurzel aus 100 ist 10 cm.'
      },
      {
        id: 'pc2',
        title: 'Kathete berechnen',
        question: 'Gegeben ist die Hypotenuse c = 13 cm und eine Kathete b = 12 cm. Wie lang ist Kathete a?',
        options: ['25 cm', '5 cm', '1 cm', '8 cm'],
        correctIndex: 1,
        explanation: 'Rechnung: a² = c² - b² = 13² - 12² = 169 - 144 = 25. Wurzel aus 25 ist 5 cm.'
      }
    ]
  },
  {
    id: 'pythagoras-word-problems',
    title: '3. Anwendungs- & Sachaufgaben (Exakt aus eurem Notizbuch!)',
    description: 'Leiter an der Wand, Schrank kippen, Türbreite, Fußballfeld-Diagonale',
    summary: `
Das war der Schwerpunkt in eurem OneNote-Heft:

### Typ 1: Leiter an der Wand (Seite 69, Nr. 1)
- Die Leiter selbst ist die Schräge $\\rightarrow$ **Hypotenuse $c = 5{,}20$ m**
- Abstand vom Boden zur Wand $\\rightarrow$ **Kathete $a = 1{,}80$ m**
- Gesucht ist die Wandhöhe $\\rightarrow$ **Kathete $b$**
- **Rechnung:**
  $$b = \\sqrt{5{,}20^2 - 1{,}80^2} = \\sqrt{27{,}04 - 3{,}24} = \\sqrt{23{,}8} \\approx 4{,}88\\text{ m}$$

### Typ 2: Schrank kippen / Deckenhöhe (Seite 70, Nr. 11)
- Schrank: Höhe $h = 2{,}00$ m, Breite $b = 1{,}50$ m, Tiefe $t = 0{,}80$ m. Deckenhöhe $= 2{,}20$ m.
- **a) Nach vorne kippen:**
  Diagonale $d = \\sqrt{2{,}00^2 + 1{,}50^2} = \\sqrt{4 + 2{,}25} = \\sqrt{6{,}25} = 2{,}50\\text{ m}$.
  Da $2{,}50\\text{ m} > 2{,}20\\text{ m}$, stößt der Schrank an die Decke! Geht **nicht**.
- **b) Zur Seite kippen:**
  Diagonale $d = \\sqrt{2{,}00^2 + 0{,}80^2} = \\sqrt{4 + 0{,}64} = \\sqrt{4{,}64} \\approx 2{,}15\\text{ m}$.
  Da $2{,}15\\text{ m} < 2{,}20\\text{ m}$, passt der Schrank unter der Decke durch! Geht!

### Typ 3: Fußballfeld Diagonale (Seite 76, Nr. 1)
- Länge $105$ m, Breite $68$ m. Diagonale $d = \\sqrt{105^2 + 68^2} = \\sqrt{11025 + 4624} = \\sqrt{15649} \\approx 125{,}10\\text{ m}$.
    `,
    exercises: [
      {
        id: 'wp1',
        title: 'Die Leiter an der Wand',
        question: 'Eine Leiter ist 5,20 m lang und steht 1,80 m von der Hauswand entfernt. Welche Seite wird gesucht und wie rechnest du sie aus?',
        options: [
          'Kathete b wird gesucht: b = √(5,20² - 1,80²) ≈ 4,88 m',
          'Hypotenuse c wird gesucht: c = √(5,20² + 1,80²) ≈ 5,50 m',
          'Kathete b: b = 5,20 - 1,80 = 3,40 m'
        ],
        correctIndex: 0,
        explanation: 'Die Leiter ist die Schräge (Hypotenuse). Die Wand ist eine Kathete. Daher zieht man das Quadrat der Bodenentfernung ab: √(5,20² - 1,80²) ≈ 4,88 m.'
      },
      {
        id: 'wp2',
        title: 'Schrank aufrichten (Seite 70, Nr. 11)',
        question: 'Ein Schrank ist 2,00 m hoch und 1,50 m breit. Das Zimmer hat eine Deckenhöhe von 2,20 m. Kann man den Schrank aufstellen, indem man ihn nach vorne kippt?',
        options: [
          'Nein, weil seine Kipp-Diagonale √(2² + 1,5²) = 2,50 m ist und das höher als 2,20 m ist.',
          'Ja, weil 2,00 m kleiner als 2,20 m ist.',
          'Ja, der Schrank passt immer.'
        ],
        correctIndex: 0,
        explanation: 'Beim Kippen dreht sich die Diagonale des Schranks nach oben. Die Diagonale ist √(2² + 1,5²) = √6,25 = 2,50 m. Das ist größer als die Decke (2,20 m) – er stößt an!'
      },
      {
        id: 'wp3',
        title: 'Holzplatte durch Tür (Seite 70, Nr. 9)',
        question: 'Eine Tür ist 2,00 m hoch und 0,80 m breit. Wie groß ist die Diagonale der Türöffnung?',
        options: [
          'd = √(2,00² + 0,80²) = √4,64 ≈ 2,15 m',
          'd = 2,00 + 0,80 = 2,80 m',
          'd = √(2,00² - 0,80²) = 1,83 m'
        ],
        correctIndex: 0,
        explanation: 'Die Diagonale der Tür ist die Hypotenuse aus Höhe und Breite: √(2,00² + 0,80²) = √4,64 ≈ 2,15 m (215,4 cm).'
      }
    ]
  },
  {
    id: 'roots-basics',
    title: '4. Wurzeln – Rechnen & Vereinfachen (Wie Variablen!)',
    description: 'Addieren, Subtrahieren, Multiplizieren & Teilweises Wurzelziehen',
    summary: `
Wurzeln sind nichts anderes als die Umkehrung vom Quadrieren: $\\sqrt{25} = 5$, weil $5^2 = 25$.

### Regel 1: Plus und Minus $\\rightarrow$ Wurzeln wie Variablen ($x$) rechnen!
- Du darfst **NUR** Wurzeln mit dem **gleichen Inhalt** zusammenfassen!
- $4\\sqrt{2} + 7\\sqrt{2} = (4 + 7)\\sqrt{2} = 11\\sqrt{2}$ (genau wie $4x + 7x = 11x$)
- $19\\sqrt{5} - 2\\sqrt{5} = 17\\sqrt{5}$
- **ACHTUNG:** $\\sqrt{9} + \\sqrt{16} \\neq \\sqrt{25}$! Denn $3 + 4 = 7$, aber $\\sqrt{25} = 5$. Man darf bei Plus/Minus NIE die Zahlen unter eine gemeinsame Wurzel ziehen!

### Regel 2: Mal und Geteilt $\\rightarrow$ Zusammenziehen erlaubt!
- $\\sqrt{a} \\cdot \\sqrt{b} = \\sqrt{a \\cdot b}$ (z. B. $\\sqrt{2} \\cdot \\sqrt{8} = \\sqrt{16} = 4$)
- $\\frac{\\sqrt{a}}{\\sqrt{b}} = \\sqrt{\\frac{a}{b}}$ (z. B. $\\frac{\\sqrt{50}}{\\sqrt{2}} = \\sqrt{25} = 5$)

### Regel 3: Teilweises Wurzelziehen (Zerlegen in Quadratzahlen):
Wenn eine Wurzel nicht schön aufgeht, zerlege die Zahl in eine Quadratzahl ($4, 9, 16, 25, 36, 49, 64, 81, 100$):
- $\\sqrt{20} = \\sqrt{4 \\cdot 5} = \\sqrt{4} \\cdot \\sqrt{5} = 2\\sqrt{5}$
- $\\sqrt{50} = \\sqrt{25 \\cdot 2} = 5\\sqrt{2}$
- $\\sqrt{72} = \\sqrt{36 \\cdot 2} = 6\\sqrt{2}$
- **Aufgabe aus eurem Heft:** $\\sqrt{5} + \\sqrt{20} = \\sqrt{5} + 2\\sqrt{5} = 3\\sqrt{5}$!
    `,
    exercises: [
      {
        id: 'r1',
        title: 'Wurzeln wie Variablen addieren',
        question: 'Was ergibt 4√2 + 7√2?',
        options: ['11√2', '11√4', '28√2', 'Geht nicht zusammenzufassen'],
        correctIndex: 0,
        explanation: 'Wie bei 4x + 7x = 11x: Die Wurzel bleibt einfach stehen, du rechnest nur 4 + 7 = 11 vor der Wurzel.'
      },
      {
        id: 'r2',
        title: 'Teilweises Wurzelziehen',
        question: 'Wie vereinfacht man √50?',
        options: ['5√2', '25√2', '10√5', '2√25'],
        correctIndex: 0,
        explanation: '50 zerlegt man in die Quadratzahl 25 mal 2: √(25 · 2) = √25 · √2 = 5√2.'
      },
      {
        id: 'r3',
        title: 'Kombinationsaufgabe aus eurem Heft (S. 50, Nr. 11)',
        question: 'Was ergibt √5 + √20?',
        options: [
          '3√5 (weil √20 = 2√5 ist, also 1√5 + 2√5)',
          '√25 = 5',
          '4√5'
        ],
        correctIndex: 0,
        explanation: 'Erst teilweises Wurzelziehen: √20 = √(4 · 5) = 2√5. Dann addieren: 1√5 + 2√5 = 3√5.'
      },
      {
        id: 'r4',
        title: 'Minus mit Zerlegen (S. 50, Nr. 11d)',
        question: 'Was ergibt √50 - √2?',
        options: ['4√2', '√48', '5', '3√2'],
        correctIndex: 0,
        explanation: '√50 ist 5√2. Also rechnet man: 5√2 - 1√2 = 4√2.'
      }
    ]
  },
  {
    id: 'roots-advanced',
    title: '5. Wurzeln – Klammern, Binome & Nenner rational machen',
    description: 'Spezialfälle von Seite 33 und 53 aus eurem Merkheft',
    summary: `
### 1. Ausmultiplizieren:
$\\sqrt{3} \\cdot (\\sqrt{48} + \\sqrt{5})$
- $\\sqrt{3} \\cdot \\sqrt{48} = \\sqrt{144} = 12$
- $\\sqrt{3} \\cdot \\sqrt{5} = \\sqrt{15}$
- **Ergebnis:** $12 + \\sqrt{15}$

### 2. Binomische Formeln mit Wurzeln:
$(a + b)^2 = a^2 + 2ab + b^2$
- **Beispiel aus eurem Heft:** $(10 - 5\\sqrt{2})^2$
  1. Erstes Glied quadrieren: $10^2 = 100$
  2. Doppelter Mittelteil: $- 2 \\cdot 10 \\cdot 5\\sqrt{2} = - 100\\sqrt{2}$
  3. Letztes Glied quadrieren: $(5\\sqrt{2})^2 = 5^2 \\cdot (\\sqrt{2})^2 = 25 \\cdot 2 = 50$
  4. Zusammenfassen: $100 + 50 - 100\\sqrt{2} = 150 - 100\\sqrt{2}$

### 3. Nenner rational machen (Keine Wurzel im Nenner!):
Wenn unten im Bruch eine Wurzel steht, erweitere oben und unten mit genau dieser Wurzel:
$$\\frac{1}{\\sqrt{2}} = \\frac{1 \\cdot \\sqrt{2}}{\\sqrt{2} \\cdot \\sqrt{2}} = \\frac{\\sqrt{2}}{2}$$
$$\\frac{21}{\\sqrt{7}} = \\frac{21\\sqrt{7}}{7} = 3\\sqrt{7}$$
    `,
    exercises: [
      {
        id: 'ra1',
        title: 'Nenner rational machen',
        question: 'Wie schreibt man 21 / √7 ohne Wurzel im Nenner?',
        options: ['3√7', '21√7', '7√3', '3'],
        correctIndex: 0,
        explanation: 'Erweitern mit √7: (21 · √7) / (√7 · √7) = (21√7) / 7. Jetzt 21 durch 7 kürzen = 3√7.'
      },
      {
        id: 'ra2',
        title: 'Quadrat eines Produkts',
        question: 'Was ist (5√2)²?',
        options: ['50', '20', '10', '100'],
        correctIndex: 0,
        explanation: '(5√2)² = 5² · (√2)² = 25 · 2 = 50.'
      }
    ]
  }
];

export const englishChapters = [
  {
    id: 'eng-tenses',
    title: '1. English Tenses (Die wichtigsten Zeitformen für Klasse 9)',
    description: 'Simple Past, Present Perfect, Past Progressive – wann nutzt man was?',
    summary: `
### 1. Simple Past vs. Present Perfect
- **Simple Past:** Handlung in der Vergangenheit ist **abgeschlossen**, bestimmter Zeitpunkt bekannt!
  - Signalwörter: *yesterday, in 2020, two days ago, last week, when I was young*.
  - Bildung: Verb + -ed (oder unregelmäßige 2. Form, z. B. *went, saw, wrote*).
- **Present Perfect:** Handlung hat in Vergangenheit begonnen und hat **Einfluss auf die Gegenwart** oder passiert gerade erst.
  - Signalwörter: *already, just, never, ever, yet, so far, since, for*.
  - Bildung: *have / has* + 3. Form (*past participle*, z. B. *have seen, has gone*).

### 2. Past Progressive
- Handlung war in der Vergangenheit **gerade im Verlauf**, als etwas anderes passierte.
  - Bildung: *was / were + Verb-ing*
  - Beispiel: *I was sleeping when the phone rang.*
    `,
    exercises: [
      {
        id: 'e1',
        title: 'Signalwort erkennen',
        question: 'Welches Verb gehört in die Lücke: "Yesterday, I ... a new phone."?',
        options: ['bought', 'have bought', 'was buying', 'buy'],
        correctIndex: 0,
        explanation: '"Yesterday" verlangt zwingend Simple Past $\\rightarrow$ bought.'
      },
      {
        id: 'e2',
        title: 'Einfluss auf Gegenwart',
        question: '"I am not hungry because I ... just ... lunch."',
        options: ['have / eaten', 'had / ate', 'am / eating', 'was / eating'],
        correctIndex: 0,
        explanation: 'Signalwort "just" und Verbindung zur Gegenwart (nicht hungrig) verlangt Present Perfect $\\rightarrow$ have just eaten.'
      }
    ]
  },
  {
    id: 'eng-conditionals',
    title: '2. Conditional Clauses (If-Sätze Typ 1, 2 und 3)',
    description: 'Bedingungssätze fehlerfrei bilden',
    summary: `
### Typ 1: Sehr wahrscheinlich / Real
- **if-clause:** Simple Present | **main clause:** will-future
- *If it rains, we will stay at home.*

### Typ 2: Unwahrscheinlich / Theoretisch (Gegenwart)
- **if-clause:** Simple Past | **main clause:** would + Infinitiv
- *If I had enough money, I would buy a car.*

### Typ 3: Zu spät / Unmöglich (Vergangenheit)
- **if-clause:** Past Perfect (*had + 3. Form*) | **main clause:** would have + 3. Form
- *If I had studied harder, I would have passed the exam.*
    `,
    exercises: [
      {
        id: 'ec1',
        title: 'Typ 2 If-Satz',
        question: 'Vervollständige: "If I ... the answer, I would tell you."',
        options: ['knew', 'know', 'had known', 'would know'],
        correctIndex: 0,
        explanation: 'Hauptsatz hat "would tell" (Typ 2), also braucht der If-Satz Simple Past $\\rightarrow$ knew.'
      }
    ]
  }
];
