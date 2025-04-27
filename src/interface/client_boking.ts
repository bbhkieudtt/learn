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
  childCourtId: number;
  childCourtName: string;
  courtDistrict: string;
  courtId: number;
  courtName: string;
  courtStreet: string;
  courtWard: string;
  createDate: string;
  endTime: string;
  id: number;
  price: number;
  quantity: number;
  startTime: string;
  status: number;
  type: number;
  userFullName: string;
  userId: number;
  userPhoneNumber: string;
}

  type BookingType = 0 | 1 | 2 | 3;

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
      // 0: Ngày ,1 Tuần, 2Tháng, 3 năm 
      type:BookingType ;
      // Số lượng cho type 
      quantity:number;
  }
  