export interface User {
  username: string;
  password: string;
}

export type ItemCondition = 'new' | 'like new' | 'gently used' | 'refurbished' | 'used';

export interface InventoryItem {
  item_id: number;
  item_name: string;
  item_category: string;
  item_subcategory?: string;
  item_condition: ItemCondition;
  purchase_price: number;
  sale_price: number;
  quantity_in_stock: number;
  purchase_date: string;
  sale_date?: string;
  profit_margin: number;
  description?: string;
}

export interface Category {
  id: number;
  name: string;
  subcategories: string[];
}

export interface InventoryStats {
  totalItems: number;
  totalValue: number;
  totalProfit: number;
  categoryStats: {
    [key: string]: {
      count: number;
      value: number;
      profit: number;
    };
  };
}