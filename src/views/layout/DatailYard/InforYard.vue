<template>
    <div class="flex overflow-hidden h-dvh flex-col  ">
        <header class="h-40 w-full">
            <img class="w-full h-auto object-cover" :src="Img2" alt="">
            <ArrowLeftIcon @click="goToDetail" class="w-7 absolute top-4 left-4 cursor-pointer h-7 text-white">
            </ArrowLeftIcon>
        </header>
        <main class="h-full relative bg-green w-full">
            <div class="flex absolute top-[-40px] left-5 items-center gap-2">
                <img :src="validImageSrc" class="w-25 h-25 rounded-full" alt="">
            </div>
            <h3 class="text-white text-xl font-semibold ml-30 mt-3">
                {{ store_court.court_detail?.courtName }}
            </h3>

            <div class="grid grid-cols-4 mt-10">
                <div v-for="(item, index) in list_items" :key="index" :class="{
                    'border-white , border-b': yarf_select === item.key
                }" class="flex justify-center cursor-pointer hover:bg-green-700  items-center pb-2 text-sm text-white"
                    @click="yarf_select = item.key">
                    {{ item.name_items }}
                </div>
            </div>
            <!--Thông tin sân   -->
            <div v-if="yarf_select === 1" class="flex flex-col w-full">
                <div @click="showMap(address)"
                    class="flex gap-2 py-5 px-2 cursor-pointer  w-full border-b border-slate-400 items-center">
                    <IconLocation class="w-5 h-5 text-white"></IconLocation>
                    <p class="text-sm text-white">
                        {{ address }}
                    </p>
                </div>
                <!--  -->
                <div class="flex gap-2 py-5 px-2 w-full border-b border-slate-400 items-center">
                    <IconClock class="w-5 h-5 text-white"></IconClock>
                    <p class="text-sm text-white">
                        Giờ hoạt động: {{ store_court.court_detail?.startTime && store_court.court_detail?.endTime ?
                            formatHour(store_court.court_detail?.startTime) + ' - ' +
                            formatHour(store_court.court_detail?.endTime) : '24/7' }}
                    </p>
                </div>
                <!--chủ sân   -->
                <div class="flex gap-2 border-b border-slate-400 py-5 px-2 w-full  items-center">
                    <UserCircleIcon class="w-5 h-5 text-white"></UserCircleIcon>
                    <p class="text-sm text-white flex gap-2 ">
                        <p>Chủ sân: </p>
                        <span class="font-semibold">{{ store_court.court_detail?.contactPerson }}</span>
                    </p>
                </div>
                <!--  -->
                <div class="flex gap-2 py-5 px-2 w-full  items-center">
                    <Iconphones class="w-5 h-5 text-white"></Iconphones>
                    <p class="text-sm text-white">
                        {{ store_court.court_detail?.contactPhone }}
                    </p>
                </div>
                <button
                    class="flex px-3 absolute bottom-4 right-5 py-2 rounded-lg text-sm text-white gap-1 bg-yellow-500">
                    <IconEdit class="w-5 h-5 text-white"></IconEdit>
                    <p class="font-medium">
                        Chỉnh sửa thông tin sân
                    </p>
                </button>
            </div>
            <!-- Bảng giá sân -->
            <div v-if="yarf_select === 2" class="overflow-x-auto p-4">
                <table class="w-full border-collapse border bg-white border-green-700">
                    <!-- Tiêu đề -->
                    <thead class="bg-white text-white">
                        <tr>
                            <th colspan="3" class="border text-green-800 border-green-700 p-2 text-center">Bảng Giá Sân
                            </th>
                        </tr>
                        <tr class="text-green-900">
                            <th class="border border-green-700 p-2">Sân con</th>
                            <th class="border border-green-700 p-2">Loại sân</th>
                            <th class="border border-green-700 p-2">Giá</th>
                        </tr>
                    </thead>
                    <!-- Nội dung bảng -->
                    <tbody class="text-green-900 text-center">
                       
                            <tr v-for="(time, timeIndex) in list_child" :key="timeIndex">
                                <!-- Ô thứ chỉ hiển thị 1 lần cho mỗi nhóm -->
                                <td
                                    class="border border-green-700 p-2">
                                    {{ time.childCourtName }}
                                </td>
                                <td class="border border-green-700 p-2">{{ time.position }}</td>
                                <td class="border border-green-700 p-2">{{ formatCurrency( time.rentCost) + 'đ /giờ' }}</td>
                            </tr>
                        
                    </tbody>
                </table>
            </div>
            <!-- Hình ảnh -->
            <div v-if="yarf_select === 3" class="grid py-5 grid-cols-3 gap-2 px-5">
                <img class="w-[80%] h-50" v-for="(item, index) in  store_court.court_detail?.images" :key="index" :src="item" alt="">

            </div>
            <!-- Đánh giá -->
            <div v-if="yarf_select === 4" class="flex flex-col px-5 py-3 gap-2 ">
                <div v-for="(item, index) in infor_yard.list_comment" :key="index"
                    class="flex border-b border-slate-400 items-center pb-3 gap-3">
                    <img :src="item.avatar" class="w-15 h-15 rounded-full flex-shrink-0" alt="avatar">
                    <div class="flex flex-col gap-0.5">
                        <p class="text-white text-sm font-medium">{{ item.user_cm }}</p>
                        <div class="flex gap-1 items-center">
                            <p class="text-sm text-yellow-500">{{ item.Star }}</p>
                            <!--  -->
                            <vue3-star-ratings :interactive="false" v-model="item.Star" />
                        </div>
                        <p class="text-xs text-white">{{ item.content }}</p>
                    </div>
                </div>
                <button @click="openComment"
                    class="flex px-3 absolute bottom-4 right-5 py-2 rounded-lg text-sm text-white gap-1 bg-yellow-500">
                    <IconEdit class="w-5 h-5 text-white"></IconEdit>
                    <p class="font-medium">
                        Đánh giá sân
                    </p>
                </button>

            </div>
        </main>
    </div>
    <!-- Modal -->
    <Modal v-if="show_modal" :close="showModal">
        <template #content>
            <main v-if="!is_comment" class="flex-1 w-[700px] h-[480px] py-2  main overflow-hidden">
                <!-- Phần hiển thị bản đồ -->
                <div id="map"></div>
            </main>
            <main v-else class="flex w-[500px] h-[380px] px-2  flex-col">
                <header class="flex items-center border-b border-slate-300 py-2  justify-between">
                    <p class="text-green-800 text-xl font-semibold">
                        Tạo đánh giá
                    </p>
                    <XMarkIcon @click="showModal" class="h-5 w-5 hover:bg-slate-300 rounded-lg "></XMarkIcon>
                </header>
                <!--  -->

                <body class="w-full h-full flex-1 py-2 ">
                    <div class="flex-col w-full col-span-1 flex text-sm font-medium text-green-700">
                        <!-- Nhập tên sân -->
                        <div class="flex flex-col gap-2  pb-5">
                            <label class="font-semibold text-green-900" for="">Chất lượng sân </label>
                            <div class="flex gap-1 items-center">

                                <!--  -->
                                <vue3-star-ratings v-model="comment.ratingStar" />
                                <p class="text-sm text-yellow-500"></p>
                            </div>

                        </div>

                        <!-- Nhập tên sân -->
                        <div class="flex flex-col gap-2 w-full pb-5" :class="{
                            'opacity-50': activeInput !== 'addresss' && !comment.content
                        }">
                            <label class="font-semibold text-green-900" for="">Viết đánh giá </label>
                            <input v-model="comment.content" placeholder="Hãy chia sẻ nhận xét cho sân này bạn nhé !"
                                class="w-full px-3 py-2 outline-none rounded-md border border-green-600" type="text"
                                @focus="setActive('addresss')" @blur="removeActive" />
                        </div>
                    </div>
                </body>
                <footer class="flex-shrink-0 py-2">
                    <button @click="openComment"
                        class="flex px-3  w-full py-2 text-center rounded-lg text-sm text-white gap-1 bg-yellow-500">

                        <p class="font-medium">
                            Tạo đánh giá
                        </p>
                    </button>
                </footer>
            </main>
        </template>
    </Modal>
</template>

<script setup lang="ts">

import { ref, onMounted, nextTick, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStoreCourt } from '@/stores/appStoreCourt'


/**Thư viện*/
import vue3starRatings from "vue3-star-ratings";
import L from 'leaflet';


/**icon*/
import Iconphones from '@/components/Icons/Iconphones.vue'
import IconClock from '@/components/Icons/IconClock.vue'
import IconLocation from '@/components/Icons/IconLocation.vue'
import IconEdit from '@/components/Icons/IconEdit.vue'
import { ArrowLeftIcon, XMarkIcon, UserCircleIcon } from "@heroicons/vue/24/solid";

/**modal*/
import Modal from '@/components/Modal/Modal.vue';

/*ảnh sân **/
import ImgYard from '@/assets/imgs/bg2.jpg'
import Img from '@/assets/imgs/bg10.jpg'
import Imgbg from '@/assets/imgs/bg_san1.jpg'
import Img1 from '@/assets/imgs/bg_san.jpg'
import Img2 from '@/assets/imgs/bg_san2.jpg'
import ImgUser from '@/assets/imgs/avatarUser.png'
import ImgUsers from '@/assets/imgs/bgmain1.jpg'

const store_court = useAppStoreCourt()

const address = computed(() => {
    const detail = store_court.court_detail;

    if (!detail) return "";

    return `${detail.street}, ${detail.ward}, ${detail.district}, Hà Nội`;
});


const validImageSrc = computed(() => {
    const img = store_court.court_detail?.images?.[0]
    return isValidImage(img || '') ? img : ImgYard
})

/**Biến Id sân được chọn */
const id_Court = store_court.court_detail?.id ?? 0

/**Biến router */
const router = useRouter()

/**Biến kiểm tra xem mở modal nào*/
const is_comment = ref(false)

/**Biến thư viện hiển thị bản đồ */
const mapPosition = ref<{ lat: number; lon: number } | null>(null);
let mapInstance: L.Map | null = null;

/**biến kiểm tra xem thông tin gì của sân*/
const yarf_select = ref(1)

/**Lưu ô input nào đang được focus*/
const activeInput = ref('');

/*Thông tin sân **/
const infor_yard = ref({
    name_yard: 'Hoa Thiên Lý',
    img: ImgYard,
    Address: "96 Định Công, Hoàng Mai, Hà Nội",
    phone: '098765432',
    time_opent: '5:00 - 23:00',
    price_yard: [{
        time_day: 'T2 - T6',
        time: [{
            hour_time: '5h-17h',
            price_time: '100.000 đ',
        },
        {
            hour_time: '16-23h',
            price_time: '150.000 đ',
        }]

    }, {
        time_day: 'T7 - CN',
        time: [{
            hour_time: '5h-23h',
            price_time: '170.000 đ',
        },
        ]
    }],
    list_img: [
        Imgbg, Img1, Img2
    ],
    list_comment: [
        {
            user_cm: "Mỹ Linh",
            avatar: ImgUser,
            content: 'Dịch vụ tốt',
            Star: 5
        },
        {
            user_cm: "Mỹ Linh",
            avatar: Img,
            content: 'Dịch vụ tốt',
            Star: 5
        },
        {
            user_cm: "Mỹ Linh",
            avatar: ImgUser,
            content: 'Dịch vụ tốt',
            Star: 5
        }
    ]

})

/**Biến mở modal map*/
const show_modal = ref(false);

const comment = ref({
    userId: 0,
    courtId: 0,
    content: '',
    ratingStar: 5
})

/**danh sách mục tiêu đánh giá*/
const list_items = ref([
    {
        key: 1,
        name_items: 'Thông tin',
    },
    {
        key: 2,
        name_items: 'Giá thuê sân',
    }, {
        key: 3,
        name_items: 'Hình ảnh',
    },
    {
        key: 4,
        name_items: 'Đánh giá',
    }
])

const list_child = computed(() => {
  if (!Array.isArray(store_court.list_chill_court)) return [];
  return store_court.list_chill_court.filter(child => child.courtId === id_Court)
})

const getCoordinates = async (address: string) => {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&addressdetails=1`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data && data[0]) {
            const lat = parseFloat(data[0].lat);
            const lon = parseFloat(data[0].lon);
            return { lat, lon };
        } else {
            alert('Không tìm thấy địa chỉ này trên bản đồ.');
            return null;
        }
    } catch (err) {
        console.error('Lỗi khi tìm kiếm địa chỉ:', err);
        alert('Có lỗi xảy ra khi tìm kiếm địa chỉ.');
        return null;
    }
};

/***/
const setActive = (field: string) => {
    activeInput.value = field;
};


/**Hàm mở bản đồ*/
const showMap = async (address: string) => {
    is_comment.value = false
    show_modal.value = true; // Hiển thị modal
    console.log('Địa chỉ đang tìm:', address);

    nextTick(async () => {
        const coordinates = await getCoordinates(address);
        if (!coordinates) return;

        mapPosition.value = coordinates;

        setTimeout(() => { // Đợi modal hiển thị hoàn toàn
            if (mapInstance) {
                mapInstance.remove(); // Xóa bản đồ cũ nếu có
            }

            mapInstance = L.map('map').setView([coordinates.lat, coordinates.lon], 13);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 18,
                tileSize: 256,
                zoomOffset: 0,
            }).addTo(mapInstance);

            L.marker([coordinates.lat, coordinates.lon])
                .addTo(mapInstance)
                .bindPopup(address)
                .openPopup();

            mapInstance.invalidateSize();
        }, 500); // Đợi 500ms để modal hiển thị hoàn toàn
    });
};





window.addEventListener('resize', () => {
    if (mapInstance) {
        mapInstance.invalidateSize(); // Cập nhật lại bản đồ khi kích thước cửa sổ thay đổi
    }
});



/**hàm đóng modal*/
function showModal() {
    show_modal.value = false;
}

/**Hàm chở về trang */
function goToDetail() {
    router.push('/detail')
}

/***/
const removeActive = () => {
    activeInput.value = '';
};


/***/
function openComment() {
    is_comment.value = true;
    show_modal.value = true;
}

/**Kiểm tra link ảnh*/
function isValidImage(image: string) {
    // Kiểm tra xem image có phải là một URL hợp lệ hay không (bắt đầu với http:// hoặc https://)
    const urlPattern = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|bmp|webp))$/i;
    return urlPattern.test(image);
}

/**formatHour*/
function formatHour(timeStr: string): string {
    return timeStr?.slice(0, 5) // Lấy 5 ký tự đầu: "08:00"
}

// Định dạng số thành tiền VND
const formatCurrency = (value: any) => {
  if (value === null || value === undefined || value === "") return ""; // Cho phép xóa hết số
  return new Intl.NumberFormat("vi-VN").format(value);
};
</script>
