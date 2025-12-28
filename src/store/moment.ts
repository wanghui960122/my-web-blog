import { defineStore } from 'pinia'
import { labelApi } from '../http/api'

export const useMomentStore = defineStore('moment', {
  state: () => ({
    labels: [],
    categarys: []
  }),
  actions: {
    async getLabels() {
      // TODO: get labels from backend
      const res = await labelApi.getLabels() as Record<string, any>
      if (res.code === 0) {
        this.labels = res.data
      }
    },
    async getCategarys() {
      // TODO: get categarys from backend
      const res = await labelApi.getCategarys() as Record<string, any>
      if (res.code === 0) {
        this.categarys = res.data
      }
    }
  }
})