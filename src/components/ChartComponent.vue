<script setup lang="ts">
import Chart from 'chart.js/auto'
import { onMounted, reactive, ref } from 'vue'
import SliderBar from './SliderBar.vue'
import jsonObjConfusionMatrix from './dataConfusionMatrix.json'
import jsonObjAUC from './dataAUC.json'

const dataListConfusionMatrix = jsonObjConfusionMatrix
const dataListAUC = jsonObjAUC
const threshold = ref(0)
const thresholdForAUCChart = ref(1)
const thresholdID = ref(0)
const confusionMatrix = reactive({ TP: 0, FP: 0, TN: 0, FN: 0, FPP: 0, TPP: 0 })
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

const dataConfusionMatrix = {
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
    pointStyle: true,
  },
  ],
}

const configConfusionMatrix = {
  type: 'line',
  data: dataConfusionMatrix,
  options: {
    plugins: {
      legend: {
        labels: {
          font: {
            size: 20,
          },
        },
      },
    },
    scales: {
      y: {
        min: 0,
      },
    },
  },
}

const dataAUC = {
  datasets: [{
    label: 'ROC曲線',
    backgroundColor: 'rgb(5, 125, 63)',
    borderColor: 'rgb(5, 125, 63)',
    pointRadius: 7,
    data: [{ x: 0, y: 0 }],
    stepped: true,
  },
  ],
}

const configAUC = {
  type: 'line',
  data: dataAUC,
  options: {
    plugins: {
      legend: {
        labels: {
          font: {
            size: 20,
          },
        },
      },
    },
    scales: {
      y: {
        min: 0,
        max: 1,
      },
      xAxis: {
        type: 'linear',
        min: 0,
        max: 1,
      },
    },
  },
}

let chartConfusionMatrix = Chart
let chartAUC = Chart

function getAUCUpdate() {
  thresholdForAUCChart.value = dataListAUC[thresholdID.value].threshold
  confusionMatrix.TP = dataListAUC[thresholdID.value].ConfusionMatrix.TP
  confusionMatrix.FP = dataListAUC[thresholdID.value].ConfusionMatrix.FP
  confusionMatrix.TN = dataListAUC[thresholdID.value].ConfusionMatrix.TN
  confusionMatrix.FN = dataListAUC[thresholdID.value].ConfusionMatrix.FN
  confusionMatrix.FPP = dataListAUC[thresholdID.value].FPP
  confusionMatrix.TPP = dataListAUC[thresholdID.value].TPP
}

function chartCreate() {
  chartConfusionMatrix = new Chart(
    document.getElementById('chartConfusionMatrix'),
    configConfusionMatrix,
  )
  chartAUC = new Chart(
    document.getElementById('chartAUC'),
    configAUC,
  )
  getAUCUpdate()
}

function chartUpdate() {
  chartConfusionMatrix.data.datasets[1].data = [
    threshold.value, threshold.value, threshold.value, threshold.value, threshold.value,
    threshold.value, threshold.value, threshold.value, threshold.value, threshold.value,
    threshold.value, threshold.value, threshold.value, threshold.value, threshold.value,
  ]
  chartConfusionMatrix.update('none')
}

function previousThresholdID() {
  if (thresholdID.value !== 0) {
    thresholdID.value--
    getAUCUpdate()
    chartAUC.data.labels.pop()
    chartAUC.data.datasets.forEach((dataset) => {
      dataset.data.pop()
    })
    chartAUC.update('none')
  }
}

function nextThresholdID() {
  if (thresholdID.value !== 15) {
    thresholdID.value++
    getAUCUpdate()
    chartAUC.data.datasets.forEach((dataset) => {
      dataset.data.push({ x: dataListAUC[thresholdID.value].FPP, y: dataListAUC[thresholdID.value].TPP })
    })
    chartAUC.update('none')
    console.log({ x: dataListAUC[thresholdID.value].FPP, y: dataListAUC[thresholdID.value].TPP })
    console.log(chartAUC.data.datasets)
  }
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
      <canvas id="chartConfusionMatrix" />
    </div>

    <div class="bg-white text-black">
      <table>
        <tr>
          <th colspan="5">
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
          <tr v-for="datas in dataListConfusionMatrix" :key="datas.dataPoint">
            <td>{{ datas.dataPoint }}</td>
            <td>{{ datas.probability }}</td>
            <td>{{ datas.label }}</td>
            <td v-if="threshold <= datas.probability" class="text-green-700">
              1
            </td>
            <td v-else class="text-red">
              0
            </td>
            <td v-if="datas.label === 1 && threshold <= datas.probability">
              TP
            </td>
            <td v-else-if="datas.label === 0 && threshold <= datas.probability">
              FP
            </td>
            <td v-else-if="datas.label === 1 && threshold > datas.probability">
              FN
            </td>
            <td v-else-if="datas.label === 0 && threshold > datas.probability">
              TN
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div class="flex justify-center">
    <div class="text-black mr-6">
      <table class="bg-white ">
        <tr>
          <td class="p-5">
            TP:{{ confusionMatrix.TP }}
          </td>
          <td class="p-5">
            FP:{{ confusionMatrix.FP }}
          </td>
        </tr>
        <tr>
          <td class="p-5">
            TN:{{ confusionMatrix.TN }}
          </td>
          <td class="p-5">
            FN:{{ confusionMatrix.FN }}
          </td>
        </tr>
        <th colspan="2">
          <tr>當前閥值 : {{ thresholdForAUCChart }}</tr>
        </th>
      </table>
      <button class="btn" @click="previousThresholdID">
        上一個閥值
      </button><br>
      <button class="btn" @click="nextThresholdID">
        下一個閥值
      </button>
      <table class="bg-white ">
        <tr>
          <td class="p-5">
            X軸(偽陽性率) : {{ confusionMatrix.FPP }}
          </td>
        </tr>
        <tr>
          <td class="p-5">
            Y軸(真陽性率) : {{ confusionMatrix.TPP }}
          </td>
        </tr>
      </table>
    </div>
    <div class="bg-white h-500px w-1000px">
      <canvas id="chartAUC" />
    </div>
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
