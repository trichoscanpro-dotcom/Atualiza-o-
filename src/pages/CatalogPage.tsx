import React, { useState } from 'react';
import { useCMS } from '../context/CMSContext';
import { 
  Search, 
  Plus, 
  Check, 
  Flame, 
  ThermometerSnowflake, 
  Filter, 
  ShoppingBag,
  Package,
  Sparkles
} from 'lucide-react';
import { ProductItem } from '../types';
import { SafeImage } from '../components/SafeImage';

export const CatalogPage: React.FC = () => {
  const { products, addToCart, setSelectedProductId, setIsCartOpen } = useCMS();
  const [selectedCat, setSelectedCat] = useState<string>('todos');
  const [search, setSearch] = useState('');
  const [addedItem, setAddedItem] = useState<string | null>(null);

  const categories = [
    { id: 'todos', label: 'Todos os Produtos', icon: '⚡' },
    { id: 'combos', label: 'Combos da Noite', icon: '🔥' },
    { id: 'cervejas', label: 'Cervejas Trincando', icon: '🍺' },
    { id: 'destilados', label: 'Destilados & Whiskies', icon: '🥃' },
    { id: 'vinhos', label: 'Vinhos & Espumantes', icon: '🍷' },
    { id: 'gelo_essenciais', label: 'Gelo & Carvão', icon: '🧊' },
    { id: 'sem_alcool', label: 'Energéticos & Refri', icon: '⚡' },
    { id: 'snacks', label: 'Snacks & Petiscos', icon: '🥨' },
  ];

  const filtered = products.filter(p => {
    const matchCat = selectedCat === 'todos' || p.category === selectedCat;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                        p.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleAdd = (product: ProductItem, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAddedItem(product.id);
    setTimeout(() => setAddedItem(null), 1200);
  };

  return (
    <div className="bg-[#090A0C] text-[#F3F4F6] min-h-screen py-6 sm:py-10 px-3 sm:px-6 pb-24 lg:pb-12 overflow-x-hidden">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        
        {/* Page Header */}
        <div className="text-center space-y-2 sm:space-y-3 max-w-2xl mx-auto px-1">
          <span className="text-[11px] sm:text-xs font-bold text-amber-400 uppercase tracking-widest">
            Adega Completa na Sua Mão
          </span>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold font-title text-white leading-tight">
            CARDÁPIO DE BEBIDAS
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-lg mx-auto">
            Escolha suas bebidas geladas, destilados com procedência e combos prontos para a entrega expressa no seu bairro.
          </p>
        </div>

        {/* Filters and Search Bar */}
        <div className="bg-[#12151B] p-3 sm:p-4 rounded-2xl border border-white/10 space-y-3 sm:space-y-4">
          
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input 
              type="text"
              placeholder="Buscar cerveja, whisky, gin, gelo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#0B0D10] border border-white/15 rounded-xl pl-10 sm:pl-11 pr-4 py-2.5 sm:py-3 text-xs sm:text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCat(cat.id)}
                className={`px-3 sm:px-4 py-2 rounded-xl text-[11px] sm:text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 active:scale-95 cursor-pointer ${
                  selectedCat === cat.id
                    ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                    : 'bg-[#181C24] text-zinc-300 hover:text-white hover:bg-white/10 border border-white/10'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-zinc-400 px-1">
          <span>Mostrando <strong>{filtered.length}</strong> produtos</span>
          <button
            onClick={() => setIsCartOpen(true)}
            className="text-amber-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Ver Cooler ({filtered.length})</span>
          </button>
        </div>

        {/* Product Grid */}
        {filtered.length === 0 ? (
          <div className="py-16 sm:py-20 text-center space-y-3 bg-[#12151A] rounded-2xl border border-white/10 p-4">
            <Package className="w-10 h-10 sm:w-12 sm:h-12 text-zinc-600 mx-auto" />
            <h3 className="text-sm sm:text-base font-bold text-white">Nenhum produto encontrado</h3>
            <p className="text-xs text-zinc-400">Tente buscar por outro termo ou selecione "Todos os Produtos".</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-6">
            {filtered.map(product => (
              <div
                key={product.id}
                onClick={() => setSelectedProductId(product.id)}
                className="group bg-[#12151B] border border-white/10 hover:border-amber-500/50 rounded-xl sm:rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/10 cursor-pointer"
              >
                <div>
                  {/* Image */}
                  <div className="relative h-36 sm:h-52 w-full overflow-hidden bg-black/40">
                    <SafeImage 
                      src={product.imageUrl} 
                      alt={product.name}
                      category={product.category}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#12151B] via-transparent to-transparent opacity-75 pointer-events-none" />
                    
                    {product.badge && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-extrabold bg-amber-500 text-black shadow-md">
                        {product.badge}
                      </span>
                    )}

                    {product.temperature === 'trincando' && (
                      <span className="absolute bottom-2 left-2 px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-bold bg-blue-600/90 text-white flex items-center gap-1 border border-blue-400/30 backdrop-blur-sm">
                        <ThermometerSnowflake className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        -4°C
                      </span>
                    )}

                    <span className="absolute top-2 right-2 px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-bold bg-black/60 text-zinc-300 border border-white/15 backdrop-blur-sm">
                      {product.volume}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="p-2.5 sm:p-4 space-y-1">
                    <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-amber-400/80 block truncate">
                      {product.categoryLabel}
                    </span>
                    <h3 className="font-bold text-white font-title text-xs sm:text-base group-hover:text-amber-300 transition-colors line-clamp-2 leading-tight">
                      {product.name}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-zinc-400 line-clamp-2 leading-relaxed hidden sm:block">
                      {product.description}
                    </p>
                  </div>
                </div>

                {/* Footer price & action */}
                <div className="p-2.5 sm:p-4 pt-1 sm:pt-2 border-t border-white/5 flex items-center justify-between gap-1.5">
                  <div className="min-w-0">
                    {product.originalPrice && (
                      <span className="text-[9px] sm:text-[10px] text-zinc-500 line-through block truncate">
                        R$ {product.originalPrice.toFixed(2)}
                      </span>
                    )}
                    <span className="text-xs sm:text-lg font-bold font-title text-amber-400 block truncate">
                      R$ {product.price.toFixed(2)}
                    </span>
                  </div>

                  <button
                    onClick={(e) => handleAdd(product, e)}
                    className="min-h-[38px] px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center justify-center gap-1 transition-all active:scale-95 shadow-md shadow-amber-500/20 shrink-0 cursor-pointer"
                    title="Adicionar ao Cooler"
                    aria-label={`Adicionar ${product.name} ao carrinho`}
                  >
                    {addedItem === product.id ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                    <span className="hidden sm:inline">{addedItem === product.id ? 'No Cooler' : 'Adicionar'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
