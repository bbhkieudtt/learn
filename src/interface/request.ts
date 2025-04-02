/** Đầu vào để request api */
export interface InputRequestApi {
    /** Dữ liệu gửi đi */
    body?: any
    /** Token truy cập */
    access_token?: string
    /** Đuôi api */
    end_point?: string
    /** Headers */
    headers?: {}
    /** ẩn loading */
    hide_loading?: boolean
    /** Resize kích thước ảnh */
    resize_width?: number
    /** Resize kích thước ảnh */
    resize_height?: number
}

/** Đầu vào để request axios */
export interface InputRequestAxios {
    /** Url api */
    uri: string
    /** Phương thức request */
    method: string
    /** Dữ liệu gửi đi */
    body?: any
    /** Headers */
    headers?: any
}
