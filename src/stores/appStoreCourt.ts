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
    /**Biến kiểm tra đang ở danh sách sân của tôi hay trang chủ*/
    const is_court= ref('home') 
    /**sân con được chọn*/
    const chill_detail = ref<ChildCourt>() 

   

    
    return {
        list_court,
        court_detail,
        list_chill_court,
        is_court,
        chill_detail
    }

});