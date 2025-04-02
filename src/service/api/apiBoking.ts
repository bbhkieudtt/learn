import { api_host } from "./env";
import { requestAxios } from "./request";
import type {User } from '@/interface'

interface InputRequestApi {
  end_point?: string;
  body?: any;
  method?:string 
}

/** Đường dẫn host */
const HOST = api_host[import.meta.env.VITE_APP_ENV || "production"] || {};


// /** Lấy token business từ store */
// function getBusinessToken() {
//   const $store = useAppStore();
//   return $store.business_token;
// }

/** Request api  */
async function apiRequest({ end_point, body, method }: InputRequestApi) {
  try {
    let response = await requestAxios({
      uri: `${HOST["pickleyard"]}/${end_point}`,
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body,
    });
    return response;
  } catch (e) {
    throw e;
  }
}

/**api tạo boking*/
export const apiCreateBoking = async (payload: any) => {
   try {
     return await apiRequest({
      // Phương thức
       method: "POST",
       // endpoint API
       end_point: "Booking/create",
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

 /**api lấy danh sách boking*/
export const apiGetListBooking = async (payload: any) => {
  try {
    return await apiRequest({
      // Phương thức
      method: "GET",
      // endpoint API
      end_point: "Booking/get-list",
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

 /**api cập nhật boking */
 export const apiUpdateBoking = async (payload: any) => {
  try {
    return await apiRequest({
        // Phương thức
        method: "PUT",
      // endpoint API
      end_point: "Booking/update",
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

 /**api xóa boking */
 export const apiDeleteBoking = async (payload: any) => {
  try {
    return await apiRequest({
       // Phương thức
       method: "DELETE",
      // endpoint API
      end_point: "Booking/delete",
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



