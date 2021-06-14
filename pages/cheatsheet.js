import React, {useState} from 'react';
import styles from '../styles/Home.module.css'
import Layout from '../components/layout'

export default function CheatSheet() {

  return (    
    <Layout>
      <div className={styles.main}>
        <h1>Taboor - Installation</h1>
        <img src="/taboor.jpg" size="80%" />
      </div>
    </Layout>
  )
}
