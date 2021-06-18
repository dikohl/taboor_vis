import React, {useState} from 'react';
import styles from '../../styles/Home.module.css'
import Layout from '../../components/layout'

export default function Setup() {
  return (    
    <Layout>
      <div className={styles.main}>
        <h1>Taboor - Installation</h1>
        <div>
          <button onClick={() => window.location.href='/setup'}>English</button>
          <button onClick={() => window.location.href='/de/setup'}>Deutsch</button>
        </div>
        <div>
          <div>
            <h3>Chrome:</h3>
            <ol>
              <li><a href='/taboor.zip' download>Klicke <u>hier</u> um die Extension herunter zu laden</a></li>
              <li>Gehe zu "chrome://extensions" in deinem Browser</li>
              <li>Aktiviere den "Entwicklermodus" oben rechts</li>
              <li>Ziehe die zip Datei in den Browser</li>
              <li>Öffne einen neuen Tab und gehe auf irgendeine Website</li>
              <li>Jetzt sollte unten links ein grauer Knopf angezeigt werden</li>
              <li>Wenn sich die Sidebar nicht öffnet wenn du den Knopf klickst, starte bitte deinen Browser neu ODER:</li>
              <ol>
                <li>Geher wieder zu "chrome://extensions"</li>
                <li>Lade die Extension neu in dem du den runden Pfeil unten rechts bei der Extension klickst</li>
                <li>Gehe wieder auf die Webpage von vorhin</li>
                <li>Lade die Webpage neu (F5)</li>
              </ol>
            </ol>
          </div>
          <div>
            <h3>Edge:</h3>
            <ol>
              <li><a href='/taboor.zip' download>Klicke <u>hier</u> um die Extension herunter zu laden</a></li>
              <li>Gehe zu "edge://extensions" in deinem Browser</li>
              <li>Aktiviere den "Entwicklermodus" oben rechts</li>
              <li>Ziehe die zip Datei in den Browser</li>
              <li>Öffne einen neuen Tab und gehe auf irgendeine Website</li>
              <li>Jetzt sollte unten links ein grauer Knopf angezeigt werden</li>
              <li>Wenn sich die Sidebar nicht öffnet wenn du den Knopf klickst, starte bitte deinen Browser neu ODER:</li>
              <ol>
                <li>Geher wieder zu "edge://extensions"</li>
                <li>Lade die Extension neu in dem du "Neu laden" unter der Extension klickst</li>
                <li>Gehe wieder auf die Webpage von vorhin</li>
                <li>Lade die Webpage neu (F5)</li>
              </ol>
            </ol>
          </div>
          <div>
            <h3>Firefox:</h3>
            <ol>
              <li>Gehe auf <u><a href="https://addons.mozilla.org/en-US/firefox/addon/taboor/">https://addons.mozilla.org/en-US/firefox/addon/taboor/</a></u></li>
              <li>Klick "Zu Firefox hinzufügen"</li>
              <li>Öffne einen neuen Tab und gehe auf irgendeine Website</li>
              <li>Jetzt sollte unten links ein grauer Knopf angezeigt werden</li>
              <li>Wenn sich die Sidebar nicht öffnet wenn du den Knopf klickst, starte bitte deinen Browser neu</li>
            </ol>
          </div>
        </div>
      </div>
    </Layout>
  )
}
