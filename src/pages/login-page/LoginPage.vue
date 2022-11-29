<template>
  <div class="page login">
    <div class="wrapper">
      <div class="page_title">
        <h1>name1</h1>
        <span>name2</span>
      </div>
      <p class="description"></p>

      <div class="q-pa-md" style="width: 300px; display: inline-block;">

        <q-form
          @submit="onSubmit"
          class="q-gutter-md"
        >
          <q-input
            filled
            v-model="loginStr"
            label="Логин"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Введите логин']"
          />

          <q-input
            filled
            type="password"
            v-model="passwordStr"
            label="Пароль"
            lazy-rules
            :rules="[val => val && val.length > 0 || 'Введите пароль']"
          />
          <div>
            <q-btn label="Войти" type="submit" color="primary"/>
          </div>

        </q-form>

      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>

import {ref} from 'vue';
import {login} from 'src/shared/auth'
import {useRouter} from 'vue-router';

const router = useRouter()
const loginStr = ref('')
const passwordStr = ref('')

function onSubmit () {
  login()
  void router.push({name: '__ACTIVE_CAMERA_PAGE__'})
}
</script>

<style scoped>
  .login {
    background-color: #161544;
    height: 100vh;
  }
  .login .wrapper {
    text-align: center;
    padding-top: 13vh;
  }
  .page_title {
    display: inline-flex;
    flex-direction: column;
    align-items: flex-end;
    margin-bottom: 20px;
  }
  .page_title h1 {
    font-weight: bold;
    font-size: 36px;
    line-height: 42px;
    letter-spacing: 0.295em;
    text-transform: uppercase;
    margin: 0;
  }
  .wrapper {
    position: relative;
  }
  .page_title, .description {
    color: #fff;
  }
  .page_title span {
    font-weight: bold;
    font-size: 14px;
    line-height: 16px;
    letter-spacing: 0.295em;
    text-transform: uppercase;
    margin-right: 5px;
  }
  .description {
    font-weight: 300;
    font-size: 16px;
    line-height: 19px;
    text-align: center;
  }
  .q-pa-md {
    background: white;
    padding: 30px;
    border-radius: 20px;
    box-shadow: 0 10px 70px 15px rgba(38, 178, 201, 0.6);
  }
</style>
