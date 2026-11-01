import React, { useState } from 'react';
import UnoGame from './games/UnoGame';
import KniffelGame from './games/KniffelGame';
import AmongUsGame from './games/AmongUsGame';
import BloonsGame from './games/BloonsGame';

export default function GameHub({ onGainXp }) {
  const [selectedGame, setSelectedGame] = useState(null); // null | 'uno' | 'kniffel' | 'amongus' | 'bloons'

  const games = [
    {
      id: 'uno',
      title: '🎴 UNO: Show \'Em No Mercy (Steam-Edition)',
      desc: 'Spiele echtes 4-Spieler-UNO gegen die Bots Vex, Peril und Angst! Lege nach Farbe oder gleichem mathematischen Wert.',
      badge: '4 Spieler gegen Bots',
      color: '#dc2626'
    },
    {
      id: 'kniffel',
      title: '🎲 KNIFFEL: Yahtzee (Steam-Look)',
      desc: 'Authentischer grüner Filz-Würfelteller, 5 Würfel, 13 Runden und echte Punktetabelle gegen Computerspieler 1 mit Mathe-Boni!',
      badge: 'Gegen Computer-KI',
      color: '#d97706'
    },
    {
      id: 'amongus',
      title: '🚀 AMONG US: Math Emergency',
      desc: 'Erfülle Reaktor-, Kabel- und O2-Tasks mit Mathe-Formeln und entlarve im Emergency Meeting den Bot, der bei seiner Rechnung lügt!',
      badge: 'Crewmates vs. Impostor',
      color: '#0284c7'
    },
    {
      id: 'bloons',
      title: '🎈 BLOONS TOWER DEFENSE: Math Defender',
      desc: 'Platziere Pfeil-Affen und Wurzel-Kanonen entlang des Pfades. Löse Mathe-Aufgaben, um Turm-Gold zu scheffeln!',
      badge: 'Tower Defense',
      color: '#16a34a'
    }
  ];

  return (
    <div>
      {selectedGame ? (
        <div>
          <button
            className="tab-btn"
            onClick={() => setSelectedGame(null)}
            style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            ⬅️ Zurück zur Spiele-Auswahl
          </button>

          {selectedGame === 'uno' && <UnoGame onGainXp={onGainXp} />}
          {selectedGame === 'kniffel' && <KniffelGame onGainXp={onGainXp} />}
          {selectedGame === 'amongus' && <AmongUsGame onGainXp={onGainXp} />}
          {selectedGame === 'bloons' && <BloonsGame onGainXp={onGainXp} />}
        </div>
      ) : (
        <div>
          <div style={{ marginBottom: '20px' }}>
            <h1 className="card-title" style={{ fontSize: '24px' }}>🎮 Mathe-Spielehalle (Kultspiele gegen Bots)</h1>
            <p className="card-desc">
              Alle Spiele sind voll funktionsfähig, unendlich oft spielbar und basieren auf den echten Vorbildern.
              Jede gewonnene Runde bringt massive XP für deine Klassenarbeits-Vorbereitung!
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {games.map(g => (
              <div
                key={g.id}
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderTop: `6px solid ${g.color}`,
                  cursor: 'pointer',
                  transition: 'transform 0.15s ease'
                }}
                onClick={() => setSelectedGame(g.id)}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, backgroundColor: '#f1f5f9', padding: '4px 8px', borderRadius: '4px' }}>
                      {g.badge}
                    </span>
                  </div>
                  <h2 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '8px', color: '#0f172a' }}>{g.title}</h2>
                  <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.5' }}>{g.desc}</p>
                </div>

                <button
                  className="calc-btn"
                  style={{ marginTop: '16px', backgroundColor: g.color }}
                  onClick={() => setSelectedGame(g.id)}
                >
                  Jetzt spielen ➔
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
