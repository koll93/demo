<template>
  <q-card-section class="flex justify-start q-pt-lg">
    <div class="row full-width items-center">
      <q-select
        dense
        outlined
        :options="select.options"
        v-model="select.value"
        :display-value="select.value?.title"
        label="Выбор камеры"
        class="col-5"
        @update:model-value="isLoading = true"
      >
        <template v-slot:option="scope">
          <q-item v-bind="scope.itemProps">
            <q-item-section>
              <q-item-label v-html="scope.opt.title" />
            </q-item-section>
          </q-item>
        </template>
      </q-select>

      <q-select
        class="q-ml-md col-xs-5 col-xl-2"
        dense
        outlined
        :options="selectSlot.options"
        v-model="selectSlot.value"
        map-options
        :display-value="selectSlot.value + 1"
        :label="`Выбор слота`"
      >
        <template v-slot:option="scope">
          <q-item v-bind="scope.itemProps">
            <q-item-section avatar>
              <q-icon color="primary" name="videocam" />
            </q-item-section>
            <q-item-section>
              <q-item-label v-html="scope.opt + 1" />
            </q-item-section>
          </q-item>
        </template>
      </q-select>


      <q-btn
        color="red"
        outline
        label="Перезапустить слот"
        no-caps
        class="q-ml-auto"
        :disable="isLoading"
        @click="refreshSlot"
      />

    </div>
  </q-card-section>

  <q-card-section class="flex column q-pa-none">
      <CameraPlayer
        ref="cameraRef"
        :slot-num="selectSlot.value"
        no-refresh

        @markActivatedCamera="isLoading = false"
        @unmarkCamera="isLoading = false"
      />
  </q-card-section>

  <q-card-section v-if="select.value?.id && !isLoading && withGraph" class="flex justify-between q-pt-lg column content-center">
    <Chart :id-camera="select.value.id"/>
  </q-card-section>

</template>

<script lang="ts" setup>
import {nextTick, onBeforeMount, onMounted, onUnmounted, reactive, ref, toRef, watch} from 'vue'
import {errorNotify} from 'boot/injections';
import {getActiveCameras, getCameras, getResearch} from 'src/shared/api';
import {ICamera, IResearch} from 'src/shared/api.interface';
import CameraPlayer from 'pages/cabinet/components/camera-slot/CameraPlayer.vue';
import {forkJoin, repeat, Subscription, tap} from 'rxjs';
import {DeepNonNullableRequired} from 'pages/cabinet/cabinet.interface';
import {filter, map} from 'rxjs/operators';
import Chart from 'src/pages/cabinet/components/Chart.vue'

let activeCamera$: Subscription

const isLoading = ref(false)
const cameraRef = ref<typeof CameraPlayer | null>(null)
const select = reactive({
  options: [] as DeepNonNullableRequired<ICamera>[],
  value: null as ICamera | null
})

const selectSlot = reactive({
  options: [0, 1],
  value: 0
})

const props = defineProps<{
  idResearch?: string
  withGraph?: boolean
}>()

watch(() => toRef(selectSlot, 'value'), () => {
  void nextTick().then(() => {
    select.value = null
    cameraRef.value!.stopCamera()
  })
})

watch(() => toRef(select, 'value'), () => {
  isLoading.value = true
  select.value && cameraRef.value!.startSlot(select.value?.id, props.idResearch)
})


const refreshSlot = () => {
  if (select.value) {
    isLoading.value = true
    cameraRef.value!.startSlot(select.value?.id, props.idResearch)
  }
}

const getSelectData = () => {
  const request = props.idResearch ? [getCameras(), getResearch(props.idResearch)] : [getCameras()]

  forkJoin(request)
    .pipe(
      map(([cameras, research]) => ([cameras as DeepNonNullableRequired<ICamera>[], research as DeepNonNullableRequired<IResearch> | undefined]) as const)
    )
    .subscribe({
      next: ([cameras, research]) => {
        if (research?.cameras.length) {
          cameras = cameras
            .filter(camera => research.cameras.map(camera => camera.id).includes(camera.id))
        }
        select.options = cameras
        select.value = select.options[0]
        activeCamera$ = setActiveCamera()
      },
      error: errorNotify('Ошибка загрузки данных')
    })
}

const setActiveCamera = () => {
  return getActiveCameras()
    .pipe(
      map(camera_ids => camera_ids[selectSlot.value]),
      filter(camera_id => !!camera_id && camera_id !== select.value),
      repeat({ delay: 5000 })
    )
    .subscribe({
      next: (camera_id) => {
        const activeCamera = select.options.find(camera => camera.id === camera_id)
        activeCamera && (select.value = activeCamera)
      },
      error: errorNotify('Ошибка загрузки данных')
    })
}


onBeforeMount(() => {
  getSelectData()
})

onMounted(() => {
  cameraRef.value!.stopCamera()
})

onUnmounted(() => {
  activeCamera$ && activeCamera$.unsubscribe()
})



</script>

<style lang="scss" scoped>
.spinner-leave-active {
  animation: fadeIn 1s;
}
@keyframes fadeIn {
  0% {opacity: 1}
  100% {opacity: 0}
}
</style>
