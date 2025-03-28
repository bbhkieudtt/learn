import { api_host } from "./env";
import { requestAxios } from "./request";
import type {User } from '@/interface'

interface InputRequestApi {
  end_point?: string;
  body?: any;
}

/** Đường dẫn host của merchant */
const HOST = api_host[import.meta.env.VITE_APP_ENV || "production"] || {};


// /** Lấy token business từ store */
// function getBusinessToken() {
//   const $store = useAppStore();
//   return $store.business_token;
// }

/** Request api của merchant */
async function apiMerchantRequest({ end_point, body }: InputRequestApi) {
  try {
    // ❌ KHÔNG cần stringify body ở đây
    let response = await requestAxios({
      uri: `${HOST["pickleyard"]}/${end_point}`,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body, // ✅ Truyền object trực tiếp
    });
    return response;
  } catch (e) {
    throw e;
  }
}


/**api tạo tài khoản*/
export const apiCreateUser = async (payload: any) => {
   try {
     return await apiMerchantRequest({
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
   "username": "string",
  "password": "string"
}) => {
  try {
    return await apiMerchantRequest({
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


