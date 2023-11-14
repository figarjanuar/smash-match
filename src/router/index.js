import { createRouter, createWebHistory } from 'vue-router'
import PageIndex from '../views/PageIndex.vue'
import { getAuth, onAuthStateChanged } from "firebase/auth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: PageIndex,
      redirect: { name: 'my-match' },
      meta: {
        authRequired: true,
      },
      children: [
        {
          path: '',
          name: 'my-match',
          component: () => import('../views/MyMatchView.vue')
        },
        {
          path: 'match-detail',
          name: 'match-detail',
          props: {
            match: {}
          },
          component: () => import('../views/MatchDetail.vue')
        },
        {
          path: 'find-match',
          name: 'find-match',
          component: () => import('../views/FindMatchView.vue')
        },
        {
          path: 'profile',
          name: 'profile',
          component: () => import('../views/ProfileView.vue')
        }
      ],
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  const auth = getAuth()

  if (to.matched.some(record => record.meta.authRequired)) {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        next();
      } else {
        next({
          path: '/login'
        })
      }
    })
  } else {
    next()
  }
})

export default router
