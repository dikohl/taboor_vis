import React from 'react';
import styles from '../styles/Home.module.css'

export default function Layout(props) {
  return <div>
            <div className={styles.header}>
              <a href="/setup"><u>Setup</u></a>&nbsp;&nbsp;
              <a href="/tutorial"><u>Tutorial</u></a>&nbsp;&nbsp;
              <a href='/cheatsheet'><u>Cheatsheet</u></a>&nbsp;&nbsp;
            </div>
            {props.children}
          </div>
}