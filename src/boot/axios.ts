import { boot } from 'quasar/wrappers'
import axios, {AxiosInstance,} from 'axios'
import {Cookies} from 'quasar';
import axios$ from 'axios-observable';


const api = axios.create({ baseURL: '/api' });
const video = axios.create({ baseURL: '/video' });
const api$ = axios$.create({ baseURL: '/api' });
const video$ = axios$.create({ baseURL: '' });

export function connectCSRFInterceptor (engine: AxiosInstance | axios$) {
  engine.interceptors.request.use(config => {
    config.headers = {
      'Content-Type': 'application/json',
      ...config.headers,
      'X-CSRFToken': Cookies.get('csrftoken')
    }
    return config
  })
}


export default boot(({ app }) => {
  connectCSRFInterceptor(api)
  connectCSRFInterceptor(api$)
})

export { axios, api, video, api$, video$ }
