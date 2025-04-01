export interface User {
    username: string;     // Tên đăng nhập của người dùng
    fullname: string;     // Họ và tên đầy đủ của người dùng
    password: string;     // Mật khẩu của người dùng
    phoneNumber: string;  // Số điện thoại của người dùng
    email: string;        // Địa chỉ email của người dùng
    address: string;      // Địa chỉ của người dùng
    role: number;         // Vai trò của người dùng (0 hoặc giá trị khác)
  }

 export interface UserInfo {
    id: number;
    username: string;
    fullname: string;
    phoneNumber: string;
    email: string;
    address: string;
    role: number;
    roleName: string;
    createDate: string;
    lastLogin: string;
    token: string;
  }
  
  