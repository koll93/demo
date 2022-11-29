<template>

  <q-layout view="hHh Lpr lff" container style="height: 100vh">

      <q-header elevated style="background: #EF3124">
        <q-toolbar>
          <q-btn flat @click="drawer = !drawer" round dense icon="menu"/>
          <q-toolbar-title>Name</q-toolbar-title>
        </q-toolbar>
      </q-header>
      <q-drawer
        v-model="drawer"
        show-if-above
        :width="LEFT_MENU_WIDTH"
        :breakpoint="900"
      >

        <q-scroll-area style="height: calc(100% - 155px); margin-top: 150px; border-right: 1px solid #ddd; background: linear-gradient(#EF3124, rgb(51 0 0))">
          <q-list padding>

            <q-expansion-item
              expand-separator
              label="Управление камерами"
              switch-toggle-side
            >
              <q-item
                clickable
                v-ripple
                :to="{name: '__FIRST_SLOT_PAGE__'}"
              >
                <q-item-section avatar>
                  <q-icon color="white" name="cameraswitch"/>
                </q-item-section>

                <q-item-section>
                  Первый <br>слот
                </q-item-section>
              </q-item>

              <q-item
                clickable
                v-ripple
                :to="{name: '__SECOND_SLOT_PAGE__'}"
              >
                <q-item-section avatar>
                  <q-icon color="white" name="cameraswitch"/>
                </q-item-section>

                <q-item-section>
                  Второй <br>слот
                </q-item-section>
              </q-item>
            </q-expansion-item>

            <q-item
              clickable
              v-ripple
              :to="{name: '__ACTIVE_CAMERA_PAGE__', query: {slot: 1}}"
            >
              <q-item-section avatar>
                <q-icon color="white" name="camera"/>
              </q-item-section>

              <q-item-section>
                Активная <br>камера
              </q-item-section>
            </q-item>


            <q-item
              clickable
              v-ripple
              :to="{name: '__RESEARCH_PAGE__'}"
            >
              <q-item-section avatar>
                <q-icon color="white" name="biotech"/>
              </q-item-section>

              <q-item-section>
                Активные <br>исследования
              </q-item-section>
            </q-item>

            <q-item
              clickable
              v-ripple
              :to="{name: '__ARCHIVE_PAGE__'}"
            >
              <q-item-section avatar>
                <q-icon color="white" name="video_library"/>
              </q-item-section>

              <q-item-section>
                Архив
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>

        <q-img class="absolute-top" style="height: 150px">
          <div class="absolute-bottom" style="background: linear-gradient(rgb(255 255 255), #EF3124)">
            <q-avatar size="56px" class="q-mb-sm">
              <img src="../../assets/user.png">
            </q-avatar>
            <div class="text-weight-bold">FirstName LastName</div>
            <div style="display: flex; justify-content: space-between;">@userName
                <q-btn
                  size="12px"
                  round
                  outline
                  icon="directions"
                  @click="exit()"
                >
                  <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
                    <strong>Выход</strong><br>
                  </q-tooltip>
                </q-btn>
            </div>
          </div>
        </q-img>
      </q-drawer>

      <q-page-container class="page color-default-text">
        <router-view :key="$route.path"/>
      </q-page-container>

  </q-layout>
</template>

<script lang="ts" setup>
import {ref} from 'vue';
import {logout} from 'src/shared/auth'
import {useRouter} from 'vue-router';
import {LEFT_MENU_WIDTH} from 'pages/cabinet/cabinet.interface';

const drawer = ref(false)
const router = useRouter()

function exit() {
  logout()
  void router.push({name: '__LOGIN__'})
}

  // created() {
    // this.checkAuthLoading = true

    // this.$api.get('/usersdata/user-data/')
    //   .then(({data}) => {
    //     console.debug(data)
    //     this.checkAuthLoading = false
    //   }).catch((err) => {
    //   if (err.response?.status === 403) {
    //     // location.replace('/users/login')
    //     //   this.$router.push('/login')
    //   } else {
    //     this.$errorNotify()()
    //   }
    // })
  // }
</script>

<style scoped lang="scss">

.page {
  height: 100vh;
}

.column {
  color: black;
}

::v-deep(.q-expansion-item__toggle-icon) {
  color: white;
}

.q-router-link--active .column {
  color: white;
}

</style>
