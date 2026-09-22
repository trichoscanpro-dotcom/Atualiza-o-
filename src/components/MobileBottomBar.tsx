import React from 'react';
import { useCMS } from '../context/CMSContext';
import { Home, Beer, Search, ShoppingBag, Phone, Compass } from 'lucide-react';
import { getWhatsAppUrl, HIGH_CONVERTING_MESSAGES } from '../utils/whatsapp';

export const MobileBottomBar: React.FC = () => {
  const { currentRoute, navigateTo, cartCount, subtotal, setIsCartOpen, siteConfig } = useCMS();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0C0E12]/95 backdrop-blur-lg border-t border-amber-500/20 px-2 py-1.5 pb-[calc(0.375rem+env(safe-area-inset-bottom))]">
      <div className="flex items-center justify-between max-w-sm mx-auto px-1">
        
        {/* Início */}
        <button
          onClick={() => navigateTo('home')}
          className={`flex flex-col items-center justify-center min-w-[52px] min-h-[44px] gap-1 p-1 transition-colors active:scale-95 ${
            currentRoute === 'home' ? 'text-amber-400 font-bold' : 'text-zinc-400 hover:text-white'
          }`}
          aria-label="Ir para a página inicial"
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] leading-none">Início</span>
        </button>

        {/* Cardápio */}
        <button
          onClick={() => navigateTo('catalog')}
          className={`flex flex-col items-center justify-center min-w-[52px] min-h-[44px] gap-1 p-1 transition-colors active:scale-95 ${
            currentRoute === 'catalog' ? 'text-amber-400 font-bold' : 'text-zinc-400 hover:text-white'
          }`}
          aria-label="Abrir cardápio de bebidas"
        >
          <Beer className="w-5 h-5" />
          <span className="text-[10px] leading-none">Cardápio</span>
        </button>

        {/* Floating Cart Button in Center / Primary Action */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative -top-2.5 flex flex-col items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 text-black shadow-xl shadow-amber-500/30 border-2 border-[#0C0E12] active:scale-90 transition-transform cursor-pointer shrink-0"
          aria-label="Abrir cooler de compras"
        >
          <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] sm:min-w-[20px] sm:h-[20px] px-1 rounded-full bg-black text-amber-400 text-[10px] sm:text-[11px] font-extrabold flex items-center justify-center border border-amber-400">
              {cartCount}
            </span>
          )}
        </button>

        {/* Rastrear */}
        <button
          onClick={() => navigateTo('track')}
          className={`flex flex-col items-center justify-center min-w-[52px] min-h-[44px] gap-1 p-1 transition-colors active:scale-95 ${
            currentRoute === 'track' ? 'text-amber-400 font-bold' : 'text-zinc-400 hover:text-white'
          }`}
          aria-label="Rastrear pedido"
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px] leading-none">Rastrear</span>
        </button>

        {/* WhatsApp - Instant High Converting CTA */}
        <a
          href={getWhatsAppUrl(siteConfig.whatsapp, HIGH_CONVERTING_MESSAGES.general)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center min-w-[52px] min-h-[44px] gap-1 p-1 text-zinc-400 hover:text-emerald-400 transition-colors active:scale-95"
          title="Fazer pedido expresso no WhatsApp"
          aria-label="Fazer pedido no WhatsApp"
        >
          <div className="relative">
            <Phone className="w-5 h-5 text-emerald-400" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <span className="text-[10px] leading-none text-emerald-400 font-semibold">Whats</span>
        </a>

      </div>
    </div>
  );
};
