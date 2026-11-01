import React, { useState } from 'react';
import { mathChapters, englishChapters } from './data/curriculum';
import { generateExam } from './data/examGenerator';
import './index.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('stations'); // 'stations' | 'exam' | 'calc' | 'english'
  const [selectedStationIndex, setSelectedStationIndex] = useState(0);
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

  const handleSelectStationOption = (exId, optIdx) => {
    setStationAnswers(prev => ({ ...prev, [exId]: optIdx }));
  };

  const resetStationAnswers = (stationId) => {
    const newAnswers = { ...stationAnswers };
    const station = mathChapters.find(s => s.id === stationId);
    if (station) {
      station.exercises.forEach(ex => delete newAnswers[ex.id]);
    }
    setStationAnswers(newAnswers);
  };

  const calculatePythagoras = () => {
    const a = parseFloat(sideA);
    const b = parseFloat(sideB);
    const c = parseFloat(sideC);

    // Fall 1: Hypotenuse c gesucht (a und b bekannt)
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
    }
    // Fall 2: Kathete a gesucht (c und b bekannt -> c WEISS ICH!)
    else if (c && b && !a) {
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
    }
    // Fall 3: Kathete b gesucht (c und a bekannt -> c WEISS ICH!)
    else if (c && a && !b) {
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
    }
    // Fall 4: Alle 3 bekannt -> Dreiecksart prüfen
    else if (a && b && c) {
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
        steps: ['Bitte gib entweder 2 Seiten ein (um die 3. mit Rechenweg auszurechnen) oder alle 3 Seiten (um die Art des Dreiecks zu prüfen)!']
      });
    }
  };

  const currentStation = mathChapters[selectedStationIndex];

  // Score der Klassenarbeit
  let examScore = 0;
  if (examSubmitted) {
    examQuestions.forEach(q => {
      if (examAnswers[q.id] === q.correctAnswer) examScore++;
    });
  }

  return (
    <div>
      {/* Header */}
      <header className="app-header">
        <div className="header-inner">
          <div className="app-title">Lern-Coach: Mathe & Englisch (Klasse 9)</div>
          <nav className="tab-nav">
            <button
              className={`tab-btn ${activeTab === 'stations' ? 'active' : ''}`}
              onClick={() => setActiveTab('stations')}
            >
              🚩 Mathe Lernstationen (1 bis 5)
            </button>
            <button
              className={`tab-btn ${activeTab === 'exam' ? 'active' : ''}`}
              onClick={() => setActiveTab('exam')}
            >
              📝 Unendliche Probeklassenarbeit
            </button>
            <button
              className={`tab-btn ${activeTab === 'calc' ? 'active' : ''}`}
              onClick={() => setActiveTab('calc')}
            >
              🔢 Pythagoras-Schritt-Rechner
            </button>
            <button
              className={`tab-btn ${activeTab === 'english' ? 'active' : ''}`}
              onClick={() => setActiveTab('english')}
            >
              🇬🇧 Englisch (Freitag)
            </button>
          </nav>
        </div>
      </header>

      {/* Hauptinhalt */}
      <main className="container">
        
        {/* ===================== TAB 1: LERNSTATIONEN ===================== */}
        {activeTab === 'stations' && (
          <div>
            {/* Stations-Leiste */}
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 className="card-title">{currentStation.title}</h1>
                <button
                  className="tab-btn"
                  onClick={() => resetStationAnswers(currentStation.id)}
                  style={{ fontSize: '12px' }}
                >
                  🔄 Diese Station zurücksetzen & nochmal üben
                </button>
              </div>
              <p className="card-desc">{currentStation.description}</p>

              {/* Erklärung von Null auf */}
              <div className="theory-box">
                {currentStation.summary}
              </div>

              {/* Aufgaben */}
              <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px', marginTop: '24px' }}>
                Aufgaben zur Station (kannst du beliebig oft wiederholen):
              </h2>

              {currentStation.exercises.map((ex, exIdx) => {
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
                          if (optIdx === ex.correctIndex) {
                            btnClass += ' correct';
                          } else if (optIdx === selectedOpt) {
                            btnClass += ' incorrect';
                          }
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
                          {isCorrect ? '✓ Super, verstanden!' : '✗ Noch nicht ganz richtig.'}
                        </div>
                        <div>{ex.explanation}</div>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Weiter zur nächsten Station */}
              {selectedStationIndex < mathChapters.length - 1 && (
                <button
                  className="calc-btn"
                  onClick={() => setSelectedStationIndex(selectedStationIndex + 1)}
                  style={{ marginTop: '16px' }}
                >
                  Zur nächsten Station {selectedStationIndex + 2} weiter ➔
                </button>
              )}
            </div>
          </div>
        )}

        {/* ===================== TAB 2: PROBEKLASSENARBEIT ===================== */}
        {activeTab === 'exam' && (
          <div>
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h1 className="card-title">📝 Unendliche Probeklassenarbeit (Mathematik 9a)</h1>
                <button className="calc-btn" onClick={startNewExam}>
                  🎲 Neue Arbeit mit neuen Zahlen generieren
                </button>
              </div>
              <p className="card-desc">
                Diese Arbeit deckt genau den Stoff vom Mittwoch ab (Pythagoras, Umkehrung, Sachaufgaben wie Leiter & Schrank, Wurzel-Gesetze und Nenner rational machen).
                Jedes Mal, wenn du auf <strong>"Neue Arbeit generieren"</strong> klickst, werden völlig neue Zahlen und Aufgaben berechnet!
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
                    Ergebnis: {examScore} von {examQuestions.length} Punkten richtig!
                  </div>
                  <div style={{ fontSize: '14px', marginTop: '4px' }}>
                    {examScore === examQuestions.length && 'Perfekt! Du bist zu 100% fit für Mittwoch!'}
                    {examScore >= 6 && examScore < examQuestions.length && 'Sehr gut! Schau dir unten noch die paar rot markierten Rechenschritte an.'}
                    {examScore < 6 && 'Noch etwas wackelig. Lies dir bei den roten Aufgaben genau die Schritt-für-Schritt-Lösung durch und klicke dann auf "Neue Arbeit generieren", um es nochmal zu versuchen!'}
                  </div>
                </div>
              )}

              {/* Aufgabenliste */}
              {examQuestions.map((q, qIdx) => {
                const userAns = examAnswers[q.id];
                const isCorrect = userAns === q.correctAnswer;

                return (
                  <div key={q.id} className="exercise-box">
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                      <span>{q.title}</span>
                      <span>Kategorie: {q.category}</span>
                    </div>
                    <div className="question-text">{q.question}</div>

                    <div className="options-list">
                      {q.options.map((opt, oIdx) => {
                        let btnClass = 'option-btn';
                        if (examSubmitted) {
                          if (opt === q.correctAnswer) {
                            btnClass += ' correct';
                          } else if (opt === userAns) {
                            btnClass += ' incorrect';
                          }
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

                    {/* Nach Abgabe: Vollständige Schritt-für-Schritt Lösung */}
                    {examSubmitted && (
                      <div className={`feedback-box ${isCorrect ? 'correct' : 'incorrect'}`}>
                        <div style={{ fontWeight: 700, marginBottom: '6px' }}>
                          {isCorrect ? '✓ Richtig!' : `✗ Falsch. Richtig ist: ${q.correctAnswer}`}
                        </div>
                        <div style={{ fontWeight: 600, fontSize: '13px', marginBottom: '4px' }}>Ausführlicher Rechenweg:</div>
                        <ul style={{ paddingLeft: '20px', fontSize: '13px', lineHeight: '1.6' }}>
                          {q.steps.map((st, sIdx) => (
                            <li key={sIdx}>{st}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}

              {!examSubmitted ? (
                <button
                  className="calc-btn"
                  onClick={() => setExamSubmitted(true)}
                  style={{ width: '100%', padding: '14px', fontSize: '16px', marginTop: '12px' }}
                >
                  Klassenarbeit jetzt abgeben & Auswertung ansehen
                </button>
              ) : (
                <button
                  className="calc-btn"
                  onClick={startNewExam}
                  style={{ width: '100%', padding: '14px', fontSize: '16px', marginTop: '12px' }}
                >
                  🔄 Neue Klassenarbeit mit frischen Zahlen starten
                </button>
              )}
            </div>
          </div>
        )}

        {/* ===================== TAB 3: PYTHAGORAS RECHNER ===================== */}
        {activeTab === 'calc' && (
          <div className="card">
            <h1 className="card-title">🔢 Pythagoras-Schritt-Rechner (Auch wenn du c schon weißt!)</h1>
            <p className="card-desc">
              Gib genau <strong>zwei Seiten ein</strong> und lass die dritte frei. Der Rechner zeigt dir jeden Einzelschritt mit Formel und Wurzel an!
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
                Felder leeren
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
                <ul style={{ paddingLeft: '20px', lineHeight: '1.8', fontSize: '14px', color: 'var(--text-main)' }}>
                  {calcResult.steps.map((st, idx) => (
                    <li key={idx}><strong>{st}</strong></li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* ===================== TAB 4: ENGLISCH ===================== */}
        {activeTab === 'english' && (
          <div className="card">
            <h1 className="card-title">🇬🇧 Englisch – Grammatik & Zeitformen (Freitag)</h1>
            <p className="card-desc">Die wichtigsten Regeln verständlich auf den Punkt gebracht.</p>

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
                          onClick={() => setStationAnswers(prev => ({ ...prev, [ex.id]: oIdx }))}
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
