import React, {useState} from 'react';
import styles from '../styles/Home.module.css'
import Layout from '../components/layout'

export default function Tutorial() {
  const [language, setLanguage] = useState('en')

  return (
    <Layout>
      <div className={styles.main}>
        <h1>Taboor - Scenarios</h1>
        <img src="/taboor_scenarios.jpg" width="80%" />
      </div>
    </Layout>
  )
}
