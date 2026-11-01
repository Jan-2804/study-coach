import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

const BOT_NAMES = ['Vex 👩', 'Peril 👦', 'Angst 👨‍💼'];

// Mathe-Karten-Generator (OHNE FARBEN! Es zählt nur der mathematische Wert!)
// Jede Karte ist ein Term oder eine Zahl, die man selbst im Kopf ausrechnen muss.
function generateMathCard() {
  const types = ['direct', 'root', 'pyth_c', 'pyth_a', 'sum_root'];
  const t = types[Math.floor(Math.random() * types.length)];

  // Mögliche mathematische Zielwerte (2 bis 15)
  if (t === 'pyth_c') {
    // c = √(a² + b²) -> 5, 10, 13
    const trips = [
      { a: 3, b: 4, c: 5 },
      { a: 6, b: 8, c: 10 },
      { a: 5, b: 12, c: 13 }
    ];
    const item = trips[Math.floor(Math.random() * trips.length)];
    return {
      id: Math.random().toString(),
      val: item.c,
      text: `√(${item.a}² + ${item.b}²)`,
      type: 'math',
      expl: `√(${item.a*item.a} + ${item.b*item.b}) = √${item.c*item.c} = ${item.c}`
    };
  }

  if (t === 'pyth_a') {
    // a = √(c² - b²) -> 3, 4, 6, 8, 5, 12
    const trips = [
      { c: 5, b: 4, a: 3 },
      { c: 5, b: 3, a: 4 },
      { c: 10, b: 8, a: 6 },
      { c: 10, b: 6, a: 8 },
      { c: 13, b: 12, a: 5 }
    ];
    const item = trips[Math.floor(Math.random() * trips.length)];
    return {
      id: Math.random().toString(),
      val: item.a,
      text: `√(${item.c}² - ${item.b}²)`,
      type: 'math',
      expl: `√(${item.c*item.c} - ${item.b*item.b}) = √${item.a*item.a} = ${item.a}`
    };
  }

  if (t === 'root') {
    // Glatte Wurzeln -> √4=2, √9=3, √16=4, √25=5, √36=6, √49=7, √64=8, √81=9, √100=10, √144=12
    const roots = [
      { sq: 4, r: 2 },
      { sq: 9, r: 3 },
      { sq: 16, r: 4 },
      { sq: 25, r: 5 },
      { sq: 36, r: 6 },
      { sq: 49, r: 7 },
      { sq: 64, r: 8 },
      { sq: 81, r: 9 },
      { sq: 100, r: 10 },
      { sq: 144, r: 12 }
    ];
    const item = roots[Math.floor(Math.random() * roots.length)];
    return {
      id: Math.random().toString(),
      val: item.r,
      text: `√${item.sq}`,
      type: 'math',
      expl: `√${item.sq} = ${item.r}`
    };
  }

  // Direkte Zahl (z. B. 3, 4, 5, 6, 7, 8, 10, 12)
  const nums = [2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13];
  const n = nums[Math.floor(Math.random() * nums.length)];
  return {
    id: Math.random().toString(),
    val: n,
    text: `${n}`,
    type: 'math',
    expl: `Wert ist ${n}`
  };
}

// Aktionskarten (ohne Farben)
function generateActionCard(type) {
  if (type === 'plus2') {
    return { id: Math.random().toString(), val: -2, text: '+2 KARTEN', type: 'action_plus2', expl: 'Gegner muss 2 Karten ziehen' };
  }
  if (type === 'skip') {
    return { id: Math.random().toString(), val: -1, text: '⊘ AUSSETZEN', type: 'action_skip', expl: 'Nächster Spieler setzt aus' };
  }
  return { id: Math.random().toString(), val: -99, text: '★ JOKER', type: 'action_joker', expl: 'Passt auf jede Karte!' };
}

function createDeck() {
  const d = [];
  // 35 Mathe-Karten
  for (let i = 0; i < 35; i++) {
    d.push(generateMathCard());
  }
  // 6 Aktionskarten
  for (let i = 0; i < 2; i++) {
    d.push(generateActionCard('plus2'));
    d.push(generateActionCard('skip'));
    d.push(generateActionCard('joker'));
  }
  return d.sort(() => Math.random() - 0.5);
}

export default function UnoGame({ onGainXp }) {
  const [deck, setDeck] = useState(() => createDeck());
  const [playerHand, setPlayerHand] = useState([]);
  const [botHands, setBotHands] = useState({ 0: [], 1: [], 2: [] });
  const [discardPile, setDiscardPile] = useState([]);
  const [currentTurn, setCurrentTurn] = useState(0); // 0: Spieler, 1: Vex, 2: Peril, 3: Angst
  const [gameStatus, setGameStatus] = useState('playing');
  const [feedback, setFeedback] = useState(null); // Feedback nach Zug (Erklärung)
  const [penaltyMessage, setPenaltyMessage] = useState(null);

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    const full = createDeck();
    const pHand = full.splice(0, 6);
    const b0 = full.splice(0, 6);
    const b1 = full.splice(0, 6);
    const b2 = full.splice(0, 6);

    let startCard = full.pop();
    while (startCard.val < 0) {
      full.unshift(startCard);
      startCard = full.pop();
    }

    setDeck(full);
    setPlayerHand(pHand);
    setBotHands({ 0: b0, 1: b1, 2: b2 });
    setDiscardPile([startCard]);
    setCurrentTurn(0);
    setGameStatus('playing');
    setFeedback({
      type: 'info',
      title: 'Spiel gestartet!',
      text: `Startkarte: ${startCard.text} (Rechne den Wert im Kopf aus und lege eine Karte mit dem GLEICHEN mathematischen Wert!)`
    });
    setPenaltyMessage(null);
  };

  const topCard = discardPile[discardPile.length - 1];

  // Spieler klickt auf eine Karte (KEIN Vorab-Leuchten! Spieler muss selbst rechnen!)
  const handlePlayerCardClick = (card) => {
    if (currentTurn !== 0 || gameStatus !== 'playing') return;
    setPenaltyMessage(null);

    // Joker passt immer
    if (card.type === 'action_joker') {
      executePlay(card, 0);
      return;
    }

    // Wenn oben eine Aktionskarte liegt, passt Aktionskarte oder jede Zahl
    if (topCard.val < 0) {
      executePlay(card, 0);
      return;
    }

    // Prüfung: Stimmen die mathematischen Werte überein?
    if (card.val === topCard.val) {
      // RICHTIG GERECHNET!
      onGainXp(25);
      setFeedback({
        type: 'success',
        title: '✓ Perfekt gerechnet!',
        text: `Du hast ${card.text} auf ${topCard.text} gelegt. Beide haben den exakten Wert ${card.val}!`
      });
      executePlay(card, 0);
    } else {
      // FALSCH GERECHNET! (STRAFE: 1 Strafkarte ziehen + Erklärung)
      let drawnCard = null;
      if (deck.length > 0) {
        const d = [...deck];
        drawnCard = d.pop();
        setDeck(d);
        setPlayerHand(prev => [...prev, drawnCard]);
      }

      setFeedback({
        type: 'error',
        title: '❌ Rechenfehler! (Strafkarte gezogen)',
        text: `Deine Karte "${card.text}" hat den Wert ${card.val}, aber oben liegt "${topCard.text}" mit dem Wert ${topCard.val}! Das passt nicht zusammen.`
      });
      setPenaltyMessage('Du hast dich verrechnet und musstest 1 Strafkarte ziehen!');
    }
  };

  const executePlay = (card, playerIdx) => {
    const newHand = playerHand.filter(c => c.id !== card.id);
    setPlayerHand(newHand);
    setDiscardPile(prev => [...prev, card]);

    if (newHand.length === 0) {
      setGameStatus('won');
      onGainXp(150);
      confetti({ particleCount: 150 });
      setFeedback({
        type: 'success',
        title: '🏆 SIEG!',
        text: 'Du hast als Erster alle Karten durch fehlerfreies Kopfrechnen abgelegt!'
      });
      return;
    }

    // Nächster Zug
    let next = 1;
    if (card.type === 'action_skip') {
      next = 2; // Überspringe Vex
    } else if (card.type === 'action_plus2') {
      // Vex zieht 2
      drawCardsForBot(0, 2);
      next = 2;
    }
    setCurrentTurn(next);
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

  // Spieler entscheidet sich freiwillig zum Ziehen
  const playerDrawCard = () => {
    if (currentTurn !== 0 || gameStatus !== 'playing') return;
    if (deck.length === 0) return;

    const d = [...deck];
    const drawn = d.pop();
    setDeck(d);
    setPlayerHand(prev => [...prev, drawn]);
    setFeedback({
      type: 'info',
      title: 'Karte gezogen',
      text: `Du hast gezogen: "${drawn.text}". Vex ist jetzt am Zug.`
    });
    setPenaltyMessage(null);
    setCurrentTurn(1);
  };

  // Bot-Logik
  useEffect(() => {
    if (currentTurn === 0 || gameStatus !== 'playing') return;

    const botIndex = currentTurn - 1;
    const botName = BOT_NAMES[botIndex];

    const timer = setTimeout(() => {
      const bHand = [...botHands[botIndex]];
      const playable = bHand.find(c => {
        if (c.type === 'action_joker') return true;
        if (topCard.val < 0) return true;
        return c.val === topCard.val;
      });

      if (playable) {
        const newBHand = bHand.filter(c => c.id !== playable.id);
        setBotHands(prev => ({ ...prev, [botIndex]: newBHand }));
        setDiscardPile(prev => [...prev, playable]);

        setFeedback({
          type: 'bot',
          title: `🤖 ${botName} ist am Zug`,
          text: `${botName} legt "${playable.text}" (Wert ${playable.val}) auf "${topCard.text}"!`
        });

        if (newBHand.length === 0) {
          setGameStatus('lost');
          setFeedback({
            type: 'error',
            title: '💀 Niederlage',
            text: `${botName} hat als Erster alle Karten abgelegt!`
          });
          return;
        }

        let nextPlayer = (currentTurn + 1) % 4;
        if (playable.type === 'action_skip') nextPlayer = (nextPlayer + 1) % 4;
        else if (playable.type === 'action_plus2') {
          if (nextPlayer === 0) {
            // Spieler zieht 2
            const d = [...deck];
            setPlayerHand(p => [...p, d.pop(), d.pop()].filter(Boolean));
            setDeck(d);
            nextPlayer = 1;
            setPenaltyMessage(`${botName} hat +2 gelegt! Du musstest 2 Karten ziehen.`);
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
        setFeedback({
          type: 'bot',
          title: `🤖 ${botName}`,
          text: `${botName} konnte den Wert ${topCard.val} nicht bedienen und hat gezogen.`
        });
        setCurrentTurn((currentTurn + 1) % 4);
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [currentTurn, gameStatus, topCard]);

  return (
    <div style={{
      backgroundColor: '#1e293b', // Schlichtes Dunkelblau-Grau OHNE Kitsch-Farben
      borderRadius: '12px',
      padding: '16px',
      color: '#ffffff',
      minHeight: '620px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      boxShadow: '0 4px 16px rgba(0,0,0,0.3)'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: '18px', color: '#f8fafc' }}>
            🎴 MATHE-UNO (Reiner Rechenwert, keine Farben)
          </div>
          <div style={{ fontSize: '11px', color: '#94a3b8' }}>
            Rechne im Kopf: Du darfst nur Karten mit dem gleichen Ergebnis ablegen!
          </div>
        </div>
        <button
          onClick={startNewGame}
          style={{
            backgroundColor: '#3b82f6',
            color: '#ffffff',
            border: 'none',
            padding: '6px 14px',
            borderRadius: '16px',
            fontWeight: 700,
            fontSize: '12px',
            cursor: 'pointer'
          }}
        >
          🔄 Neues Spiel
        </button>
      </div>

      {/* Die 3 Computergegner */}
      <div style={{ display: 'flex', justifyContent: 'space-around', margin: '10px 0' }}>
        <div style={{
          padding: '6px 12px',
          borderRadius: '8px',
          backgroundColor: currentTurn === 1 ? '#3b82f6' : '#334155',
          border: currentTurn === 1 ? '2px solid #ffffff' : '1px solid #475569',
          textAlign: 'center',
          fontSize: '12px'
        }}>
          <div style={{ fontWeight: 700 }}>Vex 👩 (Links)</div>
          <div style={{ color: '#cbd5e1' }}>{botHands[0]?.length || 0} Karten</div>
        </div>

        <div style={{
          padding: '6px 12px',
          borderRadius: '8px',
          backgroundColor: currentTurn === 2 ? '#3b82f6' : '#334155',
          border: currentTurn === 2 ? '2px solid #ffffff' : '1px solid #475569',
          textAlign: 'center',
          fontSize: '12px'
        }}>
          <div style={{ fontWeight: 700 }}>Peril 👦 (Oben)</div>
          <div style={{ color: '#cbd5e1' }}>{botHands[1]?.length || 0} Karten</div>
        </div>

        <div style={{
          padding: '6px 12px',
          borderRadius: '8px',
          backgroundColor: currentTurn === 3 ? '#3b82f6' : '#334155',
          border: currentTurn === 3 ? '2px solid #ffffff' : '1px solid #475569',
          textAlign: 'center',
          fontSize: '12px'
        }}>
          <div style={{ fontWeight: 700 }}>Angst 👨‍💼 (Rechts)</div>
          <div style={{ color: '#cbd5e1' }}>{botHands[2]?.length || 0} Karten</div>
        </div>
      </div>

      {/* Mitteilung / Rechen-Feedback */}
      {feedback && (
        <div style={{
          backgroundColor: feedback.type === 'error' ? 'rgba(239, 68, 68, 0.25)' : (feedback.type === 'success' ? 'rgba(34, 197, 94, 0.25)' : 'rgba(51, 65, 85, 0.7)'),
          border: `1px solid ${feedback.type === 'error' ? '#ef4444' : (feedback.type === 'success' ? '#22c55e' : '#64748b')}`,
          borderRadius: '8px',
          padding: '10px 14px',
          textAlign: 'center',
          fontSize: '13px'
        }}>
          <div style={{ fontWeight: 800, color: feedback.type === 'error' ? '#fca5a5' : (feedback.type === 'success' ? '#86efac' : '#93c5fd'), marginBottom: '2px' }}>
            {feedback.title}
          </div>
          <div>{feedback.text}</div>
          {penaltyMessage && (
            <div style={{ color: '#f87171', fontWeight: 700, marginTop: '4px' }}>{penaltyMessage}</div>
          )}
        </div>
      )}

      {/* Spieltisch-Mitte */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '28px', margin: '14px 0' }}>
        {/* Ziehstapel */}
        <div
          onClick={playerDrawCard}
          style={{
            width: '90px',
            height: '130px',
            backgroundColor: '#0f172a',
            border: '2px solid #64748b',
            borderRadius: '10px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: currentTurn === 0 ? 'pointer' : 'default',
            boxShadow: '0 4px 10px rgba(0,0,0,0.4)'
          }}
        >
          <div style={{ fontWeight: 900, color: '#38bdf8', fontSize: '18px' }}>STAPEL</div>
          <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>Ziehen ({deck.length})</div>
        </div>

        {/* Oberste Karte (Ablagestapel) */}
        {topCard && (
          <div style={{
            width: '110px',
            height: '145px',
            backgroundColor: '#ffffff',
            color: '#0f172a',
            border: '3px solid #0f172a',
            borderRadius: '12px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '10px',
            boxShadow: '0 6px 16px rgba(0,0,0,0.4)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>OFFENE KARTE</div>
            <div style={{ fontSize: '18px', fontWeight: 900, color: '#1e293b', wordBreak: 'break-word' }}>
              {topCard.text}
            </div>
            <div style={{ fontSize: '10px', color: '#64748b' }}>
              {topCard.val > 0 ? `(Rechne den Wert!)` : topCard.expl}
            </div>
          </div>
        )}
      </div>

      {/* Eigene Handkarten (KEINE Farben, KEIN Verraten, ob sie passt!) */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div style={{ fontWeight: 800, fontSize: '14px' }}>
            🧙‍♂️ Deine Handkarten ({playerHand.length})
            {currentTurn === 0 ? <span style={{ color: '#4ade80', marginLeft: '6px' }}>◀ DU BIST DRAN (Klicke zum Legen)</span> : <span style={{ color: '#94a3b8', marginLeft: '6px' }}>• Bot überlegt...</span>}
          </div>
        </div>

        <div style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '8px',
          WebkitOverflowScrolling: 'touch'
        }}>
          {playerHand.map((card) => {
            return (
              <div
                key={card.id}
                onClick={() => handlePlayerCardClick(card)}
                style={{
                  minWidth: '85px',
                  height: '120px',
                  backgroundColor: '#ffffff',
                  color: '#0f172a',
                  border: '2px solid #cbd5e1',
                  borderRadius: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '8px',
                  cursor: currentTurn === 0 ? 'pointer' : 'default',
                  flexShrink: 0,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                  transition: 'transform 0.1s ease',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '10px', fontWeight: 700, color: '#64748b' }}>MATHE</div>
                <div style={{ fontSize: '15px', fontWeight: 900, color: '#0f172a', wordBreak: 'break-word' }}>
                  {card.text}
                </div>
                <div style={{ fontSize: '9px', color: '#94a3b8' }}>
                  {card.type.startsWith('action') ? 'Aktion' : 'Term'}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
