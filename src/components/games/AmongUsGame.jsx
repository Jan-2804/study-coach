import React, { useState } from 'react';
import confetti from 'canvas-confetti';

const CREWMATES = [
  { name: 'Rot (Du)', role: 'Crewmate', avatar: '🔴' },
  { name: 'Blau (Bot)', role: 'Crewmate', avatar: '🔵' },
  { name: 'Grün (Bot)', role: 'Crewmate', avatar: '🟢' },
  { name: 'Gelb (Bot)', role: 'Crewmate', avatar: '🟡' },
  { name: 'Schwarz (Bot)', role: 'Crewmate', avatar: '⚫' }
];

export default function AmongUsGame({ onGainXp }) {
  const [taskProgress, setTaskProgress] = useState(0); // 0 bis 100%
  const [sabotageActive, setSabotageActive] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [inMeeting, setInMeeting] = useState(false);
  const [impostorIndex, setImpostorIndex] = useState(() => Math.floor(Math.random() * 4) + 1); // einer der Bots ist Impostor!
  const [gameResult, setGameResult] = useState(null);
  const [message, setMessage] = useState('Repariere die Raumschiff-Systeme mit Mathe-Tasks, bevor der Impostor zuschlägt!');

  const tasksList = [
    {
      title: '⚡ Reaktor stabilisieren (Wurzel ziehen)',
      question: 'Reaktor-Kern überhitzt! Ziehe teilweise die Wurzel aus 72, um die Kühlung zu starten:',
      options: ['6√2', '12√2', '8√3', '36√2'],
      correct: '6√2',
      explanation: '72 = 36 · 2. Also √72 = 6√2.'
    },
    {
      title: '🔌 Kabel verbinden (Pythagoras)',
      question: 'Ein Kabel muss von der Konsole (3 m) zur Decke (4 m) gespannt werden. Wie lang muss das Kabel sein?',
      options: ['5 m', '7 m', '25 m', '12 m'],
      correct: '5 m',
      explanation: 'Hypotenuse c = √(3² + 4²) = √(9 + 16) = √25 = 5 m.'
    },
    {
      title: '🧭 Navigation kalibrieren (Kathete)',
      question: 'Das Schiff weicht ab. Hypotenuse = 13 km, Kathete b = 12 km. Wie groß ist Kathete a?',
      options: ['5 km', '1 km', '25 km', '8 km'],
      correct: '5 km',
      explanation: 'a = √(13² - 12²) = √(169 - 144) = √25 = 5 km.'
    },
    {
      title: '💨 O2-Filter reinigen (Nenner rational)',
      question: 'Schreibe den Filter-Koeffizienten 14 / √2 ohne Wurzel im Nenner:',
      options: ['7√2', '14√2', '2√7', '7'],
      correct: '7√2',
      explanation: '14√2 / 2 = 7√2.'
    }
  ];

  const startTask = (task) => {
    setCurrentTask(task);
  };

  const solveTask = (option) => {
    if (option === currentTask.correct) {
      const nextProgress = Math.min(100, taskProgress + 25);
      setTaskProgress(nextProgress);
      onGainXp(25);
      setMessage(`✓ Task erfolgreich abgeschlossen! Taskbar steigt auf ${nextProgress}%.`);
      setCurrentTask(null);

      if (nextProgress >= 100) {
        setGameResult('crew_win');
        onGainXp(150);
        confetti({ particleCount: 150 });
      } else if (Math.random() > 0.6) {
        // Sabotage-Alarm auslösen!
        setSabotageActive(true);
        setMessage('🚨 SABOTAGE ALARM! Der Impostor hat die Sauerstoff-Zufuhr sabotiert!');
      }
    } else {
      setMessage(`❌ Fehler bei der Reparatur! Der Impostor sabotiert weiter!`);
    }
  };

  // Emergency Meeting starten
  const callEmergency = () => {
    setInMeeting(true);
    setCurrentTask(null);
  };

  // Vote gegen einen Bot abgeben
  const votePlayer = (index) => {
    if (index === impostorIndex) {
      setGameResult('crew_win');
      onGainXp(200);
      confetti({ particleCount: 200, spread: 80 });
      setMessage(`🎉 ${CREWMATES[index].name} war der Impostor! Die Crew hat gewonnen! (+200 XP)`);
    } else {
      setGameResult('impostor_win');
      setMessage(`💀 ${CREWMATES[index].name} war NICHT der Impostor! Der echte Impostor hat das Schiff übernommen!`);
    }
  };

  const restartGame = () => {
    setTaskProgress(0);
    setSabotageActive(false);
    setCurrentTask(null);
    setInMeeting(false);
    setGameResult(null);
    setImpostorIndex(Math.floor(Math.random() * 4) + 1);
    setMessage('Neues Spiel gestartet! Erfülle die Tasks auf dem Schiff!');
  };

  return (
    <div style={{
      backgroundColor: '#090d16',
      borderRadius: '12px',
      padding: '24px',
      color: '#ffffff',
      minHeight: '620px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }}>
      {/* Header & Taskbar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{ fontWeight: 900, fontSize: '22px', color: '#38bdf8' }}>
            🚀 AMONG US: MATH EMERGENCY
          </div>
          <button
            onClick={callEmergency}
            style={{
              backgroundColor: '#dc2626',
              color: '#ffffff',
              border: '2px solid #ffffff',
              borderRadius: '20px',
              padding: '8px 16px',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            🚨 EMERGENCY MEETING
          </button>
        </div>

        {/* Task-Leiste (Grün wie im Original) */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>
            <span>TOTAL TASKS COMPLETED</span>
            <span style={{ color: '#4ade80' }}>{taskProgress}%</span>
          </div>
          <div style={{ width: '100%', height: '18px', backgroundColor: '#1e293b', borderRadius: '4px', border: '2px solid #64748b', overflow: 'hidden' }}>
            <div style={{
              width: `${taskProgress}%`,
              height: '100%',
              backgroundColor: '#22c55e',
              transition: 'width 0.4s ease'
            }} />
          </div>
        </div>

        {/* Statusmeldung */}
        <div style={{
          backgroundColor: sabotageActive ? 'rgba(220, 38, 38, 0.4)' : 'rgba(30, 41, 59, 0.7)',
          border: sabotageActive ? '1px solid #ef4444' : '1px solid #475569',
          padding: '10px 14px',
          borderRadius: '8px',
          marginBottom: '20px',
          textAlign: 'center',
          fontWeight: 600
        }}>
          {message}
        </div>
      </div>

      {/* Haupt-Bereich: Entweder Tasks ODER Emergency Meeting */}
      {!inMeeting && !gameResult && (
        <div>
          {!currentTask ? (
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>Verfügbare Raumschiff-Tasks:</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
                {tasksList.map((t, idx) => (
                  <div
                    key={idx}
                    onClick={() => startTask(t)}
                    style={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #38bdf8',
                      borderRadius: '8px',
                      padding: '14px',
                      cursor: 'pointer',
                      transition: 'transform 0.15s ease'
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: '14px', color: '#fde047', marginBottom: '6px' }}>{t.title}</div>
                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>Klicken zum Reparieren ➔</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ backgroundColor: '#1e293b', border: '2px solid #facc15', borderRadius: '10px', padding: '20px' }}>
              <div style={{ fontWeight: 800, fontSize: '16px', color: '#facc15', marginBottom: '8px' }}>
                {currentTask.title}
              </div>
              <p style={{ fontSize: '15px', marginBottom: '16px' }}>{currentTask.question}</p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {currentTask.options.map((opt, oIdx) => (
                  <button
                    key={oIdx}
                    onClick={() => solveTask(opt)}
                    style={{
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid #475569',
                      backgroundColor: '#0f172a',
                      color: '#ffffff',
                      fontSize: '15px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentTask(null)}
                style={{ marginTop: '16px', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '13px' }}
              >
                Task abbrechen
              </button>
            </div>
          )}
        </div>
      )}

      {/* Emergency Meeting Ansicht */}
      {inMeeting && !gameResult && (
        <div style={{ backgroundColor: '#1e293b', borderRadius: '12px', padding: '20px', border: '2px solid #ef4444' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 900, textAlign: 'center', color: '#ef4444', marginBottom: '8px' }}>
            📢 WHO IS THE IMPOSTOR? (VOTING TIME)
          </h2>
          <p style={{ textAlign: 'center', fontSize: '13px', color: '#cbd5e1', marginBottom: '16px' }}>
            Die Crewmates haben Alibis. Einer von ihnen lügt bei seiner Mathe-Aussage! Wen wirfst du raus?
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {CREWMATES.map((cm, idx) => {
              if (idx === 0) return null; // Spieler selbst kann nicht voten
              const isSus = idx === impostorIndex;
              const statement = isSus ? '„Ich war in Medbay: 4√2 + 3√2 ergibt 7√4!“ (Falsch!)' : '„Ich habe O2 repariert: √(3² + 4²) ergibt 5.“ (Richtig)';
              return (
                <div
                  key={idx}
                  onClick={() => votePlayer(idx)}
                  style={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    padding: '10px 16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '24px' }}>{cm.avatar}</span>
                    <div>
                      <div style={{ fontWeight: 700 }}>{cm.name}</div>
                      <div style={{ fontSize: '12px', color: '#94a3b8' }}>{statement}</div>
                    </div>
                  </div>
                  <button style={{ backgroundColor: '#dc2626', color: '#ffffff', border: 'none', padding: '6px 14px', borderRadius: '6px', fontWeight: 700 }}>
                    VOTE
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Game Over Screen */}
      {gameResult && (
        <div style={{
          textAlign: 'center',
          padding: '24px',
          backgroundColor: gameResult === 'crew_win' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
          border: `2px solid ${gameResult === 'crew_win' ? '#22c55e' : '#ef4444'}`,
          borderRadius: '12px'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '8px' }}>
            {gameResult === 'crew_win' ? '🏆 VICTORY' : '💀 DEFEAT'}
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 900, color: gameResult === 'crew_win' ? '#22c55e' : '#ef4444' }}>
            {gameResult === 'crew_win' ? 'CREWMATES WIN!' : 'IMPOSTOR WINS!'}
          </h2>
          <p style={{ margin: '12px 0 20px 0' }}>{message}</p>
          <button
            onClick={restartGame}
            style={{
              backgroundColor: '#38bdf8',
              color: '#0f172a',
              border: 'none',
              padding: '12px 32px',
              borderRadius: '24px',
              fontSize: '16px',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            Neues Spiel starten 🔄
          </button>
        </div>
      )}

      <div style={{ textAlign: 'center', fontSize: '12px', color: '#64748b', marginTop: '16px' }}>
        Among Us Math Edition • Gegen 4 Computer-Bots
      </div>
    </div>
  );
}
