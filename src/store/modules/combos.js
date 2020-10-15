import { HTTP } from '@/http-constants';

export default {
  state: {
    combos: []
  },

  mutations: {
    setCombos(state, val) {
      state.combos = val;
    }
  },

  actions: {
    async createCombo({ dispatch }, combo) {
      return new Promise((resolve, reject) => {
        HTTP.post('/combos', {
          character: combo.characterId,
          manipulation: combo.manipulation,
          youtubeId: combo.ytId,
          youtubeTimeStamp: combo.ytTimestamp
        }).then(res => {resolve(res)},
        error => {reject(error)})
      })
    },

    async fetchCombos({ commit }, character) {
      return new Promise((resolve, reject) => {
        HTTP.post('/combos/characterCombos', {characterId: character.characterId})
        .then(res => {
            commit('setCombos', res)
            resolve(res)
        },
        err => {reject(err)})
      })
    },

    async deleteCombo({ commit }, comboId) {
      return new Promise((resolve, reject) => {
        HTTP.delete('/combos/' + comboId.id).then(res => {resolve(res)},
        error => reject(error))
      })
    },

    async modifyCombo({commit}, combo) {
      return new Promise((resolve, reject) => {
        HTTP.put('/combos/' + combo._id, combo)
        .then(res => {resolve(res)},
        error => {
          reject(error)
        })
      })
    },
  }
};