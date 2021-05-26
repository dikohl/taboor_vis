import React from 'react';
import Graph from "react-graph-vis";
import { VictoryChart, VictoryLine, VictoryTheme } from 'victory';

const options = {
  layout: {
    hierarchical: false
  },
  edges: {
    color: "#000000"
  }
};

export default function Visualizations(data) {
  console.log(data.data)
  if (data.data === null || data.data.nodes === undefined) {
    return <div>UPLOAD DATA</div>
  }

  let nodes = data.data.nodes.map(node => { return {id: node.id, label: node.id.toString()} })
  let edges = data.data.edges.map(edge => { return {from: edge.source, to: edge.target} })

  let visitData = {}
  edges.filter(edge => edge.to !== 0).forEach(edge => {
    let count = visitData[edge.to] || 0
    visitData[edge.to] = count+1
  })
  let lineData = {}
  Object.keys(visitData).forEach(key => {
    let count = lineData[visitData[key]] || 0
    lineData[visitData[key]] = count+1
  })
  let xyData = Object.keys(lineData).map(key => { return {x: key, y: lineData[key]}})
  return (
    <>
      <VictoryChart
        theme={VictoryTheme.material}
      >
        <VictoryLine
          data={xyData}
        />
      </VictoryChart>
      <div>
        <Graph graph={{nodes, edges}} options={options} style={{ height: "800px" }}/>
      </div>
    </>
  )
}
