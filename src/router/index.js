import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '@/views/Home.vue';
import store from '@/store'; // your vuex store

Vue.use(VueRouter);

const ifNotAuthenticated = (to, from, next) => {
  console.log('ifNotAuthenticated')
  if (!store.getters.isAuthenticated) {
    next();
    return;
  }
  next('/');
};

const ifAuthenticated = (to, from, next) => {
  console.log('ifAuthenticated')
  let user = JSON.parse(localStorage.getItem('user'));
  if (store.getters.isAuthenticated) {
    console.log('isAthenticated')
    next();
    return;
  } else {
    console.log('y a un bug')
  }
  console.log('ifauthenticatd 2')
  next('/');
};

// const ifAuthenticatedAndAdmin = (to, from, next) => {
//   let user = JSON.parse(localStorage.getItem('user'));

//   if (user != null) {
//     if (store.getters.isAuthenticated && user.isAdmin) {
//       next();
//       return;
//     }
//   }

//   next('/');
// };

const routes = [
  // {
  //   path: '/',
  //   name: 'HelloWorld',
  //   component: HelloWorld
  // },
  // {
  //   path: '/login',
  //   name: 'Login',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () =>
  //     import(/* webpackChunkName: "login" */ '../views/Login.vue'),
  //   beforeEnter: ifNotAuthenticated
  // },
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/register',
    name: 'Register',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(
        /* webpackChunkName: "register" */ '../components/RegisterForm.vue'
      ),
    beforeEnter: ifNotAuthenticated
  },
  {
    path: '/characters',
    name: 'Characters',
    component: () =>
      import(/* webpackChunkName: "characters" */ '../views/Characters.vue'),
    beforeEnter: ifAuthenticated
  },
  {
    path: '/characters/:id',
    name: 'ComboCharacter',
    props: true,
    component: () =>
      import(/* webpackChunkName: "userboard" */ '../views/ComboCharacter.vue')
    // beforeEnter: ifAuthenticated
  },

  {
    path: '/settings',
    name: 'Settings',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "settings" */ '../views/Settings.vue'),
    beforeEnter: ifAuthenticated
  },
  // {
  //   path: '/admin',
  //   name: 'Admin',
  //   component: () =>
  //     import(/* webpackChunkName: "admin" */ '../views/Admin.vue'),
  //   beforeEnter: ifAuthenticatedAndAdmin
  // }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

// router.beforeEach((to, from, next) => {
//   if (to.matched.some(record => record.meta.requiresAuth)) {
//     if (localStorage.getItem('user-token') == null) {
//       console.log(localStorage.getItem('user-token'));
//       next({
//         path: '/login',
//         params: { nexUrl: to.fullPath }
//       });
//     } else {
//       let user = JSON.parse(localStorage.getItem('user'));
//       if (to.matched.some(record => record.meta.isAdmin)) {
//         if (user.isAdmin == 1) {
//           next();
//         } else {
//           next({ name: 'Userboard' });
//         }
//       } else {
//         next();
//       }
//     }
//   } else if (to.matched.some(record => record.meta.guest)) {
//     if (localStorage.getItem('user-token') == null) {
//       next();
//     } else {
//       next({ name: 'Userboard' });
//     }
//   } else {
//     next();
//   }
// });

export default router;
