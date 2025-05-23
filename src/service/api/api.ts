import { api_host } from "./env";
import { requestAxios } from "./request";
import type { User } from '@/interface'
import { useAppStore } from "@/stores/appStore";

interface InputRequestApi {
  end_point?: string;
  body?: any;
  method?: string
}

/** Đường dẫn host */
const HOST = api_host[import.meta.env.VITE_APP_ENV || "production"] || {};


// /** Lấy token business từ store */
// function getBusinessToken() {
//   const $store = useAppStore();
//   return $store.business_token;
// }

/** Request api */
async function apiRequest({ end_point, body,method }: InputRequestApi) {
  try {
    let response = await requestAxios({
      uri: `${HOST["pickleyard"]}/${end_point}`,
      method: method || 'GET',
      headers: { "Content-Type": "application/json" },
      body,
    });
    return response;
  } catch (e) {
    throw e;
  }
}

/** Request api */
async function apiRequests({ end_point, body, method }: InputRequestApi) {
  try {
    const token = localStorage.getItem("token");
    let response = await requestAxios({
      uri: `${HOST["pickleyard"]}/${end_point}`,
      method: method || 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body,
    });
    return response;
  } catch (e) {
    throw e;
  }
}

// async function apiRequestss({ end_point, body, method }: InputRequestApi) {
//   try {
//     // Xử lý endpoint forgot-password với multipart/form-data
//     if (end_point === 'User/forgot-password') {
//       const formData = new FormData();
//       for (const [key, value] of Object.entries(body)) {
//         formData.append(key, value);
//       }

//       let response = await requestAxios({
//         uri: `${HOST["pickleyard"]}/${end_point}`,
//         method: method || 'POST',
//         headers: {
//           Accept: '*/*', // Giữ giống Postman
//           // Không set Content-Type, browser tự động thêm multipart/form-data
//         },
//         body: formData,
//       });
//       return response;
//     }

//     // Các endpoint khác dùng application/json
//     let response = await requestAxios({
//       uri: `${HOST["pickleyard"]}/${end_point}`,
//       method: method || 'GET',
//       headers: { 'Content-Type': 'application/json' },
//       body,
//     });
//     return response;
//   } catch (e) {
//     console.log('Error in apiRequest:', e.response?.status, e.response?.data);
//     throw e;
//   }
// }
/**api tạo tài khoản*/
export const apiCreateUser = async (payload: any) => {
   try {
     return await apiRequest({
       // Phương thức
       method: "POST",
       // endpoint API
       end_point: "User/create",
       // payload được truyền từ giao diện
       body: payload,
     });
   } catch (e) {
     // Log lỗi nếu có
    //  console.error("Error:", e);
    console.log(e);
    
     throw e;
   }
 };

 /**api tạo tài khoản*/
export const apiUpdateUser = async (payload: any) => {
  try {
    return await apiRequests({
      // Phương thức
      method: "PUT",
      // endpoint API
      end_point: "User/update",
      // payload được truyền từ giao diện
      body: payload,
    });
  } catch (e) {
    // Log lỗi nếu có
   //  console.error("Error:", e);
   console.log(e);
   
    throw e;
  }
};

 /**api tạo tài khoản*/
export const login = async (payload: {
   "username": string,
  "password": string
}) => {
  try {
    return await apiRequest({
       // Phương thức
       method: "POST",
      // endpoint API
      end_point: "User/login",
      // payload được truyền từ giao diện
      body: payload,
    });
  } catch (e) {
    // Log lỗi nếu có
   //  console.error("Error:", e);
   console.log(e);
   
    throw e;
  }
};

 /**api lấy danh sách tài khoản*/
 export const getListUser = async () => {
 try {
   return await apiRequests({
      // Phương thức
      method: "GET",
     // endpoint API
     end_point: "User/get-list",
     // payload được truyền từ giao diện
    //  body: payload,
   });
 } catch (e) {
   // Log lỗi nếu có
  //  console.error("Error:", e);
  console.log(e);
  
   throw e;
 }
};

 /**api lấy danh sách tài khoản*/
 export const Logout = async () => {
  try {
    return await apiRequests({
       // Phương thức
       method: "GET",
      // endpoint API
      end_point: "User/Logout",
      // payload được truyền từ giao diện
     //  body: payload,
    });
  } catch (e) {
    // Log lỗi nếu có
   //  console.error("Error:", e);
   console.log(e);
   
    throw e;
  }
 };

/**api lấy danh sách tài khoản*/
export const forgotPasswword = async (payload: {
  "email": string,
}) => {
  try {
    return await apiRequests({
       // Phương thức
       method: "POST",
      // endpoint API
       end_point: "User/forgot-password",
      // payload được truyền từ giao diện
        body: payload,
    });
  } catch (e) {
   
   console.log(e);
   
    throw e;
  }
 };


