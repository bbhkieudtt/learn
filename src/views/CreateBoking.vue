<template>
    <div class="h-dvh w-dvw flex flex-col gap-3 px-3 py-2 bg-green ">
        <header class="flex justify-between items-center py-2">
            <ArrowLeftIcon @click='goToDetail' class="w-7 h-7 cursor-pointer text-white"></ArrowLeftIcon>
            <!--  -->
            <p class=" text-2xl font-semibold text-white">
                Đặt lịch ngay
            </p>
            <!--  -->
            <p>
            </p>
        </header>
        <!--  -->
        <main class="h-full flex flex-col gap-5 overflow-auto ">
            <!-- tên -->
            <div class="flex flex-col gap-2 py-1">
                <label for="" class="text-xl font-semibold text-white"> Tên khách hàng</label>
                <div
                    class="flex justify-between items-center py-2 px-3 bg-white rounded-md border border-slate-500 shadow-sm">
                    <input type="text" v-if="user_court" v-model="user_court.fullname"
                        class="text-lg w-full outline-none " placeholder="Nhập tên khách hàng">

                </div>
            </div>
            <!-- sđt -->
            <div class="flex flex-col gap-2 py-1">
                <label for="" class="text-xl font-semibold text-white"> Số điện thoại</label>
                <div
                    class="flex justify-between items-center py-2 px-3 bg-white rounded-md border border-slate-500 shadow-sm">
                    <div class="flex gap-2 w-full">
                        <div class="flex gap-2 flex-shrink-0 items-center">
                            <div class="p-1.5 rounded-full bg-red-600">
                                <StarIcon class="w-4 h-4 text-yellow-300"></StarIcon>
                            </div>
                        </div>
                        <input v-if="user_court" type="tel" v-model="user_court.phoneNumber" @input="filterSuggestions"
                            @keypress="onlyNumber" class="text-lg w-full  outline-none "
                            placeholder="Nhập số điện thoại">
                    </div>
                    <PlusCircleIcon @click="openModal" v-tooltip="'Chú thích khi hover vào đây'"
                        class="w-6 h-6 text-yellow-600 shrink-0">
                    </PlusCircleIcon>
                </div>
                <!-- Danh sách gợi ý -->
                <ul v-if="suggestions.length > 0"
                    class="absolute top-[0px] bg-white border w-full mt-1 max-h-48 overflow-y-auto rounded shadow z-10">
                    <li v-for="(user, index) in suggestions" :key="index" @click="selectUser(user)"
                        class="p-2 hover:bg-gray-100 cursor-pointer">
                        {{ user.username }} - {{ user.phoneNumber }}
                    </li>
                </ul>
            </div>
            <!-- Thông tin  -->
            <div class="flex flex-col mt-10 bg-green-900 rounded-md opacity-95 gap-3 px-5 py-5 ">
                <div class="flex gap-3  items-center ">
                    <ClipboardDocumentListIcon class="w-10 h-10 text-yellow-200 "></ClipboardDocumentListIcon>
                    <p class="text-xl font-semibold text-yellow-300">
                        Thông tin đặt lịch
                    </p>
                </div>
                <div class="flex gap-2 flex-col  ">
                    <div class="flex text-lg text-white items-center gap-3">
                        <p class="text-xl">Tên sân:</p>
                        <p class="font-semibold">{{ store_court.court_detail?.courtName }}</p>
                    </div>
                    <div class="flex text-lg text-white items-center gap-3">
                        <p class="text-lg">Địa chỉ:</p>
                        <p class="font-semibold">{{ address }}</p>
                    </div>
                    <!--  -->
                    <div class="flex text-lg text-white  gap-3">
                        <p class="text-lg ">Thời gian & sân:</p>

                        <p v-if="store.selectInfo">{{ formattedStartDate }} </p> từ
                        <span> {{ start_boking }} - {{
                            end_boking }}</span>
                    </div>
                    <div class="flex text-lg text-white  gap-3">
                        <p class="text-lg ">Sân con:</p>

                        <p class="font-semibold text-lg text-white "> {{ store_court.chill_detail?.childCourtName }}


                        </p>
                    </div>
                    <!-- Tổng giờ -->
                    <div class="flex text-lg text-white items-center gap-3">
                        <p class="text-lg">Tổng giờ:</p>
                        <p class="font-semibold">{{ total_boking_time }} giờ</p>
                    </div>
                    <!-- Tổng giờ -->
                    <div class="flex text-lg text-white items-center gap-3">
                        <p class="text-lg">Giá (1 tiếng):</p>
                        <p class="font-semibold">{{ formattedRentCost }} /giờ</p>
                    </div>
                    <!-- Tổng tiền-->
                    <div class="flex text-lg text-white items-center gap-3">
                        <p class="text-lg">Tổng tiền phải thanh toán:</p>
                        <p class="font-semibold">{{ key ? 0 : totalRentCost }}</p>
                    </div>
                    <!-- khóa thời gian  -->
                    <!-- <div v-if="is_key" class="flex text-xl text-white items-center gap-5">
                        <input v-model="key" type="checkbox" class="w-6 h-6">
                        <p class="font-semibold">Khóa</p>
                    </div> -->
                </div>
            </div>
        </main>
        <!--  -->
        <button @click="addBoking" class="text-center text-xl font-semibold text-white bg-yellow-500 rounded-lg py-3">
            Xác nhận
        </button>
    </div>
    <!--  -->
    <Modal v-if="show_modal" :close="showModal">
        <template #content>
            <!--  -->
            <div class="w-[700px] flex flex-col px-3 ">
                <header class="flex items-center border-b border-slate-300 py-2  justify-between">
                    <p class="text-green-800 text-xl font-semibold">
                        Thông tin người đặt
                    </p>
                    <XMarkIcon @click="showModal" class="h-5 w-5 hover:bg-slate-300 rounded-lg "></XMarkIcon>
                </header>

                <body class="w-full grid py-2 gap-4 grid-cols-1">
                    <div class="flex-col col-span-1 flex text-sm font-medium text-green-700">
                        <!-- Nhập tên sân con -->
                        <div class="flex flex-col gap-2  pb-5" :class="{
                            'opacity-50': activeInput !== 'addresss' && !info_clien.fullname
                        }">
                            <label class="font-semibold text-green-900" for="">Tên người dùng</label>
                            <input v-model="info_clien.fullname" placeholder="Nhập tên người thuê"
                                class="w-full px-3 py-2 outline-none rounded-md border border-green-600" type="text"
                                @focus="setActive('addresss')" @blur="removeActive" />
                        </div>
                        <!-- -->
                        <div class="flex flex-col gap-2  pb-5" :class="{
                            'opacity-50': activeInput !== 'addresss' && !info_clien.phoneNumber
                        }">
                            <label class="font-semibold text-green-900" for="">Nhập số điện thoại</label>
                            <input v-model="info_clien.phoneNumber" placeholder="Nhập số điện thoại"
                                class="w-full px-3 py-2 outline-none rounded-md border border-green-600" type="text"
                                @focus="setActive('address')" @blur="removeActive" />
                        </div>


                    </div>
                </body>
                <!--  -->
                <footer class="w-full flex justify-end py-2 px-3 border-t border-slate-300">
                    <button @click="createClien"
                        class="px-3 py-2 bg-yellow-500 text-sm font-semibold text-white rounded-lg w-fit">
                        Tạo thông tin
                    </button>
                </footer>

            </div>

        </template>
    </Modal>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

/**Router*/
import { useRouter } from 'vue-router'

/**Store*/
import { useAppStore } from '@/stores/appStore'
import { useAppStoreCourt } from '@/stores/appStoreCourt'

/**api*/
import { apiCreateBoking } from "@/service/api/apiBoking";
import { apiCreatePayment, apiCreatePaymentVNpay } from "@/service/api/apiPayment";
import { apiCreateUser } from "@/service/api/api";
import { getListUser } from "@/service/api/api";



/**icon*/
import { } from "@heroicons/vue/24/outline";
import { ArrowLeftIcon, PlusCircleIcon, StarIcon, ClipboardDocumentListIcon } from "@heroicons/vue/24/solid";

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

/**toast*/
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

/**Modal*/
import Modal from "@/components/Modal/Modal.vue"

/**kiểu dữ liệu*/
import type {
    ClientBoking, UserInfo, Booking
} from '@/interface'


dayjs.extend(utc);
dayjs.extend(timezone);

const store_court = useAppStoreCourt()

/**biến store*/
const store = useAppStore()

/**Biến thông tin người đặt*/
const user_court = ref<UserInfo>();

const suggestions = ref<UserInfo[]>([])

/**biến mở modal tìm kiếm sân theo địa chỉ*/
const show_modal = ref(false);

/**Lưu ô input nào đang được focus*/
const activeInput = ref('');

/**hàm đóng modal*/
function showModal() {
    show_modal.value = false;
}

/***/
const setActive = (field: string) => {
    activeInput.value = field;
};

/***/
const removeActive = () => {
    activeInput.value = '';
};

/**Thông tin người đặt*/
// Khởi tạo biến info_clien với kiểu dữ liệu User
const info_clien = ref({
    username: "",
    fullname: "",
    password: "Abc123@",
    phoneNumber: "",
    address: "",
    role: 0,
});



const formattedTimeStart = dayjs(store.selectInfo?.startStr)
    .format("YYYY-MM-DDTHH:mm:ss.SSS");

const formattedTimeEnd = dayjs(store.selectInfo?.endStr)
    .format("YYYY-MM-DDTHH:mm:ss.SSS");

/**Biến thông tin lịch đặt*/
const detail_boking = ref<Booking>({
    userId: 0,
    childCourtId: 0,
    startTime: '',
    endTime: '',
    status: 0,
    price: 0
});



/**khóa sân*/
const key = ref(false)

const is_key = computed(() => {
    // Logic tính toán để trả về giá trị true hoặc false
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
    return store_court.court_detail?.userId === userInfo.id;
});

const address = computed(() => {
    const detail = store_court.court_detail;

    if (!detail) return "";

    return `${detail.street}, ${detail.ward}, ${detail.district}, Hà Nội`;
});

/**Biến router */
const router = useRouter()

/**Biến giờ bắt đầu đặt sân */
const start_boking = computed(() => {
    return store.selectInfo?.start
        ? new Date(store.selectInfo.start).toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
        })
        : "";
});
/**Biến giờ bắt đầu đặt sân */
const end_boking = computed(() => {
    return store.selectInfo?.end
        ? new Date(store.selectInfo.end).toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
        })
        : "";
});

/** Biến tính tổng giờ */
const total_boking_time = computed(() => {
    const startTime = store.selectInfo?.start ? new Date(store.selectInfo.start) : null;
    const endTime = store.selectInfo?.end ? new Date(store.selectInfo.end) : null;

    if (startTime && endTime) {
        const diff = (endTime.getTime() - startTime.getTime()) / 1000 / 60 / 60; // Tính chênh lệch theo giờ
        return diff.toFixed(2); // Làm tròn đến 2 chữ số thập phân
    }

    return 0; // Nếu không có dữ liệu, trả về 0
});

const formattedStartDate = computed(() => {
    const startStr = store.selectInfo?.startStr;
    if (!startStr) {
        return '';
    }

    const date = new Date(startStr);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
});

/**giá sân trong 1 tiếng*/
const formattedRentCost = computed(() => {
    if (store_court.chill_detail?.rentCost) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(store_court.chill_detail.rentCost);
    }
    return '';
});

const totalRentCost = computed(() => {
    const rentCost = store_court.chill_detail?.rentCost || 0;
    const totalTime = parseFloat(String(total_boking_time.value)); // Chuyển đổi thành chuỗi trước khi parseFloat
    const totalCost = rentCost * totalTime; // Tính tổng tiền
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(totalCost); // Định dạng kết quả thành tiền tệ
});

const totalRentCostRaw = computed(() => {
    const rentCost = store_court.chill_detail?.rentCost || 0;
    const totalTime = parseFloat(String(total_boking_time.value)); // Chuyển đổi thành số
    const totalCost = rentCost * totalTime;
    return totalCost; // Trả về số, không định dạng
});

onMounted(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
    console.log('userInfo', userInfo);

    user_court.value = userInfo;


});



/**Hàm kiểm tra chỉ cho nhập số không nhập chữ*/
const onlyNumber = (event: any) => {
    if (!/^\d$/.test(event.key)) {
        // Chặn ký tự không phải số
        event.preventDefault();
    }
};

//** Thông tin thanh toán */
const pay_detail = ref({
    userId: user_court.value?.id ?? 0,
    bookingId: 0,
    price: totalRentCostRaw.value,
    type: 0,

})

/**Hàm tạo lịch đặt sân*/
async function addBoking() {
    // hàm thanh toán

        detail_boking.value.userId = user_court.value?.id ?? 0
        detail_boking.value.childCourtId = store_court.chill_detail?.id ?? 0
        detail_boking.value.startTime = formattedTimeStart
        detail_boking.value.endTime = formattedTimeEnd
        detail_boking.value.price = totalRentCostRaw.value
        detail_boking.value.status = 1
        try {
            const response = await apiCreateBoking(detail_boking.value);
            console.log("API Response:", response);
            // Kiểm tra nếu API trả về thành công
            if (response && response.status === 200) {
                console.log('response', response.data);

                pay_detail.value.bookingId = response.data.id

                pay_detail.value.userId = user_court.value?.id ?? 0


                payBooking()


            } else {
                toast("Đăng ký thất bại, vui lòng thử lại!1", { autoClose: 5000 });
            }
        } catch (error) {
            console.error("API Error:", error);
        }
}

function goToDetail() {
    router.push('/detail')
}


/**Hàm tạo thanh toán*/
async function payBooking() {
    try {
        const response = await apiCreatePayment(pay_detail.value);

        // Kiểm tra nếu API trả về thành công
        if (response && response.status === 200) {
            console.log('response', response.data);

            payVNpay(response.data.id)

        } else {
            toast("Đăng ký thất bại, vui lòng thử lại!2", { autoClose: 5000 });
        }
    } catch (error) {
        console.error("API Error:", error);
    }
}

/**hàm thanh toán vnpay*/
async function payVNpay(id: number) {
    console.log('id', id);

    try {
        const response = await apiCreatePaymentVNpay({
            paymentId: id,
            moneyToPay: pay_detail.value.price
        });

        // Kiểm tra nếu API trả về thành công
        if (response && response.status === 201) {
            console.log('response', response.data);
            const paymentUrl = response.data; // hoặc response.data.url nếu API trả về như vậy

            if (paymentUrl) {
                window.location.href = paymentUrl; // Mở liên kết trong tab mới
            } else {
                toast("Không lấy được link thanh toán!", { autoClose: 3000 });
            }

        } else {
            toast("Đăng ký thất bại, vui lòng thử lại!3", { autoClose: 5000 });
        }
    } catch (error) {
        console.error("API Error:", error);
    }
}

const filterSuggestions = () => {
    if (user_court.value) {
        const input = user_court.value.phoneNumber.trim();
        if (input.length === 0) {
            suggestions.value = [];
            return;
        }
        suggestions.value = store.list_user.filter((user) =>
            user.phoneNumber.startsWith(input)
        );
    }
};

const selectUser = (user: UserInfo) => {
    if (user_court.value) {
        user_court.value.phoneNumber = user.phoneNumber;
        user_court.value.fullname = user.fullname;
        store.user_boking = user
        suggestions.value = []; // Ẩn gợi ý sau khi chọn
    }
};

/**Hàm tạo mới khách*/
async function createClien() {
    const phone = info_clien.value.phoneNumber || '';
    const phoneRegex = /^(0[0-9]{9})$/;
    if (!phoneRegex.test(phone)) {
        toast("Số điện thoại không hợp lệ! Vui lòng nhập đúng 10 chữ số, bắt đầu bằng 0.", { autoClose: 5000 });
        return;
    }

    try {

        info_clien.value.username = removeVietnameseTones(info_clien.value.fullname)
            .toLowerCase()
            .replace(/\s+/g, "");

        // Dùng await để đợi kết quả từ API
        const response = await apiCreateUser(info_clien.value);
        console.log("API Response:", response);

        // Kiểm tra nếu API trả về thành công
        if (response && response.status === 200) {
            user_court.value = response.data

            toast("Tạo thông tin thành công!", { autoClose: 3000 });

            // Gọi các hàm khác nếu cần
            showModal();
            await getListUsers(); // Đảm bảo sử dụng await nếu getListUsers là một hàm async
        } else {
            toast("Đăng ký thất bại, vui lòng thử lại!", { autoClose: 3000 });
        }
    } catch (error: any) {
        toast(error.message || error, { autoClose: 5000 });
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

/**Mở modal*/
function openModal() {
    show_modal.value = true
}

function removeVietnameseTones(str: any) {
    return str.normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D");
}





</script>

<style lang="scss" scoped></style>