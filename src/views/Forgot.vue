<template>
  <div class="text-center">
    <main class="bg-login fixed z-0 top-0 left-0 w-full h-screen gradient-custom-forgot pt-20">
      <div class="flex z-50 px-20 justify-between">
        <div>
          <h1 class="flex text-4xl font-bold text-slate-900">Pickleball</h1>
          <!--  -->
          <p class="flex text-xl text-slate-900">
            Sân Pickleball của bạn, niềm vui của chúng tôi
          </p>
        </div>
        <!--  -->
        <div class="sm:w-96 bg-white drop-shadow-2xl rounded-3xl p-5 ">
          <div class="text-center flex flex-col gap-4">
            <img src="@/assets/imgs/logoPick.png" class="h-[100px] w-[100px] mx-auto" alt="" />
            <h1 class="text-2xl font-semibold text-black">
              Đăng kí tài khoản
            </h1>
          </div>
          <!--  -->
          <form>
            <div class="px-0 py-8" v-if="!status_login">
              <div class="group relative z-0 mb-6 w-full">
                <input v-model="account_login.username" type="text"
                  class="peer block w-full appearance-none rounded-xl border border-slate-300 bg-transparent pt-4 pb-2 pl-4 text-sm font-medium text-gray-900 ring-orange-200 focus:border-orange-600 focus:outline-none focus:ring-4"
                  placeholder=" " /><label for="floating_email"
                  class="bg-red absolute top-0.5 left-0 -z-10 origin-[0] -translate-y-3 scale-75 transform pt-3 pl-6 text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-3 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-orange-600">Nhập
                  tên người dùng</label>
              </div>
              <!--  -->
              <div class="group relative z-0 mb-6 w-full">
                <input v-model="account_login.password" type="password"
                  class="peer block w-full appearance-none rounded-xl border border-slate-300 bg-transparent pt-4 pb-2 pl-4 text-sm font-medium text-gray-900 ring-orange-200 focus:border-orange-600 focus:outline-none focus:ring-4"
                  placeholder=" " /><label for="floating_email"
                  class="bg-red absolute top-0.5 left-0 -z-10 origin-[0] -translate-y-3 scale-75 transform pt-3 pl-6 text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-3 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-orange-600">Nhập
                  mật khẩu</label>
              </div>
              <!--  -->
              <!--  -->
              <div class="group relative z-0 mb-6 w-full">
                <input v-model="password_confirm" type="password"
                  class="peer block w-full appearance-none rounded-xl border border-slate-300 bg-transparent pt-4 pb-2 pl-4 text-sm font-medium text-gray-900 ring-orange-200 focus:border-orange-600 focus:outline-none focus:ring-4"
                  placeholder=" " /><label for="floating_email"
                  class="bg-red absolute top-0.5 left-0 -z-10 origin-[0] -translate-y-3 scale-75 transform pt-3 pl-6 text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-3 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-orange-600">Xác
                  nhận lại mật khẩu</label>
              </div>
              <!--  -->
               <!--  -->
               <div class="group relative z-0 mb-6 w-full">
                <input v-model="account_login.email" type="email"
                  class="peer block w-full appearance-none rounded-xl border border-slate-300 bg-transparent pt-4 pb-2 pl-4 text-sm font-medium text-gray-900 ring-orange-200 focus:border-orange-600 focus:outline-none focus:ring-4"
                  placeholder=" " /><label for="floating_email"
                  class="bg-red absolute top-0.5 left-0 -z-10 origin-[0] -translate-y-3 scale-75 transform pt-3 pl-6 text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-3 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-orange-600">Nhập email</label>
              </div>
              <!--  -->
              <button @click="login" type="submit"
                class="mt-5 w-full text-sm h-11 rounded-full bg-slate-800 py-3 font-medium text-white hover:bg-black">
                Tạo tài khoản
              </button>
              <div class="mt-4 text-center text-xs+">
                <p class="line-clamp-1 cursor-pointer hover:underline text-primary">
                  <span>Có tài khoản? <span class=" text-primary cusor-pointer">Đăng nhập</span> </span>
                </p>
              </div>
            </div>
            <!--  -->
            <!-- icoon -->
            <dotlottie-vue v-else src="https://lottie.host/15eb8737-4bdb-4de2-947f-911a7bb8c299/wwc62eFWV3.lottie"
              autoplay loop></dotlottie-vue>
          </form>
        </div>
        <!--  -->
      </div>
    </main>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { DotLottieVue } from "@lottiefiles/dotlottie-vue";
import { tr } from "date-fns/locale";
import { apiCreateUser } from "@/service/api/api";
// 
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

/**kiểu dữ liệu*/
import type {User } from '@/interface'
const status_login = ref(false);

/***Biến danh sách*/
const list_menu = ref([
  {
    name_menu: "Miễn phí",
    link_menu: "https://home.merchant.vn/pricing",
  },
  {
    name_menu: "Tính năng",
    link_menu: "https://home.merchant.vn/feature",
  },
  {
    name_menu: "Chính sách",
    link_menu: "https://home.merchant.vn/privacy",
  },
  {
    name_menu: "Liên hệ",
    link_menu: "https://home.merchant.vn/contact",
  },
]);
//
const account_login = ref<User>({})

/**Biến xác nhận lại mật khẩu*/ 
const password_confirm= ref('')
// Tạo một đối tượng với tất cả các trường rỗng làm mặc định
const defaultAccount = {
  username: "",
  fullname: "",
  password: "",
  phoneNumber: "",
  email: "",
  address: "",
  role: 0
};
//
async function login() {
  if(password_confirm.value !== account_login.value.password ){
    toast("Mật khẩu xác nhận chưa đúng !", {
        autoClose: 5000,
      }); // ToastOptions
  }
  else{
    const finalAccount = { ...defaultAccount, ...account_login };
    console.log('finalAccount',finalAccount);
    
    await apiCreateUser(finalAccount)
  }

  
}
</script>

<style scoped lang="scss"></style>