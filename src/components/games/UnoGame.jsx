import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

const BOT_NAMES = ['Vex 👩', 'Peril 👦', 'Angst 👨‍💼'];
const COLORS = ['red', 'blue', 'green', 'yellow'];

function getRandomMathCard(color) {
  // Dynamische Mathe-Generierung für JEDE Karte!
  const types = ['hyp', 'kathete', 'root', 'square'];
  const t = types[Math.floor(Math.random() * types.length)];

  if (t === 'hyp') {
    const trips = [[3, 4, 5], [6, 8, 10]];
    const [a, b, c] = trips[Math.floor(Math.random() * trips.length)];
    return {
      id: `${color}-${Math.random()}`,
      color,
      val: c,
      label: `${c}`,
      math: `√(${a}²+${b}²)`,
      hint: `Ergibt ${c}, weil √(${a*a}+${b*b}) = √${c*c} = ${c}`,
      type: 'number'
    };
  }
  if (t === 'kathete') {
    const trips = [[3, 4, 5], [6, 8, 10]];
    const [a, b, c] = trips[Math.floor(Math.random() * trips.length)];
    return {
      id: `${color}-${Math.random()}`,
      color,
      val: a,
      label: `${a}`,
      math: `√(${c}²-${b}²)`,
      hint: `Ergibt ${a}, weil √(${c*c}-${b*b}) = √${a*a} = ${a}`,
      type: 'number'
    };
  }
  if (t === 'root') {
    const perfects = [1, 4, 9, 16, 25, 36, 49, 64, 81];
    const idx = Math.floor(Math.random() * perfects.length);
    const sq = perfects[idx];
    const root = Math.sqrt(sq);
    return {
      id: `${color}-${Math.random()}`,
      color,
      val: root,
      label: `${root}`,
      math: `√${sq}`,
      hint: `Ergibt ${root}, weil ${root}² = ${sq}`,
      type: 'number'
    };
  }
  // Einfache Zahl
  const n = Math.floor(Math.random() * 9) + 1;
  return {
    id: `${color}-${Math.random()}`,
    color,
    val: n,
    label: `${n}`,
    math: `${n}`,
    hint: `Zahlenwert: ${n}`,
    type: 'number'
  };
}

function createDeck() {
  const deck = [];
  COLORS.forEach(color => {
    for (let i = 0; i < 7; i++) {
      deck.push(getRandomMathCard(color));
    }
    deck.push({ id: `${color}-plus2-${Math.random()}`, color, val: 20, label: '+2', math: '+2', type: 'draw2', hint: '+2 Karten' });
    deck.push({ id: `${color}-skip-${Math.random()}`, color, val: 21, label: '⊘', math: 'Aussetzen', type: 'skip', hint: 'Gegner setzt aus' });
  });
  for (let i = 0; i < 4; i++) {
    deck.push({ id: `wild-${i}-${Math.random()}`, color: 'wild', val: 50, label: '🌈', math: 'Farbwahl', type: 'wild', hint: 'Wählt neue Farbe' });
  }
  return deck.sort(() => Math.random() - 0.5);
}

export default function UnoGame({ onGainXp }) {
  const [deck, setDeck] = useState(() => createDeck());
  const [playerHand, setPlayerHand] = useState([]);
  const [botHands, setBotHands] = useState({ 0: [], 1: [], 2: [] });
  const [discardPile, setDiscardPile] = useState([]);
  const [currentTurn, setCurrentTurn] = useState(0);
  const [currentColor, setCurrentColor] = useState('red');
  const [gameStatus, setGameStatus] = useState('playing');
  const [message, setMessage] = useState('Mathe-UNO: Lege Farbe auf Farbe oder gleichen Rechenwert (z.B. √25 auf 5)!');
  const [lastMathExplanation, setLastMathExplanation] = useState(null);

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    const full = createDeck();
    const pHand = full.splice(0, 7);
    const b0 = full.splice(0, 7);
    const b1 = full.splice(0, 7);
    const b2 = full.splice(0, 7);
    let startCard = full.pop();
    while (startCard.color === 'wild') {
      full.unshift(startCard);
      startCard = full.pop();
    }
    setDeck(full);
    setPlayerHand(pHand);
    setBotHands({ 0: b0, 1: b1, 2: b2 });
    setDiscardPile([startCard]);
    setCurrentColor(startCard.color);
    setCurrentTurn(0);
    setGameStatus('playing');
    setLastMathExplanation(`Startkarte: ${startCard.math} = Wert ${startCard.val}`);
    setMessage('Du bist am Zug!');
  };

  const topCard = discardPile[discardPile.length - 1];

  const canPlay = (card) => {
    if (!topCard) return false;
    if (card.color === 'wild') return true;
    if (card.color === currentColor) return true;
    if (card.val === topCard.val) return true;
    return false;
  };

  const playPlayerCard = (card) => {
    if (currentTurn !== 0 || gameStatus !== 'playing') return;
    if (!canPlay(card)) {
      setMessage(`❌ Passt nicht! Gesucht: Farbe ${currentColor.toUpperCase()} oder Wert ${topCard.val}!`);
      return;
    }

    const newHand = playerHand.filter(c => c.id !== card.id);
    setPlayerHand(newHand);
    setDiscardPile(prev => [...prev, card]);

    // Lerneffekt: Zeige dem Spieler genau die Rechnung an!
    setLastMathExplanation(`💡 Rechen-Erklärung: ${card.math} hat den Wert ${card.val}. Passt auf ${topCard.math} (Wert ${topCard.val})!`);

    if (card.color !== 'wild') {
      setCurrentColor(card.color);
    } else {
      const colorCounts = { red: 0, blue: 0, green: 0, yellow: 0 };
      newHand.forEach(c => { if (c.color !== 'wild') colorCounts[c.color]++; });
      const best = Object.keys(colorCounts).reduce((a, b) => colorCounts[a] > colorCounts[b] ? a : b);
      setCurrentColor(best);
    }

    onGainXp(15);

    if (newHand.length === 0) {
      setGameStatus('won');
      onGainXp(100);
      confetti({ particleCount: 150 });
      setMessage('🎉 UNO! Du hast gewonnen! (+100 XP)');
      return;
    }

    let nextTurn = 1;
    if (card.type === 'skip') {
      nextTurn = 2;
    } else if (card.type === 'draw2') {
      drawCardsForBot(0, 2);
      nextTurn = 2;
    }
    setCurrentTurn(nextTurn);
  };

  const drawCardsForBot = (botIdx, count) => {
    setBotHands(prev => {
      const bHand = [...prev[botIdx]];
      for (let i = 0; i < count; i++) {
        if (deck.length > 0) bHand.push(deck.pop());
      }
      return { ...prev, [botIdx]: bHand };
    });
  };

  const playerDraw = () => {
    if (currentTurn !== 0 || gameStatus !== 'playing') return;
    if (deck.length === 0) return;
    const newDeck = [...deck];
    const drawn = newDeck.pop();
    setDeck(newDeck);
    setPlayerHand(prev => [...prev, drawn]);
    setMessage(`Du ziehst: ${drawn.math} (${drawn.hint}). Vex ist am Zug.`);
    setCurrentTurn(1);
  };

  // Bot-Logik
  useEffect(() => {
    if (currentTurn === 0 || gameStatus !== 'playing') return;

    const botIndex = currentTurn - 1;
    const botName = BOT_NAMES[botIndex];

    const timer = setTimeout(() => {
      const bHand = [...botHands[botIndex]];
      const playable = bHand.find(c => canPlay(c));

      if (playable) {
        const newBHand = bHand.filter(c => c.id !== playable.id);
        setBotHands(prev => ({ ...prev, [botIndex]: newBHand }));
        setDiscardPile(prev => [...prev, playable]);

        setLastMathExplanation(`🤖 ${botName} legt ${playable.math} (= ${playable.val})!`);

        if (playable.color !== 'wild') {
          setCurrentColor(playable.color);
        } else {
          setCurrentColor(COLORS[Math.floor(Math.random() * 4)]);
        }

        if (newBHand.length === 0) {
          setGameStatus('lost');
          setMessage(`💀 ${botName} hat gewonnen!`);
          return;
        }

        let nextPlayer = (currentTurn + 1) % 4;
        if (playable.type === 'skip') nextPlayer = (nextPlayer + 1) % 4;
        else if (playable.type === 'draw2') {
          if (nextPlayer === 0) {
            const d = [...deck];
            setPlayerHand(p => [...p, d.pop(), d.pop()].filter(Boolean));
            setDeck(d);
            nextPlayer = 1;
          } else {
            drawCardsForBot(nextPlayer - 1, 2);
            nextPlayer = (nextPlayer + 1) % 4;
          }
        }
        setCurrentTurn(nextPlayer);
      } else {
        if (deck.length > 0) {
          const d = [...deck];
          const dr = d.pop();
          setDeck(d);
          setBotHands(prev => ({ ...prev, [botIndex]: [...prev[botIndex], dr] }));
        }
        setCurrentTurn((currentTurn + 1) % 4);
      }
    }, 1100);

    return () => clearTimeout(timer);
  }, [currentTurn, gameStatus]);

  const getColorHex = (c) => {
    switch (c) {
      case 'red': return '#dc2626';
      case 'blue': return '#2563eb';
      case 'green': return '#16a34a';
      case 'yellow': return '#ca8a04';
      default: return '#1e293b';
    }
  };

  return (
    <div style={{
      backgroundColor: '#7f1d1d',
      borderRadius: '12px',
      padding: '16px',
      color: '#ffffff',
      minHeight: '600px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontWeight: 800, fontSize: '18px' }}>🎴 MATHE-UNO NO MERCY</div>
        <button
          onClick={startNewGame}
          style={{ backgroundColor: '#ffffff', color: '#7f1d1d', border: 'none', padding: '6px 14px', borderRadius: '16px', fontWeight: 700, fontSize: '12px' }}
        >
          🔄 Neu
        </button>
      </div>

      {/* Bots */}
      <div style={{ display: 'flex', justifyContent: 'space-around', margin: '8px 0' }}>
        <div style={{ padding: '6px 10px', borderRadius: '6px', backgroundColor: currentTurn === 1 ? '#ef4444' : 'rgba(0,0,0,0.4)', textAlign: 'center', fontSize: '12px' }}>
          <div>Vex 👩</div>
          <div>{botHands[0]?.length || 0} Karten</div>
        </div>
        <div style={{ padding: '6px 10px', borderRadius: '6px', backgroundColor: currentTurn === 2 ? '#ef4444' : 'rgba(0,0,0,0.4)', textAlign: 'center', fontSize: '12px' }}>
          <div>Peril 👦</div>
          <div>{botHands[1]?.length || 0} Karten</div>
        </div>
        <div style={{ padding: '6px 10px', borderRadius: '6px', backgroundColor: currentTurn === 3 ? '#ef4444' : 'rgba(0,0,0,0.4)', textAlign: 'center', fontSize: '12px' }}>
          <div>Angst 👨‍💼</div>
          <div>{botHands[2]?.length || 0} Karten</div>
        </div>
      </div>

      {/* Lerneffekt: Rechen-Erklärung */}
      {lastMathExplanation && (
        <div style={{ backgroundColor: 'rgba(0,0,0,0.6)', padding: '8px 12px', borderRadius: '6px', textAlign: 'center', fontSize: '13px', color: '#fde047', fontWeight: 600 }}>
          {lastMathExplanation}
        </div>
      )}

      {/* Tischmitte */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '24px', margin: '14px 0' }}>
        <div
          onClick={playerDraw}
          style={{
            width: '80px',
            height: '115px',
            backgroundColor: '#0f172a',
            border: '2px solid #ffffff',
            borderRadius: '8px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: currentTurn === 0 ? 'pointer' : 'default'
          }}
        >
          <div style={{ fontWeight: 900, color: '#ef4444', fontSize: '16px' }}>UNO</div>
          <div style={{ fontSize: '10px' }}>Ziehen ({deck.length})</div>
        </div>

        {topCard && (
          <div style={{
            width: '90px',
            height: '125px',
            backgroundColor: getColorHex(currentColor),
            border: '3px solid #ffffff',
            borderRadius: '10px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '6px'
          }}>
            <div style={{ fontWeight: 800, fontSize: '13px' }}>{topCard.val}</div>
            <div style={{ textAlign: 'center', fontWeight: 800, fontSize: '16px' }}>{topCard.math}</div>
            <div style={{ textAlign: 'right', fontWeight: 800, fontSize: '13px' }}>{topCard.val}</div>
          </div>
        )}
      </div>

      {/* Status */}
      <div style={{ textAlign: 'center', fontSize: '13px', fontWeight: 600 }}>
        {message}
      </div>

      {/* Handkarten */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '12px' }}>
          <div>Deine Karten ({playerHand.length}) {currentTurn === 0 && <span style={{ color: '#fde047' }}>◀ DRAN!</span>}</div>
          <div>Farbe: <strong style={{ color: getColorHex(currentColor), backgroundColor: '#ffffff', padding: '1px 6px', borderRadius: '4px' }}>{currentColor.toUpperCase()}</strong></div>
        </div>

        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '8px' }}>
          {playerHand.map((card) => {
            const playable = canPlay(card);
            return (
              <div
                key={card.id}
                onClick={() => playPlayerCard(card)}
                style={{
                  minWidth: '70px',
                  height: '105px',
                  backgroundColor: getColorHex(card.color),
                  border: playable && currentTurn === 0 ? '2px solid #fde047' : '1px solid #ffffff',
                  borderRadius: '6px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '5px',
                  cursor: playable && currentTurn === 0 ? 'pointer' : 'default',
                  opacity: playable && currentTurn === 0 ? 1 : 0.6,
                  transform: playable && currentTurn === 0 ? 'translateY(-4px)' : 'none',
                  flexShrink: 0
                }}
              >
                <div style={{ fontWeight: 800, fontSize: '12px' }}>{card.val}</div>
                <div style={{ textAlign: 'center', fontWeight: 700, fontSize: '13px' }}>{card.math}</div>
                <div style={{ textAlign: 'right', fontWeight: 800, fontSize: '12px' }}>{card.val}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
