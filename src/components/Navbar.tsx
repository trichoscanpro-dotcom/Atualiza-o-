import React, { useState } from 'react';
import { useCMS } from '../context/CMSContext';
import { beverageImages } from '../assets/beverageImages';
import { getWhatsAppUrl, HIGH_CONVERTING_MESSAGES } from '../utils/whatsapp';
import { 
  ShoppingBag, 
  MapPin, 
  Phone, 
  Clock, 
  Menu, 
  X, 
  Flame, 
  Compass, 
  Package, 
  Lock, 
  ChevronDown,
  Sparkles,
  Beer
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    siteConfig, 
    cartCount, 
    subtotal, 
    setIsCartOpen, 
    currentRoute, 
    navigateTo,
    deliveryZones,
    selectedZone,
    setSelectedZone
  } = useCMS();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [zoneDropdownOpen, setZoneDropdownOpen] = useState(false);

  const navLinks = [
    { label: 'Início', route: 'home' as const },
    { label: 'Cardápio & Bebidas', route: 'catalog' as const },
    { label: 'A Adega', route: 'about' as const },
    { label: 'Rastrear Pedido', route: 'track' as const },
    { label: 'Dúvidas', route: 'faq' as const },
    { label: 'Contato', route: 'contact' as const },
  ];

  return (
    <header className="sticky top-0 z-40 w-full flex flex-col font-sans">
      {/* 1. Ticker Noturno Superior */}
      <div className="bg-[#050608] border-b border-amber-500/20 text-zinc-300 text-xs py-2 px-4 select-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="flex h-2 w-2 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-emerald-400 font-bold uppercase tracking-wider text-[11px]">
              {siteConfig.isOpenNow ? 'Aberto Agora' : 'Abre às 18h'}
            </span>
            <span className="text-zinc-600 hidden sm:inline">•</span>
            <span className="text-zinc-300 text-[11px] font-medium hidden sm:inline">
              Tempo médio de entrega: <strong className="text-amber-400">{selectedZone.estimatedMinutes} min</strong>
            </span>
            <span className="text-zinc-600 hidden md:inline">•</span>
            <span className="text-amber-300 text-[11px] hidden md:inline">
              {siteConfig.announcementTicker}
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0 text-[11px]">
            {/* WhatsApp Link */}
            <a 
              href={getWhatsAppUrl(siteConfig.whatsapp, HIGH_CONVERTING_MESSAGES.general)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-emerald-400 transition-colors flex items-center gap-1.5 font-medium"
              title="Fazer pedido expresso via WhatsApp"
            >
              <Phone className="w-3 h-3 text-emerald-400" />
              <span className="hidden sm:inline">Whats da Adega</span>
            </a>

            <span className="text-zinc-700">|</span>

            {/* Admin shortcut */}
            <button
              onClick={() => navigateTo('admin-login')}
              className="text-zinc-500 hover:text-amber-400 transition-colors flex items-center gap-1 cursor-pointer"
              title="Acesso Administrativo"
            >
              <Lock className="w-3 h-3" />
              <span className="hidden lg:inline text-[10px] uppercase font-bold tracking-wider">CMS</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar with Glassmorphism */}
      <div className="bg-[#0E1116]/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Brand Logo - ICON ONLY per requirements */}
          <button 
            onClick={() => navigateTo('home')}
            className="flex items-center group text-left focus:outline-none shrink-0 min-h-[44px] cursor-pointer"
            aria-label="Ir para página inicial da Adega Bigode"
          >
            {/* Brand Logo Emblem with Animated Neon Amber Glow */}
            <div className="relative shrink-0">
              {/* Pulsing neon back-glow */}
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-300 to-yellow-500 opacity-60 blur-xs group-hover:opacity-100 group-hover:blur-sm transition-all duration-500 animate-pulse pointer-events-none" />
              
              <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 p-0.5 shadow-xl shadow-amber-500/30 group-hover:scale-105 transition-all duration-300 shrink-0 overflow-hidden animate-amber-glow">
                <img 
                  src={siteConfig.logoUrl || beverageImages.brandLogo} 
                  alt="Adega Bigode" 
                  className="w-full h-full object-cover rounded-[10px] transform group-hover:scale-110 group-hover:rotate-1 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                {/* Dynamic Gloss / Sheen overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          </button>

          {/* Neighborhood Selector Pill (Desktop & Tablet) */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setZoneDropdownOpen(!zoneDropdownOpen)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#181C23] border border-amber-500/30 text-xs text-zinc-300 hover:border-amber-400 transition-all hover:bg-[#1E232C]"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <div className="text-left">
                <span className="text-[10px] block text-zinc-400 uppercase font-semibold">Entregar em:</span>
                <span className="font-bold text-white flex items-center gap-1">
                  {selectedZone.name}
                  <ChevronDown className="w-3 h-3 text-zinc-400" />
                </span>
              </div>
            </button>

            {zoneDropdownOpen && (
              <div className="absolute left-0 mt-2 w-64 bg-[#14181F] border border-amber-500/30 rounded-xl shadow-2xl p-2 z-50 text-xs space-y-1">
                <div className="px-2 py-1 text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                  Selecione seu bairro:
                </div>
                {deliveryZones.map(zone => (
                  <button
                    key={zone.id}
                    onClick={() => {
                      setSelectedZone(zone);
                      setZoneDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between transition-colors ${
                      selectedZone.id === zone.id 
                        ? 'bg-amber-500 text-black font-bold' 
                        : 'text-zinc-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span>{zone.name}</span>
                    <span className="text-[10px] opacity-80">R$ {zone.fee.toFixed(2)}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
            {navLinks.map((link) => (
              <button
                key={link.route}
                onClick={() => navigateTo(link.route)}
                className={`transition-colors relative py-1 ${
                  currentRoute === link.route 
                    ? 'text-amber-400 font-bold' 
                    : 'text-zinc-300 hover:text-white'
                }`}
              >
                {link.label}
                {currentRoute === link.route && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* Actions: Cart & Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-black font-bold text-xs sm:text-sm hover:brightness-110 transition-all shadow-lg shadow-amber-500/20 active:scale-95"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2.5 w-4 h-4 rounded-full bg-black text-amber-400 text-[10px] font-extrabold flex items-center justify-center border border-amber-400">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline font-['Syne']">Meu Cooler</span>
              <span className="bg-black/20 px-2 py-0.5 rounded text-[11px] font-mono">
                R$ {subtotal.toFixed(2)}
              </span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-[#181C23] border border-white/10 text-zinc-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0F1217] border-b border-amber-500/20 px-4 py-4 space-y-4">
          {/* Mobile Neighborhood Selector */}
          <div className="p-3 rounded-xl bg-[#161A22] border border-white/10 space-y-1.5">
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" /> Bairro de Entrega:
            </span>
            <select
              value={selectedZone.id}
              onChange={(e) => {
                const z = deliveryZones.find(item => item.id === e.target.value);
                if (z) setSelectedZone(z);
              }}
              className="w-full bg-[#0A0C0E] border border-white/20 rounded-lg p-2 text-xs text-white"
            >
              {deliveryZones.map(zone => (
                <option key={zone.id} value={zone.id}>
                  {zone.name} — Taxa: R$ {zone.fee.toFixed(2)} ({zone.estimatedMinutes} min)
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => (
              <button
                key={link.route}
                onClick={() => {
                  navigateTo(link.route);
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                  currentRoute === link.route 
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                    : 'text-zinc-300 hover:bg-white/5'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400">
            <span>Aberto até as 04h</span>
            <a 
              href={getWhatsAppUrl(siteConfig.whatsapp, HIGH_CONVERTING_MESSAGES.general)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 font-bold hover:underline flex items-center gap-1"
            >
              Chamar no Whats (Pedido Rápido)
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
