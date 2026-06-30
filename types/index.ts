export type MenuCategory = 'mie' | 'dimsum' | 'minuman';

export interface Menu {
  id: number;
  name: string;
  slug: string;
  category: MenuCategory;
  description: string | null;
  price: number;
  spicyLevel: number;
  image: string | null;
  isActive: boolean;
}

export interface Package {
  id: number;
  name: string;
  description: string | null;
  price: number;
  badge: string | null;
  image: string | null;
  isActive: boolean;
}

export interface Outlet {
  id: number;
  name: string;
  city: string;
  address: string;
  openTime: string | null;
  mapsUrl: string | null;
  isOpen: boolean;
}

export interface Gallery {
  id: number;
  image: string;
  caption: string | null;
  category: string;
  order: number;
}

export interface Testimonial {
  id: number;
  name: string | null;
  rating: number;
  content: string;
  createdAt: string;
}

export interface HeroSlide {
  id: number;
  image: string;
  order: number;
  isActive: boolean;
}

export interface SocialMedia {
  id: number;
  name: string;
  icon: string;
  url: string;
  isActive: boolean;
  order: number;
}

export interface SiteContent {
  key: string;
  value: string;
}

export interface DashboardStats {
  totalMenus: number;
  totalPackages: number;
  totalOutlets: number;
  totalGalleries: number;
  totalTestimonials: number;
}

export interface AuthResponse {
  token: string;
  expiresIn: number;
}
