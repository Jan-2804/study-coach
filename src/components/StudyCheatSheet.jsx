import React from 'react';

export default function StudyCheatSheet() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="card cheat-sheet-container">
      {/* Druck-Button (wird beim Drucken ausgeblendet) */}
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <h1 className="card-title" style={{ fontSize: '22px' }}>📄 Klassenarbeits-Lernzettel (Spickzettel)</h1>
          <p className="card-desc" style={{ marginBottom: 0 }}>
            Alle wichtigen Formeln, Rechenwege, Skizzen und Signalwörter auf einer kompakten Seite zum Ausdrucken oder Offline-Lernen.
          </p>
        </div>
        <button
          onClick={handlePrint}
          style={{
            backgroundColor: '#2563eb',
            color: '#ffffff',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '24px',
            fontWeight: 800,
            fontSize: '14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          🖨️ Lernzettel drucken / als PDF speichern
        </button>
      </div>

      {/* Druckbereich */}
      <div className="printable-sheet" style={{
        backgroundColor: '#ffffff',
        color: '#0f172a',
        padding: '24px',
        borderRadius: '8px',
        border: '1px solid #cbd5e1',
        fontSize: '13px',
        lineHeight: '1.5'
      }}>
        {/* Titelblatt-Kopf */}
        <div style={{ borderBottom: '3px solid #0f172a', paddingBottom: '10px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 900, margin: 0 }}>📐 MATHEMATIK & ENGLISCH 9a: LERNZETTEL</h2>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>Vorbereitung Klassenarbeiten (Mittwoch: Mathe / Freitag: Englisch)</div>
          </div>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>Name: ______________________</div>
        </div>

        {/* 2-Spalten-Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

          {/* SPALTE 1: PYTHAGORAS */}
          <div>
            <div style={{ backgroundColor: '#f1f5f9', borderLeft: '4px solid #2563eb', padding: '8px 12px', fontWeight: 800, fontSize: '14px', marginBottom: '8px' }}>
              1. SATZ DES PYTHAGORAS
            </div>

            <div style={{ marginBottom: '12px' }}>
              <strong>Bedingung:</strong> Gilt <u>NUR</u> in rechtwinkligen Dreiecken (Winkel = 90°)!<br />
              • <strong>Hypotenuse (c):</strong> Die <em>längste Seite</em>, liegt genau gegenüber von 90°.<br />
              • <strong>Katheten (a & b):</strong> Die beiden kürzeren Seiten am 90°-Winkel.
            </div>

            <div style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '6px', padding: '10px', marginBottom: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '16px', fontWeight: 900, color: '#1e40af' }}>a² + b² = c²</div>
              <div style={{ fontSize: '11px', color: '#1e3a8a', marginTop: '2px' }}>Kathete² + Kathete² = Hypotenuse²</div>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <strong>Die zwei Rechenfälle:</strong><br />
              <strong>Fall 1 (c gesucht):</strong> c = √(a² + b²)  ➔ <em>PLUS unter der Wurzel</em><br />
              <strong>Fall 2 (Kathete gesucht):</strong> a = √(c² - b²)  ➔ <em>MINUS unter der Wurzel (immer Hypotenuse² minus gegebene Kathete²!)</em>
            </div>

            <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '8px', marginBottom: '12px' }}>
              <strong>Dreiecksart rechnerisch prüfen:</strong><br />
              • a² + b² = c² ➔ <strong>Rechtwinklig (90°)</strong><br />
              • a² + b² &gt; c² ➔ <strong>Spitzwinklig (&lt; 90°)</strong><br />
              • a² + b² &lt; c² ➔ <strong>Stumpfwinklig (&gt; 90°)</strong>
            </div>

            <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px', padding: '8px' }}>
              <strong>Wichtige Sachaufgaben aus dem Buch:</strong><br />
              • <strong>Leiter an Wand (S. 69, 1):</strong> Leiter = Hypotenuse c! Wandhöhe h = √(c² - Bodenabstand²)<br />
              • <strong>Schrank kippen (S. 70, 11):</strong> Diagonale d = √(Höhe² + Breite²). Wenn d &gt; Deckenhöhe ➔ Schrank stößt an!
            </div>
          </div>

          {/* SPALTE 2: WURZELN & ENGLISCH */}
          <div>
            <div style={{ backgroundColor: '#f1f5f9', borderLeft: '4px solid #16a34a', padding: '8px 12px', fontWeight: 800, fontSize: '14px', marginBottom: '8px' }}>
              2. RECHNEN MIT WURZELN
            </div>

            <div style={{ marginBottom: '12px' }}>
              <strong>Grundregel:</strong> Wurzeln wie Variablen (x) addieren/subtrahieren!<br />
              • 4√2 + 7√2 = (4 + 7)√2 = <strong>11√2</strong><br />
              • <em>Achtung:</em> √9 + √16 ist <u>NICHT</u> √25! (3 + 4 = 7, nicht 5!)
            </div>

            <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px', padding: '8px', marginBottom: '12px' }}>
              <strong>Teilweises Wurzelziehen (Zerlegen):</strong><br />
              Zerlege in eine Quadratzahl (4, 9, 16, 25, 36, 49, 64, 81, 100):<br />
              • √20 = √(4 · 5) = <strong>2√5</strong><br />
              • √50 = √(25 · 2) = <strong>5√2</strong><br />
              • √72 = √(36 · 2) = <strong>6√2</strong><br />
              • Heftaufgabe: √5 + √20 = √5 + 2√5 = <strong>3√5</strong>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <strong>Nenner rational machen:</strong> Keine Wurzel unten im Bruch!<br />
              • 1 / √2 = (1 · √2) / (√2 · √2) = <strong>√2 / 2</strong><br />
              • 21 / √7 = (21 · √7) / 7 = <strong>3√7</strong>
            </div>

            <div style={{ backgroundColor: '#f1f5f9', borderLeft: '4px solid #ea580c', padding: '8px 12px', fontWeight: 800, fontSize: '14px', marginBottom: '8px', marginTop: '14px' }}>
              3. ENGLISCH (FREITAG)
            </div>

            <div style={{ fontSize: '12px' }}>
              • <strong>Simple Past:</strong> Abgeschlossen! Signal: <em>yesterday, last week, ago, in 2020</em> (Verb + -ed / 2. Form).<br />
              • <strong>Present Perfect:</strong> Verbindung zur Gegenwart! Signal: <em>just, already, never, ever, yet, since, for</em> (have/has + 3. Form).<br />
              • <strong>If-Sätze (Conditionals):</strong><br />
              - Typ 1 (real): If + Simple Present, will-future<br />
              - Typ 2 (theoretisch): If + Simple Past, would + Infinitiv<br />
              - Typ 3 (zu spät): If + Past Perfect, would have + 3. Form
            </div>
          </div>

        </div>

        {/* Fußzeile */}
        <div style={{ borderTop: '1px solid #cbd5e1', marginTop: '16px', paddingTop: '8px', textAlign: 'center', fontSize: '11px', color: '#64748b' }}>
          Klassenarbeits-Coach 9a • study-coach
        </div>
      </div>
    </div>
  );
}
