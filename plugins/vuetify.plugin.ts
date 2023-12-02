// plugins/vuetify.js
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export default defineNuxtPlugin(nuxtApp => {
  const vuetify = createVuetify({
    ssr: true,
    components,
    directives,
    theme: {
      defaultTheme: 'dark',
      themes:{
        dark: {
          colors:{
            primary:"#C252E1",
            secondary:"#6ECBF5",
            error:"#FF5116",
            warning:"#f2a365",
            success:"#10E1E5",
            info:"#FF4778",
            danger:"#FF5116",
            background:"#2A2356",
          },
          variables:{
           "$card-border-color":"#555555",
          }
        }
        
      }
    }
  })

  nuxtApp.vueApp.use(vuetify)
})