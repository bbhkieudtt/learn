<template>
  <div class="w-dvw h-dvh overflow-hidden flex flex-col">
    <header class="bg-green flex-shrink-0 flex flex-col gap-3 px-3 py-3">
      <!--  -->
      <div class="flex justify-between items-center">
        <IconBack class="w-6 h-6 text-white"></IconBack>
        <!--  -->
        <h3 class="text-2xl font-semibold text-white">Trạng thái sân</h3>
        <div class="flex gap-5">
          <IconSearch class="w-5 h-5 text-white"></IconSearch>
          <IconFilter class="w-5 h-5 text-white"></IconFilter>
        </div>
      </div>
      <!--  -->
      <div class="grid grid-cols-4 gap-3 ">
        <div class="flex gap-2 button rounded-md  ">

          <p class="text-sm ">Lịch thuê</p>
          <IconClock></IconClock>
        </div>
        <div class="flex gap-2 button rounded-md  ">
          <p>Giá thuê</p>
          <IconUser></IconUser>
        </div>
        <div class="flex gap-2 button rounded-md  ">
          <p>
            Thông tin sân
          </p>
          <IconPhone></IconPhone>
        </div>
        <div class="flex gap-2 button rounded-md  ">
          <TimeFilter></TimeFilter>
        </div>
      </div>
      <!--  -->
      <div class="flex items-center justify-center gap-5">
        <div v-for="item in list_statistical" class="flex gap-2 items-center">
          <span :class="{
            'bg-green-500': item.key === 2,
            'bg-white': item.key === 1,
            'bg-slate-400': item.key === 4,
            'bg-orange-400': item.key === 3,
          }" class="w-7 h-7 rounded-md shadow-sm ">
          </span>
          <p class="text-sm font-medium text-slate-200">
            {{ item.status }}
          </p>
        </div>
      </div>
    </header>
    <!--  -->
    <main class="flex-1 py-2 h-full main overflow-hidden">

      <FullCalendar></FullCalendar>


    </main>

      <button @click="goToBocking" class=" text-lg items-center z-50 font-semibold flex-shrink-0 absolute bottom-5 right-5 w-fit py-2 px-3 flex gap-1 rounded-lg bg-green-800 text-white">
        <ClipboardDocumentCheckIcon class="w-5 h-5 text-white"></ClipboardDocumentCheckIcon>
        Đặt sân
      </button>


  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAppStore} from '@/stores/appStore'
import { useRouter } from 'vue-router'

/**component*/
import FullCalendar from "./layout/FullCalendar.vue";

/**filter*/
import TimeFilter from "./layout/FilterYard/TimeFilter.vue";

/**icon*/
import {  } from "@heroicons/vue/24/outline"; 
// 
import { ClipboardDocumentCheckIcon} from "@heroicons/vue/24/solid"; 
import IconBack from "@/components/Icons/IconBack.vue";
import IconSearch from "@/components/Icons/IconSearch.vue";
import IconFilter from "@/components/Icons/IconFilter.vue";

/**icon menu*/
import IconClock from "@/components/Icons/IconClock.vue";
import IconUser from "@/components/Icons/IconUse.vue";
import IconPhone from "@/components/Icons/IconPhone.vue";

/**Biến router */
const router = useRouter()

/**danh sách thống kê*/
const list_statistical = ref([
  {
    key: 1,
    status: "Trống"
  },
  {
    key: 2,
    status: "Lịch ngày"
  },
  {
    key: 3,
    status: "Lịch Tháng"
  },
  {
    key: 4,
    status: "Khóa"
  },
]);

/**hàm hiển thị đặt lịch*/ 
function goToBocking(){

router.push('/Boking')
}
</script>

<style lang="scss" scoped></style>
