import Test from '@/views/LogIn.vue'
import Forgot from '@/views/Forgot.vue'

export const routes = [
  { path: '/', redirect: '/test' },
  { path: '/test', component: Test },
  { path: '/forgot', component: Forgot },

]