
// ]
import { createRouter, createWebHistory } from 'vue-router';
import Login from '@/views/LogIn.vue';
import Forgot from '@/views/Forgot.vue';
import Main from '@/views/Main.vue';
import Detail from '@/views/DetailYard.vue';
import Info from '@/views/layout/DatailYard/InforYard.vue';
import Boking from '@/views/CreateBoking.vue';
import ListYard from '@/views/layout/YourYard/ListYard.vue';
import ListBoking from '@/views/layout/YourBoking/ListBoking.vue';
import Revenue from '@/views/layout/Revenue/Revenue.vue';
import Forget from '@/views/Forget.vue';
import ListBokingCout from '@/views/layout/DatailYard/ListBokingCout.vue';
import Success from '@/components/StatusPayment/Success.vue';
import Failure from '@/components/StatusPayment/Failure.vue';
import InforUse from '@/views/InforUse.vue';
import InfoBooking from '@/views/InfoBooking.vue';
import ListBokings from '@/views/layoutAdmin/ListBoking.vue';
import Report from '@/views/layoutAdmin/Report.vue';
import PayCourt from '@/views/layoutAdmin/PayCourt.vue';



// Định nghĩa routes
export const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/forgot', component: Forgot },
  { path: '/forget', component: Forget },
  { path: '/main', component: Main },
  { path: '/detail', component: Detail },
  { path: '/Info', component: Info },
  { path: '/Boking', component: Boking },
  { path: '/YourYard', component: ListYard },
  { path: '/yourboking', component: ListBoking },
  { path: '/revenue', component: Revenue },
  { path: '/bokingCout', component: ListBokingCout },
  { path: '/success', component: Success },
  { path: '/failure', component: Failure },
  { path: '/inforUse', component: InforUse },
  { path: '/infobooking', component: InfoBooking },
  { path: '/totalboking', component: ListBokings },
  { path: '/report', component: Report },
  { path: '/paycourt', component: PayCourt },




  




];

// Tạo Vue Router với các routes đã định nghĩa
const router = createRouter({
  history: createWebHistory('/'), // Thay process.env.BASE_URL bằng '/' hoặc URL của bạn
  routes,
});

// Route Guard để kiểm tra token trước khi cho phép truy cập các route yêu cầu đăng nhập
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token'); // Lấy token từ localStorage

  // Nếu route yêu cầu đăng nhập mà không có token, chuyển hướng về trang login
  if ((to.path !== '/login' && to.path !== '/forgot' && to.path !== '/forget') && !token) {
    next('/login'); // Chuyển hướng đến trang đăng nhập nếu chưa đăng nhập
  } else {
    next(); // Tiếp tục điều hướng nếu có token hoặc route không yêu cầu đăng nhập
  }
});

export default router;
