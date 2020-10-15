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
        async fetchGames({ commit }) {
            const games = await HTTP.get('/games')
            commit('setGames', games);
        }
    },
};