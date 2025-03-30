<template>

  <main class="flex flex-col flex-1 overflow-hidden">
    <header class="flex flex-shrink-0 px-3 justify-between">
      <div class="p-2">
        <div class="flex justify-center items-center gap-3 rounded-xl  w-fit ">
          <div class="px-3 py-5  rounded-full flex-shrink-0 bg-white">
            <img src="@/assets/imgs/logoNo.png" class="w-[70px] h-[50px]" alt="" />
          </div>
          <!--  -->
          <h2 class="text-3xl font-semibold text-white">Picklaball</h2>
        </div>
      </div>
      <!--  -->
      <div class="flex gap-5 w-100   items-center">
        <div class="p-2 flex group  cursor-pointer items-center gap-2 bg-white rounded-full">
          <icon-search @click="show_modal = true" class="w-5 h-5 group-hover:text-green-500 "></icon-search>
        </div>
        <VueDatePicker class="shadow-sm py-0.5" placeholder="Chọn thời gian đặt sân " v-model="date" range />
      </div>
    </header>
    <!--  -->
    <div class="h-full overflow-hidden">
      <div v-if="list_yard && list_yard.length === 0" class="w-full h-full flex justify-center items-center">
        <div class="flex flex-col gap-2 justify-center items-center">
          <img src="@/assets/imgs/image9.png" alt="" />
          <h3 class="text-2xl text-white font-bold">Chưa có sân nào</h3>
        </div>
      </div>
      <div v-else class="w-full h-full flex justify-center overflow-y-auto items-center px-5 py-2">
        <div class="grid h-full overflow-y-auto grid-cols-4  gap-15">
          <!-- sân -->
          <div @click="goToDetail" v-for="yard in list_yard" :key="yard.key"
            class="flex items-center h-full border border-white flex-shrink-0  rounded-lg cursor-pointer flex-col  bg-white">
            <img class="w-60 rounded-t-lg  h-50" :src="yard.img" alt="ảnh sân" />
            <div class="flex w-full  flex-shrink-0 flex-col  gap-0.5 p-1">
              <h3 class="text-sm font-medium text-back truncate">
                {{ yard.name_yard }}
              </h3>
              <p class="text-sm flex-shrink-0 text-slate-500 truncate">{{ yard.add_yard }}</p>
              <div class="flex items-center gap-2"> <span class="w-2 h-2 bg-green-500 rounded-full"></span>
                <p class="text-xs ">{{ yard.time }}</p>
              </div>
              <div class="flex items-center justify-between">
                <vue3-star-ratings v-model="yard.evaluate" />
                <div class="flex items-center gap-1">
                  <IconComment class="w-4 h-4 text-slate-500"></IconComment>
                  <p class="text-xs text-slate-400">
                    3
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </main>
  <!--  -->
  <Modal v-if="show_modal" :close="showModal">
    <template #content>
      <div class="w-[800px] px-5 py-4 gap-4 flex flex-col">
        <header class="flex justify-between items-center  py-0.5">
          <p class="text-xl font-semibold ">
            Tìm kiếm sân
          </p>
          <IconClose @click="showModal"
            class="w-6 h-6 text-green-600 cursor-pointer  rounded-md flex-shrink-0 p-0.5 hover:bg-green-200">
          </IconClose>
        </header>

        <body class="w-full flex flex-col gap-2">
          <!-- Ô nhập địa chỉ sân -->
          <div class="flex flex-col gap-2 border-b border-slate-200 pb-5" :class="{
            'opacity-50': activeInput !== 'address' && !Address_value
          }">
            <label class="font-semibold text-green-900" for="">Địa chỉ sân</label>
            <input v-model="Address_value" placeholder="Nhập địa chỉ sân muốn tìm kiếm"
              class="w-full px-3 py-2 outline-none rounded-md border border-green-600" type="text"
              @focus="setActive('address')" @blur="removeActive" />
          </div>

          <!-- Ô nhập tên sân -->
          <div class="flex flex-col gap-2 mb-7" :class="{
            'opacity-50': activeInput !== 'name' && !name_value
          }">
            <label class="font-semibold text-green-900 " for="">Tên sân</label>
            <input v-model="name_value" placeholder="Nhập tên sân muốn tìm kiếm"
              class="w-full px-3 outline-none py-2 rounded-md border border-green-600" type="text"
              @focus="setActive('name')" @blur="removeActive" />
          </div>

          <!-- buttom tìm kiếm -->
          <button :class="{ 'opacity-80': isSearchDisabled }" :disabled="isSearchDisabled"
            class="py-2 text-sm font-medium text-white bg-green-700 rounded-md">
            Tìm kiếm
          </button>
        </body>

      </div>
    </template>
  </Modal>

</template>

<script setup lang="ts">
import { ref, computed } from "vue";

import { useRouter } from 'vue-router'

/**Thư viện*/


/**icon*/
import IconBack from "@/components/Icons/IconBack.vue";
import IconSearch from "@/components/Icons/IconSearch.vue";
import IconFilter from "@/components/Icons/IconFilter.vue";
import IconClose from '@/components/Icons/IconClose.vue';
import IconComment from '@/components/Icons/IconComment.vue'

/**Modal*/
import Modal from "@/components/Modal/Modal.vue"

/**ảnh sân*/
import anh1 from "@/assets/imgs/bg_san.jpg";
import anh2 from "@/assets/imgs/bg_san1.jpg";
import anh3 from "@/assets/imgs/bg_san2.jpg";

/**Biến router */
const router = useRouter()

/**biến*/
const date = ref();

/**biến mở modal tìm kiếm sân theo địa chỉ*/
const show_modal = ref(false);

/**danh sách sân pickleball*/
const list_yard = ref([
  {
    key: 1,
    name_yard: "Sân Pickleball 1",
    add_yard: "Phương Mai, Đống Đa, Hà Nội",
    img: anh1,
    status: "exhaust",
    evaluate: 3,
    time: "9am - 21pm",
    pitch: 6,
  },
  {
    key: 2,
    name_yard: "Sân Pickleball Phương Nam",
    add_yard: "Phương Mai, Đống Đa, Hà Nội",
    img: anh2,
    status: "exhaust",
    evaluate: 2,
    time: "9am - 21pm",
    pitch: 6,
  },
  {
    key: 3,
    name_yard: "Sân Pickleball Phương Mai",
    add_yard: "Phương Mai, Đống Đa, Hà Nội",
    img: anh3,
    status: "exhaust",
    evaluate: 5,
    time: "9am - 21pm",
    pitch: 6,
  },
  {
    key: 1,
    name_yard: "Sân Pickleball 1",
    add_yard: "Phương Mai, Đống Đa, Hà Nội",
    img: anh1,
    status: "exhaust",
    evaluate: 5,
    time: "9am - 21pm",
    pitch: 6,
  },
  {
    key: 2,
    name_yard: "Sân Pickleball Phương Nam",
    add_yard: "Phương Mai, Đống Đa, Hà Nội",
    img: anh2,
    status: "exhaust",
    evaluate: 4.7,
    time: "9am - 21pm",
    pitch: 6,
  },
  {
    key: 3,
    name_yard: "Sân Pickleball Phương Mai",
    add_yard: "Phương Mai, Đống Đa, Hà Nội",
    img: anh3,
    status: "exhaust",
    evaluate: 5,
    time: "9am - 21pm",
    pitch: 6,
  },
  {
    key: 3,
    name_yard: "Sân Pickleball Phương Mai",
    add_yard: "Phương Mai, Đống Đa, Hà Nội",
    img: anh3,
    status: "exhaust",
    evaluate: 5,
    time: "9am - 21pm",
    pitch: 6,
  },
  {
    key: 1,
    name_yard: "Sân Pickleball 1",
    add_yard: "Phương Mai, Đống Đa, Hà Nội",
    img: anh1,
    status: "exhaust",
    evaluate: 5,
    time: "9am - 21pm",
    pitch: 6,
  },
  {
    key: 2,
    name_yard: "Sân Pickleball Phương Nam",
    add_yard: "Phương Mai, Đống Đa, Hà Nội",
    img: anh2,
    status: "exhaust",
    evaluate: 4.7,
    time: "9am - 21pm",
    pitch: 6,
  },
  {
    key: 3,
    name_yard: "Sân Pickleball Phương Mai",
    add_yard: "Phương Mai, Đống Đa, Hà Nội",
    img: anh3,
    status: "exhaust",
    evaluate: 5,
    time: "9am - 21pm",
    pitch: 6,
  },
  {
    key: 3,
    name_yard: "Sân Pickleball Phương Mai",
    add_yard: "Phương Mai, Đống Đa, Hà Nội",
    img: anh3,
    status: "exhaust",
    evaluate: 5,
    time: "9am - 21pm",
    pitch: 6,
  },
  {
    key: 1,
    name_yard: "Sân Pickleball 1",
    add_yard: "Phương Mai, Đống Đa, Hà Nội",
    img: anh1,
    status: "exhaust",
    evaluate: 5,
    time: "9am - 21pm",
    pitch: 6,
  },
  {
    key: 2,
    name_yard: "Sân Pickleball Phương Nam",
    add_yard: "Phương Mai, Đống Đa, Hà Nội",
    img: anh2,
    status: "exhaust",
    evaluate: 4.7,
    time: "9am - 21pm",
    pitch: 6,
  },
  {
    key: 3,
    name_yard: "Sân Pickleball Phương Mai",
    add_yard: "Phương Mai, Đống Đa, Hà Nội",
    img: anh3,
    status: "exhaust",
    evaluate: 5,
    time: "9am - 21pm",
    pitch: 6,
  },
]);

/**Lưu ô input nào đang được focus*/
const activeInput = ref(null);

/**giá trị tìm kiếm theo địa chỉ*/
const Address_value = ref('')

/**giá trị tìm kiếm theo tên sân*/
const name_value = ref('')

// Điều kiện để nút "Tìm kiếm" được bấm
const isSearchDisabled = computed(() => {
  return !Address_value.value.trim() && !name_value.value.trim();
});

/**hàm đóng modal*/
function showModal() {
  show_modal.value = false;
}

/***/
const setActive = (field) => {
  activeInput.value = field;
};

/***/
const removeActive = () => {
  activeInput.value = null;
};

/**Khi xem một sân*/
function goToDetail(){
  router.push('/detail');
} 



</script>
