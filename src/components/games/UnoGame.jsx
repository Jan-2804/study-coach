import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

// 4 Spieler wie in UNO Show 'Em No Mercy: Du (unten), Vex (links), Peril (oben), Angst (rechts)
const BOT_NAMES = ['Vex 👩', 'Peril 👦', 'Angst 👨‍💼'];
const COLORS = ['red', 'blue', 'green', 'yellow'];

// Mathe-Karten: Werte sind mathematische Terme und Zahlen (1 bis 9)
const CARD_VALUES = [
  { val: 1, label: '1', math: '√1' },
  { val: 2, label: '2', math: '√4' },
  { val: 3, label: '3', math: '√9' },
  { val: 4, label: '4', math: '√16' },
  { val: 5, label: '5', math: '√(3²+4²)' },
  { val: 6, label: '6', math: '√36' },
  { val: 7, label: '7', math: '√49' },
  { val: 8, label: '8', math: '2√16' },
  { val: 9, label: '9', math: '√81' }
];

function createDeck() {
  const deck = [];
  COLORS.forEach(color => {
    CARD_VALUES.forEach(cv => {
      deck.push({ id: `${color}-${cv.val}-${Math.random()}`, color, val: cv.val, label: cv.label, math: cv.math, type: 'number' });
    });
    // Aktionskarten
    deck.push({ id: `${color}-plus2-${Math.random()}`, color, val: 20, label: '+2', math: '+2', type: 'draw2' });
    deck.push({ id: `${color}-skip-${Math.random()}`, color, val: 21, label: '⊘', math: 'Aussetzen', type: 'skip' });
  });
  // Farbwahl / +4 Karten (Wild)
  for (let i = 0; i < 4; i++) {
    deck.push({ id: `wild-${i}-${Math.random()}`, color: 'wild', val: 50, label: '🌈', math: 'Farbwahl', type: 'wild' });
    deck.push({ id: `wild4-${i}-${Math.random()}`, color: 'wild', val: 50, label: '+4', math: '+4 Wild', type: 'draw4' });
  }
  return deck.sort(() => Math.random() - 0.5);
}

export default function UnoGame({ onGainXp }) {
  const [deck, setDeck] = useState(() => createDeck());
  const [playerHand, setPlayerHand] = useState([]);
  const [botHands, setBotHands] = useState({ 0: [], 1: [], 2: [] }); // 3 Bots
  const [discardPile, setDiscardPile] = useState([]);
  const [currentTurn, setCurrentTurn] = useState(0); // 0: Player, 1: Vex, 2: Peril, 3: Angst
  const [currentColor, setCurrentColor] = useState('red');
  const [gameStatus, setGameStatus] = useState('playing'); // 'playing' | 'won' | 'lost'
  const [message, setMessage] = useState('Willkommen bei Mathe-UNO! Lege Farbe auf Farbe oder gleichen Mathe-Wert!');

  // Spiel initialisieren
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
    setMessage('Du bist am Zug! Wähle eine passende Karte oder ziehe vom Stapel.');
  };

  const topCard = discardPile[discardPile.length - 1];

  const canPlay = (card) => {
    if (!topCard) return false;
    if (card.color === 'wild') return true;
    if (card.color === currentColor) return true;
    if (card.val === topCard.val) return true;
    return false;
  };

  // Spieler spielt Karte
  const playPlayerCard = (card) => {
    if (currentTurn !== 0 || gameStatus !== 'playing') return;
    if (!canPlay(card)) {
      setMessage(`❌ Diese Karte passt nicht! Passe auf Farbe (${currentColor.toUpperCase()}) oder Mathe-Wert (${topCard.val}) auf!`);
      return;
    }

    const newHand = playerHand.filter(c => c.id !== card.id);
    setPlayerHand(newHand);
    setDiscardPile(prev => [...prev, card]);

    if (card.color !== 'wild') {
      setCurrentColor(card.color);
    } else {
      // automatische beste Farbe für Spieler wählen
      const colorCounts = { red: 0, blue: 0, green: 0, yellow: 0 };
      newHand.forEach(c => { if (c.color !== 'wild') colorCounts[c.color]++; });
      const best = Object.keys(colorCounts).reduce((a, b) => colorCounts[a] > colorCounts[b] ? a : b);
      setCurrentColor(best);
    }

    onGainXp(10);

    if (newHand.length === 0) {
      setGameStatus('won');
      onGainXp(100);
      confetti({ particleCount: 150, spread: 80 });
      setMessage('🎉 UNO! Du hast die Runde gegen alle 3 Bots gewonnen! (+100 XP)');
      return;
    }

    // Aktionskarten-Effekte
    let nextTurn = 1;
    if (card.type === 'skip') {
      nextTurn = 2; // Überspringe Vex
      setMessage(`🚫 Du hast Vex übersprungen! Peril ist dran.`);
    } else if (card.type === 'draw2') {
      drawCardsForBot(0, 2);
      nextTurn = 2;
      setMessage(`💥 +2 für Vex! Peril ist am Zug.`);
    } else if (card.type === 'draw4') {
      drawCardsForBot(0, 4);
      nextTurn = 2;
      setMessage(`💣 +4 für Vex! Peril ist am Zug.`);
    } else {
      setMessage(`Du hast ${card.label} (${card.math}) gespielt! Vex ist am Zug.`);
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

  // Spieler zieht vom Stapel
  const playerDraw = () => {
    if (currentTurn !== 0 || gameStatus !== 'playing') return;
    if (deck.length === 0) return;
    const newDeck = [...deck];
    const drawn = newDeck.pop();
    setDeck(newDeck);
    setPlayerHand(prev => [...prev, drawn]);
    setMessage(`Du hast eine Karte gezogen: ${drawn.label} (${drawn.math}). Vex ist dran.`);
    setCurrentTurn(1);
  };

  // KI Züge automatisch abarbeiten
  useEffect(() => {
    if (currentTurn === 0 || gameStatus !== 'playing') return;

    const botIndex = currentTurn - 1; // 0: Vex, 1: Peril, 2: Angst
    const botName = BOT_NAMES[botIndex];

    const timer = setTimeout(() => {
      const bHand = [...botHands[botIndex]];
      const playableCard = bHand.find(c => canPlay(c));

      if (playableCard) {
        // Karte legen
        const newBHand = bHand.filter(c => c.id !== playableCard.id);
        setBotHands(prev => ({ ...prev, [botIndex]: newBHand }));
        setDiscardPile(prev => [...prev, playableCard]);

        if (playableCard.color !== 'wild') {
          setCurrentColor(playableCard.color);
        } else {
          setCurrentColor(COLORS[Math.floor(Math.random() * 4)]);
        }

        if (newBHand.length === 0) {
          setGameStatus('lost');
          setMessage(`💀 ${botName} hat als Erster alle Karten abgelegt! Du hast verloren.`);
          return;
        }

        let nextPlayer = (currentTurn + 1) % 4;
        if (playableCard.type === 'skip') {
          nextPlayer = (nextPlayer + 1) % 4;
          setMessage(`🚫 ${botName} spielt Aussetzen!`);
        } else if (playableCard.type === 'draw2') {
          if (nextPlayer === 0) {
            // Spieler zieht 2
            const d = [...deck];
            const p = [...playerHand, d.pop(), d.pop()].filter(Boolean);
            setDeck(d);
            setPlayerHand(p);
            nextPlayer = 1;
            setMessage(`💥 ${botName} schenkt dir +2 Karten!`);
          } else {
            drawCardsForBot(nextPlayer - 1, 2);
            nextPlayer = (nextPlayer + 1) % 4;
            setMessage(`💥 ${botName} spielt +2!`);
          }
        } else {
          setMessage(`${botName} spielt ${playableCard.label} (${playableCard.math})!`);
        }

        setCurrentTurn(nextPlayer);
      } else {
        // Karte ziehen
        if (deck.length > 0) {
          const d = [...deck];
          const drawn = d.pop();
          setDeck(d);
          setBotHands(prev => ({ ...prev, [botIndex]: [...prev[botIndex], drawn] }));
          setMessage(`${botName} kann nicht legen und zieht eine Karte.`);
        }
        setCurrentTurn((currentTurn + 1) % 4);
      }
    }, 1200);

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
      backgroundColor: '#7f1d1d', // Stylischer roter Tisch wie in UNO Show 'Em No Mercy
      borderRadius: '12px',
      padding: '24px',
      color: '#ffffff',
      boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
      minHeight: '620px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      position: 'relative'
    }}>
      {/* Kopfbereich: Status & Bots */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontWeight: 800, fontSize: '22px', letterSpacing: '1px' }}>
          🎴 UNO: NO MERCY (Mathe-Edition)
        </div>
        <button
          onClick={startNewGame}
          style={{
            backgroundColor: '#ffffff',
            color: '#7f1d1d',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '20px',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          🔄 Neues Spiel
        </button>
      </div>

      {/* Die 3 Bots (Oben, Links, Rechts) */}
      <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', margin: '12px 0' }}>
        {/* Bot 0 (Vex Links) */}
        <div style={{
          backgroundColor: currentTurn === 1 ? '#ef4444' : 'rgba(0,0,0,0.5)',
          padding: '10px 16px',
          borderRadius: '8px',
          border: currentTurn === 1 ? '2px solid #ffffff' : '1px solid rgba(255,255,255,0.2)',
          textAlign: 'center'
        }}>
          <div style={{ fontWeight: 700 }}>Vex 👩 (Links)</div>
          <div style={{ fontSize: '13px', opacity: 0.9 }}>{botHands[0]?.length || 0} Karten</div>
        </div>

        {/* Bot 1 (Peril Oben) */}
        <div style={{
          backgroundColor: currentTurn === 2 ? '#ef4444' : 'rgba(0,0,0,0.5)',
          padding: '10px 16px',
          borderRadius: '8px',
          border: currentTurn === 2 ? '2px solid #ffffff' : '1px solid rgba(255,255,255,0.2)',
          textAlign: 'center'
        }}>
          <div style={{ fontWeight: 700 }}>Peril 👦 (Oben)</div>
          <div style={{ fontSize: '13px', opacity: 0.9 }}>{botHands[1]?.length || 0} Karten</div>
        </div>

        {/* Bot 2 (Angst Rechts) */}
        <div style={{
          backgroundColor: currentTurn === 3 ? '#ef4444' : 'rgba(0,0,0,0.5)',
          padding: '10px 16px',
          borderRadius: '8px',
          border: currentTurn === 3 ? '2px solid #ffffff' : '1px solid rgba(255,255,255,0.2)',
          textAlign: 'center'
        }}>
          <div style={{ fontWeight: 700 }}>Angst 👨‍💼 (Rechts)</div>
          <div style={{ fontSize: '13px', opacity: 0.9 }}>{botHands[2]?.length || 0} Karten</div>
        </div>
      </div>

      {/* Tisch-Mitte: Ablagestapel & Ziehstapel */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '32px',
        margin: '20px 0'
      }}>
        {/* Ziehstapel */}
        <div
          onClick={playerDraw}
          style={{
            width: '90px',
            height: '130px',
            backgroundColor: '#0f172a',
            border: '3px solid #ffffff',
            borderRadius: '10px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: currentTurn === 0 ? 'pointer' : 'default',
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
          }}
        >
          <div style={{ fontWeight: 900, fontSize: '20px', color: '#ef4444' }}>UNO</div>
          <div style={{ fontSize: '11px', marginTop: '4px' }}>Ziehen ({deck.length})</div>
        </div>

        {/* Ablagestapel (Top Card) */}
        {topCard && (
          <div style={{
            width: '100px',
            height: '145px',
            backgroundColor: getColorHex(currentColor),
            border: '4px solid #ffffff',
            borderRadius: '12px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '8px',
            boxShadow: '0 6px 16px rgba(0,0,0,0.6)'
          }}>
            <div style={{ fontWeight: 900, fontSize: '18px' }}>{topCard.label}</div>
            <div style={{ textAlign: 'center', fontWeight: 800, fontSize: '22px' }}>
              {topCard.math}
            </div>
            <div style={{ textAlign: 'right', fontWeight: 900, fontSize: '18px' }}>{topCard.label}</div>
          </div>
        )}
      </div>

      {/* Mitteilung / Spielzug-Hinweis */}
      <div style={{
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: '10px 16px',
        borderRadius: '8px',
        textAlign: 'center',
        fontWeight: 600,
        fontSize: '14px',
        marginBottom: '16px'
      }}>
        {message}
      </div>

      {/* Spieler Handkarten */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div style={{ fontWeight: 700, fontSize: '15px' }}>
            🧙‍♂️ Deine Karten ({playerHand.length}) {currentTurn === 0 && <span style={{ color: '#fde047' }}>◀ DU BIST DRAN!</span>}
          </div>
          <div style={{ fontSize: '13px' }}>
            Aktuelle Spielfarbe: <strong style={{ color: getColorHex(currentColor), backgroundColor: '#ffffff', padding: '2px 8px', borderRadius: '4px' }}>{currentColor.toUpperCase()}</strong>
          </div>
        </div>

        {/* Kartenfächer */}
        <div style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '12px'
        }}>
          {playerHand.map((card) => {
            const playable = canPlay(card);
            return (
              <div
                key={card.id}
                onClick={() => playPlayerCard(card)}
                style={{
                  minWidth: '78px',
                  height: '115px',
                  backgroundColor: getColorHex(card.color),
                  border: playable && currentTurn === 0 ? '3px solid #fde047' : '2px solid #ffffff',
                  borderRadius: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '6px',
                  cursor: playable && currentTurn === 0 ? 'pointer' : 'not-allowed',
                  opacity: playable && currentTurn === 0 ? 1 : 0.65,
                  transform: playable && currentTurn === 0 ? 'translateY(-6px)' : 'none',
                  transition: 'all 0.15s ease',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.4)',
                  flexShrink: 0
                }}
              >
                <div style={{ fontWeight: 800, fontSize: '14px' }}>{card.label}</div>
                <div style={{ textAlign: 'center', fontWeight: 700, fontSize: '14px' }}>
                  {card.math}
                </div>
                <div style={{ textAlign: 'right', fontWeight: 800, fontSize: '14px' }}>{card.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
