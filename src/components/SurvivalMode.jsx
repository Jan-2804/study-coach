import React, { useState, useEffect } from 'react';
import { generateExam } from '../data/examGenerator';
import confetti from 'canvas-confetti';

export default function SurvivalMode({ onGainXp }) {
  const [currentStreak, setCurrentStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(() => {
    return parseInt(localStorage.getItem('study_coach_best_streak') || '0', 10);
  });
  const [question, setQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isFailed, setIsFailed] = useState(false);

  useEffect(() => {
    generateNewQuestion();
  }, []);

  const generateNewQuestion = () => {
    const qList = generateExam();
    const q = qList[Math.floor(Math.random() * qList.length)];
    setQuestion(q);
    setSelectedAnswer(null);
  };

  const handleAnswer = (option) => {
    if (selectedAnswer !== null || isFailed) return;
    setSelectedAnswer(option);

    const isCorrect = option === question.correctAnswer;
    if (isCorrect) {
      const nextStreak = currentStreak + 1;
      setCurrentStreak(nextStreak);
      const earnedXp = 10 * (nextStreak >= 5 ? 3 : (nextStreak >= 3 ? 2 : 1));
      onGainXp(earnedXp);

      if (nextStreak > bestStreak) {
        setBestStreak(nextStreak);
        localStorage.setItem('study_coach_best_streak', nextStreak.toString());
      }

      if (nextStreak % 5 === 0) {
        confetti({ particleCount: 60, spread: 60 });
      }
    } else {
      setIsFailed(true);
    }
  };

  const restartSurvival = () => {
    setCurrentStreak(0);
    setIsFailed(false);
    generateNewQuestion();
  };

  if (!question) return null;

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h2 className="card-title">🔥 Survival-Streak Modus</h2>
          <p className="card-desc" style={{ marginBottom: 0 }}>
            Wie viele Mathe-Aufgaben schaffst du hintereinander ohne einen einzigen Fehler?
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--primary)' }}>
            🔥 {currentStreak} Serie
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            🏆 Bester Rekord: {bestStreak}
          </div>
        </div>
      </div>

      {!isFailed ? (
        <div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>
            {question.title} ({question.category})
          </div>
          <div className="question-text">{question.question}</div>

          <div className="options-list">
            {question.options.map((opt, oIdx) => {
              let btnClass = 'option-btn';
              if (selectedAnswer !== null) {
                if (opt === question.correctAnswer) btnClass += ' correct';
                else if (opt === selectedAnswer) btnClass += ' incorrect';
              }
              return (
                <button
                  key={oIdx}
                  className={btnClass}
                  onClick={() => handleAnswer(opt)}
                  disabled={selectedAnswer !== null}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {selectedAnswer !== null && selectedAnswer === question.correctAnswer && (
            <div style={{ marginTop: '16px' }}>
              <div className="feedback-box correct">
                <div style={{ fontWeight: 700 }}>✓ Richtig! Streak geht weiter!</div>
              </div>
              <button className="calc-btn" onClick={generateNewQuestion} style={{ marginTop: '12px' }}>
                Nächste Frage ➔
              </button>
            </div>
          )}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '16px', backgroundColor: 'var(--error-bg)', borderRadius: '6px' }}>
          <div style={{ fontSize: '40px', marginBottom: '8px' }}>💥</div>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--error)' }}>
            Streak bei {currentStreak} gerissen!
          </h3>
          <p style={{ fontSize: '14px', marginTop: '6px', marginBottom: '12px' }}>
            Richtig war: <strong>{question.correctAnswer}</strong>
          </p>
          <div style={{ textAlign: 'left', backgroundColor: '#ffffff', padding: '12px', borderRadius: '6px', marginBottom: '16px' }}>
            <div style={{ fontWeight: 600, fontSize: '13px', marginBottom: '4px' }}>Lösungsweg:</div>
            <ul style={{ paddingLeft: '20px', fontSize: '13px', lineHeight: '1.6' }}>
              {question.steps.map((st, idx) => <li key={idx}>{st}</li>)}
            </ul>
          </div>
          <button className="calc-btn" onClick={restartSurvival}>
            Neuen Streak starten 🔄
          </button>
        </div>
      )}
    </div>
  );
}
