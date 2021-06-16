import React, {useState} from 'react';
import styles from '../styles/Home.module.css'
import Layout from '../components/layout'

export default function CheatSheet() {

  return (    
    <Layout>
      <div className={styles.main}>
        <h1>Taboor - Study</h1>
        <div className={styles.center}>
          <div>
            <p><b>What is taboor:</b></p>
            <p>
              Taboor is meant to help you organize your tabs simply from a sidebar that you can easily hide / show by clicking the grey button in the bottom left. 
            </p>
            <p>
              Through out the work day, many different task can happen at the same time and every task may need a few tabs in a browser. To not lose information that may be needed later in the day or in the next few days, many people just keep tabs open. This has the effect, that it becomes harder to keep an overview over all the open web pages and to what task they belong to.
            </p>
            <p>
              Taboor tries to provide you with functionality to make organizing tabs and re-finding tabs easier. This way closing a tabs comes with a smaller risk of losing information and less cognitive energy needed to resume a task and re-find relevant web pages to complete it.
            </p>
          </div>
          <div>
            <p><b>Study Design:</b></p>
            <p>
              This study takes two weeks.
            </p>
            <p><u>Week 1:</u> Extension installed, but NOT used.</p>
            <p><u>Week 2:</u> Enable Extension, try to use the extension in your daily workflow.</p>
            <p>
              At the end of very week you are asked to download the .json file from the settings page and submit it to the researchers. This file contains anonymized data on your browsing behaviour and how you used the extension.
            </p>
            <p>
              After the full two weeks there will be a short (15 min) interview where you are asked to give feedback and your thoughts on the extension.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
