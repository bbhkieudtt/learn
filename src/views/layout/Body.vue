<template>
  <main class="flex flex-col flex-1 overflow-hidden">
    <header class="flex flex-shrink-0 px-3 justify-between">
      <div class="p-2">
        <div class="flex justify-center items-center gap-3 rounded-xl w-fit">
          <div class="px-3 py-5 rounded-full flex-shrink-0 bg-white">
            <img src="@/assets/imgs/logoNo.png" class="w-[70px] h-[50px]" alt="" />
          </div>
          <h2 class="text-3xl font-semibold text-white">Pickleball</h2>
        </div>
      </div>
      <div class="flex gap-5 w-fit items-center">
        <transition name="slide-in">
          <div v-if="show_search_form" class="flex w-fit items-center gap-2">
            <el-form label-position="top" class="flex w-fit gap-2 h-fit">
              <el-select class="min-w-[200px] flex-1" v-model="selectedDistrict" placeholder="Chọn quận/huyện cần tìm"
                @change="getWards" size="large">
                <el-option v-for="district in store.districts" :key="district.code" :label="district.name"
                  :value="district.code" />
              </el-select>
              <el-select class="min-w-[200px] flex-1" v-model="selectedWard" placeholder="Chọn phường/xã cần tìm"
                :disabled="wards.length === 0" @change="getStreets" size="large">
                <el-option v-for="ward in wards" :key="ward.code" :label="ward.name" :value="ward.code" />
              </el-select>
              <el-input class="min-w-[200px] flex-1" v-model="infor_yard.street" placeholder="Nhập tên đường cần tìm" />
            </el-form>
            <input v-model="infor_yard.courtName" placeholder="Nhập tên sân"
              class="px-3 outline-none min-w-[200px] flex-1 py-2 rounded-md border border-green-600" type="text" />
          </div>
        </transition>
        <div class="p-2 flex group cursor-pointer items-center gap-2 bg-white rounded-full">
          <icon-search @click="showFilter" class="w-5 h-5 group-hover:text-green-500"></icon-search>
        </div>
        <!-- Button for Modal -->
        <div class="p-2 flex group cursor-pointer items-center gap-2 bg-white rounded-full">
          <button @click="openModal" class="flex items-center justify-center">
            <svg class="w-5 h-5 group-hover:text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          </button>
        </div>
      </div>
    </header>
    <div class="h-full overflow-hidden">
      <div v-if="list_court && list_court.length === 0" class="w-full h-full flex justify-center items-center">
        <div class="flex flex-col gap-2 justify-center items-center">
          <img src="@/assets/imgs/image9.png" alt="" />
          <h3 class="text-2xl text-white font-bold">Chưa có sân nào</h3>
        </div>
      </div>
      <div v-else class="w-full h-full flex justify-center overflow-y-auto items-center px-5 py-2">
        <div class="grid h-full overflow-y-auto lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-15">
          <div @click="goToDetail(yard)" v-for="yard in list_court" :key="yard.id"
            class="flex items-center h-fit w-60 border border-white flex-shrink-0 rounded-lg cursor-pointer flex-col bg-white">
            <img class="w-60 rounded-t-lg h-50" :src="isValidImage(yard.images[0]) ? yard.images[0] : anh1"
              alt="ảnh sân" />
            <div class="flex w-full flex-shrink-0 flex-col gap-0.5 p-1 py-2">
              <h3 class="text-sm font-medium text-black truncate">
                {{ yard.courtName }}
              </h3>
              <p class="text-sm flex-shrink-0 text-slate-500 truncate">{{ yard.street + ', ' + yard.ward + ', ' +
                yard.district }}</p>
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 bg-green-500 rounded-full"></span>
                <p class="text-xs">{{ yard.startTime && yard.endTime ? formatHour(yard.startTime) + ' - ' +
                  formatHour(yard.endTime) : '24/7' }}</p>
              </div>
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
    <Modal v-if="show_modal" :close="closeModal">
      <template #content>
        <div class="w-full max-w-[600px] bg-white rounded-lg p-6">
          <h2 class="text-2xl font-semibold text-green-700 mb-4">Chọn thời gian đặt sân</h2>
          <div class="space-y-4">
            <!-- Chọn ngày -->
            <div>
              <label class="block text-sm font-medium text-green-700">Ngày đặt sân</label>
              <vue-date-picker v-model="bookingDates[0]" :format="formatDate" :enable-time-picker="false"
                :min-date="new Date()" class="mt-1 w-full" teleport="body" @update:model-value="updateDayInfo(0)" />
              <p v-if="bookingDayInfo[0]" class="mt-1 text-sm text-yellow-600">{{ bookingDayInfo[0] }}</p>
            </div>
            <!-- Thời gian bắt đầu -->
            <div>
              <label class="block text-sm font-medium text-green-700">Thời gian bắt đầu</label>
              <input v-model="bookingStartTimes[0]" type="time" step="3600" :min="minStartTime(0)"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2"
                @change="updateBookingTimes(0)">
            </div>
            <!-- Thời gian kết thúc -->
            <div>
              <label class="block text-sm font-medium text-green-700">Thời gian kết thúc</label>
              <input v-model="bookingEndTimes[0]" type="time" step="3600"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2"
                @change="updateBookingTimes(0)">
            </div>
          </div>
          <div class="mt-6 flex justify-end gap-3">
            <button @click="closeModal"
              class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">Hủy</button>
            <button @click="confirmBooking" class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              :disabled="!bookingDates[0] || !bookingStartTimes[0] || !bookingEndTimes[0]">Xác nhận</button>
          </div>
        </div>
      </template>
    </Modal>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from 'vue-router';
import axios from "axios";

import { getListUser } from "@/service/api/api";
import { apiGetCourt } from "@/service/api/apiCourt";
import { apiGetListReview } from "@/service/api/apiReview";
import { apiGetListBooking, apiUpdateBoking } from '@/service/api/apiBoking';

import { useAppStore } from '@/stores/appStore';
import { useAppStoreCourt } from '@/stores/appStoreCourt';
import { useAppStoreReview } from '@/stores/appStoreReview';

import IconSearch from "@/components/Icons/IconSearch.vue";
import IconComment from '@/components/Icons/IconComment.vue';

import Modal from "@/components/Modal/Modal.vue";

import anh1 from "@/assets/imgs/bg_san.jpg";

import type { Court, Division, Location, Review, GroupedReview, CourtEvent } from '@/interface';

const router = useRouter();

const show_modal = ref(false);
const show_search_form = ref(false);

const bookingDates = ref<(Date | null)[]>([null]);
const bookingStartTimes = ref<string[]>(['']);
const bookingEndTimes = ref<string[]>(['']);
const bookingDayInfo = ref<string[]>(['']);

const store = useAppStore();
const store_court = useAppStoreCourt();
const store_review = useAppStoreReview();

const selectedDistrict = ref("");
const selectedWard = ref("");
const wards = ref<Location[]>([]);
const infor_yard = ref({
  courtName: '',
  district: '',
  ward: '',
  street: '',
});

const list_bokings = ref<CourtEvent[]>([]);

const list_court = computed(() => {
  const courts = store_court.list_court;
  const yard = infor_yard.value;

  if (!Array.isArray(courts)) {
    console.error('Danh sách sân không phải mảng:', courts);
    return [];
  }

  return courts.filter(court => {
    const matchDistrict = yard.district ? court.district === yard.district : true;
    const matchWard = yard.ward ? court.ward === yard.ward : true;
    const matchStreet = yard.street
      ? court.street?.toLowerCase().includes(yard.street.toLowerCase())
      : true;
    const matchCourtName = yard.courtName
      ? court.courtName?.toLowerCase().includes(yard.courtName.toLowerCase())
      : true;
    const matchStatus = court.status === 0;

    let matchTime = true;
    if (bookingStartTimes.value[0] && bookingEndTimes.value[0] && bookingDates.value[0]) {
      console.log('Lịch đặt được chọn:', {
        date: bookingDates.value[0],
        startTime: bookingStartTimes.value[0],
        endTime: bookingEndTimes.value[0],
        courtName: court.courtName,
        courtId: court.id
      });

      const courtStart = court.startTime || '00:00';
      const courtEnd = court.endTime || '23:59';
      matchTime = bookingStartTimes.value[0] >= courtStart && bookingEndTimes.value[0] <= courtEnd;

      if (matchTime) {
        const selectedDate = bookingDates.value[0]!;
        const [startHours, startMinutes] = bookingStartTimes.value[0].split(':').map(Number);
        const [endHours, endMinutes] = bookingEndTimes.value[0].split(':').map(Number);

        const newStart = new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate(),
          startHours,
          startMinutes
        );
        const newEnd = new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate(),
          endHours,
          endMinutes
        );

        console.log('Thời gian sự kiện mới:', {
          start: newStart.toLocaleString('vi-VN'),
          end: newEnd.toLocaleString('vi-VN')
        });

        console.log('Kiểm tra lịch đặt cho sân:', court.courtName, 'courtId:', court.id);
        for (const booking of list_bokings.value) {
          if (booking.courtId === court.id) {
            const bookingStart = new Date(booking.startTime);
            const bookingEnd = new Date(booking.endTime);

            // Kiểm tra cùng ngày
            const isSameDay =
              bookingStart.getFullYear() === selectedDate.getFullYear() &&
              bookingStart.getMonth() === selectedDate.getMonth() &&
              bookingStart.getDate() === selectedDate.getDate();

            console.log('Lịch đặt hiện có:', {
              courtId: booking.courtId,
              start: bookingStart.toLocaleString('vi-VN'),
              end: bookingEnd.toLocaleString('vi-VN'),
              isSameDay
            });

            if (isSameDay && newStart <= bookingEnd && newEnd >= bookingStart) {
              console.log('Tìm thấy trùng lặp cho sân:', court.courtName, 'với lịch:', {
                start: bookingStart.toLocaleString('vi-VN'),
                end: bookingEnd.toLocaleString('vi-VN')
              });
              matchTime = false;
              break;
            }
          }
        }
      }
    }

    return matchDistrict && matchWard && matchStreet && matchCourtName && matchStatus && matchTime;
  });
});

const start = ref(5);

onMounted(async () => {
  await getListCourt();
  await getDistricts();
  await getListReview();
  await getListUsers();
  await getListBoking();
  store_court.is_court = 'home';
});

const getDistricts = async () => {
  try {
    const response = await axios.get("https://provinces.open-api.vn/api/p/1?depth=2");
    store.districts = response.data.districts;
  } catch (error) {
    console.error("Lỗi khi lấy quận/huyện Hà Nội:", error);
  }
};

const getWards = async () => {
  const district = store.districts.find(d => d.code === selectedDistrict.value);
  infor_yard.value.district = district ? district.name : "";
  selectedWard.value = "";
  try {
    const response = await axios.get(`https://provinces.open-api.vn/api/d/${selectedDistrict.value}?depth=2`);
    wards.value = response.data.wards;
  } catch (error) {
    console.error("Lỗi khi lấy phường/xã:", error);
  }
};

const getStreets = () => {
  const ward = wards.value.find((w: any) => w.code === selectedWard.value);
  infor_yard.value.ward = ward ? ward.name : "";
};

function goToDetail(yard: Court) {
  router.push({ path: '/detail', query: { id: yard.id } });
  store_court.court_detail = yard;
}

async function getListCourt() {
  try {
    const response = await apiGetCourt();
    store_court.list_court = response.data.filter((court: Court) =>
      court.courtName.trim() !== "" &&
      court.street.trim() !== "" &&
      court.ward.trim() !== "" &&
      court.district.trim() !== "" &&
      court.images.length > 0
    );
    console.log('Danh sách sân:', store_court.list_court);
  } catch (error) {
    console.error("Lỗi API lấy danh sách sân:", error);
  }
}

async function getListReview() {
  try {
    const response = await apiGetListReview();
    if (Array.isArray(response.data)) {
      store_review.list_review = convertToGroupedObject(response.data);
    } else {
      console.error('Dữ liệu đánh giá không phải mảng:', response);
    }
  } catch (error) {
    console.error("Lỗi API lấy đánh giá:", error);
  }
}

async function getListUsers() {
  try {
    const response = await getListUser();
    store.list_user = response.data;
  } catch (error) {
    console.error("Lỗi API lấy danh sách người dùng:", error);
  }
}

async function getListBoking() {
  try {
    const response = await apiGetListBooking();
    if (response && response.status === 200) {
      console.log('Dữ liệu lịch đặt từ API:', response.data);
      list_bokings.value = response.data;
      console.log('Lịch đặt được lưu:', list_bokings.value);
    } else {
      console.log('Không tìm thấy lịch đặt');
    }
  } catch (error) {
    console.error('Lỗi API lấy lịch đặt:', error);
    console.log('Không tìm thấy lịch đặt');
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
  Object.values(result).forEach((group) => {
    group.averageRatingStar = parseFloat((group.averageRatingStar / group.total_comments).toFixed(2));
  });
  return result;
}

function isValidImage(image: string) {
  const urlPattern = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|bmp|webp))$/i;
  return urlPattern.test(image);
}

function formatHour(timeStr: string): string {
  return timeStr?.slice(0, 5);
}

function showFilter() {
  show_search_form.value = !show_search_form.value;
  if (!show_search_form.value) {
    infor_yard.value.courtName = '';
    infor_yard.value.district = '';
    infor_yard.value.ward = '';
    infor_yard.value.street = '';
  }
}

function openModal() {
  show_modal.value = true;
}

function closeModal() {
  show_modal.value = false;
  // Reset modal data
  bookingDates.value = [null];
  bookingStartTimes.value = [''];
  bookingEndTimes.value = [''];
  bookingDayInfo.value = [''];
}

function confirmBooking() {
  if (bookingDates.value[0] && bookingStartTimes.value[0] && bookingEndTimes.value[0]) {
    console.log('Xác nhận đặt sân:', {
      date: bookingDates.value[0],
      startTime: bookingStartTimes.value[0],
      endTime: bookingEndTimes.value[0]
    });
    closeModal();
  }
}

function formatDate(date: Date) {
  return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function minStartTime(index: number) {
  const today = new Date();
  const selectedDate = bookingDates.value[index];
  if (selectedDate && selectedDate.toDateString() === today.toDateString()) {
    const hours = today.getHours().toString().padStart(2, '0');
    const minutes = today.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }
  return '00:00';
}

function updateDayInfo(index: number) {
  const selectedDate = bookingDates.value[index];
  if (selectedDate) {
    bookingDayInfo.value[index] = `Bạn đã chọn ngày: ${formatDate(selectedDate)}`;
  } else {
    bookingDayInfo.value[index] = '';
  }
}

function updateBookingTimes(index: number) {
  const startTime = bookingStartTimes.value[index];
  const endTime = bookingEndTimes.value[index];
  if (startTime && endTime && startTime >= endTime) {
    bookingEndTimes.value[index] = '';
    alert('Thời gian kết thúc phải sau thời gian bắt đầu.');
  }
}
</script>

<style scoped>
.slide-in-enter-active,
.slide-in-leave-active {
  transition: all 0.3s ease;
}

.slide-in-enter-from,
.slide-in-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}
</style>