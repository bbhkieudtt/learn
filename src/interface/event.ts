
export interface event_booking {
  title: string;
  start: string | Date;
  end: string | Date;
  description?: string; // Thêm mô tả
  location?: string; // Thêm địa điểm
  color?: string; // Thêm màu sắc
  allDay?: boolean; // Nếu sự kiện diễn ra cả ngày
  [key: string]: any; // Cho phép thêm các thuộc tính tuỳ chỉnh khác
  }
  