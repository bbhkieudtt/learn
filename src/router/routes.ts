import Test from '@/views/LogIn.vue'

export const routes = [
  { path: '/', redirect: '/test' },
  { path: '/test', component: Test },
]