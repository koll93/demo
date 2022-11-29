<template>
  <q-page class="q-pa-md row items-start full-height" ref="pageRef">
    <q-card class="full-width full-height">
      <q-card-section class="column items-center justify-center">

        <div class="row items-center justify-center full-width">

          <span class="text-h6">Назначить исследование для слота №{{SLOT_NUM + 1}}</span>

          <q-select
            :disable="!select.options.length"
            clearable
            dense
            outlined
            :options="select.options"
            v-model="select.value"
            :display-value="select.value?.title"
            label="Выбор активного исследования"
            class="q-ml-md col-2"
            @update:model-value="deactivateCamera"
          >
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section>
                  <q-item-label v-html="scope.opt.title" />
                  <q-item-label caption>{{dateTransform(scope.opt.started_at)}}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>


          <transition name="spinner" class="absolute-top-right q-mr-lg q-mt-lg">
            <div v-show="isLoading">
              <q-spinner-cube
                color="red"
                size="2em"
              />
              <span class="q-ml-md">Подключение...</span>
            </div>
          </transition>

        </div>
        <Map ref="mapRef" v-if="widthScreen" @activateCamera="activateCamera" @deactivateCamera="deactivateCamera" :width="widthScreen"/>
      </q-card-section>
    </q-card>
    <MovableWindow ref="windowRef">
      <q-card class="col-xs-12 col-sm-12 col-md-8 col-lg-5 col-xl-5" style="width: 600px">
        <CameraPlayer ref="cameraRef" :slot-num="SLOT_NUM" @markActivatedCamera="markCamera" @unmarkCamera="unmarkCamera"/>
      </q-card>
    </MovableWindow>
  </q-page>
</template>


<script lang="ts" setup>
import Map from 'pages/cabinet/components/camera-slot/Map.vue';
import {onBeforeMount, onMounted, reactive, ref} from 'vue';
import {LEFT_MENU_WIDTH} from 'pages/cabinet/cabinet.interface';
import {QPage, useQuasar} from 'quasar';
import {useRoute} from 'vue-router';
import CameraPlayer from 'pages/cabinet/components/camera-slot/CameraPlayer.vue';
import MovableWindow from 'pages/cabinet/components/camera-slot/MovableWindow.vue';
import {finalize} from 'rxjs';
import {getActiveResearches} from 'src/shared/api';
import {IActiveResearch} from 'src/shared/api.interface';
import {dateTransform} from 'src/shared/utils'

const route = useRoute()
const SLOT_NUM = route.name === '__FIRST_SLOT_PAGE__' ? 0 : 1

const widthScreen = ref(0)
const mapRef = ref<typeof Map | null>(null)
const cameraRef = ref<typeof CameraPlayer | null>(null)
const pageRef = ref<QPage | null>(null)
const windowRef = ref<typeof MovableWindow | null>(null)

let isInit = false
const $q = useQuasar()
const isLoading = ref(false)

const select = reactive({
  options: [] as IActiveResearch[],
  value: null as IActiveResearch | null
})

const activateCamera = (id: string) => {
  isLoading.value = true
  cameraRef.value!.startSlot(id, select.value?.id)
  isInit = true
}

const deactivateCamera = () => {
  isLoading.value = true
  cameraRef.value!.stopCamera()
}

const markCamera = (id: string) => {
  mapRef.value!.markActivatedCamera(id)
  isInit && windowRef.value!.maximize()
  isInit = true
  isLoading.value = false
}

const unmarkCamera = (id: string) => {
  mapRef.value!.unmarkCamera(id)
  windowRef.value!.minimize()
  isLoading.value = false
}


const getResearch = () => {
  $q.loading.show()
  getActiveResearches()
    .pipe(finalize(() => ($q.loading.hide())))
    .subscribe({
      next: (activeResearches) => {
        select.options = activeResearches
      }
    })
}

onBeforeMount(() => {
  getResearch()
})

onMounted(() => {
  widthScreen.value = window.innerWidth - LEFT_MENU_WIDTH
  // отключаем клик правой кнопкой для корректной работы контекстного меню карты
  pageRef.value!.$el.addEventListener('contextmenu', (evt: Event) => {
    evt.preventDefault()
  })
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

.spinner-enter-active {
  animation: enterIn 1s;
}

@keyframes enterIn {
  100% {opacity: 1}
  0% {opacity: 0}
}

</style>
