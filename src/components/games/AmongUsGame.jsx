import React, { useState } from 'react';
import confetti from 'canvas-confetti';

const CREWMATES = [
  { name: 'Rot (Du)', role: 'Crewmate', avatar: '🔴' },
  { name: 'Blau (Bot)', role: 'Crewmate', avatar: '🔵' },
  { name: 'Grün (Bot)', role: 'Crewmate', avatar: '🟢' },
  { name: 'Gelb (Bot)', role: 'Crewmate', avatar: '🟡' },
  { name: 'Schwarz (Bot)', role: 'Crewmate', avatar: '⚫' }
];

// Generator für dynamische Mathe-Tasks mit immer neuen Zahlen
function generateDynamicTask() {
  const taskTypes = ['reaktor', 'kabel', 'navigation', 'filter', 'sachaufgabe'];
  const type = taskTypes[Math.floor(Math.random() * taskTypes.length)];

  if (type === 'reaktor') {
    // Teilweises Wurzelziehen
    const sqs = [
      { num: 8, simp: '2√2', factor: 4, remain: 2 },
      { num: 12, simp: '2√3', factor: 4, remain: 3 },
      { num: 18, simp: '3√2', factor: 9, remain: 2 },
      { num: 20, simp: '2√5', factor: 4, remain: 5 },
      { num: 27, simp: '3√3', factor: 9, remain: 3 },
      { num: 32, simp: '4√2', factor: 16, remain: 2 },
      { num: 50, simp: '5√2', factor: 25, remain: 2 },
      { num: 72, simp: '6√2', factor: 36, remain: 2 }
    ];
    const s = sqs[Math.floor(Math.random() * sqs.length)];
    const options = [
      s.simp,
      `${s.remain}√${s.factor}`,
      `${Math.sqrt(s.factor)}√${s.num}`,
      `${s.num / 2}√2`
    ].sort(() => Math.random() - 0.5);

    return {
      title: '⚡ Reaktor kühlen (Teilweises Wurzelziehen)',
      question: `Reaktor-Kern überhitzt! Zerlege √${s.num} so weit wie möglich, um die Kühlstäbe einzufahren:`,
      options,
      correct: s.simp,
      explanation: `√${s.num} = √(${s.factor} · ${s.remain}) = √${s.factor} · √${s.remain} = ${s.simp}.`
    };
  }

  if (type === 'kabel') {
    // Hypotenuse berechnen c = √(a² + b²)
    const triples = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15]];
    const [a, b, c] = triples[Math.floor(Math.random() * triples.length)];
    const options = [`${c} m`, `${c + 2} m`, `${a + b} m`, `${c - 1} m`].sort(() => Math.random() - 0.5);

    return {
      title: '🔌 Kabel verbinden (Hypotenuse berechnen)',
      question: `Verbinde die Stromkabel von der Konsole (Abstand a = ${a} m, Höhe b = ${b} m). Wie lang muss das Kabel c sein?`,
      options,
      correct: `${c} m`,
      explanation: `c² = ${a}² + ${b}² = ${a*a} + ${b*b} = ${c*c}. c = √${c*c} = ${c} m.`
    };
  }

  if (type === 'navigation') {
    // Kathete berechnen a = √(c² - b²)
    const triples = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [12, 16, 20]];
    const [a, b, c] = triples[Math.floor(Math.random() * triples.length)];
    const options = [`${a} km`, `${c - b} km`, `${a + 3} km`, `${c + 1} km`].sort(() => Math.random() - 0.5);

    return {
      title: '🧭 Navigation kalibrieren (Kathete gesucht)',
      question: `Der Autopilot ist verstellt: Kurs-Distanz c = ${c} km, Abweichung b = ${b} km. Berechne die Korrektur-Strecke a:`,
      options,
      correct: `${a} km`,
      explanation: `a² = c² - b² = ${c}² - ${b}² = ${c*c} - ${b*b} = ${a*a}. a = √${a*a} = ${a} km.`
    };
  }

  if (type === 'filter') {
    // Nenner rational machen
    const pairs = [
      { top: 14, bot: 2, res: '7√2' },
      { top: 21, bot: 7, res: '3√7' },
      { top: 15, bot: 5, res: '3√5' },
      { top: 18, bot: 3, res: '6√3' },
      { top: 20, bot: 5, res: '4√5' }
    ];
    const p = pairs[Math.floor(Math.random() * pairs.length)];
    const options = [p.res, `${p.top}√${p.bot}`, `${p.bot}√${p.top}`, `${p.top / p.bot}`].sort(() => Math.random() - 0.5);

    return {
      title: '💨 O2-Filter reinigen (Nenner rational)',
      question: `Schreibe den Druck-Koeffizienten ${p.top} / √${p.bot} ohne Wurzel im Nenner:`,
      options,
      correct: p.res,
      explanation: `(${p.top} · √${p.bot}) / (${p.bot}) = ${p.res}.`
    };
  }

  // Sachaufgabe: Leiter / Schrank
  const L = [5.0, 5.2, 5.5, 6.0][Math.floor(Math.random() * 4)];
  const D = [1.5, 1.8, 2.0][Math.floor(Math.random() * 3)];
  const H = Math.sqrt(L * L - D * D).toFixed(2);
  const options = [`${H} m`, `${(L - D).toFixed(2)} m`, `${(parseFloat(H) + 0.8).toFixed(2)} m`].sort(() => Math.random() - 0.5);

  return {
    title: '🚀 Notausstieg erreichen (Sachaufgabe Leiter)',
    question: `Die Rettungsleiter ist ${L.toFixed(1)} m lang und steht ${D.toFixed(1)} m von der Wand entfernt. Welche Höhe h erreicht sie?`,
    options,
    correct: `${H} m`,
    explanation: `h = √(${L}² - ${D}²) = √(${(L*L - D*D).toFixed(2)}) ≈ ${H} m.`
  };
}

export default function AmongUsGame({ onGainXp }) {
  const [taskProgress, setTaskProgress] = useState(0);
  const [currentTask, setCurrentTask] = useState(null);
  const [taskFeedback, setTaskFeedback] = useState(null);
  const [inMeeting, setInMeeting] = useState(false);
  const [impostorIndex, setImpostorIndex] = useState(() => Math.floor(Math.random() * 4) + 1);
  const [gameResult, setGameResult] = useState(null);
  const [message, setMessage] = useState('Erfülle dynamische Mathe-Tasks! Jede Aufgabe hat neue Zahlen.');

  // 4 dynamische Tasks im Raumschiff
  const [activeTasks, setActiveTasks] = useState(() => [
    generateDynamicTask(),
    generateDynamicTask(),
    generateDynamicTask(),
    generateDynamicTask()
  ]);

  const selectTask = (task) => {
    setCurrentTask(task);
    setTaskFeedback(null);
  };

  const solveTask = (option) => {
    const isCorrect = option === currentTask.correct;
    if (isCorrect) {
      const nextProgress = Math.min(100, taskProgress + 25);
      setTaskProgress(nextProgress);
      onGainXp(30);
      setTaskFeedback({ correct: true, text: `✓ Richtig gelöst! (+30 XP) ${currentTask.explanation}` });

      // Ersetze diese Task durch eine brandneue mit neuen Zahlen!
      setActiveTasks(prev => prev.map(t => t.title === currentTask.title ? generateDynamicTask() : t));

      if (nextProgress >= 100) {
        setGameResult('crew_win');
        onGainXp(150);
        confetti({ particleCount: 150 });
      }
    } else {
      setTaskFeedback({ correct: false, text: `❌ Falsch! Richtige Lösung: ${currentTask.correct}. Erklärung: ${currentTask.explanation}` });
    }
  };

  const callEmergency = () => {
    setInMeeting(true);
    setCurrentTask(null);
  };

  const votePlayer = (index) => {
    if (index === impostorIndex) {
      setGameResult('crew_win');
      onGainXp(200);
      confetti({ particleCount: 200, spread: 80 });
      setMessage(`🎉 ${CREWMATES[index].name} war der Impostor! Seine Mathe-Aussage war gelogen! Crew gewinnt! (+200 XP)`);
    } else {
      setGameResult('impostor_win');
      setMessage(`💀 ${CREWMATES[index].name} hatte recht gerechnet! Der echte Impostor hat die Crew besiegt!`);
    }
  };

  const restartGame = () => {
    setTaskProgress(0);
    setCurrentTask(null);
    setTaskFeedback(null);
    setInMeeting(false);
    setGameResult(null);
    setImpostorIndex(Math.floor(Math.random() * 4) + 1);
    setActiveTasks([
      generateDynamicTask(),
      generateDynamicTask(),
      generateDynamicTask(),
      generateDynamicTask()
    ]);
    setMessage('Neues Spiel mit frischen Mathe-Tasks gestartet!');
  };

  return (
    <div style={{
      backgroundColor: '#090d16',
      borderRadius: '12px',
      padding: '20px',
      color: '#ffffff',
      minHeight: '620px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }}>
      {/* Header & Taskbar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ fontWeight: 900, fontSize: '20px', color: '#38bdf8' }}>
            🚀 AMONG US: MATH TASKS
          </div>
          <button
            onClick={callEmergency}
            style={{
              backgroundColor: '#dc2626',
              color: '#ffffff',
              border: '2px solid #ffffff',
              borderRadius: '20px',
              padding: '6px 14px',
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            🚨 EMERGENCY MEETING
          </button>
        </div>

        {/* Task-Leiste */}
        <div style={{ marginBottom: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>
            <span>TOTAL TASKS COMPLETED</span>
            <span style={{ color: '#4ade80' }}>{taskProgress}%</span>
          </div>
          <div style={{ width: '100%', height: '16px', backgroundColor: '#1e293b', borderRadius: '4px', border: '2px solid #64748b', overflow: 'hidden' }}>
            <div style={{
              width: `${taskProgress}%`,
              height: '100%',
              backgroundColor: '#22c55e',
              transition: 'width 0.4s ease'
            }} />
          </div>
        </div>

        <div style={{
          backgroundColor: 'rgba(30, 41, 59, 0.7)',
          border: '1px solid #475569',
          padding: '8px 12px',
          borderRadius: '8px',
          marginBottom: '16px',
          textAlign: 'center',
          fontSize: '13px',
          fontWeight: 600
        }}>
          {message}
        </div>
      </div>

      {/* Haupt-Bereich: Tasks oder Emergency */}
      {!inMeeting && !gameResult && (
        <div>
          {!currentTask ? (
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '10px' }}>
                Wähle eine Raumschiff-Task (immer mit neuen Zahlen):
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>
                {activeTasks.map((t, idx) => (
                  <div
                    key={idx}
                    onClick={() => selectTask(t)}
                    style={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #38bdf8',
                      borderRadius: '8px',
                      padding: '12px 14px',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ fontWeight: 800, fontSize: '14px', color: '#fde047', marginBottom: '4px' }}>{t.title}</div>
                    <div style={{ fontSize: '12px', color: '#cbd5e1' }}>{t.question}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ backgroundColor: '#1e293b', border: '2px solid #facc15', borderRadius: '10px', padding: '16px' }}>
              <div style={{ fontWeight: 800, fontSize: '15px', color: '#facc15', marginBottom: '8px' }}>
                {currentTask.title}
              </div>
              <p style={{ fontSize: '14px', marginBottom: '14px', lineHeight: '1.4' }}>{currentTask.question}</p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {currentTask.options.map((opt, oIdx) => (
                  <button
                    key={oIdx}
                    onClick={() => solveTask(opt)}
                    disabled={taskFeedback !== null}
                    style={{
                      padding: '12px 8px',
                      borderRadius: '8px',
                      border: '1px solid #475569',
                      backgroundColor: '#0f172a',
                      color: '#ffffff',
                      fontSize: '14px',
                      fontWeight: 700,
                      cursor: taskFeedback !== null ? 'default' : 'pointer'
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              {taskFeedback && (
                <div style={{
                  marginTop: '12px',
                  padding: '10px',
                  borderRadius: '6px',
                  backgroundColor: taskFeedback.correct ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                  border: `1px solid ${taskFeedback.correct ? '#22c55e' : '#ef4444'}`,
                  fontSize: '13px'
                }}>
                  {taskFeedback.text}
                </div>
              )}

              <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                {taskFeedback && (
                  <button
                    onClick={() => setCurrentTask(null)}
                    style={{ flex: 1, backgroundColor: '#2563eb', color: '#ffffff', border: 'none', padding: '10px', borderRadius: '6px', fontWeight: 700 }}
                  >
                    Nächste Task ➔
                  </button>
                )}
                <button
                  onClick={() => setCurrentTask(null)}
                  style={{ background: 'none', border: '1px solid #64748b', color: '#cbd5e1', padding: '10px', borderRadius: '6px', fontSize: '12px' }}
                >
                  Zurück
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Emergency Meeting */}
      {inMeeting && !gameResult && (
        <div style={{ backgroundColor: '#1e293b', borderRadius: '12px', padding: '16px', border: '2px solid #ef4444' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 900, textAlign: 'center', color: '#ef4444', marginBottom: '6px' }}>
            📢 WHO IS THE IMPOSTOR? (VOTING)
          </h2>
          <p style={{ textAlign: 'center', fontSize: '12px', color: '#cbd5e1', marginBottom: '12px' }}>
            Ein Bot lügt bei seiner mathematischen Behauptung! Wer ist es?
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {CREWMATES.map((cm, idx) => {
              if (idx === 0) return null;
              const isSus = idx === impostorIndex;
              const statement = isSus ? '„In Navigation: 5² + 12² = 13², also 25 + 144 = 170!“ (Rechenfehler!)' : '„In Medbay: √50 ist 5√2.“ (Richtig)';
              return (
                <div
                  key={idx}
                  onClick={() => votePlayer(idx)}
                  style={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '20px' }}>{cm.avatar}</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '13px' }}>{cm.name}</div>
                      <div style={{ fontSize: '11px', color: '#94a3b8' }}>{statement}</div>
                    </div>
                  </div>
                  <button style={{ backgroundColor: '#dc2626', color: '#ffffff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: 800, fontSize: '12px' }}>
                    VOTE
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Game Over */}
      {gameResult && (
        <div style={{
          textAlign: 'center',
          padding: '20px',
          backgroundColor: gameResult === 'crew_win' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
          border: `2px solid ${gameResult === 'crew_win' ? '#22c55e' : '#ef4444'}`,
          borderRadius: '12px'
        }}>
          <div style={{ fontSize: '42px', marginBottom: '6px' }}>{gameResult === 'crew_win' ? '🏆' : '💀'}</div>
          <h2 style={{ fontSize: '20px', fontWeight: 900, color: gameResult === 'crew_win' ? '#22c55e' : '#ef4444' }}>
            {gameResult === 'crew_win' ? 'CREWMATES WIN!' : 'IMPOSTOR WINS!'}
          </h2>
          <p style={{ margin: '8px 0 16px 0', fontSize: '13px' }}>{message}</p>
          <button
            onClick={restartGame}
            style={{
              backgroundColor: '#38bdf8',
              color: '#0f172a',
              border: 'none',
              padding: '10px 24px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            Neues Spiel starten 🔄
          </button>
        </div>
      )}

      <div style={{ textAlign: 'center', fontSize: '11px', color: '#64748b', marginTop: '12px' }}>
        Among Us Math Edition • Dynamische Aufgaben
      </div>
    </div>
  );
}
