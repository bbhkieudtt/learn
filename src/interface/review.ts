export interface Review {
    id: number;
    userId: number;
    courtId: number;
    content: string;
    ratingStar: number;
    createDate: string;
    updateDate: string;
    username: string | null;
    userFullname: string | null;
  }

 export interface GroupedReview {
    courtId: number;
    averageRatingStar: number;
    total_comments: number;
    comments: Review[];
  }
 
  