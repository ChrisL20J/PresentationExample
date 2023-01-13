<script setup lang="ts">
import Chart from 'chart.js/auto'
import { onMounted, ref } from 'vue'
import SliderBar from './SliderBar.vue'
import jsonObj from './data.json'

const dataList = jsonObj
const threshold = ref(0)
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
    data: [
      threshold.value, threshold.value, threshold.value, threshold.value, threshold.value,
      threshold.value, threshold.value, threshold.value, threshold.value, threshold.value,
      threshold.value, threshold.value, threshold.value, threshold.value, threshold.value,
    ],
    pointStyle: false,
  },
  ],
}

const config = {
  type: 'line',
  data,
  options: {},
}
let myChart = Chart

function chartCreate() {
  myChart = new Chart(
    document.getElementById('myChart'),
    config,
  )
  console.log('Chart created')
  console.log(threshold)
}

function chartUpdate() {
  console.log('Before update:', myChart.data.datasets[1])
  myChart.data.datasets[1].data = [
    threshold.value, threshold.value, threshold.value, threshold.value, threshold.value,
    threshold.value, threshold.value, threshold.value, threshold.value, threshold.value,
    threshold.value, threshold.value, threshold.value, threshold.value, threshold.value,
  ]
  console.log('After update:', myChart.data.datasets[1])
  myChart.update('none')
  console.log('Chart updated')
  console.log(threshold)
}

onMounted(chartCreate)
watch(threshold, chartUpdate)
</script>

<template>
  <h2>
    ROC & AUC
  </h2>
  <div class="my-6 mx-150">
    <SliderBar @barValueChange="(i) => threshold = i" />
  </div>
  <div class="flex justify-around">
    <div class="bg-white h-500px w-1000px">
      <canvas id="myChart" />
    </div>

    <div class="bg-white text-black ml-5">
      <table>
        <tr>
          <th colspan="4">
            閥值:<span class="text-red">{{ threshold }}</span>
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
            <td v-if="threshold >= datas.probability" class="text-green-700">
              1
            </td>
            <td v-else class="text-red">
              0
            </td>
            <td v-if="datas.label === 1 && threshold >= datas.probability">
              TP
            </td>
            <td v-else-if="datas.label === 0 && threshold >= datas.probability">
              FP
            </td>
            <td v-else-if="datas.label === 1 && threshold < datas.probability">
              FN
            </td>
            <td v-else-if="datas.label === 0 && threshold < datas.probability">
              TN
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div class="bg-white float-left text-black ml-5">
    <table>
      <tr>
        <td class="p-5">
          TP:
        </td>
        <td class="p-5">
          TN:
        </td>
      </tr>
      <tr>
        <td class="p-5">
          FP:
        </td>
        <td class="p-5">
          FN:
        </td>
      </tr>
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
