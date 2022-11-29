import type { RouteRecordRaw } from 'vue-router';
import routesCabinet from 'pages/cabinet/routesCabinet';

let routes: RouteRecordRaw[] = [
  {
    path: '/login',
    component: () => import('pages/login-page/LoginPage.vue'),
    name: '__LOGIN__'
  },
  {
    path: '/:catchAll(.*)',
    component: () => import('pages/error-page/ErrorPage.vue')
  }
];


routes = [...routesCabinet, ...routes]


export default routes;
