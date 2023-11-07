import './assets/main.css'

import { createApp,  } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedState from "pinia-plugin-persistedstate"

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

import App from './App.vue'
import router from './router'

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";

const firebaseConfig = {
  apiKey: "AIzaSyAe8b6KsTaIW2XfWfV_0_dDXDr4Ce7eVng",
  authDomain: "smash-match-90d3f.firebaseapp.com",
  projectId: "smash-match-90d3f",
  storageBucket: "smash-match-90d3f.appspot.com",
  messagingSenderId: "305665707968",
  appId: "1:305665707968:web:25d6667fa604189200c225",
  measurementId: "G-2FFKXYJDGK",
  databaseURL: "https://smash-match-90d3f-default-rtdb.asia-southeast1.firebasedatabase.app"
};

const firebse = initializeApp(firebaseConfig)

const app = createApp(App)
app.config.globalProperties.$db = getFirestore(firebse)
app.config.globalProperties.$firebse = firebse

const pinia = createPinia();

pinia.use(piniaPluginPersistedState)
app.use(pinia)
app.use(router)

app.mount('#app')
