import React, { useState } from 'react';

const DICE_CHARS = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

const UPPER_CATEGORIES = [
  { id: 'ones', name: 'Einser', num: 1 },
  { id: 'twos', name: 'Zweier', num: 2 },
  { id: 'threes', name: 'Dreier', num: 3 },
  { id: 'fours', name: 'Vierer', num: 4 },
  { id: 'fives', name: 'Fünfer', num: 5 },
  { id: 'sixes', name: 'Sechser', num: 6 }
];

const LOWER_CATEGORIES = [
  { id: 'threeOfAKind', name: 'Dreierpasch' },
  { id: 'fourOfAKind', name: 'Viererpasch' },
  { id: 'fullHouse', name: 'Full-House' },
  { id: 'smallStraight', name: 'Kleine Straße' },
  { id: 'largeStraight', name: 'Große Straße' },
  { id: 'yahtzee', name: 'Kniffel' },
  { id: 'chance', name: 'Chance' }
];

export default function KniffelGame({ onGainXp }) {
  const [dice, setDice] = useState([1, 1, 1, 1, 1]);
  const [kept, setKept] = useState([false, false, false, false, false]);
  const [rollsLeft, setRollsLeft] = useState(3);
  const [round, setRound] = useState(1);
  const [currentTurn, setCurrentTurn] = useState('player');

  const [playerScores, setPlayerScores] = useState({});
  const [botScores, setBotScores] = useState({});
  const [message, setMessage] = useState('Würfle und trage ein. Vor jedem Eintrag musst du eine Klassenarbeits-Aufgabe lösen!');

  // Pflicht-Matheaufgabe zum Freischalten des Eintrags!
  const [mathModal, setMathModal] = useState(null);

  const rollDice = () => {
    if (rollsLeft <= 0 || currentTurn !== 'player') return;

    const newDice = dice.map((d, idx) => {
      return kept[idx] ? d : Math.floor(Math.random() * 6) + 1;
    });

    setDice(newDice);
    setRollsLeft(prev => prev - 1);
    setMessage(`Würfe übrig: ${rollsLeft - 1}. Wähle Würfel zum Behalten.`);
  };

  const toggleKeep = (index) => {
    if (rollsLeft === 3 || currentTurn !== 'player') return;
    setKept(prev => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  const calculateScore = (catId, currentDice) => {
    const counts = {};
    let sum = 0;
    currentDice.forEach(d => {
      counts[d] = (counts[d] || 0) + 1;
      sum += d;
    });

    const upper = UPPER_CATEGORIES.find(u => u.id === catId);
    if (upper) return (counts[upper.num] || 0) * upper.num;

    if (catId === 'threeOfAKind') return Object.values(counts).some(c => c >= 3) ? sum : 0;
    if (catId === 'fourOfAKind') return Object.values(counts).some(c => c >= 4) ? sum : 0;
    if (catId === 'fullHouse') {
      const vals = Object.values(counts);
      return ((vals.includes(3) && vals.includes(2)) || vals.includes(5)) ? 25 : 0;
    }
    if (catId === 'smallStraight') {
      const unique = [...new Set(currentDice)].sort().join('');
      return (unique.includes('1234') || unique.includes('2345') || unique.includes('3456')) ? 30 : 0;
    }
    if (catId === 'largeStraight') {
      const unique = [...new Set(currentDice)].sort().join('');
      return (unique === '12345' || unique === '23456') ? 40 : 0;
    }
    if (catId === 'yahtzee') return Object.values(counts).some(c => c === 5) ? 50 : 0;
    if (catId === 'chance') return sum;
    return 0;
  };

  // Klick auf Scorecard öffnet PFLICHT-Matheaufgabe
  const chooseCategory = (catId) => {
    if (rollsLeft === 3 || currentTurn !== 'player' || playerScores[catId] !== undefined) return;

    const baseScore = calculateScore(catId, dice);

    // Echte Klassenarbeitsaufgabe generieren (Pythagoras oder Wurzel)
    const taskTypes = ['pyth', 'root'];
    const chosen = taskTypes[Math.floor(Math.random() * taskTypes.length)];
    let questionText, correctAns, optList, expl;

    if (chosen === 'pyth') {
      const trips = [[3, 4, 5], [6, 8, 10], [5, 12, 13]];
      const [a, b, c] = trips[Math.floor(Math.random() * trips.length)];
      questionText = `Um dein Feld einzutragen: Berechne Kathete a, wenn Hypotenuse c = ${c} cm und Kathete b = ${b} cm ist:`;
      correctAns = `${a} cm`;
      optList = [`${a} cm`, `${c - b} cm`, `${a + 2} cm`, `${c + 1} cm`].sort(() => Math.random() - 0.5);
      expl = `a² = ${c}² - ${b}² = ${c*c} - ${b*b} = ${a*a} -> a = ${a} cm`;
    } else {
      const num1 = Math.floor(Math.random() * 5) + 2;
      const num2 = Math.floor(Math.random() * 5) + 2;
      questionText = `Um dein Feld einzutragen: Fasse zusammen: ${num1}√2 + ${num2}√2`;
      correctAns = `${num1 + num2}√2`;
      optList = [`${num1 + num2}√2`, `${num1 + num2}√4`, `${num1 * num2}√2`, `Geht nicht`].sort(() => Math.random() - 0.5);
      expl = `Wie bei Variablen: (${num1} + ${num2})√2 = ${num1 + num2}√2`;
    }

    setMathModal({
      catId,
      baseScore,
      question: questionText,
      options: optList,
      correct: correctAns,
      explanation: expl
    });
  };

  const handleMathAnswer = (selectedOpt) => {
    const { catId, baseScore, correct, explanation } = mathModal;
    const isCorrect = selectedOpt === correct;

    let finalScore = baseScore;
    if (isCorrect) {
      finalScore += 5; // Bonus +5 Punkte!
      onGainXp(30);
      setMessage(`✓ Aufgabe gelöst! Volle Punkte + 5 Bonus-Punkte eingetragen!`);
    } else {
      finalScore = Math.max(0, Math.floor(baseScore / 2)); // Punktabzug bei falscher Rechnung!
      setMessage(`❌ Rechenfehler! Nur halbe Punkte erhalten. Erklärung: ${explanation}`);
    }

    setPlayerScores(prev => ({ ...prev, [catId]: finalScore }));
    setMathModal(null);

    // Bot ist dran
    setCurrentTurn('bot');
    setTimeout(() => runBotTurn(), 900);
  };

  const runBotTurn = () => {
    const botDice = [
      Math.floor(Math.random() * 6) + 1,
      Math.floor(Math.random() * 6) + 1,
      Math.floor(Math.random() * 6) + 1,
      Math.floor(Math.random() * 6) + 1,
      Math.floor(Math.random() * 6) + 1
    ];

    const allCats = [...UPPER_CATEGORIES.map(u => u.id), ...LOWER_CATEGORIES.map(l => l.id)];
    const openCats = allCats.filter(c => botScores[c] === undefined);

    if (openCats.length > 0) {
      let bestCat = openCats[0];
      let maxScore = -1;
      openCats.forEach(c => {
        const sc = calculateScore(c, botDice);
        if (sc > maxScore) {
          maxScore = sc;
          bestCat = c;
        }
      });
      setBotScores(prev => ({ ...prev, [bestCat]: maxScore }));
      setMessage(`Bot hat ${maxScore} Punkte eingetragen. Du bist dran!`);
    }

    setRound(r => r + 1);
    setRollsLeft(3);
    setKept([false, false, false, false, false]);
    setDice([1, 1, 1, 1, 1]);
    setCurrentTurn('player');
  };

  const getTotals = (scores) => {
    let upperSum = 0;
    UPPER_CATEGORIES.forEach(u => { upperSum += (scores[u.id] || 0); });
    const bonus = upperSum >= 63 ? 35 : 0;
    let lowerSum = 0;
    LOWER_CATEGORIES.forEach(l => { lowerSum += (scores[l.id] || 0); });
    return { upperSum, bonus, total: upperSum + bonus + lowerSum };
  };

  const pTotals = getTotals(playerScores);
  const bTotals = getTotals(botScores);

  return (
    <div style={{
      backgroundColor: '#3b2514',
      borderRadius: '12px',
      padding: '16px',
      color: '#ffffff',
      display: 'grid',
      gridTemplateColumns: 'minmax(280px, 340px) 1fr',
      gap: '16px',
      minHeight: '600px'
    }}>
      {/* Scorecard */}
      <div style={{ backgroundColor: '#f8fafc', color: '#0f172a', borderRadius: '12px', padding: '12px', fontSize: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', borderBottom: '2px solid #cbd5e1', paddingBottom: '4px', fontWeight: 800 }}>
          <span>Runde {round} / 13</span>
          <span>👶 Du: {pTotals.total} | 🤖 Bot: {bTotals.total}</span>
        </div>

        <div style={{ border: '1px solid #cbd5e1', borderRadius: '6px', overflow: 'hidden', marginBottom: '8px' }}>
          {UPPER_CATEGORIES.map(cat => {
            const isFilled = playerScores[cat.id] !== undefined;
            const preview = calculateScore(cat.id, dice);
            return (
              <div
                key={cat.id}
                onClick={() => chooseCategory(cat.id)}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 45px 45px',
                  padding: '5px 8px',
                  borderBottom: '1px solid #e2e8f0',
                  backgroundColor: !isFilled && rollsLeft < 3 ? '#fef3c7' : 'transparent',
                  cursor: !isFilled && rollsLeft < 3 ? 'pointer' : 'default'
                }}
              >
                <span>{cat.name}</span>
                <span style={{ fontWeight: 700, textAlign: 'center' }}>{isFilled ? playerScores[cat.id] : (rollsLeft < 3 ? preview : '-')}</span>
                <span style={{ textAlign: 'center', color: '#64748b' }}>{botScores[cat.id] !== undefined ? botScores[cat.id] : '-'}</span>
              </div>
            );
          })}
        </div>

        <div style={{ border: '1px solid #cbd5e1', borderRadius: '6px', overflow: 'hidden' }}>
          {LOWER_CATEGORIES.map(cat => {
            const isFilled = playerScores[cat.id] !== undefined;
            const preview = calculateScore(cat.id, dice);
            return (
              <div
                key={cat.id}
                onClick={() => chooseCategory(cat.id)}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 45px 45px',
                  padding: '5px 8px',
                  borderBottom: '1px solid #e2e8f0',
                  backgroundColor: !isFilled && rollsLeft < 3 ? '#fef3c7' : 'transparent',
                  cursor: !isFilled && rollsLeft < 3 ? 'pointer' : 'default'
                }}
              >
                <span>{cat.name}</span>
                <span style={{ fontWeight: 700, textAlign: 'center' }}>{isFilled ? playerScores[cat.id] : (rollsLeft < 3 ? preview : '-')}</span>
                <span style={{ textAlign: 'center', color: '#64748b' }}>{botScores[cat.id] !== undefined ? botScores[cat.id] : '-'}</span>
              </div>
            );
          })}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 45px 45px', padding: '6px 8px', backgroundColor: '#0f172a', color: '#f59e0b', fontWeight: 800 }}>
            <span>GESAMT</span>
            <span style={{ textAlign: 'center' }}>{pTotals.total}</span>
            <span style={{ textAlign: 'center' }}>{bTotals.total}</span>
          </div>
        </div>
      </div>

      {/* Teller & Würfel */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: '18px', marginBottom: '8px' }}>🎲 KNIFFEL MIT MATHE-PFLICHT</div>
          <div style={{ backgroundColor: 'rgba(0,0,0,0.5)', padding: '8px 12px', borderRadius: '6px', marginBottom: '14px', fontSize: '12px' }}>
            {message}
          </div>

          <div style={{
            width: '240px',
            height: '240px',
            backgroundColor: '#15803d',
            borderRadius: '50%',
            border: '8px solid #1c1917',
            margin: '0 auto',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '10px',
            padding: '16px'
          }}>
            {dice.map((val, idx) => (
              <div
                key={idx}
                onClick={() => toggleKeep(idx)}
                style={{
                  width: '46px',
                  height: '46px',
                  backgroundColor: '#ffffff',
                  color: '#0f172a',
                  borderRadius: '8px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontSize: '34px',
                  cursor: 'pointer',
                  border: kept[idx] ? '3px solid #f59e0b' : '1px solid #cbd5e1',
                  transform: kept[idx] ? 'scale(1.1)' : 'none'
                }}
              >
                {DICE_CHARS[val - 1]}
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={rollDice}
          disabled={rollsLeft <= 0 || currentTurn !== 'player'}
          style={{
            backgroundColor: rollsLeft > 0 ? '#f59e0b' : '#64748b',
            color: '#000000',
            border: 'none',
            padding: '12px',
            borderRadius: '24px',
            fontSize: '16px',
            fontWeight: 800,
            cursor: rollsLeft > 0 ? 'pointer' : 'default',
            marginTop: '16px'
          }}
        >
          🎲 {rollsLeft === 3 ? 'WÜRFELN!' : `NOCHMAL (${rollsLeft})`}
        </button>
      </div>

      {/* Pflicht-Matheaufgabe */}
      {mathModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 999 }}>
          <div style={{ backgroundColor: '#ffffff', color: '#0f172a', padding: '20px', borderRadius: '12px', maxWidth: '420px', width: '90%' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '6px', color: '#2563eb' }}>
              🧠 Mathe-Pflichtaufgabe vor Eintrag!
            </h3>
            <p style={{ fontSize: '14px', marginBottom: '14px' }}>{mathModal.question}</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {mathModal.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleMathAnswer(opt)}
                  style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#f1f5f9', fontWeight: 700 }}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
