import Chart from 'chart.js/auto'

export function createChart(chartArea, config) {
  const myChart = new Chart(
    document.getElementById('myChart'),
    config,
  )
  console.log('Chart created')
  console.log(threshold)
  return myChart
}

export function updateChart(myChart, newData) {
  myChart.data.datasets[1].data = newData
  myChart.update('none')
  console.log('Chart updated')
  console.log(threshold)
}
