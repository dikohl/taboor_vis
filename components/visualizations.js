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
/**
 * We hat som page visits that took more than 10 hours, upon further investigation very few visits had a duration of over 30 minutes.
 * We took this as an indication that a user is away from their keyboard (AFK). For the analysis we filtered page visits we considered to have happened during AFK time.
 * We also had to set a minimum visit duration of 1 second because there were **quite a few** instances where the visit duration was close to 0.
 * The goal of these boundaries are to have only real page visit times and not afk visits or visits resulting from mis-clicks.
 * 
 * The number of tabs was saved every time the user opened, closed, updated or switched a tab. 
 * This gathered data is skewed towards moment where the user was very active, to counter act this, we decided to only considered log entries that happened at least ten minutes apart to clean up the data.
 * From these ten minute intervals we calculated a daily average, median and the minimum and maximum number of tabs open.
 * **Moving window average????**
 * 
 * The number of switches was calculated from the tracking graph. Every time a used switched or updated a tab the time was logged. For the analysis we used two granularities, days and hours.
 * The dayily granularity gives insight in to the work through out the week. While the hourly granularity gives and indication on the effectiveness of our tool.
 * 
 * 
 */
export default function Visualizations(data) {
  if (data.data === null || data.data.nodes === undefined) {
    return <div style={{minHeight:"500px"}}>UPLOAD DATA</div>
  }
  let nodes = data.data.nodes.map(node => { return {id: node.id, label: node.id.toString()} })
  let nodesGraph = nodes.filter(node => node.id !== 0)
  let edges = data.data.edges.map(edge => { return {from: edge.source, to: edge.target, access: edge.access} })
  let edgesGraph = edges.filter(edge => (edge.from !== 0 && edge.to !== 0))

  let lineData = getNoOfVisits(edges);
  
  let { results: visitData, raw } = getAverageVisitDuration(nodes, edges);
  let averageVisits = visitData.map(visit => {return {x: visit.x, y: Math.round(visit.average/1000)}})
  let medianVisits = visitData.map(visit => {return {x: visit.x, y: Math.round(visit.median/1000)}})
  let scatterData = Object.values(raw).flat().map(r => {return {x: 1, y: Math.round(r/1000)}})
  
  let openTabs = getAverageTabNumber(data.data.numOpenPages);
  let averageTabs = openTabs.map(visit => {return {x: visit.x, y: visit.average}})
  let medianTabs = openTabs.map(visit => {return {x: visit.x, y: visit.median}})
  let minTabs = openTabs.map(visit => {return {x: visit.x, y: visit.min}})
  let maxTabs = openTabs.map(visit => {return {x: visit.x, y: visit.max}})

  let switchesPerDay = getDailyPageSwitches(nodes, edges);

  let switchesPerHour = getAveragePageSwitchesHourly(nodes, edges)
  let averageSwitches = switchesPerHour.map(visit => {return {x: visit.x, y: visit.average}})
  let medianSwitches = switchesPerHour.map(visit => {return {x: visit.x, y: visit.median}})
  let minSwitches = switchesPerHour.map(visit => {return {x: visit.x, y: visit.min}})
  let maxSwitches = switchesPerHour.map(visit => {return {x: visit.x, y: visit.max}})

  let markedData = getUsageByDayStash(data.data.stashUsage, true);
  let namedData = getUsageByDayStash(data.data.stashUsage, false);
  let highlightData = getUsageByDay(data.data.highlightUsage);
  let searchData = getUsageByDay(data.data.searchUsage);
  return (
    <div style={{display:"flex", flexWrap:"wrap", padding:"100px", width:"90%", minHeight:"500px"}}>
      <div style={{width:"600"}}>
        <Graph graph={{nodes: nodesGraph, edges: edgesGraph}} options={options}/>
      </div>
      {createLineChart(lineData, "Number of Visits", "Number of Pages")}
      {createScatterChart(scatterData)}
      {createLineChart(averageVisits, "Day", "Average visit duration (s)")}
      {createLineChart(medianVisits, "Day", "Median visit duration (s)")}
      {createLineChart(averageTabs, "Day", "Average Tabs")}
      {createLineChart(medianTabs, "Day", "Median Tabs")}
      {createLineChart(minTabs, "Day", "Min Tabs")}
      {createLineChart(maxTabs, "Day", "Max Tabs")}
      {createLineChart(switchesPerDay, "Day", "Switches")}
      {createLineChart(averageSwitches, "Day", "Average Switches Per Hour")}
      {createLineChart(medianSwitches, "Day", "Median Switches Per Hours")}
      {createLineChart(minSwitches, "Day", "Min Switches Per Hours")}
      {createLineChart(maxSwitches, "Day", "Max Switches Per Hours")}
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
  const visitDurations = {}
  nodeAccesses.forEach(accesses => {
    let enterDate = 0

    accesses
      .sort((a, b) => a - b)
      .forEach((date) => {
        if (enterDate === 0) {
          enterDate = date
        } else {
          const day = new Date(enterDate).getDay()
          const visit = date - enterDate
          if (day !== 6 && day !== 0 && visit < 1800000 && visit > 1000) {
            // less than 30 minutes (after 30 min without a switch we assume you're afk) and longer than 1 second (mistake)
            if (visitDurations[day]) {
              visitDurations[day].push(visit)
            } else {
              visitDurations[day] = [visit]
            }
          }
          enterDate = 0
        }
      })
    }
  )
  let day = 0;
  const dailyAverages = Object.keys(visitDurations).map((key) => {
    day++
    const sorted = visitDurations[key].sort((a, b) => a-b)
    const duration = sorted.reduce((prev, curr) => prev + curr, 0)
    length = sorted.length
    let half = Math.floor(length / 2)
    const median = length === 1 || length % 2 ? sorted[(half)] : (sorted[half] + sorted[half-1]) / 2.0
    return { x: key, average: duration / length, median, min: sorted[0], max: sorted[length-1] }
  })
  return { results: dailyAverages, raw: visitDurations }
}

function getAverageTabNumber(openTabs) { // time = date ms, id = number of tabs
  const numTabs = {}
  let lastTime = 0
  openTabs.forEach(openTab => {
    const day = new Date(openTab.time).getDay()
    // since the number of open tabs is logged everytime an action is performed in the browser we clean up the data by requiring at least 1 minute between logs. (polling rate of one minute)
    if (day !== 6 && day !== 0 && openTab.id > 0 && openTab.time - lastTime > 60000) {
      if (numTabs[day]) {
        numTabs[day].push(openTab.id)
      } else {
        numTabs[day] = [openTab.id]
      }
    }
    lastTime = openTab.time
  })

  let day = 0;
  const dailyAverages = Object.keys(numTabs).map((key) => {
    day++
    const sorted = numTabs[key].sort((a, b) => a-b)
    const duration = sorted.reduce((prev, curr) => prev + curr, 0)
    length = sorted.length
    let half = Math.floor(length / 2)
    const median = length === 1 || length % 2 ? sorted[(half)] : (sorted[half] + sorted[half-1]) / 2.0
    const average = Math.round((duration / length) * 10) / 10
    return { x: key, average, median, min: sorted[0], max: sorted[length-1] }
  })
  return dailyAverages
}

function getDailyPageSwitches(nodes, edges) {
  let switches = edges
                      .filter(edge => edge.to !== 0 && edge.from !== 0)
                      .map(edge => edge.access)
                      .flat()
                      .sort((a,b) => a-b)
  const switchesPerDay = {}
  switches.forEach(change => {
    const day = new Date(change).getDay()
    if (day !== 6 && day !== 0) {
      if (switchesPerDay[day]) {
        switchesPerDay[day]++
      } else {
        switchesPerDay[day] = 1
      }
    }
  })

  let day = 0
  const dailyAverages = Object.keys(switchesPerDay).map((key) => {
    day++
    return { x: key, y: switchesPerDay[key]}
  })
  return dailyAverages
}

function getAveragePageSwitchesHourly(nodes, edges) {
  let switches = edges
                      .filter(edge => edge.to !== 0 && edge.from !== 0)
                      .map(edge => edge.access)
                      .flat()
                      .sort((a,b) => a-b)
  const switchesPerDay = {}
  switches.forEach(change => {
    const day = new Date(change).getDay()
    const hour = new Date(change).getHours()
    if (day !== 6 && day !== 0) {
      if (switchesPerDay[day] && switchesPerDay[day][hour]) {
        switchesPerDay[day][hour]++
      } else {
        if (!switchesPerDay[day]) {
          switchesPerDay[day] = {}
        }
        switchesPerDay[day][hour] = 1
      }
    }

  })

  let day = 0
  const dailyAverages = Object.keys(switchesPerDay).map((key) => {
    day++
    const sorted = Object.values(switchesPerDay[key]).sort((a, b) => a-b)
    const duration = sorted.reduce((prev, curr) => prev + curr, 0)
    let length = sorted.length
    let half = Math.floor(length / 2)
    const median = length === 1 || length % 2 ? sorted[(half)] : (sorted[half] + sorted[half-1]) / 2.0
    const average = Math.round((duration / length) * 10) / 10
    return { x: key, average, median, min: sorted[0], max: sorted[length-1] }
  })
  return dailyAverages
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

function createScatterChart(data) {
  return (
    <div style={{width:"600px"}}>
      <VictoryChart>
        <VictoryScatter
          style={{ data: { fill: "#c43a31" } }}
          size={7}
          data={data}
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
