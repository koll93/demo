<template>
  <div style="height: 250px">
    <vue3-chart-js
      ref="chartRef"
      type="polarArea"
      :data="dataSrc"
      :options="chartOptions"
    />
    <template v-if="!isLoading">
      <div class="flex justify-center items-center q-mt-md">
        <div :style="{height: '15px', width: '40px', background: colorMainEmotion}"></div>
        <span class="q-ml-md">{{nameEmotion}}</span>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>

const TIME_GET_DATA_CHART = 1000
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Vue3ChartJs from '@j-t-mcc/vue3-chartjs';
import {computed, onMounted, onUnmounted, ref} from 'vue';
import {getChartData} from 'src/shared/api';
import {errorNotify} from 'boot/injections';
import {EMOTIONS} from 'pages/cabinet/cabinet.interface';
import {delay, map, repeatWhen} from 'rxjs/operators';
import {IEmotionsRecord} from 'src/shared/api.interface';
import {Subscription} from 'rxjs';

const props = defineProps({
  idCamera: {
    type: String,
    required: true
  }
})
const chartRef = ref<{update:() => void} | null>(null)
const responseDataChart = ref<IEmotionsRecord>({} as IEmotionsRecord)
const dataSrc = {
  labels: [] as string[],
  datasets: [] as {label: string, borderColor: string[], backgroundColor: string[], data: number[]}[]
}

let sub: Subscription
const isLoading = ref(true)
const mainEmotion = computed(() => responseDataChart.value.v[0].findIndex(val => val === Math.max(...responseDataChart.value.v[0])))
const colorMainEmotion = computed(() => dataSrc.datasets[0].backgroundColor[mainEmotion.value])
const nameEmotion = computed(() => dataSrc.labels[mainEmotion.value])

const getData = () => {
  sub = getChartData(props.idCamera)
    .pipe(
      map(({data: {data}}) => data),
      repeatWhen(delay(TIME_GET_DATA_CHART))
    )
    .subscribe({
      next: (data) => {
        responseDataChart.value = data[0]
        setDataChart()
        isLoading.value = false
      },
      error: errorNotify('Ошибка загрузки данных')
    })
}

const chartOptions = {
  plugins: {
    legend: {
      position: 'null'
    }
  },
  responsive: true,
  maintainAspectRatio: false,
  tooltips: {
    mode: 'point'
  },
  animation: {
    animateScale: true,
    animateRotate: true
  }
}

const setDataChart = () => {
  if (dataSrc.datasets.length) {
    dataSrc.datasets[0].data = [
      responseDataChart.value.v[0][EMOTIONS.neutral],
      responseDataChart.value.v[0][EMOTIONS.happy],
      responseDataChart.value.v[0][EMOTIONS.sad],
      responseDataChart.value.v[0][EMOTIONS.surprise],
      responseDataChart.value.v[0][EMOTIONS.anger],
      responseDataChart.value.v[0][EMOTIONS.fear],
      responseDataChart.value.v[0][EMOTIONS.disgust]
    ]
  } else {
    dataSrc.datasets = [
      {
        label: 'dataset',
        borderColor: [
          'rgba(255,255,255,0.6)',
          'rgba(255,255,255,0.6)',
          'rgba(255,255,255,0.6)',
          'rgba(255,255,255,0.6)',
          'rgba(255,255,255,0.6)',
          'rgba(255,255,255,0.6)',
          'rgba(255,255,255,0.6)'
        ],
        backgroundColor: [
          'rgba(102,102,102,0.6)',
          'rgba(250,168,5,0.6)',
          'rgba(38,122,191,0.6)',
          'rgba(189,0,191,0.6)',
          'rgba(191,6,0,0.6)',
          'rgba(6,12,14,0.6)',
          'rgba(14,191,7,0.6)'
        ],
        data: [
          responseDataChart.value.v[0][EMOTIONS.neutral],
          responseDataChart.value.v[0][EMOTIONS.happy],
          responseDataChart.value.v[0][EMOTIONS.sad],
          responseDataChart.value.v[0][EMOTIONS.surprise],
          responseDataChart.value.v[0][EMOTIONS.anger],
          responseDataChart.value.v[0][EMOTIONS.fear],
          responseDataChart.value.v[0][EMOTIONS.disgust]
        ]
      }
    ]
  }

  dataSrc.labels = ['Нейтральное', 'Счастье', 'Грусть', 'Удивление', 'Злость', 'Страх', 'Отвращение']
  chartRef.value && chartRef.value.update()
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
