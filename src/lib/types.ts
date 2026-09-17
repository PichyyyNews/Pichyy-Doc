export interface TocItem {
  id: string;
  text: string;
  level: number; // 2 for H2, 3 for H3
  enabled: boolean;
}

export interface DocPageItem {
  id: string;
  docSpaceId: string;
  categoryId?: string | null;
  title: string;
  slug: string;
  description?: string | null;
  content: string;
  tocAnchors: string; // JSON string of TocItem[]
  searchKeywords: string; // JSON string of string[]
  order: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryItem {
  id: string;
  docSpaceId: string;
  name: string;
  slug: string;
  order: number;
  isCollapsed: boolean;
  pages?: DocPageItem[];
}

export interface DocSpaceItem {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  order: number;
  isDefault: boolean;
  categories: CategoryItem[];
  pages: DocPageItem[];
}

export interface SearchResultItem {
  title: string;
  url: string;
  docSpaceName: string;
  categoryName?: string;
  type: "page" | "heading" | "keyword";
  snippet?: string;
}
