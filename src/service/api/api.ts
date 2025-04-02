import { api_host } from "./env";
import { requestAxios } from "./request";
import type { User } from '@/interface'

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


/**api tạo tài khoản*/
export const apiCreateUser = async (payload: User) => {
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


