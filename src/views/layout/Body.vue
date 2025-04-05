<template>
  <main class="flex flex-col flex-1 overflow-hidden">
    <header class="flex flex-shrink-0 px-3 justify-between">
      <div class="p-2">
        <div class="flex justify-center items-center gap-3 rounded-xl  w-fit ">
          <div class="px-3 py-5  rounded-full flex-shrink-0 bg-white">
            <img src="@/assets/imgs/logoNo.png" class="w-[70px] h-[50px]" alt="" />
          </div>
          <!--  -->
          <h2 class="text-3xl font-semibold text-white">Pickleball</h2>
        </div>
      </div>
      <!--  -->
      <div class="flex gap-5 w-100   items-center">
        <div class="p-2 flex group  cursor-pointer items-center gap-2 bg-white rounded-full">
          <icon-search @click="show_modal = true" class="w-5 h-5 group-hover:text-green-500 "></icon-search>
        </div>
        <VueDatePicker class="shadow-sm py-0.5" placeholder="Chọn thời gian đặt sân " v-model="date" range />
      </div>
    </header>
    <!--  -->
    <div class="h-full overflow-hidden">
      <div v-if="list_court && list_court.length === 0" class="w-full h-full flex justify-center items-center">
        <div class="flex flex-col gap-2 justify-center items-center">
          <img src="@/assets/imgs/image9.png" alt="" />
          <h3 class="text-2xl text-white font-bold">Chưa có sân nào</h3>
        </div>
      </div>
      <div v-else class="w-full h-full flex justify-center overflow-y-auto items-center px-5 py-2">
        <div class="grid h-full overflow-y-auto grid-cols-4  gap-15">
          <!-- sân -->
          <div @click="goToDetail(yard)" v-for="yard in list_court" :key="yard.id"
            class="flex items-center h-fit w-60 border border-white flex-shrink-0  rounded-lg cursor-pointer flex-col  bg-white">
            <img class="w-60 rounded-t-lg  h-50"  :src="isValidImage(yard.images[0]) ? yard.images[0] : anh1" alt="ảnh sân" />
            <div class="flex w-full  flex-shrink-0 flex-col  gap-0.5 p-1 py-2">
              <h3 class="text-sm font-medium text-back truncate">
                {{ yard.courtName }}
              </h3>
              <p class="text-sm flex-shrink-0 text-slate-500 truncate">{{ yard.street + ', ' + yard.ward + ', ' + yard.district }}</p>
              <div class="flex items-center gap-2"> <span class="w-2 h-2 bg-green-500 rounded-full"></span>
                <p class="text-xs "> {{ yard.startTime && yard.endTime ? formatHour(yard.startTime) + ' - ' + formatHour(yard.endTime) : '24/7' }}</p>
              </div>
              <div class="flex items-center justify-between">
                <vue3-star-ratings v-model="start" />
                <div class="flex items-center gap-1">
                  <IconComment class="w-4 h-4 text-slate-500"></IconComment>
                  <p class="text-xs text-slate-400">
                    3
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </main>
  <!--  -->
  <Modal v-if="show_modal" :close="showModal">
    <template #content>
      <div class="w-[800px] px-5 py-4 gap-4 flex flex-col">
        <header class="flex justify-between items-center  py-0.5">
          <p class="text-xl font-semibold ">
            Tìm kiếm sân
          </p>
          <IconClose @click="showModal"
            class="w-6 h-6 text-green-600 cursor-pointer  rounded-md flex-shrink-0 p-0.5 hover:bg-green-200">
          </IconClose>
        </header>

        <body class="w-full flex flex-col gap-2">
          <!-- Địa chỉ chi tiết -->
          <el-form label-position="top" class="grid grid-cols-2 gap-2 w-full">
            <el-form-item label="Tìm kiếm theo Quận/Huyện">
              <el-select v-model="selectedDistrict" placeholder="Chọn quận/huyện cần tìm" @change="getWards"
                size="large">
                <el-option v-for="district in districts" :key="district.code" :label="district.name"
                  :value="district.code" />
              </el-select>
            </el-form-item>

            <!-- Chọn Phường/Xã -->
            <el-form-item label="Tìm kiếm theo Phường/Xã">
              <el-select v-model="selectedWard" placeholder="Chọn phường/xã cần tìm" :disabled="wards.length === 0"
                @change="getStreets" size="large">
                <el-option v-for="ward in wards" :key="ward.code" :label="ward.name" :value="ward.code" />
              </el-select>
            </el-form-item>

            <!-- Chọn Đường -->
            <el-form-item label="Tìm kiếm theo Đường" class="col-span-2" size="large">
              <el-input v-model="infor_yard.street" placeholder="Nhập tên đường cần tìm" />
            </el-form-item>
          </el-form>

          <!-- Ô nhập tên sân -->
          <div class="flex flex-col gap-2 mb-7" :class="{
            'opacity-50': activeInput !== 'name' && !name_value
          }">
            <label class="font-semibold text-green-900 " for="">Tên sân</label>
            <input v-model="name_value" placeholder="Nhập tên sân muốn tìm kiếm"
              class="w-full px-3 outline-none py-2 rounded-md border border-green-600" type="text"
              @focus="setActive('name')" @blur="removeActive" />
          </div>

          <!-- buttom tìm kiếm -->
          <button :class="{ 'opacity-80': isSearchDisabled }" :disabled="isSearchDisabled"
            class="py-2 text-sm font-medium text-white bg-green-700 rounded-md">
            Tìm kiếm
          </button>
        </body>

      </div>
    </template>
  </Modal>

</template>

<script setup lang="ts">

import { ref, computed, onMounted } from "vue";
import { useRouter } from 'vue-router'
import axios from "axios";

/**api*/
import { apiGetCourt } from "@/service/api/apiCourt";

/**Kho lưu trữ*/
import { useAppStoreCourt } from '@/stores/appStoreCourt'


/**icon*/
import IconSearch from "@/components/Icons/IconSearch.vue";
import IconClose from '@/components/Icons/IconClose.vue';
import IconComment from '@/components/Icons/IconComment.vue'

/**Modal*/
import Modal from "@/components/Modal/Modal.vue"

/**ảnh sân*/
import anh1 from "@/assets/imgs/bg_san.jpg";
import anh2 from "@/assets/imgs/bg_san1.jpg";
import anh3 from "@/assets/imgs/bg_san2.jpg";

/**kiểu dữ liệu*/
import type { Court, Division, Location } from '@/interface'

/**Biến router */
const router = useRouter()

const start =5

/**biến store*/
const store_court = useAppStoreCourt()

/**biến*/
const date = ref();

const selectedDistrict = ref("");      // Mã quận/huyện
const selectedWard = ref("");          // Mã phường/xã
const selectedStreet = ref("");        // Tên đường

const districts = ref<Division[]>([]);
const wards = ref<Location[]>([]);

/**Danh sách sân đã được lọc*/ 
const list_court = computed(() => {
    const courts = store_court.list_court;
    const yard = infor_yard.value;

    // Nếu courts chưa có dữ liệu hoặc không phải mảng thì trả về mảng rỗng
    if (!Array.isArray(courts)) return [];

    return courts.filter(court => {
        const matchDistrict = yard.district ? court.district === yard.district : true;
        const matchWard = yard.ward ? court.ward === yard.ward : true;
        const matchStreet = yard.street ? court.street === yard.street : true;
        const matchCourtName = yard.courtName ? court.courtName === yard.courtName : true;

        return matchDistrict && matchWard && matchStreet && matchCourtName;
    });
});


/**biến mở modal tìm kiếm sân theo địa chỉ*/
const show_modal = ref(false);



const infor_yard = ref({
  courtName: '',
  district: '',
  ward: '',
  street: '',
})

/**Lưu ô input nào đang được focus*/
const activeInput = ref('');

/**giá trị tìm kiếm theo địa chỉ*/
const Address_value = ref('')

/**giá trị tìm kiếm theo tên sân*/
const name_value = ref('')

// Điều kiện để nút "Tìm kiếm" được bấm
const isSearchDisabled = computed(() => {
  return !Address_value.value.trim() && !name_value.value.trim();
});

onMounted(() => {
  // *Lấy danh sách sân 
  getListCourt(),
    // *Lấy quận huyện
    getDistricts();

   
    
});

// Lấy danh sách quận/huyện Hà Nội
const getDistricts = async () => {
  try {
    const response = await axios.get("https://provinces.open-api.vn/api/d/");
    districts.value = response.data.filter((d: any) => d.province_code === 1); // 1 là mã của Hà Nội
  } catch (error) {
    console.error("Lỗi khi lấy quận/huyện:", error);
  }
};

// Khi chọn quận/huyện
const getWards = async () => {
  const district = districts.value.find(d => d.code === selectedDistrict.value);
  infor_yard.value.district = district ? district.name : ""; // Lưu tên quận/huyện


  selectedStreet.value = "";

  try {

    const response = await axios.get("https://provinces.open-api.vn/api/w/");
    console.log("Lấy phường/xã cho quận/huyện:", response);

    // Lọc danh sách phường/xã theo quận/huyện đã chọn
    wards.value = response.data.filter((ward: any) => ward.district_code === selectedDistrict.value);

  } catch (error) {
    console.error("Lỗi khi lấy phường/xã:", error);
  }
};

// Khi chọn phường/xã
const getStreets = () => {
  const ward = wards.value.find((w: any) => w.code === selectedWard.value);
  infor_yard.value.ward = ward ? ward.name : ""; // Lưu tên phường/xã
};

/**hàm đóng modal*/
function showModal() {
  show_modal.value = false;
}

/***/
const setActive = (field: string) => {
  activeInput.value = field;
};

/***/
const removeActive = () => {
  activeInput.value = '';
};

/**Khi xem một sân*/
function goToDetail(yard : Court) {
  router.push('/detail');
  /**Lưu sân được bấm vào store*/
  store_court.court_detail = yard

}

/**Hàm lấy danh sách sân*/
async function getListCourt() {
  try {
    const response = await apiGetCourt();
    console.log("API Response:", response);

    store_court.list_court = response.data.filter((court: Court) =>
      court.courtName.trim() !== "" &&
      court.street.trim() !== "" &&
      court.ward.trim() !== "" &&
      court.district.trim() !== "" &&
      court.images.length > 0
    );
    console.log('store_court.list_court', store_court.list_court);


  } catch (error) {
    console.error("API Error:", error);
  }
}

function isValidImage(image :string) {
        // Kiểm tra xem image có phải là một URL hợp lệ hay không (bắt đầu với http:// hoặc https://)
        const urlPattern = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|bmp|webp))$/i;
        return urlPattern.test(image);
    }

function formatHour(timeStr: string): string {
  return timeStr?.slice(0, 5) // Lấy 5 ký tự đầu: "08:00"
}

</script>
