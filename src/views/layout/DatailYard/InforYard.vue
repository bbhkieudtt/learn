<template>
    <div class="flex overflow-hidden h-dvh flex-col  ">
        <header class="h-40 w-full">
            <img class="w-full h-auto object-cover" :src="Img2" alt="">
            <img  @click="goToDetail" :src="logoPick" alt="Logo" class="w-10 h-10 rounded-full">
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
                <button v-if="isOwner" @click="editCourtModal"
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
                            <td class="border border-green-700 p-2">
                                {{ time.childCourtName }}
                            </td>
                            <td class="border border-green-700 p-2">{{ time.position }}</td>
                            <td class="border border-green-700 p-2">{{ formatCurrency(time.rentCost) + 'đ /giờ' }}</td>
                        </tr>

                    </tbody>
                </table>
            </div>
            <!-- Hình ảnh -->
            <div v-if="yarf_select === 3" class="grid py-5 grid-cols-3 gap-2 px-5">
                <img class="w-[80%] h-50" v-for="(item, index) in store_court.court_detail?.images" :key="index"
                    :src="item" alt="">

            </div>
            <!-- Đánh giá -->
            <div v-if="yarf_select === 4" class="flex flex-col px-5 py-3 gap-2 ">
                <div v-for="(item, index) in filteredReviews" :key="index"
                    class="flex border-b border-slate-400 items-center pb-3 gap-3">
                    <!-- <img :src="item.avatar" class="w-15 h-15 rounded-full flex-shrink-0" alt="avatar"> -->
                    <div class="flex flex-col gap-0.5">
                        <p class="text-white text-sm font-medium">{{ item.username }}</p>
                        <div class="flex gap-1 items-center">
                            <p class="text-sm text-yellow-500">{{ item.ratingStar }}</p>
                            <!--  -->
                            <vue3-star-ratings :interactive="false" v-model="item.ratingStar" />
                        </div>
                        <p class="text-xs text-white">{{ item.content }}</p>
                    </div>
                </div>
                <!-- v-if="is_comment" -->
                <button  @click="openComment"
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
            <main v-if="is_comment === 'map'" class="flex-1 w-[700px] h-[480px] py-2  main overflow-hidden">
                <!-- Phần hiển thị bản đồ -->
                <div id="map"></div>
            </main>
            <main v-if="is_comment === 'comment'" class="flex w-[500px] h-[380px] px-2  flex-col">
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
                                <vue3-star-ratings v-model="review.ratingStar" :increment="1" :star-size="30"
                                    :max-rating="4" :show-rating="false" />
                                <p class="text-sm text-yellow-500"></p>
                            </div>

                        </div>

                        <!-- Nhập tên sân -->
                        <div class="flex flex-col gap-2 w-full pb-5" :class="{
                            'opacity-50': activeInput !== 'addresss' && !comment.content
                        }">
                            <label class="font-semibold text-green-900" for="">Viết đánh giá </label>
                            <input v-model="review.content" placeholder="Hãy chia sẻ nhận xét cho sân này bạn nhé !"
                                class="w-full px-3 py-2 outline-none rounded-md border border-green-600" type="text"
                                @focus="setActive('addresss')" @blur="removeActive" />
                        </div>
                    </div>
                </body>
                <footer class="flex-shrink-0 py-2">
                    <button @click="createComment"
                        class="flex px-3  w-full py-2 text-center rounded-lg text-sm text-white gap-1 bg-yellow-500">

                        <p class="font-medium">
                            Tạo đánh giá
                        </p>
                    </button>
                </footer>
            </main>
            <main v-if="is_comment === 'edit'" class="w-[1100px] flex flex-col px-3">
                <!-- Header -->
                <header class="flex items-center border-b border-slate-300 py-2 justify-between">
                    <p class="text-green-800 text-xl font-semibold">Chỉnh sửa sân</p>
                    <XMarkIcon @click="showModal" class="h-5 w-5 hover:bg-slate-300 rounded-lg" />
                </header>

                <!-- Body -->
                <div class="w-full grid py-2 gap-4 grid-cols-2">
                    <!-- Cột trái -->
                    <div class="flex-col col-span-1 flex text-sm font-medium text-green-700">
                        <!-- Tên sân -->
                        <div class="flex flex-col gap-2 pb-5"
                            :class="{ 'opacity-50': activeInput !== 'addresss' && !store_court?.court_detail?.courtName }">
                            <label class="font-semibold text-green-900">Tên sân</label>
                            <input v-if="store_court.court_detail" v-model="store_court.court_detail.courtName"
                                placeholder="Nhập tên sân"
                                class="w-full px-3 py-2 outline-none rounded-md border border-green-600" type="text"
                                @focus="setActive('addresss')" @blur="removeActive" />
                        </div>

                        <!-- Địa chỉ chi tiết -->
                        <el-form label-position="top" class="grid grid-cols-2 gap-2 w-full">
                            <el-form-item label="Chọn Quận/Huyện">
                                <el-select v-model="selectedDistrict" placeholder="Chọn quận/huyện" @change="getWards"
                                    size="large">
                                    <el-option v-for="district in store.districts" :key="district.code" :label="district.name"
                                        :value="district.code" />
                                </el-select>
                            </el-form-item>

                            <el-form-item label="Chọn Phường/Xã">
                                <el-select v-model="selectedWard" placeholder="Chọn phường/xã"
                                    :disabled="wards.length === 0" size="large">
                                    <el-option v-for="ward in wards" :key="ward.code" :label="ward.name"
                                        :value="ward.code" />
                                </el-select>
                            </el-form-item>

                            <el-form-item v-if="store_court?.court_detail?.street" label="Nhập Đường" class="col-span-2"
                                size="large">
                                <el-input v-model="store_court.court_detail.street" placeholder="Nhập tên đường" />
                            </el-form-item>
                        </el-form>

                        <!-- Kết quả địa chỉ -->
                        <div class="h-10">
                            <p>
                                <strong>Địa chỉ:</strong> {{ store_court.court_detail?.street }}, {{
                                    store_court.court_detail?.ward }}, {{
                                    store_court.court_detail?.district }}, Hà Nội
                            </p>
                        </div>

                        <!-- Giá tiền -->
                        <!-- <el-form label-position="top" class="w-full grid py-2 grid-cols-2 gap-2">
                            <el-form-item label="Giá thuê sân từ (VNĐ/giờ)">
                                <el-input v-if="store_court?.court_detail?.maxPrice" v-model.number="store_court.court_detail.maxPrice" placeholder="Nhập giá tối thiểu"
                                    :formatter="formatCurrency" :parser="parseCurrency" size="large" />
                            </el-form-item>

                            <el-form-item label="Giá thuê sân đến (VNĐ/giờ)">
                                <el-input v-model.number="infor_yard.maxPrice" placeholder="Nhập giá tối đa"
                                    :formatter="formatCurrency" :parser="parseCurrency" size="large" />
                            </el-form-item>
                        </el-form> -->

                        <!-- Giờ mở cửa -->
                        <div class="w-full flex flex-col gap-1.5">
                            <label class="text-sm font-medium text-slate-700">Thời gian mở cửa</label>
                            <div class="w-full flex justify-between items-center">
                                <Datepicker class="w-[50%]" v-model="timeRange" range time-picker
                                    :minute-increment="60" />
                                <p>Thời gian đã chọn: {{ formattedTime }}</p>
                            </div>
                        </div>

                        <!-- Mô tả sân -->
                        <div v-if="store_court?.court_detail?.courtDescription"
                            class="w-full flex flex-col mt-5 gap-1.5">
                            <label class="text-sm font-medium text-slate-700">Mô tả sân</label>
                            <textarea v-model="store_court.court_detail.courtDescription" cols="30" rows="5"
                                class="p-2 rounded-lg border border-slate-300"></textarea>
                        </div>
                    </div>

                    <!-- Cột phải -->
                    <div class="flex-col col-span-1 flex text-sm font-medium text-green-700">
                        <!-- Tên chủ sân -->
                        <div v-if="store_court.court_detail?.contactPerson" class="flex flex-col gap-2 pb-5"
                            :class="{ 'opacity-50': activeInput !== 'address' && !store_court.court_detail.contactPerson }">
                            <label class="font-semibold text-green-900">Tên chủ sân</label>
                            <input v-model="store_court.court_detail.contactPerson" placeholder="Nhập tên chủ sân"
                                class="w-full px-3 py-2 outline-none rounded-md border border-green-600" type="text"
                                @focus="setActive('address')" @blur="removeActive" />
                        </div>

                        <!-- Số điện thoại -->
                        <div v-if="store_court?.court_detail?.contactPhone" class="flex flex-col gap-2 pb-5"
                            :class="{ 'opacity-50': activeInput !== 'addressss' && !store_court.court_detail.contactPhone }">
                            <label class="font-semibold text-green-900" for="phone">Số điện thoại chủ sân</label>
                            <input v-model="store_court.court_detail.contactPhone" placeholder="Nhập số điện thoại"
                                class="w-full px-3 py-2 outline-none rounded-md border border-green-600" type="tel"
                                inputmode="numeric" pattern="\d*" @input="validatePhoneNumber"
                                @focus="setActive('addressss')" @blur="removeActive" />
                        </div>

                        <!-- Ảnh sân -->
                        <div class="w-full flex flex-col mt-5 gap-1.5">
                            <button @click="triggerFileInput"
                                class="flex gap-2 w-fit rounded-lg bg-yellow-500 py-2 px-2">
                                <p class="text-sm text-white font-medium">Tải ảnh sân</p>
                                <CloudArrowUpIcon class="h-5 w-5 text-white" />
                                <input type="file" ref="fileInput" @change="uploadImage" class="hidden" />
                            </button>

                            <!-- Hiển thị ảnh đã tải lên -->
                            <div class="w-full"
                                v-if="store_court?.court_detail?.images && store_court.court_detail?.images.length > 0">
                                <div class="w-full mt-4 grid grid-cols-4 gap-3">
                                    <img v-for="(url, index) in store_court.court_detail.images" :key="index" :src="url"
                                        alt="Uploaded Image" class="rounded-xl h-[100px] w-full object-cover" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <footer class="w-full flex justify-end py-2 px-3 border-t border-slate-300">
                    <button @click="editCourt"
                        class="px-3 py-2 bg-yellow-500 text-sm font-semibold text-white rounded-lg w-fit">
                        Cập nhật sân
                    </button>
                </footer>
            </main>
        </template>
    </Modal>
</template>

<script setup lang="ts">

import { ref, onMounted, nextTick, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStoreCourt } from '@/stores/appStoreCourt'
import { useAppStore } from "@/stores/appStore";
import logoPick from"@/assets/imgs/logoPick.png"


/**api*/
import { apiGetListBooking, } from "@/service/api/apiBoking";
import { apiUpdateCourt, apiGetCourt } from "@/service/api/apiCourt";


/**Thư viện*/
import vue3starRatings from "vue3-star-ratings";
import L from 'leaflet';

import Datepicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";


/**icon*/
import Iconphones from '@/components/Icons/Iconphones.vue'
import IconClock from '@/components/Icons/IconClock.vue'
import IconLocation from '@/components/Icons/IconLocation.vue'
import IconEdit from '@/components/Icons/IconEdit.vue'
import { ArrowLeftIcon, XMarkIcon, UserCircleIcon } from "@heroicons/vue/24/solid";

/**modal*/
import Modal from '@/components/Modal/Modal.vue';

/*ảnh sân **/
import Img2 from '@/assets/imgs/bg_san2.jpg'
import ImgYard from '@/assets/imgs/bg_san2.jpg'

/**api*/
import { apiCreateReview, apiGetListReview } from "@/service/api/apiReview";

/**kiểu dữ liệu*/

import type { Review, Division, Location } from '@/interface'

/**toast*/
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import axios from "axios";


const store = useAppStore()

const selectedDistrict = ref("");      // Mã quận/huyện
const selectedWard = ref<number | null>(null);       // Mã phường/xã
const selectedStreet = ref("");

const timeRange = ref([
    { hours: 6, minutes: 0, seconds: 0 },
    { hours: 22, minutes: 0, seconds: 0 },
]);

watch(timeRange, (newVal) => {
    if (Array.isArray(newVal) && newVal.length === 2 && store_court.court_detail) {
        store_court.court_detail.startTime = formatTime(newVal[0]);
        store_court.court_detail.endTime = formatTime(newVal[1]);
    }
});

// ẩn hiện nút chỉnh sửa sân 
const isOwner = computed(() => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || '{}');
  return store_court.court_detail?.userId === userInfo.id;
});


const store_court = useAppStoreCourt()

const address = computed(() => {
    const detail = store_court.court_detail;

    if (!detail) return "";

    return `${detail.street}, ${detail.ward}, ${detail.district}, Hà Nội`;
});

function formatTime(time: { hours: number; minutes: number; seconds: number }): string {
    const pad = (n: number) => n.toString().padStart(2, '0')
    return `${pad(time.hours)}:${pad(time.minutes)}:${pad(time.seconds)}`
}
const formattedTime = computed(() => {
    if (timeRange.value.length === 2) {
        return `${formatTime(timeRange.value[0])} - ${formatTime(timeRange.value[1])}`
    }
    return 'Chưa chọn thời gian'
})


const fileInput = ref<HTMLInputElement | null>(null);



const validImageSrc = computed(() => {
    const img = store_court.court_detail?.images?.[0]
    return isValidImage(img || '') ? img : ImgYard
})

/**Biến Id sân được chọn */
const id_Court = store_court.court_detail?.id ?? 0

/**Biến router */
const router = useRouter()

/**Biến kiểm tra xem mở modal nào*/
const is_comment = ref('comment')

const check_comment = ref(false)

/**Biến thư viện hiển thị bản đồ */
const mapPosition = ref<{ lat: number; lon: number } | null>(null);
let mapInstance: L.Map | null = null;

/**biến kiểm tra xem thông tin gì của sân*/
const yarf_select = ref(1)

/**Lưu ô input nào đang được focus*/
const activeInput = ref('');


const filteredReviews = ref<Review[]>([]);

// Biến tạo bình luận
const review = ref({
    userId: 0,
    courtId: 0,
    content: '',
    ratingStar: 5,

});

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


// const districts = ref<Division[]>([]);
const wards = ref<Location[]>([]);

onMounted(async () => {
    await getListComment()
    await getListBoking()
    getDistricts();
})

// Lấy danh sách quận/huyện Hà Nội
const getDistricts = async () => {
    try {
        // const response = await axios.get("https://provinces.open-api.vn/api/d/");

        // districts.value = response.data // 1 là mã của Hà Nội
        const matchedDistrict: any = store.districts.find((item: any) => item.name === store_court.court_detail?.district);
        selectedDistrict.value = matchedDistrict ? matchedDistrict.code : null;
        getWards()

    } catch (error) {
        console.error("Lỗi khi lấy quận/huyện:", error);
    }
};

// Khi chọn quận/huyện
const getWards = async () => {
    try {
        const response = await axios.get(`https://provinces.open-api.vn/api/d/${selectedDistrict.value}?depth=2`);
        wards.value = response.data.wards;

        console.log("Danh sách phường/xã:", wards.value);

        // Tìm phường/xã trùng với dữ liệu đã lưu (nếu có)
        const matchedWard = wards.value.find((item: any) => item.name === store_court.court_detail?.ward);
        selectedWard.value = matchedWard ? matchedWard.code : null;

    } catch (error) {
        console.error("Lỗi khi lấy phường/xã:", error);
    }
};



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

// Chuyển chuỗi tiền tệ về số khi nhập
const parseCurrency = (value: any) => {
    const cleanedValue = value.replace(/[^\d]/g, ""); // Xóa tất cả ký tự không phải số
    return cleanedValue ? Number(cleanedValue) : null; // Nếu xóa hết, trả về null
};

const uploadImage = async (event: any) => {
    const file = event.target.files[0]; // Lấy file ảnh từ input
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file); // Thêm file vào form data
    formData.append("upload_preset", "uploadImg"); // Thêm upload_preset vào form data

    try {
        const response = await fetch("https://api.cloudinary.com/v1_1/doqa5bvx5/image/upload", {
            method: "POST",
            body: formData,
        });

        const data = await response.json();
        store_court.court_detail?.images.push(data.secure_url); // Thêm đường dẫn ảnh vào mảng
    } catch (error) {
        console.error("Error uploading image:", error);
    }
};

/***/
const setActive = (field: string) => {
    activeInput.value = field;
};


/**Hàm mở bản đồ*/
const showMap = async (address: string) => {
    is_comment.value = 'map'
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
    is_comment.value = 'comment';
    show_modal.value = true;
}

// Hàm để mở file input khi người dùng nhấn vào nút
const triggerFileInput = () => {
    fileInput.value!.click(); // Dùng ! để nói với TypeScript rằng giá trị không phải null
};


/**Hàm mở modal chỉnh sửa sân*/
function editCourtModal() {
    is_comment.value = 'edit'
    show_modal.value = true
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

/**Hàm tạo đánh giá cho sân*/
async function createComment() {
    // Lấy dữ liệu từ localStorage và chuyển đổi thành đối tượng
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || '{}');

    // Lấy id từ đối tượng userInfo và gán cho biến id
    review.value.userId = userInfo.id
    review.value.courtId = store_court.court_detail?.id ?? 0
    review.value.ratingStar = Math.round(review.value.ratingStar);

    try {
        const response = await apiCreateReview(review.value);

        // Kiểm tra nếu API trả về thành công
        if (response && response.status === 200) {
            console.log('response', response);
            toast("Bình luận thành công!", { autoClose: 2000 });

            getListComment()
            
            showModal()


        } else {
            toast("Đăng ký thất bại, vui lòng thử lại!", { autoClose: 3000 });
        }
    } catch (error) {
        console.error("API Error:", error);
    }
}

/**Hàm tạo đánh giá cho sân*/
async function getListComment() {

    try {
        const response = await apiGetListReview();

        // Kiểm tra nếu API trả về thành công
        if (response && response.status === 200) {
            filteredReviews.value = response.data.filter(
                (item: any) => item.courtId === store_court.court_detail?.id
            );
            console.log('filteredReviews.value', filteredReviews.value);

        } else {
            toast("Đăng ký thất bại, vui lòng thử lại!", { autoClose: 3000 });
        }
    } catch (error) {
        console.error("API Error:", error);
    }
}

/**Hàm lấy danh sách lịch đặt sân */
async function getListBoking() {
    try {
        const response = await apiGetListBooking();

        const userInfo = JSON.parse(localStorage.getItem("userInfo") || '{}');

        if (response && response.status === 200) {
            // lấy ra những lịch thuê của người này
            const filteredData = response.data.filter((item: any) =>
                item.userId === userInfo.id
            );

            console.log('filteredData', filteredData);

            // kiểm tra trong lịch thuê có sân này không
            check_comment.value = filteredData.some((item: any) =>
                item.courtId === store_court.court_detail?.id
            );
            console.log('is_comment', is_comment.value);

        }

    } catch (error) {
        console.error("API Error:", error);
    }
}

/**hàm cập nhân sân*/
async function editCourt() {

    const selectedDistrictObj = store.districts.find(item => item.code === selectedDistrict.value);
    const selectedWardObj = wards.value.find(item => item.code === selectedWard.value);

    if (selectedDistrictObj && store_court.court_detail) store_court.court_detail.district = selectedDistrictObj.name;
    if (selectedWardObj && store_court.court_detail) store_court.court_detail.ward = selectedWardObj.name;

    try {
        const response = await apiUpdateCourt(store_court.court_detail);


        if (response && response.status === 200) {


            apiGetCourt()
            toast("Cập nhật sân thành công!", { autoClose: 3000 });

            showModal()
        }

    } catch (error) {
        console.error("API Error:", error);
    }
}

/**check kiểu số điện thoại*/
const validatePhoneNumber = (event: any) => {
    event.target.value = event.target.value.replace(/\D/g, ""); // Loại bỏ tất cả ký tự không phải số
    if (store_court.court_detail)
        store_court.court_detail.contactPhone = event.target.value; // Cập nhật giá trị đã lọc vào biến v-model
};


</script>
