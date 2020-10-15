import { HTTP } from '@/http-constants';

export default {
    state: {
        characters: [],
        gameCharacters: []
    },

    mutations: {
        setCharacters(state, val) {
            state.characters = val;
        },
        setCharactersFromGame(state, val) {
            state.gameCharacters = val;
        }
    },

    actions: {
        async addCharacter({ dispatch }, character) {
            HTTP.post('/characters', {
              name: character.name,
              game: character.select
            });
          },

        async fetchCharacters({ commit }) {
            const characters = await HTTP.get('/characters')
            commit('setGames', characters);
        },

        async fetchCharactersFromGame({ commit }, gameId) {
            return new Promise((resolve, reject) => {
                HTTP.post('/characters/charactersFromGame', { gameId: gameId })
                .then(res => {
                    commit('setCharactersFromGame', res)
                    resolve(res)
                },
                    error => {reject(error)})
            })
        },

        async fetchCharacterById({commit}, characterId) {
            return new Promise((resolve, reject) => {
                HTTP.get('/characters/' + characterId)
                .then(res => {resolve(res)}, 
                err => reject(err))
            })
        }
    },
};