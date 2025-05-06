<template>
  <body class="bg-green-900 min-h-screen text-white font-sans">
    <div class="bg-green-900 min-h-screen text-white font-sans">
      <header class="flex items-center justify-between px-6 py-4 bg-green-800 shadow-md">
        <div class="flex items-center space-x-3">
          <img @click="goHome" :src="logoPick" alt="Logo" class="w-10 h-10 rounded-full">
          <h1 class="text-2xl font-bold">Thông tin tài khoản</h1>
        </div>
        <div class="flex items-center space-x-4">
          <button @click="Logouts" class="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg text-white">Đăng xuất</button>
        </div>
      </header>

      <main class="max-w-3xl mx-auto mt-10 bg-white text-green-900 rounded-2xl shadow-lg p-8">
        <h2 class="text-2xl font-semibold mb-6 text-center">Chi tiết tài khoản</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block mb-1 font-medium">Tên đăng nhập:</label>
            <input type="text" v-model="userInfo.username" class="bg-green-50 px-4 py-2 rounded-md w-full" />
          </div>
          <div>
            <label class="block mb-1 font-medium">Họ và tên:</label>
            <input type="text" v-model="userInfo.fullname" class="bg-green-50 px-4 py-2 rounded-md w-full" />
          </div>
          <div>
            <label class="block mb-1 font-medium">Số điện thoại:</label>
            <input type="text" v-model="userInfo.phoneNumber" class="bg-green-50 px-4 py-2 rounded-md w-full" />
          </div>
          <div>
            <label class="block mb-1 font-medium">Email:</label>
            <input type="email" v-model="userInfo.email" class="bg-green-50 px-4 py-2 rounded-md w-full" />
          </div>
          <div class="md:col-span-2">
            <label class="block mb-1 font-medium">Địa chỉ:</label>
            <input type="text" v-model="userInfo.address" class="bg-green-50 px-4 py-2 rounded-md w-full" />
          </div>
          <div>
            <label class="block mb-1 font-medium">Số tài khoản ngân hàng:</label>
            <input type="text" v-model="userInfo.bankNumber" class="bg-green-50 px-4 py-2 rounded-md w-full" />
          </div>
          <div>
            <label class="block mb-1 font-medium">Tên ngân hàng:</label>
            <input type="text" v-model="userInfo.bankName" class="bg-green-50 px-4 py-2 rounded-md w-full" />
          </div>
          <div class="md:col-span-2">
            <label class="block mb-1 font-medium">Chủ tài khoản:</label>
            <input type="text" v-model="userInfo.bankAccount" class="bg-green-50 px-4 py-2 rounded-md w-full" />
          </div>
        </div>
        <div class="w-full flex justify-between mt-5">
          <button @click="goHome" class="bg-slate-500 hover:bg-slate-600 px-9 py-2 rounded-lg mt-2 flex text-white">Đóng</button>
          <button class="bg-green-700 hover:bg-green-600 px-9 py-2 rounded-lg mt-2 flex text-white" @click="UpdateUser">Cập nhật</button>
        </div>
      </main>

      <footer class="text-center text-sm mt-10 text-green-200">
        <!-- Footer content goes here -->
      </footer>
    </div>
  </body>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Logout, apiUpdateUser } from "@/service/api/api"
import { ElMessageBox, ElMessage } from 'element-plus'

/**toast*/
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

/**Biến router */
const router = useRouter()

// logo
import logoPick from "@/assets/imgs/logoPick.png"

const userInfo = ref({
  username: '',
  fullname: '',
  phoneNumber: '',
  email: '',
  address: '',
  role: 0,
  bankNumber: null,
  bankName: null,
  bankAccount: null
})

onMounted(() => {
  const data = localStorage.getItem('userInfo')
  console.log('data', data);
  
  if (data) {
    userInfo.value = JSON.parse(data)
  }
})

function goHome() {
  router.push('/main');
}

// Logout
async function Logouts() {
  try {
    await ElMessageBox.confirm(
      'Bạn có chắc chắn muốn đăng xuất không?',
      'Xác nhận đăng xuất',
      {
        cancelButtonText: 'Thoát',
        confirmButtonText: 'Đăng xuất',
        type: 'warning',
      }
    );

    const response = await Logout();
    console.log("API Response:", response);

    if (response && response.status === 200) {
      localStorage.setItem("token", '');
      localStorage.setItem("userInfo", '');
      toast("Đăng xuất thành công!", { autoClose: 5000 });

      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } else {
      toast("Đăng xuất thất bại, vui lòng thử lại!", { autoClose: 5000 });
    }

    ElMessage({
      type: 'success',
      message: 'Đăng xuất thành công!',
    });

    router.push('/YourYard');

  } catch (error) {
    ElMessage({
      type: 'info',
      message: 'Đã hủy xóa hoặc có lỗi xảy ra',
    });
    console.error("Logout Error:", error);
  }
}

async function UpdateUser() {
  // Validate trước
  const usernameRegex = /^[a-z0-9]+$/; // chỉ cho phép chữ thường và số

  if (!userInfo.value.username.trim()) {
    toast("Tên đăng nhập không được để trống", { autoClose: 3000 });
    return;
  }

  if (!usernameRegex.test(userInfo.value.username)) {
    toast("Tên đăng nhập chỉ được viết liền, không dấu, không khoảng trắng, không chữ in hoa", { autoClose: 3000 });
    return;
  }
  if (!userInfo.value.fullname.trim()) {
    toast("Họ và tên không được để trống", { autoClose: 3000 });
    return;
  }
  if (!/^(0|\+84)[0-9]{9,10}$/.test(userInfo.value.phoneNumber)) {
    toast("Số điện thoại không hợp lệ", { autoClose: 3000 });
    return;
  }
  if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(userInfo.value.email)) {
    toast("Email không hợp lệ", { autoClose: 3000 });
    return;
  }
  // Validate bankNumber (optional, but must be numeric if provided)
  if (userInfo.value.bankNumber && !/^[0-9]+$/.test(userInfo.value.bankNumber)) {
    toast("Số tài khoản ngân hàng chỉ được chứa số", { autoClose: 3000 });
    return;
  }
  // Validate bankName (optional, but must not be empty if provided)
  if (userInfo.value.bankName && !userInfo.value.bankName) {
    toast("Tên ngân hàng không được để trống", { autoClose: 3000 });
    return;
  }
  // Validate bankAccount (optional, but must not be empty if provided)
  if (userInfo.value.bankAccount && !userInfo.value.bankAccount) {
    toast("Chủ tài khoản không được để trống", { autoClose: 3000 });
    return;
  }

  try {
    const response = await apiUpdateUser(userInfo.value);

    if (response && response.status === 200) {
      toast("Cập nhật thông tin tài khoản thành công!", { autoClose: 5000 });
    } else {
      toast("Cập nhật thất bại, vui lòng thử lại!", { autoClose: 5000 });
    }
  } catch (error) {
    console.error("API Error:", error);
    toast(error, { autoClose: 5000 });
  }
}
</script>