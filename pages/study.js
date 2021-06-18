import React from 'react';
import styles from '../styles/Home.module.css'
import Layout from '../components/layout'

export default function CheatSheet() {

  return (    
    <Layout>
      <div className={styles.main}>
        <h1>Taboor - Study</h1>
        <div>
          <button onClick={() => window.location.href='/study'}>English</button>
          <button onClick={() => window.location.href='/de/study'}>Deutsch</button>
        </div>
        <div className={styles.center}>
          <div>
            <p><b>What is taboor:</b></p>
            <p>
              Taboor is meant to help you organize your tabs simply via a sidebar in your browser. 
            </p>
            <p>
              Through out the work day, many different tasks can happen at the same time and for every task you may need to visit multiple sites to complete it. Often people just keep tabs from many different tasks open for later use and to not lose any information. This makes it harder to keep an overview and requires a lot of energy to manage.
            </p>
            <p>
              Taboor tries to provide you with functionality to make organizing and re-finding tabs easier as well as to help you minimize the risk of you losing information. 
            </p>
          </div>
          <div>
            <p><b>Study Design:</b></p>
            <p>
              This study takes two weeks.
            </p>
            <p><u>Week 1:</u> Extension installed, but NOT used.</p>
            <p><u>Week 2:</u> Extension enabled, try to use the extension in your daily workflow.</p>
            <p>
              At the end of every week you are asked to download a log file from the settings page and submit it to the researchers. This file contains anonymized usage data on your browsing behaviour and how you used the extension (more below).
            </p>
            <p>
              After the full two weeks there will be a short (15 min) interview where you are asked to give feedback and your thoughts on the extension.
            </p>
          </div>
          <div>
            <p><b>Usage Log Data:</b></p>
            <p>
              <u>nodes:</u> A list of random ids representing all the visited pages <br/>i.e. "[id], 1, 2, 3, 4".
            </p>
            <p>
              <u>edges:</u> A list of switches between visited pages / nodes (source and target) and when they happened <br/>i.e. "[source, target, time], (1, 2, 25.6.2021 12:00:01), (2, 4, 25.6.2021 12:05:33)".
            </p>
            <p>
              <u>numOpenPages:</u> A list of how many tabs were open after a tab got closed or opened <br/>i.e. "[number, time], (7, 25.6.2021 13:10:01), (8, 25.6.2021 13:11:10)".
            </p>
            <p>
              <u>stashUsage:</u> A list of when a marked page was added, removed or opened <br/>i.e. "[id, color/name, time, type], (7, #ffffff, 25.6.2021 13:10:01, added), (8, #000000, 25.6.2021 13:11:10, opened)".
            </p>
            <p>
              <u>highlightUsage:</u> A list of whenever highlight was opened (with it's related parent page) <br/>i.e. "[parentId, id, time], (2, 7, 25.6.2021 13:10:01), (8, 5, 25.6.2021 13:11:10)".
            </p>            
            <p>
              <u>searchUsage:</u> A list of when the search was used <br/>i.e. "[0, time], (0, 25.6.2021 13:10:01), (0, 25.6.2021 13:11:10)".
            </p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
