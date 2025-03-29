<template>
    <div class="h-dvh w-dvw bg-green flex flex-col overflow-hidden pt-5 px-5 pb-2 ">
        <header>
            <ArrowLeftIcon class=" flex-shrink-0 w-6 h-6 cursor-pointer text-white"></ArrowLeftIcon>
            <div class="flex-shrink-0 w-full grid grid-cols-3">
                <div @click="clickMenu(menu.key)" v-for="menu in menu_list" :key="menu.key"
                    :class="{ 'text-yellow-400 border-b-2': menu.active, 'text-white ': !menu.active }"
                    class="text-center border-yellow-400 py-2  cursor-pointer font-semibold text-lg">
                    {{ menu.name_menu }}

                </div>
            </div>
        </header>
        <!--  -->
        <main class="h-full py-5 flex-1 w-full overflow-hidden">
            <!-- Chưa có sân -->
            <div v-if="list_yard && list_yard.length === 0" class="w-full h-full flex justify-center items-center">
                <div class="flex-col">
                    <img :src="image9" class="justify-center items-center" alt="">
                    <p class="text-lg text-white font-semibold text-center">Bạn chưa có sân nào</p>
                </div>
            </div>
            <!-- Đã có sân -->
            <div v-else class="w-full h-full flex justify-center overflow-y-auto items-center px-5 ">
                <div class="grid h-full overflow-y-auto grid-cols-4  gap-15">
                    <!-- sân -->
                    <div v-for="yard in list_yard" :key="yard.key"
                        class="flex items-center h-fit border border-white flex-shrink-0  rounded-lg cursor-pointer flex-col  bg-white">
                        <img class="w-60 rounded-t-lg  h-50" :src="yard.img" alt="ảnh sân" />
                        <div class="flex w-full  flex-shrink-0 flex-col  gap-0.5 p-1 py-2">
                            <h3 class="text-sm font-medium text-back truncate">
                                {{ yard.name_yard }}
                            </h3>
                            <p class="text-sm flex-shrink-0 text-slate-500 truncate">{{ yard.add_yard }}</p>
                            <div class="flex items-center gap-2"> <span
                                    class="w-2 h-2 bg-green-500 rounded-full"></span>
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
            <!--  -->
            <button @click="addYard"
                class="flex absolute bottom-8 right-7  text-lg font-medium text-white items-center gap-2 px-6 py-3 rounded-xl bg-yellow-500">
                <PlusIcon class="w-5 h-5 text-white"></PlusIcon>
                <p>Tạo sân</p>
            </button>

        </main>
    </div>
    <!-- Tạo mới sân -->
    <Modal v-if="show_modal" :close="showModal">
        <template #content>
            <div class="w-[1100px] flex flex-col px-3 ">
                <header class="flex items-center border-b border-slate-300 py-2  justify-between">
                    <p class="text-green-800 text-xl font-semibold">
                        Tạo sân
                    </p>
                    <XMarkIcon class="h-5 w-5 hover:bg-slate-300 rounded-lg "></XMarkIcon>
                </header>
                <!--  -->

                <body class="w-full grid py-2 grid-cols-2">
                    <div class="flex-col col-span-1 flex">
                        <!-- Ô nhập địa chỉ sân -->
                        <div class="flex flex-col gap-2 border-b border-slate-200 pb-5" :class="{
                            'opacity-50': activeInput !== 'address' && !Address_value
                        }">
                            <label class="font-semibold text-green-900" for="">Địa chỉ sân</label>
                            <input v-model="infor_yard.nam_yard" placeholder="Nhập địa chỉ sân "
                                class="w-full px-3 py-2 outline-none rounded-md border border-green-600" type="text"
                                @focus="setActive('address')" @blur="removeActive" />
                        </div>
                        <!-- Giờ mở cửa -->
                        <div class="w-full flex justify-between items-center">
                            <Datepicker class=" w-[50%]" v-model="timeRange" range time-picker :minute-increment="60" />
                            <p>Thời gian đã chọn: {{ formattedTime }}</p>
                        </div>

                    </div>
                    <!--  -->
                    <div class="flex col-span-1 flex-col">

                    </div>


                </body>
            </div>
        </template>
    </Modal>

</template>

<script setup lang="ts">
import { ref,computed } from 'vue'

/**Modal*/
import Modal from "@/components/Modal/Modal.vue"

/**ảnh*/
import image9 from '@/assets/imgs/image9.png'

/**icon*/
import { PlusIcon, ArrowLeftIcon, XMarkIcon } from "@heroicons/vue/24/solid";
import IconComment from '@/components/Icons/IconComment.vue'

/**ảnh sân*/
import anh1 from "@/assets/imgs/bg_san.jpg";
import anh2 from "@/assets/imgs/bg_san1.jpg";
import anh3 from "@/assets/imgs/bg_san2.jpg";
import Datepicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

const timeRange = ref([
  { hours: 8, minutes: 0, seconds: 0 },
  { hours: 17, minutes: 0, seconds: 0 },
]);

const formattedTime = computed(() => {
  return timeRange.value.map(t => `${String(t.hours).padStart(2, "0")}:00`).join(" - ");
});

/**Biến thông tin sân tạo mới*/

const infor_yard = ref({
    nam_yard: ''
})
const hours = ref([...Array(19)].map((_, i) => i + 5)); // Tạo danh sách từ 5h - 23h
const startTime = ref(5);
const endTime = ref(23);


/**biến mở modal tìm kiếm sân theo địa chỉ*/
const show_modal = ref(false);

/**Danh sách menu*/
const menu_list = ref([
    {
        key: 1,
        name_menu: 'Sân hoạt động',
        active: true
    },
    {
        key: 2,
        name_menu: 'Sân ngừng hoạt động',
        active: false
    },
    {
        key: 3,
        name_menu: 'Sân bị xóa',
        active: false
    }
])

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

]);

/**Lưu ô input nào đang được focus*/
const activeInput = ref(null);

/***/
const setActive = (field) => {
    activeInput.value = field;
};

/***/
const removeActive = () => {
    activeInput.value = null;
};


/**Bấm chọn danh sách*/
function clickMenu(key: number) {
    menu_list.value.forEach((item) => {
        item.active = false
        if (item.key === key) {
            item.active = true
        }
    });
}

/**hàm đóng modal*/
function showModal() {
    show_modal.value = false;
}

/**Tạo mới sân*/
function addYard() {
    show_modal.value = true;
}


</script>
