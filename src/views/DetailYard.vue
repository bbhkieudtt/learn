<template>
  <div class="w-dvw h-dvh overflow-hidden flex flex-col">
    <header class="bg-green flex-shrink-0 flex flex-col gap-3 px-3 py-3">
      <!--  -->
      <div class="flex justify-between items-center">
        <IconBack class="w-6 h-6 text-white"></IconBack>
        <!--  -->
        <h3 class="text-2xl font-semibold text-white">Trạng thái sân</h3>
        <div class="flex gap-5">
          <IconSearch class="w-5 h-5 text-white"></IconSearch>
          <IconFilter class="w-5 h-5 text-white"></IconFilter>
        </div>
      </div>
      <!--  -->
      <div class="grid grid-cols-4 gap-3 ">
        <div class="flex gap-2 button rounded-md  ">
  
          <p class="text-sm ">Lịch thuê</p>
          <IconClock></IconClock>
        </div>
        <div class="flex gap-2 button rounded-md  ">
          <p>Khách thuê</p>
          <IconUser></IconUser>
        </div>
        <div class="flex gap-2 button rounded-md  ">
          <p>
            Số điện thoại
          </p>
          <IconPhone></IconPhone>
        </div>
        <div class="flex gap-2 button rounded-md  ">
          <p>27/2/2025</p>
        </div>
      </div>
      <!--  -->
      <div class="flex items-center justify-center gap-5">
        <div v-for="item in list_statistical" class="flex gap-2 items-center">
          <span :class="{
                    'bg-green-500': item.key === 2,
                    'bg-white': item.key === 1,
                    'bg-slate-400': item.key === 4,
                    'bg-orange-400': item.key === 3,
                }" class="w-7 h-7 rounded-md shadow-sm ">
          </span>
          <p class="text-sm font-medium text-slate-200">
            {{ item.status }}
          </p>
        </div>
      </div>
    </header>
    <main class="flex-1 py-2 h-full main overflow-hidden">
      <!-- <FullCalendar></FullCalendar> -->
      <DayPilotScheduler :config="config" ref="scheduler" />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref,onMounted } from "vue";

/**component*/
import FullCalendar from "./layout/FullCalendar.vue";

/**icon*/
import IconBack from "@/components/Icons/IconBack.vue";
import IconSearch from "@/components/Icons/IconSearch.vue";
import IconFilter from "@/components/Icons/IconFilter.vue";
/**icon menu*/
import IconClock from "@/components/Icons/IconClock.vue";
import IconUser from "@/components/Icons/IconUse.vue";
import IconPhone from "@/components/Icons/IconPhone.vue";




import { DayPilot, DayPilotScheduler } from 'daypilot-pro-vue';
const config = {
  timeHeaders: [
    { groupBy: "Day", format: "dddd, MMM d" },
    { groupBy: "Hour" }
  ],
  scale: "CellDuration",
  cellDuration: 30, // Chia thành 30 phút để có độ chi tiết tốt hơn
  startDate: DayPilot.Date.today(),
  days: 7, // Hiển thị cả tuần
  viewType: "Week", // Chuyển sang chế độ tuần
  businessBeginsHour: 0,
  businessEndsHour: 24,
  showNonBusiness: true,
  heightSpec: "Full", // Đảm bảo hiển thị đủ khung giờ

  timeRangeSelectedHandling: "Enabled",
  onTimeRangeSelected: async (args) => {
    const dp = args.control;
    const modal = await DayPilot.Modal.prompt("Create a new event:", "New Event");
    dp.clearSelection();
    if (modal.canceled) { return; }
    dp.events.add({
      start: args.start,
      end: args.end,
      id: DayPilot.guid(),
      resource: args.resource,
      text: modal.result
    });
  },
  eventMoveHandling: "Update",
  eventResizeHandling: "Update",
  eventDeleteHandling: "Update",
  eventClickHandling: "Disabled",
  treeEnabled: true,
  rowHeight: 40,
  resources: [
    { name: "Sân 1", id: "R1" },
    { name: "Sân 2", id: "R2" }
  ],
  events: [
    {
      id: DayPilot.guid(),
      start: DayPilot.Date.today().addHours(9),
      end: DayPilot.Date.today().addHours(11),
      resource: "R1",
      text: "Morning Meeting",
    },
    {
      id: DayPilot.guid(),
      start: DayPilot.Date.today().addHours(14),
      end: DayPilot.Date.today().addHours(16),
      resource: "R2",
      text: "Project Review",
    }
  ]
};



/**danh sách thống kê*/
const list_statistical = ref([
  {
    key: 1,
    status: "Trống"
  },
  {
    key: 2,
    status: "Lịch ngày"
  },
  {
    key: 3,
    status: "Lịch Tháng"
  },
  {
    key: 4,
    status: "Khóa"
  },
]);
</script>

<style lang="scss" scoped></style>
