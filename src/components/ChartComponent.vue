<script setup lang="ts">
import Chart from 'chart.js/auto'
import { onMounted, reactive, ref } from 'vue'
import SliderBar from './SliderBar.vue'
import jsonObj from './data.json'

const dataList = jsonObj
const threshold = reactive({ count: 0 })
const thresholdData = [
  threshold.count, threshold.count, threshold.count, threshold.count, threshold.count,
  threshold.count, threshold.count, threshold.count, threshold.count, threshold.count,
  threshold.count, threshold.count, threshold.count, threshold.count, threshold.count,
]
const labels = [
  'D1',
  'D2',
  'D3',
  'D4',
  'D5',
  'D6',
  'D7',
  'D8',
  'D9',
  'D10',
  'D11',
  'D12',
  'D13',
  'D14',
  'D15',
]

const data = {
  labels,
  datasets: [{
    label: '正例預測機率',
    backgroundColor: 'rgb(52, 103, 235)',
    borderColor: 'rgb(0, 0, 0)',
    pointRadius: 7,
    data: [0.98, 0.9, 0.85, 0.81, 0.8, 0.78, 0.75, 0.69, 0.62, 0.6, 0.58, 0.51, 0.44, 0.37, 0.29],
  },
  {
    label: '閥值',
    borderColor: 'rgb(0, 0, 0)',
    data: thresholdData,
  },
  ],
}

const config = {
  type: 'line',
  data,
  options: {},
}

function chartUpdate() {
  console.log('check:', myChart.data)
  // myChart.data.datasets[1].data = thresholdData
  // myChart.update('none')
  console.log('Chart update')
  console.log(threshold)
}

onMounted(() => {
  const myChart = new Chart(
    document.getElementById('myChart'),
    config,
  )
})

watch(threshold, chartUpdate)
</script>

<template>
  <h2>ROC & AUC</h2>
  <div class="w-1000px">
    <SliderBar @barValueChange="(i) => threshold.count = i" />
  </div>

  <div class="bg-white h-500px w-1000px float-left">
    <canvas id="myChart" />
  </div>
  <div class="bg-white float-left text-black ml-5">
    <table>
      <tr>
        <th colspan="4">
          閥值 <span class="text-red">{{ threshold.count }}</span>
        </th>
      </tr>
      <tbody>
        <tr>
          <td>資料點</td>
          <td>正例預測機率</td>
          <td>標籤</td>
          <td>預測結果</td>
          <td>混淆矩陣結果</td>
        </tr>
        <tr v-for="datas in dataList" :key="datas.dataPoint">
          <td>{{ datas.dataPoint }}</td>
          <td>{{ datas.probability }}</td>
          <td>{{ datas.label }}</td>
          <td v-if="threshold.count >= datas.probability" class="text-green-700">
            1
          </td>
          <td v-else class="text-red">
            0
          </td>
          <td v-if="datas.label === 1 && threshold.count >= datas.probability">
            TP
          </td>
          <td v-else-if="datas.label === 0 && threshold.count >= datas.probability">
            FP
          </td>
          <td v-else-if="datas.label === 1 && threshold.count < datas.probability">
            FN
          </td>
          <td v-else-if="datas.label === 0 && threshold.count < datas.probability">
            TN
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style>
table,
thead,
td {
    border: 1px solid #333;
    border-collapse: separate;
}
</style>

<style src="@vueform/slider/themes/default.css"></style>
