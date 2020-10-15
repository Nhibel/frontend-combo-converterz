import {
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_ERROR
} from '@/store/actions/register';
import { AUTH_REQUEST } from '@/store/actions/auth';
import { HTTP } from '@/http-constants';
import createPersistedState from 'vuex-persistedstate';

const plugins = [createPersistedState()];

const state = {
  token: localStorage.getItem('user-token') || '',
  status: ''
};

const getters = {
  //isAuthenticated: state => !!state.token,
  registerStatus: state => state.status
};

const actions = {
  [REGISTER_REQUEST]: ({ commit, dispatch }, user) => {
    return new Promise((resolve, reject) => {
      commit(REGISTER_REQUEST);
      let url = '/auth/signup';
      if (user.isAdmin != null || user.isAdmin == 1) {
        url = '/auth/signup-admin';
      }
      HTTP.post(url, {
        name: user.name,
        email: user.email,
        password: user.password,
        isAdmin: user.isAdmin
      })
        .then(response => {
          const token = response.data.token;
          HTTP.defaults.headers.common['Authorization'] = token;

          localStorage.setItem('user', JSON.stringify(response.data.user));
          localStorage.setItem('user-token', token);

          const email = user.email;
          const password = user.password;
          console.log(email, password);

          commit(REGISTER_SUCCESS, token);
          // dispatch(AUTH_REQUEST, { email, password });
          resolve(response);
        })
        .catch(error => {
          commit(REGISTER_ERROR, error);
          localStorage.removeItem('user-token');
          reject(error);
        });
    });
  }
};

const mutations = {
  [REGISTER_REQUEST]: state => {
    state.status = 'loading';
  },
  [REGISTER_SUCCESS]: (state, token) => {
    state.status = 'success';
    state.token = token;
  },
  [REGISTER_ERROR]: state => {
    state.status = 'error';
  }
};

export default {
  state,
  getters,
  actions,
  mutations,
  plugins
};
