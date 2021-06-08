import React from 'react';
import Graph from "react-graph-vis";
import { VictoryChart, VictoryLine, VictoryAxis, VictoryScatter, VictoryBoxPlot } from 'victory';

const options = {
  layout: {
    hierarchical: false
  },
  edges: {
    color: "#000000"
  },
  height: "600px"
};

export default function Visualizations(data) {
  if (data.data === null || data.data.nodes === undefined) {
    return <div style={{minHeight:"500px"}}>UPLOAD DATA</div>
  }

  let nodes = data.data.nodes.map(node => { return {id: node.id, label: node.id.toString()} })
  let edges = data.data.edges.map(edge => { return {from: edge.source, to: edge.target, access: edge.access} })

  let lineData = getNoOfVisits(edges);
  let boxData = getAverageVisitDuration(nodes, edges);
  let markedData = getUsageByDayStash(data.data.stashUsage, true);
  let namedData = getUsageByDayStash(data.data.stashUsage, false);
  let highlightData = getUsageByDay(data.data.highlightUsage);
  let searchData = getUsageByDay(data.data.searchUsage);
  return (
    <div style={{display:"flex", flexWrap:"wrap", padding:"100px", width:"90%", minHeight:"500px"}}>
      <div style={{width:"600"}}>
        <Graph graph={{nodes, edges}} options={options}/>
      </div>
      {createLineChart(lineData, "Number of Visits", "Number of Pages")}
      {createBoxChart(boxData, "Page Visit Durations (sec)")}
      {createFeatureUsage(markedData, "Marked Groups used")}
      {createFeatureUsage(namedData, "Named Groups used")}
      {createFeatureUsage(highlightData, "Highlight opened")}
      {createFeatureUsage(searchData, "Search used")}
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
  let xyData = Object.keys(lineData).map(key => { return { x: key, y: lineData[key] }; });
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

function getUsageByDayStash(usageData, colors) {
  const data = usageData.filter(use => colors ? use['name'].startsWith('#') : !use['name'].startsWith('#'))
  return getUsageByDay(data)
}

function getUsageByDay(usageData) {
  let data = usageData.map(groupday).reduce((prev, curr) => { 
    Object.keys(curr).forEach((key) => prev[key] = (prev[key] || 0) + 1) 
    return prev}, {}
  )
  const minDay = Object.keys(data).reduce((prev, curr) => curr < prev ? curr : prev, Number.MAX_VALUE)
  data = Object.keys(data).map((key) => {return{x: key-(minDay-1), y: data[key]}})
  return data
}

function groupday(value, index, array){
  let byday={};
  let d = new Date(value['time']);
  d = Math.floor(d.getTime()/(1000*60*60*24));
  byday[d]=byday[d]||[];
  byday[d].push(value);
  return byday
}

function createLineChart(data, xlabel, ylabel) {
  return (
    <div style={{width:"600px"}}>
      x: number of pages, y: number of visits
      x pages have been visited y times
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
    <div style={{width:"600px"}}>
      Average visit time per page:
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

function createFeatureUsage(data, label) {
  return (
    <div style={{width:"600px"}}>
      {label}
      <VictoryChart
        domain={{ x: [0, 5], y: [0, 20] }}
      >
        <VictoryScatter
          style={{ data: { fill: "#c43a31" } }}
          size={7}
          boxWidth={20}
          data={data}
        />
      </VictoryChart>
    </div>
  )
}
