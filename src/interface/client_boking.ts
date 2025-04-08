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
    // trạng thái 0: lịch thành công , 1: lịch khóa sân, 3: lịch bị hủy 
    status: number;    // 0 = pending, 1 = confirmed, etc. (tùy vào logic hệ thống)
    price: number;     // giá tiền, đơn vị có thể là VND hoặc USD tùy hệ thống
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
  