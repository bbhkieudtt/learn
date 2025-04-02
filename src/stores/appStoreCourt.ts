import { ref } from "vue";
import { defineStore } from "pinia";

/**kiểu dữ liệu*/
import type {Court} from '@/interface'

/***/ 
export const useAppStoreCourt = defineStore("app", () => {

    const list_court = ref<Court[]>([]);
   

    
    return {
        list_court
    }

});