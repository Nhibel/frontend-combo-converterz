import { HTTP } from '@/http-constants';

export default {
    state: {
        games: []
    },

    mutations: {
        setGames(state, val) {
            state.games = val;
        }
    },

    actions: {
        async fetchGames({ dispatch, commit }) {
            return new Promise((resolve, reject) => {
                HTTP.get('/games').then(res => {
                    commit('setGames', res);
                    resolve(res)
                }, err => reject(err))
            })
        }
    },
};