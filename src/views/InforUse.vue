<template>
  <body class="bg-green-900 min-h-screen text-white font-sans">
    <div class="bg-green-900 min-h-screen text-white font-sans">
      <header class="flex items-center justify-between px-6 py-4 bg-green-800 shadow-md">
        <div class="flex items-center space-x-3">
          <img @click="goHome" :src="logoPick" alt="Logo" class="w-10 h-10 rounded-full">
          <h1 class="text-2xl font-bold">Thông tin tài khoản</h1>
        </div>
        <div class="flex items-center space-x-4">
          <button class="bg-green-700 hover:bg-green-600 px-4 py-2 rounded-lg text-white" @click="enableEdit">Cập nhật thông tin tài khoản</button>
          <button class="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg text-white">Đăng xuất</button>
        </div>
      </header>

      <main class="max-w-3xl mx-auto mt-10 bg-white text-green-900 rounded-2xl shadow-lg p-8">
        <h2 class="text-2xl font-semibold mb-6 text-center">Chi tiết tài khoản</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block mb-1 font-medium">Tên đăng nhập:</label>
            <input type="text" v-model="userInfo.username" :readonly="!isEditing" class="bg-green-50 px-4 py-2 rounded-md w-full" />
          </div>
          <div>
            <label class="block mb-1 font-medium">Họ và tên:</label>
            <input type="text" v-model="userInfo.fullname" :readonly="!isEditing" class="bg-green-50 px-4 py-2 rounded-md w-full" />
          </div>
          <div>
            <label class="block mb-1 font-medium">Số điện thoại:</label>
            <input type="text" v-model="userInfo.phoneNumber" :readonly="!isEditing" class="bg-green-50 px-4 py-2 rounded-md w-full" />
          </div>
          <div>
            <label class="block mb-1 font-medium">Email:</label>
            <input type="email" v-model="userInfo.email" :readonly="!isEditing" class="bg-green-50 px-4 py-2 rounded-md w-full" />
          </div>
          <div class="md:col-span-2">
            <label class="block mb-1 font-medium">Địa chỉ:</label>
            <input type="text" v-model="userInfo.address" :readonly="!isEditing" class="bg-green-50 px-4 py-2 rounded-md w-full" />
          </div>
          <div class="md:col-span-2">
            <label class="block mb-1 font-medium">Vai trò:</label>
            <p class="bg-green-50 px-4 py-2 rounded-md">{{ roleLabel }}</p>
          </div>
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

/**Biến router */
const router = useRouter()

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

const isEditing = ref(false)

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

function goHome(){
  router.push('/main');
}

function enableEdit() {
  isEditing.value = true;
}
</script>

