/** Thông tin cá nhân khách đặt sân */
export interface ClientBoking {
    /**tên khách hàng*/ 
    name_client: string ;
    /**Số điện thoại khách hàng*/ 
    phone_client: string ;
    /***/ 
    note_boking: string;
}

export interface Booking {
    userId: number;
    childCourtId: number;
    startTime: string; // ISO 8601 datetime string
    endTime: string;   // ISO 8601 datetime string
    // trạng thái 
    // 0: chờ xác nhận
    // 1: đã đặt, 
    // 2: chưa thanh toán 
    // 3 : đã thanh toán
    // 5: Đã hủy
    // 6: đã hoàn tiền
    status: number;    
    price: number;     
  }

  export  interface CourtEvent {
    childCourtId: number;
    childCourtName: string;
    courtDistrict: string;
    courtId: number;
    courtName: string;
    courtStreet: string;
    courtWard: string;
    createDate: string; // Chuỗi ngày tháng ISO 8601
    endTime: string; // Chuỗi ngày tháng ISO 8601
    id: number;
    price: number;
    startTime: string; // Chuỗi ngày tháng ISO 8601
    status: number;
    userFullName: string;
    userId: number;
    userPhoneNumber: string;
  }
  