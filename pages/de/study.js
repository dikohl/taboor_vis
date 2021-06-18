import React from 'react';
import styles from '../../styles/Home.module.css'
import Layout from '../../components/layout'

export default function CheatSheet() {

  return (    
    <Layout>
      <div className={styles.main}>
        <h1>Taboor - Studie</h1>
        <div>
          <button onClick={() => window.location.href='/study'}>English</button>
          <button onClick={() => window.location.href='/de/study'}>Deutsch</button>
        </div>
        <div className={styles.center}>
          <div>
            <p><b>Was ist taboor:</b></p>
            <p>
              Taboor soll dir helfen deine Tabs einfacher organisieren zu können durch eine Sidebar in deinem Browser. 
            </p>
            <p>
              Multitasking ist heute ganz normal im Arbeitsalltag, verschiedene Aufgaben benötigen aber viele verschiedene Resourcen. Um keine Resourcen aus dem Internet zu verlieren, sammeln viele Menschen viele an Tabs an, die sie nie wieder schliessen. Dadurch wird es immer schwerer und aufwändiger eine Übersicht zu behalten.
            </p>
            <p>
              Taboor soll Funktionen bieten, die helfen Resourcen einfach zu organisieren und sie wieder zu finden dadurch soll das Risiko minimiert werden, Informationen zu verlieren.
            </p>
          </div>
          <div>
            <p><b>Studien Design:</b></p>
            <p>
              Die Studie dauert zwei Wochen.
            </p>
            <p><u>Woche 1:</u> Extension ist installiert, aber NICHT benutzt.</p>
            <p><u>Woche 2:</u> Extension ist aktiviert, du versuchts die Extension in deine normalen Arbeitsabläufe zu integrieren.</p>
            <p>
              Am Ende jeder Woche, bitten wir dich darum, eine log Datei auf der Settings-Seite herunter zu laden und uns zu schicken. Diese Datei enthält zensierte Daten über dein Browsingverhalten und wie du die Funktionalitäten der Extension benutzt hast (mehr dazu unten).
            </p>
            <p>
              Am Ende der Studie gibt es noch ein kurzes (15 min) Gespräch in dem wir gerne dein Feedback und Gedanken zur Extension hören würden.
            </p>
          </div>
          <div>
            <p><b>Gesammelte Daten:</b></p>
            <p>
              <u>nodes:</u> Eine Liste von zufälligen IDs, die je für eine besuchte Website stehen. <br/>z.B. "[id], 1, 2, 3, 4".
            </p>
            <p>
              <u>edges:</u> Eine Liste aus Wechseln zwischen Websiten / Nodes und wann der Wechsel passiert ist. <br/>z.B. "[source, target, Zeit], (1, 2, 25.6.2021 12:00:01), (2, 4, 25.6.2021 12:05:33)".
            </p>
            <p>
              <u>numOpenPages:</u> Eine Liste mit Zeitpunkten und wieviele Tabs zu diesem Zeitpunkt insgesamt offen waren. <br/>z.B. "[number, Zeit], (7, 25.6.2021 13:10:01), (8, 25.6.2021 13:11:10)".
            </p>
            <p>
              <u>stashUsage:</u> Ein Liste mit Zeitpunkten und ob eine Website / Node markiert, unmarkiert oder geöffnet wurde. <br/>z.B. "[id, Farbe/Name, Zeit, typ], (7, #ffffff, 25.6.2021 13:10:01, added), (8, #000000, 25.6.2021 13:11:10, opened)".
            </p>
            <p>
              <u>highlightUsage:</u> Eine Liste mit Zeitpunkten wenn ein Highlight geöffnet wurde. <br/>z.B. "[parentId, id, Zeit], (2, 7, 25.6.2021 13:10:01), (8, 5, 25.6.2021 13:11:10)".
            </p>            
            <p>
              <u>searchUsage:</u> Eine Liste mit Zeitpunkten wann die Suche genutzt wurde. <br/>z.B. "[0, Zeit], (0, 25.6.2021 13:10:01), (0, 25.6.2021 13:11:10)".
            </p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
