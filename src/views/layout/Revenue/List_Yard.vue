<template>
    <DropBox>
        <template #trigger>
            <button @click="openListSelected()" class="flex items-center w-full h-full justify-between gap-2">
                <p>

                </p>
                <p>{{ list_yards[0]?.courtName }}</p>
                <ChartBarIcon class="w-5 h-5 text-white"></ChartBarIcon>
            </button>

        </template>
        <!--  -->
        <template #box>
            <div v-show="store.filter_yard"
                class="px-2 py-2  bg-[#faf2ac] absolute  top-2 z-50  rounded-xl w-full">
                <div @click="selectedYard(item)" v-for="(item, index) in list_yards" :key="index"
                    :class="{ 'border-green-700': index !== list_yards.length -1,'border-b': index !== list_yards.length -1  }"
                    class="flex  py-2 text-sm font-medium justify-between text-green-800 items-center">
                    <p>

                    </p>
                    <p>
                        {{ item.courtName }}
                    </p>
                    <FireIcon v-if="item.status" class="w-5 h-5 text-yellow-600"></FireIcon>
                    <p v-else class="w-5 h-5">

                    </p>

                </div>
            </div>

        </template>
    </DropBox>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import DropBox from "@/components/DropBox.vue";
import { useAppStore } from '@/stores/appStore'
/**Kho lưu trữ*/
import { useAppStoreCourt } from '@/stores/appStoreCourt'

/**icon*/
import { } from "@heroicons/vue/24/outline";
// 
import { ChartBarIcon , FireIcon } from "@heroicons/vue/24/solid";

/**kiểu dữ liệu*/
import type { Court } from '@/interface'

/**biến store*/
const store = useAppStore()

/**biến store*/
const store_court = useAppStoreCourt()

// Lấy thông tin user từ localStorage
const userInfoStr = localStorage.getItem("userInfo")
const userInfo = userInfoStr ? JSON.parse(userInfoStr) : {}
const userId = userInfo?.id || null

// Computed: Lọc danh sách sân theo userId
const list_yards = computed(() => {
  if (!store_court || !store_court.list_court) return [];
  
  return store_court.list_court.filter((court: Court) => 
    court.userId === userId && court.status === 0
  );
});


onMounted(()=>{
    store_court.court_detail = list_yards.value[0]
    console.log('store_court.court_detail',store_court.court_detail);
})


/**hàm mở danh sách lọc*/
function openListSelected() {
    store.filter_yard = !store.filter_yard
}

function selectedYard(court_detail: Court) {
    // Kiểm tra nếu court_detail chưa có trong list_court
    const index = store_court.list_court.findIndex(item => item.id === court_detail.id);

    // Nếu court đã có trong list_court, xóa nó ra khỏi mảng trước
    if (index !== -1) {
        store_court.list_court.splice(index, 1);
    }

    // Thêm court vào đầu mảng list_court
    store_court.list_court.unshift(court_detail);
    
    // Cập nhật thông tin sân hiện tại
    store_court.court_detail = court_detail;
    
    // Đặt filter_yard về false
    store.filter_yard = false;

}


</script>
