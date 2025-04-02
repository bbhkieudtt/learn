<template>
    <div class="h-dvh w-dvw flex flex-col gap-3 px-3 py-2 bg-green ">
        <header class="flex justify-between items-center py-2">
            <ArrowLeftIcon @click='goToDetail' class="w-7 h-7 cursor-pointer text-white"></ArrowLeftIcon>
            <!--  -->
            <p class=" text-2xl font-semibold text-white">
                Đặt lịch ngay
            </p>
            <!--  -->
            <p>

            </p>
        </header>
        <!--  -->
        <main class="h-full flex flex-col gap-3 overflow-auto ">
            <!-- tên -->
            <div class="flex flex-col gap-2 py-1">
                <label for="" class="text-xl font-semibold text-white"> Tên khách hàng</label>
                <div
                    class="flex justify-between items-center py-2 px-3 bg-white rounded-md border border-slate-500 shadow-sm">
                    <input type="text" v-model="info_client.name_client" class="text-lg w-full outline-none " placeholder="Nhập tên khách hàng">
                    <MagnifyingGlassIcon class="w-6 h-6 text-slate-700 shrink-0"></MagnifyingGlassIcon>
                </div>
            </div>
            <!-- sđt -->
            <div class="flex flex-col gap-2 py-1">
                <label for="" class="text-xl font-semibold text-white"> Số điện thoại</label>
                <div
                    class="flex justify-between items-center py-2 px-3 bg-white rounded-md border border-slate-500 shadow-sm">
                    <div class="flex gap-2">
                        <div class="flex gap-2 flex-shrink-0 items-center">
                            <div class="p-1.5 rounded-full bg-red-600">
                                <StarIcon class="w-4 h-4 text-yellow-300"></StarIcon>
                            </div>
                        </div>
                        <input type="tel" v-model="info_client.phone_client"  @keypress="onlyNumber" class="text-lg w-full  outline-none " placeholder="Nhập số điện thoại">
                    </div>
                </div>
            </div>
            <!-- Ghi chú -->
            <div class="flex flex-col gap-2 py-1">
                <label for="" class="text-xl font-semibold text-white"> Ghi chú</label>
                <textarea  class="text-lg w-full  py-2 px-3 bg-white rounded-md border border-slate-500 shadow-sm  "
                    placeholder="Nhập tên khách hàng">
                    </textarea>
            </div>
            <!-- Thông tin  -->
            <div class="flex flex-col bg-green-900 rounded-md opacity-95 gap-3 px-5 py-5 ">
                <div class="flex gap-3  items-center ">
                    <ClipboardDocumentListIcon class="w-10 h-10 text-yellow-200 "></ClipboardDocumentListIcon>
                    <p class="text-xl font-semibold text-yellow-300">
                        Thông tin đặt lịch
                    </p>
                </div>
                <div class="flex gap-2 flex-col  ">
                    <div class="flex text-lg text-white items-center gap-3">
                        <p class="text-xl">Tên sân:</p>
                        <p class="font-semibold">Thiên Lý Ơi</p>
                    </div>
                    <div class="flex text-lg text-white items-center gap-3">
                        <p class="text-lg">Địa chỉ:</p>
                        <p class="font-semibold">96 Định Công, Hoàng Mai, Hà Nội</p>
                    </div>
                    <!--  -->
                    <div class="flex text-lg text-white  gap-3">
                        <p class="text-lg ">Thời gian & sân:</p>

                        <p class="">23-03-2025 </p>
                    </div>
                    <p class="font-semibold text-lg text-white ">- Pickleball 3: <span> {{start_boking  }} - {{ end_boking }}</span></p>
                    <!-- Tổng giờ -->
                    <div class="flex text-lg text-white items-center gap-3">
                        <p class="text-lg">Tổng giờ:</p>
                        <p class="font-semibold">4 giờ</p>
                    </div>
                    <!-- Tổng giờ -->
                    <div class="flex text-xl text-white items-center gap-5">
                        <input type="checkbox"  class="w-6 h-6">
                        <p class="font-semibold">Đặt cọc</p>
                    </div>
                </div>
            </div>

        </main>
        <!--  -->
        <button @click="addBoking" class="text-center text-xl font-semibold text-white bg-yellow-500 rounded-lg py-3">
            Xác nhận
        </button>

    </div>
</template>

<script setup lang="ts">
import { ref ,computed,nextTick,watch } from 'vue'
import { useAppStore } from '@/stores/appStore'
import { useRouter } from 'vue-router'

/**icon*/
import { } from "@heroicons/vue/24/outline";

import { ArrowLeftIcon, MagnifyingGlassIcon, StarIcon, ClipboardDocumentListIcon } from "@heroicons/vue/24/solid";

/**kiểu dữ liệu*/
import type {
    ClientBoking
} from '@/interface' 
import { log } from 'async';


/**biến store*/
const store = useAppStore()

/**Biến router */
const router = useRouter()

/**Biến giờ bắt đầu đặt sân */ 
const start_boking = computed(() => {
  return store.selectInfo?.start
    ? new Date(store.selectInfo.start).toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";
});
/**Biến giờ bắt đầu đặt sân */ 
const end_boking = computed(() => {
  return store.selectInfo?.start
    ? new Date(store.selectInfo.end).toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";
});

/**Biến lưu thông tin khách đặt lịch*/
const info_client = ref<ClientBoking>({
  name_client: '',      // Add an empty string or default value
  phone_client: '',     // Add an empty string or default value
  note_boking: '',      // Add an empty string or default value
});


/**Hàm kiểm tra chỉ cho nhập số không nhập chữ*/ 
const onlyNumber = (event: any) => {
  if (!/^\d$/.test(event.key)) {
    // Chặn ký tự không phải số
    event.preventDefault(); 
  }
};

/**Hàm tạo lịch đặt sân*/
async function addBoking(){
    console.log(' store.add_boking',store.add_boking);
    /**gán thông tin vào store */ 
    store.info_client = info_client.value
    /**Biến để bên FullCalendar nhận ra sự thay đổi để thêm thêm lịch đặt sân */ 
    store.add_boking = true
    /*trở về màn danh sách lịch**/
    console.log(' store.add_boking',store.add_boking);
    await nextTick(); // Đảm bảo Vue nhận diện thay đổi trước khi chuyển trang
  setTimeout(() => {
    router.push('/detail');
  }, 100); // Delay 100ms để đảm bảo watch chạy trước
}

function goToDetail(){
    router.push('/detail')
}



</script>

<style lang="scss" scoped></style>