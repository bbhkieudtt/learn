import { ref } from "vue";
import { defineStore } from "pinia";

/**kiểu dữ liệu*/
import type {ClientBoking,} from '@/interface'
import type {  DateSelectArg } from "@fullcalendar/core";
/***/ 
export const useAppStore = defineStore("app", () => {

    const filter_time = ref(false)
    /**Biến kiểm tra khi bấm nút 'Xác nhận' thêm lịch*/
    const add_boking = ref(false); // Dùng ref() để theo dõi thay đổi
    /**Thông tin khách hàng đặt sân */
    /**Biến lưu thông tin khách đặt lịch*/
    const info_client = ref<ClientBoking>() 
    /**Lưu thông tin thời gian để tạo lịch*/
    const selectInfo = ref<DateSelectArg>()
    
    return {
        filter_time,
        add_boking,
        info_client,
        selectInfo
    }

});