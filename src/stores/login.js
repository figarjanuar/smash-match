import { defineStore } from 'pinia'

export const useLoginStore = defineStore('login', {
  state: () => ({
    isLogin: false,
    userData: null
  }),
  actions: {
    logginIn(userData) {
      this.isLogin = true
      this.userData = userData
    }
  },
  persist: {
    storage: localStorage
  }
})