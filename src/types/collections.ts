export interface CollectionItemType {
  id: string;
  name: string;
  icon: string | null;
  color: string | null;
  count: number;
}

export interface DashboardCollection {
  id: string;
  name: string;
  description: string | null;
  isFavorite: boolean;
  itemCount: number;
  // Sorted by count, most-used type first
  types: CollectionItemType[];
}

export interface CollectionStats {
  total: number;
  favorites: number;
}
