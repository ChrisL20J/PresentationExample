<script setup lang="ts">
import VueSlider from 'vue-slider-component/dist-css/vue-slider-component.umd.min.js'
import 'vue-slider-component/dist-css/vue-slider-component.css'
import 'vue-slider-component/theme/default.css'
import Chart from 'chart.js/auto'
import { onMounted, reactive, ref } from 'vue'
import jsonObjConfusionMatrix from './dataConfusionMatrix.json'
import jsonObjAUC from './dataAUC.json'

const { t, locale } = useI18n()
const dataListConfusionMatrix = jsonObjConfusionMatrix
const dataListAUC = jsonObjAUC

const barOption = reactive({ value: 0, width: 700, height: 6, min: 0, max: 1, interval: 0.01, contained: true, tooltip: 'always' })
const threshold = ref(0)
const thresholdForAUCChart = ref(1)
const thresholdID = ref(0)
const confusionMatrix = reactive({ TP: 5, FP: 10, TN: 0, FN: 0 })
const confusionMatrixROC = reactive({ TP: 0, FP: 0, TN: 0, FN: 0, FPR: 0, TPR: 0 })

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
    label: 'Prediction',
    backgroundColor: 'rgb(52, 103, 235)',
    borderColor: 'rgb(0, 0, 0)',
    pointRadius: 7,
    data: [0.98, 0.9, 0.85, 0.81, 0.8, 0.78, 0.75, 0.69, 0.62, 0.6, 0.58, 0.51, 0.44, 0.37, 0.29],
  },
  {
    label: 'Threshold',
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
        title: {
          display: true,
          text: 'Prediction',
          font: {
            size: 20,
          },
        },
      },
      x: {
        title: {
          display: true,
          text: 'Data',
          font: {
            size: 20,
          },
        },
      },
    },
  },
}

const dataAUC = {
  datasets: [{
    label: 'ROC curve',
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
        title: {
          display: true,
          text: 'True Positive Rate',
          font: {
            size: 20,
          },
        },
      },
      xAxis: {
        type: 'linear',
        min: 0,
        max: 1,
        title: {
          display: true,
          text: 'False Positive Rate',
          font: {
            size: 20,
          },
        },
      },
    },
  },
}

let chartConfusionMatrix = Chart
let chartAUC = Chart

function getAUCUpdate() {
  thresholdForAUCChart.value = dataListAUC[thresholdID.value].threshold
  confusionMatrixROC.TP = dataListAUC[thresholdID.value].ConfusionMatrix.TP
  confusionMatrixROC.FP = dataListAUC[thresholdID.value].ConfusionMatrix.FP
  confusionMatrixROC.TN = dataListAUC[thresholdID.value].ConfusionMatrix.TN
  confusionMatrixROC.FN = dataListAUC[thresholdID.value].ConfusionMatrix.FN
  confusionMatrixROC.FPR = dataListAUC[thresholdID.value].FPR
  confusionMatrixROC.TPR = dataListAUC[thresholdID.value].TPR
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
      dataset.data.push({ x: dataListAUC[thresholdID.value].FPR, y: dataListAUC[thresholdID.value].TPR })
    })
    chartAUC.update('none')
    console.log({ x: dataListAUC[thresholdID.value].FPR, y: dataListAUC[thresholdID.value].TPR })
    console.log(chartAUC.data.datasets)
  }
}

function checkCM() {
  dataListAUC.some((item, index) => {
    if (threshold.value > item.threshold) {
      confusionMatrix.TP = dataListAUC[index - 1].ConfusionMatrix.TP
      confusionMatrix.FP = dataListAUC[index - 1].ConfusionMatrix.FP
      confusionMatrix.TN = dataListAUC[index - 1].ConfusionMatrix.TN
      confusionMatrix.FN = dataListAUC[index - 1].ConfusionMatrix.FN
      console.log(threshold.value, item.ConfusionMatrix)
      return true
    }
    else if (threshold.value <= 0.29) {
      confusionMatrix.TP = dataListAUC[index].ConfusionMatrix.TP
      confusionMatrix.FP = dataListAUC[index].ConfusionMatrix.FP
      confusionMatrix.TN = dataListAUC[index].ConfusionMatrix.TN
      confusionMatrix.FN = dataListAUC[index].ConfusionMatrix.FN
      console.log(threshold.value, item.ConfusionMatrix)
    }
  })
}

function updateChartLocale() {
  chartConfusionMatrix.data.datasets[0].label = t('AUC-page.chart.prediction')
  chartConfusionMatrix.data.datasets[1].label = t('AUC-page.chart.threshold')
  chartConfusionMatrix.options.scales.y.title.text = t('AUC-page.confusion-matrix-form.data-point')
  chartConfusionMatrix.options.scales.x.title.text = t('AUC-page.chart.threshold')
  chartConfusionMatrix.update('none')

  chartAUC.data.datasets[0].label = t('AUC-page.chart.ROC')
  chartAUC.options.scales.y.title.text = t('AUC-page.chart.TPR')
  chartAUC.options.scales.xAxis.title.text = t('AUC-page.chart.FPR')
  chartAUC.update('none')
}

onMounted(() => {
  chartCreate()
  updateChartLocale()
})
watch(barOption, () => {
  threshold.value = barOption.value
  chartUpdate()
  checkCM()
})
watch(locale, updateChartLocale)
</script>

<template>
  <h2>
    ROC & AUC
  </h2>
  <div class="my-6 mx-150">
    <VueSlider v-model="barOption.value" :width="barOption.width" :height="barOption.height" :min="barOption.min" :max="barOption.max" :interval="barOption.interval" :contained="barOption.contained" :tooltip="barOption.tooltip" />
  </div>
  <div class="flex justify-around">
    <div class="bg-white h-500px w-1000px">
      <canvas id="chartConfusionMatrix" />
    </div>

    <div class="bg-white text-black">
      <table>
        <tr>
          <th colspan="5">
            {{ t('AUC-page.chart.threshold') }}:<span class="text-red">{{ threshold }}</span>
          </th>
        </tr>
        <tbody>
          <tr>
            <td>{{ t('AUC-page.confusion-matrix-form.data-point') }}</td>
            <td>{{ t('AUC-page.confusion-matrix-form.label') }}</td>
            <td>{{ t('AUC-page.chart.prediction') }}</td>
            <td>{{ t('AUC-page.confusion-matrix-form.result') }}</td>
            <td>{{ t('AUC-page.confusion-matrix-form.condition') }}</td>
          </tr>
          <tr v-for="datas in dataListConfusionMatrix" :key="datas.dataPoint">
            <td>{{ datas.dataPoint }}</td>
            <td>{{ datas.label }}</td>
            <td>{{ datas.probability }}</td>
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
    <div class="text-black">
      <table class="bg-white">
        <tr>
          <th colspan="2">
            {{ t('AUC-page.confusion-matrix-form.confusion-matrix') }}
          </th>
        </tr>
        <tr>
          <td class="p-5">
            TP:{{ confusionMatrix.TP }}
          </td>
          <td class="p-5">
            FN:{{ confusionMatrix.FN }}
          </td>
        </tr>
        <tr>
          <td class="p-5">
            FP:{{ confusionMatrix.FP }}
          </td>
          <td class="p-5">
            TN:{{ confusionMatrix.TN }}
          </td>
        </tr>
      </table>
    </div>
  </div>

  <div class="flex justify-center my-8">
    <div class="text-black mr-12">
      <div>
        <table class="bg-white ma">
          <tr>
            <th colspan="2">
              {{ t('AUC-page.confusion-matrix-form.current-threshold') }} : {{ thresholdForAUCChart }}
            </th>
          </tr>
          <tr>
            <td class="p-5">
              TP:{{ confusionMatrixROC.TP }}
            </td>
            <td class="p-5">
              FN:{{ confusionMatrixROC.FN }}
            </td>
          </tr>
          <tr>
            <td class="p-5">
              FP:{{ confusionMatrixROC.FP }}
            </td>
            <td class="p-5">
              TN:{{ confusionMatrixROC.TN }}
            </td>
          </tr>
        </table>
      </div>

      <div class="ma">
        <button class="btn" @click="previousThresholdID">
          {{ t('AUC-page.confusion-matrix-form.previous-threshold') }}
        </button><br>
        <button class="btn" @click="nextThresholdID">
          {{ t('AUC-page.confusion-matrix-form.next-threshold') }}
        </button>
      </div>

      <div>
        <table class="bg-white ma">
          <tr>
            <td class="p-5">
              {{ t('AUC-page.confusion-matrix-form.x-axis') }}({{ t('AUC-page.chart.FPR') }}) : {{ confusionMatrixROC.FPR }}
            </td>
          </tr>
          <tr>
            <td class="p-5">
              {{ t('AUC-page.confusion-matrix-form.y-axis') }}({{ t('AUC-page.chart.TPR') }}) : {{ confusionMatrixROC.TPR }}
            </td>
          </tr>
        </table>
      </div>
    </div>
    <div class="bg-white h-500px w-1000px">
      <canvas id="chartAUC" />
    </div>
  </div>
</template>

<style>
table,
thead,
th,
td {
    border: 1px solid #333;
    border-collapse: separate;
}
</style>
