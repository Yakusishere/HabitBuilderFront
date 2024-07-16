import './assets/main.scss'

import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from '@/router'
import App from '@/App.vue'
/* import App from './views/test2.vue' */
import { createPinia } from 'pinia'
import piniaPersist from 'pinia-plugin-persist'

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPersist)

app.use(pinia)
app.use(router);
app.use(ElementPlus);
app.mount('#app')
