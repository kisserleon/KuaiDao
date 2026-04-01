export type Locale = "zh" | "en";

export interface Restaurant {
  id: string;
  name: string;
  nameZh: string;
  cuisine: CuisineType[];
  address: string;
  city: string;
  phone: string;
  rating: number;
  reviewCount: number;
  priceLevel: 1 | 2 | 3 | 4;
  imageUrl: string;
  images: string[];
  hours: string;
  description: string;
  descriptionZh: string;
  coordinates: { lat: number; lng: number };
  tags: string[];
}

export type CuisineType =
  | "川菜"
  | "粤菜"
  | "湘菜"
  | "火锅"
  | "烧烤"
  | "面食"
  | "小吃"
  | "奶茶"
  | "日料"
  | "韩餐"
  | "东南亚"
  | "其他";

export interface GroceryStore {
  id: string;
  name: string;
  nameZh: string;
  type: "supermarket" | "specialty" | "bakery" | "butcher";
  address: string;
  city: string;
  phone: string;
  rating: number;
  imageUrl: string;
  hours: string;
  specialties: string[];
  coordinates: { lat: number; lng: number };
}

export interface ServiceProvider {
  id: string;
  name: string;
  nameZh: string;
  category: ServiceCategory;
  description: string;
  descriptionZh: string;
  phone: string;
  email: string;
  languages: string[];
  rating: number;
  city: string;
  imageUrl: string;
}

export type ServiceCategory =
  | "accountant"
  | "lawyer"
  | "realtor"
  | "tutor"
  | "doctor"
  | "insurance"
  | "immigration"
  | "translation"
  | "other";

export interface CommunityEvent {
  id: string;
  title: string;
  titleZh: string;
  description: string;
  descriptionZh: string;
  date: string;
  time: string;
  location: string;
  city: string;
  imageUrl: string;
  category: "festival" | "community" | "workshop" | "food" | "culture" | "other";
  isFree: boolean;
  url?: string;
}
