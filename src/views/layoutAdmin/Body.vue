<template>
    <main class="flex flex-col flex-1 overflow-hidden">
        <header class="flex flex-shrink-0 px-4 py-2 items-center justify-between">
        <!-- Logo và tiêu đề -->
        <div class="flex items-center gap-3">
            <div class="p-2 bg-white rounded-full shadow-sm">
                <img src="@/assets/imgs/logoNo.png" class="w-12 h-10 object-contain" alt="Logo Pickleball" />
            </div>
            <h2 class="text-2xl font-bold text-white tracking-tight">Pickleball</h2>
        </div>

        <!-- Select và input tìm kiếm -->
        <div class="flex items-center gap-3">
            <!-- Select trạng thái sân -->
            <select v-model="filter_court"
                class="px-3 py-2 bg-white text-green-800 border border-green-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200">
                <option :value="4">Tất cả</option>
                <option :value="0">Sân hoạt động</option>
                <option :value="1">Sân ngừng hoạt động</option>
                <option :value="3">Sân bị xóa</option>
            </select>
            <!-- Input tìm kiếm -->
            <div class="relative">
                <input v-model="searchQuery" placeholder="Tìm kiếm theo tên sân"
                    class="pl-10 pr-3 py-2 bg-white text-green-800 border border-green-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                    type="text" />
                <!-- Icon tìm kiếm -->
                <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-600"
                    fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
            </div>
        </div>
    </header>
        <!--  -->
        <div class="h-full overflow-hidden">
            <div v-if="list_yards && list_yards.length === 0" class="w-full h-full flex justify-center items-center">
                <div class="flex flex-col gap-2 justify-center items-center">
                    <img src="@/assets/imgs/image9.png" alt="" />
                    <h3 class="text-2xl text-white font-bold">Chưa có sân nào</h3>
                </div>
            </div>
            <div v-else class="w-full h-full flex justify-center overflow-y-auto items-center px-5 py-2">
                <div class="grid h-full overflow-y-auto grid-cols-4  gap-15">
                    <!-- sân -->
                    <div @click="goToDetail(yard)" v-for="yard in list_yards" :key="yard.id"
                        class="flex items-center h-fit w-60 border border-white flex-shrink-0  rounded-lg cursor-pointer flex-col  bg-white">
                        <img class="w-60 rounded-t-lg  h-50" :src="isValidImage(yard.images[0]) ? yard.images[0] : anh1"
                            alt="ảnh sân" />
                        <div class="flex w-full  flex-shrink-0 flex-col  gap-0.5 p-1 py-2">
                            <h3 class="text-sm font-medium text-back truncate">
                                {{ yard.courtName }}
                            </h3>
                            <p class="text-sm flex-shrink-0 text-slate-500 truncate">{{ yard.street + ', ' + yard.ward +
                                ', ' +
                                yard.district }}</p>
                            <div v-if="yard.status === 0" class="flex items-center gap-2">
                                <span class="w-2 h-2 bg-green-500 rounded-full"></span>
                                <p class="text-xs "> {{ yard.startTime && yard.endTime ? formatHour(yard.startTime) + '- ' + formatHour(yard.endTime) : '24 / 7' }}</p>
                            </div>
                            <p v-if="yard.status === 1" class="text-red-500">Ngừng hoạt động</p>
                            <p v-if="yard.status === 3" class="text-red-500">Sân bị xóa</p>

                            <div class="flex items-center justify-between">
                                <vue3-star-ratings v-if="store_review.list_review[yard.id]"
                                    v-model="store_review.list_review[yard.id].averageRatingStar" />

                                <vue3-star-ratings v-else v-model="start" />

                                <div class="flex items-center gap-1">
                                    <IconComment class="w-4 h-4 text-slate-500"></IconComment>
                                    <p class="text-xs text-slate-400">
                                        {{ store_review.list_review[yard.id]?.total_comments ?? 0 }}
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
            <main class="w-[1100px] flex flex-col px-3">
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
                                    <el-option v-for="district in store.districts" :key="district.code"
                                        :label="district.name" :value="district.code" />
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
                                class="w-full px-3 py-2 outline-none rounded-md border  border-green-600" type="text"
                                @focus="setActive('address')" @blur="removeActive" readonly />
                        </div>

                        <!-- Số điện thoại -->
                        <div v-if="store_court?.court_detail?.contactPhone" class="flex flex-col gap-2 pb-5"
                            :class="{ 'opacity-50': activeInput !== 'addressss' && !store_court.court_detail.contactPhone }">
                            <label class="font-semibold text-green-900" for="phone">Số điện thoại chủ sân</label>
                            <input v-model="store_court.court_detail.contactPhone" placeholder="Nhập số điện thoại"
                                class="w-full px-3 py-2 outline-none rounded-md border border-green-600" type="tel"
                                inputmode="numeric" pattern="\d*" @input="validatePhoneNumber"
                                @focus="setActive('addressss')" @blur="removeActive" readonly />
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

                        <!--  -->
                        <Toggle v-model="active" class="mt-5" :label="active ? 'Hoạt động' : 'Ngừng hoạt động'"
                            :color="'green'">
                        </Toggle>

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

import { ref, computed, onMounted } from "vue";
import { useRouter } from 'vue-router'
import axios from "axios";

/**api*/
import { getListUser } from "@/service/api/api";
import { apiGetListReview } from "@/service/api/apiReview";

/**Kho lưu trữ*/
import { useAppStore } from '@/stores/appStore'
import { useAppStoreCourt } from '@/stores/appStoreCourt'
import { useAppStoreReview } from '@/stores/appStoreReview'

/**modal*/
import Modal from '@/components/Modal/Modal.vue';
/**api*/
import { apiGetListBooking, } from "@/service/api/apiBoking";
import { apiUpdateCourt, apiGetCourt } from "@/service/api/apiCourt";

/**icon*/
import IconComment from '@/components/Icons/IconComment.vue'


/**ảnh sân*/
import anh1 from "@/assets/imgs/bg_san.jpg";


/**kiểu dữ liệu*/
import type { Court, Review, GroupedReview ,Location} from '@/interface'

import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

import Toggle from '@/components/Toggle.vue';
// const districts = ref<Division[]>([]);
const wards = ref<Location[]>([]);

const filter_court = ref(4); // Mặc định là "Tất cả"
const searchQuery = ref(''); // Giá trị tìm kiếm

/**Biến lưu hoạt động của sân*/
const active = ref(true)

/**Biến router */
const router = useRouter()

/**Lưu ô input nào đang được focus*/
const activeInput = ref('');



const start = ref(5);

/**biến store*/

const store = useAppStore()

const store_court = useAppStoreCourt()

const store_review = useAppStoreReview()



/**Biến mở modal map*/
const show_modal = ref(false);

const fileInput = ref<HTMLInputElement | null>(null);


// Hàm để mở file input khi người dùng nhấn vào nút
const triggerFileInput = () => {
    fileInput.value!.click(); // Dùng ! để nói với TypeScript rằng giá trị không phải null
};


/***/
const setActive = (field: string) => {
    activeInput.value = field;
};

const selectedDistrict = ref("");      // Mã quận/huyện
const selectedWard = ref<number | null>(null);       // Mã phường/xã


// Computed: Lọc danh sách sân theo userId
// Computed: Lọc danh sách sân
const list_yards = computed(() => {
    if (!store_court || !store_court.list_court) return [];

    return store_court.list_court.filter((court) => {
        // Lọc theo trạng thái
        let statusMatch = true;
        if (filter_court.value === 0) statusMatch = court.status === 0; // Sân hoạt động
        else if (filter_court.value === 1) statusMatch = court.status === 1; // Sân ngừng hoạt động
        else if (filter_court.value === 3) statusMatch = court.status === 3; // Sân bị xóa
        else if (filter_court.value === 4) statusMatch = true; // Tất cả

        // Lọc theo tên sân
        const nameMatch = court.courtName
            ?.toLowerCase()
            .includes(searchQuery.value.toLowerCase());

        // Kết hợp điều kiện
        return statusMatch && nameMatch;
    });
});

/***/
const removeActive = () => {
    activeInput.value = '';
};


onMounted(async () => {
    // *Lấy danh sách sân 
    await getListCourt()
    // *lấy danh sách bình luận các sân
    await getListReview()
    // *lấy danh sách người dùng
    await getListUsers()

    getDistricts();

    store_court.is_court = 'home'
});

const stop_court = ref(true)

const timeRange = ref([
    { hours: 6, minutes: 0, seconds: 0 },
    { hours: 22, minutes: 0, seconds: 0 },
]);



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


/**hàm đóng modal*/
function showModal() {
    show_modal.value = false;
}


/**Khi xem một sân*/
function goToDetail(yard: Court) {
    console.log('yard',yard);
    
    store_court.court_detail = yard
    // 
    show_modal.value = true

}

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

/**check kiểu số điện thoại*/
const validatePhoneNumber = (event: any) => {
    event.target.value = event.target.value.replace(/\D/g, ""); // Loại bỏ tất cả ký tự không phải số
    if (store_court.court_detail)
        store_court.court_detail.contactPhone = event.target.value; // Cập nhật giá trị đã lọc vào biến v-model
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

/**Hàm lấy danh sách sân*/
async function getListCourt() {
    try {
        const response = await apiGetCourt();
        console.log("API Response:", response);

        store_court.list_court = response.data.filter((court: Court) =>
            court.courtName.trim() !== "" &&
            court.street.trim() !== "" &&
            court.ward.trim() !== "" &&
            court.district.trim() !== "" &&
            court.images.length > 0
        );
        console.log('store_court.list_court', store_court.list_court);


    } catch (error) {
        console.error("API Error:", error);
    }
}


/**Hàm lấy danh sách bình luận sân*/
async function getListReview() {
    try {
        const response = await apiGetListReview();

        // Kiểm tra response.data nếu là mảng
        if (Array.isArray(response.data)) {
            store_review.list_review = convertToGroupedObject(response.data);
        } else {
            console.error('Dữ liệu trả về không phải là mảng:', response);
        }

    } catch (error) {
        console.error("API Error:", error);
    }
}

/**Hàm lấy danh sách sân*/
async function getListUsers() {
    try {
        const response = await getListUser();

        // 
        store.list_user = response.data

    } catch (error) {
        console.error("API Error:", error);
    }
}

function convertToGroupedObject(array: Review[]): { [key: number]: GroupedReview } {
    const result: { [key: number]: GroupedReview } = {};

    array.forEach((item) => {
        const courtId = item.courtId;

        if (!result[courtId]) {
            result[courtId] = {
                courtId: courtId,
                averageRatingStar: 0,
                total_comments: 0,
                comments: []
            };
        }

        result[courtId].comments.push(item);
        result[courtId].total_comments += 1;
        result[courtId].averageRatingStar += item.ratingStar;
    });

    // Tính trung bình ratingStar
    Object.values(result).forEach((group) => {
        group.averageRatingStar = parseFloat((group.averageRatingStar / group.total_comments).toFixed(2));
    });

    return result;
}


function isValidImage(image: string) {
    // Kiểm tra xem image có phải là một URL hợp lệ hay không (bắt đầu với http:// hoặc https://)
    const urlPattern = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|bmp|webp))$/i;
    return urlPattern.test(image);
}

function formatHour(timeStr: string): string {
    return timeStr?.slice(0, 5) // Lấy 5 ký tự đầu: "08:00"
}

/**hàm cập nhân sân*/
async function editCourt() {
    if (!active.value && !stop_court.value) {
        toast.error("Sân vẫn còn lịch đặt nên không thể ngừng hoạt động được!", { autoClose: 2000 });
        return
    }


    const selectedDistrictObj = store.districts.find(item => item.code === selectedDistrict.value);
    const selectedWardObj = wards.value.find(item => item.code === selectedWard.value);

    if (selectedDistrictObj && store_court.court_detail) store_court.court_detail.district = selectedDistrictObj.name;
    if (selectedWardObj && store_court.court_detail) store_court.court_detail.ward = selectedWardObj.name;

    // Kiểm tra tính hợp lệ của dữ liệu sân
    if (!validateCourtDetail()) {
        return; // Nếu validate không thành công, không tiếp tục gọi API
    }
    if (store_court.court_detail) {
        store_court.court_detail.status = active.value ? 0 : 1;
    }

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

function validateCourtDetail() {
    const courtDetail = store_court.court_detail;

    if (!courtDetail) {
        toast.error("Chi tiết sân không hợp lệ!", { autoClose: 2000 });
        return false;
    }

    // Kiểm tra courtDescription
    if (!courtDetail.courtDescription || courtDetail.courtDescription.trim() === "") {
        toast.error("Mô tả sân không được để trống!", { autoClose: 2000 });
        return false;
    }

    // Kiểm tra courtDescription
    if (!courtDetail.courtName || courtDetail.courtName.trim() === "") {
        toast.error("Mô tả sân không được để trống!", { autoClose: 2000 });
        return false;
    }

    // Kiểm tra district
    if (!courtDetail.district || courtDetail.district.trim() === "") {
        toast.error("Khu vực không được để trống!", { autoClose: 2000 });
        return false;
    }

    // Kiểm tra ward
    if (!courtDetail.ward || courtDetail.ward.trim() === "") {
        toast.error("Phường không được để trống!", { autoClose: 2000 });
        return false;
    }

    // Kiểm tra street
    if (!courtDetail.street || courtDetail.street.trim() === "") {
        toast.error("Đường không được để trống!", { autoClose: 2000 });
        return false;
    }

    // Kiểm tra images (đảm bảo có ít nhất một ảnh)
    if (!courtDetail.images || courtDetail.images.length === 0) {
        toast.error("Vui lòng tải lên ít nhất một bức ảnh!", { autoClose: 2000 });
        return false;
    }

    return true; // Nếu tất cả điều kiện trên đều hợp lệ
}




</script>