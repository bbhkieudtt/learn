// import type { Router } from 'vue-router'

// const checkAccessToken = (router: Router) => router.beforeEach((
//     to,
//     from,
//     proceed
// ) => {
//     proceed()
// })

// export const loadMiddleware = (router: Router) => {
//     checkAccessToken(router)
// }
import type { Router } from 'vue-router';

const checkAccessToken = (router: Router) => {
  router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token'); // Kiểm tra token trong localStorage

    // Nếu route yêu cầu đăng nhập mà không có token, chuyển hướng đến trang login
    if ((to.path !== '/login' && to.path !== '/forgot') && !token) {
      next('/login'); // Chuyển hướng về trang đăng nhập nếu không có token
    } else {
      next(); // Tiếp tục nếu có token hoặc không yêu cầu đăng nhập
    }
  });
};

export const loadMiddleware = (router: Router) => {
  checkAccessToken(router);
};
