import { createApp } from 'vue'
import App from './App.vue'
import { locale } from './app/locale'
import { query } from './app/query'
import { router } from './app/router'
import { store } from './app/store'
import './main.css'

const app = createApp(App)

app.use(locale)
app.use(router)
app.use(store)
app.use(query.plugin, query.options)

app.mount('#app')
