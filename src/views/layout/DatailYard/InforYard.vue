<template>
    <div class="flex h-dvh flex-col  ">
        <header class="h-40 w-full">
            <img class="w-full h-full" :src="ImgYard" alt="">
        </header>
        <main class="h-full relative bg-green w-full">
            <div class="flex absolute top-[-40px] left-5 items-center gap-2">
                <img :src="ImgYard" class="w-25 h-25 rounded-full" alt="">
            </div>
            <h3 class="text-white text-xl font-semibold ml-30 mt-3">
                Thiên Lý Ơi
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
                <div @click="showMap(infor_yard.Address)"
                    class="flex gap-2 py-5 px-2 cursor-pointer  w-full border-b border-slate-400 items-center">
                    <IconLocation class="w-5 h-5 text-white"></IconLocation>
                    <p class="text-sm text-white">
                        {{ infor_yard.Address }}
                    </p>
                </div>
                <!--  -->
                <div class="flex gap-2 py-5 px-2 w-full border-b border-slate-400 items-center">
                    <IconClock class="w-5 h-5 text-white"></IconClock>
                    <p class="text-sm text-white">
                        Giờ hoạt động: {{ infor_yard.time_opent }}
                    </p>
                </div>
                <!--  -->
                <div class="flex gap-2 py-5 px-2 w-full  items-center">
                    <Iconphones class="w-5 h-5 text-white"></Iconphones>
                    <p class="text-sm text-white">
                        {{ infor_yard.phone }}
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
                            <th class="border border-green-700 p-2">Thứ</th>
                            <th class="border border-green-700 p-2">Khung giờ</th>
                            <th class="border border-green-700 p-2">Giá</th>
                        </tr>
                    </thead>
                    <!-- Nội dung bảng -->
                    <tbody class="text-green-900 text-center">
                        <template v-for="(day, index) in infor_yard.price_yard" :key="index">
                            <tr v-for="(time, timeIndex) in day.time" :key="timeIndex">
                                <!-- Ô thứ chỉ hiển thị 1 lần cho mỗi nhóm -->
                                <td v-if="timeIndex === 0" :rowspan="day.time.length"
                                    class="border border-green-700 p-2">
                                    {{ day.time_day }}
                                </td>
                                <td class="border border-green-700 p-2">{{ time.hour_time }}</td>
                                <td class="border border-green-700 p-2">{{ time.price_time }}</td>
                            </tr>
                        </template>
                    </tbody>
                </table>
            </div>
            <!-- Hình ảnh -->
            <div v-if="yarf_select === 3" class="grid py-5 grid-cols-3 gap-2 px-5">
                <img class="w-[80%] h-50" v-for="(item, index) in infor_yard.list_img" :key="index" :src="item" alt="">

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
                            <vue3-star-ratings v-model="item.Star" />
                        </div>
                        <p class="text-xs text-white">{{ item.content }}</p>
                    </div>
                </div>
            </div>
        </main>
    </div>
    <!-- Modal -->
    <Modal v-if="show_modal" :close="showModal">
        <template #content>
            <main class="flex-1 py-2 h-full main overflow-hidden">
                <!-- Phần hiển thị bản đồ -->
                <div id="map"></div>
            </main>
        </template>
    </Modal>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
/**Thư viện*/
import vue3starRatings from "vue3-star-ratings";
import L from 'leaflet';



/**icon*/
import Iconphones from '@/components/Icons/Iconphones.vue'
import IconClock from '@/components/Icons/IconClock.vue'
import IconLocation from '@/components/Icons/IconLocation.vue'
import IconEdit from '@/components/Icons/IconEdit.vue'

/**modal*/
import Modal from '@/components/Modal/Modal.vue';

/*ảnh sân **/
import ImgYard from '@/assets/imgs/bg2.jpg'
import Img from '@/assets/imgs/bg10.jpg'
import Imgbg from '@/assets/imgs/bg_san1.jpg'
import Img1 from '@/assets/imgs/bg_san.jpg'
import Img2 from '@/assets/imgs/bg_san2.jpg'
import ImgUser from '@/assets/imgs/avatarUser.png'

/**Biến thư viện hiển thị bản đồ */
const mapPosition = ref<{ lat: number; lon: number } | null>(null);
let mapInstance: L.Map | null = null;

/**biến kiểm tra xem thông tin gì của sân*/
const yarf_select = ref(1)

/*Thông tin sân **/
const infor_yard = ref({
    name_yard: 'Hoa Thiên Lý',
    img: ImgYard,
    Address: "19 Tố Hữu, Nam Từ Liêm, Hà Nội",
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

/**Hàm mở bản đồ*/
/**Hàm mở bản đồ*/
const showMap = async (address: string) => {
    show_modal.value = true; // Hiển thị modal

    nextTick(async () => { // Đảm bảo DOM đã được cập nhật
        const coordinates = await getCoordinates(address);
        if (coordinates) {
            mapPosition.value = coordinates;
            
            // Khởi tạo bản đồ chỉ khi modal được mở
            if (!mapInstance) {
                mapInstance = L.map('map').setView([coordinates.lat, coordinates.lon], 13); // Đặt tọa độ
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    maxZoom: 25, // Mức zoom tối đa
                    tileSize: 256, // Kích thước tile
                    zoomOffset: 0, // Đặt lại offset zoom
                }).addTo(mapInstance);
            } else {
                mapInstance.setView([coordinates.lat, coordinates.lon], 13); // Cập nhật vị trí nếu bản đồ đã được khởi tạo
            }

            L.marker([coordinates.lat, coordinates.lon])
                .addTo(mapInstance)
                .bindPopup(address)
                .openPopup();

            mapInstance.invalidateSize(); // Đảm bảo bản đồ được vẽ lại đúng sau khi thay đổi
        }
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



</script>
