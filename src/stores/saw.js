import { defineStore } from 'pinia'

export const useSawStore = defineStore('saw', {
  state: () => ({
    isFindMatch: false
  }),
  actions: {
    isFinding(isFinding) {
      this.isFindMatch = isFinding
    }
  }
})