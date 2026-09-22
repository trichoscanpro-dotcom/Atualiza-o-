export interface DeliveryZone {
  id: string;
  name: string;
  fee: number;
  estimatedMinutes: number;
}

export interface ProductItem {
  id: string;
  name: string;
  category: 'combos' | 'cervejas' | 'destilados' | 'vinhos' | 'sem_alcool' | 'gelo_essenciais' | 'snacks';
  categoryLabel: string;
  volume: string; // Ex: '350ml', '750ml', '1L', '5kg'
  price: number;
  originalPrice?: number;
  temperature: 'trincando' | 'ambiente';
  isCombo?: boolean;
  comboItems?: string[];
  description: string;
  imageUrl: string;
  badge?: string; // 'Mais Pedido', 'Oferta Especial', 'Geladaça', 'Destaque'
  isFeatured?: boolean;
  stock: number;
}

export interface CartItem {
  product: ProductItem;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  neighborhood: string;
  complement?: string;
  paymentMethod: 'pix' | 'card_delivery' | 'cash';
  changeFor?: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  status: 'recebido' | 'separando' | 'em_rota' | 'entregue' | 'cancelado';
  createdAt: string;
  notes?: string;
}

export interface SiteConfig {
  companyName: string;
  tagline: string;
  description: string;
  logoUrl: string;
  primaryColor: string;
  accentColor: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  instagramUrl: string;
  isOpenNow: boolean;
  openingHoursText: string;
  estimatedDeliveryText: string;
  minimumOrder: number;
  freeDeliveryThreshold: number;
  announcementTicker: string;
  sectionOrder: string[];
}

export interface PageSEO {
  pageId: string;
  pageName: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  ogImage?: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  isFeatured: boolean;
  tags?: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  neighborhood: string;
  comment: string;
  rating: number;
  favoriteItem: string;
  deliveryTime: string;
  avatarUrl: string;
  date: string;
  isFeatured: boolean;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export type CRMStatus =
  | 'Novo contato'
  | 'Aguardando resposta'
  | 'Pedido em montagem'
  | 'Aguardando pagamento'
  | 'Pedido confirmado'
  | 'Saiu para entrega'
  | 'Entregue'
  | 'Cancelado';

export interface CRMLead {
  id: string;
  customerName: string;
  phone: string;
  dateTime: string;
  lastMessage: string;
  orderedProducts: {
    name: string;
    quantity: number;
    unitPrice: number;
  }[];
  totalValue: number;
  status: CRMStatus;
  address?: string;
  paymentMethod?: string;
  notes?: string;
}

export type PageRoute = 
  | 'home'
  | 'catalog'
  | 'about'
  | 'track'
  | 'faq'
  | 'contact'
  | 'privacy'
  | 'terms'
  | 'admin-login'
  | 'admin-panel'
  | 'item-detail'
  | 'portfolio'
  | 'testimonials';
