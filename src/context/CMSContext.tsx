import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  SiteConfig, 
  PageSEO, 
  ProductItem, 
  DeliveryZone, 
  CartItem, 
  Order, 
  PortfolioItem, 
  Testimonial, 
  FAQItem, 
  ContactMessage, 
  CRMLead,
  CRMStatus,
  PageRoute 
} from '../types';
import { 
  initialSiteConfig, 
  initialDeliveryZones, 
  initialProducts, 
  initialPortfolioItems, 
  initialTestimonials, 
  initialFAQs, 
  initialSEOList 
} from '../initialData';
import { beverageImages } from '../assets/beverageImages';

interface CMSContextType {
  // Navigation State
  currentRoute: PageRoute;
  navigateTo: (route: PageRoute) => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;

  // Site Configuration
  siteConfig: SiteConfig;
  updateSiteConfig: (newConfig: Partial<SiteConfig>) => void;
  toggleStoreStatus: () => void;

  // Delivery & Zones
  deliveryZones: DeliveryZone[];
  selectedZone: DeliveryZone;
  setSelectedZone: (zone: DeliveryZone) => void;
  updateDeliveryZones: (zones: DeliveryZone[]) => void;

  // Products & Catalog
  products: ProductItem[];
  addProduct: (item: Omit<ProductItem, 'id'> | ProductItem) => void;
  updateProduct: (idOrItem: string | ProductItem, item?: Partial<ProductItem>) => void;
  deleteProduct: (id: string) => void;

  // Cart System
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (product: ProductItem, qty?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, qty: number) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  couponCode: string;
  applyCoupon: (code: string) => { success: boolean; message: string };
  total: number;
  freeDeliveryRemaining: number;

  // Orders & Tracking
  orders: Order[];
  currentOrder: Order | null;
  createOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>) => Order;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;

  // Gallery / Portfolio
  portfolioItems: PortfolioItem[];
  addPortfolioItem: (item: Omit<PortfolioItem, 'id'>) => void;
  updatePortfolioItem: (id: string, item: Partial<PortfolioItem>) => void;
  deletePortfolioItem: (id: string) => void;

  // Testimonials
  testimonials: Testimonial[];
  addTestimonial: (item: Omit<Testimonial, 'id'>) => void;
  updateTestimonial: (id: string, item: Partial<Testimonial>) => void;
  deleteTestimonial: (id: string) => void;

  // FAQs
  faqs: FAQItem[];
  addFAQ: (item: Omit<FAQItem, 'id'>) => void;
  updateFAQ: (id: string, item: Partial<FAQItem>) => void;
  deleteFAQ: (id: string) => void;

  // Contact / Leads
  messages: ContactMessage[];
  leads: ContactMessage[];
  addLead: (lead: { name: string; phone: string; message: string }) => void;
  submitMessage: (msg: Omit<ContactMessage, 'id' | 'createdAt' | 'read'>) => void;
  markMessageAsRead: (id: string) => void;
  deleteMessage: (id: string) => void;

  // CRM Atendimento
  crmLeads: CRMLead[];
  addOrUpdateCRMLead: (lead: Omit<CRMLead, 'id'> & { id?: string }) => void;
  updateCRMStatus: (id: string, status: CRMStatus) => void;
  deleteCRMLead: (id: string) => void;

  // SEO
  seoList: PageSEO[];
  getCurrentSEO: () => PageSEO | undefined;
  updatePageSEO: (pageId: string, data: Partial<PageSEO>) => void;

  // Admin Auth
  isAdminAuthenticated: boolean;
  loginAdmin: (password: string) => boolean;
  logoutAdmin: () => void;
}

const STORAGE_KEYS = {
  CONFIG: 'bigode_site_config_v8',
  PRODUCTS: 'bigode_products_v4',
  ZONES: 'bigode_zones_v2',
  SELECTED_ZONE: 'bigode_selected_zone_v2',
  CART: 'bigode_cart_v2',
  ORDERS: 'bigode_orders_v2',
  PORTFOLIO: 'bigode_portfolio_v6',
  TESTIMONIALS: 'bigode_testimonials_v7',
  FAQS: 'bigode_faqs_v2',
  MESSAGES: 'bigode_messages_v2',
  CRM_LEADS: 'bigode_crm_leads_v1',
  SEO: 'bigode_seo_v4',
  AUTH: 'bigode_admin_auth_v2',
};

const CMSContext = createContext<CMSContextType | undefined>(undefined);

export const CMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation
  const [currentRoute, setCurrentRoute] = useState<PageRoute>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  // Site Config
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CONFIG);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...initialSiteConfig,
          ...parsed,
          companyName: parsed.companyName === 'Bigode Delivery' ? 'Adega Bigode Delivery' : (parsed.companyName || initialSiteConfig.companyName),
          logoUrl: parsed.logoUrl || initialSiteConfig.logoUrl,
        };
      }
      return initialSiteConfig;
    } catch {
      return initialSiteConfig;
    }
  });

  // Delivery Zones
  const [deliveryZones, setDeliveryZones] = useState<DeliveryZone[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ZONES);
      return saved ? JSON.parse(saved) : initialDeliveryZones;
    } catch {
      return initialDeliveryZones;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ZONES, JSON.stringify(deliveryZones));
    } catch (e) { console.error(e); }
  }, [deliveryZones]);

  const [selectedZone, setSelectedZoneState] = useState<DeliveryZone>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SELECTED_ZONE);
      return saved ? JSON.parse(saved) : initialDeliveryZones[0];
    } catch {
      return initialDeliveryZones[0];
    }
  });

  const setSelectedZone = (zone: DeliveryZone) => {
    setSelectedZoneState(zone);
    try {
      localStorage.setItem(STORAGE_KEYS.SELECTED_ZONE, JSON.stringify(zone));
    } catch {
      // ignore
    }
  };

  // Products
  const [products, setProducts] = useState<ProductItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (saved) {
        const parsed: ProductItem[] = JSON.parse(saved);
        return parsed.map(p => {
          if (p.id === 'beer-1' || p.name.toLowerCase().includes('heineken')) {
            const initialMatch = initialProducts.find(ip => ip.id === p.id);
            if (initialMatch) {
              return { ...p, imageUrl: initialMatch.imageUrl };
            }
          }
          return p;
        });
      }
      return initialProducts;
    } catch {
      return initialProducts;
    }
  });

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [currentOrder, setCurrentOrder] = useState<Order | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.length > 0 ? parsed[0] : null;
      }
      return null;
    } catch {
      return null;
    }
  });

  // Portfolio / Gallery
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PORTFOLIO);
      if (saved) {
        const parsed: PortfolioItem[] = JSON.parse(saved);
        return parsed.map(item => {
          if (item.id === 'gal-1' || item.title.toLowerCase().includes('câmara fria')) {
            return { ...item, imageUrl: beverageImages.beerColdFreezer };
          }
          return item;
        });
      }
      return initialPortfolioItems;
    } catch {
      return initialPortfolioItems;
    }
  });

  // Testimonials
  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TESTIMONIALS);
      return saved ? JSON.parse(saved) : initialTestimonials;
    } catch {
      return initialTestimonials;
    }
  });

  // FAQs
  const [faqs, setFaqs] = useState<FAQItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FAQS);
      return saved ? JSON.parse(saved) : initialFAQs;
    } catch {
      return initialFAQs;
    }
  });

  // Messages
  const [messages, setMessages] = useState<ContactMessage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MESSAGES);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // SEO
  const [seoList, setSeoList] = useState<PageSEO[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SEO);
      return saved ? JSON.parse(saved) : initialSEOList;
    } catch {
      return initialSEOList;
    }
  });

  // Admin Auth
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem(STORAGE_KEYS.AUTH) === 'true';
  });

  // Sync to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(siteConfig));
    } catch (e) { console.error(e); }
  }, [siteConfig]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) { console.error(e); }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch (e) { console.error(e); }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch (e) { console.error(e); }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PORTFOLIO, JSON.stringify(portfolioItems));
    } catch (e) { console.error(e); }
  }, [portfolioItems]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(testimonials));
    } catch (e) { console.error(e); }
  }, [testimonials]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.FAQS, JSON.stringify(faqs));
    } catch (e) { console.error(e); }
  }, [faqs]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
    } catch (e) { console.error(e); }
  }, [messages]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SEO, JSON.stringify(seoList));
    } catch (e) { console.error(e); }
  }, [seoList]);

  // Navigation Helper
  const navigateTo = (route: PageRoute) => {
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Site Config helpers
  const updateSiteConfig = (newConfig: Partial<SiteConfig>) => {
    setSiteConfig(prev => ({ ...prev, ...newConfig }));
  };

  const toggleStoreStatus = () => {
    setSiteConfig(prev => ({ ...prev, isOpenNow: !prev.isOpenNow }));
  };

  // Cart Calculations
  const cartCount = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  }, [cart]);

  const subtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  }, [cart]);

  const isFreeDelivery = subtotal >= siteConfig.freeDeliveryThreshold;
  const deliveryFee = cart.length === 0 ? 0 : (isFreeDelivery ? 0 : selectedZone.fee);

  const freeDeliveryRemaining = Math.max(0, siteConfig.freeDeliveryThreshold - subtotal);

  const discount = (subtotal * discountPercent) / 100;
  const total = Math.max(0, subtotal - discount + deliveryFee);

  const addToCart = (product: ProductItem, qty = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + qty } 
            : item
        );
      }
      return [...prev, { product, quantity: qty }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => item.product.id === productId ? { ...item, quantity: qty } : item));
  };

  const clearCart = () => {
    setCart([]);
    setCouponCode('');
    setDiscountPercent(0);
  };

  const applyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'BIGODE10' || clean === 'NOITE10') {
      setCouponCode(clean);
      setDiscountPercent(10);
      return { success: true, message: 'Cupom de 10% OFF aplicado com sucesso!' };
    }
    if (clean === 'PRIMEIRA' || clean === 'AFTERDARK') {
      setCouponCode(clean);
      setDiscountPercent(15);
      return { success: true, message: 'Cupom de 15% OFF de boas-vindas aplicado!' };
    }
    return { success: false, message: 'Cupom inválido ou expirado. Tente BIGODE10' };
  };

  const updateDeliveryZones = (zones: DeliveryZone[]) => {
    setDeliveryZones(zones);
  };

  // Products CRUD
  const addProduct = (item: Omit<ProductItem, 'id'> | ProductItem) => {
    const newItem: ProductItem = 'id' in item && item.id ? (item as ProductItem) : { ...item, id: `prod-${Date.now()}` };
    setProducts(prev => [newItem, ...prev]);
  };

  const updateProduct = (idOrItem: string | ProductItem, updated?: Partial<ProductItem>) => {
    if (typeof idOrItem === 'string') {
      setProducts(prev => prev.map(p => p.id === idOrItem ? { ...p, ...updated } : p));
    } else {
      setProducts(prev => prev.map(p => p.id === idOrItem.id ? { ...p, ...idOrItem } : p));
    }
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  // Orders
  const createOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>): Order => {
    const newOrder: Order = {
      ...orderData,
      id: `BG-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      status: 'recebido'
    };
    setOrders(prev => [newOrder, ...prev]);
    setCurrentOrder(newOrder);
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    if (currentOrder && currentOrder.id === orderId) {
      setCurrentOrder(prev => prev ? { ...prev, status } : null);
    }
  };

  // Portfolio / Gallery CRUD
  const addPortfolioItem = (item: Omit<PortfolioItem, 'id'>) => {
    setPortfolioItems(prev => [{ ...item, id: `gal-${Date.now()}` }, ...prev]);
  };

  const updatePortfolioItem = (id: string, item: Partial<PortfolioItem>) => {
    setPortfolioItems(prev => prev.map(p => p.id === id ? { ...p, ...item } : p));
  };

  const deletePortfolioItem = (id: string) => {
    setPortfolioItems(prev => prev.filter(p => p.id !== id));
  };

  // Testimonials CRUD
  const addTestimonial = (item: Omit<Testimonial, 'id'>) => {
    setTestimonials(prev => [{ ...item, id: `dep-${Date.now()}` }, ...prev]);
  };

  const updateTestimonial = (id: string, item: Partial<Testimonial>) => {
    setTestimonials(prev => prev.map(t => t.id === id ? { ...t, ...item } : t));
  };

  const deleteTestimonial = (id: string) => {
    setTestimonials(prev => prev.filter(t => t.id !== id));
  };

  // FAQs CRUD
  const addFAQ = (item: Omit<FAQItem, 'id'>) => {
    setFaqs(prev => [...prev, { ...item, id: `faq-${Date.now()}` }]);
  };

  const updateFAQ = (id: string, item: Partial<FAQItem>) => {
    setFaqs(prev => prev.map(f => f.id === id ? { ...f, ...item } : f));
  };

  const deleteFAQ = (id: string) => {
    setFaqs(prev => prev.filter(f => f.id !== id));
  };

  // Messages
  const submitMessage = (msg: Omit<ContactMessage, 'id' | 'createdAt' | 'read'>) => {
    const newMsg: ContactMessage = {
      ...msg,
      id: `msg-${Date.now()}`,
      createdAt: new Date().toLocaleDateString('pt-BR') + ' às ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      read: false
    };
    setMessages(prev => [newMsg, ...prev]);
  };

  const markMessageAsRead = (id: string) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m));
  };

  const deleteMessage = (id: string) => {
    setMessages(prev => prev.filter(m => m.id !== id));
  };

  const addLead = (lead: { name: string; phone: string; message: string }) => {
    submitMessage({
      name: lead.name,
      phone: lead.phone,
      message: lead.message,
      email: '',
      subject: 'Contato / Evento'
    });
  };

  // CRM State & Methods
  const initialCRMLeads: CRMLead[] = [
    {
      id: 'lead-1',
      customerName: 'Lucas Ferreira',
      phone: '+55 38 99812-3344',
      dateTime: 'Hoje, 20:45',
      lastMessage: 'Quero uma Heineken de 300 ml e gelo',
      orderedProducts: [
        { name: 'Heineken Long Neck 330ml', quantity: 6, unitPrice: 8.49 },
        { name: 'Saco de Gelo Filtrado em Cubos 5kg', quantity: 1, unitPrice: 14.90 }
      ],
      totalValue: 65.84,
      status: 'Pedido em montagem',
      address: 'Av. Sanitária, 450 - Centro',
      paymentMethod: 'Pix Instantâneo'
    },
    {
      id: 'lead-2',
      customerName: 'Mariana Duarte',
      phone: '+55 38 98845-1290',
      dateTime: 'Hoje, 20:18',
      lastMessage: 'O motoboy já saiu?',
      orderedProducts: [
        { name: 'Combo After Dark: Black Label 1L + 4 Red Bull', quantity: 1, unitPrice: 199.90 }
      ],
      totalValue: 207.40,
      status: 'Saiu para entrega',
      address: 'Rua das Palmeiras, 112 - Jardins',
      paymentMethod: 'Cartão na Entrega'
    },
    {
      id: 'lead-3',
      customerName: 'Rodrigo Alves',
      phone: '+55 38 99120-7788',
      dateTime: 'Hoje, 19:50',
      lastMessage: 'Qual o valor da Heineken 300ml?',
      orderedProducts: [],
      totalValue: 0,
      status: 'Novo contato'
    },
    {
      id: 'lead-4',
      customerName: 'Carla Silveira',
      phone: '+55 38 99933-5511',
      dateTime: 'Hoje, 19:15',
      lastMessage: 'Aprovado! Aguardo aqui.',
      orderedProducts: [
        { name: 'Corona Extra 330ml', quantity: 12, unitPrice: 8.99 },
        { name: 'Limão Taiti Selecionado 500g', quantity: 1, unitPrice: 6.90 }
      ],
      totalValue: 114.78,
      status: 'Pedido confirmado',
      address: 'Rua Bela Vista, 89 - Bairro Ibituruna',
      paymentMethod: 'Pix Instantâneo'
    }
  ];

  const [crmLeads, setCrmLeads] = useState<CRMLead[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CRM_LEADS);
      return saved ? JSON.parse(saved) : initialCRMLeads;
    } catch {
      return initialCRMLeads;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CRM_LEADS, JSON.stringify(crmLeads));
    } catch (e) { console.error(e); }
  }, [crmLeads]);

  const addOrUpdateCRMLead = (leadData: Omit<CRMLead, 'id'> & { id?: string }) => {
    setCrmLeads(prev => {
      if (leadData.id) {
        const index = prev.findIndex(l => l.id === leadData.id);
        if (index >= 0) {
          const updated = [...prev];
          updated[index] = { ...updated[index], ...leadData, id: leadData.id };
          return updated;
        }
      }
      if (leadData.phone) {
        const cleanPhone = leadData.phone.replace(/\D/g, '');
        if (cleanPhone) {
          const phoneMatch = prev.findIndex(l => l.phone.replace(/\D/g, '') === cleanPhone);
          if (phoneMatch >= 0) {
            const updated = [...prev];
            updated[phoneMatch] = {
              ...updated[phoneMatch],
              ...leadData,
              dateTime: leadData.dateTime || new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            };
            return updated;
          }
        }
      }

      const newLead: CRMLead = {
        ...leadData,
        id: leadData.id || `lead-${Date.now()}`,
        dateTime: leadData.dateTime || new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      };
      return [newLead, ...prev];
    });
  };

  const updateCRMStatus = (id: string, status: CRMStatus) => {
    setCrmLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
  };

  const deleteCRMLead = (id: string) => {
    setCrmLeads(prev => prev.filter(l => l.id !== id));
  };

  // SEO
  const getCurrentSEO = () => {
    return seoList.find(s => s.pageId === currentRoute) || seoList[0];
  };

  const updatePageSEO = (pageId: string, data: Partial<PageSEO>) => {
    setSeoList(prev => prev.map(s => s.pageId === pageId ? { ...s, ...data } : s));
  };

  // Admin Auth
  const loginAdmin = (password: string) => {
    if (password === 'admin123' || password === 'bigode2026') {
      setIsAdminAuthenticated(true);
      sessionStorage.setItem(STORAGE_KEYS.AUTH, 'true');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem(STORAGE_KEYS.AUTH);
  };

  return (
    <CMSContext.Provider value={{
      currentRoute,
      navigateTo,
      selectedProductId,
      setSelectedProductId,
      siteConfig,
      updateSiteConfig,
      toggleStoreStatus,
      deliveryZones,
      selectedZone,
      setSelectedZone,
      updateDeliveryZones,
      products,
      addProduct,
      updateProduct,
      deleteProduct,
      cart,
      isCartOpen,
      setIsCartOpen,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      cartCount,
      subtotal,
      deliveryFee,
      discount,
      couponCode,
      applyCoupon,
      total,
      freeDeliveryRemaining,
      orders,
      currentOrder,
      createOrder,
      updateOrderStatus,
      portfolioItems,
      addPortfolioItem,
      updatePortfolioItem,
      deletePortfolioItem,
      testimonials,
      addTestimonial,
      updateTestimonial,
      deleteTestimonial,
      faqs,
      addFAQ,
      updateFAQ,
      deleteFAQ,
      messages,
      leads: messages,
      addLead,
      submitMessage,
      markMessageAsRead,
      deleteMessage,
      crmLeads,
      addOrUpdateCRMLead,
      updateCRMStatus,
      deleteCRMLead,
      seoList,
      getCurrentSEO,
      updatePageSEO,
      isAdminAuthenticated,
      loginAdmin,
      logoutAdmin,
    }}>
      {children}
    </CMSContext.Provider>
  );
};

export const useCMS = () => {
  const context = useContext(CMSContext);
  if (!context) {
    throw new Error('useCMS must be used within a CMSProvider');
  }
  return context;
};
