import React, { useState, useEffect } from 'react';
import { mathChapters, englishChapters } from './data/curriculum';
import { generateExam } from './data/examGenerator';
import { generateDynamicStation } from './data/stationGenerator';
import { getRank } from './data/gameEngine';
import BossFight from './components/BossFight';
import SurvivalMode from './components/SurvivalMode';
import './index.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('boss'); // 'boss' | 'survival' | 'stations' | 'exam' | 'calc' | 'english'
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
    gainXp(15); // XP für das Lösen einer Stationsaufgabe!
  };

  const calculatePythagoras = () => {
    const a = parseFloat(sideA);
    const b = parseFloat(sideB);
    const c = parseFloat(sideC);

    if (a && b && !c) {
      const res = Math.sqrt(a * a + b * b);
      setCalcResult({
        title: 'Gesucht: Hypotenuse c (längste Seite)',
        steps: [
          `1. Grundformel notieren: a² + b² = c²`,
          `2. Zahlen einsetzen: ${a}² + ${b}² = c²`,
          `3. Quadrieren: ${a * a} + ${b * b} = c²  ->  ${a * a + b * b} = c²`,
          `4. Wurzel ziehen: c = √(${a * a + b * b})`,
          `Ergebnis: c ≈ ${res.toFixed(2)} cm (exakter Wurzelausdruck: √${a * a + b * b})`
        ]
      });
    } else if (c && b && !a) {
      if (b >= c) {
        setCalcResult({
          title: 'Fehler in den Angaben!',
          steps: ['Die Hypotenuse c muss IMMER die längste Seite sein! Kathete b darf nicht größer oder gleich c sein.']
        });
        return;
      }
      const res = Math.sqrt(c * c - b * b);
      setCalcResult({
        title: 'Gesucht: Kathete a (du kennst Hypotenuse c und Kathete b!)',
        steps: [
          `1. Grundformel: a² + b² = c²`,
          `2. Umstellen nach a² (b² mit Minus auf die andere Seite): a² = c² - b²`,
          `3. Zahlen einsetzen: a² = ${c}² - ${b}²`,
          `4. Quadrieren: a² = ${c * c} - ${b * b}  ->  a² = ${c * c - b * b}`,
          `5. Wurzel ziehen: a = √(${c * c - b * b})`,
          `Ergebnis: a ≈ ${res.toFixed(2)} cm (exakt: √${c * c - b * b})`
        ]
      });
    } else if (c && a && !b) {
      if (a >= c) {
        setCalcResult({
          title: 'Fehler in den Angaben!',
          steps: ['Die Hypotenuse c muss IMMER die längste Seite sein! Kathete a darf nicht größer oder gleich c sein.']
        });
        return;
      }
      const res = Math.sqrt(c * c - a * a);
      setCalcResult({
        title: 'Gesucht: Kathete b (du kennst Hypotenuse c und Kathete a!)',
        steps: [
          `1. Grundformel: a² + b² = c²`,
          `2. Umstellen nach b² (a² mit Minus auf die andere Seite): b² = c² - a²`,
          `3. Zahlen einsetzen: b² = ${c}² - ${a}²`,
          `4. Quadrieren: b² = ${c * c} - ${a * a}  ->  b² = ${c * c - a * a}`,
          `5. Wurzel ziehen: b = √(${c * c - a * a})`,
          `Ergebnis: b ≈ ${res.toFixed(2)} cm (exakt: √${c * c - a * a})`
        ]
      });
    } else if (a && b && c) {
      const left = a * a + b * b;
      const right = c * c;
      const diff = Math.abs(left - right);
      let typ = '';
      if (diff < 0.001) {
        typ = 'RECHTWINKLIG (genau 90° Winkel gegenüber Seite c), weil a² + b² = c²';
      } else if (left > right) {
        typ = 'SPITZWINKLIG (alle Winkel < 90°), weil a² + b² > c²';
      } else {
        typ = 'STUMPFWINKLIG (ein Winkel > 90°), weil a² + b² < c²';
      }
      setCalcResult({
        title: `Prüfung der Dreiecksart für a = ${a}, b = ${b}, c = ${c}`,
        steps: [
          `1. Summe der Kathetenquadrate: ${a}² + ${b}² = ${a * a} + ${b * b} = ${left}`,
          `2. Quadrat der längsten Seite: ${c}² = ${right}`,
          `3. Vergleich: ${left} ${diff < 0.001 ? '=' : (left > right ? '>' : '<')} ${right}`,
          `Ergebnis: Das Dreieck ist ${typ}.`
        ]
      });
    } else {
      setCalcResult({
        title: 'Eingabe unvollständig',
        steps: ['Bitte gib entweder 2 Seiten ein oder alle 3!']
      });
    }
  };

  const currentStation = mathChapters[selectedStationIndex];
  const currentExercises = stationExercises[selectedStationIndex] || [];

  let examScore = 0;
  if (examSubmitted) {
    examQuestions.forEach(q => {
      if (examAnswers[q.id] === q.correctAnswer) examScore++;
    });
  }

  return (
    <div>
      {/* Header mit Rang- und XP-Anzeige */}
      <header className="app-header">
        <div className="header-inner">
          <div>
            <div className="app-title">Lern-Coach & Spiel (Klasse 9)</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
              <span>{userRank.icon} <strong>{userRank.title}</strong></span>
              <span>•</span>
              <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{xp} XP gesammelt</span>
            </div>
          </div>

          <nav className="tab-nav" style={{ flexWrap: 'wrap' }}>
            <button
              className={`tab-btn ${activeTab === 'boss' ? 'active' : ''}`}
              onClick={() => setActiveTab('boss')}
            >
              ⚔️ Boss-Fight Arena
            </button>
            <button
              className={`tab-btn ${activeTab === 'survival' ? 'active' : ''}`}
              onClick={() => setActiveTab('survival')}
            >
              🔥 Streak-Survival
            </button>
            <button
              className={`tab-btn ${activeTab === 'stations' ? 'active' : ''}`}
              onClick={() => setActiveTab('stations')}
            >
              🚩 Lernstationen (1 bis 5)
            </button>
            <button
              className={`tab-btn ${activeTab === 'exam' ? 'active' : ''}`}
              onClick={() => setActiveTab('exam')}
            >
              📝 Probeklassenarbeit
            </button>
            <button
              className={`tab-btn ${activeTab === 'calc' ? 'active' : ''}`}
              onClick={() => setActiveTab('calc')}
            >
              🔢 Pythagoras-Rechner
            </button>
            <button
              className={`tab-btn ${activeTab === 'english' ? 'active' : ''}`}
              onClick={() => setActiveTab('english')}
            >
              🇬🇧 Englisch
            </button>
          </nav>
        </div>
      </header>

      {/* Hauptinhalt */}
      <main className="container">

        {/* ===================== TAB: BOSS FIGHT ===================== */}
        {activeTab === 'boss' && (
          <BossFight xp={xp} onGainXp={gainXp} />
        )}

        {/* ===================== TAB: SURVIVAL ===================== */}
        {activeTab === 'survival' && (
          <SurvivalMode onGainXp={gainXp} />
        )}

        {/* ===================== TAB: LERNSTATIONEN ===================== */}
        {activeTab === 'stations' && (
          <div>
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '16px' }}>
              {mathChapters.map((station, idx) => (
                <button
                  key={station.id}
                  className={`tab-btn ${selectedStationIndex === idx ? 'active' : ''}`}
                  onClick={() => setSelectedStationIndex(idx)}
                  style={{ whiteSpace: 'nowrap' }}
                >
                  Station {idx + 1}: {station.title.split('–')[0]}
                </button>
              ))}
            </div>

            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <h1 className="card-title">{currentStation.title}</h1>
                <button
                  className="calc-btn"
                  onClick={() => regenerateStation(selectedStationIndex)}
                  style={{ fontSize: '13px', padding: '8px 12px' }}
                >
                  🎲 Neue Zahlen für diese Station
                </button>
              </div>
              <p className="card-desc">{currentStation.description}</p>

              <div className="theory-box">
                {currentStation.summary}
              </div>

              <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px', marginTop: '24px' }}>
                Dynamische Aufgaben (Jede richtige Antwort gibt +15 XP!):
              </h2>

              {currentExercises.map((ex, exIdx) => {
                const selectedOpt = stationAnswers[ex.id];
                const isAnswered = selectedOpt !== undefined;
                const isCorrect = isAnswered && selectedOpt === ex.correctIndex;

                return (
                  <div key={ex.id} className="exercise-box">
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>
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
                          {isCorrect ? '✓ Super, richtig gerechnet! (+15 XP)' : '✗ Noch nicht ganz richtig.'}
                        </div>
                        <div>{ex.explanation}</div>
                      </div>
                    )}
                  </div>
                );
              })}

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                <button className="tab-btn" onClick={() => regenerateStation(selectedStationIndex)}>
                  🔄 Gleiche Station mit neuen Zahlen nochmal
                </button>

                {selectedStationIndex < mathChapters.length - 1 && (
                  <button className="calc-btn" onClick={() => setSelectedStationIndex(selectedStationIndex + 1)}>
                    Zur nächsten Station weiter ➔
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB: PROBEKLASSENARBEIT ===================== */}
        {activeTab === 'exam' && (
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
              <h1 className="card-title">📝 Unendliche Probeklassenarbeit</h1>
              <button className="calc-btn" onClick={startNewExam}>
                🎲 Neue Arbeit mit neuen Zahlen
              </button>
            </div>
            <p className="card-desc">
              8 Aufgaben aus dem Stoff vom Mittwoch. Nach Abgabe siehst du sofort alle detaillierten Schritte.
            </p>

            {examSubmitted && (
              <div style={{
                padding: '16px',
                backgroundColor: examScore >= 6 ? 'var(--success-bg)' : 'var(--error-bg)',
                border: `2px solid ${examScore >= 6 ? 'var(--success)' : 'var(--error)'}`,
                borderRadius: '8px',
                marginBottom: '20px'
              }}>
                <div style={{ fontSize: '18px', fontWeight: 700, color: examScore >= 6 ? 'var(--success)' : 'var(--error)' }}>
                  Ergebnis: {examScore} von {examQuestions.length} Punkten!
                </div>
              </div>
            )}

            {examQuestions.map((q) => {
              const userAns = examAnswers[q.id];
              const isCorrect = userAns === q.correctAnswer;

              return (
                <div key={q.id} className="exercise-box">
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    <span>{q.title}</span>
                    <span>{q.category}</span>
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
                      <div style={{ fontWeight: 700, marginBottom: '6px' }}>
                        {isCorrect ? '✓ Richtig!' : `✗ Richtig ist: ${q.correctAnswer}`}
                      </div>
                      <ul style={{ paddingLeft: '20px', fontSize: '13px', lineHeight: '1.6' }}>
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
                style={{ width: '100%', padding: '14px', fontSize: '16px', marginTop: '12px' }}
              >
                Klassenarbeit abgeben & Auswertung ansehen
              </button>
            ) : (
              <button
                className="calc-btn"
                onClick={startNewExam}
                style={{ width: '100%', padding: '14px', fontSize: '16px', marginTop: '12px' }}
              >
                🔄 Neue Klassenarbeit starten
              </button>
            )}
          </div>
        )}

        {/* ===================== TAB: RECHNER ===================== */}
        {activeTab === 'calc' && (
          <div className="card">
            <h1 className="card-title">🔢 Pythagoras-Schritt-Rechner (mit c)</h1>
            <p className="card-desc">
              Gib genau 2 Seiten ein, die 3. wird mit allen Einzelschritten berechnet.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginTop: '16px' }}>
              <div className="form-group">
                <label className="form-label">Kathete a:</label>
                <input
                  type="number"
                  step="any"
                  className="form-input"
                  value={sideA}
                  onChange={e => setSideA(e.target.value)}
                  placeholder="z. B. 6"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Kathete b:</label>
                <input
                  type="number"
                  step="any"
                  className="form-input"
                  value={sideB}
                  onChange={e => setSideB(e.target.value)}
                  placeholder="z. B. 8"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Hypotenuse c (längste Seite):</label>
                <input
                  type="number"
                  step="any"
                  className="form-input"
                  value={sideC}
                  onChange={e => setSideC(e.target.value)}
                  placeholder="z. B. 10 (oder frei lassen)"
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              <button className="calc-btn" onClick={calculatePythagoras}>
                Rechenschritte anzeigen
              </button>
              <button
                className="tab-btn"
                onClick={() => { setSideA(''); setSideB(''); setSideC(''); setCalcResult(null); }}
              >
                Leeren
              </button>
            </div>

            {calcResult && (
              <div style={{
                marginTop: '20px',
                padding: '16px',
                border: '1px solid var(--primary)',
                backgroundColor: 'var(--primary-light)',
                borderRadius: '6px'
              }}>
                <div style={{ fontWeight: 700, fontSize: '16px', color: 'var(--primary)', marginBottom: '8px' }}>
                  {calcResult.title}
                </div>
                <ul style={{ paddingLeft: '20px', lineHeight: '1.8', fontSize: '14px' }}>
                  {calcResult.steps.map((st, idx) => <li key={idx}><strong>{st}</strong></li>)}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* ===================== TAB: ENGLISCH ===================== */}
        {activeTab === 'english' && (
          <div className="card">
            <h1 className="card-title">🇬🇧 Englisch – Vorbereitung Freitag</h1>
            <p className="card-desc">Zeitformen, Signalwörter und If-Sätze.</p>

            {englishChapters.map(chap => (
              <div key={chap.id} style={{ marginBottom: '28px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>{chap.title}</h2>
                <div className="theory-box">{chap.summary}</div>

                <h3 style={{ fontSize: '15px', fontWeight: 600, marginTop: '12px', marginBottom: '8px' }}>Übungen:</h3>
                {chap.exercises.map(ex => (
                  <div key={ex.id} className="exercise-box">
                    <div className="question-text">{ex.question}</div>
                    <div className="options-list">
                      {ex.options.map((opt, oIdx) => (
                        <button
                          key={oIdx}
                          className={`option-btn ${stationAnswers[ex.id] === oIdx ? (oIdx === ex.correctIndex ? 'correct' : 'incorrect') : ''}`}
                          onClick={() => {
                            setStationAnswers(prev => ({ ...prev, [ex.id]: oIdx }));
                            if (oIdx === ex.correctIndex) gainXp(15);
                          }}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                    {stationAnswers[ex.id] !== undefined && (
                      <div className={`feedback-box ${stationAnswers[ex.id] === ex.correctIndex ? 'correct' : 'incorrect'}`}>
                        {ex.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

      </main>
    </div>
  );
}
