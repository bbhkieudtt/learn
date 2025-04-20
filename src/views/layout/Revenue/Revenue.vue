<template>
    <div class="h-dvh w-dvw  flex flex-col overflow-hidden  ">
        <header class="bg-green px-3 py-4 flex flex-col gap-5">
            <div class="flex  justify-between text-xl font-medium text-white">
              
                <img  @click="goHome" :src="logoPick" alt="Logo" class="w-10 h-10 rounded-full">
                <p>
                    Thống kê doanh thu
                </p>
                <p>

                </p>
            </div>
            <!--  -->
            <div class="grid grid-cols-2 gap-8">
                <div class="flex items-center justify-between text-lg cursor-pointer button rounded-md ">
                    <List_Yard></List_Yard>
                </div>
                <!--  -->
                <!--  -->
                <div class="flex items-center justify-between text-lg cursor-pointer button rounded-md ">
                    <TimeFilter></TimeFilter>
                </div>
            </div>
        </header>
        <!--  -->
        <main class="flex flex-col h-full pt-7 gap-5">
            <h4 class="items-center flex justify-center text-xl font-semibold text-green-900">
                Thống kê sân 
  từ ngày {{ formatDate(store.storeDate?.[0]) }} 
  đến ngày {{ formatDate(store.storeDate?.[1]) }}

            </h4>
            <!--  -->

            <table v-if="list_chill" class="min-w-full h-full bg-white border-separate border border-green-800 rounded-lg shadow-lg">
                <thead>
                    <tr class="bg-green-800 text-white">
                        <th class="py-3 px-6 text-left border-r border-gray-200">Sân</th>
                        <th class="py-3 px-6 text-left border-r border-gray-200">Tổng lịch đặt</th>
                        <th class="py-3 px-6 text-left">Tổng tiền</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- Use v-for to loop through the items in the data array -->
                    <tr v-for="(item, index) in courtsWithBookingInfo" :key="index"
                        class="hover:bg-green-50 border-b border-gray-200">
                        <td class="py-3 px-6 border-r border-gray-200">{{ item.name }}</td>
                        <td class="py-3 px-6 border-r border-gray-200">{{ item.total_boking }}</td>
                        <td class="py-3 px-6 border-r border-gray-200">{{ item.total_price }}</td>
                    </tr>
                </tbody>
            </table>
            <!--  -->
            <div
                class="flex-shrink-0 flex justify-end px-7 text-xl shadow-sm gap-1.5 text-green-900 font-bold pt-2 pb-4 text">
                <CurrencyDollarIcon class="w-7 h-7 text-yellow-700"></CurrencyDollarIcon>
                <p>Tổng doanh thu: <span class="font-bold"> {{ formatCurrency(totalPriceAllCourts) }}</span></p>
            </div>
        </main>


    </div>
    <!--  -->
    <Modal v-if="store.show_modal" :close="showModal">
        <template #content>
            <div class="w-[300px] h-[300px]">
               
                <VueDatePicker class="w-full h-full" v-model="store.storeDate" :inline="true" auto-apply locale="vi" range  >
                </VueDatePicker>
            </div>
        </template>
    </Modal>


</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/appStore'
import logoPick from"@/assets/imgs/logoPick.png"

/**icon*/
import { ArrowLeftIcon, CurrencyDollarIcon } from "@heroicons/vue/24/solid";

/***/
import List_Yard from './List_Yard.vue';
import TimeFilter from '../FilterYard/TimeFilter.vue';

/**Kho lưu trữ*/
import { useAppStoreCourt } from '@/stores/appStoreCourt'

/**Modal*/
import Modal from "@/components/Modal/Modal.vue"

/**api*/
import { apiGetChillCourt } from "@/service/api/apiChillCourt";
/**api*/
import { apiGetListBooking } from "@/service/api/apiBoking";

/**kiểu dữ liệu*/
import type {CourtEvent } from '@/interface'


/**Biến router */
const router = useRouter()

const store = useAppStore()
/**biến store*/
const store_court = useAppStoreCourt()




const list_boking = ref<CourtEvent[]>([])

onMounted(async () => {

    await getChillCourt()

    await getListBoking()

    const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0); // ngày cuối tháng

  store.storeDate = [startOfMonth, endOfMonth];

})

const list_chill = computed(() => {
  // Kiểm tra nếu list_chill_court không phải là null hoặc undefined
  return store_court.list_chill_court ? store_court.list_chill_court.filter(court => court.courtId === store_court.court_detail?.id) : [];
});

// 
const courtsWithBookingInfo = computed(() => {
  const listChillArray = list_chill.value || [];
  const listBokingArray = list_boking.value || [];
  const dateRange = store.storeDate || []; // store.date = [start, end]

  const today = new Date(); // ngày hôm nay

  if (listChillArray.length === 0) return [];

  return listChillArray.map(child => {
    const bookingsForCourt = listBokingArray.filter(booking => {
      const bookingTime = new Date(booking.startTime);
      
      // Điều kiện lọc
      const isCorrectCourt = booking.childCourtId === child.id;
      const isStatus2 = booking.status === 2;
      const isAfterToday = bookingTime <= today;

      // Kiểm tra có chọn khoảng ngày không
      const inDateRange = Array.isArray(dateRange) && dateRange.length === 2
        ? bookingTime >= new Date(dateRange[0]) && bookingTime <= new Date(dateRange[1])
        : true; // nếu không chọn ngày thì lấy tất

      return isCorrectCourt && isStatus2 && isAfterToday && inDateRange;
    });

    const total_boking = bookingsForCourt.length;
    const total_price = bookingsForCourt.reduce((sum, booking) => sum + booking.price, 0);

    return {
      name: child.childCourtName,
      total_boking,
      total_price,
    };
  });
});


const totalPriceAllCourts = computed(() => {
  return courtsWithBookingInfo.value.reduce((sum, court) => sum + court.total_price, 0);
});





/**hàm đóng modal*/
function showModal() {
    store.show_modal = false;
}

/**Hàm trở về trang chủ*/
function goHome() {
    router.push('/main');
}

/**Hàm lấy danh sách sân con thuộc sân này*/
async function getChillCourt() {
    try {
        const response = await apiGetChillCourt();
        console.log("API Response:", response);
        // Kiểm tra nếu API trả về thành công
        if (response && response.status === 200) {
            store_court.list_chill_court = response.data
            console.log('store_court.list_chill_court',store_court.list_chill_court);
            

        } else {
            // toast("Đăng ký thất bại, vui lòng thử lại!", { autoClose: 5000 });
        }
    } catch (error) {
        console.error("API Error:", error);
    }
}

/**Hàm lấy danh sách lịch đặt sân */
async function getListBoking() {
    try {
        const response = await apiGetListBooking();



        if (response && response.status === 200) {
            // lấy ra những lịch thuê của người này
            list_boking.value = response.data
            console.log('list_boking.value',list_boking.value);
            

        }

    } catch (error) {
        console.error("API Error:", error);
    }
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(value);
};

function formatDate(date: Date | undefined) {
  if (!date) return '';
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}




</script>
