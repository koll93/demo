<template>
    <div v-if="responseDataChart.length" class="full-width" style="height: 400px">
        <vue3-chart-js
          ref="chartRef"
          type="line"
          :data="dataSrc"
          :options="chartOptions"
        />
    </div>
</template>

<script lang="ts" setup>

const TIME_GET_DATA_CHART = 1000
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Vue3ChartJs from '@j-t-mcc/vue3-chartjs';
import {onMounted, onUnmounted, ref} from 'vue';
import {getChartData} from 'src/shared/api';
import {errorNotify} from 'boot/injections';
import {EMOTIONS} from 'pages/cabinet/cabinet.interface';
import {delay, map, repeatWhen} from 'rxjs/operators';
import {ICameraEmotions} from 'src/shared/api.interface';
import {Subscription} from 'rxjs';

const props = defineProps({
  idCamera: {
    type: String,
    required: true
  }
})
const chartRef = ref<{update:(val?: string) => void} | null>(null)
const responseDataChart = ref([] as ICameraEmotions['data'])
const dataSrc = {
  labels: [] as string[],
  datasets: [] as {label: string, borderColor: string, backgroundColor: string, data: number[]}[]
}

let sub: Subscription
const secondsToMinutes = (seconds: number) => (`${new Date(seconds * 1000).toLocaleString('Ru-ru')}`)

const getData = () => {
  sub = getChartData(props.idCamera)
    .pipe(
      map(({data: {data}}) => data),
      repeatWhen(delay(TIME_GET_DATA_CHART))
    )
    .subscribe({
      next: (data) => {
        responseDataChart.value = data.reverse()
        setDataChart()
      },
      error: errorNotify('Ошибка загрузки данных')
    })
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  tooltips: {
    mode: 'point'
  }
}

const setDataChart = () => {
  if (dataSrc.datasets.length) {
    dataSrc.datasets[EMOTIONS.neutral].data = responseDataChart.value.map(second => second.v[0][EMOTIONS.neutral])
    dataSrc.datasets[EMOTIONS.happy].data = responseDataChart.value.map(second => second.v[0][EMOTIONS.happy])
    dataSrc.datasets[EMOTIONS.sad].data = responseDataChart.value.map(second => second.v[0][EMOTIONS.sad])
    dataSrc.datasets[EMOTIONS.surprise].data = responseDataChart.value.map(second => second.v[0][EMOTIONS.surprise])
    dataSrc.datasets[EMOTIONS.anger].data = responseDataChart.value.map(second => second.v[0][EMOTIONS.anger])
    dataSrc.datasets[EMOTIONS.fear].data = responseDataChart.value.map(second => second.v[0][EMOTIONS.fear])
    dataSrc.datasets[EMOTIONS.disgust].data = responseDataChart.value.map(second => second.v[0][EMOTIONS.disgust])
  } else {
    dataSrc.datasets = [
      {
        label: 'Нейтральное',
        borderColor: 'rgb(102,102,102)',
        backgroundColor: 'rgb(102,102,102)',
        data: responseDataChart.value.map(second => second.v[0][EMOTIONS.neutral])
      },
      {
        label: 'Счастье',
        borderColor: 'rgb(250,168,5)',
        backgroundColor: 'rgb(250,168,5)',
        data: responseDataChart.value.map(second => second.v[0][EMOTIONS.happy])
      },
      {
        label: 'Грусть',
        borderColor: 'rgba(38,122,191,0.82)',
        backgroundColor: 'rgba(38,122,191,0.82)',
        data: responseDataChart.value.map(second => second.v[0][EMOTIONS.sad])
      },
      {
        label: 'Удивление',
        borderColor: 'rgba(189,0,191,0.82)',
        backgroundColor: 'rgba(189,0,191,0.82)',
        data: responseDataChart.value.map(second => second.v[0][EMOTIONS.surprise])
      },
      {
        label: 'Злость',
        borderColor: 'rgba(191,6,0,0.82)',
        backgroundColor: 'rgba(191,6,0,0.82)',
        data: responseDataChart.value.map(second => second.v[0][EMOTIONS.anger])
      },
      {
        label: 'Страх',
        borderColor: 'rgba(6,12,14,0.82)',
        backgroundColor: 'rgba(6,12,14,0.82)',
        data: responseDataChart.value.map(second => second.v[0][EMOTIONS.fear])
      },
      {
        label: 'Отвращение',
        borderColor: 'rgba(14,191,7,0.82)',
        backgroundColor: 'rgba(14,191,7,0.82)',
        data: responseDataChart.value.map(second => second.v[0][EMOTIONS.disgust])
      }
    ]
  }

  dataSrc.labels = responseDataChart.value.map(second => secondsToMinutes(second.dt).split(', ')[1])
  chartRef.value && chartRef.value.update('active')
}

onMounted(() => {
  getData()
})

onUnmounted(() => {
  sub && sub.unsubscribe()
})

</script>

<style scoped>

</style>
