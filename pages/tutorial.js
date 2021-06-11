import React, {useState} from 'react';
import styles from '../styles/Home.module.css'

export default function Tutorial() {
  const [language, setLanguage] = useState('en')

  return (
    <div className={styles.container}>
      <h1>Taboor - Szenarios</h1>
      <div>
        <button onClick={() => setLanguage('en')}>Englisch</button>
        <button onClick={() => setLanguage('de')}>Deutsch</button>
      </div>
      <div>
        <h3>Scenario 1: Switching between tasks</h3>
        <ol>
          <li>Color all open pages belonging to the task.</li>
          <li>Click the colored square at the top.</li>
          <li>Click "Close".</li>
          <li>Work on new task.</li>
          <li>Color pages of new task (or close them).</li>
          <li>Click the colored square at the top of the old task.</li>
          <li>Click Open or Open Window. (or if you want to close all the other open pages click "Focus")</li>
        </ol>
      </div>
      <div>
        <h3>Scenario 2: Find related pages and mark them</h3>
        <ol>
          <li>Single Click a page you want to create a group for.</li>
          <li>Move the Slider and see which setting shows the most fitting pages.</li>
          <li>Remove individual pages from the highlights by clicking the bin icon.</li>
          <li>Mark all pages in the recent highlights using the marking tool in the top left of the highlights.</li>
          <li>Click "Back".</li>
        </ol>
      </div>
    </div>
  )
}
