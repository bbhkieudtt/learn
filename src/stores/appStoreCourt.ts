import { ref } from "vue";
import { defineStore } from "pinia";

/**kiểu dữ liệu*/
import type {Court, ChildCourt} from '@/interface'

/***/ 
export const useAppStoreCourt = defineStore("app", () => {

    const list_court = ref<Court[]>([]);
    /**Sân được chọn*/
    const court_detail = ref<Court>() 
    /**Danh sách sân con thuộc sân cha */
    const list_chill_court = ref<ChildCourt[]>([]);

   

    
    return {
        list_court,
        court_detail,
        list_chill_court
    }

});