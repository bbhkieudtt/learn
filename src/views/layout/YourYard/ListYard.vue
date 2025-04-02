<template>
    <div class="h-dvh w-dvw bg-green flex flex-col overflow-hidden pt-5 px-5 pb-2 ">
        <header>
            <ArrowLeftIcon @click="goHome" class=" flex-shrink-0 w-6 h-6 cursor-pointer text-white"></ArrowLeftIcon>
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
            <div v-else class="w-full h-full flex justify-center overflow-y-auto items-center px-5 py-2 ">
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
                    <XMarkIcon @click="showModal" class="h-5 w-5 hover:bg-slate-300 rounded-lg "></XMarkIcon>
                </header>
                <!--  -->

                <body class="w-full grid py-2 gap-4 grid-cols-2">
                    <div class="flex-col col-span-1 flex text-sm font-medium text-green-700">
                        <!-- Nhập tên sân -->
                        <div class="flex flex-col gap-2  pb-5" :class="{
                            'opacity-50': activeInput !== 'addresss' && !infor_yard.courtName
                        }">
                            <label class="font-semibold text-green-900" for="">Tên sân</label>
                            <input v-model="infor_yard.courtName" placeholder="Nhập tên sân  "
                                class="w-full px-3 py-2 outline-none rounded-md border border-green-600" type="text"
                                @focus="setActive('addresss')" @blur="removeActive" />
                        </div>
                        <!-- Địa chỉ chi tiết -->
                        <el-form label-position="top" class="grid grid-cols-2 gap-2 w-full">
                            <el-form-item label="Chọn Quận/Huyện">
                                <el-select v-model="selectedDistrict" placeholder="Chọn quận/huyện" @change="getWards"
                                    size="large">
                                    <el-option v-for="district in districts" :key="district.code" :label="district.name"
                                        :value="district.code" />
                                </el-select>
                            </el-form-item>

                            <!-- Chọn Phường/Xã -->
                            <el-form-item label="Chọn Phường/Xã">
                                <el-select v-model="selectedWard" placeholder="Chọn phường/xã"
                                    :disabled="wards.length === 0" @change="getStreets" size="large">
                                    <el-option v-for="ward in wards" :key="ward.code" :label="ward.name"
                                        :value="ward.code" />
                                </el-select>
                            </el-form-item>

                            <!-- Chọn Đường -->
                            <el-form-item label="Nhập Đường" class="col-span-2" size="large">
                                <el-input v-model="infor_yard.street" placeholder="Nhập tên đường" />
                            </el-form-item>
                        </el-form>
                        <!-- Hiển thị kết quả đã chọn -->
                        <div class="h-10 ">
                            <p v-if="infor_yard.street && infor_yard.ward && infor_yard.district">
                                <strong>Địa chỉ:</strong> {{ infor_yard.street }}, {{ infor_yard.ward }}, {{
                                    infor_yard.district }}, Hà Nội
                            </p>
                        </div>
                        <!-- Giá tiền -->
                        <el-form label-position="top" class="w-full grid py-2 grid-cols-2 gap-2">
                            <!-- Nhập giá tối thiểu -->
                            <el-form-item label="Giá thuê sân từ (VNĐ/giờ)">
                                <el-input v-model.number="infor_yard.minPrice" placeholder="Nhập giá tối thiểu"
                                    :formatter="formatCurrency" :parser="parseCurrency" size="large" />
                            </el-form-item>

                            <!-- Nhập giá tối đa -->
                            <el-form-item label="Giá thuê sân đến (VNĐ/giờ)">
                                <el-input v-model.number="infor_yard.maxPrice" placeholder="Nhập giá tối đa"
                                    :formatter="formatCurrency" :parser="parseCurrency" size="large" />
                            </el-form-item>
                        </el-form>
                        <!-- Giờ mở cửa -->
                        <div class="w-full flex flex-col gap-1.5 ">
                            <label class="text-sm font-medium text-slate-700" for="">Thời gian mở cửa</label>

                            <div class="w-full flex justify-between items-center">
                                <Datepicker class=" w-[50%]" v-model="timeRange" range time-picker
                                    :minute-increment="60" />
                                <p>Thời gian đã chọn: {{ formattedTime }}</p>
                            </div>
                        </div>
                        <!--Mô tả  -->
                        <div class="w-full flex flex-col mt-5 gap-1.5">
                            <label class="text-sm font-medium text-slate-700" for="">Mô tả sân</label>
                            <textarea name="" v-model="infor_yard.courtDescription"
                                class="p-2 rounded-lg border border-slate-300" id=""></textarea>

                        </div>


                    </div>
                    <!--  -->
                    <div class="flex-col col-span-1 flex text-sm font-medium text-green-700">
                        <!-- Nhập tên sân -->
                        <div class="flex flex-col gap-2  pb-5" :class="{
                            'opacity-50': activeInput !== 'address' && !infor_yard.contactPerson
                        }">
                            <label class="font-semibold text-green-900" for="">Tên sân</label>
                            <input v-model="infor_yard.contactPerson" placeholder="Nhập tên sân  "
                                class="w-full px-3 py-2 outline-none rounded-md border border-green-600" type="text"
                                @focus="setActive('address')" @blur="removeActive" />
                        </div>

                        <!-- Nhập số điện thoại -->
                        <div class="flex flex-col gap-2 pb-5" :class="{
                            'opacity-50': activeInput !== 'addressss' && !infor_yard.contactPhone
                        }">
                            <label class="font-semibold text-green-900" for="phone">Số điện thoại chủ sân</label>
                            <input v-model="infor_yard.contactPhone" placeholder="Nhập số điện thoại"
                                class="w-full px-3 py-2 outline-none rounded-md border border-green-600" type="tel"
                                inputmode="numeric" pattern="\d*" @input="validatePhoneNumber"
                                @focus="setActive('addressss')" @blur="removeActive" />
                        </div>
                        <!--Ảnh sân -->
                        <div class="w-full flex flex-col mt-5 gap-1.5">
                            <button @click="triggerFileInput"
                                class="flex gap-2 w-fit rounded-lg bg-yellow-500 py-2 px-2">
                                <p class="text-sm text-white font-medium">Tải ảnh sân</p>
                                <CloudArrowUpIcon class="h-5 w-5 text-white"></CloudArrowUpIcon>
                                <!-- Hidden file input -->
                                <input type="file" ref="fileInput" @change="uploadImage" class="hidden" />
                            </button>

                            <!-- Hiển thị ảnh đã tải lên -->
                            <div class="w-full" v-if="infor_yard.images.length > 0">
                                <div class="w-full mt-4 grid grid-cols-4 gap-3">
                                    <img v-for="(url, index) in infor_yard.images" :key="index" :src="url"
                                        alt="Uploaded Image" class="rounded-xl h-[100px] w-full object-cover" />
                                </div>
                            </div>


                        </div>
                    </div>


                </body>
                <!--  -->
                <footer class="w-full flex justify-end py-2 px-3 border-t border-slate-300">
                    <button @click="createCourt"
                        class="px-3 py-2 bg-yellow-500 text-sm font-semibold text-white rounded-lg w-fit">
                        Tạo mới sân
                    </button>
                </footer>
            </div>
        </template>
    </Modal>

</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import axios from "axios";

/**api*/
import { apiCreateCourt } from "@/service/api/apiCourt";

import { useAppStore } from "@/stores/appStore";

/**Modal*/
import Modal from "@/components/Modal/Modal.vue"

/**ảnh*/
import image9 from '@/assets/imgs/image9.png'

/**icon*/
import { PlusIcon, ArrowLeftIcon, XMarkIcon, CloudArrowUpIcon } from "@heroicons/vue/24/solid";
import IconComment from '@/components/Icons/IconComment.vue'

/**ảnh sân*/
import anh1 from "@/assets/imgs/bg_san.jpg";
import anh2 from "@/assets/imgs/bg_san1.jpg";
import anh3 from "@/assets/imgs/bg_san2.jpg";
import Datepicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

/**toast*/
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

/**kiểu dữ liệu*/
import type { Division, Location } from '@/interface'

/**Danh sách sân đã lọc theo địa chỉ , tên sân */ 

/**Biến router */
const router = useRouter()

/**biến store*/
const store = useAppStore();

const timeRange = ref([
    { hours: 8, minutes: 0, seconds: 0 },
    { hours: 17, minutes: 0, seconds: 0 },
]);

const formattedTime = computed(() => {
    return timeRange.value.map(t => `${String(t.hours).padStart(2, "0")}:00`).join(" - ");
});


/**Biến thông tin sân tạo mới*/

const infor_yard = ref({
    userId: 0,
    courtName: '',
    courtDescription: '',
    district: '',
    ward: '',
    street: '',
    minPrice: 0,
    maxPrice: 0,
    images: [] as string[],
    contactPerson: '',
    contactPhone: '',
})

// Định dạng số thành tiền VND
const formatCurrency = (value: any) => {
    if (value === null || value === undefined || value === "") return ""; // Cho phép xóa hết số
    return new Intl.NumberFormat("vi-VN").format(value);
};

// Chuyển chuỗi tiền tệ về số khi nhập
const parseCurrency = (value: any) => {
    const cleanedValue = value.replace(/[^\d]/g, ""); // Xóa tất cả ký tự không phải số
    return cleanedValue ? Number(cleanedValue) : null; // Nếu xóa hết, trả về null
};


const selectedDistrict = ref("");      // Mã quận/huyện
const selectedWard = ref("");          // Mã phường/xã
const selectedStreet = ref("");        // Tên đường

const districts = ref<Division[]>([]);
const wards = ref<Location[]>([]);

const fileInput = ref<HTMLInputElement | null>(null);
const imageUrl = ref(""); // Dùng ref để lưu trữ URL của ảnh đã tải lên


onMounted(() => {
    getDistricts();
});

// Lấy danh sách quận/huyện Hà Nội
const getDistricts = async () => {
    try {
        const response = await axios.get("https://provinces.open-api.vn/api/d/");
        districts.value = response.data.filter((d: any) => d.province_code === 1); // 1 là mã của Hà Nội
    } catch (error) {
        console.error("Lỗi khi lấy quận/huyện:", error);
    }
};

// Khi chọn quận/huyện
const getWards = async () => {
    const district = districts.value.find(d => d.code === selectedDistrict.value);
    infor_yard.value.district = district ? district.name : ""; // Lưu tên quận/huyện


    selectedStreet.value = "";

    try {

        const response = await axios.get("https://provinces.open-api.vn/api/w/");
        console.log("Lấy phường/xã cho quận/huyện:", response);

        // Lọc danh sách phường/xã theo quận/huyện đã chọn
        wards.value = response.data.filter((ward: any) => ward.district_code === selectedDistrict.value);

    } catch (error) {
        console.error("Lỗi khi lấy phường/xã:", error);
    }
};

// Khi chọn phường/xã
const getStreets = () => {
    const ward = wards.value.find((w: any) => w.code === selectedWard.value);
    infor_yard.value.ward = ward ? ward.name : ""; // Lưu tên phường/xã
};

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
const activeInput = ref('');

/***/
const setActive = (field: string) => {
    activeInput.value = field;
};

/***/
const removeActive = () => {
    activeInput.value = '';
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

/**check kiểu số điện thoại*/
const validatePhoneNumber = (event: any) => {
    event.target.value = event.target.value.replace(/\D/g, ""); // Loại bỏ tất cả ký tự không phải số
    infor_yard.value.contactPhone = event.target.value; // Cập nhật giá trị đã lọc vào biến v-model
};

/**Hàm trở về trang chủ*/
function goHome() {
    router.push('/main');
}



// Hàm để mở file input khi người dùng nhấn vào nút
const triggerFileInput = () => {
    fileInput.value!.click(); // Dùng ! để nói với TypeScript rằng giá trị không phải null
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
        infor_yard.value.images.push(data.secure_url); // Thêm đường dẫn ảnh vào mảng
    } catch (error) {
        console.error("Error uploading image:", error);
    }
};
async function createCourt() {
    // Khôi phục và sử dụng thông tin từ localStorage
    infor_yard.value.userId = JSON.parse(localStorage.getItem("userInfo") ?? '{}')?.id || 0;

    if (!validateCourtData()) {
        return;
    }

    try {
        const response = await apiCreateCourt(infor_yard.value);
        console.log("API Response:", response);
        // Kiểm tra nếu API trả về thành công
        if (response && response.status === 200) {
            toast("Tạo sân thành công!", { autoClose: 5000 });
        } else {
            toast("Đăng ký thất bại, vui lòng thử lại!", { autoClose: 5000 });
        }
    } catch (error) {
        console.error("API Error:", error);
    }


}

// Validation function
function validateCourtData() {
    if (!infor_yard.value.courtName) {
        toast("Tên sân không được để trống!", { autoClose: 5000 });
        return false;
    }
    if (!infor_yard.value.courtDescription) {
        toast("Mô tả sân không được để trống!", { autoClose: 5000 });
        return false;
    }
    if (!infor_yard.value.district || !infor_yard.value.ward || !infor_yard.value.street) {
        toast("Vui lòng nhập đầy đủ địa chỉ!", { autoClose: 5000 });
        return false;
    }
    if (infor_yard.value.minPrice <= 0 || infor_yard.value.maxPrice <= 0 || infor_yard.value.minPrice > infor_yard.value.maxPrice) {
        toast("Giá không hợp lệ!", { autoClose: 5000 });
        return false;
    }
    if (!infor_yard.value.contactPerson) {
        toast("Người liên hệ không được để trống!", { autoClose: 5000 });
        return false;
    }
    if (!infor_yard.value.contactPhone || !/^\d{10,11}$/.test(infor_yard.value.contactPhone)) {
        toast("Số điện thoại không hợp lệ!", { autoClose: 5000 });
        return false;
    }
    return true;
}


</script>
