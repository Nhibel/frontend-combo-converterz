import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import VueLazyload from 'vue-lazyload';
import { HTTP } from '@/http-constants';

import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import { AUTH_LOGOUT } from '@/store/actions/auth';

import './assets/custom.scss';

import VueYoutube from 'vue-youtube'

// Install BootstrapVue
Vue.use(BootstrapVue);
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin);

Vue.use(VueLazyload, {
  lazyComponent: true
});

Vue.use(VueYoutube)

Vue.config.productionTip = false;

const token = localStorage.getItem('user-token');
if (token) {
  HTTP.defaults.headers.common['Authorization'] = token;
}

HTTP.interceptors.response.use(
  response => {
    console.log('1 : ', response)
    console.log('the response status is:', response.status);
    return response;
  },
  error => {
    if (error.response.status === 401) {
      console.log('the error response status is:', error.response.status);
      console.log('the error response status is:', error);

      if (localStorage.getItem('user') && localStorage.getItem('refresh-token')) {
        const user = localStorage.getItem('user');
        const refreshToken = localStorage.getItem('refresh-token');
        store
          .dispatch('verifyToken', { user: user, refreshToken: refreshToken })
          .then(resp => {
            if (resp.status == 401) {
              store.dispatch(AUTH_LOGOUT).then(() => {
                router.push('/');
              });
            } else {
              console.log('dans error de l\'interceptor : ', error.response)
              router.push(this.$router.currentRoute);
            }
          });
      }else {
        return Promise.reject(error);
      }
      
    } else {
      return Promise.reject(error);
    }
  }
);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
