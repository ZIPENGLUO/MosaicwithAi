import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'
import App from './App.vue'
import router from './router'
import './styles.css'

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'svg'
  },
  theme: {
    defaultTheme: 'mosaic',
    themes: {
      mosaic: {
        dark: false,
        colors: {
          background: '#FCF9F6',
          surface: '#FCF9F6',
          primary: '#99462a',
          secondary: '#41674c',
          error: '#ba1a1a',
          'surface-variant': '#f0edeb'
        }
      }
    }
  }
})

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(vuetify)
app.mount('#app')
