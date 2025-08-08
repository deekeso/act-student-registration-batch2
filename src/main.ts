import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import router from './routes'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './styles/global.css'
import 'element-plus/theme-chalk/dark/css-vars.css'

const app = createApp(App)
const pinia = createPinia()
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(pinia)
app.use(ElementPlus)
app.use(router)
app.mount('#app')
