<template>
  <div class="w-dvw h-dvh overflow-hidden flex flex-col">
    <header class="bg-green flex-shrink-0 flex flex-col gap-3 px-3 py-3">
      <!--  -->
      <div class="flex justify-between items-center">
        <IconBack @click="goToBack" class="w-6 cursor-pointer h-6 text-white"></IconBack>
        <!--  -->
        <h3 class="text-2xl font-semibold text-white">Trạng thái sân</h3>
        <div class="flex gap-5">
          <IconSearch class="w-5 h-5 text-white"></IconSearch>
          <IconFilter class="w-5 h-5 text-white"></IconFilter>
        </div>
      </div>
      <!--  -->
      <div class="grid grid-cols-4 gap-3 ">
        <div class="flex items-center justify-between text-lg cursor-pointer button rounded-md ">
          <p></p>
          <p>{{ formatCurrency(store_court.chill_detail?.rentCost) }}đ / 1giờ</p>
          <CurrencyDollarIcon class="w-5 h-5 text-white"></CurrencyDollarIcon>
        </div>
        <!--  -->
        <div class="flex cursor-pointer gap-2 button rounded-md  ">
          <ListYardSmall></ListYardSmall>
        </div>
        <!--  -->
        <div @click="goToInfo" class="flex items-center justify-between text-lg cursor-pointer button rounded-md ">
          <p></p>
          <p>
            Thông tin sân
          </p>
          <IconPhone></IconPhone>
        </div>
        <!--  -->
        <div @click="selectedTime" class="flex items-center justify-between text-lg cursor-pointer button rounded-md ">
          <p>

          </p>
          <p>{{ time_selected }}</p>
          <CalendarDateRangeIcon class="w-5 h-5 text-white"></CalendarDateRangeIcon>
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
    <!--  -->
    <main class="flex-1 py-2 h-full main overflow-hidden">
      <div v-if="list_child && list_child.length === 0" class="w-full h-full flex justify-center items-center">
        <div class="flex flex-col gap-2 justify-center items-center">
          <img src="@/assets/imgs/image9.png" alt="" />
          <h3 class="text-2xl text-green-800 font-bold">Chưa có sân con!</h3>
        </div>
      </div>
      <div v-else>
        <FullCalendar></FullCalendar>
      </div>
      <!--  -->

    </main>

    <button @click="goToBocking"
      class=" text-lg items-center z-50 font-semibold flex-shrink-0 absolute bottom-5 right-5 w-fit py-2 px-3 flex gap-1 rounded-lg bg-green-800 text-white">
      <ClipboardDocumentCheckIcon class="w-5 h-5 text-white"></ClipboardDocumentCheckIcon>
      Đặt sân
    </button>
    <button v-if="is_create" @click="createChillCourt"
      class=" text-lg items-center z-50 font-semibold flex-shrink-0 absolute bottom-5 left-5 w-fit py-2 px-3 flex gap-1 rounded-lg bg-yellow-600 text-white">
      <HeartIcon class="w-5 h-5 text-white"></HeartIcon>
      Tạo sân con
    </button>
  </div>
  <!--  -->
  <Modal v-if="show_modal" :close="showModal">
    <template #content>
      <div v-if="is_modal" class="w-[300px] h-[300px]">
        <VueDatePicker class="w-full h-full" @update:model-value="handleDate" v-model="store.date" :inline="true"
          auto-apply locale="vi" :day-names="customDayNames">
        </VueDatePicker>
      </div>
      <!-- modal tạo sân con -->
      <div v-else class="w-[700px] flex flex-col px-3 ">
        <header class="flex items-center border-b border-slate-300 py-2  justify-between">
          <p class="text-green-800 text-xl font-semibold">
            Tạo sân
          </p>
          <XMarkIcon @click="showModal" class="h-5 w-5 hover:bg-slate-300 rounded-lg "></XMarkIcon>
        </header>

        <body class="w-full grid py-2 gap-4 grid-cols-1">
          <div class="flex-col col-span-1 flex text-sm font-medium text-green-700">
            <!-- Nhập tên sân con -->
            <div class="flex flex-col gap-2  pb-5" :class="{
              'opacity-50': activeInput !== 'addresss' && !chill_court.childCourtName
            }">
              <label class="font-semibold text-green-900" for="">Tên sân</label>
              <input v-model="chill_court.childCourtName" placeholder="Nhập tên sân  "
                class="w-full px-3 py-2 outline-none rounded-md border border-green-600" type="text"
                @focus="setActive('addresss')" @blur="removeActive" />
            </div>

            <el-form :size="formSize" label-position="top">
              <!-- Nhập giá tối thiểu -->
              <el-form-item label="Giá thuê sân từ (VNĐ/giờ)">
                <el-input v-model.number="chill_court.rentCost" placeholder="Nhập giá tối thiểu"
                  :formatter="formatCurrency" :parser="parseCurrency" size="large" />
              </el-form-item>

              <!-- Chọn loại sân -->
              <el-form-item label="Chọn loại sân">
                <el-select v-model="chill_court.position" placeholder="Chọn loại sân">
                  <el-option v-for="type in type_court" :key="type.id" :label="type.name_type" :value="type.name_type" />
                </el-select>
              </el-form-item>
            </el-form>


            <!--Mô tả  -->
            <div class="w-full flex flex-col mt-5 gap-1.5">
              <label class="text-sm font-medium text-slate-700" for="">Mô tả sân</label>
              <textarea name="" v-model="chill_court.childCourtDescription"
                class="p-2 rounded-lg border border-slate-300" id=""></textarea>

            </div>
          </div>
        </body>
        <!--  -->
        <footer class="w-full flex justify-end py-2 px-3 border-t border-slate-300">
          <button @click="createCourt"
            class="px-3 py-2 bg-yellow-500 text-sm font-semibold text-white rounded-lg w-fit">
            Tạo mới sân con
          </button>
        </footer>

      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useAppStore } from '@/stores/appStore'
import { useAppStoreCourt } from '@/stores/appStoreCourt'
import { useRouter } from 'vue-router'

/**api*/
import { apiGetChillCourt,apiCreateChillCourt } from "@/service/api/apiChillCourt";

/**Modal*/
import Modal from "@/components/Modal/Modal.vue"

/**component*/
import FullCalendar from "./layout/FullCalendar.vue";

/**filter*/
import ListYardSmall from "./layout/DatailYard/ListYardSmall.vue";

/**icon*/
import { } from "@heroicons/vue/24/outline";
// 
import { ClipboardDocumentCheckIcon, XMarkIcon, CalendarDateRangeIcon, HeartIcon, CurrencyDollarIcon } from "@heroicons/vue/24/solid";
import IconBack from "@/components/Icons/IconBack.vue";
import IconSearch from "@/components/Icons/IconSearch.vue";
import IconFilter from "@/components/Icons/IconFilter.vue";

/**icon menu*/
import IconClock from "@/components/Icons/IconClock.vue";
import IconPhone from "@/components/Icons/IconPhone.vue";

/**toast*/
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const store = useAppStore()

const store_court = useAppStoreCourt()

const formSize = ref("large")

/**Biến Id sân được chọn */
const id_Court = store_court.court_detail?.id ?? 0

/**Format hiển thị thứ trong tuần trên lịch*/
const customDayNames = [
  'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'
];

/**Biến kiểm tra xem mở modal nào */
const is_modal = ref(true)

// Lấy userInfo từ localStorage
const userInfo = JSON.parse(localStorage.getItem("userInfo") || 'null');


// biến check có hiện nút tạo sân con k 
const is_create = computed(() => {
  return userInfo && store_court.court_detail?.userId === userInfo.id
})


/**Biến router */
const router = useRouter()

/**biến mở modal tìm kiếm sân theo địa chỉ*/
const show_modal = ref(false);

/**Thông tin sân con*/
const chill_court = ref({
  courtId: id_Court,
  childCourtName: '',
  childCourtDescription: '',
  position: '',
  rentCost: 0
})

/**Loại sân*/
const type_court = ref([
  {
    id: 1,
    name_type: 'Sân Vip'
  },
  {
    id: 12,
    name_type: 'Sân Thường'
  }
])

/**Lưu ô input nào đang được focus*/
const activeInput = ref('');

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

const list_child = computed(() => {
  if (!Array.isArray(store_court.list_chill_court)) return [];
  return store_court.list_chill_court.filter(child => child.courtId === id_Court)
})



 onMounted( async() => {
  //  Lấy danh sách sân con thuộc sân này
 await getChillCourt()
  console.log('list_child',list_child);
  

  store_court.chill_detail = list_child.value[0];
  console.log(list_child.value[0]);
  


})



// Định dạng số thành tiền VND
const formatCurrency = (value: any) => {
  if (value === null || value === undefined || value === "") return ""; // Cho phép xóa hết số
  return new Intl.NumberFormat("vi-VN").format(value);
};

// Chuyển chuỗi tiền tệ về số khi nhập
const parseCurrency = (value: any) => {
  const cleanedValue = value.replace(/[^\d]/g, ""); // Xóa tất cả ký tự không phải số
  return cleanedValue ? Number(cleanedValue) : null; // Nếu xóa hết, trả về null
};

/**Biến giá trị thời gian*/
// Dùng computed để tự động tính toán giá trị time_selected
const time_selected = computed(() => {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(store.date);
});

/**hàm đóng modal*/
function showModal() {
  show_modal.value = false;
}

/**hàm hiển thị đặt lịch*/
function goToBocking() {
  router.push('/Boking')
}

/**Hàm quay trở lại trang chủ*/
function goToBack() {
  if(store_court.is_court === 'YourYard'){
    router.push('/YourYard');
  }
  if(store_court.is_court === 'home'){
  router.push('/main')
  }
}

/**Đi đến thông tin chi tiết sân*/
function goToInfo() {
  router.push('/Info')
}

/***/
function selectedTime() {
  is_modal.value = true
  show_modal.value = true;
}

/**Mở modal tạo sân con*/
function createChillCourt() {
  is_modal.value = false
  show_modal.value = true;
}

/***/
async function createCourt() {
  try {
    const response = await apiCreateChillCourt(chill_court.value);

    // Kiểm tra nếu API trả về thành công
    if (response && response.status === 200) {
      await getChillCourt()
      toast("Tạo sân con thành công!", { autoClose: 5000 });
      showModal()


    } else {
      toast("Đăng ký thất bại, vui lòng thử lại!", { autoClose: 5000 });
    }
  } catch (error) {
    console.error("API Error:", error);
  }
}


function handleDate() {
  //để ngăn chặn sự chuyển sang chế độ hiển thị ngày của lịch 

}

/***/
const setActive = (field: string) => {
  activeInput.value = field;
};

/***/
const removeActive = () => {
  activeInput.value = '';
};

/**Hàm lấy danh sách sân con thuộc sân này*/
async function getChillCourt() {
  try {
    const response = await apiGetChillCourt();
    console.log("API Response:", response);
    // Kiểm tra nếu API trả về thành công
    if (response && response.status === 200) {
      store_court.list_chill_court = response.data

    } else {
      // toast("Đăng ký thất bại, vui lòng thử lại!", { autoClose: 5000 });
    }
  } catch (error) {
    console.error("API Error:", error);
  }
}



</script>

<style lang="scss" scoped></style>
