<template>
  <div class="w-96 h-full flex flex-col gap-8 backdrop-blur-lg px-6 py-5">
    <div class="flex justify-center items-center gap-10 rounded-xl py-1 w-full border  border-white ">
      <img src="@/assets/imgs/logoNo.png" class="w-[70px] h-[50px]" alt="" />
      <!--  -->
      <h2 class="text-2xl font-semibold text-white">Picklaball</h2>
    </div>
    <!--  -->
    <ul class="flex flex-col gap-8 ">
        <li v-for="item in list_menu" class="flex items-center gap-3 border bg-white border-white p-2 rounded-[20px]">
            <img :src="item.icon_menu" class="h-[55px] w-[55px]" :alt="item.name_menu">
            <!--  -->
            <p class="text-xl text-slate-900 font-medium">{{ item.name_menu }}</p>
        </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
/**img icon*/ 
import ban from '@/assets/imgs/icon/ban.png'
import doanhthu from '@/assets/imgs/icon/doanhthu.png'
import lichthue from '@/assets/imgs/icon/lichthue.png'
import listsan from '@/assets/imgs/icon/listsan.png'
import sancuaban from '@/assets/imgs/icon/sancuaban.png'
import { ref } from 'vue'

/**biến*/
const list_menu = ref([
    {
        id: 1,
        name_menu: "Danh sách sân Picklaball",
        icon_menu: listsan,
        active_menu: false,
    },
    {
        id: 2,
        name_menu: "Sân của tôi",
        icon_menu: sancuaban,
        active_menu: false,
    },
    {
        id: 3,
        name_menu: "Lịch thuê sân",
        icon_menu: lichthue,
        active_menu: false,
    },
    {
        id: 4,
        name_menu: "Doanh thu",
        icon_menu: doanhthu,
        active_menu: false,

    },
    {
        id: 5,
        name_menu: "Tài khoản của tôi",
        icon_menu: ban,
        active_menu: false,
        
    }
])


</script>

<style lang="scss" scoped></style>
