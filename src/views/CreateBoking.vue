<template>
    <div class="h-dvh w-dvw flex flex-col gap-3 px-3 py-2 bg-green">
        <header class="flex justify-between items-center py-2">
            <ChevronLeftIcon @click="goToDetail" class="w-6 h-6 text-white"></ChevronLeftIcon>
            <p class="text-2xl font-semibold text-white">Đặt lịch ngay</p>
            <p></p>
        </header>
        <main class="h-full flex flex-col gap-5 overflow-auto">
            <!-- Tên khách hàng -->
            <div class="flex flex-col gap-2 py-1">
                <label for="" class="text-xl font-semibold text-white">Tên khách hàng</label>
                <div class="flex justify-between items-center py-2 px-3 bg-white rounded-md border border-slate-500 shadow-sm">
                    <input type="text" v-if="user_court" v-model="user_court.fullname" class="text-lg w-full outline-none" placeholder="Nhập tên khách hàng">
                </div>
            </div>
            <!-- Số điện thoại -->
            <div class="flex flex-col gap-2 py-1">
                <label for="" class="text-xl font-semibold text-white">Số điện thoại</label>
                <div class="flex justify-between items-center py-2 px-3 bg-white rounded-md border border-slate-500 shadow-sm">
                    <div class="flex gap-2 w-full">
                        <div class="flex gap-2 flex-shrink-0 items-center">
                            <div class="p-1.5 rounded-full bg-red-600">
                                <StarIcon class="w-4 h-4 text-yellow-300"></StarIcon>
                            </div>
                        </div>
                        <input v-if="user_court" type="tel" v-model="user_court.phoneNumber" @input="filterSuggestions" @keypress="onlyNumber" class="text-lg w-full outline-none" placeholder="Nhập số điện thoại">
                    </div>
                    <PlusCircleIcon @click="openModal" v-tooltip="'Chú thích khi hover vào đây'" class="w-6 h-6 text-yellow-600 shrink-0"></PlusCircleIcon>
                </div>
                <!-- Danh sách gợi ý -->
                <ul v-if="suggestions.length > 0" class="absolute top-[0px] bg-white border w-full mt-1 max-h-48 overflow-y-auto rounded shadow z-10">
                    <li v-for="(user, index) in suggestions" :key="index" @click="selectUser(user)" class="p-2 hover:bg-gray-100 cursor-pointer">
                        {{ user.username }} - {{ user.phoneNumber }}
                    </li>
                </ul>
            </div>
            <!-- Thông tin đặt lịch -->
            <div class="flex flex-col mt-10 bg-green-900 rounded-md opacity-95 gap-3 px-5 py-5">
                <div class="flex gap-3 items-center">
                    <ClipboardDocumentListIcon class="w-10 h-10 text-yellow-200"></ClipboardDocumentListIcon>
                    <p class="text-xl font-semibold text-yellow-300">Thông tin đặt lịch</p>
                </div>
                <div class="flex gap-2 flex-col">
                    <div class="flex text-lg text-white items-center gap-3">
                        <p class="text-xl">Tên sân:</p>
                        <p class="font-semibold">{{ store_court.court_detail?.courtName }}</p>
                    </div>
                    <div class="flex text-lg text-white gap-3">
                        <p class="text-lg">Sân con:</p>
                        <p class="font-semibold text-lg text-white">{{ store_court.chill_detail?.childCourtName }}</p>
                    </div>
                    <div class="flex text-lg text-white items-center gap-3">
                        <p class="text-lg">Địa chỉ:</p>
                        <p class="font-semibold">{{ address }}</p>
                    </div>
                    <!-- Thông tin đặt lịch từ store.bookings -->
                    <div class="flex flex-col gap-3">
                        <p class="text-lg text-white font-semibold">Chi tiết đặt lịch:</p>
                        <div v-for="booking in store.bookings" :key="booking.id" class="flex flex-col bg-green-800 p-3 rounded-md gap-2">
                            <p class="text-lg text-white">Ngày: {{ formatStartDate(booking.startTime) }}</p>
                            <p class="text-lg text-white">Thời gian: Từ {{ formatTime(booking.startTime) }} - {{ formatTime(booking.endTime) }}</p>
                            <p class="text-lg text-white">Loại: {{ getTypeText(booking.type) }}</p>
                            <p class="text-lg text-white">Số lượng: {{ booking.quantity }}</p>
                            <p class="text-lg text-white">Giá: {{ formatCurrency(booking.price) }}</p>
                        </div>
                        <div class="flex flex-col gap-2 pt-3 border-t border-green-700">
                            <div class="flex text-lg text-white items-center gap-3">
                                <p class="text-lg">Tổng tiền phải thanh toán:</p>
                                <p class="font-semibold">{{ totalBookingCost }}</p>
                            </div>
                            <div v-if="is_key" class="flex text-xl text-white items-center gap-5">
                                <input v-model="key" type="checkbox" class="w-6 h-6">
                                <p class="font-semibold">Đặt sân cho khách</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
        <button @click="addBoking" class="text-center text-xl font-semibold text-white bg-yellow-500 rounded-lg py-3">Xác nhận</button>
    </div>
    <!-- Modal -->
    <Modal v-if="show_modal" :close="showModal">
        <template #content>
            <div class="w-[700px] flex flex-col px-3">
                <header class="flex items-center border-b border-slate-300 py-2 justify-between">
                    <p class="text-green-800 text-xl font-semibold">Thông tin người đặt</p>
                    <XMarkIcon @click="showModal" class="h-5 w-5 hover:bg-slate-300 rounded-lg"></XMarkIcon>
                </header>
                <body class="w-full grid py-2 gap-4 grid-cols-1">
                    <div class="flex-col col-span-1 flex text-sm font-medium text-green-700">
                        <div class="flex flex-col gap-2 pb-5" :class="{ 'opacity-50': activeInput !== 'addresss' && !info_clien.fullname }">
                            <label class="font-semibold text-green-900" for="">Tên người dùng</label>
                            <input v-model="info_clien.fullname" placeholder="Nhập tên người thuê" class="w-full px-3 py-2 outline-none rounded-md border border-green-600" type="text" @focus="setActive('addresss')" @blur="removeActive" />
                        </div>
                        <div class="flex flex-col gap-2 pb-5" :class="{ 'opacity-50': activeInput !== 'address' && !info_clien.phoneNumber }">
                            <label class="font-semibold text-green-900" for="">Nhập số điện thoại</label>
                            <input v-model="info_clien.phoneNumber" placeholder="Nhập số điện thoại" class="w-full px-3 py-2 outline-none rounded-md border border-green-600" type="text" @focus="setActive('address')" @blur="removeActive" />
                        </div>
                    </div>
                </body>
                <footer class="w-full flex justify-end py-2 px-3 border-t border-slate-300">
                    <button @click="createClien" class="px-3 py-2 bg-yellow-500 text-sm font-semibold text-white rounded-lg w-fit">Tạo thông tin</button>
                </footer>
            </div>
        </template>
    </Modal>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import logoPick from "@/assets/imgs/logoPick.png"
import { format, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/appStore'
import { useAppStoreCourt } from '@/stores/appStoreCourt'
import { apiCreateBoking, apiUpdateBoking } from "@/service/api/apiBoking";
import { apiCreatePayment, apiCreatePaymentVNpay } from "@/service/api/apiPayment";
import { apiCreateUser, getListUser } from "@/service/api/api";
import { ChevronLeftIcon, PlusCircleIcon, StarIcon, ClipboardDocumentListIcon, XMarkIcon } from "@heroicons/vue/24/solid";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import Modal from "@/components/Modal/Modal.vue"
import type { UserInfo, Booking } from '@/interface'

dayjs.extend(utc);
dayjs.extend(timezone);

const formatTime = (time: string | undefined): string => {
  if (!time) return 'Không xác định';
  try {
    const date = parseISO(time);
    return format(date, 'HH:mm', { locale: vi });
  } catch {
    return time;
  }
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

const store_court = useAppStoreCourt()
const store = useAppStore()
const router = useRouter()

const typeMap: Record<number, string> = {
  0: 'Ngày',
  1: 'Tuần',
  2: 'Tháng',
  3: 'Năm',
};

const getTypeText = (type: number): string => {
  return type in typeMap ? typeMap[type] : 'Không xác định';
};

const formatStartDate = (date: string | undefined): string => {
  if (!date) return 'Không xác định';
  try {
    return new Date(date).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return 'Không xác định';
  }
};

const user_court = ref<UserInfo>();
const suggestions = ref<UserInfo[]>([])
const show_modal = ref(false);
const activeInput = ref('');
const key = ref(false)

const info_clien = ref({
  username: "",
  fullname: "",
  password: "Abc123@",
  phoneNumber: "",
  address: "",
  role: 0,
});

const is_key = computed(() => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
  return store_court.court_detail?.userId === userInfo.id;
});

const address = computed(() => {
  const detail = store_court.court_detail;
  if (!detail) return "";
  return `${detail.street}, ${detail.ward}, ${detail.district}, Hà Nội`;
});

// Tính tổng giá từ tất cả bookings
const totalBookingCost = computed(() => {
  const total = store.bookings.reduce((sum, booking) => sum + (booking.price || 0), 0);
  return formatCurrency(total);
});

onMounted(() => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
  console.log('userInfo', userInfo);
  user_court.value = userInfo;
});

const onlyNumber = (event: any) => {
  if (!/^\d$/.test(event.key)) {
    event.preventDefault();
  }
};

const pay_detail = ref({
  userId: user_court.value?.id ?? 0,
  bookingId: 0,
  price: 0, // Sẽ cập nhật sau khi tạo booking
  type: 0,
});

async function addBoking() {
  const phone = user_court.value?.phoneNumber?.trim() || '';
  const name = user_court.value?.fullname?.trim() || '';

  // Validate phone và name
  if (!name || !phone) {
    toast("Vui lòng nhập đầy đủ họ tên và số điện thoại!", { autoClose: 5000 });
    return;
  }

  const isValidPhone = /^0\d{9}$/.test(phone);
  if (!isValidPhone) {
    toast("Số điện thoại không hợp lệ! Vui lòng nhập đúng định dạng.", { autoClose: 5000 });
    return;
  }

  // Danh sách lưu các payment IDs (chỉ dùng khi key = false)
  const paymentIds = [];
  let allBookingsUpdated = true; // Biến để kiểm tra xem tất cả booking có cập nhật thành công không

  try {
    // Lặp qua store.bookings để gọi apiCreateBoking lần lượt
    for (const booking of store.bookings) {
      console.log('store_court.court_detail?.id',store_court.court_detail?.id);
      
      // Tạo object booking mới cho mỗi lần gọi API
      const bookingData = {
        ...booking, // Copy các thuộc tính từ booking

        
        userId: user_court.value?.id ?? 0, // Gán userId
        childCourtId: store_court.chill_detail?.id ?? 0, // Gán childCourtId
        status: 0, // Mặc định status là 0 (chờ xác nhận)
        price: booking.price || 0, // Giá của booking hiện tại
        courtId: store_court.court_detail?.id 
      };
      console.log('store_court.court_detail?.id111',bookingData);
      // Gọi API tạo booking
      const bookingResponse = await apiCreateBoking(bookingData);
      console.log("API Response for booking:", bookingResponse);

      if (bookingResponse && bookingResponse.status === 200) {
        console.log('Booking response data:', bookingResponse.data);

        // Cập nhật pay_detail cho booking hiện tại
        pay_detail.value.bookingId = bookingResponse.data.id;
        pay_detail.value.userId = user_court.value?.id ?? 0;
        pay_detail.value.price = bookingData.price;

        // Gọi payBooking để tạo payment cho booking hiện tại
        const paymentResponse = await payBooking();
        if (paymentResponse && paymentResponse.status === 200) {
          console.log('Payment response data:', paymentResponse.data);

          // Thu thập payment ID nếu key = false
          if (!key.value) {
            paymentIds.push(paymentResponse.data.id);
          }

          // Nếu key = true, gọi UpdateBoking ngay lập tức
          if (key.value) {
            await UpdateBoking(bookingResponse.data);
            // Nếu UpdateBoking thất bại, đánh dấu allBookingsUpdated = false
            // (Cần kiểm tra response trong UpdateBoking nếu muốn chính xác hơn)
          }
        } else {
          toast(`Tạo thanh toán thất bại cho booking , vui lòng thử lại!`, { autoClose: 5000 });
          allBookingsUpdated = false;
        }
      } else {
        toast(`Đăng ký thất bại cho booking , vui lòng thử lại!`, { autoClose: 5000 });
        allBookingsUpdated = false;
      }
    }

    // Nếu key = true và tất cả booking được cập nhật thành công, hiển thị thông báo và chuyển hướng
    if (key.value && allBookingsUpdated) {
      toast("Tạo lịch cho khách thành công!", { autoClose: 3000 });
      router.push('/detail');
    }

    // Nếu key = false, gọi payVNpay với danh sách paymentIds
    if (!key.value && paymentIds.length > 0) {
 
      
      await payVNpay(paymentIds);
    } else if (!key.value && paymentIds.length === 0) {
      toast("Không có thanh toán nào được tạo thành công!", { autoClose: 5000 });
    }

  } catch (error) {
    console.error("API Error:", error);
    toast("Có lỗi xảy ra, vui lòng thử lại!", { autoClose: 5000 });
  }
}

async function payBooking() {
  try {
    const response = await apiCreatePayment(pay_detail.value);
    return response; // Trả về response để lấy paymentId
  } catch (error) {
    console.error("API Error:", error);
    toast("Tạo thanh toán thất bại, vui lòng thử lại!", { autoClose: 5000 });
    return null;
  }
}

async function payVNpay(paymentIds :any) {
  console.log('paymentIds', paymentIds);
  try {
    const response = await apiCreatePaymentVNpay(paymentIds); // Chỉ truyền danh sách paymentIds
    if (response && response.status === 201) {
      console.log('response', response.data);
      const paymentUrl = response.data;
      if (paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        toast("Không lấy được link thanh toán!", { autoClose: 3000 });
      }
    } else {
      toast("Tạo link thanh toán thất bại, vui lòng thử lại!", { autoClose: 5000 });
    }
  } catch (error) {
    console.error("API Error:", error);
    toast("Có lỗi xảy ra khi tạo link thanh toán, vui lòng thử lại!", { autoClose: 5000 });
  }
}


function goToDetail() {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push('/detail');
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
    store.user_boking = user;
    suggestions.value = [];
  }
};

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
    const response = await apiCreateUser(info_clien.value);
    console.log("API Response:", response);
    if (response && response.status === 200) {
      user_court.value = response.data;
      toast("Tạo thông tin thành công!", { autoClose: 3000 });
      showModal();
      await getListUsers();
    } else {
      toast("Đăng ký thất bại, vui lòng thử lại!", { autoClose: 3000 });
    }
  } catch (error: any) {
    toast(error.message || error, { autoClose: 5000 });
  }
}

async function getListUsers() {
  try {
    const response = await getListUser();
    store.list_user = response.data;
  } catch (error) {
    console.error("API Error:", error);
  }
}

function openModal() {
  show_modal.value = true;
}

function showModal() {
  show_modal.value = false;
}

const setActive = (field: string) => {
  activeInput.value = field;
};

const removeActive = () => {
  activeInput.value = '';
};

function removeVietnameseTones(str: any) {
  return str.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}

async function UpdateBoking(repon: Booking) {
  if (repon) {
    repon.status = 2;
  }
  try {
    const response = await apiUpdateBoking(repon);
    if (!response) {
      toast("Cập nhật trạng thái booking thất bại, vui lòng thử lại!", { autoClose: 5000 });
    }
  } catch (error) {
    console.error("API Error:", error);
    toast("Có lỗi xảy ra khi cập nhật trạng thái booking!", { autoClose: 5000 });
  }
}

</script>

<style lang="scss" scoped></style>