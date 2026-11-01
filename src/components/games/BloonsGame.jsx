import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

const BALLOON_COLORS = ['#ef4444', '#3b82f6', '#22c55e', '#eab308'];

export default function BloonsGame({ onGainXp }) {
  const canvasRef = useRef(null);
  const [cash, setCash] = useState(150);
  const [lives, setLives] = useState(20);
  const [wave, setWave] = useState(1);
  const [waveActive, setWaveActive] = useState(false);
  const [towers, setTowers] = useState([]);
  const [mathQuestion, setMathQuestion] = useState(null);
  const [message, setMessage] = useState('Platziere Affen-Türme und löse Mathe-Aufgaben für Extra-Guthaben!');

  // Pfad für die Ballons
  const path = [
    { x: 20, y: 80 },
    { x: 180, y: 80 },
    { x: 180, y: 220 },
    { x: 380, y: 220 },
    { x: 380, y: 90 },
    { x: 580, y: 90 },
    { x: 580, y: 280 }
  ];

  // Turm kaufen
  const buyTower = (type) => {
    const cost = type === 'dart' ? 100 : 200;
    if (cash < cost) {
      setMessage('Nicht genug Gold! Löse unten eine Mathe-Aufgabe, um Geld zu verdienen!');
      return;
    }
    setCash(c => c - cost);

    // Auf freie Position setzen
    const posX = 100 + towers.length * 90;
    const posY = 150;
    setTowers(prev => [...prev, {
      id: Date.now(),
      type,
      x: posX,
      y: posY,
      range: type === 'dart' ? 80 : 120,
      damage: type === 'dart' ? 1 : 3,
      name: type === 'dart' ? 'Pfeil-Affe 🐒' : 'Wurzel-Kanone 💣'
    }]);
    setMessage(`${type === 'dart' ? 'Pfeil-Affe' : 'Wurzel-Kanone'} platziert!`);
  };

  // Mathe-Runde für Gold
  const triggerMathIncome = () => {
    const a = Math.floor(Math.random() * 5) + 3;
    const b = Math.floor(Math.random() * 5) + 3;
    const res = a * a + b * b;
    setMathQuestion({
      text: `Berechne ${a}² + ${b}²:`,
      options: [`${res}`, `${res + 5}`, `${(a + b) * (a + b)}`, `${res - 4}`].sort(() => Math.random() - 0.5),
      correct: `${res}`
    });
  };

  const answerMath = (opt) => {
    if (opt === mathQuestion.correct) {
      setCash(c => c + 100);
      onGainXp(20);
      setMessage('✓ Richtig gerechnet! +100 Gold und +20 XP erhalten!');
    } else {
      setMessage('❌ Falsch! Kein Gold erhalten.');
    }
    setMathQuestion(null);
  };

  // Welle starten
  const startWave = () => {
    if (waveActive) return;
    setWaveActive(true);
    setMessage(`Welle ${wave} gestartet! Die Ballons rücken vor!`);

    let balloonsPopped = 0;
    const interval = setInterval(() => {
      balloonsPopped++;
      // Schaden berechnen basierend auf Türmen
      const totalPower = towers.reduce((acc, t) => acc + t.damage, 0);

      if (totalPower >= wave * 2) {
        setCash(c => c + 30);
      } else {
        setLives(l => Math.max(0, l - 2));
      }

      if (balloonsPopped >= 5) {
        clearInterval(interval);
        setWaveActive(false);
        setWave(w => w + 1);
        onGainXp(30);
        confetti({ particleCount: 50 });
        setMessage(`Welle ${wave} erfolgreich abgewehrt!`);
      }
    }, 1000);
  };

  // Canvas zeichnen
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Wiese
    ctx.fillStyle = '#86efac';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Pfad (Braun)
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 32;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    path.forEach((p, i) => {
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    ctx.stroke();

    // Pfad-Linie innen
    ctx.strokeStyle = '#fef3c7';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Türme zeichnen
    towers.forEach(t => {
      // Reichweitenkreis
      ctx.beginPath();
      ctx.arc(t.x, t.y, t.range, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(59, 130, 246, 0.15)';
      ctx.fill();

      // Turm-Körper
      ctx.beginPath();
      ctx.arc(t.x, t.y, 18, 0, Math.PI * 2);
      ctx.fillStyle = t.type === 'dart' ? '#78350f' : '#334155';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Emoji
      ctx.font = '16px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(t.type === 'dart' ? '🐒' : '💣', t.x, t.y);
    });
  }, [towers, waveActive]);

  return (
    <div style={{
      backgroundColor: '#14532d',
      borderRadius: '12px',
      padding: '24px',
      color: '#ffffff',
      boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
      minHeight: '620px'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ fontWeight: 900, fontSize: '22px', color: '#fde047' }}>
          🎈 BLOONS TOWER DEFENSE: MATH DEFENDER
        </div>
        <div style={{ display: 'flex', gap: '16px', fontWeight: 800 }}>
          <span style={{ color: '#ef4444' }}>❤️ {lives} Leben</span>
          <span style={{ color: '#facc15' }}>🪙 {cash} Gold</span>
          <span style={{ color: '#38bdf8' }}>🌊 Welle {wave}</span>
        </div>
      </div>

      <div style={{ backgroundColor: 'rgba(0,0,0,0.5)', padding: '10px 16px', borderRadius: '8px', marginBottom: '16px', fontWeight: 600 }}>
        {message}
      </div>

      {/* Spielfeld (Canvas) */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
        <canvas
          ref={canvasRef}
          width={640}
          height={320}
          style={{ borderRadius: '10px', border: '4px solid #166534', boxShadow: '0 6px 16px rgba(0,0,0,0.4)', maxWidth: '100%' }}
        />
      </div>

      {/* Kontroll-Leiste: Shop, Welle starten, Mathe-Gold */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
        <button
          onClick={() => buyTower('dart')}
          style={{
            backgroundColor: '#ca8a04',
            color: '#000000',
            border: 'none',
            padding: '12px',
            borderRadius: '8px',
            fontWeight: 800,
            cursor: 'pointer'
          }}
        >
          🐒 Pfeil-Affe kaufen (100🪙)
        </button>

        <button
          onClick={() => buyTower('cannon')}
          style={{
            backgroundColor: '#475569',
            color: '#ffffff',
            border: 'none',
            padding: '12px',
            borderRadius: '8px',
            fontWeight: 800,
            cursor: 'pointer'
          }}
        >
          💣 Wurzel-Kanone (200🪙)
        </button>

        <button
          onClick={triggerMathIncome}
          style={{
            backgroundColor: '#2563eb',
            color: '#ffffff',
            border: 'none',
            padding: '12px',
            borderRadius: '8px',
            fontWeight: 800,
            cursor: 'pointer'
          }}
        >
          ➕ Mathe-Aufgabe für +100🪙
        </button>
      </div>

      <div style={{ marginTop: '16px', textAlign: 'center' }}>
        <button
          onClick={startWave}
          disabled={waveActive || lives <= 0}
          style={{
            backgroundColor: waveActive ? '#64748b' : '#dc2626',
            color: '#ffffff',
            border: 'none',
            padding: '14px 40px',
            borderRadius: '30px',
            fontSize: '18px',
            fontWeight: 900,
            cursor: waveActive ? 'not-allowed' : 'pointer'
          }}
        >
          {waveActive ? 'Welle läuft...' : `🚀 WELLE ${wave} STARTEN!`}
        </button>
      </div>

      {/* Mathe-Gold-Modal */}
      {mathQuestion && (
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
          <div style={{ backgroundColor: '#ffffff', color: '#0f172a', padding: '24px', borderRadius: '12px', maxWidth: '440px', width: '90%' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '8px', color: '#2563eb' }}>
              🧠 Mathe-Bank: Verdiene +100 Gold!
            </h3>
            <p style={{ fontSize: '16px', marginBottom: '16px', fontWeight: 600 }}>{mathQuestion.text}</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {mathQuestion.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => answerMath(opt)}
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#f1f5f9',
                    fontSize: '16px',
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
