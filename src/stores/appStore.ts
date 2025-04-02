import { ref } from "vue";
import { defineStore } from "pinia";

/**kiểu dữ liệu*/
import type {ClientBoking, event_booking,UserInfo } from '@/interface'
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
    /**Mảng sự kiện*/
    const list_event =ref<event_booking>()
    /**Biển mở DropBox chọn sân con*/
    const filter_yard =  ref(false)
    /**Ngày muốn xem lịch*/ 
     /**biến ngày chọn ở lịch*/
    const date = ref(new Date());
    /**Biến mở modal chọn kiểu lọc*/ 
    const show_modal = ref(false)
    /**đối tượng đăng nhập*/ 
    const UserInfo = ref<UserInfo>()

    
    return {
        filter_time,
        add_boking,
        info_client,
        selectInfo,
        list_event,
        filter_yard,
        date,
        show_modal,
        UserInfo
    }

});