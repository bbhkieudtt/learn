<template>
  <div class="text-center">
    <main class="bg-login fixed z-0 top-0 left-0 w-full h-screen gradient-custom pt-20">
      <div class="flex z-50 px-20 justify-between">
        <div>
          <h1 class="flex text-4xl font-bold text-slate-900">Pickleball</h1>
          <!--  -->
          <p class="flex text-xl text-slate-900">
            Sân Pickleball của bạn, niềm vui của chúng tôi!
          </p>
        </div>
        <!--  -->
        <div class="sm:w-96 bg-white drop-shadow-2xl rounded-3xl p-12">
          <div class="text-center flex flex-col gap-4">
            <img src="@/assets/imgs/logoPick.png" class="h-[100px] w-[100px] mx-auto" alt="" />
            <h1 class="text-2xl font-semibold text-black">
              {{
                !status_login ? "Đăng nhập Pickleball" : "Đăng nhập thành công"
              }}
            </h1>
          </div>
          <!--  -->
          <div>
            <div class="px-0 py-8" v-if="!status_login">
              <div class="group relative z-0 mb-6 w-full">
                <input v-model="account_login.username" type="email"
                  class="peer block w-full appearance-none rounded-xl border border-slate-300 bg-transparent pt-4 pb-2 pl-4 text-sm font-medium text-gray-900 ring-orange-200 focus:border-orange-600 focus:outline-none focus:ring-4"
                  placeholder=" " /><label for="floating_email"
                  class="bg-red absolute top-0.5 left-0 -z-10 origin-[0] -translate-y-3 scale-75 transform pt-3 pl-6 text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-3 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-orange-600">Tên
                  tài khoản</label>
              </div>
              <div class="group relative z-0 mb-6 w-full">
                <input v-model="account_login.password" type="password"
                  class="peer block w-full appearance-none rounded-xl border border-slate-300 bg-transparent pt-4 pb-2 pl-4 text-sm font-medium text-gray-900 ring-orange-200 focus:border-orange-600 focus:outline-none focus:ring-4"
                  placeholder=" " /><label for="floating_email"
                  class="bg-red absolute top-0.5 left-0 -z-10 origin-[0] -translate-y-3 scale-75 transform pt-3 pl-6 text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-3 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-orange-600">Mật
                  khẩu</label>
              </div>
              <button @click="loginUse" type="submit"
                class="mt-5 w-full text-sm h-11 rounded-full bg-slate-800 py-3 font-medium text-white hover:bg-black">
                Tiếp tục
              </button>
              <div class="mt-4 text-center flex justify-center gap-10 text-xs+">
                <p @click="goToForgot" class="line-clamp-1 cursor-pointer hover:underline text-primary">
                  <span>Đăng ký </span>
                </p>
                <!--  -->
                <p class="line-clamp-1 cursor-pointer hover:underline text-primary">
                  <span>Quên mật khẩu </span>
                </p>
              </div>
            </div>
            <!--  -->
            <!-- icoon -->
            <dotlottie-vue v-else src="https://lottie.host/15eb8737-4bdb-4de2-947f-911a7bb8c299/wwc62eFWV3.lottie"
              autoplay loop></dotlottie-vue>
          </div>
        </div>
        <!--  -->
        <div class="fixed bottom-4 text-sm right-10 z-10">
          <div class="flex justify-between items-center">
            <ul class="flex gap-5 text-black px-4 py-2.5 items-center rounded-lg drop-shadow-sm mt-3">
              <li class="hover:cursor-pointer hover:underline">
                <a class="flex items-center gap-2" href="https://home.merchant.vn" target="_blank">Giới thiệu</a>
              </li>
              <li v-for="item in list_menu" class="hover:cursor-pointer hover:underline">
                <a :href="item.link_menu" target="_blank">{{
                  item.name_menu
                }}</a>
              </li>
            </ul>

          </div>
        </div>
      </div>
    </main>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useRouter } from 'vue-router'
import { useAppStore } from "@/stores/appStore";

/**thư viện hiển thị icon*/
import { DotLottieVue } from "@lottiefiles/dotlottie-vue";
import { tr } from "date-fns/locale";

/**api*/
import { login } from "@/service/api/api";

/**toast*/
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

/**biến store*/
const store = useAppStore();

/**Biến router */
const router = useRouter()



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
const account_login = ref<{ username: string; password: string }>({
  username: '',
  password: ''
});

//
async function loginUse() {
  if (
    account_login.value.username.trim() === "" &&
    account_login.value.password.trim() === ""
  ) {
    toast("Xin hãy nhập đầy đủ thông tin!", { autoClose: 5000 });

    return;
  }
  // 
  else {
    try {
      const response = await login(account_login.value);
      console.log("API Response:", response);
      // Kiểm tra nếu API trả về thành công
      if (response && response.status === 200) {
        // Lưu token vào localStorage 
        localStorage.setItem("token", response.data.token);
        // localStorage.setItem("userInfo", JSON.stringify(response.data.infor));
        // Lưu thông tin người dùng vào localStorage
        localStorage.setItem("userInfo", JSON.stringify(response.data.infor));
        store.UserInfo = response.data.infor

        status_login.value = true

        setTimeout(() => {
          router.push('/main');
        }, 5000); // Delay 100ms để đảm bảo watch chạy trước

      } else {
        toast("Đăng ký thất bại, vui lòng thử lại!", { autoClose: 5000 });
      }
    } catch (error) {
      console.error("API Error:", error);
    }
  }
}

// 
function goToForgot() {
  router.push('/forgot');
}
</script>

<style scoped lang="scss"></style>
