import React, { useState } from 'react';
import { mathChapters, englishChapters } from './data/curriculum';
import { generateExam } from './data/examGenerator';
import { generateDynamicStation } from './data/stationGenerator';
import { getRank } from './data/gameEngine';
import BossFight from './components/BossFight';
import GameHub from './components/GameHub';
import StudyCheatSheet from './components/StudyCheatSheet';
import './index.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('arcade'); // 'arcade' | 'boss' | 'stations' | 'exam' | 'cheatsheet' | 'calc' | 'english'
  const [selectedStationIndex, setSelectedStationIndex] = useState(0);

  // XP und Level-System
  const [xp, setXp] = useState(() => {
    return parseInt(localStorage.getItem('study_coach_user_xp') || '0', 10);
  });

  const gainXp = (amount) => {
    setXp(prev => {
      const next = prev + amount;
      localStorage.setItem('study_coach_user_xp', next.toString());
      return next;
    });
  };

  const userRank = getRank(xp);

  // Dynamische Aufgaben für die 5 Stationen
  const [stationExercises, setStationExercises] = useState(() => ({
    0: generateDynamicStation(0),
    1: generateDynamicStation(1),
    2: generateDynamicStation(2),
    3: generateDynamicStation(3),
    4: generateDynamicStation(4)
  }));
  const [stationAnswers, setStationAnswers] = useState({});

  // Für interaktiven Pythagoras-Rechner
  const [sideA, setSideA] = useState('');
  const [sideB, setSideB] = useState('');
  const [sideC, setSideC] = useState('');
  const [calcResult, setCalcResult] = useState(null);

  // Probeklassenarbeit
  const [examQuestions, setExamQuestions] = useState(() => generateExam());
  const [examAnswers, setExamAnswers] = useState({});
  const [examSubmitted, setExamSubmitted] = useState(false);

  const startNewExam = () => {
    setExamQuestions(generateExam());
    setExamAnswers({});
    setExamSubmitted(false);
  };

  const regenerateStation = (stationIdx) => {
    setStationExercises(prev => ({
      ...prev,
      [stationIdx]: generateDynamicStation(stationIdx)
    }));
    setStationAnswers(prev => {
      const next = { ...prev };
      const currentList = stationExercises[stationIdx] || [];
      currentList.forEach(ex => delete next[ex.id]);
      return next;
    });
  };

  const handleSelectStationOption = (exId, optIdx) => {
    setStationAnswers(prev => ({ ...prev, [exId]: optIdx }));
    gainXp(15);
  };

  const printExam = () => {
    window.print();
  };

  const calculatePythagoras = () => {
    const a = parseFloat(sideA);
    const b = parseFloat(sideB);
    const c = parseFloat(sideC);

    if (a && b && !c) {
      const res = Math.sqrt(a * a + b * b);
      setCalcResult({
        title: 'Gesucht: Hypotenuse c',
        steps: [
          `1. c² = a² + b² = ${a}² + ${b}²`,
          `2. c² = ${a * a} + ${b * b} = ${a * a + b * b}`,
          `3. c = √(${a * a + b * b}) ≈ ${res.toFixed(2)} cm`
        ]
      });
    } else if (c && b && !a) {
      if (b >= c) {
        setCalcResult({ title: 'Fehler', steps: ['Hypotenuse c muss die längste Seite sein!'] });
        return;
      }
      const res = Math.sqrt(c * c - b * b);
      setCalcResult({
        title: 'Gesucht: Kathete a',
        steps: [
          `1. a² = c² - b² = ${c}² - ${b}²`,
          `2. a² = ${c * c} - ${b * b} = ${c * c - b * b}`,
          `3. a = √(${c * c - b * b}) ≈ ${res.toFixed(2)} cm`
        ]
      });
    } else if (c && a && !b) {
      if (a >= c) {
        setCalcResult({ title: 'Fehler', steps: ['Hypotenuse c muss die längste Seite sein!'] });
        return;
      }
      const res = Math.sqrt(c * c - a * a);
      setCalcResult({
        title: 'Gesucht: Kathete b',
        steps: [
          `1. b² = c² - a² = ${c}² - ${a}²`,
          `2. b² = ${c * c} - ${a * a} = ${c * c - a * a}`,
          `3. b = √(${c * c - a * a}) ≈ ${res.toFixed(2)} cm`
        ]
      });
    } else if (a && b && c) {
      const left = a * a + b * b;
      const right = c * c;
      const diff = Math.abs(left - right);
      let typ = diff < 0.001 ? 'RECHTWINKLIG' : (left > right ? 'SPITZWINKLIG' : 'STUMPFWINKLIG');
      setCalcResult({
        title: `Dreiecksart: ${typ}`,
        steps: [`a² + b² = ${left}`, `c² = ${right}`]
      });
    }
  };

  const currentStation = mathChapters[selectedStationIndex];
  const currentExercises = stationExercises[selectedStationIndex] || [];

  let examScore = 0;
  if (examSubmitted) {
    examQuestions.forEach(q => { if (examAnswers[q.id] === q.correctAnswer) examScore++; });
  }

  return (
    <div>
      {/* Header für Mobile & iOS Safe-Area optimiert (Großzügiger Abstand unter Dynamic Island / SideStore) */}
      <header className="app-header">
        <div className="header-top">
          <div>
            <div className="app-title">Lern-Coach 9a</div>
            <div className="rank-badge">
              <span>{userRank.icon} <strong>{userRank.title}</strong></span>
              <span>•</span>
              <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{xp} XP</span>
            </div>
          </div>
        </div>

        {/* Swipe-fähige horizontale Navigation */}
        <nav className="tab-nav">
          <button
            className={`tab-btn ${activeTab === 'arcade' ? 'active' : ''}`}
            onClick={() => setActiveTab('arcade')}
          >
            🎮 4 Minispiele
          </button>
          <button
            className={`tab-btn ${activeTab === 'cheatsheet' ? 'active' : ''}`}
            onClick={() => setActiveTab('cheatsheet')}
          >
            📄 Lernzettel & Drucken
          </button>
          <button
            className={`tab-btn ${activeTab === 'boss' ? 'active' : ''}`}
            onClick={() => setActiveTab('boss')}
          >
            ⚔️ Boss-Arena
          </button>
          <button
            className={`tab-btn ${activeTab === 'stations' ? 'active' : ''}`}
            onClick={() => setActiveTab('stations')}
          >
            🚩 Stationen 1-5
          </button>
          <button
            className={`tab-btn ${activeTab === 'exam' ? 'active' : ''}`}
            onClick={() => setActiveTab('exam')}
          >
            📝 Klassenarbeit
          </button>
          <button
            className={`tab-btn ${activeTab === 'calc' ? 'active' : ''}`}
            onClick={() => setActiveTab('calc')}
          >
            🔢 Rechner
          </button>
          <button
            className={`tab-btn ${activeTab === 'english' ? 'active' : ''}`}
            onClick={() => setActiveTab('english')}
          >
            🇬🇧 Englisch
          </button>
        </nav>
      </header>

      {/* Hauptinhalt */}
      <main className="container">

        {/* ===================== TAB: ARCADE-MINISPIELE ===================== */}
        {activeTab === 'arcade' && (
          <GameHub onGainXp={gainXp} />
        )}

        {/* ===================== TAB: LERNZETTEL & DRUCKEN ===================== */}
        {activeTab === 'cheatsheet' && (
          <StudyCheatSheet />
        )}

        {/* ===================== TAB: BOSS FIGHT ===================== */}
        {activeTab === 'boss' && (
          <BossFight xp={xp} onGainXp={gainXp} />
        )}

        {/* ===================== TAB: LERNSTATIONEN ===================== */}
        {activeTab === 'stations' && (
          <div>
            <div className="tab-nav" style={{ marginBottom: '14px' }}>
              {mathChapters.map((station, idx) => (
                <button
                  key={station.id}
                  className={`tab-btn ${selectedStationIndex === idx ? 'active' : ''}`}
                  onClick={() => setSelectedStationIndex(idx)}
                >
                  Station {idx + 1}
                </button>
              ))}
            </div>

            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                <h1 className="card-title">{currentStation.title}</h1>
                <button
                  className="calc-btn"
                  onClick={() => regenerateStation(selectedStationIndex)}
                  style={{ width: 'auto', fontSize: '12px', padding: '6px 12px' }}
                >
                  🎲 Neue Zahlen
                </button>
              </div>
              <p className="card-desc">{currentStation.description}</p>

              <div className="theory-box">{currentStation.summary}</div>

              <h2 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '12px', marginTop: '20px' }}>
                Dynamische Aufgaben (+15 XP):
              </h2>

              {currentExercises.map((ex, exIdx) => {
                const selectedOpt = stationAnswers[ex.id];
                const isAnswered = selectedOpt !== undefined;
                const isCorrect = isAnswered && selectedOpt === ex.correctIndex;

                return (
                  <div key={ex.id} className="exercise-box">
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                      Aufgabe {exIdx + 1}: {ex.title}
                    </div>
                    <div className="question-text">{ex.question}</div>

                    <div className="options-list">
                      {ex.options.map((opt, optIdx) => {
                        let btnClass = 'option-btn';
                        if (isAnswered) {
                          if (optIdx === ex.correctIndex) btnClass += ' correct';
                          else if (optIdx === selectedOpt) btnClass += ' incorrect';
                        } else if (selectedOpt === optIdx) {
                          btnClass += ' selected';
                        }

                        return (
                          <button
                            key={optIdx}
                            className={btnClass}
                            onClick={() => handleSelectStationOption(ex.id, optIdx)}
                            disabled={isAnswered}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    {isAnswered && (
                      <div className={`feedback-box ${isCorrect ? 'correct' : 'incorrect'}`}>
                        <div style={{ fontWeight: 700, marginBottom: '4px' }}>
                          {isCorrect ? '✓ Super! (+15 XP)' : '✗ Falsch.'}
                        </div>
                        <div>{ex.explanation}</div>
                      </div>
                    )}
                  </div>
                );
              })}

              <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                <button className="tab-btn" style={{ flex: 1 }} onClick={() => regenerateStation(selectedStationIndex)}>
                  🔄 Nochmal üben
                </button>
                {selectedStationIndex < mathChapters.length - 1 && (
                  <button className="calc-btn" style={{ flex: 1 }} onClick={() => setSelectedStationIndex(selectedStationIndex + 1)}>
                    Weiter ➔
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB: PROBEKLASSENARBEIT ===================== */}
        {activeTab === 'exam' && (
          <div className="card">
            {/* Kopfbereich mit Druck-Option */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <h1 className="card-title">📝 Probeklassenarbeit</h1>
                <p className="card-desc" style={{ marginBottom: 0 }}>8 Aufgaben exakt wie am Mittwoch in der Schule.</p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={printExam}
                  style={{
                    backgroundColor: '#0f172a',
                    color: '#ffffff',
                    border: 'none',
                    padding: '8px 14px',
                    borderRadius: '20px',
                    fontWeight: 700,
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  🖨️ Drucken / PDF
                </button>
                <button className="calc-btn" onClick={startNewExam} style={{ width: 'auto', fontSize: '12px', padding: '6px 12px' }}>
                  🎲 Neue Zahlen
                </button>
              </div>
            </div>

            {examSubmitted && (
              <div style={{
                padding: '14px',
                backgroundColor: examScore >= 6 ? 'var(--success-bg)' : 'var(--error-bg)',
                border: `2px solid ${examScore >= 6 ? 'var(--success)' : 'var(--error)'}`,
                borderRadius: '8px',
                margin: '14px 0'
              }}>
                <div style={{ fontSize: '16px', fontWeight: 800, color: examScore >= 6 ? 'var(--success)' : 'var(--error)' }}>
                  Ergebnis: {examScore} von {examQuestions.length} Punkten!
                </div>
              </div>
            )}

            {examQuestions.map((q) => {
              const userAns = examAnswers[q.id];
              const isCorrect = userAns === q.correctAnswer;

              return (
                <div key={q.id} className="exercise-box">
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    <span>{q.title}</span>
                  </div>
                  <div className="question-text">{q.question}</div>

                  <div className="options-list">
                    {q.options.map((opt, oIdx) => {
                      let btnClass = 'option-btn';
                      if (examSubmitted) {
                        if (opt === q.correctAnswer) btnClass += ' correct';
                        else if (opt === userAns) btnClass += ' incorrect';
                      } else if (userAns === opt) {
                        btnClass += ' selected';
                      }

                      return (
                        <button
                          key={oIdx}
                          className={btnClass}
                          onClick={() => !examSubmitted && setExamAnswers(prev => ({ ...prev, [q.id]: opt }))}
                          disabled={examSubmitted}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {examSubmitted && (
                    <div className={`feedback-box ${isCorrect ? 'correct' : 'incorrect'}`}>
                      <div style={{ fontWeight: 700, marginBottom: '4px' }}>
                        {isCorrect ? '✓ Richtig!' : `✗ Richtig ist: ${q.correctAnswer}`}
                      </div>
                      <ul style={{ paddingLeft: '18px', fontSize: '12px', lineHeight: '1.5' }}>
                        {q.steps.map((st, sIdx) => <li key={sIdx}>{st}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}

            {!examSubmitted ? (
              <button
                className="calc-btn"
                onClick={() => {
                  setExamSubmitted(true);
                  let sc = 0;
                  examQuestions.forEach(q => { if (examAnswers[q.id] === q.correctAnswer) sc++; });
                  gainXp(sc * 20);
                }}
              >
                Abgeben & Lösung ansehen
              </button>
            ) : (
              <button className="calc-btn" onClick={startNewExam}>
                🔄 Neue Arbeit starten
              </button>
            )}
          </div>
        )}

        {/* ===================== TAB: RECHNER ===================== */}
        {activeTab === 'calc' && (
          <div className="card">
            <h1 className="card-title">🔢 Pythagoras-Rechner</h1>
            <p className="card-desc">Gib 2 Seiten ein, die dritte wird berechnet.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px', marginTop: '12px' }}>
              <div className="form-group">
                <label className="form-label">Kathete a:</label>
                <input type="number" step="any" className="form-input" value={sideA} onChange={e => setSideA(e.target.value)} placeholder="z. B. 6" />
              </div>
              <div className="form-group">
                <label className="form-label">Kathete b:</label>
                <input type="number" step="any" className="form-input" value={sideB} onChange={e => setSideB(e.target.value)} placeholder="z. B. 8" />
              </div>
              <div className="form-group">
                <label className="form-label">Hypotenuse c:</label>
                <input type="number" step="any" className="form-input" value={sideC} onChange={e => setSideC(e.target.value)} placeholder="z. B. 10 (oder frei)" />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              <button className="calc-btn" onClick={calculatePythagoras}>Berechnen</button>
              <button className="tab-btn" onClick={() => { setSideA(''); setSideB(''); setSideC(''); setCalcResult(null); }}>Leeren</button>
            </div>
            {calcResult && (
              <div style={{ marginTop: '16px', padding: '12px', border: '1px solid var(--primary)', backgroundColor: 'var(--primary-light)', borderRadius: '8px' }}>
                <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--primary)', marginBottom: '6px' }}>{calcResult.title}</div>
                <ul style={{ paddingLeft: '18px', lineHeight: '1.6', fontSize: '13px' }}>
                  {calcResult.steps.map((st, idx) => <li key={idx}><strong>{st}</strong></li>)}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* ===================== TAB: ENGLISCH ===================== */}
        {activeTab === 'english' && (
          <div className="card">
            <h1 className="card-title">🇬🇧 Englisch – Freitag</h1>
            <p className="card-desc">Zeitformen, Signalwörter und If-Sätze.</p>
            {englishChapters.map(chap => (
              <div key={chap.id} style={{ marginBottom: '20px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '6px' }}>{chap.title}</h2>
                <div className="theory-box">{chap.summary}</div>
              </div>
            ))}
          </div>
        )}

      </main>
    </div>
  );
}
