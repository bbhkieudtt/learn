import { api_host } from "./env";
import { requestAxios } from "./request";
import type {User } from '@/interface'

interface InputRequestApi {
  end_point?: string;
  body?: any;
}

/** Đường dẫn host của merchant */
const HOST: { [index: string]: string } =
  api_host[import.meta.env.VITE_APP_ENV || "development"];

// /** Lấy token business từ store */
// function getBusinessToken() {
//   const $store = useAppStore();
//   return $store.business_token;
// }

/** Request api của merchant */
async function apiMerchantRequest({
  end_point,
  body,
}: InputRequestApi) {
  try {
    // * Hiện loading
    const data = await requestAxios({
      uri: `${HOST["pickleyard"]}/${end_point}`,
      method: "POST",
      headers: {
        "Content-Type": "application/json", 
      },
      body,
    });
    // * Trả về dữ liệu
    return data;
  } catch (e) {
    throw e;
  }
}

/**lấy danh sách danh mục*/
export const apiCreateUser = async (payload: User) => {
   try {
     return await apiMerchantRequest({
       // endpoint API
       end_point: "/User/create",
       // payload được truyền từ giao diện
       body: payload,
     });
   } catch (e) {
     // Log lỗi nếu có
     console.error("Error:", e);
     throw e;
   }
 };


