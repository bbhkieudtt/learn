import { api_host } from "./env";
import { requestAxios } from "./request";
import type {User } from '@/interface'
import { useAppStore } from "@/stores/appStore";

interface InputRequestApi {
  end_point?: string;
  body?: any;
  method?: string
}

/** Đường dẫn host  */
const HOST = api_host[import.meta.env.VITE_APP_ENV || "production"] || {};



/** Request api */
async function apiRequest({ end_point, body, method }: InputRequestApi) {
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

/**api tạo bình luận*/
export const apiCreateReview = async (payload: any) => {
   try {
     return await apiRequest({
       // Phương thức
       method: "POST",
       // endpoint API
       end_point: "Review/create",
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

 /**api lấy danh sách bình luận*/
export const apiGetListReview = async () => {
  try {
    return await apiRequest({
      // Phương thức
      method: "GET",
      // endpoint API
      end_point: "Review/get-list",
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

