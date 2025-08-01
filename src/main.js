import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import router from './router'

import en from './locales/en.json'
import es from './locales/es.json'

import './assets/base.css' // Import global base styles
import './assets/main.css' // Import global main styles

const storedLocale = localStorage.getItem('selectedLanguage') || 'es'; // Default to 'es' if not found

const i18n = createI18n({
  legacy: true, // Enable legacy API mode for Options API compatibility
  locale: storedLocale, // set locale
  fallbackLocale: 'en', // set fallback locale
  messages: {
    en,
    es,
  },
})

const app = createApp(App)

app.use(router)
app.use(i18n)

// Inicializar proveedor de publicidad después de crear la app
app.mount('#app');

// Inicializar publicidad de forma asíncrona
initializeAdProvider().then(() => {
  console.log('Proveedor de publicidad inicializado');
}).catch(error => {
  console.error('Error inicializando proveedor de publicidad:', error);
});