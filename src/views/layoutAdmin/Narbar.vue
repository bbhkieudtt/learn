<template>
    <div class="w-full bg-green flex flex-shrink-0  gap-8 backdrop-blur-lg px-20  ">
      <ul class="w-full justify-between flex  ">
          <li @click="goItem(item.id)"  v-for="item in list_menu" class="flex cursor-pointer flex-col  items-center gap-1  p-1 rounded-[20px]">
              <img :src="item.icon_menu" :class="{'border-white':item.id ===1 , 'border':item.id===1 }" class="h-[45px] w-[45px] hover:border hover:border-white p-1 rounded-lg" :alt="item.name_menu">
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
  import employee from '@/assets/imgs/icon/employee.png'
  import lich from '@/assets/imgs/icon/lich.png'

  
  
  /**Biến router */
  const router = useRouter()
  
  const store_court = useAppStoreCourt()
  
  /**biến*/
  const list_menu = ref([
      {
          id: 1,
          name_menu: "Danh sách sân",
          icon_menu: listsan,
          active_menu: false,
      },
      {
          id: 2,
          name_menu: "Doanh sách thanh toán",
          icon_menu: lich,
          active_menu: false,
      },
      {
          id: 3,
          name_menu: "Danh sách báo cáo",
          icon_menu: lichthue,
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
      console.log('id',id);
      
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
          router.push('/inforUse');
          console.log('11111');
          
      }
  
  } 
  
  
  </script>
  
  <style lang="scss" scoped></style>
  