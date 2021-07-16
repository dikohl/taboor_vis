import React from 'react';
import Graph from "react-graph-vis";
import merge from "lodash.merge";
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
  console.log("visits:")
  console.log(visits)

  let { openTabs, quarterAverages, raw: rawTabs } = getAverageTabNumber(data.data.numOpenPages);
  let quarterTabs = Object.keys(quarterAverages).map(key => { return {x: key, y: quarterAverages[key] }})
  console.log("tabs:")
  console.log(quarterTabs)

  let { avg, total, raw: pageDuration } = getAverageVisitDuration(nodes, edges, visits);
  let totalDurNEW = Object.keys(total).map(d => { return {x: d, y: Math.round((total[d] / 60000) * 100) / 100}})
  console.log("totalDur:")
  console.log(totalDurNEW)

  let avgDurNEW = Object.keys(avg).map(d => { return {x: d, y: Math.round((avg[d] / 60000) * 100) / 100}})
  console.log("avgDur:")
  console.log(avgDurNEW)

  let { total: totalRevis, avg: avgRevis } = getAverageRevisitDuration(nodes, edges)
  let avgRevisNEW = Object.keys(avgRevis).map(d => { return {x: d, y: Math.round((avgRevis[d] / 3600000) * 100) / 100}})
  console.log("avgRevis:")
  console.log(avgRevisNEW)

  let switches = getDailyPageSwitches(edges).map(s => { return {x: s.x, y: Math.round(s.y*10)/10}})
  console.log("switches:")
  console.log(switches)

  let { added, removed, opened } = getUsageByDayStash(data.data.stashUsage, true)
  console.log("added mark:")
  console.log(added)
  console.log("removed mark:")
  console.log(removed)
  console.log("opened mark:")
  console.log(opened)

  let { addded: addedName, removed: removedName, opened: openedName } = getUsageByDayStash(data.data.stashUsage, false)
  console.log("added name:")
  console.log(addedName)
  console.log("removed name:")
  console.log(removedName)
  console.log("opened name:")
  console.log(openedName)

  return (
    <div>
      <div style={{display:"flex", flexWrap:"wrap", padding:"100px", width:"90%", minHeight:"500px"}}>
        {"Mon: " + Math.round(browserTime[1]/60000) + "min; "}
        {"Tue: " + Math.round(browserTime[2]/60000) + "min; "}
        {"Wed: " + Math.round(browserTime[3]/60000) + "min; "}
        {"Thu: " + Math.round(browserTime[4]/60000) + "min; "}
        {"Fri: " + Math.round(browserTime[5]/60000) + "min "}
        RQ1:
        {createLineChart(visits, "Number of Visits", "Number of Pages", "natural")}
        {createLineChart(normTotal, "Number of Visits", "Portion of all visited Pages", "natural")}
        RQ2:
        a)
        {createLineChart(quarterTabs, "Time (h)", "No. of Tabs (per 15min)", "natural")}
        b)
        {createLineChart(totalDurNEW, "Number of Visits", "Total Visit Time (minutes)", "natural")}
        {createLineChart(avgDurNEW, "Number of Visits", "Average Visit Time per Visit and Page (minutes)", "natural")}
        c)
        {createLineChart(switches, "Time (h)", "Switches (per 15min)", "natural")}
        d)
        {createLineChart(avgRevisNEW, "Number of Visits", "Average Time between Visits per Visit and Page (hours)", "natural")}
        RQ3:
        a) with add or remove of pages. find out average size of groups and number of used colors
        {createLineChart(added, "Added Mark", "No. of Tabs (per 15min)")}
        {createLineChart(removed, "Removed Mark", "No. of Tabs (per 15min)")}
        {createLineChart(opened, "Opened Mark", "No. of Tabs (per 15min)")}

        {createLineChart(added, "Added Named", "No. of Tabs (per 15min)")}
        {createLineChart(removed, "Removed Named", "No. of Tabs (per 15min)")}
        {createLineChart(opened, "Opened Named", "No. of Tabs (per 15min)")}
        b) analyze when multiple pages are closed or opened at once! Opened works with 50ms in between of grouped pages. Close is a jump bigger than 1 in the tabs (might also be a window)
        {createLineChart(quarterTabs, "Time (h)", "No. of Tabs (per 15min)", "natural")}
        c) NO DATA
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
  let visitData = edges.filter(edge => edge.to !== 0).reduce((sums, entry) => {
    sums[entry.to] = (sums[entry.to] || 0) + entry.access.length;
    return sums;
  },{}); // how often was each id visited "id: visitCount"

  let lineData = Object.keys(visitData).reduce((prev, currKey) => {
    const value = visitData[currKey]
    if (prev[value]) {
      prev[value].push(currKey)
    } else {
      prev[value] = [currKey]
    }
    return prev
  },{}); // how often does a visit count appear "visitCount: pageCount"

  let totalVisits = Object.keys(lineData).reduce((prev, currKey) => prev + (lineData[currKey].length), 0)

  let raw = Object.keys(lineData).map(key => { return { x: key, y: lineData[key].length, pages: lineData[key] } })
  let normTotal = Object.keys(lineData).map(key => { return { x: key, y: Math.round(lineData[key].length/totalVisits*1000)/1000 } })
  return { normTotal, raw }
}

function getAverageVisitDuration(nodes, edges) {
  let nodeAccesses = nodes
                .filter(node => node.id !== 0)
                .map(node => 
                  { return { switch: edges
                    .filter(edge => edge.to === node.id || edge.from === node.id)
                    .map(edge => edge.access).flat(), id: node.id}})
  const visitDurations = {}
  nodeAccesses.forEach(node => {
    let enterDate = 0
    node.switch
      .sort((a, b) => a - b)
      .forEach((date) => {
        if (enterDate === 0) {
          enterDate = date
        } else {
          const visit = date - enterDate
          if (visit < 3600000) {
            // less than 30 minutes (after 30 min without a switch we assume you're afk)
            if (visitDurations[node.id]) {
              visitDurations[node.id].push(visit)
            } else {
              visitDurations[node.id] = [visit]
            }
          }
          enterDate = 0
        }
      })
    }
  )

  const pageDurations = Object.keys(visitDurations).reduce((prev, key) => { // id: totalTimeToRevisits
    prev[key] = visitDurations[key].reduce((prev, dur) => prev + dur, 0)
    return prev
  }, {})

  const noOfVisits = Object.keys(visitDurations).reduce((prev, key) => { // id: noOfVisits
    prev[key] = visitDurations[key].length
    return prev
  }, {})

  const pagesPerVisits = Object.keys(noOfVisits).reduce((prev, key) => { // noOfVisits: [ids]
    if (prev[noOfVisits[key]]) {
      prev[noOfVisits[key]].push(key)
    } else {
      prev[noOfVisits[key]] = [key]
    }
    return prev
  }, {})

  const totalDurations = Object.keys(pagesPerVisits).reduce((prev, key) => { // noOfVisits: totalVisitDuration
    prev[key] = pagesPerVisits[key].reduce((total, curr) => total + pageDurations[curr], 0)
    return prev
  }, {})

  const averageDuration = Object.keys(totalDurations).reduce((prev, key) => {
    prev[key] = totalDurations[key] / key / pagesPerVisits[key].length // total / (noOfVisits * noOfPages)
    return prev
  }, {})

  return { avg: averageDuration, total: totalDurations, raw: pageDurations }
}

function getAverageRevisitDuration(nodes, edges) {
  let nodeAccesses = nodes
                .filter(node => node.id !== 0)
                .map(node => 
                  { return { switch: edges
                    .filter(edge => edge.to === node.id || edge.from === node.id)
                    .map(edge => edge.access).flat(), id: node.id}})
  const visitDurations = {}
  nodeAccesses.forEach(node => {
    let enterDate = 0
    let first = true
    node.switch
      .sort((a, b) => a - b)
      .forEach((date) => {
        if (first) {
          first = false
          return
        }
        if (enterDate === 0) {
          enterDate = date
        } else {
          const visit = date - enterDate
          if (visitDurations[node.id]) {
            visitDurations[node.id].push(visit)
          } else {
            visitDurations[node.id] = [visit]
          }
          enterDate = 0
        }
      })
    }
  )

  const pageDurations = Object.keys(visitDurations).reduce((prev, key) => { // id: totalDurationAllVisits
    prev[key] = visitDurations[key].reduce((prev, dur) => prev + dur, 0)
    return prev
  }, {})

  const noOfVisits = Object.keys(visitDurations).reduce((prev, key) => { // id: noOfVisits
    prev[key] = visitDurations[key].length
    return prev
  }, {})

  const pagesPerVisits = Object.keys(noOfVisits).reduce((prev, key) => { // noOfVisits: [ids]
    if (prev[noOfVisits[key]]) {
      prev[noOfVisits[key]].push(key)
    } else {
      prev[noOfVisits[key]] = [key]
    }
    return prev
  }, {})

  const totalDurations = Object.keys(pagesPerVisits).reduce((prev, key) => { // noOfVisits: totalVisitDuration
    prev[key] = pagesPerVisits[key].reduce((total, curr) => total + pageDurations[curr], 0)
    return prev
  }, {})

  const averageDuration = Object.keys(totalDurations).reduce((prev, key) => {
    prev[Number(key)+1] = totalDurations[key] / key / pagesPerVisits[key].length // total / (noOfVisits * noOfPages)
    return prev
  }, {})

  return { avg: averageDuration, total: totalDurations, raw: pageDurations }
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

  const dailyAverages = Object.keys(numTabs).map((key) => {
    const sorted = Object.values(numTabs[key]).flat().sort((a, b) => a-b)
    const duration = sorted.reduce((prev, curr) => prev + curr, 0)
    length = sorted.length
    let half = Math.floor(length / 2)
    const median = length === 1 || length % 2 ? sorted[(half)] : (sorted[half] + sorted[half-1]) / 2.0
    const average = Math.round((duration / length) * 10) / 10
    return { x: key, average, median, min: sorted[0], max: sorted[length-1], resets: tabsReset[key] }
  })

  const allDays = Object.keys(numTabs).reduce((prev, currKey) => merge(numTabs[currKey], prev), {})
  const quarterAverages = {}
  for (let quarter = 0; quarter <= 1440; quarter=quarter+15) {
    let quarterTabs = []
    for (let minute = 1; minute%15 !== 0; minute++) {
      if (allDays[quarter + minute]) {
        quarterTabs.push(...allDays[quarter + minute])
      }
    }
    let quarterAverage = quarterTabs.length > 0 ? Math.round(quarterTabs.reduce((prev, curr) => prev + curr, 0)/quarterTabs.length *10) / 10 : 0
    quarterAverages[quarter] = quarterAverage
  }
  return { openTabs: dailyAverages, quarterAverages, raw: numTabs }
}

function getDailyPageSwitches(edges) {
  let switches = edges
                      .filter(edge => edge.to !== 0 && edge.from !== 0)
                      .map(edge => edge.access)
                      .flat()
                      .sort((a,b) => a-b)
  const switchesPerDay = {}
  const days = new Set()
  switches.forEach(change => {
    days.add(new Date(change).getDay())
    const hours = new Date(change).getHours()
    const minutes = hours * 60 + new Date(change).getMinutes()
    if (switchesPerDay[minutes]) {
      switchesPerDay[minutes]++
    } else {
      switchesPerDay[minutes] = 1
    }
  })
  const quarterAverages = {}
  for (let quarter = 0; quarter <= 1440; quarter=quarter+15) {
    let quarterSwitches = []
    for (let minute = 1; minute%15 !== 0; minute++) {
      if (switchesPerDay[quarter + minute]) {
        quarterSwitches.push(switchesPerDay[quarter + minute])
      }
    }
    quarterAverages[quarter] = quarterSwitches.reduce((curr, prev) => curr + prev, 0) / days.size
  }
  const avg = Object.keys(quarterAverages).map(key => { return {x: key, y: quarterAverages[key]}})
  return avg
}

function getUsageByDayStash(usageData, colors) {
  const data = usageData.filter(use => colors ? use['name'].includes('#') : use['name'].split(";").some(na => !na.includes("#")))
  console.log("data")
  console.log(data)
  return getUsageByDay(data)
}

function getUsageByDay(usageData) {
  let added = usageData.filter(usage => usage.type === "added")
  let removed = usageData.filter(usage => usage.type === "removed")
  let opened = usageData.filter(usage => usage.type === "opened")
  
  let quarterAdded = getQuarterUsage(added);
  let quarterRemoved = getQuarterUsage(removed);
  let quarterOpened = getQuarterUsage(opened);

  return { added: quarterAdded, removed: quarterRemoved, opened: quarterOpened }
}

function getQuarterUsage(added) {
  const usagePerMinute = {};
  added.forEach(add => {
    const hours = new Date(add.time).getHours();
    const minutes = hours * 60 + new Date(add.time).getMinutes();
    if (usagePerMinute[minutes]) {
      usagePerMinute[minutes]++;
    } else {
      usagePerMinute[minutes] = 1;
    }
  });

  const quarterUsage = {};
  for (let quarter = 0; quarter <= 1440; quarter = quarter + 15) {
    let quarterSwitches = [];
    for (let minute = 1; minute % 15 !== 0; minute++) {
      if (usagePerMinute[quarter + minute]) {
        quarterSwitches.push(usagePerMinute[quarter + minute]);
      }
    }
    quarterUsage[quarter] = quarterSwitches.reduce((curr, prev) => curr + prev, 0);
  }
  const sum = Object.keys(quarterUsage).map(key => { return { x: key, y: quarterUsage[key] }; });
  return sum;
}

function groupday(value, index, array){
  let byday={};
  let d = new Date(value['time']);
  d = Math.floor(d.getTime()/(1000*60*60*24));
  byday[d]=byday[d]||[];
  byday[d].push(value);
  return byday
}

function createLineChart(data, xlabel, ylabel, interpol="linear") {
  return (
    <div style={{width:"600px"}}>
      <VictoryChart>
        <VictoryLine
          interpolation={interpol}
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
