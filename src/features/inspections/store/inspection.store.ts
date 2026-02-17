import type { Module } from 'vuex'
import type { Inspection } from '../types/inspection.types'

export interface InspectionState {
  draft: Inspection | null
}

export const inspectionModule: Module<InspectionState, any> = {
  namespaced: true,
  state: () => ({
    draft: null
  }),

  mutations: {
    setUser(state, draft: Inspection | null) {
      state.draft = draft
    }
  },

  getters: {
    user: (state) => state.draft
  }
}
