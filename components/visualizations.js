import React from 'react';
import Graph from "react-graph-vis";
import { VictoryChart, VictoryLine, VictoryAxis, VictoryTheme, VictoryBoxPlot } from 'victory';

const options = {
  layout: {
    hierarchical: false
  },
  edges: {
    color: "#000000"
  },
  height: "400px"
};

export default function Visualizations(data) {
  if (data.data === null || data.data.nodes === undefined) {
    return <div style={{minHeight:"500px"}}>UPLOAD DATA</div>
  }

  let nodes = data.data.nodes.map(node => { return {id: node.id, label: node.id.toString()} })
  let edges = data.data.edges.map(edge => { return {from: edge.source, to: edge.target, access: edge.access} })

  let lineData = getNoOfVisits(edges);
  let boxData = getAverageVisitDuration(nodes, edges);
  return (
    <div style={{display:"flex", flowWrap:"wrap", padding:"100px", width:"90%", minHeight:"500px"}}>
      <div style={{width:"400px"}}>
        <Graph graph={{nodes, edges}} options={options}/>
      </div>
      {createLineChart(lineData, "Number of Visits", "Number of Pages")}
      {createBoxChart(boxData, "Page Visit Durations (sec)")}
    </div>
  )
}

function getNoOfVisits(edges) {
  let visitData = edges.filter(edge => edge.to !== 0).reduce(function(sums, entry){
    sums[entry.to] = (sums[entry.to] || 0) + entry.access.length;
    return sums;
  },{}); // how often was each id visited "id: visitCount"

  let lineData = Object.values(visitData).reduce(function(sums, value){
    sums[value] = (sums[value] || 0) + 1;
    return sums;
  },{}); // how often does a visit count appear "visitCount: pageCount"
  console.log(lineData)
  let xyData = Object.keys(lineData).map(key => { return { x: key, y: lineData[key] }; });
  console.log(xyData)
  return xyData;
}

function getAverageVisitDuration(nodes, edges) {
  let nodeAccesses = nodes
                .filter(node => node.id !== 0)
                .map(node => 
                  edges
                    .filter(edge => edge.to === node.id || edge.from === node.id)
                    .map(edge => edge.access).flat())
  let visitDurations = nodeAccesses.map(accesses => {
    let enterDate = 0
    const visitDurations = []
    accesses
      .map((date) => Date.parse(date))
      .sort((a, b) => a - b)
      .forEach((date) => {
        if (enterDate === 0) {
          enterDate = date
        } else {
          visitDurations.push(date - enterDate) // we could introduce a max time here, but with the null node this is not necessary
          enterDate = 0
        }
      })
      const duration = visitDurations.reduce((prev, curr) => prev + curr, 0)
      return duration / visitDurations.length
    }
  )
  return visitDurations.sort().map(dur => {return {"x": 1, "y": dur}})
}

function createLineChart(data, xlabel, ylabel) {
  return (
    <div style={{width:"400px"}}>
      Number of Pages per Number of Visits
      <VictoryChart>
        <VictoryLine
          data={data}
          labels={({ datum }) => datum.y}
        />
        <VictoryAxis
          label={xlabel}
          style={{
            axisLabel: {padding: 30},
          }}
        />
        <VictoryAxis dependentAxis
          label={ylabel}
          style={{
            axisLabel: {padding: 30},
          }}
        />
      </VictoryChart>
    </div>
  )
}

function createBoxChart(data, label) {
  return (
    <div style={{width:"400px"}}>
      Average Visit Time:
      <VictoryChart>
        <VictoryBoxPlot
          boxWidth={20}
          data={data}
        />
        <VictoryAxis dependentAxis
          label={label}
          tickFormat={(tick) => tick/1000}
          style={{
            axisLabel: {padding: 30},
          }}
        />
      </VictoryChart>
    </div>
  )
}
