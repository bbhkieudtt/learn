
export interface event_booking {
  title: string;
  start: string | Date;
  end: string | Date;
  description?: string; // Thêm mô tả
  location?: string; // Thêm địa điểm
  color?: string; // Thêm màu sắc
  allDay?: boolean; // Nếu sự kiện diễn ra cả ngày
  classNames: string[];
  [key: string]: any; // Cho phép thêm các thuộc tính tuỳ chỉnh khác
  }

  export interface Event {
    id: number;
    start: string;  // ISO8601 string representation of the start date
    end: string;    // ISO8601 string representation of the end date
    title: string;  // Event title, e.g., "khanhvy 0987456788 990000"
    classNames: string[];  // Array of class names for styling
    allDay: boolean;
  }

 
  
  