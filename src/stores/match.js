import { defineStore } from 'pinia'

export const useMatchStore = defineStore('match', {
  state: () => ({
    isFindMatch: false
  }),
  actions: {
    isFinding(isFinding) {
      this.isFindMatch = isFinding
    }
  },
  persist: {
    storage: localStorage
  }
})