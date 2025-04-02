import { api_host } from "./env";
import { requestAxios } from "./request";
import type {User } from '@/interface'

interface InputRequestApi {
  end_point?: string;
  body?: any;
  method?: string
}

/** Đường dẫn host  */
const HOST = api_host[import.meta.env.VITE_APP_ENV || "production"] || {};


// /** Lấy token business từ store */
// function getBusinessToken() {
//   const $store = useAppStore();
//   return $store.business_token;
// }

/** Request api */
async function apiRequest({ end_point, body, method }: InputRequestApi) {
  try {
    let response = await requestAxios({
      uri: `${HOST["pickleyard"]}/${end_point}`,
      method: method || 'POST',
      headers: { "Content-Type": "application/json" },
      body,
    });
    return response;
  } catch (e) {
    throw e;
  }
}

/**api tạo sân */
export const apiCreateCourt = async (payload: any) => {
   try {
     return await apiRequest({
      // Phương thức
      method: "POST",
       // endpoint API
       end_point: "Court/create",
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

 /**api lấy danh sách sân  */
export const apiGetCourt = async () => {
  try {
    return await apiRequest({
      // Phương thức
      method: "GET",
      // endpoint API
      end_point: "Court/get-list",
      // payload được truyền từ giao diện
      // body: payload,
    });
  } catch (e) {
    // Log lỗi nếu có
   //  console.error("Error:", e);
   console.log(e);
   
    throw e;
  }
}; 