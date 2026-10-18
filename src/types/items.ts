export interface DashboardItemType {
  id: string;
  name: string;
  icon: string | null;
  color: string | null;
}

export interface ItemTypeWithCount extends DashboardItemType {
  count: number;
}

export interface DashboardItem {
  id: string;
  title: string;
  description: string | null;
  isFavorite: boolean;
  isPinned: boolean;
  createdAt: Date;
  type: DashboardItemType;
  tags: string[];
}

export interface ItemStats {
  total: number;
  favorites: number;
}
