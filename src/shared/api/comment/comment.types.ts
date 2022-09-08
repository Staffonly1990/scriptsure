export enum CommentType {
  PRESCRIPTION = 1,
  INTERNAL_COMMENT = 2,
  INSURANCE,
}

export interface IComment {
  CommentPractice: {
    commentId: number;
    practiceId: number;
  }[];
  comment: string;
  commentId: number;
  commentType: number;
  createdAt: string | Date;
  name: string;
  updatedAt: string | Date;
}
