import React, { useState } from 'react';
import confetti from 'canvas-confetti';

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
  // Spieler: Du ('player') und Computergegner ('bot')
  const [dice, setDice] = useState([1, 1, 1, 1, 1]);
  const [kept, setKept] = useState([false, false, false, false, false]);
  const [rollsLeft, setRollsLeft] = useState(3);
  const [round, setRound] = useState(1);
  const [currentTurn, setCurrentTurn] = useState('player'); // 'player' | 'bot'

  // Punktekarten
  const [playerScores, setPlayerScores] = useState({});
  const [botScores, setBotScores] = useState({});

  const [message, setMessage] = useState('Würfle und wähle die besten Würfel zum Behalten!');
  const [mathBonusModal, setMathBonusModal] = useState(null); // Mathe-Aufgabe für Extra-Punkte!

  const rollDice = () => {
    if (rollsLeft <= 0 || currentTurn !== 'player') return;

    const newDice = dice.map((d, idx) => {
      return kept[idx] ? d : Math.floor(Math.random() * 6) + 1;
    });

    setDice(newDice);
    setRollsLeft(prev => prev - 1);
    setMessage(`Verbleibende Würfe: ${rollsLeft - 1}. Klicke auf Würfel, um sie zu behalten.`);
  };

  const toggleKeep = (index) => {
    if (rollsLeft === 3 || currentTurn !== 'player') return;
    setKept(prev => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  // Punkteberechnung
  const calculateScore = (catId, currentDice) => {
    const counts = {};
    let sum = 0;
    currentDice.forEach(d => {
      counts[d] = (counts[d] || 0) + 1;
      sum += d;
    });

    // Oben
    const upper = UPPER_CATEGORIES.find(u => u.id === catId);
    if (upper) {
      return (counts[upper.num] || 0) * upper.num;
    }

    // Unten
    if (catId === 'threeOfAKind') {
      const hasThree = Object.values(counts).some(c => c >= 3);
      return hasThree ? sum : 0;
    }
    if (catId === 'fourOfAKind') {
      const hasFour = Object.values(counts).some(c => c >= 4);
      return hasFour ? sum : 0;
    }
    if (catId === 'fullHouse') {
      const vals = Object.values(counts);
      const isFH = (vals.includes(3) && vals.includes(2)) || vals.includes(5);
      return isFH ? 25 : 0;
    }
    if (catId === 'smallStraight') {
      const unique = [...new Set(currentDice)].sort().join('');
      const isSS = unique.includes('1234') || unique.includes('2345') || unique.includes('3456');
      return isSS ? 30 : 0;
    }
    if (catId === 'largeStraight') {
      const unique = [...new Set(currentDice)].sort().join('');
      const isLS = unique === '12345' || unique === '23456';
      return isLS ? 40 : 0;
    }
    if (catId === 'yahtzee') {
      const isY = Object.values(counts).some(c => c === 5);
      return isY ? 50 : 0;
    }
    if (catId === 'chance') {
      return sum;
    }
    return 0;
  };

  // Spieler trägt Feld ein
  const chooseCategory = (catId) => {
    if (rollsLeft === 3 || currentTurn !== 'player' || playerScores[catId] !== undefined) return;

    const baseScore = calculateScore(catId, dice);

    // Mathe-Bonus-Herausforderung!
    const a = Math.floor(Math.random() * 4) + 3;
    const b = Math.floor(Math.random() * 4) + 3;
    const hyp = Math.sqrt(a * a + b * b).toFixed(1);

    setMathBonusModal({
      catId,
      baseScore,
      question: `Mathe-Bonus: Ein rechtwinkliges Dreieck hat Katheten ${a} und ${b}. Wie lang ist die Hypotenuse c?`,
      options: [
        `${hyp}`,
        `${(parseFloat(hyp) + 1.2).toFixed(1)}`,
        `${a + b}`,
        `${(parseFloat(hyp) - 1.0).toFixed(1)}`
      ].sort(() => Math.random() - 0.5),
      correct: `${hyp}`
    });
  };

  const finishTurnWithBonus = (selectedAnswer) => {
    const { catId, baseScore, correct } = mathBonusModal;
    let finalScore = baseScore;
    if (selectedAnswer === correct) {
      finalScore += 5; // +5 Bonus-Punkte für richtige Rechnung!
      onGainXp(20);
      setMessage(`✓ Mathe-Bonus gelöst! +5 Extra-Punkte erhalten!`);
    } else {
      setMessage(`Falsche Rechnung! Basis-Punkte eingetragen.`);
    }

    setPlayerScores(prev => ({ ...prev, [catId]: finalScore }));
    setMathBonusModal(null);

    // Jetzt Bot-Zug vorbereiten
    setCurrentTurn('bot');
    setTimeout(() => runBotTurn(), 1000);
  };

  // Computer-Gegner zieht
  const runBotTurn = () => {
    // Bot würfelt 3 mal
    const botDice = [
      Math.floor(Math.random() * 6) + 1,
      Math.floor(Math.random() * 6) + 1,
      Math.floor(Math.random() * 6) + 1,
      Math.floor(Math.random() * 6) + 1,
      Math.floor(Math.random() * 6) + 1
    ];

    // Freie Kategorie suchen
    const allCats = [...UPPER_CATEGORIES.map(u => u.id), ...LOWER_CATEGORIES.map(l => l.id)];
    const openCats = allCats.filter(c => botScores[c] === undefined);

    if (openCats.length > 0) {
      // Besten Score suchen
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
      setMessage(`Computerspieler 1 hat ${maxScore} Punkte in ${bestCat} eingetragen!`);
    }

    // Nächste Runde für Spieler
    setRound(r => r + 1);
    setRollsLeft(3);
    setKept([false, false, false, false, false]);
    setDice([1, 1, 1, 1, 1]);
    setCurrentTurn('player');
  };

  // Summen berechnen
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
      backgroundColor: '#3b2514', // Authentischer Holztisch wie im Steam-Spiel
      borderRadius: '12px',
      padding: '24px',
      color: '#ffffff',
      display: 'grid',
      gridTemplateColumns: 'minmax(320px, 380px) 1fr',
      gap: '24px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
      minHeight: '620px'
    }}>
      {/* Linke Spalte: Authentische Kniffel-Scorecard (wie auf deinem Screenshot!) */}
      <div style={{
        backgroundColor: '#f8fafc',
        color: '#0f172a',
        borderRadius: '16px',
        padding: '16px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
        fontSize: '13px',
        fontFamily: 'sans-serif'
      }}>
        {/* Header der Karte */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '2px solid #cbd5e1', paddingBottom: '8px' }}>
          <div style={{ fontWeight: 800, fontSize: '15px' }}>Runde {round} / 13</div>
          <div style={{ display: 'flex', gap: '16px', fontWeight: 700 }}>
            <span style={{ color: '#2563eb' }}>👶 Du ({pTotals.total})</span>
            <span style={{ color: '#ea580c' }}>🤖 Bot ({bTotals.total})</span>
          </div>
        </div>

        {/* Oberer Teil */}
        <div style={{ border: '1px solid #cbd5e1', borderRadius: '8px', overflow: 'hidden', marginBottom: '12px' }}>
          {UPPER_CATEGORIES.map(cat => {
            const isFilled = playerScores[cat.id] !== undefined;
            const preview = calculateScore(cat.id, dice);
            return (
              <div
                key={cat.id}
                onClick={() => chooseCategory(cat.id)}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 50px 50px',
                  padding: '6px 10px',
                  borderBottom: '1px solid #e2e8f0',
                  backgroundColor: !isFilled && rollsLeft < 3 ? '#fef3c7' : 'transparent',
                  cursor: !isFilled && rollsLeft < 3 ? 'pointer' : 'default',
                  alignItems: 'center'
                }}
              >
                <span>{cat.name}</span>
                <span style={{ fontWeight: 700, textAlign: 'center', backgroundColor: isFilled ? '#fed7aa' : 'transparent', borderRadius: '4px' }}>
                  {isFilled ? playerScores[cat.id] : (rollsLeft < 3 ? preview : '-')}
                </span>
                <span style={{ textAlign: 'center', color: '#64748b' }}>
                  {botScores[cat.id] !== undefined ? botScores[cat.id] : '-'}
                </span>
              </div>
            );
          })}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 50px 50px', padding: '6px 10px', backgroundColor: '#334155', color: '#ffffff', fontWeight: 700 }}>
            <span>Zwischensumme</span>
            <span style={{ textAlign: 'center' }}>{pTotals.upperSum}</span>
            <span style={{ textAlign: 'center' }}>{bTotals.upperSum}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 50px 50px', padding: '6px 10px', backgroundColor: '#475569', color: '#ffffff', fontWeight: 700 }}>
            <span>Bonus (ab 63: +35)</span>
            <span style={{ textAlign: 'center' }}>{pTotals.bonus}</span>
            <span style={{ textAlign: 'center' }}>{bTotals.bonus}</span>
          </div>
        </div>

        {/* Unterer Teil */}
        <div style={{ border: '1px solid #cbd5e1', borderRadius: '8px', overflow: 'hidden' }}>
          {LOWER_CATEGORIES.map(cat => {
            const isFilled = playerScores[cat.id] !== undefined;
            const preview = calculateScore(cat.id, dice);
            return (
              <div
                key={cat.id}
                onClick={() => chooseCategory(cat.id)}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 50px 50px',
                  padding: '6px 10px',
                  borderBottom: '1px solid #e2e8f0',
                  backgroundColor: !isFilled && rollsLeft < 3 ? '#fef3c7' : 'transparent',
                  cursor: !isFilled && rollsLeft < 3 ? 'pointer' : 'default',
                  alignItems: 'center'
                }}
              >
                <span>{cat.name}</span>
                <span style={{ fontWeight: 700, textAlign: 'center', backgroundColor: isFilled ? '#fed7aa' : 'transparent', borderRadius: '4px' }}>
                  {isFilled ? playerScores[cat.id] : (rollsLeft < 3 ? preview : '-')}
                </span>
                <span style={{ textAlign: 'center', color: '#64748b' }}>
                  {botScores[cat.id] !== undefined ? botScores[cat.id] : '-'}
                </span>
              </div>
            );
          })}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 50px 50px', padding: '8px 10px', backgroundColor: '#0f172a', color: '#f59e0b', fontWeight: 900, fontSize: '14px' }}>
            <span>ENDSUMME</span>
            <span style={{ textAlign: 'center' }}>{pTotals.total}</span>
            <span style={{ textAlign: 'center' }}>{bTotals.total}</span>
          </div>
        </div>
      </div>

      {/* Rechte Spalte: Würfelteller & Würfelbecher (Grüner Samt-Teller wie im Screenshot!) */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ fontWeight: 800, fontSize: '22px' }}>🎲 KNIFFEL (STEAM-LOOK)</div>
            <div style={{ backgroundColor: 'rgba(0,0,0,0.6)', padding: '6px 14px', borderRadius: '20px', fontWeight: 700 }}>
              Verbleibende Würfe: {rollsLeft}
            </div>
          </div>

          <div style={{ backgroundColor: 'rgba(0,0,0,0.5)', padding: '10px 14px', borderRadius: '8px', marginBottom: '20px' }}>
            {message}
          </div>

          {/* Der grüne Filz-Würfelteller */}
          <div style={{
            width: '280px',
            height: '280px',
            backgroundColor: '#15803d',
            borderRadius: '50%',
            border: '12px solid #1c1917',
            margin: '0 auto',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '14px',
            padding: '24px',
            boxShadow: 'inset 0 0 20px rgba(0,0,0,0.6), 0 8px 16px rgba(0,0,0,0.4)'
          }}>
            {dice.map((val, idx) => (
              <div
                key={idx}
                onClick={() => toggleKeep(idx)}
                style={{
                  width: '54px',
                  height: '54px',
                  backgroundColor: '#ffffff',
                  color: '#0f172a',
                  borderRadius: '10px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontSize: '42px',
                  cursor: 'pointer',
                  border: kept[idx] ? '4px solid #f59e0b' : '2px solid #cbd5e1',
                  transform: kept[idx] ? 'scale(1.12)' : 'none',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                  transition: 'all 0.15s ease'
                }}
              >
                {DICE_CHARS[val - 1]}
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '13px', color: '#cbd5e1' }}>
            Tipp: Klicke auf Würfel, um sie zu <strong>sperren</strong> (gelber Rand).
          </div>
        </div>

        {/* Würfel-Button */}
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <button
            onClick={rollDice}
            disabled={rollsLeft <= 0 || currentTurn !== 'player'}
            style={{
              backgroundColor: rollsLeft > 0 && currentTurn === 'player' ? '#f59e0b' : '#64748b',
              color: '#000000',
              border: 'none',
              padding: '14px 40px',
              borderRadius: '30px',
              fontSize: '18px',
              fontWeight: 800,
              cursor: rollsLeft > 0 && currentTurn === 'player' ? 'pointer' : 'not-allowed',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
            }}
          >
            🎲 {rollsLeft === 3 ? 'WÜRFELN!' : `NOCHMAL WÜRFELN (${rollsLeft})`}
          </button>
        </div>
      </div>

      {/* Mathe-Bonus-Modal */}
      {mathBonusModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 999
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            color: '#0f172a',
            padding: '24px',
            borderRadius: '12px',
            maxWidth: '460px',
            width: '90%'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '8px', color: '#2563eb' }}>
              🎯 Mathe-Bonus-Runde! (+5 Extra-Punkte)
            </h3>
            <p style={{ fontSize: '14px', marginBottom: '16px' }}>{mathBonusModal.question}</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {mathBonusModal.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => finishTurnWithBonus(opt)}
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#f1f5f9',
                    fontSize: '15px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
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
