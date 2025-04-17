<template>
  <body class="bg-blue-900 min-h-screen text-white font-sans">
    <div class="bg-blue-900 min-h-screen text-white font-sans">
      <header class="flex items-center justify-between px-6 py-4 bg-blue-800 shadow-md">
        <div class="flex items-center space-x-3">
          <img :src="logoPick" alt="Logo" class="w-10 h-10 rounded-full">
          <h1 class="text-2xl font-bold">Thông tin tài khoản</h1>
        </div>
        <div class="flex items-center space-x-4">
          <button class="bg-blue-700 hover:bg-blue-600 px-4 py-2 rounded-lg text-white">Đổi mật khẩu</button>
          <button class="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg text-white">Đăng xuất</button>
        </div>
      </header>

      <main class="max-w-3xl mx-auto mt-10 bg-white text-blue-900 rounded-2xl shadow-lg p-8">
        <h2 class="text-2xl font-semibold mb-6 text-center">Chi tiết tài khoản</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block mb-1 font-medium">Tên đăng nhập:</label>
            <p class="bg-blue-50 px-4 py-2 rounded-md">{{ userInfo.username }}</p>
          </div>
          <div>
            <label class="block mb-1 font-medium">Họ và tên:</label>
            <p class="bg-blue-50 px-4 py-2 rounded-md">{{ userInfo.fullname }}</p>
          </div>
          <div>
            <label class="block mb-1 font-medium">Số điện thoại:</label>
            <p class="bg-blue-50 px-4 py-2 rounded-md">{{ userInfo.phoneNumber }}</p>
          </div>
          <div>
            <label class="block mb-1 font-medium">Email:</label>
            <p class="bg-blue-50 px-4 py-2 rounded-md">{{ userInfo.email }}</p>
          </div>
          <div class="md:col-span-2">
            <label class="block mb-1 font-medium">Địa chỉ:</label>
            <p class="bg-blue-50 px-4 py-2 rounded-md">{{ userInfo.address }}</p>
          </div>
          <div class="md:col-span-2">
            <label class="block mb-1 font-medium">Vai trò:</label>
            <p class="bg-blue-50 px-4 py-2 rounded-md">{{ userInfo.role }} - {{ roleLabel }}</p>
          </div>
        </div>
      </main>

      <footer class="text-center text-sm mt-10 text-blue-200">
        © 2025 Công ty bạn | All rights reserved
      </footer>
    </div>
  </body>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'

// logo
import logoPick from"@/assets/imgs/logoPick.png"

const userInfo = ref({
  username: '',
  fullname: '',
  phoneNumber: '',
  email: '',
  address: '',
  role: 0
})

onMounted(() => {
  const data = localStorage.getItem('userInfo')
  if (data) {
    userInfo.value = JSON.parse(data)
  }
})

const roleLabel = computed(() => {
  switch (userInfo.value.role) {
    case 1:
      return 'Quản trị viên'
    case 2:
      return 'Người dùng'
    default:
      return 'Không xác định'
  }
})

</script>
