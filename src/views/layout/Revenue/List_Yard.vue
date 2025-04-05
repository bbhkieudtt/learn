<template>
    <DropBox>
        <template #trigger>
            <button @click="openListSelected()" class="flex items-center w-full h-full justify-between gap-2">
                <p>

                </p>
                <p>Pickleball Bạch Tuyết</p>
                <ChartBarIcon class="w-5 h-5 text-white"></ChartBarIcon>
            </button>

        </template>
        <!--  -->
        <template #box>
            <div v-show="store.filter_yard"
                class="px-2 py-2  bg-[#faf2ac] absolute  top-2 z-50  rounded-xl w-full">
                <div v-for="(item, index) in list_yard" :key="index"
                    :class="{ 'border-green-700': index !== list_yard.length - 1 }"
                    class="flex border-b py-2 text-sm font-medium justify-between text-green-800 items-center">
                    <p>

                    </p>
                    <p>
                        {{ item.name_yard }}
                    </p>
                    <FireIcon v-if="item.vip" class="w-5 h-5 text-yellow-600"></FireIcon>
                    <p v-else class="w-5 h-5">

                    </p>

                </div>
            </div>

        </template>
    </DropBox>
</template>

<script setup lang="ts">
import { ref } from "vue";
import DropBox from "@/components/DropBox.vue";
import { useAppStore } from '@/stores/appStore'

/**icon*/
import { } from "@heroicons/vue/24/outline";
// 
import { ChartBarIcon , FireIcon } from "@heroicons/vue/24/solid";

/**biến store*/
const store = useAppStore()

/**Danh sách sân con*/
const list_yard = ref([
    {
        id: 1,
        name_yard: 'Pickleball Thiên Lý ơi',
        vip: true
    },
    {
        id: 2,
        name_yard: 'Pickleball Bạch Tuyết',
        vip: false
    },
    {
        id: 3,
        name_yard: 'Pickleball Đầm Sen',
        vip: false
    }
])

/**hàm mở danh sách lọc*/
function openListSelected() {
    store.filter_yard = !store.filter_yard
}

</script>
