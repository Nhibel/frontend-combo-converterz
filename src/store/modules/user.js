import { USER_REQUEST, USER_ERROR, USER_SUCCESS } from '@/store/actions/user';
import { HTTP } from '@/http-constants';
import Vue from 'vue';
import { AUTH_LOGOUT } from '@/store/actions/auth';
import createPersistedState from 'vuex-persistedstate';

const plugins = [createPersistedState()];
const state = { status: '', profile: {} };

const getters = {
  getProfile: state => state.profile,
  isprofileLoaded: state => !!state.profile.name
};

const actions = {
  [USER_REQUEST]: ({ commit, dispatch }, email) => {
    commit(USER_REQUEST);
    HTTP.post('/auth/me', {
      email: email
    })
      .then(resp => {
        console.log('depuis user.js - then');
        // Récupération des données de l'user
        commit(USER_SUCCESS, resp);
      })
      .catch(() => {
        console.log('depuis user.js - catch');
        commit(USER_ERROR);
        dispatch(AUTH_LOGOUT);
      });
  }
};

const mutations = {
  [USER_REQUEST]: state => {
    state.status = 'loading';
  },
  [USER_SUCCESS]: (state, resp) => {
    state.status = 'success';
    Vue.set(state, 'profile', resp.data.user);
  },
  [USER_ERROR]: state => {
    state.status = 'error';
  },
  [AUTH_LOGOUT]: state => {
    state.profile = {};
  }
};

export default {
  state,
  getters,
  actions,
  mutations,
  plugins
};
