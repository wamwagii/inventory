import { InventoryItem, Category, User } from '@/types';
import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');

// Ensure data directory exists
const ensureDataDir = () => {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

// Generic read/write functions
const readJSON = <T>(filename: string, defaultValue: T): T => {
  ensureDataDir();
  const filePath = path.join(dataDir, filename);
  try {
    if (!fs.existsSync(filePath)) {
      writeJSON(filename, defaultValue);
      return defaultValue;
    }
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return defaultValue;
  }
};

const writeJSON = <T>(filename: string, data: T): void => {
  ensureDataDir();
  const filePath = path.join(dataDir, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// Users
export const getUsers = (): User[] => {
  return readJSON('users.json', [{ username: 'admin', password: 'admin' }]);
};

export const saveUsers = (users: User[]): void => {
  writeJSON('users.json', users);
};

// Items
export const getItems = (): InventoryItem[] => {
  const defaultItems: InventoryItem[] = [
    {
      item_id: 1,
      item_name: "Samsung 4K Smart TV 55\"",
      item_category: "Electronics",
      item_subcategory: "Televisions",
      item_condition: "like new",
      purchase_price: 45000,
      sale_price: 55000,
      quantity_in_stock: 5,
      purchase_date: "2024-01-15",
      profit_margin: 10000,
      description: "55-inch 4K Smart TV with HDR"
    },
    {
      item_id: 2,
      item_name: "Leather Sofa Set",
      item_category: "Furniture",
      item_subcategory: "Sofas",
      item_condition: "new",
      purchase_price: 75000,
      sale_price: 95000,
      quantity_in_stock: 3,
      purchase_date: "2024-01-10",
      profit_margin: 20000,
      description: "3-seater leather sofa with cushions"
    }
  ];
  return readJSON('items.json', defaultItems);
};

export const saveItems = (items: InventoryItem[]): void => {
  writeJSON('items.json', items);
};

// Categories
export const getCategories = (): Category[] => {
  const defaultCategories: Category[] = [
    {
      id: 1,
      name: "Electronics",
      subcategories: ["Televisions", "Remote Controls", "Routers", "Iron Boxes", "Light Bulbs", "Aerials", "Smartphones", "Laptops"]
    },
    {
      id: 2,
      name: "Furniture",
      subcategories: ["Sofas", "Chairs", "Tables", "Beds", "Wardrobes", "Desks", "Bookshelves"]
    },
    {
      id: 3,
      name: "Motorcycles",
      subcategories: ["Street Bikes", "Cruisers", "Sport Bikes", "Scooters", "Off-road"]
    },
    {
      id: 4,
      name: "Bicycles",
      subcategories: ["Mountain Bikes", "Road Bikes", "Hybrid Bikes", "Electric Bikes", "BMX"]
    }
  ];
  return readJSON('categories.json', defaultCategories);
};

export const saveCategories = (categories: Category[]): void => {
  writeJSON('categories.json', categories);
};