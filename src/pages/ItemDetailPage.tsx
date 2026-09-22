import React, { useState } from 'react';
import { useCMS } from '../context/CMSContext';
import { 
  ArrowLeft, 
  ShoppingBag, 
  Check, 
  Plus, 
  Minus, 
  ThermometerSnowflake, 
  ShieldCheck, 
  PackageCheck,
  Phone
} from 'lucide-react';
import { SafeImage } from '../components/SafeImage';

export const ItemDetailPage: React.FC = () => {
  const { products, selectedProductId, addToCart, navigateTo, siteConfig } = useCMS();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const product = products.find(p => p.id === selectedProductId) || products[0];

  if (!product) {
    return (
      <div className="bg-[#090A0C] text-white min-h-[60vh] flex flex-col items-center justify-center p-4">
        <h2 className="text-xl font-bold font-['Syne']">Produto não encontrado</h2>
        <button
          onClick={() => navigateTo('catalog')}
          className="mt-4 px-6 py-2.5 bg-amber-500 text-black font-bold rounded-xl text-xs"
        >
          Voltar ao Cardápio
        </button>
      </div>
    );
  }

  const handleAdd = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="bg-[#090A0C] text-[#F3F4F6] min-h-screen py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Breadcrumb */}
        <button 
          onClick={() => navigateTo('catalog')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-amber-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao Cardápio Completo</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 bg-[#12151B] p-6 sm:p-10 rounded-3xl border border-white/10">
          
          {/* Image */}
          <div className="relative h-80 sm:h-96 rounded-2xl overflow-hidden bg-black/50">
            <SafeImage 
              src={product.imageUrl} 
              alt={product.name}
              category={product.category}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
            
            <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
              {product.badge && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-black">
                  {product.badge}
                </span>
              )}
              {product.temperature === 'trincando' && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-600 text-white flex items-center gap-1.5 border border-blue-400/30">
                  <ThermometerSnowflake className="w-3.5 h-3.5" />
                  Câmara Fria -4°C
                </span>
              )}
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-black/60 text-zinc-300 border border-white/10">
                {product.volume}
              </span>
            </div>
          </div>

          {/* Info */}
          <div className="space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block">
                {product.categoryLabel}
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold font-['Syne'] text-white">
                {product.name}
              </h1>

              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-extrabold font-['Syne'] text-amber-400">
                  R$ {(product.price * quantity).toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-zinc-500 line-through">
                    R$ {(product.originalPrice * quantity).toFixed(2)}
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                {product.description}
              </p>

              {product.isCombo && product.comboItems && (
                <div className="p-4 rounded-xl bg-[#161B24] border border-amber-500/20 space-y-2">
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <PackageCheck className="w-4 h-4" />
                    Itens Inclusos no Combo:
                  </h4>
                  <ul className="space-y-1 text-xs text-zinc-300">
                    {product.comboItems.map((ci, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        <span>{ci}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-4 pt-4 border-t border-white/10">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-white/20 rounded-xl bg-black/40">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-10 h-10 flex items-center justify-center text-zinc-300 hover:text-white"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center text-sm font-bold text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    className="w-10 h-10 flex items-center justify-center text-zinc-300 hover:text-white"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={handleAdd}
                  className="flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-black font-extrabold text-sm hover:brightness-110 shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Adicionado ao Cooler!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Adicionar ao Cooler</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between text-xs text-zinc-400 pt-2">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Selo de Originalidade</span>
                </div>
                <a
                  href={`https://wa.me/${siteConfig.whatsapp.replace(/\D/g, '')}?text=Ol%C3%A1%2C%20tenho%20uma%20d%C3%BAvida%20sobre%20o%20produto%20${encodeURIComponent(product.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:underline flex items-center gap-1 font-medium"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Tirar dúvida no Whats</span>
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
