<template>
  <div v-if="isSuccessfulRequest" style="width: 90%; margin-bottom: 30px; height: 320px">
    <vue3-chart-js
      ref="chartRef"
      type="line"
      :data="dataSrc"
      :options="chartOptions"
    />
  </div>
  <div v-if="isSuccessfulRequest">
    <q-range
      v-model="range.timeRage"
      @change="setDataChart"
      :min="range.minVal"
      :max="range.maxVal"
      :left-label-value="leftLabelValue"
      :right-label-value="rightLabelValue"
      label
      label-always
    />
  </div>
  <div v-else-if="!isLoading">
    <p class="second-title">Нет данных для отображения графика</p>
  </div>
</template>

<script lang="ts" setup>
/* eslint-disable */

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Vue3ChartJs from '@j-t-mcc/vue3-chartjs';
import {computed, onMounted, ref} from 'vue';
import {getChartArchiveData} from 'src/shared/api';
import {errorNotify} from 'boot/injections';
import type {IArchiveChart, DeepNonNullableRequired} from 'pages/cabinet/cabinet.interface';
import {EMOTIONS} from 'pages/cabinet/cabinet.interface';
import {map} from 'rxjs/operators'
import {finalize} from 'rxjs';
import {IVideoFragment} from 'src/shared/api.interface';

const props = defineProps<{
  dataChart: DeepNonNullableRequired<IVideoFragment>
}>()

const emits = defineEmits<{
  (e: 'changeTime', value: number): void
}>()

const chartRef = ref(null)
let isLoading = ref(false)
let isSuccessfulRequest = ref(false)
let responseDataChart = [] as IArchiveChart['emotions']
const dataSrc = {
  labels: [] as string[],
  datasets: [] as {label: string, borderColor: string, backgroundColor: string, data: number[]}[]
}
let _labels = [] as string[]
const range = ref({
  timeRage: {
    min: 0,
    max: 0
  },
  minVal: 0,
  maxVal: 0
})

const secondsToMinutes = (seconds: number) => (`${new Date(seconds * 1000).toLocaleString('Ru-ru')}`)
const leftLabelValue = computed(() => secondsToMinutes(range.value.timeRage.min))
const rightLabelValue = computed(() => secondsToMinutes(range.value.timeRage.max))

const getData = () => {
  isLoading.value = true
  getChartArchiveData(props.dataChart.data_file_url)
    .pipe(
      map(({ data }) => data),
      finalize(() => isLoading.value = false)
    )
    .subscribe({
      next: (data) => {
        responseDataChart = data.emotions
        isSuccessfulRequest.value = !!data.emotions.length && Array.isArray(data.emotions[0][0][0])
        isSuccessfulRequest.value && setDataChart()
      },
      error: errorNotify('Ошибка загрузки данных')
    })
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  onClick: (...args: any[][]) => {
    const firstElement = args[1][0]
    if (firstElement) {
      emits('changeTime', _labels.findIndex(v => v === dataSrc.labels[firstElement.index]))
    }
  },
  tooltips: {
    mode: 'point'
  }
}

const filterDataFps = (emotion: number) => {
  return responseDataChart
    .map(second => second.reduce((acc, val) => {
      const value = val.length ? (val[0][emotion] || 0) : 0
      return acc + value
    }, 0) / second.length)
}

const filterDataRange = (emotion: number) => {
  return filterDataFps(emotion)
    .filter((v, ind) => ind >= _labels.findIndex(v => v === secondsToMinutes(range.value.timeRage.min))
      && ind <= _labels.findIndex(v => v === secondsToMinutes(range.value.timeRage.max)))
}

const setDataChart = () => {
  if (dataSrc.datasets.length) {
    dataSrc.datasets[EMOTIONS.neutral].data = filterDataRange(EMOTIONS.neutral)
    dataSrc.datasets[EMOTIONS.happy].data = filterDataRange(EMOTIONS.happy)
    dataSrc.datasets[EMOTIONS.sad].data = filterDataRange(EMOTIONS.sad)
    dataSrc.datasets[EMOTIONS.surprise].data = filterDataRange(EMOTIONS.surprise)
    dataSrc.datasets[EMOTIONS.anger].data = filterDataRange(EMOTIONS.anger)
    dataSrc.datasets[EMOTIONS.fear].data = filterDataRange(EMOTIONS.fear)
    dataSrc.datasets[EMOTIONS.disgust].data = filterDataRange(EMOTIONS.disgust)
    dataSrc.labels = _labels.filter((v, ind) => ind >= _labels.findIndex(v => v === secondsToMinutes(range.value.timeRage.min))
      && ind <= _labels.findIndex(v => v === secondsToMinutes(range.value.timeRage.max)))
  } else {
    dataSrc.datasets = [
      {
        label: 'Нейтральное',
        borderColor: 'rgb(102,102,102)',
        backgroundColor: 'rgb(102,102,102)',
        data: filterDataFps(EMOTIONS.neutral)
      },
      {
        label: 'Счастье',
        borderColor: 'rgb(250,168,5)',
        backgroundColor: 'rgb(250,168,5)',
        data: filterDataFps(EMOTIONS.happy)
      },
      {
        label: 'Грусть',
        borderColor: 'rgba(38,122,191,0.82)',
        backgroundColor: 'rgba(38,122,191,0.82)',
        data: filterDataFps(EMOTIONS.sad)
      },
      {
        label: 'Удивление',
        borderColor: 'rgba(189,0,191,0.82)',
        backgroundColor: 'rgba(189,0,191,0.82)',
        data: filterDataFps(EMOTIONS.surprise)
      },
      {
        label: 'Злость',
        borderColor: 'rgba(191,6,0,0.82)',
        backgroundColor: 'rgba(191,6,0,0.82)',
        data: filterDataFps(EMOTIONS.anger)
      },
      {
        label: 'Страх',
        borderColor: 'rgba(6,12,14,0.82)',
        backgroundColor: 'rgba(6,12,14,0.82)',
        data: filterDataFps(EMOTIONS.fear)
      },
      {
        label: 'Отвращение',
        borderColor: 'rgba(14,191,7,0.82)',
        backgroundColor: 'rgba(14,191,7,0.82)',
        data: filterDataFps(EMOTIONS.disgust)
      }
    ]

    dataSrc.labels = dataSrc.datasets[0].data.map((v, ind) => {
      const date = new Date(props.dataChart.recording_started_at)
      return secondsToMinutes(date.getTime() / 1000 + ind + 1)
    })
    _labels = dataSrc.labels

    range.value.minVal = new Date(props.dataChart.recording_started_at).getTime() / 1000
    range.value.maxVal = new Date(props.dataChart.recording_started_at).getTime() / 1000 + dataSrc.datasets[0].data.length
    range.value.timeRage.min = range.value.minVal
    range.value.timeRage.max = range.value.maxVal
  }

  // @ts-ignore
  chartRef.value && chartRef.value!.update()
}

onMounted(() => {
  getData()
})

</script>

<style scoped>

</style>
