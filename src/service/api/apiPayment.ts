import { api_host } from "./env";
import { requestAxios } from "./request";
import type {User } from '@/interface'
import { useAppStore } from "@/stores/appStore";

interface InputRequestApi {
  end_point?: string;
  body?: any;
  method?: string
}

/** Đường dẫn host*/
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

/**api tạo thanh toán*/
export const apiCreatePayment = async (payload: any) => {
   try {
     return await apiRequest({
      // Phương thức
      method: "POST",
       // endpoint API
       end_point: "Payment/create",
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

 /**api tạo thanh toán*/
export const apiCreatePaymentVNpay = async (params: { paymentId: number; moneyToPay: number }) => {
  const query = new URLSearchParams({
    paymentId: params.paymentId.toString(),
    moneyToPay: params.moneyToPay.toString()
  });
  try {
    return await apiRequest({
     // Phương thức
     method: "GET",
      // endpoint API
      end_point: `Payment/CreatePaymentUrl?${query.toString()}`,
      // payload được truyền từ giao diện
      
    });
  } catch (e) {
    // Log lỗi nếu có
   //  console.error("Error:", e);
   console.log(e);
   
    throw e;
  }
}; 

/**api tạo thanh toán*/
export const apiGetPayment = async () => {
  try {
    return await apiRequest({
     // Phương thức
     method: "GET",
      // endpoint API
      end_point: "Payment/get-list",
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

