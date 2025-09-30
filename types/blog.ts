// types/blog.ts
export interface Blog {
  id?: number;
  title: string;
  content: string;
  author: string;
  tags?: string[];
  featuredImage?: string;
  createdAt?: string;
}
