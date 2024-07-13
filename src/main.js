import './assets/main.scss'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createApp } from 'vue'
import App from './views/AIPlan.vue'
/* import App from './test/testMultiple.vue' */
import pinia from './stores/pinia.js' 
/* import App from './App.vue' */
/* import router from '@/router' */
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
/* app.use(router); */

app.use(pinia)
app.use(ElementPlus)
app.mount('#app')
