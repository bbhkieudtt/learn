export interface Court {
    id: number;
    userId: number;
    courtName: string;
    courtDescription: string;
    district: string;
    ward: string;
    street: string;
    images: string[]; // Assuming images is an array of strings (URLs or image names)
    minPrice: number;
    maxPrice: number;
    createDate: string; // You can use Date if you prefer, but string is fine for ISO date strings
    updateDate: string; // Same as above
    contactPerson: string;
    contactPhone: string;
    status: number;
    userFullname: string | null; // Allowing it to be null if the value is absent
    userPhoneNumber: string | null; // Allowing it to be null if the value is absent
    childLst: any[] | null; // Assuming `childLst` is an array or null, you can adjust the type if needed,
    startTime: string,
    endTime: string,
  }
  