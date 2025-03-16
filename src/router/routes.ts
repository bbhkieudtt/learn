import Test from '@/views/LogIn.vue'
import Forgot from '@/views/Forgot.vue'
import Main from '@/views/Main.vue'
import Detail from '@/views/DetailYard.vue'
import Info from '@/views/layout/DatailYard/InforYard.vue'


export const routes = [
  { path: '/', redirect: '/test' },
  { path: '/test', component: Test },
  { path: '/forgot', component: Forgot },
  { path: '/main', component: Main },
  { path: '/detail', component: Detail },
  { path: '/Info', component: Info },

]