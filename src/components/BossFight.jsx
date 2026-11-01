import React, { useState } from 'react';
import { BOSSES } from '../data/gameEngine';
import { generateExam } from '../data/examGenerator';
import confetti from 'canvas-confetti';

export default function BossFight({ xp, onGainXp }) {
  const [selectedBoss, setSelectedBoss] = useState(BOSSES[0]);
  const [inBattle, setInBattle] = useState(false);
  const [playerHp, setPlayerHp] = useState(100);
  const [bossHp, setBossHp] = useState(100);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [battleLog, setBattleLog] = useState([]);
  const [gameOver, setGameOver] = useState(null); // 'win' | 'lose'

  const questionsPool = generateExam();

  const startFight = (boss) => {
    setSelectedBoss(boss);
    setPlayerHp(100);
    setBossHp(boss.maxHp);
    setInBattle(true);
    setGameOver(null);
    setBattleLog([`Der Kampf gegen ${boss.name} hat begonnen! Beantworte Mathe-Aufgaben, um anzugreifen!`]);
    nextTurn();
  };

  const nextTurn = () => {
    const qList = generateExam();
    const randomQ = qList[Math.floor(Math.random() * qList.length)];
    setCurrentQuestion(randomQ);
    setSelectedAnswer(null);
  };

  const handleAnswer = (option) => {
    if (selectedAnswer !== null || gameOver) return;
    setSelectedAnswer(option);

    const isCorrect = option === currentQuestion.correctAnswer;
    if (isCorrect) {
      const damage = Math.floor(Math.random() * 10) + 30; // 30 - 40 dmg
      const newBossHp = Math.max(0, bossHp - damage);
      setBossHp(newBossHp);
      onGainXp(25);

      setBattleLog(prev => [
        `⚔️ Treffer! Du hast richtig gerechnet und fügst ${selectedBoss.name} ${damage} Schaden zu! (+25 XP)`,
        ...prev
      ]);

      if (newBossHp === 0) {
        setGameOver('win');
        onGainXp(selectedBoss.rewardXp);
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        setBattleLog(prev => [
          `🏆 SIEG! Du hast ${selectedBoss.name} besiegt und ${selectedBoss.rewardXp} Bonus-XP erhalten!`,
          ...prev
        ]);
        return;
      }
    } else {
      const bossDmg = 25;
      const newPlayerHp = Math.max(0, playerHp - bossDmg);
      setPlayerHp(newPlayerHp);

      setBattleLog(prev => [
        `💥 Falsch! ${selectedBoss.name} kontert und zieht dir ${bossDmg} HP ab!`,
        ...prev
      ]);

      if (newPlayerHp === 0) {
        setGameOver('lose');
        setBattleLog(prev => [
          `💀 Du wurdest besiegt! Wiederhole die Rechenschritte und versuche es erneut.`,
          ...prev
        ]);
        return;
      }
    }
  };

  return (
    <div>
      {!inBattle ? (
        <div>
          <h2 className="card-title">⚔️ Wähle deinen Boss-Gegner</h2>
          <p className="card-desc">
            Besiege Bosse, indem du Aufgaben aus deiner 9a-Klassenarbeit im Kopf oder auf Papier löst.
            Jeder Sieg bringt massive XP und schaltet Ränge frei!
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginTop: '16px' }}>
            {BOSSES.map(boss => (
              <div key={boss.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '48px', textAlign: 'center', marginBottom: '8px' }}>{boss.avatar}</div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, textAlign: 'center' }}>{boss.name}</h3>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '12px' }}>
                    {boss.category} • {boss.maxHp} HP
                  </div>
                  <p style={{ fontSize: '14px', marginBottom: '12px' }}>{boss.description}</p>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--primary)', marginBottom: '16px' }}>
                    Belohnung: +{boss.rewardXp} XP
                  </div>
                </div>
                <button className="calc-btn" onClick={() => startFight(boss)}>
                  Herausfordern ➔
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          {/* Arena Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <button className="tab-btn" onClick={() => setInBattle(false)}>
              ⬅️ Flucht zur Boss-Auswahl
            </button>
            <div style={{ fontWeight: 700, fontSize: '16px' }}>
              Boss-Kampf: {selectedBoss.name}
            </div>
          </div>

          {/* Lebensbalken */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            {/* Spieler */}
            <div className="card" style={{ padding: '14px', marginBottom: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>
                <span>🧙‍♂️ Du (Spieler)</span>
                <span>{playerHp} / 100 HP</span>
              </div>
              <div style={{ width: '100%', height: '16px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{
                  width: `${playerHp}%`,
                  height: '100%',
                  backgroundColor: playerHp > 40 ? 'var(--success)' : 'var(--error)',
                  transition: 'width 0.3s ease'
                }} />
              </div>
            </div>

            {/* Boss */}
            <div className="card" style={{ padding: '14px', marginBottom: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>
                <span>{selectedBoss.avatar} {selectedBoss.name}</span>
                <span>{bossHp} / {selectedBoss.maxHp} HP</span>
              </div>
              <div style={{ width: '100%', height: '16px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{
                  width: `${(bossHp / selectedBoss.maxHp) * 100}%`,
                  height: '100%',
                  backgroundColor: 'var(--primary)',
                  transition: 'width 0.3s ease'
                }} />
              </div>
            </div>
          </div>

          {/* Aktuelle Kampfaufgabe */}
          {!gameOver && currentQuestion && (
            <div className="card">
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                Angriffs-Aufgabe: {currentQuestion.title}
              </div>
              <div className="question-text" style={{ fontSize: '16px', marginBottom: '14px' }}>
                {currentQuestion.question}
              </div>

              <div className="options-list">
                {currentQuestion.options.map((opt, oIdx) => {
                  let btnClass = 'option-btn';
                  if (selectedAnswer !== null) {
                    if (opt === currentQuestion.correctAnswer) btnClass += ' correct';
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

              {selectedAnswer !== null && (
                <div style={{ marginTop: '14px' }}>
                  <div className={`feedback-box ${selectedAnswer === currentQuestion.correctAnswer ? 'correct' : 'incorrect'}`}>
                    <div style={{ fontWeight: 700, marginBottom: '4px' }}>
                      {selectedAnswer === currentQuestion.correctAnswer ? '✓ Volltreffer!' : `✗ Abgewehrt! Richtig ist: ${currentQuestion.correctAnswer}`}
                    </div>
                    <ul style={{ paddingLeft: '20px', fontSize: '13px', lineHeight: '1.6' }}>
                      {currentQuestion.steps.map((st, sIdx) => <li key={sIdx}>{st}</li>)}
                    </ul>
                  </div>

                  <button className="calc-btn" onClick={nextTurn} style={{ marginTop: '12px' }}>
                    Nächste Angriffsrunde starten ➔
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Game Over Screen */}
          {gameOver && (
            <div className="card" style={{
              textAlign: 'center',
              backgroundColor: gameOver === 'win' ? 'var(--success-bg)' : 'var(--error-bg)',
              border: `2px solid ${gameOver === 'win' ? 'var(--success)' : 'var(--error)'}`
            }}>
              <div style={{ fontSize: '48px', marginBottom: '8px' }}>
                {gameOver === 'win' ? '🏆' : '💀'}
              </div>
              <h2 style={{ fontSize: '22px', fontWeight: 700, color: gameOver === 'win' ? 'var(--success)' : 'var(--error)' }}>
                {gameOver === 'win' ? `${selectedBoss.name} vernichtet!` : 'Du hast leider verloren!'}
              </h2>
              <p style={{ marginTop: '8px', marginBottom: '16px' }}>
                {gameOver === 'win'
                  ? `Hervorragend gerechnet! Du hast +${selectedBoss.rewardXp} XP erhalten.`
                  : 'Keine Sorge! Sieh dir oben im Kampf-Protokoll die Rechnungen an und starte einen Revanche-Kampf.'}
              </p>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                <button className="calc-btn" onClick={() => startFight(selectedBoss)}>
                  Nochmal kämpfen 🔄
                </button>
                <button className="tab-btn" onClick={() => setInBattle(false)}>
                  Anderen Boss wählen
                </button>
              </div>
            </div>
          )}

          {/* Kampf-Logbuch */}
          <div className="card" style={{ marginTop: '16px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '8px' }}>📜 Kampf-Protokoll</h3>
            <div style={{ maxHeight: '140px', overflowY: 'auto', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {battleLog.map((log, idx) => (
                <div key={idx} style={{ color: log.startsWith('⚔️') ? 'var(--success)' : (log.startsWith('💥') ? 'var(--error)' : 'var(--text-main)') }}>
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
