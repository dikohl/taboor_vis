import React from 'react';
import Graph from "react-graph-vis";
import { VictoryChart, VictoryLine, VictoryAxis, VictoryScatter, VictoryBoxPlot, VictoryBar } from 'victory';

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

  const browserTime = getDailyBrowserTime(edges)
  let { normTotal, raw: visits }  = getNoOfVisits(edges);
  let { openTabs, raw: rawTabs } = getAverageTabNumber(data.data.numOpenPages);

  let { results: visitData, raw: rawDuration } = getAverageVisitDuration(nodes, edges, browserTime);
  let averageVisits = visitData.map(visit => {return {x: visit.x, y: Math.round(visit.average/1000)}})
  let medianVisits = visitData.map(visit => {return {x: visit.x, y: Math.round(visit.median/1000)}})
  let failVisits = visitData.map(visit => {return {x: visit.x, y: visit.fails}})
  let scatterData = Object.values(rawDuration).flat().map(r => {return {x: 1, y: Math.round(r/1000)}})
  
  let averageTabs = openTabs.map(visit => {return {x: visit.x, y: visit.average}})
  let medianTabs = openTabs.map(visit => {return {x: visit.x, y: visit.median}})
  let minTabs = openTabs.map(visit => {return {x: visit.x, y: visit.min}})
  let maxTabs = openTabs.map(visit => {return {x: visit.x, y: visit.max}})
  let resetTabs = openTabs.map(visit => {return {x: visit.x, y: visit.resets.length}})
  console.log(rawTabs)
  let hourlyTabs = Object.keys(rawTabs[3]).map(key => {return {x: key, y: Math.round((rawTabs[3][key].reduce((prev, curr) => prev + curr, 0)/rawTabs[3][key].length) * 10) / 10 }})

  let switchesPerDay = getDailyPageSwitches(nodes, edges, browserTime);
  let normalizedSwitchesDay = switchesPerDay.map(visit => {return {x: visit.x, y: visit.normalized}})

  let { switchesPerHour, raw: rawSwitches} = getAveragePageSwitchesHourly(nodes, edges)
  let averageSwitches = switchesPerHour.map(visit => {return {x: visit.x, y: visit.average}})
  let medianSwitches = switchesPerHour.map(visit => {return {x: visit.x, y: visit.median}})
  let minSwitches = switchesPerHour.map(visit => {return {x: visit.x, y: visit.min}})
  let maxSwitches = switchesPerHour.map(visit => {return {x: visit.x, y: visit.max}})
  console.log(rawSwitches)

  let markedData = getUsageByDayStash(data.data.stashUsage, true);
  let namedData = getUsageByDayStash(data.data.stashUsage, false);
  let highlightData = getUsageByDay(data.data.highlightUsage);
  let searchData = getUsageByDay(data.data.searchUsage);
  return (
    <div>
      <div style={{display:"flex", flexWrap:"wrap", padding:"100px", width:"90%", minHeight:"500px"}}>
        {"Mon: " + Math.round(browserTime[1]/60000) + "min; "}
        {"Tue: " + Math.round(browserTime[2]/60000) + "min; "}
        {"Wed: " + Math.round(browserTime[3]/60000) + "min; "}
        {"Thu: " + Math.round(browserTime[4]/60000) + "min; "}
        {"Fri: " + Math.round(browserTime[5]/60000) + "min "}
        {createLineChart(visits, "Number of Visits", "Number of Pages")}
        {createLineChart(normTotal, "Number of Visits", "Portion of all visited Pages")}
      </div>
      <div style={{display:"flex", flexWrap:"wrap", padding:"100px", width:"90%", minHeight:"500px"}}>
        {"Mon: " + Math.round(browserTime[1]/60000) + "min; "}
        {"Tue: " + Math.round(browserTime[2]/60000) + "min; "}
        {"Wed: " + Math.round(browserTime[3]/60000) + "min; "}
        {"Thu: " + Math.round(browserTime[4]/60000) + "min; "}
        {"Fri: " + Math.round(browserTime[5]/60000) + "min "}
        <div style={{width:"600"}}>
          <Graph graph={{nodes: nodesGraph, edges: edgesGraph}} options={options}/>
        </div>
        {createLineChart(visits, "Number of Visits", "Number of Pages")}
        {createScatterChart(scatterData)}
        {createLineChart(averageVisits, "Day", "Average visit duration (s)")}
        {createLineChart(medianVisits, "Day", "Median visit duration (s)")}
        {createLineChart(failVisits, "Day", "Fail visits (duration < 1s)")}
        {createLineChart(averageTabs, "Day", "Average Tabs")}
        {createLineChart(medianTabs, "Day", "Median Tabs")}
        {createLineChart(minTabs, "Day", "Min Tabs")}
        {createLineChart(maxTabs, "Day", "Max Tabs")}
        {createLineChart(resetTabs, "Day", "Tab Resets")}
        {createLineChart(hourlyTabs, "Hours", "Tabs")}
        {createLineChart(switchesPerDay, "Day", "Switches")}
        {createLineChart(normalizedSwitchesDay, "Day", "Switches Per Workminute")}
        {createLineChart(averageSwitches, "Day", "Average Switches Per Hour")}
        {createLineChart(medianSwitches, "Day", "Median Switches Per Hours")}
        {createLineChart(minSwitches, "Day", "Min Switches Per Hours")}
        {createLineChart(maxSwitches, "Day", "Max Switches Per Hours")}
        {createFeatureUsage(markedData, "Marked Groups used")}
        {createFeatureUsage(namedData, "Named Groups used")}
        {createFeatureUsage(highlightData, "Highlight opened")}
        {createFeatureUsage(searchData, "Search used")}
      </div>
    </div>
  )
}

function getDailyBrowserTime(edges) {
  const singleAccess = edges.map(edge => {
      return edge.access.map((time) => {
        return {from: edge.from, to: edge.to, time: time}
      })
    })
    .flat()
    .sort((a, b) => a.time - b.time)
  let dailyTime = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
  let lastTime = 0 
  singleAccess.forEach(access => {
    if (lastTime !== 0 && access.from !== 0) {
      const time = access.time - lastTime
      if (time < 3600000) {
        const day = new Date(access.time).getDay()
        dailyTime[day] = dailyTime[day] + time
      }
    }
    lastTime = access.time
  })
  return dailyTime
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

  let totalVisits = Object.keys(lineData).reduce((prev, currKey) => prev + (lineData[currKey]), 0)

  let raw = Object.keys(lineData).map(key => { return { x: key, y: lineData[key] } })
  let normTotal = Object.keys(lineData).map(key => { return { x: key, y: Math.round(lineData[key]/totalVisits*1000)/1000 } })
  return { normTotal, raw }
}

function getAverageVisitDuration(nodes, edges, browserTime) {
  let nodeAccesses = nodes
                .filter(node => node.id !== 0)
                .map(node => 
                  edges
                    .filter(edge => edge.to === node.id || edge.from === node.id)
                    .map(edge => edge.access).flat())
  const visitDurations = {}
  const missClicks = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
  let seenOtherThanFriday = false
  nodeAccesses.forEach(accesses => {
    let enterDate = 0

    accesses
      .sort((a, b) => a - b)
      .forEach((date) => {
        if (enterDate === 0) {
          enterDate = date
        } else {
          const day = new Date(enterDate).getDay()
          if (day === 5 && !seenOtherThanFriday) {
            return // we remove all data from last week
          }
          seenOtherThanFriday = true
          const visit = date - enterDate
          if (day !== 6 && day !== 0 && visit < 1800000) {
            // less than 30 minutes (after 30 min without a switch we assume you're afk) and longer than 1 second (mistake)
            if (visitDurations[day]) {
              visitDurations[day].push(visit)
            } else {
              visitDurations[day] = [visit]
            }
          }
          if (visit < 1000 && day !== 6 && day !== 0) {
            if (missClicks[day]) {
              missClicks[day]++
            } else {
              missClicks[day] = 1
            }
          }
          enterDate = 0
        }
      })
    }
  )

  let totalBrowserTime = Object.keys(browserTime).reduce((prev, currKey) => prev + browserTime[currKey], 0)/3600000

  let day = 0;
  const dailyAverages = Object.keys(visitDurations).map((key) => {
    day++
    const sorted = visitDurations[key].sort((a, b) => a-b)
    const duration = sorted.reduce((prev, curr) => prev + curr, 0)
    length = sorted.length
    let half = Math.floor(length / 2)
    const median = length === 1 || length % 2 ? sorted[(half)] : (sorted[half] + sorted[half-1]) / 2.0
    return { x: key, average: duration / length, median, min: sorted[0], max: sorted[length-1], fails: missClicks[key] }
  })
  return { results: dailyAverages, raw: visitDurations }
}

function getAverageTabNumber(openTabs) { // time = date ms, id = number of tabs
  const numTabs = {}
  const tabsReset = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
  let lastTime = 0
  let seenOtherThanFriday = false
  openTabs.forEach(openTab => {
    const day = new Date(openTab.time).getDay()
    if (day === 5 && !seenOtherThanFriday) {
      return // we remove all data from last week
    }
    seenOtherThanFriday = true
    const hour = new Date(openTab.time).getHours()
    const minutes = hour * 60 + new Date(openTab.time).getMinutes()
    console.log(minutes)
    // since the number of open tabs is logged every time an action is performed in the browser we clean up the data by requiring at least 1 second between logs.
    if (day !== 6 && day !== 0 && openTab.id > 0 && openTab.time - lastTime > 1000) {
      if (numTabs[day] && numTabs[day][minutes]) {
        numTabs[day][minutes].push(openTab.id)
      } else {
        if (!numTabs[day]) {
          numTabs[day] = {}
        }
        numTabs[day][minutes] = [openTab.id]
      }

      if (openTab.id < 4) {
        if (tabsReset[day]) {
          tabsReset[day].push(openTab.time)
        } else {
          tabsReset[day] = [openTab.time]
        }
      }
    }
    lastTime = openTab.time
  })

  let day = 0;
  const dailyAverages = Object.keys(numTabs).map((key) => {
    day++
    const sorted = Object.values(numTabs[key]).flat().sort((a, b) => a-b)
    const duration = sorted.reduce((prev, curr) => prev + curr, 0)
    length = sorted.length
    let half = Math.floor(length / 2)
    const median = length === 1 || length % 2 ? sorted[(half)] : (sorted[half] + sorted[half-1]) / 2.0
    const average = Math.round((duration / length) * 10) / 10
    return { x: key, average, median, min: sorted[0], max: sorted[length-1], resets: tabsReset[key] }
  })
  return { openTabs: dailyAverages, raw: numTabs }
}

function getDailyPageSwitches(nodes, edges, workHours) {
  let switches = edges
                      .filter(edge => edge.to !== 0 && edge.from !== 0)
                      .map(edge => edge.access)
                      .flat()
                      .sort((a,b) => a-b)
  const switchesPerDay = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
  let seenOtherThanFriday = false
  switches.forEach(change => {
    const day = new Date(change).getDay()
    if (day === 5 && !seenOtherThanFriday) {
      return // we remove all data from last week
    }
    seenOtherThanFriday = true
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
    return { x: key, y: switchesPerDay[key], normalized: workHours[key] !== 0 ? Math.round(switchesPerDay[key]/Math.round(workHours[key]/3600000) * 10) / 10 : 0 }
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
  let seenOtherThanFriday = false
  switches.forEach(change => {
    const day = new Date(change).getDay()
    if (day === 5 && !seenOtherThanFriday) {
      return // we remove all data from last week
    }
    seenOtherThanFriday = true
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
  return { switchesPerHour: dailyAverages, raw: switchesPerDay }
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
