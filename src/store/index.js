import Vue from 'vue';
import Vuex from 'vuex';
import user from './modules/user';
import auth from './modules/auth';
import register from './modules/register';
import games from './modules/games';
import characters from './modules/characters';
import combos from './modules/combos';
import tools from './modules/tools';
import createPersistedState from 'vuex-persistedstate';
import { HTTP } from '@/http-constants';

Vue.use(Vuex);

const state = {
  games: []
};

export default new Vuex.Store({
  
  modules: {
    user,
    auth,
    register,
    games,
    characters,
    combos,
    tools
    },
    
  plugins: [createPersistedState()]
});
