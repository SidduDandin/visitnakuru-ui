// Define the type for a single blog article
export type BlogArticle = {
  blogId: string;
  // All title and description fields are needed for the listing page fallback
  blogTitle_en: string;
  blogTitle_es: string | null;
  blogTitle_fr: string | null;
  blogTitle_de: string | null;
  blogTitle_zh: string | null;
  blogURL: string; // Used as the slug
  blogDescription_en: string;
  blogDescription_es: string | null;
  blogDescription_fr: string | null;
  blogDescription_de: string | null;
  blogDescription_zh: string | null;
  Image: string;
  createdAt: string;
  updatedAt: string;
};

// Utility type for dynamically accessing localized fields
export type LocalizedBlogArticle = BlogArticle & {
  title: string;
  description: string;
};