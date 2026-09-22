import React from 'react';
import { useCMS } from '../context/CMSContext';
import { beverageImages } from '../assets/beverageImages';
import { 
  Phone, 
  MapPin, 
  Instagram, 
  Clock, 
  ShieldAlert, 
  Lock, 
  Sparkles, 
  CreditCard, 
  QrCode, 
  Banknote,
  Heart
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { siteConfig, navigateTo } = useCMS();

  return (
    <footer className="bg-[#060709] border-t border-white/10 text-zinc-400 font-sans pb-20 lg:pb-0">
      
      {/* 1. Legal Warning Banner for Alcohol Compliance (+18) */}
      <div className="bg-[#12151B] border-b border-amber-500/20 py-3.5 px-4 text-center">
        <div className="max-w-5xl mx-auto flex items-center justify-center gap-3 text-xs sm:text-sm text-amber-300 font-medium">
          <div className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold shrink-0 text-xs">
            18+
          </div>
          <span>
            <strong>BEBA COM MODERAÇÃO.</strong> A venda de bebidas alcoólicas é proibida para menores de 18 anos (Lei Federal nº 8.069/1990). Se beber, vá de Bigode e não dirija.
          </span>
        </div>
      </div>

      {/* 2. Main Footer Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Col 1: Brand & Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 p-0.5 shadow-lg shadow-amber-500/25 shrink-0 overflow-hidden">
                <img 
                  src={siteConfig.logoUrl || beverageImages.brandLogo} 
                  alt="Logo Oficial Adega Bigode Delivery" 
                  className="w-full h-full object-cover rounded-[10px]"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-title font-extrabold text-xs text-amber-400 tracking-wider">ADEGA</span>
                  <span className="font-title font-extrabold text-lg text-white tracking-tight">BIGODE</span>
                  <span className="font-title font-bold text-lg text-amber-400 tracking-wide">DELIVERY</span>
                </div>
                <span className="block text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">Adega After Dark • 18h às 04h</span>
              </div>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed">
              A curadoria noturna da sua cidade. Cervejas estalando de geladas a -4°C, destilados 100% originais e combos completos entregues em minutos.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a 
                href={siteConfig.instagramUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-zinc-300 hover:text-amber-400 hover:border-amber-400 transition-colors"
                title="Instagram da Adega"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href={`https://wa.me/${siteConfig.whatsapp.replace(/\D/g, '')}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 hover:bg-emerald-500 hover:text-black transition-colors"
                title="WhatsApp Oficial"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Horários & Localização */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-title flex items-center gap-1.5 text-amber-400">
              <Clock className="w-4 h-4" />
              Horário de Atendimento
            </h3>

            <div className="text-xs space-y-2 text-zinc-300">
              <p className="font-semibold text-white">Terça a Domingo:</p>
              <p className="text-zinc-400">Das 18h às 04h da madrugada</p>
              <p className="font-semibold text-white pt-1">Sextas e Sábados:</p>
              <p className="text-zinc-400">Plantão After Dark até as 05h</p>
            </div>

            <div className="pt-2 text-xs text-zinc-400 space-y-1">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{siteConfig.address}</span>
              </div>
            </div>
          </div>

          {/* Col 3: Links Rápidos */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-title text-amber-400">
              Navegação Rápida
            </h3>

            <ul className="text-xs space-y-2.5">
              <li>
                <button onClick={() => navigateTo('home')} className="hover:text-amber-300 transition-colors">
                  Início (Vitrine Noturna)
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('catalog')} className="hover:text-amber-300 transition-colors">
                  Cardápio Completo de Bebidas
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('about')} className="hover:text-amber-300 transition-colors">
                  A Adega Física & História
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('track')} className="hover:text-amber-300 transition-colors">
                  Acompanhar Meu Pedido
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('faq')} className="hover:text-amber-300 transition-colors">
                  Dúvidas Frequentes (FAQ)
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('contact')} className="hover:text-amber-300 transition-colors">
                  Fale Conosco
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Pagamentos & Selos de Confiança */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-title text-amber-400">
              Pagamento & Segurança
            </h3>

            <p className="text-xs text-zinc-400 leading-relaxed">
              Pague com agilidade na tela via Pix ou na maquininha sem contato ao receber sua entrega.
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              <div className="px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 flex items-center gap-1.5 text-[11px] text-zinc-200">
                <QrCode className="w-3.5 h-3.5 text-emerald-400" />
                <span>Pix Instantâneo</span>
              </div>
              <div className="px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 flex items-center gap-1.5 text-[11px] text-zinc-200">
                <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                <span>Cartão Déb/Créd</span>
              </div>
              <div className="px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 flex items-center gap-1.5 text-[11px] text-zinc-200">
                <Banknote className="w-3.5 h-3.5 text-blue-400" />
                <span>Dinheiro c/ Troco</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => navigateTo('admin-login')}
                className="inline-flex items-center gap-1.5 text-[11px] text-zinc-500 hover:text-amber-400 transition-colors py-1"
              >
                <Lock className="w-3 h-3" />
                <span>Área Restrita / Painel Administrativo</span>
              </button>
            </div>
          </div>

        </div>

        {/* 3. Bottom Credits */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500">
          <div>
            © {new Date().getFullYear()} {siteConfig.companyName}. Todos os direitos reservados.
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => navigateTo('privacy')} className="hover:text-zinc-300 transition-colors">
              Privacidade
            </button>
            <span>•</span>
            <button onClick={() => navigateTo('terms')} className="hover:text-zinc-300 transition-colors">
              Termos de Uso
            </button>
            <span>•</span>
            <span className="text-amber-400 font-semibold">After Dark Experience</span>
          </div>
        </div>
      </div>

    </footer>
  );
};
