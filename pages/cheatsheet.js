import React, {useState} from 'react';
import styles from '../styles/Home.module.css'
import Layout from '../components/layout'

export default function Cheatsheet() {

  return (
    <Layout>
      <div className={styles.container}>
        <h1>Taboor - Cheat sheet</h1>
        <div>
          <a href='/taboor_cheatsheet.pdf' download>Click <u>here</u> to download the cheat sheet</a>
        </div>
      </div>
    </Layout>
  )
}
