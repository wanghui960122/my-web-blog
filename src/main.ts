import { createApp } from 'vue'
import { createPinia } from 'pinia'
const pinia = createPinia()
import './utils/mouse.js'
import './styles/main.css'
import 'md-editor-v3/lib/style.css';
import '../public/live-2d/autoload.js'
import App from './App.vue'
import router from './routers/index'
import 'element-plus/theme-chalk/dark/css-vars.css'
import '@/styles/theme.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(router).use(pinia).mount('#app')
