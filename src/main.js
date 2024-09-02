import './assets/main.scss'
import * as ElIcons from '@element-plus/icons-vue'
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import naive from 'naive-ui'
import router from '@/router'
import App from '@/App.vue'
/*import App from '@/views/community/components/BrowsePost.vue'*/
import { createPinia } from 'pinia'
import piniaPersist from 'pinia-plugin-persist'


const app = createApp(App);

// 注册所有图标组件
for (const [key, component] of Object.entries(ElIcons)) {
    app.component(key, component)
}

const pinia = createPinia();
pinia.use(piniaPersist)

app.use(pinia)
app.use(router);
app.use(ElementPlus);
app.use(naive);
app.mount('#app')
