<template>
    <DropBox>
        <template #trigger>
            <button @click="openListSelected()" class="flex items-center w-full h-full justify-between gap-2">
                <p>

                </p>
                <p>{{ list_child.length === 0 ? 'Chưa có sân con !' : list_child[0].childCourtName }}</p>

                <ClipboardDocumentListIcon class="w-5 h-5 text-white"></ClipboardDocumentListIcon>
            </button>

        </template>
        <!--  -->
        <template #box>
            <div v-show="store.filter_yard"
                class="px-2 py-2  bg-[#faf2ac] absolute  top-2 z-50  rounded-xl w-full">
                <div @click="selectChill(item.childCourtName)" v-for="(item, index) in list_child" :key="index"
                    :class="{ 'border-green-700': index !== list_yard.length - 1 }"
                    class="flex border-b py-2 text-sm font-medium justify-between text-green-800 items-center">
                    <p>

                    </p>
                    <p>
                        {{ item.childCourtName }}
                    </p>
                    <FireIcon v-if="item.position = 'vip'" class="w-5 h-5 text-yellow-600"></FireIcon>
                    <p v-else class="w-5 h-5">

                    </p>

                </div>
            </div>

        </template>
    </DropBox>
</template>

<script setup lang="ts">
import { ref,computed } from "vue";
import DropBox from "@/components/DropBox.vue";
import { useAppStore } from '@/stores/appStore'
import { useAppStoreCourt } from '@/stores/appStoreCourt'

/**icon*/
import { } from "@heroicons/vue/24/outline";
// 
import { ClipboardDocumentListIcon, FireIcon } from "@heroicons/vue/24/solid";



/**biến store*/
const store = useAppStore()

const store_court = useAppStoreCourt()

/**Biến Id sân được chọn */
const id_Court = store_court.court_detail?.id ?? 0

const list_child = computed(() => {
  if (!Array.isArray(store_court.list_chill_court)) return [];
  return store_court.list_chill_court.filter(child => child.courtId === id_Court)
})

/**Danh sách sân con*/
const list_yard = ref([
    {
        id: 1,
        name_yard: 'Pickleball 1',
        vip: true
    },
    {
        id: 2,
        name_yard: 'Pickleball 2',
        vip: false
    },
    {
        id: 3,
        name_yard: 'Pickleball 3',
        vip: false
    }
])

/**hàm mở danh sách lọc*/
function openListSelected() {
    console.log('store.filter_time', store.filter_time);
    store.filter_yard = !store.filter_yard
}

/**Hàm chọn sân con*/
function selectChill(childCourtName:string){
   

} 

</script>
