<template>
  <div class="text-center">
    <main class="bg-login gradient-custom-forgot fixed z-0 top-0 left-0 w-full h-screen  pt-10">
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
          <div class="text-center flex flex-col gap-2">
            <img src="@/assets/imgs/logoPick.png" class="h-[100px] w-[100px] mx-auto" alt="" />
            <h1 class="text-2xl font-semibold text-black">
              {{
                !status_login ? "Đăng ký tài khoản" : "Đăng ký thành công"
              }}
            </h1>
          </div>
          <!--  -->
          <div>
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
                  class="bg-red absolute top-0.5 left-0 -z-10 origin-[0] -translate-y-3 scale-75 transform pt-3 pl-6 text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-3 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-orange-600">Nhập
                  email</label>
              </div>
              <!--  -->
              <button @click="createUse"
                class="mt-5 w-full text-sm h-11 rounded-full bg-slate-800 py-3 font-medium text-white hover:bg-black">
                Tạo tài khoản
              </button>
              <div @click="goToLogin" class="mt-4 text-center text-xs+">
                <p class="line-clamp-1 cursor-pointer hover:underline text-primary">
                  <span>Có tài khoản? <span class=" text-primary cusor-pointer">Đăng nhập</span> </span>
                </p>
              </div>
            </div>
            <!--  -->
            <!-- icoon -->
            <dotlottie-vue v-else src="https://lottie.host/6cde67fd-d614-4d09-a8f4-2421e6f6c81d/2IypRGnNXD.lottie"
              autoplay loop></dotlottie-vue>
          </div>
        </div>
        <!--  -->
      </div>
    </main>
  </div>
</template>
<script setup lang="ts">

import { useRouter } from 'vue-router'
import { onMounted, ref, watch } from "vue";

/**Biến router */
const router = useRouter()

/**Thư viện*/
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'
import { tr } from "date-fns/locale";

/**Api*/
import { apiCreateUser } from "@/service/api/api";

/**toast*/
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

/**kiểu dữ liệu*/
import type { User } from '@/interface'

/**Biến hiện icon khi thành công*/
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

/**Biến lưu thông tin người đăng nhập*/
const account_login = ref<Partial<User>>({});

/**Biến xác nhận lại mật khẩu*/
const password_confirm = ref('')

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

/**Hàm đăng kí*/
async function createUse() {

  if (password_confirm.value !== account_login.value.password) {
    toast("Mật khẩu xác nhận chưa đúng!", { autoClose: 5000 });
    return;
  }

   // Kiểm tra username: chữ thường, không dấu, không có khoảng trắng
  const usernameRegex = /^[a-z0-9]+$/;
  if (!usernameRegex.test(account_login.value.username || '')) {
    toast("Tên đăng nhập phải là chữ thường, không dấu và không có khoảng trắng!", { autoClose: 5000 });
    return;
  }

  const finalAccount = { ...defaultAccount, ...account_login.value };
  console.log("finalAccount gửi đi:", finalAccount);

  try {
    const response = await apiCreateUser(finalAccount);
    console.log("API Response:", response);
    // Kiểm tra nếu API trả về thành công
    if (response && response.status === 200) {
      status_login.value = true

      setTimeout(() => {
        router.push('/login');
      }, 5000); // Delay 100ms để đảm bảo watch chạy trước

    } else {
      toast("Đăng ký thất bại, vui lòng thử lại!", { autoClose: 5000 });
    }
  } catch (error) {
    toast(error, { autoClose: 5000 });
  }
}

function goToLogin(){
  router.push('/login')
}




</script>

<style scoped lang="scss"></style>