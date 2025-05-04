<template>
  <div class="w-dvw h-dvh overflow-hidden flex flex-col">
    <header class="bg-green flex-shrink-0 flex flex-col gap-3 px-3 py-3">
      <!--  -->
      <div class="flex justify-between items-center">
        <img @click="goToBack" :src="logoPick" alt="Logo" class="w-10 h-10 rounded-full">
        <!--  -->
        <h3 class="text-2xl font-semibold text-white">Trạng thái sân: {{ store_court.court_detail?.courtName }}</h3>
        <div class="flex gap-5">

        </div>
      </div>
      <!--  -->
      <div class="grid grid-cols-5 gap-3 ">
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
        <div @click="goToListBoking"
          class="flex items-center justify-between text-lg cursor-pointer button rounded-md ">
          <p></p>
          <p>
            Danh sách lịch đặt sân
          </p>
          <IconPhone></IconPhone>
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
            'bg-blue-400': item.key === 3,
            'bg-yellow-400': item.key === 4,
            'bg-purple-400': item.key === 5,
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

    <button v-if="list_child && list_child.length > 0" @click="goToBocking"
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
  <Modal v-if="store.show_modals" :close="showModal">
    <template #content>
      <div v-if="store.is_modal === 'time'" class="w-[300px] h-[300px]">
        <VueDatePicker class="w-full h-full" @update:model-value="handleDate" v-model="store.date" :inline="true"
          auto-apply locale="vi" :day-names="customDayNames">
        </VueDatePicker>
      </div>
      <!-- modal tạo sân con -->
      <div v-if="store.is_modal === 'create'" class="w-[700px] flex flex-col px-3 ">
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
              <el-form-item label="Giá thuê sân vãng lại (VNĐ/giờ)">
                <el-input v-model.number="chill_court.rentCost" placeholder="Nhập giá thuê vãng lai"
                  :formatter="formatCurrency" :parser="parseCurrency" size="large" />
              </el-form-item>
              <!-- Nhập giá tối thiểu -->
              <el-form-item label="Giá thuê sân cố định (VNĐ/giờ)">
                <el-input v-model.number="chill_court.fixedRentCost" placeholder="Nhập giá thuê cố định"
                  :formatter="formatCurrency" :parser="parseCurrency" size="large" />
              </el-form-item>

              <!-- Chọn loại sân -->
              <el-form-item label="Chọn loại sân">
                <el-select v-model="chill_court.position" placeholder="Chọn loại sân">
                  <el-option v-for="type in type_court" :key="type.id" :label="type.name_type"
                    :value="type.name_type" />
                </el-select>
              </el-form-item>
            </el-form>

          </div>
        </body>
        <!--  -->
        <footer class="w-full flex justify-end py-2 px-3 border-t border-slate-300">
          <button @click="createCourtChill"
            class="px-3 py-2 bg-yellow-500 text-sm font-semibold text-white rounded-lg w-fit">
            Tạo mới sân con
          </button>
        </footer>

      </div>
      <!-- Modal hiện chi tiêt thông tin sự kiện  -->
      <div v-if="store.is_modal === 'detail'" class="w-[500px] flex flex-col px-3 ">
        <header class="flex items-center border-b border-slate-300 py-2  justify-between">
          <p class="text-green-800 text-xl font-semibold">
            Thông tin chi tiết lịch thuê
          </p>
          <XMarkIcon @click="showModal" class="h-5 w-5 hover:bg-slate-300 rounded-lg "></XMarkIcon>
        </header>

        <body class="w-full grid py-2 gap-4 grid-cols-1">
          <div class="flex-col col-span-1 gap-2 flex text-sm font-medium text-green-700">
            <!-- Thông tin sân -->
            <div class="flex gap-3 text-sm text-green-800">
              <p>
                Tên sân:
              </p>
              <p class="font-bold">
                {{ store_court.court_detail?.courtName }}
              </p>
            </div>
            <!-- Thông tin sân -->
            <div class="flex gap-3 text-sm text-green-800">
              <p>
                Sân con:
              </p>
              <p class="font-bold">
                {{ store_court.chill_detail?.childCourtName }}
              </p>
            </div>
            <div class="flex gap-3 text-sm text-green-800">
              <p>
                Địa chỉ:
              </p>
              <p class="font-bold">
                {{ address }}
              </p>
            </div>
            <div class="flex gap-3 text-sm text-green-800">
              <p>
                Thông tin lịch đặt:
              </p>
              <p v-if="store.boking_detail" class="font-bold">
                {{ store.boking_detail?.title }}
              </p>
            </div>
          </div>
        </body>
        <!--  -->
        <footer class="w-full flex justify-end py-2 px-3 border-t border-slate-300">
          <button @click="showModal" class="px-3 py-2 bg-slate-500 text-sm font-semibold text-white rounded-lg w-fit">
            Đóng
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
import { useRoute } from 'vue-router';

import logoPick from "@/assets/imgs/logoPick.png"

/**api*/
import { apiGetChillCourt, apiCreateChillCourt } from "@/service/api/apiChillCourt";
import { apiGetCourt } from "@/service/api/apiCourt";


/**Modal*/
import Modal from "@/components/Modal/Modal.vue"

/**component*/
import FullCalendar from "./layout/FullCalendar.vue";

/**filter*/
import ListYardSmall from "./layout/DatailYard/ListYardSmall.vue";


import { ClipboardDocumentCheckIcon, XMarkIcon, CalendarDateRangeIcon, HeartIcon, CurrencyDollarIcon } from "@heroicons/vue/24/solid";

/**kiểu dữ liệu*/
import type { Court } from '@/interface'
/**icon menu*/
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

const list_court = ref<Court[]>([]);



// Lấy userInfo từ localStorage
const userInfo = JSON.parse(localStorage.getItem("userInfo") || 'null');


// biến check có hiện nút tạo sân con k 
const is_create = computed(() => {
  return userInfo && store_court.court_detail?.userId === userInfo.id
})

const address = computed(() => {
  const detail = store_court.court_detail;

  if (!detail) return "";

  return `${detail.street}, ${detail.ward}, ${detail.district}, Hà Nội`;
});


/**Biến router */
const router = useRouter()



/**Thông tin sân con*/
const chill_court = ref({
  courtId: id_Court,
  childCourtName: '',
  childCourtDescription: '',
  position: '',
  rentCost: 0,
  fixedRentCost: 0
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
    status: "Lịch Tuần"
  },
  {
    key: 4,
    status: "Lịch Tháng"
  },
  {
    key: 5,
    status: "Lịch Năm"
  },
]);

const list_child = computed(() => {
  if (!Array.isArray(store_court.list_chill_court)) return [];
  return store_court.list_chill_court.filter(child => child.courtId === id_Court)
})

const route = useRoute();
const id = route.query.id;

onMounted(async () => {
  await getListCourt()
  //  Lấy danh sách sân con thuộc sân này
  await getChillCourt()

  // Nếu store chưa có dữ liệu court_detail, thì tìm từ danh sách
  if (!store_court.court_detail && id) {
    const court = list_court.value.find(c => String(c.id) === String(id));

    if (court) {
      store_court.court_detail = court;
    } else {
      // Nếu không tìm thấy thì có thể redirect hoặc báo lỗi
      console.warn("Không tìm thấy sân với ID:", id);
    }
  }

  store_court.chill_detail = list_child.value[0];
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
  store.show_modals = false;
}

/**hàm hiển thị đặt lịch*/
function goToBocking() {
  // console.log(store.selectInfo?.start);
  // console.log(new Date());


  // if (!store.selectInfo?.start) {
  //   toast("Chưa chọn thời gian đặt lịch", { autoClose: 3000 });

  //   return
  // }
  // if (store.selectInfo?.start < new Date()) {
  //   toast("Thời gian này đã qua, vui lòng chọn khoảng thời gian khác", { autoClose: 3000 });

  //   return
  // }
  // router.push('/Boking')
  // 
  router.push('/infobooking')


}

/**Hàm quay trở lại trang chủ*/
function goToBack() {
  console.log('11111');
  console.log(store_court.is_court);

  if (store_court.is_court === 'YourYard') {
    router.push('/YourYard');
  }
  if (store_court.is_court === 'home') {
    router.push('/main')
  }
}

/**Đi đến thông tin chi tiết sân*/
function goToInfo() {
  router.push('/Info')
}

/**Đi đến thông tin chi tiết sân*/
function goToListBoking() {
  router.push('/bokingCout')
}

/***/
function selectedTime() {
  store.is_modal = 'time'
  store.show_modals = true;
}

/**Mở modal tạo sân con*/
function createChillCourt() {
  store.is_modal = 'create'
  store.show_modals = true;
}

/***/
async function createCourtChill() {
  // Kiểm tra trùng tên sân con

  const childList = store_court?.court_detail?.childLst;

  const isDuplicate = Array.isArray(childList) && childList.length > 0
    ? childList.some(
      item => item.childCourtName.trim().toLowerCase() === chill_court.value.childCourtName.trim().toLowerCase()
    )
    : false;

  if (isDuplicate) {
    toast("Tên sân con đã tồn tại. Vui lòng chọn tên khác!", { autoClose: 5000 });
    return;
  }

  // Kiểm tra giá fixedRentCost phải nhỏ hơn rentCost
  const fixedCost = Number(chill_court.value.fixedRentCost);
  const rentCost = Number(chill_court.value.rentCost);

  if (isNaN(fixedCost) || isNaN(rentCost)) {
    toast("Giá thuê phải là số hợp lệ!", { autoClose: 5000 });
    return;
  }

  if (fixedCost >= rentCost) {
    toast("Giá thuê cố định phải nhỏ hơn giá thuê gốc!", { autoClose: 5000 });
    return;
  }

  // Nếu tất cả điều kiện hợp lệ, gọi API
  try {
    const response = await apiCreateChillCourt(chill_court.value);

    if (response && response.status === 200) {
      await getChillCourt();
      toast("Tạo sân con thành công!", { autoClose: 5000 });
      showModal();
    } else {
      toast("Đăng ký thất bại, vui lòng thử lại!", { autoClose: 5000 });
    }
  } catch (error) {
    console.error("API Error:", error);
    toast("Đã xảy ra lỗi trong quá trình tạo sân con!", { autoClose: 5000 });
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
      console.log('ktra', response.data);

      store_court.list_chill_court = response.data
      console.log('ktra', store_court.list_chill_court);

    } else {
      // toast("Đăng ký thất bại, vui lòng thử lại!", { autoClose: 5000 });
    }
  } catch (error) {
    console.error("API Error:", error);
  }
}

async function getListCourt() {
  try {
    const response = await apiGetCourt();

    // Kiểm tra nếu API trả về thành công
    if (response && response.status === 200) {
      list_court.value = response.data
    } else {
      // toast("Đăng ký thất bại, vui lòng thử lại!", { autoClose: 5000 });
    }
  } catch (error) {
    console.error("API Error:", error);
  }
}



</script>

<style lang="scss" scoped></style>
