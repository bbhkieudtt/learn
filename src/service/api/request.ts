import axios from "axios";
import { get } from "lodash";

import type {  InputRequestAxios } from "@/interfaces";
import { th } from "date-fns/locale";

/**
 * Request axios
 * @param{ uri, method, body = {}, headers = {} }
 */
export const requestAxios = async (
    { uri, method, body = {}, headers = {} }: InputRequestAxios
) => {
    try {
        let nonReactiveBody = JSON.parse(JSON.stringify(body));
        
        /** Lấy ra kết quả request */
        let result = await axios(uri, { method, headers, data: nonReactiveBody })

        console.log('result',result);
        

        // kiểm tra nếu trả về có lỗi thì throw ra lỗi 
        if(result?.data?.error) throw result?.data?.context_error?.message

        /** Trả về kết quả */
        return result?.data?.data || result?.data || result



    } catch (e) {
        throw get(e, 'response.data.context_error.message') ||
        get(e, 'response.data.message') ||
        get(e, 'response.data') ||
        get(e, 'message') ||
        e
    }
}