<template>
  <body class="bg-green-800 min-h-screen flex items-center justify-center">
    <ChevronLeftIcon @click="goToDetail" class="w-6 h-6 absolute top-4 left-4 text-white"></ChevronLeftIcon>
    <div id="app" class="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl flex flex-col max-h-[80vh]">
      <h1 class="text-2xl font-bold text-green-700 mb-6 text-center">Đặt Lịch Sân</h1>

      <!-- Dòng 1: Tên sân -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-green-700">Tên sân</label>
        <p class="mt-1 text-lg text-green-700 font-semibold">{{ store_court.court_detail?.courtName }}</p>
      </div>

      <!-- Dòng 2: Chọn sân con và hiển thị giá -->
      <div class="mb-4 flex space-x-4">
        <div class="flex-1">
          <label for="childCourt" class="block text-sm font-medium text-green-700">Chọn sân con</label>
          <select v-model="selectedChildCourt" id="childCourt"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2"
            @change="updatePrice()">
            <option value="" disabled>Chọn sân con</option>
            <option v-for="court in list_child" :value="court.id" :key="court.id">
              {{ court.childCourtName }}
            </option>
          </select>
        </div>
        <div class="flex-1">
          <label class="block text-sm font-medium text-green-700">Giá vãng lai</label>
          <input :value="store_court.chill_detail?.rentCost || 0" type="text" readonly
            class="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm sm:text-sm p-2">
        </div>
        <div class="flex-1">
          <label class="block text-sm font-medium text-green-700">Giá cố định</label>
          <input :value="store_court.chill_detail?.fixedRentCost || 0" type="text" readonly
            class="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm sm:text-sm p-2">
        </div>
      </div>

      <!-- Danh sách đặt lịch -->
      <div class="scroll-container max-h-[500px] overflow-y-auto mb-4">
        <div v-for="(booking, index) in bookings" :key="index"
          class="mb-4 p-4 border border-green-200 rounded-lg">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Chọn ngày -->
            <div>
              <label class="block text-sm font-medium text-green-700">Chọn ngày</label>
              <vue-date-picker v-model="bookingDates[index]" :format="formatDate"
                :enable-time-picker="false" :min-date="new Date()" class="mt-1" teleport="body"
                @update:model-value="updateDayInfo(index)"></vue-date-picker>
              <p v-if="bookingDayInfo[index]" class="mt-1 text-sm text-yellow-600">
                {{ bookingDayInfo[index] }}
              </p>
            </div>

            <!-- Thời gian bắt đầu -->
            <div>
              <label class="block text-sm font-medium text-green-700">Thời gian bắt đầu</label>
              <input v-model="bookingStartTimes[index]" type="time" step="3600"
                :min="minStartTime(index)"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2"
                @change="updateBookingTimes(index)">
            </div>

            <!-- Thời gian kết thúc -->
            <div>
              <label class="block text-sm font-medium text-green-700">Thời gian kết thúc</label>
              <input v-model="bookingEndTimes[index]" type="time" step="3600"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2"
                @change="updateBookingTimes(index)">
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mt-4">
            <!-- Chọn kiểu -->
            <div>
              <label class="block text-sm font-medium text-green-700">Kiểu</label>
              <select v-model.number="booking.type"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2"
                @change="updatePriceForBooking(index)">
                <option value="0">Ngày</option>
                <option value="1">Tuần</option>
                <option value="2">Tháng</option>
                <option value="3">Năm</option>
              </select>
            </div>

            <!-- Số lượng -->
            <div>
              <label class="block text-sm font-medium text-green-700">Số lượng</label>
              <input v-model.number="booking.quantity" type="number"
                :min="booking.type === 1 ? 3 : 1"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2"
                @input="validateQuantity(index); updatePriceForBooking(index)">
            </div>

            <!-- Giá -->
            <div>
              <label class="block text-sm font-medium text-green-700">Giá</label>
              <input :value="formatPrice(booking.price)" type="text" readonly
                class="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm sm:text-sm p-2">
            </div>

            <!-- Nút Thêm -->
            <div class="flex items-end">
              <button @click="addBookingRow"
                class="w-full bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800">
                Thêm
              </button>
            </div>

            <!-- Nút Xóa -->
            <div class="flex items-end">
              <button @click="removeBookingRow(index)"
                class="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                :disabled="bookings.length === 1">
                Xóa
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Nút Xác nhận đặt lịch -->
      <div class="mt-6 text-center">
        <button @click="confirmBooking"
          class="bg-yellow-400 text-green-700 px-6 py-3 rounded-md hover:bg-yellow-500 font-semibold">
          Xác nhận đặt lịch
        </button>
      </div>
    </div>
  </body>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { useAppStoreCourt } from '@/stores/appStoreCourt';
import { useAppStore } from '@/stores/appStore';
import { useRouter } from 'vue-router';
import { ChevronLeftIcon } from '@heroicons/vue/24/solid';

import type {Booking } from '@/interface'


const router = useRouter();
const store_court = useAppStoreCourt();
const store = useAppStore();

const selectedChildCourt = ref<number | undefined>();
  const bookings = ref<Booking[]>([
  {
    id: 99,
    userId: 1,
    childCourtId: 0,
    childCourtName: '',
    courtDistrict: '',
    courtId: 0,
    courtName: '',
    courtStreet: '',
    courtWard: '',
    createDate: '',
    startTime: '',
    endTime: '',
    status: 0,
    price: 0,
    type: 0,
    quantity: 1,
    userFullName: '',
    userPhoneNumber: '',
  },
]);
const bookingDates = ref<(Date | null)[]>([null]);
const bookingDayInfo = ref<string[]>(['']);
const bookingStartTimes = ref<string[]>(['']);
const bookingEndTimes = ref<string[]>(['']);

const id_Court = store_court.court_detail?.id ?? 0;

onMounted(() => {
  console.log('ktra',store.events_list);
  
  if (store_court.list_chill_court.length > 0) {
    store_court.chill_detail = list_child.value[0];
    selectedChildCourt.value = store_court.chill_detail.id;
    console.log('store_court.chill_detail', store_court.chill_detail);
  }
  console.log('Múi giờ trình duyệt:', Intl.DateTimeFormat().resolvedOptions().timeZone);
});

const list_child = computed(() => {
  if (!Array.isArray(store_court.list_chill_court)) return [];
  return store_court.list_chill_court.filter(child => child.courtId === id_Court);
});

// Hàm định dạng giá
const formatPrice = (price: number) => {
  return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
};

// Tính số buổi trong tháng dựa trên ngày trong tuần
const getSessionsInMonth = (startDate: Date, quantity: number) => {
  let sessions = 0;
  const startDay = startDate.getDate();
  const dayOfWeek = startDate.getDay();

  for (let i = 0; i < quantity; i++) {
    const currentStartDate = new Date(startDate.getFullYear(), startDate.getMonth() + i, startDay);
    const endMonth = currentStartDate.getMonth() + 1;
    const endYear = currentStartDate.getFullYear() + (endMonth > 11 ? 1 : 0);
    const endMonthAdjusted = endMonth > 11 ? 0 : endMonth;

    let endDay = startDay;
    const lastDayOfEndMonth = new Date(endYear, endMonthAdjusted + 1, 0).getDate();
    if (endDay > lastDayOfEndMonth) {
      endDay = lastDayOfEndMonth;
    }

    const endDate = new Date(endYear, endMonthAdjusted, endDay);

    let currentDate = new Date(currentStartDate);
    while (currentDate <= endDate) {
      if (currentDate.getDay() === dayOfWeek) {
        sessions++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }

  console.log(`Số buổi trong ${quantity} tháng: ${sessions}`);
  return sessions;
};

// Tính số buổi trong năm
const getSessionsInYear = (date: Date, quantity: number) => {
  const startDate = new Date(date);
  const dayOfWeek = startDate.getDay();
  let sessions = 52;
  return sessions * quantity;
};

// Tính giá cho một booking
const calculatePrice = (booking: Booking, index: number) => {
  const startTime = booking.startTime ? new Date(booking.startTime) : null;
  const endTime = booking.endTime ? new Date(booking.endTime) : null;
  const date = bookingDates.value[index];
  let hours = 0;

  if (startTime && endTime) {
    hours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
  } else {
    console.log(`Booking ${index} thiếu thời gian: startTime=${booking.startTime}, endTime=${booking.endTime}`);
    return 0;
  }

  const rentCost = store_court.chill_detail?.rentCost || 0;
  const fixedRentCost = store_court.chill_detail?.fixedRentCost || 0;

  const type = Number(booking.type);
  console.log(`Booking ${index} - hours: ${hours}, type: ${type} (raw: ${booking.type}), quantity: ${booking.quantity}, rentCost: ${rentCost}, fixedRentCost: ${fixedRentCost}`);

  switch (type) {
    case 0:
      if (booking.quantity >= 3) {
        return hours * fixedRentCost * booking.quantity;
      } else {
        return hours * rentCost * booking.quantity;
      }
    case 1:
      return hours * fixedRentCost * booking.quantity;
    case 2:
      if (!date) return 0;
      return hours * fixedRentCost * getSessionsInMonth(date, booking.quantity);
    case 3:
      if (!date) return 0;
      return hours * fixedRentCost * getSessionsInYear(date, booking.quantity);
    default:
      console.log(`Booking ${index} - Loại không hợp lệ: ${type}`);
      return 0;
  }
};

// Tạo danh sách các lịch từ booking
const generateBookingEvents = (booking: Booking) => {
  const result: { start: string; end: string }[] = [];
  const startDate = new Date(booking.startTime);
  const endDate = new Date(booking.endTime);

  // Đảm bảo startDate và endDate là UTC
  console.log('Start UTC:', startDate.toISOString(), 'End UTC:', endDate.toISOString());

  if (booking.type === 0) {
    for (let i = 0; i < booking.quantity; i++) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      start.setDate(start.getDate() + i);
      end.setDate(end.getDate() + i);

      result.push({
        start: start.toISOString(),
        end: end.toISOString(),
      });
    }
  } else if (booking.type === 1) {
    for (let i = 0; i < booking.quantity; i++) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      start.setDate(start.getDate() + i * 7);
      end.setDate(end.getDate() + i * 7);

      result.push({
        start: start.toISOString(),
        end: end.toISOString(),
      });
    }
  } else if (booking.type === 2) {
    const dayOfWeek = startDate.getDay();
    const endLimit = new Date(startDate);
    endLimit.setMonth(endLimit.getMonth() + booking.quantity);

    let currentDate = new Date(startDate);

    while (currentDate <= endLimit) {
      if (currentDate.getDay() === dayOfWeek) {
        const start = new Date(currentDate);
        const end = new Date(currentDate.getTime() + (endDate.getTime() - startDate.getTime()));

        result.push({
          start: start.toISOString(),
          end: end.toISOString(),
        });
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
  } else if (booking.type === 3) {
    const dayOfWeek = startDate.getDay();
    const endLimit = new Date(startDate);
    endLimit.setFullYear(endLimit.getFullYear() + booking.quantity);

    let currentDate = new Date(startDate);

    while (currentDate <= endLimit) {
      if (currentDate.getDay() === dayOfWeek) {
        const start = new Date(currentDate);
        const end = new Date(currentDate.getTime() + (endDate.getTime() - startDate.getTime()));

        result.push({
          start: start.toISOString(),
          end: end.toISOString(),
        });
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }

  return result;
};

// Kiểm tra trùng lịch
const checkOverlap = (newEvents :any , childCourtId :any) => {
  console.log('DEBUG: Checking overlap for childCourtId:', childCourtId);
  console.log('DEBUG: New Events:', JSON.stringify(newEvents, null, 2));

  // Hàm chuyển đổi thời gian UTC sang giờ địa phương Asia/Ho_Chi_Minh
  const toLocalTime = (utcDateString :any) => {
    const utcDate = new Date(utcDateString);
    // Tạo chuỗi thời gian địa phương mà không để trình duyệt thêm offset
    const localDate = new Date(utcDate.toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }));
    return localDate;
  };

  if (!Array.isArray(store.events_list)) {
    console.error('ERROR: store.events_list is not an array:', store.events_list);
    return { isOverlap: false };
  }

  for (const newEvent of newEvents) {
    const newStart = new Date(newEvent.start).getTime();
    const newEnd = new Date(newEvent.end).getTime();
    const newStartLocal = toLocalTime(newEvent.start).getTime();
    const newEndLocal = toLocalTime(newEvent.end).getTime();
    console.log(
      `DEBUG: New Event (UTC): ${newEvent.start} to ${newEvent.end}`,
      `| Local: ${toLocalTime(newEvent.start).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })} to ${toLocalTime(newEvent.end).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}`
    );

    for (const existingEvent of store.events_list) {
      const eventChildCourtId = existingEvent.childCourtId !== undefined ? existingEvent.childCourtId : childCourtId;
      if (eventChildCourtId === childCourtId) {
        const existingStartLocal = toLocalTime(existingEvent.start).getTime();
        const existingEndLocal = toLocalTime(existingEvent.end).getTime();
        console.log(
          `DEBUG: Existing Event (UTC): ${existingEvent.start} to ${existingEvent.end}`,
          `| Local: ${toLocalTime(existingEvent.start).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })} to ${toLocalTime(existingEvent.end).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}`,
          `| childCourtId: ${eventChildCourtId}`
        );
        console.log(
          `DEBUG: Comparing - newStartLocal: ${newStartLocal} < existingEndLocal: ${existingEndLocal} = ${newStartLocal < existingEndLocal}`,
          `| newEndLocal: ${newEndLocal} > existingStartLocal: ${existingStartLocal} = ${newEndLocal > existingStartLocal}`
        );

        if (newStartLocal < existingEndLocal && newEndLocal > existingStartLocal) {
          console.log('DEBUG: Overlap found:', JSON.stringify(existingEvent, null, 2));
          return {
            isOverlap: true,
            conflictingEvent: existingEvent,
          };
        }
      }
    }
  }
  console.log('DEBUG: No overlap found');
  return { isOverlap: false };
};

// Cập nhật giá khi chọn sân con
const updatePrice = () => {
  const selectedCourt = store_court.list_chill_court.find(
    (court) => court.id === selectedChildCourt.value
  );
  store_court.chill_detail = selectedCourt;
  bookings.value.forEach((booking, index) => {
    booking.childCourtId = selectedCourt?.id || 0;
    booking.price = calculatePrice(booking, index);
    console.log(`Cập nhật giá sau chọn sân con - Booking ${index}: ${booking.price}`);
  });
};

// Cập nhật giá cho một booking cụ thể
const updatePriceForBooking = (index: number) => {
  const booking = bookings.value[index];
  booking.price = calculatePrice(booking, index);
  console.log(`Cập nhật giá cho booking ${index}: ${booking.price}`);
  if (booking.price === 0 && booking.startTime && booking.endTime) {
    console.warn(`Cảnh báo: Giá bằng 0 cho booking ${index} dù có thời gian. Kiểm tra loại hoặc giá sân.`);
  }
};

const formatDate = (date: Date | null) => {
  return date ? new Date(date).toLocaleDateString('vi-VN') : '';
};

const minStartTime = (index: number) => {
  const selectedDate = bookingDates.value[index];
  if (!selectedDate) return '';
  const now = new Date();
  const selected = new Date(selectedDate);
  if (
    selected.getFullYear() === now.getFullYear() &&
    selected.getMonth() === now.getMonth() &&
    selected.getDate() === now.getDate()
  ) {
    const hours = String(Math.ceil(now.getHours())).padStart(2, '0');
    return `${hours}:00`;
  }
  return '00:00';
};

const updateDayInfo = (index: number) => {
  const date = bookingDates.value[index];
  if (date) {
    bookingDayInfo.value[index] = new Date(date).toLocaleDateString('vi-VN', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    updateBookingTimes(index);
  } else {
    bookingDayInfo.value[index] = '';
  }
};

const validateQuantity = (index: number) => {
  const booking = bookings.value[index];
  if (Number(booking.type) === 1 && booking.quantity <= 2) {
    booking.quantity = 3;
    alert('Số lượng cho kiểu "Tuần" phải lớn hơn 2.');
  }
  updatePriceForBooking(index);
};

watch(
  () => bookings.value.map(b => b.type),
  (newTypes, oldTypes) => {
    bookings.value.forEach((booking, index) => {
      if (Number(newTypes[index]) === 1 && booking.quantity <= 2) {
        booking.quantity = 3;
        alert(`Booking ${index + 1}: Số lượng cho kiểu "Tuần" phải lớn hơn 2.`);
      }
      updatePriceForBooking(index);
    });
  },
  { deep: true }
);

const updateBookingTimes = (index: number) => {
  const date = bookingDates.value[index];
  console.log(`DEBUG: bookingDates[${index}]:`, date ? new Date(date).toLocaleString('vi-VN') : null);
  if (!date) {
    bookings.value[index].startTime = '';
    bookings.value[index].endTime = '';
    updatePriceForBooking(index);
    return;
  }

  const now = new Date();
  let startDate: Date | null = null;
  let endDate: Date | null = null;

  const baseDate = new Date(date);
  baseDate.setHours(0, 0, 0, 0);

  if (bookingStartTimes.value[index]) {
    const [hours, minutes] = bookingStartTimes.value[index].split(':');
    console.log(`DEBUG: Đầu vào giờ bắt đầu [${index}]: ${bookingStartTimes.value[index]}`);
    if (minutes !== '00') {
      alert('Vui lòng chọn thời gian chẵn (không có phút).');
      bookingStartTimes.value[index] = '';
      bookings.value[index].startTime = '';
      updatePriceForBooking(index);
      return;
    }

    startDate = new Date(baseDate);
    startDate.setHours(parseInt(hours), 0, 0, 0);

    // Chuyển sang UTC: trừ 7 giờ (Asia/Ho_Chi_Minh = +7 giờ)
    startDate.setHours(startDate.getHours() - 7);

    if (startDate.getTime() <= now.getTime()) {
      alert('Thời gian bắt đầu phải muộn hơn thời gian hiện tại!');
      bookingStartTimes.value[index] = '';
      bookings.value[index].startTime = '';
      updatePriceForBooking(index);
      return;
    }

    bookings.value[index].startTime = startDate.toISOString();
    console.log(
      `DEBUG: Giờ bắt đầu đã xử lý [${index}]: ${bookingStartTimes.value[index]} -> ${bookings.value[index].startTime} (UTC)`,
      `| Local: ${new Date(bookings.value[index].startTime).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}`
    );
  } else {
    bookings.value[index].startTime = '';
  }

  if (bookingStartTimes.value[index] && bookingEndTimes.value[index]) {
    const [hours, minutes] = bookingEndTimes.value[index].split(':');
    console.log(`DEBUG: Đầu vào giờ kết thúc [${index}]: ${bookingEndTimes.value[index]}`);
    if (minutes !== '00') {
      alert('Vui lòng chọn thời gian chẵn (không có phút).');
      bookingEndTimes.value[index] = '';
      bookings.value[index].endTime = '';
      updatePriceForBooking(index);
      return;
    }

    endDate = new Date(baseDate);
    endDate.setHours(parseInt(hours), 0, 0, 0);

    // Chuyển sang UTC: trừ 7 giờ
    endDate.setHours(endDate.getHours() - 7);

    if (endDate.getTime() <= now.getTime()) {
      alert('Thời gian kết thúc phải muộn hơn thời gian hiện tại!');
      bookingEndTimes.value[index] = '';
      bookings.value[index].endTime = '';
      updatePriceForBooking(index);
      return;
    }

    if (startDate && endDate) {
      const timeDiff = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
      if (timeDiff < 1) {
        alert('Thời gian kết thúc phải muộn hơn thời gian bắt đầu ít nhất 1 giờ!');
        bookingEndTimes.value[index] = '';
        bookings.value[index].endTime = '';
        updatePriceForBooking(index);
        return;
      }
    }

    bookings.value[index].endTime = endDate.toISOString();
    console.log(
      `DEBUG: Giờ kết thúc đã xử lý [${index}]: ${bookingEndTimes.value[index]} -> ${bookings.value[index].endTime} (UTC)`,
      `| Local: ${new Date(bookings.value[index].endTime).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}`
    );
  } else {
    bookings.value[index].endTime = '';
  }

  updatePriceForBooking(index);
};

const addBookingRow = () => {
  bookings.value.push({
  id: 99,
  userId: 1,
  childCourtId: 0,
  childCourtName: '',
  courtDistrict: '',
  courtId: 0,
  courtName: '',
  courtStreet: '',
  courtWard: '',
  createDate: '',
  startTime: '',
  endTime: '',
  status: 0,
  price: 0,
  type: 0,
  quantity: 1,
  userFullName: '',
  userPhoneNumber: '',
});
  bookingDates.value.push(null);
  bookingDayInfo.value.push('');
  bookingStartTimes.value.push('');
  bookingEndTimes.value.push('');
};

const removeBookingRow = (index: number) => {
  if (bookings.value.length > 1) {
    bookings.value.splice(index, 1);
    bookingDates.value.splice(index, 1);
    bookingDayInfo.value.splice(index, 1);
    bookingStartTimes.value.splice(index, 1);
    bookingEndTimes.value.splice(index, 1);
  }
};

const confirmBooking = () => {
  // Log toàn bộ store.events_list và bookings.value
  console.log('DEBUG: store.events_list:', JSON.stringify(store.events_list, null, 2));
  console.log('DEBUG: bookings.value:', JSON.stringify(bookings.value, null, 2));

  for (let i = 0; i < bookings.value.length; i++) {
    const booking = bookings.value[i];

    // Log childCourtId của booking
    console.log(`DEBUG: Booking ${i + 1} childCourtId:`, booking.childCourtId);

    if (Number(booking.type) === 1 && booking.quantity <= 2) {
      alert(`Booking ${i + 1}: Số lượng cho kiểu "Tuần" phải lớn hơn 2.`);
      return;
    }

    if (!booking.startTime || !booking.endTime) {
      alert(`Booking ${i + 1}: Vui lòng nhập đầy đủ thời gian bắt đầu và kết thúc.`);
      return;
    }

    // Log sự kiện được tạo từ generateBookingEvents
    const newEvents = generateBookingEvents(booking);
    console.log(`DEBUG: New Events for Booking ${i + 1}:`, JSON.stringify(newEvents, null, 2));

    const overlapResult = checkOverlap(newEvents, booking.childCourtId);
    if (overlapResult.isOverlap) {
      const conflict = overlapResult.conflictingEvent;
      alert(
        `Booking ${i + 1}: Lịch bị trùng với lịch hiện có từ ${new Date(conflict.start).toLocaleString(
          'vi-VN'
        )} đến ${new Date(conflict.end).toLocaleString('vi-VN')}. Vui lòng chọn thời gian khác.`
      );
      return;
    }
  }

  alert(
    'Đặt lịch thành công! Dữ liệu: ' +
      JSON.stringify(
        {
          courtName: store_court.court_detail?.courtName,
          childCourt: selectedChildCourt.value,
          bookings: bookings.value,
        },
        null,
        2
      )
  );

  console.log('DEBUG: Final bookings:', bookings.value);
  store.bookings = bookings.value;
  router.push('/Boking');
};

function goToDetail() {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push('/detail');
  }
}
</script>