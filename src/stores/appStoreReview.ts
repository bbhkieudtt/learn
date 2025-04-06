import { ref } from "vue";
import { defineStore } from "pinia";

/**kiểu dữ liệu*/
import type {Review, GroupedReview} from '@/interface'

/***/ 
export const useAppStoreReview = defineStore("app", () => {

    const list_review = ref<{ [courtId: number]: GroupedReview }>({});


    
    return {
        list_review
    }

});