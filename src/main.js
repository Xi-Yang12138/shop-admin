import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './style.css'
import App from './App.vue'
import 'virtual:windi.css'
import { router } from './router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import store from './store'

const app = createApp(App)

//挂载store
app.use(router)
app.use(store)
app.use(ElementPlus)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

import './permision'

import 'nprogress/nprogress.css'

import permission from './directives/permission'
app.use(permission)


app.mount('#app')

