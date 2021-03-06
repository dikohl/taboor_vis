import React, {useState} from 'react';
import styles from '../styles/Home.module.css'
import Visualizations from '../components/visualizations'
import Layout from '../components/layout'

export default function Home() {
  const [selectedFile, setSelectedFile] = useState()
  const [data, setData] = useState(null)

	const changeHandler = (event) => {
		setSelectedFile(event.target.files[0])
	};

  const handleSubmission = () => {
    var reader = new FileReader();
    reader.onload = onReaderLoad;
    reader.readAsText(selectedFile);
  }

  const onReaderLoad = (event) => {
    var obj = JSON.parse(event.target.result);    
    setData(obj)
  }

  return (
    <Layout>
      <div className={styles.main}>
        <h1>Taboor - Visualization</h1>
        <input type="file" name="file" accept=".json" onChange={changeHandler} />
        <div>
          <button onClick={handleSubmission}>Submit</button>
        </div>
        <Visualizations data={data} />
      </div>
    </Layout>
  )
}
