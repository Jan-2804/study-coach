import React, { useState } from 'react';
import { mathChapters, englishChapters } from './data/curriculum';
import './index.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('math'); // 'math' | 'english' | 'calc'
  const [selectedChapterId, setSelectedChapterId] = useState(mathChapters[0].id);
  const [userAnswers, setUserAnswers] = useState({});

  // Für interaktiven Pythagoras-Rechner
  const [sideA, setSideA] = useState('');
  const [sideB, setSideB] = useState('');
  const [sideC, setSideC] = useState('');
  const [calcResult, setCalcResult] = useState(null);

  const currentChapters = activeTab === 'math' ? mathChapters : englishChapters;
  const currentChapter = currentChapters.find(c => c.id === selectedChapterId) || currentChapters[0];

  const handleSelectOption = (exerciseId, optionIndex) => {
    setUserAnswers(prev => ({
      ...prev,
      [exerciseId]: optionIndex
    }));
  };

  const calculatePythagoras = () => {
    const a = parseFloat(sideA);
    const b = parseFloat(sideB);
    const c = parseFloat(sideC);

    if (a && b && !c) {
      // Hypotenuse berechnen: c = sqrt(a² + b²)
      const res = Math.sqrt(a * a + b * b);
      setCalcResult({
        text: `Gesucht: Hypotenuse c`,
        formula: `c = √(${a}² + ${b}²) = √(${a*a} + ${b*b}) = √(${a*a + b*b})`,
        value: `c ≈ ${res.toFixed(2)} cm (exakt: √${a*a + b*b})`
      });
    } else if (c && a && !b) {
      if (a >= c) {
        setCalcResult({ text: 'Fehler: Kathete a kann nicht größer oder gleich der Hypotenuse c sein!' });
        return;
      }
      const res = Math.sqrt(c * c - a * a);
      setCalcResult({
        text: `Gesucht: Kathete b`,
        formula: `b = √(${c}² - ${a}²) = √(${c*c} - ${a*a}) = √(${c*c - a*a})`,
        value: `b ≈ ${res.toFixed(2)} cm (exakt: √${c*c - a*a})`
      });
    } else if (c && b && !a) {
      if (b >= c) {
        setCalcResult({ text: 'Fehler: Kathete b kann nicht größer oder gleich der Hypotenuse c sein!' });
        return;
      }
      const res = Math.sqrt(c * c - b * b);
      setCalcResult({
        text: `Gesucht: Kathete a`,
        formula: `a = √(${c}² - ${b}²) = √(${c*c} - ${b*b}) = √(${c*c - b*b})`,
        value: `a ≈ ${res.toFixed(2)} cm (exakt: √${c*c - b*b})`
      });
    } else if (a && b && c) {
      // Prüfen, ob rechtwinklig
      const left = a * a + b * b;
      const right = c * c;
      if (Math.abs(left - right) < 0.001) {
        setCalcResult({
          text: `Prüfung: Ist das Dreieck rechtwinklig?`,
          formula: `${a}² + ${b}² = ${left}  |  ${c}² = ${right}`,
          value: `JA! Das Dreieck ist rechtwinklig (90° bei C), weil a² + b² = c².`
        });
      } else if (left > right) {
        setCalcResult({
          text: `Prüfung: Dreiecksform`,
          formula: `${a}² + ${b}² = ${left} > ${c}² = ${right}`,
          value: `SPITZWINKLIG (alle Winkel < 90°), da a² + b² > c².`
        });
      } else {
        setCalcResult({
          text: `Prüfung: Dreiecksform`,
          formula: `${a}² + ${b}² = ${left} < ${c}² = ${right}`,
          value: `STUMPFWINKLIG (ein Winkel > 90°), da a² + b² < c².`
        });
      }
    } else {
      setCalcResult({ text: 'Bitte trage mindestens 2 Seiten ein, um die dritte zu berechnen oder alle 3, um die Winkelart zu prüfen!' });
    }
  };

  return (
    <div>
      {/* Header */}
      <header className="app-header">
        <div className="header-inner">
          <div className="app-title">Klassenarbeits-Coach (9a)</div>
          <nav className="tab-nav">
            <button
              className={`tab-btn ${activeTab === 'math' ? 'active' : ''}`}
              onClick={() => { setActiveTab('math'); setSelectedChapterId(mathChapters[0].id); }}
            >
              📐 Mathe (Mittwoch)
            </button>
            <button
              className={`tab-btn ${activeTab === 'calc' ? 'active' : ''}`}
              onClick={() => setActiveTab('calc')}
            >
              🔢 Pythagoras-Schritt-Rechner
            </button>
            <button
              className={`tab-btn ${activeTab === 'english' ? 'active' : ''}`}
              onClick={() => { setActiveTab('english'); setSelectedChapterId(englishChapters[0].id); }}
            >
              🇬🇧 Englisch (Freitag)
            </button>
          </nav>
        </div>
      </header>

      {/* Hauptinhalt */}
      <main className="container">
        {activeTab === 'calc' ? (
          <div className="card">
            <h2 className="card-title">Interaktiver Pythagoras-Schritt-Rechner</h2>
            <p className="card-desc">
              Gib zwei bekannte Seiten ein (das dritte Feld frei lassen), um den genauen Rechenweg mit Wurzel anzuzeigen.
              Oder gib alle 3 Seiten ein, um zu prüfen, ob das Dreieck rechtwinklig, spitzwinklig oder stumpfwinklig ist.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Kathete a (z. B. 6):</label>
                <input
                  type="number"
                  className="form-input"
                  value={sideA}
                  onChange={e => setSideA(e.target.value)}
                  placeholder="z. B. 6"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Kathete b (z. B. 8):</label>
                <input
                  type="number"
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
                  className="form-input"
                  value={sideC}
                  onChange={e => setSideC(e.target.value)}
                  placeholder="Frei lassen zum Berechnen"
                />
              </div>
            </div>

            <button className="calc-btn" onClick={calculatePythagoras} style={{ marginTop: '8px' }}>
              Schritt-für-Schritt berechnen
            </button>

            {calcResult && (
              <div className="calc-result" style={{ marginTop: '16px' }}>
                <div style={{ fontWeight: 700, marginBottom: '4px' }}>{calcResult.text}</div>
                {calcResult.formula && <div style={{ fontFamily: 'monospace', marginBottom: '4px' }}>{calcResult.formula}</div>}
                {calcResult.value && <div>{calcResult.value}</div>}
              </div>
            )}
          </div>
        ) : (
          <div>
            {/* Themen-Auswahl */}
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '16px' }}>
              {currentChapters.map(chap => (
                <button
                  key={chap.id}
                  className={`tab-btn ${selectedChapterId === chap.id ? 'active' : ''}`}
                  onClick={() => setSelectedChapterId(chap.id)}
                  style={{ whiteSpace: 'nowrap' }}
                >
                  {chap.title}
                </button>
              ))}
            </div>

            {/* Ausgewähltes Kapitel */}
            <div className="card">
              <h1 className="card-title">{currentChapter.title}</h1>
              <p className="card-desc">{currentChapter.description}</p>

              {/* Zusammenfassung / Erklärung */}
              <div className="theory-box">
                {currentChapter.summary}
              </div>

              {/* Übungsaufgaben */}
              <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px', marginTop: '24px' }}>
                Übungsaufgaben zum Verstehen:
              </h2>

              {currentChapter.exercises.map((ex, exIdx) => {
                const selectedOpt = userAnswers[ex.id];
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
                            onClick={() => handleSelectOption(ex.id, optIdx)}
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
                          {isCorrect ? '✓ Richtig gerechnet!' : '✗ Noch nicht ganz richtig.'}
                        </div>
                        <div>{ex.explanation}</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
