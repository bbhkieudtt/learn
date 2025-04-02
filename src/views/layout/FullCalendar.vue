<template>
  <div>
    <FullCalendar class="demo-app-calendar" ref="calendarRef" :options="calendarOptions" />
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect, watch } from "vue";
import { useAppStore } from '@/stores/appStore'

/**Biến thư viện */
import type { CalendarOptions, DateSelectArg, CalendarApi } from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import viLocale from "@fullcalendar/core/locales/vi";


/**biến store*/
const store = useAppStore()

// Tạo tham chiếu đến Calendar
const calendarRef = ref<InstanceType<typeof FullCalendar> | null>(null);

// Xử lý khi chọn ngày để thêm sự kiện
const handleDateSelect = (selectInfo: DateSelectArg) => {
  console.log('selectInfo', selectInfo);

  store.add_boking = false
  store.selectInfo = selectInfo
};

// Cấu hình FullCalendar
const calendarOptions: CalendarOptions = {
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  locale: viLocale,
  headerToolbar: {
    left: "prev,next today",
    center: "title",
    right: "dayGridMonth,timeGridWeek,timeGridDay",
  },
  initialView: "dayGridMonth",
  editable: true,
  selectable: true, // Cho phép chọn ngày
  selectMirror: true,
  dayMaxEvents: true,
  weekends: true,
  select: handleDateSelect, // Bắt sự kiện khi chọn ngày
  events: store.list_event
};

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

/**Theo dõi sự thay đổi của biến store.add_boking*/

watchEffect(() => {
  console.log("watchEffect phát hiện thay đổi:", store.add_boking);
  if (store.add_boking) {
    if (store.info_client && calendarRef.value) {
      console.log('store.info_client', store.info_client);

      const calendarApi = calendarRef.value.getApi();
      calendarApi.unselect();
      const newEvent = {
        id: String(Date.now()),
        title: `${store.info_client?.name_client ?? "Không có tên"} - ${store.info_client?.phone_client ?? "Không có số"}`,
        start: store.selectInfo?.startStr,
        end: store.selectInfo?.endStr,
        allDay: store.selectInfo?.allDay,
      };
      store.list_event?.push(newEvent);
      calendarApi.addEvent(newEvent);

    }

  }
});



</script>
