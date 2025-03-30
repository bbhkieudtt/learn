import Login from '@/views/LogIn.vue'
import Forgot from '@/views/Forgot.vue'
import Main from '@/views/Main.vue'
import Detail from '@/views/DetailYard.vue'
import Info from '@/views/layout/DatailYard/InforYard.vue'
import Boking from '@/views/CreateBoking.vue'
import ListYard from '@/views/layout/YourYard/ListYard.vue'
import ListBoking from '@/views/layout/YourBoking/ListBoking.vue'
import Revenue from '@/views/layout/Revenue/Revenue.vue'



export const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/forgot', component: Forgot },
  { path: '/main', component: Main },
  { path: '/detail', component: Detail },
  { path: '/Info', component: Info },
  { path: '/Boking', component: Boking },
  { path: '/YourYard', component: ListYard },
  { path: '/yourboking', component: ListBoking },
  { path: '/revenue', component: Revenue },



]