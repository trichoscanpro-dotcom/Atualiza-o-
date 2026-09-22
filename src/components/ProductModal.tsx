import React, { useState } from 'react';
import { useCMS } from '../context/CMSContext';
import { 
  X, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Check, 
  Sparkles, 
  ThermometerSnowflake, 
  ShieldCheck, 
  PackageCheck,
  Share2
} from 'lucide-react';
import { SafeImage } from './SafeImage';

export const ProductModal: React.FC = () => {
  const { products, selectedProductId, setSelectedProductId, addToCart } = useCMS();
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  if (!selectedProductId) return null;

  const product = products.find(p => p.id === selectedProductId);
  if (!product) return null;

  const handleAdd = () => {
    addToCart(product, quantity);
    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
      setSelectedProductId(null);
      setQuantity(1);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        onClick={() => setSelectedProductId(null)}
      />

      {/* Modal Dialog */}
      <div className="relative bg-[#14171E] border border-amber-500/20 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl z-10 text-white">
        
        {/* Close Button */}
        <button
          onClick={() => setSelectedProductId(null)}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-zinc-300 hover:text-white hover:bg-black transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image Area */}
        <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-black/50">
          <SafeImage 
            src={product.imageUrl} 
            alt={product.name}
            category={product.category}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#14171E] via-transparent to-black/40 pointer-events-none" />

          {/* Badges on image */}
          <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
            {product.badge && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-black shadow-md">
                {product.badge}
              </span>
            )}
            {product.temperature === 'trincando' && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-600/90 text-white flex items-center gap-1.5 backdrop-blur-sm border border-blue-400/30">
                <ThermometerSnowflake className="w-3.5 h-3.5" />
                Câmara Fria a -4°C
              </span>
            )}
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-black/60 text-zinc-300 border border-white/10 backdrop-blur-sm">
              {product.volume}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
              <span>{product.categoryLabel}</span>
              <span>•</span>
              <span className="text-zinc-400">{product.stock > 0 ? `${product.stock} un disponíveis` : 'Últimas unidades'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-['Syne'] text-white">
              {product.name}
            </h2>
          </div>

          <p className="text-sm text-zinc-300 leading-relaxed">
            {product.description}
          </p>

          {/* Combo Items breakdown if combo */}
          {product.isCombo && product.comboItems && product.comboItems.length > 0 && (
            <div className="p-3.5 rounded-xl bg-[#1A1F29] border border-amber-500/20 space-y-2">
              <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <PackageCheck className="w-4 h-4 text-amber-400" />
                O que vem incluso neste combo:
              </h3>
              <ul className="space-y-1.5">
                {product.comboItems.map((item, idx) => (
                  <li key={idx} className="text-xs text-zinc-200 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Assurance bullets */}
          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/10 text-xs text-zinc-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>100% Original c/ Selo</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Entrega em até 35 min</span>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-4">
            <div>
              <div className="text-xs text-zinc-400">Preço à vista:</div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-amber-400 font-['Syne']">
                  R$ {(product.price * quantity).toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-xs text-zinc-500 line-through">
                    R$ {(product.originalPrice * quantity).toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Quantity Selector */}
              <div className="flex items-center border border-white/20 rounded-xl bg-black/40 overflow-hidden">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-9 h-9 flex items-center justify-center text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center text-sm font-bold text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="w-9 h-9 flex items-center justify-center text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add Button */}
              <button
                onClick={handleAdd}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-black font-bold text-sm hover:brightness-110 shadow-lg shadow-amber-500/25 flex items-center gap-2 transition-all active:scale-95"
              >
                {addedAnimation ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Adicionado!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Adicionar</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
