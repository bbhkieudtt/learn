export interface Division {
    code: string;           // A string to represent the code (e.g., "quan_ba_dinh")
    codename: string;       // A string to represent the codename (e.g., "quan_ba_dinh")
    division_type: string;  // A string to represent the division type (e.g., "huyện")
    name: string;           // A string to represent the name of the division (e.g., "Quận Ba Đình")
    province_code: number;  // A number to represent the province code (e.g., 1)
    wards: any[];           // An array that represents wards, which is empty in your example but could contain data
  }

  // Định nghĩa interface cho đối tượng Location
  export interface Location {
    code: number; // Mã đối tượng
    codename: string; // Mã codename
    district_code: number; // Mã huyện/quận
    division_type: string; // Loại phân chia (ví dụ: xã, phường...)
    name: string; // Tên địa phương
  }