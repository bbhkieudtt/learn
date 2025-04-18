<template>
    <body class="bg-gray-100 min-h-screen flex flex-col items-center justify-start">
    <!-- Thanh tiến trình -->
    <div class="w-full bg-[#fbbf24] py-4">
        <div class="max-w-4xl mx-auto flex justify-between items-center text-white text-sm font-semibold">
            <div class="flex flex-col items-center">
                <div
                    class="w-6 h-6 rounded-full bg-white text-[#fbbf24] flex items-center justify-center font-bold">
                    📍</div>
                <span class="mt-1">Pickleball</span>
            </div>
            <div class="flex-1 border-t-2 border-white mx-2"></div>
            <div class="flex flex-col items-center">
                <div
                    class="w-6 h-6 rounded-full bg-white text-[#fbbf24] flex items-center justify-center font-bold">
                    ⏳</div>
                <span class="mt-1">Đặt Lịch</span>
            </div>
            <div class="flex-1 border-t-2 border-white mx-2"></div>
            <div class="flex flex-col items-center">
                <div
                    class="w-6 h-6 rounded-full bg-white text-[#fbbf24] flex items-center justify-center font-bold">
                    💳</div>
                <span class="mt-1">Thanh toán</span>
            </div>
            <div class="flex-1 border-t-2 border-white mx-2"></div>
            <div class="flex flex-col items-center">
                <div
                    class="w-6 h-6 rounded-full bg-white text-[#fbbf24] flex items-center justify-center font-bold">
                    ❌</div>
                <span class="mt-1">Kết thúc</span>
            </div>
        </div>
    </div>

    <!-- Thông báo thất bại -->
    <div class="flex flex-col items-center justify-center flex-1 mt-20 text-center">
        <div class="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center text-white text-4xl mb-6">
            ❌
        </div>
        <h1 class="text-2xl font-semibold mb-2">Thanh toán không thành công!</h1>
        <p class="text-gray-500 mb-6">Đã xảy ra lỗi trong quá trình thanh toán. Vui lòng thử lại sau.</p>
        <div class="flex space-x-4">
            <button @click="backHome" class="bg-[#fbbf24] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#f59e0b]">
                Quay lại
            </button>
        </div>
    </div>
</body>

</template>

<script setup lang="ts">
   /**Router*/
import { useRouter } from 'vue-router'

/**icon*/
import { } from "@heroicons/vue/24/outline";


/**Biến router */
const router = useRouter()

function backHome(){
    router.push('/yourboking')
}
</script>
