import React, {useState} from 'react';
import styles from '../styles/Home.module.css'
import Layout from '../components/layout'

export default function Setup() {
  const [language, setLanguage] = useState('en')

  return (    
    <Layout>
      <div className={styles.main}>
        <h1>Taboor - Installation</h1>
        <div>
          <button onClick={() => setLanguage('en')}>Englisch</button>
          <button onClick={() => setLanguage('de')}>Deutsch</button>
        </div>
        {language === 'en' ?
        <div>
          <div>
            <h3>Chrome:</h3>
            <ol>
              <li><a href='/taboor.zip' download>Click <u>here</u> to download the extension</a></li>
              <li>Go to "chrome://extensions" in your browser</li>
              <li>Enable "Developer mode" in the top right</li>
              <li>Drag and Drop the zip file in to the browser</li>
              <li>Open a new tab and go to a webpage of your choice</li>
              <li>There should now be a grey button on the bottom left of the screen</li>
              <li>If the sidebar does not open when you click the button:</li>
              <ol>
                <li>Go back to "edge://extensions"</li>
                <li>Reload the extension by clicking the arrow going in a circle on the bottom left of the extensions</li>
                <li>Go back to the webpage</li>
                <li>Refresh the webpage (F5)</li>
              </ol>
            </ol>
          </div>
          <div>
            <h3>Edge:</h3>
            <ol>
              <li><a href='/taboor.zip' download>Click <u>here</u> to download the extension</a></li>
              <li>Go to "edge://extensions" in your browser</li>
              <li>Enable "Developer mode" in the bottom left</li>
              <li>Drag and Drop the downloaded zip file in to the browser</li>
              <li>Open a new tab and go to a webpage of your choice</li>
              <li>There should now be a grey button on the bottom left of the screen</li>
              <li>If the sidebar does not open when you click the button:</li>
              <ol>
                <li>Go back to "edge://extensions"</li>
                <li>Reload the extension by clicking the arrow going in a circle on the bottom left of the extensions</li>
                <li>Go back to the webpage</li>
                <li>Refresh the webpage (F5)</li>
              </ol>
            </ol>
          </div>
          <div>
            <h3>Firefox:</h3>
            <ol>
              <li>Go to <u><a href="https://addons.mozilla.org/en-US/firefox/addon/taboor/">https://addons.mozilla.org/en-US/firefox/addon/taboor/</a></u></li>
              <li>Click "Add to Firefox"</li>
            </ol>
          </div>
        </div>
        : 
        <div>
          <div>
            <h3>Chrome:</h3>
            <ol>
              <li><a href='/taboor.zip' download>Klicke <u>hier</u> um die Erweiterung herunter zu laden.</a></li>
              <li>In deinem Browser besuche "chrome://extensions".</li>
              <li>Aktiviere den "Entwicklermodus" oben rechts auf der Seite.</li>
              <li>Ziehe die heruntergeladene Datei auf die Seite.</li>
              <li>Etwa 10 Sekunden warten bis die Extension installiert ist</li>
            </ol>
          </div>
          <div>
            <h3>Edge:</h3>
            <ol>
              <li><a href='/taboor.zip' download>Klicke <u>hier</u> um die Erweiterung herunter zu laden.</a></li>
              <li>In deinem Browser besuche  "edge://extensions"</li>
              <li>Aktiviere den "Entwicklermodus" unten links auf der Seite.</li>
              <li>Ziehe die heruntergeladene Datei auf die Seite.</li>
            </ol>
          </div>
          <div>
            <h3>Firefox:</h3>
            <ol>
              <li>Gehe auf <u><a href="https://addons.mozilla.org/en-US/firefox/addon/taboor/">https://addons.mozilla.org/en-US/firefox/addon/taboor/</a></u></li>
              <li>Klick "Zu Firefox hinzufügen"</li>
            </ol>
          </div>
        </div>
      }
      </div>
    </Layout>
  )
}
