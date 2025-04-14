import axios from "axios";
import { get } from "lodash";

import { loadingGlobal } from "@/service/global-config"

import type {  InputRequestAxios } from "@/interface/index";
import { th } from "date-fns/locale";

/**
 * Request axios
 * @param{ uri, method, body = {}, headers = {} }
 */
export const requestAxios = async ({ uri, method, body = {}, headers = {} }: InputRequestAxios) => {
    try {
        loadingGlobal.value = true; // Bắt đầu loading
        // ✅ Đảm bảo body là object, không cần JSON.stringify()
        let result = await axios(uri, { method, headers, data: body });

        console.log("API Response:", result);

        if (result?.data?.error) throw result?.data?.context_error?.message;
        loadingGlobal.value = false; // Kết thúc loading
        return  result;
    } catch (e) {
        loadingGlobal.value = false; // Kết thúc loading
        throw get(e, "response.data.context_error.message") ||
              get(e, "response.data.message") ||
              get(e, "response.data") ||
              get(e, "message") || e;
    }
};
