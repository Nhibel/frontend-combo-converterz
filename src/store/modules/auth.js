import {
  AUTH_REQUEST,
  AUTH_ERROR,
  AUTH_SUCCESS,
  AUTH_LOGOUT
} from '@/store/actions/auth';
import { USER_REQUEST } from '@/store/actions/user';
import { HTTP } from '@/http-constants';
import createPersistedState from 'vuex-persistedstate';

const plugins = [createPersistedState()];

const state = {
  token: localStorage.getItem('user-token') || '',
  status: '',
  hasLoadedOnce: false
};

const getters = {
  isAuthenticated: state => !!state.token,
  authStatus: state => state.status
};

const actions = {
  [AUTH_REQUEST]: ({ commit, dispatch }, user) => {
    return new Promise((resolve, reject) => {
      // The Promise used for router redirect in login
      commit(AUTH_REQUEST);
      HTTP.post('/auth/login', {
        email: user.email,
        password: user.password
      })
        .then(resp => {
          console.log('la réponse de', resp)
          const token = resp.data.token;
          const refresh_token = resp.data.refresh_token;
          const user = resp.data.user;
          localStorage.setItem('user-token', token); // store the token in localstorage
          localStorage.setItem('refresh-token', refresh_token); // store the refresh token in localstorage
          localStorage.setItem('user', JSON.stringify(user)); // store the user in localstorage
          HTTP.defaults.headers.common['Authorization'] = token;
          commit(AUTH_SUCCESS, token);
          // log in the user
          dispatch(USER_REQUEST, resp.data.user.email);
          resolve(resp);
        })
        .catch(err => {
          commit(AUTH_ERROR, err);
          localStorage.removeItem('user-token');
          localStorage.removeItem('refresh-token'); // store the refresh token in localstorage
          localStorage.removeItem('user');
          reject(err);
        });
    });
  },

  [AUTH_LOGOUT]: ({ commit, dispatch }) => {
    return new Promise((resolve, reject) => {
      commit(AUTH_LOGOUT);
      localStorage.removeItem('user-token');
      localStorage.removeItem('refresh-token');
      localStorage.removeItem('user');
      resolve();
    });
  },

  async verifyToken({ dispatch }, data) {
    return new Promise((resolve, reject) => {
      HTTP.grant_type = 'refresh_token';

      HTTP.post('/auth/verify-token', {
        token: data.refreshToken,
        user: data.user
      })
        .then(resp => {
          const token = resp.data.token;
          const refresh_token = resp.data.refresh_token;
          localStorage.setItem('user-token', token); // store the token in localstorage
          localStorage.setItem('refresh-token', refresh_token); // store the refresh token in localstorage
          HTTP.defaults.headers.common['Authorization'] = token;
          console.log('resp dans auth store', resp)
          resolve(resp)
        },
        error => {
          console.log('error dans auth store', error)
          reject(error)})
    })
  }
};

const mutations = {
  [AUTH_REQUEST]: state => {
    state.status = 'loading';
  },
  [AUTH_SUCCESS]: (state, token) => {
    state.status = 'success';
    state.token = token;
    state.hasLoadedOnce = true;
  },
  [AUTH_ERROR]: state => {
    state.status = 'error';
  },
  [AUTH_LOGOUT]: state => {
    state.token = '';
  }
};

export default {
  state,
  getters,
  actions,
  mutations,
  plugins
};
