<template>
  <div class="h-full overflow-hidden">
    <FullCalendar class="demo-app-calendar" ref="calendarRef" :options="calendarOptions" />
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect, watch, onMounted, nextTick } from "vue";
import { useAppStore } from '@/stores/appStore'
import { useAppStoreCourt } from '@/stores/appStoreCourt'

/**Biến thư viện */
import type { CalendarOptions, DateSelectArg } from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import viLocale from "@fullcalendar/core/locales/vi";

/**api*/
import { apiGetListBooking } from "@/service/api/apiBoking";
import { log } from "async";

/**toast*/
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

import type {event_booking,Booking } from '@/interface'



/**biến store*/
const store = useAppStore()

const store_court = useAppStoreCourt()

// Tạo tham chiếu đến Calendar
const calendarRef = ref<InstanceType<typeof FullCalendar> | null>(null);

// Xử lý khi chọn ngày để thêm sự kiện
const handleDateSelect = (selectInfo: DateSelectArg) => {
  const startTime = selectInfo.start;
  const endTime = selectInfo.end;

  // Tính toán khoảng thời gian đã chọn (đơn vị: phút)
  const durationInMinutes = (endTime.getTime() - startTime.getTime()) / 60000;

  // Cho phép chọn tối thiểu 60 phút, và phải là bội số của 30 phút (30, 60, 90, 120, ...)
  if (durationInMinutes >= 60 && durationInMinutes % 30 === 0) {
    store.add_boking = false;
    store.selectInfo = selectInfo;
  } else {
    toast("Vui lòng chọn khoảng thời gian từ 1 tiếng trở lên và theo khung nửa giờ (ví dụ: 1 tiếng, 1 tiếng rưỡi...)", {
      autoClose: 5000,
    });
  }
};



// 
const calendarOptions: CalendarOptions = {
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  locale: viLocale,
  headerToolbar: {
    left: "prev,next today",
    center: "title",
    right: "dayGridMonth,timeGridWeek,timeGridDay",
  },
  initialView: "timeGridWeek",
  selectable: true, // Cho phép chọn ngày
  selectMirror: true,
  editable: false,
  dayMaxEvents: true,
  weekends: true,
  select: handleDateSelect, // Bắt sự kiện khi chọn ngày
  events: store.list_event,
  eventClick: (info) => {
    
    handleEventClick(info.event);
  },

  // 🔒 Không cho chọn khoảng thời gian trùng với event đã có
  selectAllow: (selectInfo) => {
    const selectedStart = selectInfo.start;
    const selectedEnd = selectInfo.end;

    // Kiểm tra nếu có giao nhau với sự kiện có sẵn
    const isAllowed = !store.list_event?.some((event: any) => {
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);
      return selectedStart < eventEnd && selectedEnd > eventStart;
    });

    return isAllowed ?? false; // Nếu isAllowed là undefined, trả về false
  }

};


// 
onMounted(async () => {
  await getListBoking()
  if (calendarRef.value) {
    const calendarApi = calendarRef.value.getApi();
    calendarApi.refetchEvents(); // Đảm bảo tải lại sự kiện
  }


})

watch(
  () => store.date,
  (newDate) => {
    if (newDate) {
      if (calendarRef.value) {
        const calendarApi = calendarRef.value.getApi();
        // proceed with using calendarApi

        calendarApi.gotoDate(newDate); // Điều hướng FullCalendar tới ngày mới
        calendarApi.changeView('timeGridDay'); // Chuyển FullCalendar sang chế độ "Ngày với giờ"
      }

    }
  }
);

watch(
  () => store.list_event,
  (newEvents) => {
    nextTick(() => {
      if (calendarRef.value) {
        const calendarApi = calendarRef.value.getApi();
        // Cập nhật lại events trong calendarOptions
        calendarApi.setOption('events', newEvents); // Cập nhật sự kiện trực tiếp từ list_event
      }
    });
  }
);

watch(
  () => store_court.chill_detail,
  (newDate) => {
    if (newDate) {
      getListBoking()
    }
  }
);


/**Hàm lấy danh sách lịch đặt sân */
async function getListBoking() {
  try {
    const response = await apiGetListBooking();

    // Kiểm tra nếu API trả về thành công
    if (response && response.status === 200) {
      console.log('response',response.data);
      
     
      // Biến đổi dữ liệu thành định dạng phù hợp với FullCalendar
      const events = transformToFullCalendar(response.data);

      store.events_list = events
 
      console.log('events', events);

      if (calendarRef.value) {

        store.list_event = events 

      }

    } else {
      // toast("Đăng ký thất bại, vui lòng thử lại!", { autoClose: 5000 });
    }
  } catch (error) {
    console.error("API Error:", error);
  }
}




/** Hàm biến đổi dữ liệu từ API thành định dạng FullCalendar */
function transformToFullCalendar(eventsData: Booking[]): event_booking[] {
  const result: event_booking[] = [];

  const filteredEvents = eventsData.filter(
    (event) =>
      event.childCourtId === store_court.chill_detail?.id &&
      (event.status === 5 || event.status === 2)
  );

  console.log('Filtered Events:', filteredEvents);

  filteredEvents.forEach((event) => {
    const title = event.userFullName
      ? `${event.userFullName} sđt: ${event.userPhoneNumber || 'N/A'} giá: ${event.price || 0}`
      : 'No User';

   const classNames =
      event.type === 0
        ? ['bg-green-500', 'text-white']
        : event.type === 1
        ? ['bg-blue-400', 'text-white']
        : event.type === 2
        ? ['bg-yellow-400', 'text-white']
        : event.type === 3
        ? ['bg-purple-400', 'text-white']
        : ['bg-slate-400', 'text-yellow-400'];

    if (event.type === 0) {
      for (let i = 0; i < event.quantity; i++) {
        console.log('event ngày', event);

        const start = new Date(event.startTime);
        const end = new Date(event.endTime);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
          console.warn(`Invalid date for event ${event.id}`);
          return;
        }

        start.setDate(start.getDate() + i);
        end.setDate(end.getDate() + i);

        result.push({
          id: `${event.id}-${i}`,
          start: start.toISOString(),
          end: end.toISOString(),
          title,
          classNames,
          description: `Booking ID: ${event.id}`,
          allDay: false,
        });
      }
    } else if (event.type === 1) {
      for (let i = 0; i < event.quantity; i++) {
        const start = new Date(event.startTime);
        const end = new Date(event.endTime);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
          console.warn(`Invalid date for event ${event.id}`);
          return;
        }

        start.setDate(start.getDate() + i * 7);
        end.setDate(end.getDate() + i * 7);

        result.push({
          id: `${event.id}-${i}`,
          start: start.toISOString(),
          end: end.toISOString(),
          title,
          classNames,
          description: `Booking ID: ${event.id}`,
          allDay: false,
        });
      }
    } else if (event.type === 2) {
      const startDate = new Date(event.startTime);
      const endDate = new Date(event.endTime);
      const dayOfWeek = startDate.getDay();

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        console.warn(`Invalid date for event ${event.id}`);
        return;
      }

      const endLimit = new Date(startDate);
      endLimit.setMonth(endLimit.getMonth() + event.quantity);

      let currentDate = new Date(startDate);

      while (currentDate <= endLimit) {
        if (currentDate.getDay() === dayOfWeek) {
          result.push({
            id: `${event.id}-${currentDate.getTime()}`,
            start: new Date(currentDate).toISOString(),
            end: new Date(currentDate.getTime() + (endDate.getTime() - startDate.getTime())).toISOString(),
            title,
            classNames,
            description: `Booking ID: ${event.id}`,
            allDay: false,
          });
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
    } else if (event.type === 3) {
      const startDate = new Date(event.startTime);
      const endDate = new Date(event.endTime);
      const dayOfWeek = startDate.getDay();

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        console.warn(`Invalid date for event ${event.id}`);
        return;
      }

      const endLimit = new Date(startDate);
      endLimit.setFullYear(endLimit.getFullYear() + event.quantity);

      let currentDate = new Date(startDate);

      while (currentDate <= endLimit) {
        if (currentDate.getDay() === dayOfWeek) {
          result.push({
            id: `${event.id}-${currentDate.getTime()}`,
            start: new Date(currentDate).toISOString(),
            end: new Date(currentDate.getTime() + (endDate.getTime() - startDate.getTime())).toISOString(),
            title,
            classNames,
            description: `Booking ID: ${event.id}`,
            allDay: false,
          });
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }
  });

  return result;
}

/**Hàm xử lý khi bấm vào một sự kiện*/
function handleEventClick(info: any) {

  store.boking_detail = info
  store.is_modal = 'detail'
  store.show_modals = true;

}




</script>
