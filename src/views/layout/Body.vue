<template>
  <div
    v-if="!show_list_yard"
    class="w-full h-full flex justify-center items-center"
  >
    <div class="flex flex-col gap-2 justify-center items-center">
      <img src="@/assets/imgs/image9.png" alt="" />
      <h3 class="text-2xl text-white font-bold">Chưa có sân nào</h3>
    </div>
  </div>
  <div v-else class="w-full h-full flex justify-center items-center px-5 py-2">
    <div class="grid grid-cols-5 gap-5">
      <div
      v-for="yard in list_yard"
      :key="yard.key" 
        class="px-3 py-2 flex flex-col gap-2 bg-white rounded-xl"
      >
        <img class="w-50 rounded-lg h-40" :src="yard.img" alt="ảnh sân" />
        <div class="flex flex-col g-1">
          <h3 class="text-sm font-medium text-back truncate">
            {{ yard.name_yard }}
          </h3>
          <StarRatings :rating="yard.evaluate" :starSize="30" :starSpacing="5" :isEditable="false" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
/**ảnh sân*/
import anh1 from "@/assets/imgs/bg_san.jpg";
import anh2 from "@/assets/imgs/bg_san1.jpg";
import anh3 from "@/assets/imgs/bg_san2.jpg";
import StarRatings from '@hbilal_9/vue3-star-ratings';

const ratings = ref(3);
/**biến*/
const show_list_yard = ref(true);
/**danh sách sân pickleball*/
const list_yard = ref([
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
    key: 2,
    name_yard: "Sân Pickleball Phương Nam",
    add_yard: "Phương Mai, Đống Đa, Hà Nội",
    img: anh2,
    status: "exhaust",
    evaluate: 5,
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
    key: 2,
    name_yard: "Sân Pickleball Phương Nam",
    add_yard: "Phương Mai, Đống Đa, Hà Nội",
    img: anh2,
    status: "exhaust",
    evaluate: 4.7,
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
]);
</script>
