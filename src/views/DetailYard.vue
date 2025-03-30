<template>
  <div class="w-dvw h-dvh overflow-hidden flex flex-col">
    <header class="bg-green flex-shrink-0 flex flex-col gap-3 px-3 py-3">
      <!--  -->
      <div class="flex justify-between items-center">
        <IconBack @click="goToBack" class="w-6 cursor-pointer h-6 text-white"></IconBack>
        <!--  -->
        <h3 class="text-2xl font-semibold text-white">Trạng thái sân</h3>
        <div class="flex gap-5">
          <IconSearch class="w-5 h-5 text-white"></IconSearch>
          <IconFilter class="w-5 h-5 text-white"></IconFilter>
        </div>
      </div>
      <!--  -->
      <div class="grid grid-cols-4 gap-3 ">
        <div class="flex items-center justify-between text-lg cursor-pointer button rounded-md ">
          <p></p>
          <p>Lịch thuê</p>
          <IconClock></IconClock>
        </div>
        <!--  -->
        <div class="flex cursor-pointer gap-2 button rounded-md  ">
          <ListYardSmall></ListYardSmall>
        </div>
        <!--  -->
        <div @click="goToInfo" class="flex items-center justify-between text-lg cursor-pointer button rounded-md ">
          <p></p>
          <p>
            Thông tin sân
          </p>
          <IconPhone></IconPhone>
        </div>
        <!--  -->
        <div @click="selectedTime" class="flex items-center justify-between text-lg cursor-pointer button rounded-md ">
          <p>

          </p>
          <p>{{ time_selected }}</p>
          <CalendarDateRangeIcon class="w-5 h-5 text-white"></CalendarDateRangeIcon>
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

    <button @click="goToBocking"
      class=" text-lg items-center z-50 font-semibold flex-shrink-0 absolute bottom-5 right-5 w-fit py-2 px-3 flex gap-1 rounded-lg bg-green-800 text-white">
      <ClipboardDocumentCheckIcon class="w-5 h-5 text-white"></ClipboardDocumentCheckIcon>
      Đặt sân
    </button>
  </div>
  <!--  -->
  <Modal v-if="show_modal" :close="showModal">
    <template #content>
      <div class="w-[300px] h-[300px]">
        <VueDatePicker class="w-full h-full"   @update:model-value="handleDate"  v-model="store.date" :inline="true" auto-apply locale="vi" :day-names="customDayNames">
        </VueDatePicker>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref ,computed} from "vue";
import { useAppStore } from '@/stores/appStore'
import { useRouter } from 'vue-router'

/**Modal*/
import Modal from "@/components/Modal/Modal.vue"

/**component*/
import FullCalendar from "./layout/FullCalendar.vue";

/**filter*/
import ListYardSmall from "./layout/DatailYard/ListYardSmall.vue";

/**icon*/
import { } from "@heroicons/vue/24/outline";
// 
import { ClipboardDocumentCheckIcon, CalendarDateRangeIcon } from "@heroicons/vue/24/solid";
import IconBack from "@/components/Icons/IconBack.vue";
import IconSearch from "@/components/Icons/IconSearch.vue";
import IconFilter from "@/components/Icons/IconFilter.vue";

/**icon menu*/
import IconClock from "@/components/Icons/IconClock.vue";
import IconPhone from "@/components/Icons/IconPhone.vue";

const store = useAppStore()

/**Format hiển thị thứ trong tuần trên lịch*/
const customDayNames = [
  'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'
];

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

/**biến mở modal tìm kiếm sân theo địa chỉ*/
const show_modal = ref(false);


/**Biến giá trị thời gian*/
// Dùng computed để tự động tính toán giá trị time_selected
const time_selected = computed(() => {
  return new Intl.DateTimeFormat("vi-VN", { 
    day: "2-digit", 
    month: "2-digit", 
    year: "numeric" 
  }).format(store.date);
});

/**hàm đóng modal*/
function showModal() {
  show_modal.value = false;
}

/**hàm hiển thị đặt lịch*/
function goToBocking() {
  router.push('/Boking')
}

/**Hàm quay trở lại trang chủ*/
function goToBack() {
  router.push('/main')
}

/**Đi đến thông tin chi tiết sân*/
function goToInfo() {
  router.push('/Info')
}

/***/
function selectedTime() {
  show_modal.value = true;
} 

function handleDate() {
  //để ngăn chặn sự chuyển sang chế độ hiển thị ngày của lịch 
  
}
</script>

<style lang="scss" scoped></style>
