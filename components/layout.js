import React from 'react';
import styles from '../styles/Home.module.css'

export default function Layout(props) {
  return <div>
            <div>
              <a href="/setup"><u>Setup</u></a>&nbsp;&nbsp;
              <a href="/tutorial"><u>Tutorial</u></a>&nbsp;&nbsp;
              <a href='/taboor_cheatsheet.pdf' download><u>Cheatsheet</u></a>&nbsp;&nbsp;
            </div>
            {props.children}
          </div>
}