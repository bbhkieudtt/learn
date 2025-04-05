<template>
  <div class="w-full bg-green flex flex-shrink-0  gap-8 backdrop-blur-lg px-20  ">
    <ul class="w-full justify-between flex  ">
        <li @click="goItem(item.id)" v-for="item in list_menu" class="flex cursor-pointer flex-col  items-center gap-1  p-1 rounded-[20px]">
            <img :src="item.icon_menu" class="h-[45px] w-[45px]" :alt="item.name_menu">
            <!--  -->
            <p class="text-xl text-white font-medium">{{ item.name_menu }}</p>
        </li>
    </ul>
  </div>
</template>

<script setup lang="ts">

import{ref} from 'vue'
import { useRouter } from 'vue-router'
import { useAppStoreCourt } from '@/stores/appStoreCourt'

/**img icon*/ 
import ban from '@/assets/imgs/icon/ban.png'
import doanhthu from '@/assets/imgs/icon/doanhthu.png'
import lichthue from '@/assets/imgs/icon/lichthue.png'
import listsan from '@/assets/imgs/icon/listsan.png'
import sancuaban from '@/assets/imgs/icon/sancuaban.png'


/**Biến router */
const router = useRouter()

const store_court = useAppStoreCourt()

/**biến*/
const list_menu = ref([
    {
        id: 1,
        name_menu: "Đặt sân ",
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
        name_menu: "Lịch thuê của bạn",
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

/**Hàm chuyển hướng đến các trang*/
function goItem(id:number){
    if(id===1){
        router.push('/main');
    }
    // 
    if(id===2){
        router.push('/YourYard');
        store_court.is_court = 'YourYard'
    }
    // 
    if(id===3){
        router.push('/yourboking');
    }
    // 
    if(id===4){
        router.push('/revenue');
    }
    // 
    if(id===5){
        router.push('/main');
    }

} 


</script>

<style lang="scss" scoped></style>
