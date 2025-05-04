<template>
    <div class="flex flex-col h-screen overflow-hidden bg-gray-100">
        <!-- Header -->
        <header class="relative h-48 w-full">
            <img class="w-full h-full z-10 object-cover" :src="Img2" alt="Court Banner" />
            <img @click="goToDetail" :src="logoPick" alt="Logo"
                class="w-12 h-12 absolute top-4 left-4 rounded-full shadow-lg cursor-pointer transition-transform hover:scale-105" />
        </header>

        <!-- Main Content -->
        <main class="flex-1 bg-green w-full overflow-y-auto">
            <!-- Adjusted avatar positioning to ensure it's fully visible -->
            <div class="absolute top-[145px] left-6 flex items-center gap-3 z-50">
                <img :src="validImageSrc" class="w-25 h-25 rounded-full border-4 border-white shadow-md"
                    alt="Court Image" />
                <h3 class="text-white text-2xl font-bold mt-8 ml-2 drop-shadow-md">
                    {{ store_court.court_detail?.courtName }}
                </h3>
            </div>


            <!-- Navigation Tabs -->
            <div class="mt-16 mx-4 rounded-lg bg-green-900/50 backdrop-blur-sm shadow-lg"
                :class="isOwner ? 'grid grid-cols-5' : 'grid grid-cols-4'">
                <div v-for="(item, index) in filteredListItems" :key="index" :class="{
                    'border-b-2 border-white': yarf_select === item.key,
                    'hover:bg-green-700/70': true
                }" class="flex justify-center items-center py-3 text-white text-sm font-medium cursor-pointer transition-colors duration-200"
                    @click="yarf_select = item.key">
                    {{ item.name_items }}
                </div>
            </div>

            <div v-if="yarf_select === 1" class="flex flex-col w-full px-6 py-4 relative">
                <div @click="showMap(address)"
                    class="flex gap-3 py-4 px-4 rounded-lg bg-green-700/30 hover:bg-green-700/50 cursor-pointer items-center transition-colors duration-200">
                    <IconLocation class="w-6 h-6 text-white" />
                    <p class="text-white text-sm">{{ address }}</p>
                </div>
                <div class="flex gap-3 py-4 px-4 rounded-lg bg-green-700/30 items-center mt-2">
                    <IconClock class="w-6 h-6 text-white" />
                    <p class="text-white text-sm">
                        Giờ hoạt động: {{ store_court.court_detail?.startTime && store_court.court_detail?.endTime ?
                            formatHour(store_court.court_detail?.startTime) + ' - ' +
                            formatHour(store_court.court_detail?.endTime) : '24/7' }}
                    </p>
                </div>
                <div class="flex gap-3 py-4 px-4 rounded-lg bg-green-700/30 items-center mt-2">
                    <UserCircleIcon class="w-6 h-6 text-white" />
                    <p class="text-white text-sm">
                        Chủ sân: <span class="font-semibold">{{ store_court.court_detail?.contactPerson }}</span>
                    </p>
                </div>
                <div class="flex gap-3 py-4 px-4 rounded-lg bg-green-700/30 items-center mt-2">
                    <Iconphones class="w-6 h-6 text-white" />
                    <p class="text-white text-sm">{{ store_court.court_detail?.contactPhone }}</p>
                </div>
                <!-- Fixed buttons at the bottom -->
                <div class="fixed bottom-4 left-6 right-6 flex justify-between z-50">
                    <button v-if="isOwner" @click="editCourtModal"
                        class="flex px-4 py-2 rounded-lg text-sm text-white gap-2 bg-yellow-500 hover:bg-yellow-600 shadow-md transition-colors duration-200">
                        <IconEdit class="w-5 h-5 text-white" />
                        <p class="font-semibold">Chỉnh sửa thông tin sân</p>
                    </button>
                    <button v-if="isOwner && store_court.court_detail?.status === 1" @click="confirmDelete"
                        class="flex px-4 py-2 rounded-lg text-sm text-white gap-2 bg-red-500 hover:bg-red-600 shadow-md transition-colors duration-200">
                        <EyeSlashIcon class="w-5 h-5 text-white" />
                        <p class="font-semibold">Xóa sân</p>
                    </button>
                </div>
            </div>

            <!-- Pricing Table -->
            <div v-if="yarf_select === 2" class="p-6">
                <div class="overflow-x-auto rounded-lg shadow-lg">
                    <table class="w-full border-collapse bg-white">
                        <thead class="bg-green-200 text-green-900">
                            <tr>
                                <th colspan="4" class="p-3 text-center text-lg font-semibold">Bảng Giá Sân</th>
                            </tr>
                            <tr class="bg-green-100">
                                <th class="p-3 border border-green-600">Sân con</th>
                                <th class="p-3 border border-green-600">Loại sân</th>
                                <th class="p-3 border border-green-600">Giá lịch vãng lai</th>
                                <th class="p-3 border border-green-600">Giá lịch cố định</th>
                            </tr>
                        </thead>
                        <tbody class="text-green-900 text-center">
                            <tr v-for="(time, timeIndex) in list_child" :key="timeIndex" class="hover:bg-green-50">
                                <td class="border border-green-600 p-3">{{ time.childCourtName }}</td>
                                <td class="border border-green-600 p-3">{{ time.position }}</td>
                                <td class="border border-green-600 p-3">{{ formatCurrency(time.rentCost) + 'đ /giờ' }}
                                </td>
                                <td class="border border-green-600 p-3">{{ formatCurrency(time.fixedRentCost) + 'đ /giờ'
                                }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Images -->
            <div v-if="yarf_select === 3" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-6">
                <img v-for="(item, index) in store_court.court_detail?.images" :key="index" :src="item"
                    alt="Court Image"
                    class="w-full h-40 rounded-xl object-cover shadow-md hover:scale-105 transition-transform duration-200" />
            </div>

            <!-- Reviews -->
            <div v-if="yarf_select === 4" class="flex flex-col px-6 py-4 gap-4 pb-24">
                <!-- Check if there are no reviews -->
                <div v-if="filteredReviews.length === 0"
                    class="flex flex-col items-center justify-center h-full text-white">
                    <InformationCircleIcon class="w-12 h-12 text-white/70 mb-2" />
                    <p class="text-lg font-semibold">Sân chưa có đánh giá nào</p>
                </div>

                <!-- Display reviews if available -->
                <div v-else v-for="(item, index) in filteredReviews" :key="index"
                    class="bg-green-800/50 rounded-lg p-4 shadow-md transition-all duration-200 hover:shadow-lg">
                    <div class="flex flex-col gap-2">
                        <div class="flex items-center justify-between">
                            <p class="text-white text-base font-semibold">{{ item.username }}</p>
                            <div class="flex items-center gap-2">
                                <p class="text-sm text-yellow-400">{{ item.ratingStar }}/5</p>
                                <vue3-star-ratings :interactive="false" v-model="item.ratingStar" :star-size="16" />
                            </div>
                        </div>
                        <p class="text-white/90 text-sm leading-relaxed">{{ item.content }}</p>
                    </div>
                </div>

                <!-- Fixed buttons at the bottom -->
                <div class="fixed bottom-4 left-0 right-0 flex justify-center gap-4 px-6">
                    <button v-if="check_comment" @click="openComment"
                        class="flex px-4 py-2 rounded-lg text-sm text-white gap-2 bg-yellow-500 hover:bg-yellow-600 shadow-md transition-colors duration-200">
                        <IconEdit class="w-5 h-5 text-white" />
                        <p class="font-semibold">Đánh giá sân</p>
                    </button>
                    <button v-if="check_comment" @click="openReport"
                        class="flex px-4 py-2 rounded-lg text-sm text-white gap-2 bg-red-500 hover:bg-red-600 shadow-md transition-colors duration-200">
                        <ExclamationTriangleIcon class="w-5 h-5 text-white" />
                        <p class="font-semibold">Báo cáo sân</p>
                    </button>
                </div>
            </div>

            <!-- Reports (Only for court owner) -->
            <div v-if="yarf_select === 5" class="flex flex-col px-6 py-4 gap-4 pb-24">
                <div class="flex gap-2">
                    <ExclamationTriangleIcon class="w-6 h-6 text-yellow-400" />
                    <p class="text-sm text-red-400 font-semibold">
                        Lưu ý: Nếu sân của bạn có trên 10 báo cáo được xác thực, chúng tôi sẽ khóa sân và tài khoản của bạn.
                    </p>
                </div>
                <!-- Check if there are no reports -->
                <div v-if="filteredReport.length === 0"
                    class="flex flex-col items-center justify-center h-full text-white">
                    <InformationCircleIcon class="w-12 h-12 text-white/70 mb-2" />
                    <p class="text-lg font-semibold">Chúc mừng bạn sân chưa có báo cáo nào</p>
                </div>

                <!-- Display reports if available -->
                <div v-else v-for="(item, index) in filteredReport" :key="index"
                    class="bg-green-800/50 rounded-lg p-4 shadow-md transition-all duration-200 hover:shadow-lg">
                    <div class="flex flex-col gap-2">
                        <div class="flex items-center justify-between">
                            <p class="text-white text-base font-semibold">{{ item.userFullname }}</p>
                            <p class="text-sm text-white/70">{{ formatDate(item.createDate) }}</p>
                        </div>
                        <p class="text-white/90 text-sm leading-relaxed">{{ item.content }}</p>
                    </div>
                </div>
            </div>

        </main>

        <!-- Modal -->
        <Modal v-if="show_modal" :close="showModal">
            <template #content>
                <main v-if="is_comment === 'map'" class="w-[800px] h-[500px] rounded-lg overflow-hidden shadow-xl">
                    <div id="map" class="w-full h-full"></div>
                </main>

                <main v-if="is_comment === 'comment'"
                    class="flex w-[550px] max-w-[90vw] h-[450px] flex-col bg-white rounded-xl shadow-xl">
                    <header class="flex items-center justify-between px-5 py-4 border-b border-gray-200">
                        <p class="text-xl font-semibold text-green">Tạo đánh giá</p>
                        <button @click="showModal" class="p-2 rounded-full hover:bg-gray-100 transition-colors">
                            <XMarkIcon class="h-6 w-6 text-gray-600" />
                        </button>
                    </header>
                    <div class="flex-1 flex flex-col p-5 gap-5 overflow-y-auto">
                        <div class="flex flex-col gap-2">
                            <label class="text-sm font-semibold text-green-900">Chất lượng sân</label>
                            <div class="flex items-center gap-3">
                                <vue3-star-ratings v-model="review.ratingStar" :increment="1" :star-size="30"
                                    :max-rating="5" :show-rating="false" star-colour="#facc15"
                                    inactive-colour="#e5e7eb" />
                                <span class="text-sm text-yellow-500 font-medium">{{ review.ratingStar || 0 }}/5</span>
                            </div>
                        </div>
                        <div class="flex flex-col gap-2">
                            <label class="text-sm font-semibold text-green-900">Viết đánh giá</label>
                            <textarea v-model="review.content"
                                placeholder="Hãy chia sẻ nhận xét về sân (ví dụ: chất lượng sân, dịch vụ, tiện nghi...)"
                                class="w-full h-36 p-4 text-sm border border-green rounded-lg outline-none focus:ring-2 focus:ring-green-500 resize-none transition-all duration-200"
                                :class="{ 'opacity-60': activeInput !== 'content' && !review.content }"
                                @focus="setActive('content')" @blur="removeActive"></textarea>
                        </div>
                    </div>
                    <footer class="p-5 bg-gray-50 border-t border-gray-200">
                        <button @click="createComment"
                            class="w-full py-3 px-5 text-sm font-semibold text-white bg-yellow-500 rounded-lg hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            :disabled="!review.content || !review.ratingStar">
                            Gửi đánh giá
                        </button>
                    </footer>
                </main>

                <main v-if="is_comment === 'report'"
                    class="flex w-[550px] max-w-[90vw] h-[420px] flex-col bg-white rounded-xl shadow-xl">
                    <header class="flex items-center justify-between px-5 py-4 border-b border-gray-200">
                        <p class="text-xl font-semibold text-green">Báo cáo sân</p>
                        <button @click="showModal" class="p-2 rounded-full hover:bg-gray-100 transition-colors">
                            <XMarkIcon class="h-6 w-6 text-gray-600" />
                        </button>
                    </header>
                    <div class="flex-1 flex flex-col p-5 gap-5 overflow-y-auto">
                        <div class="flex flex-col gap-2">
                            <label class="text-sm font-semibold text-green-900">Lý do báo cáo sân</label>
                            <textarea v-model="report.content"
                                placeholder="Hãy mô tả vấn đề của sân (ví dụ: vệ sinh kém, thông tin sai lệch...)"
                                class="w-full h-36 p-4 text-sm border border-green rounded-lg outline-none focus:ring-2 focus:ring-green-500 resize-none transition-all duration-200"
                                :class="{ 'opacity-60': activeInput !== 'reason' && !report.content }"
                                @focus="setActive('reason')" @blur="removeActive"></textarea>
                        </div>
                        <p class="text-sm text-green-700">
                            Báo cáo của bạn sẽ được xem xét kỹ lưỡng. Sân vi phạm nghiêm trọng có thể bị tạm ngưng hoạt
                            động.
                        </p>
                    </div>
                    <footer class="p-5 bg-gray-50 border-t border-gray-200">
                        <button @click="createReport"
                            class="w-full py-3 px-5 text-sm font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            :disabled="!report.content">
                            Gửi báo cáo
                        </button>
                    </footer>
                </main>

                <main v-if="is_comment === 'edit'"
                    class="w-[1200px] max-w-[95vw] flex flex-col px-5 py-4 bg-white rounded-xl shadow-xl">
                    <header class="flex items-center justify-between py-3 border-b border-gray-200">
                        <p class="text-2xl font-semibold text-green">Chỉnh sửa sân</p>
                        <XMarkIcon @click="showModal"
                            class="h-6 w-6 text-gray-600 hover:bg-gray-100 rounded-lg p-1 cursor-pointer" />
                    </header>
                    <div class="w-full grid grid-cols-1 md:grid-cols-2 gap-6 py-6">
                        <!-- Left Column -->
                        <div class="flex flex-col gap-5 text-sm text-green-700">
                            <div class="flex flex-col gap-2">
                                <label class="font-semibold text-green-900">Tên sân</label>
                                <input v-if="store_court.court_detail" v-model="store_court.court_detail.courtName"
                                    placeholder="Nhập tên sân"
                                    class="w-full px-4 py-2 rounded-lg border border-green outline-none focus:ring-2 focus:ring-green-500"
                                    type="text" @focus="setActive('addresss')" @blur="removeActive" />
                            </div>
                            <el-form label-position="top" class="grid grid-cols-2 gap-4">
                                <el-form-item label="Chọn Quận/Huyện">
                                    <el-select v-model="selectedDistrict" placeholder="Chọn quận/huyện"
                                        @change="getWards" size="large" class="w-full">
                                        <el-option v-for="district in store.districts" :key="district.code"
                                            :label="district.name" :value="district.code" />
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="Chọn Phường/Xã">
                                    <el-select v-model="selectedWard" placeholder="Chọn phường/xã"
                                        :disabled="wards.length === 0" size="large" class="w-full">
                                        <el-option v-for="ward in wards" :key="ward.code" :label="ward.name"
                                            :value="ward.code" />
                                    </el-select>
                                </el-form-item>
                                <el-form-item v-if="store_court?.court_detail?.street" label="Nhập Đường"
                                    class="col-span-2">
                                    <el-input v-model="store_court.court_detail.street" placeholder="Nhập tên đường"
                                        class="w-full" />
                                </el-form-item>
                            </el-form>
                            <div class="h-12">
                                <p class="text-sm">
                                    <strong>Địa chỉ:</strong> {{ store_court.court_detail?.street }}, {{
                                        store_court.court_detail?.ward }}, {{
                                        store_court.court_detail?.district }}, Hà Nội
                                </p>
                            </div>
                            <div class="flex flex-col gap-2">
                                <label class="font-semibold text-green-900">Thời gian mở cửa</label>
                                <div class="flex items-center gap-4">
                                    <Datepicker class="w-1/2" v-model="timeRange" range time-picker
                                        :minute-increment="60" />
                                    <p class="text-sm">Thời gian đã chọn: {{ formattedTime }}</p>
                                </div>
                            </div>
                            <div v-if="store_court?.court_detail?.courtDescription" class="flex flex-col gap-2">
                                <label class="font-semibold text-green-900">Mô tả sân</label>
                                <textarea v-model="store_court.court_detail.courtDescription" cols="30" rows="5"
                                    class="p-3 rounded-lg border border-green-600 outline-none focus:ring-2 focus:ring-green-500"></textarea>
                            </div>
                        </div>

                        <!-- Right Column -->
                        <div class="flex flex-col gap-5 text-sm text-green-700">
                            <div class="flex flex-col gap-2">
                                <label class="font-semibold text-green-900">Tên chủ sân</label>
                                <input v-if="store_court.court_detail" v-model="store_court.court_detail.contactPerson" placeholder="Nhập tên chủ sân"
                                    class="w-full px-4 py-2 rounded-lg border border-green outline-none focus:ring-2 focus:ring-green-500"
                                    type="text" @focus="setActive('address')" @blur="removeActive" readonly />
                            </div>
                            <div class="flex flex-col gap-2">
                                <label class="font-semibold text-green-900">Số điện thoại chủ sân</label>
                                <input v-if="store_court.court_detail" v-model="store_court.court_detail.contactPhone" placeholder="Nhập số điện thoại"
                                    class="w-full px-4 py-2 rounded-lg border border-green outline-none focus:ring-2 focus:ring-green-500"
                                    type="tel" inputmode="numeric" pattern="\d*" @input="validatePhoneNumber"
                                    @focus="setActive('addressss')" @blur="removeActive" readonly />
                            </div>
                            <div class="flex flex-col gap-2">
                                <button @click="triggerFileInput"
                                    class="flex gap-2 w-fit rounded-lg bg-yellow-500 hover:bg-yellow-600 py-2 px-4 transition-colors">
                                    <p class="text-sm text-white font-semibold">Tải ảnh sân</p>
                                    <CloudArrowUpIcon class="h-5 w-5 text-white" />
                                    <input type="file" ref="fileInput" @change="uploadImage" class="hidden" />
                                </button>
                                <div class="w-full mt-4 grid grid-cols-4 gap-4"
                                    v-if="store_court?.court_detail?.images && store_court.court_detail?.images.length > 0">
                                    <img v-for="(url, index) in store_court.court_detail.images" :key="index" :src="url"
                                        alt="Uploaded Image" class="rounded-xl h-24 w-full object-cover shadow-md" />
                                </div>
                            </div>
                            <Toggle v-model="active" class="mt-5" :label="active ? 'Hoạt động' : 'Ngừng hoạt động'"
                                :color="'green'" />
                        </div>
                    </div>
                    <footer class="flex justify-end py-4 px-5 border-t border-gray-200">
                        <button @click="editCourt"
                            class="px-4 py-2 bg-yellow-500 text-sm font-semibold text-white rounded-lg hover:bg-yellow-600 transition-colors">
                            Cập nhật sân
                        </button>
                    </footer>
                </main>
            </template>
        </Modal>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStoreCourt } from '@/stores/appStoreCourt'
import { useAppStore } from "@/stores/appStore";
import logoPick from "@/assets/imgs/logoPick.png"
import { ElMessageBox, ElMessage } from 'element-plus'

/**api*/
import { apiGetListBooking } from "@/service/api/apiBoking";
import { apiUpdateCourt, apiGetCourt } from "@/service/api/apiCourt";

/**Thư viện*/
import L from 'leaflet';
import Datepicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

/**icon*/
import Iconphones from '@/components/Icons/Iconphones.vue'
import IconClock from '@/components/Icons/IconClock.vue'
import IconLocation from '@/components/Icons/IconLocation.vue'
import IconEdit from '@/components/Icons/IconEdit.vue'
import { XMarkIcon, UserCircleIcon, EyeSlashIcon, ExclamationTriangleIcon, InformationCircleIcon, CloudArrowUpIcon } from "@heroicons/vue/24/solid";
import Toggle from '@/components/Toggle.vue';

/**modal*/
import Modal from '@/components/Modal/Modal.vue';

/*ảnh sân **/
import Img2 from '@/assets/imgs/bg_san2.jpg'
import ImgYard from '@/assets/imgs/bg_san2.jpg'

/**api*/
import { apiCreateReview, apiGetListReview } from "@/service/api/apiReview";
import { apiCreateReport, apiGetListReport } from "@/service/api/apiReport";

/**kiểu dữ liệu*/
import type { Review, Location, RePorts } from '@/interface'

/**toast*/
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import axios from "axios";

/**Biến lưu hoạt động của sân*/
const active = ref(true)
const store = useAppStore()
const selectedDistrict = ref("");
const selectedWard = ref<number | null>(null);
const stop_court = ref(true)

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

// Kiểm tra xem người dùng có phải chủ sân không
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
const filteredReport = ref<RePorts[]>([]);

// Biến tạo bình luận
const review = ref({
    userId: 0,
    courtId: 0,
    content: '',
    ratingStar: 5,
});

// Biến tạo báo cáo
const report = ref({
    userId: 0,
    courtId: 0,
    content: '',
});

/**Biến mở modal map*/
const show_modal = ref(false);

/**Danh sách mục tiêu đánh giá*/
const list_items = ref([
    {
        key: 1,
        name_items: 'Thông tin',
    },
    {
        key: 2,
        name_items: 'Giá thuê sân',
    },
    {
        key: 3,
        name_items: 'Hình ảnh',
    },
    {
        key: 4,
        name_items: computed(() => `Đánh giá (${filteredReviews.value.length})`),
    },
    {
        key: 5,
        name_items: computed(() => `Báo cáo (${filteredReport.value.length})`),
    }
]);

// Lọc danh sách mục hiển thị dựa trên quyền của người dùng
const filteredListItems = computed(() => {
    if (isOwner.value) {
        return list_items.value; // Chủ sân thấy tất cả các tab, bao gồm Báo cáo
    }
    return list_items.value.filter(item => item.key !== 5); // Người dùng thường không thấy tab Báo cáo
});

const list_child = computed(() => {
    if (!Array.isArray(store_court.list_chill_court)) return [];
    return store_court.list_chill_court.filter(child => child.courtId === id_Court)
})

const wards = ref<Location[]>([]);

onMounted(async () => {
    await getListComment();
    await getListReport(); // Lấy danh sách báo cáo
    await getListBoking();
    getDistricts();

    if (Number(store_court?.court_detail?.status) === 0) {
        active.value = true;
    } else {
        active.value = false;
    }
})

// Lấy danh sách quận/huyện Hà Nội
const getDistricts = async () => {
    try {
        const matchedDistrict: any = store.districts.find((item: any) => item.name === store_court.court_detail?.district);
        selectedDistrict.value = matchedDistrict ? matchedDistrict.code : null;
        getWards();
    } catch (error) {
        console.error("Lỗi khi lấy quận/huyện:", error);
    }
};

// Khi chọn quận/huyện
const getWards = async () => {
    try {
        const response = await axios.get(`https://provinces.open-api.vn/api/d/${selectedDistrict.value}?depth=2`);
        wards.value = response.data.wards;
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

const uploadImage = async (event: any) => {
    const file = event.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "uploadImg");
    try {
        const response = await fetch("https://api.cloudinary.com/v1_1/doqa5bvx5/image/upload", {
            method: "POST",
            body: formData,
        });
        const data = await response.json();
        store_court.court_detail?.images.push(data.secure_url);
    } catch (error) {
        console.error("Error uploading image:", error);
    }
};

const setActive = (field: string) => {
    activeInput.value = field;
};

const showMap = async (address: string) => {
    is_comment.value = 'map';
    show_modal.value = true;
    nextTick(async () => {
        const coordinates = await getCoordinates(address);
        if (!coordinates) return;
        mapPosition.value = coordinates;
        setTimeout(() => {
            if (mapInstance) {
                mapInstance.remove();
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
        }, 500);
    });
};

window.addEventListener('resize', () => {
    if (mapInstance) {
        mapInstance.invalidateSize();
    }
});

function showModal() {
    show_modal.value = false;
}

function goToDetail() {
    router.push('/detail')
}

const removeActive = () => {
    activeInput.value = '';
};

function openComment() {
    is_comment.value = 'comment';
    show_modal.value = true;
}

function openReport() {
    is_comment.value = 'report';
    show_modal.value = true;
}

const triggerFileInput = () => {
    fileInput.value!.click();
};

function editCourtModal() {
    is_comment.value = 'edit';
    show_modal.value = true;
}

function isValidImage(image: string) {
    const urlPattern = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|bmp|webp))$/i;
    return urlPattern.test(image);
}

function formatHour(timeStr: string): string {
    return timeStr?.slice(0, 5)
}

const formatCurrency = (value: any) => {
    if (value === null || value === undefined || value === "") return "";
    return new Intl.NumberFormat("vi-VN").format(value);
};

// Định dạng ngày tháng
const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

async function createComment() {
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || '{}');
    review.value.userId = userInfo.id;
    review.value.courtId = store_court.court_detail?.id ?? 0;
    review.value.ratingStar = Math.round(review.value.ratingStar);
    try {
        const response = await apiCreateReview(review.value);
        if (response && response.status === 200) {
            toast("Bình luận thành công!", { autoClose: 2000 });
            getListComment();
            showModal();
        } else {
            toast("Đăng ký thất bại, vui lòng thử lại!", { autoClose: 3000 });
        }
    } catch (error) {
        console.error("API Error:", error);
    }
}

async function createReport() {
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || '{}');
    report.value.userId = userInfo.id;
    report.value.courtId = store_court.court_detail?.id ?? 0;
    try {
        const response = await apiCreateReport(report.value);
        if (response && response.status === 200) {
            toast("Báo cáo thành công!", { autoClose: 2000 });
            getListReport();
            showModal();
        } else {
            toast("Đăng ký thất bại, vui lòng thử lại!", { autoClose: 3000 });
        }
    } catch (error) {
        console.error("API Error:", error);
    }
}

async function getListComment() {
    try {
        const response = await apiGetListReview();
        if (response && response.status === 200) {
            filteredReviews.value = response.data.filter(
                (item: any) => item.courtId === store_court.court_detail?.id
            );
        } else {
            toast("Lấy danh sách đánh giá thất bại, vui lòng thử lại!", { autoClose: 3000 });
        }
    } catch (error) {
        console.error("API Error:", error);
    }
}

async function getListReport() {
    try {
        const response = await apiGetListReport();
        if (response && response.status === 200) {
            filteredReport.value = response.data.filter(
                (item: any) => 
                    item.courtId === store_court.court_detail?.id && 
                    item.status === 1
            );
        } else {
            toast("Lấy danh sách báo cáo thất bại, vui lòng thử lại!", { autoClose: 3000 });
        }
    } catch (error) {
        console.error("API Error:", error);
    }
}

async function getListBoking() {
    try {
        const response = await apiGetListBooking();
        const userInfo = JSON.parse(localStorage.getItem("userInfo") || '{}');
        if (response && response.status === 200) {
            const filteredData = response.data.filter((item: any) =>
                item.userId === userInfo.id
            );
            const isBookedByUser = filteredData.some((item: any) =>
                item.courtName === store_court.court_detail?.courtName
            );
            if (store_court.court_detail?.userId === userInfo.id) {
                check_comment.value = false;
            } else {
                check_comment.value = isBookedByUser;
            }
            const now = new Date();
            const hasFutureBooking = response.data.some((item: any) =>
                item.courtName === store_court.court_detail?.courtName &&
                new Date(item.startTime) > now
            );
            stop_court.value = !hasFutureBooking;
        }
    } catch (error) {
        console.error("API Error:", error);
    }
}

async function editCourt() {
    if (!active.value && !stop_court.value) {
        toast.error("Sân vẫn còn lịch đặt nên không thể ngừng hoạt động được!", { autoClose: 2000 });
        return;
    }
    const selectedDistrictObj = store.districts.find(item => item.code === selectedDistrict.value);
    const selectedWardObj = wards.value.find(item => item.code === selectedWard.value);
    if (selectedDistrictObj && store_court.court_detail) store_court.court_detail.district = selectedDistrictObj.name;
    if (selectedWardObj && store_court.court_detail) store_court.court_detail.ward = selectedWardObj.name;
    if (!validateCourtDetail()) {
        return;
    }
    if (store_court.court_detail) {
        store_court.court_detail.status = active.value ? 0 : 1;
    }
    try {
        const response = await apiUpdateCourt(store_court.court_detail);
        if (response && response.status === 200) {
            apiGetCourt();
            toast("Cập nhật sân thành công!", { autoClose: 3000 });
            showModal();
        }
    } catch (error) {
        console.error("API Error:", error);
    }
}

async function deleteCourt() {
    if (store_court.court_detail) {
        store_court.court_detail.status = 3;
    }
    try {
        const response = await apiUpdateCourt(store_court.court_detail);
        if (response && response.status === 200) {
            apiGetCourt();
            toast("Cập nhật sân thành công!", { autoClose: 3000 });
            showModal();
        }
    } catch (error) {
        console.error("API Error:", error);
    }
}

const validatePhoneNumber = (event: any) => {
    event.target.value = event.target.value.replace(/\D/g, "");
    if (store_court.court_detail)
        store_court.court_detail.contactPhone = event.target.value;
};

function validateCourtDetail() {
    const courtDetail = store_court.court_detail;
    if (!courtDetail) {
        toast.error("Chi tiết sân không hợp lệ!", { autoClose: 2000 });
        return false;
    }
    if (!courtDetail.courtDescription || courtDetail.courtDescription.trim() === "") {
        toast.error("Mô tả sân không được để trống!", { autoClose: 2000 });
        return false;
    }
    if (!courtDetail.courtName || courtDetail.courtName.trim() === "") {
        toast.error("Tên sân không được để trống!", { autoClose: 2000 });
        return false;
    }
    if (!courtDetail.district || courtDetail.district.trim() === "") {
        toast.error("Khu vực không được để trống!", { autoClose: 2000 });
        return false;
    }
    if (!courtDetail.ward || courtDetail.ward.trim() === "") {
        toast.error("Phường không được để trống!", { autoClose: 2000 });
        return false;
    }
    if (!courtDetail.street || courtDetail.street.trim() === "") {
        toast.error("Đường không được để trống!", { autoClose: 2000 });
        return false;
    }
    if (!courtDetail.images || courtDetail.images.length === 0) {
        toast.error("Vui lòng tải lên ít nhất một bức ảnh!", { autoClose: 2000 });
        return false;
    }
    return true;
}

const confirmDelete = () => {
    ElMessageBox.confirm(
        'Bạn có chắc chắn muốn xóa không?',
        'Xác nhận xóa',
        {
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy',
            type: 'warning',
        }
    )
        .then(() => {
            deleteCourt();
            ElMessage({
                type: 'success',
                message: 'Đã xóa thành công!',
            });
            router.push('/YourYard');
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: 'Đã hủy xóa',
            });
        });
}
</script>