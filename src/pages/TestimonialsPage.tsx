import React from 'react';
import { useCMS } from '../context/CMSContext';
import { Star, MessageCircle, ShieldCheck, Flame, ShoppingBag } from 'lucide-react';
import { SafeImage } from '../components/SafeImage';

export const TestimonialsPage: React.FC = () => {
  const { testimonials, siteConfig, setIsCartOpen } = useCMS();

  return (
    <div className="bg-[#090A0C] text-[#F3F4F6] min-h-screen py-12 px-4 sm:px-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center justify-center gap-1.5">
            <Flame className="w-4 h-4 text-amber-400" />
            Voz dos Clientes da Região
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-['Syne'] text-white">
            AVALIAÇÕES & EXPERIÊNCIAS
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            A opinião sincera de quem pediu de madrugada, recebeu as bebidas estalando de geladas e nunca mais pediu em outro lugar.
          </p>
        </div>

        {/* Big Score Summary Banner */}
        <div className="bg-[#12151B] border border-amber-500/20 p-6 sm:p-8 rounded-3xl flex flex-col sm:flex-row items-center justify-around gap-6 text-center sm:text-left">
          <div className="flex items-center gap-4">
            <span className="text-5xl sm:text-6xl font-extrabold font-['Syne'] text-amber-400">
              4.9
            </span>
            <div>
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <span className="text-xs text-zinc-400 mt-1 block">Mais de 1.400 entregas realizadas</span>
            </div>
          </div>

          <div className="text-xs text-zinc-400 space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-emerald-400 font-bold">99.4%</span>
              <span>Bebidas entregues na temperatura ideal (-4°C)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-amber-400 font-bold">28 min</span>
              <span>Tempo médio de entrega registrado no WhatsApp</span>
            </div>
          </div>

          <button
            onClick={() => setIsCartOpen(true)}
            className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-amber-500/20"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Fazer Meu Pedido</span>
          </button>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map(item => (
            <div
              key={item.id}
              className="p-6 rounded-2xl bg-[#12151B] border border-white/10 flex flex-col justify-between space-y-4 hover:border-amber-500/30 transition-all shadow-lg"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-[10px] text-zinc-500">{item.date}</span>
                </div>

                <p className="text-xs sm:text-sm text-zinc-300 italic leading-relaxed">
                  "{item.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <SafeImage 
                    src={item.avatarUrl} 
                    alt={item.name}
                    category="default"
                    className="w-10 h-10 rounded-full object-cover border border-amber-500/30" 
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">{item.name}</span>
                    <span className="text-[11px] text-zinc-400">{item.neighborhood}</span>
                  </div>
                </div>

                <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-1 rounded">
                  {item.deliveryTime}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
