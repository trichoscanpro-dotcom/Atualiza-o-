import React, { useState } from 'react';
import { useCMS } from '../context/CMSContext';
import { 
  ShoppingBag, 
  Sparkles, 
  Flame, 
  ThermometerSnowflake, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  Star, 
  ChevronRight, 
  Plus, 
  Check, 
  Package, 
  MessageCircle, 
  HelpCircle, 
  ArrowRight,
  ChevronDown,
  Beer,
  Zap,
  SlidersHorizontal,
  Maximize2
} from 'lucide-react';
import { ProductItem } from '../types';
import { SafeImage } from '../components/SafeImage';
import { AdegaImageCarousel } from '../components/AdegaImageCarousel';
import { beverageImages } from '../assets/beverageImages';

export const HomePage: React.FC = () => {
  const { 
    siteConfig, 
    products, 
    portfolioItems, 
    testimonials, 
    faqs, 
    selectedZone, 
    addToCart, 
    setSelectedProductId, 
    setIsCartOpen,
    navigateTo 
  } = useCMS();

  // Search & category tab state
  const [activeCategory, setActiveCategory] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [addedItemFeedback, setAddedItemFeedback] = useState<string | null>(null);

  // Filtered products
  const filteredProducts = products.filter(p => {
    const matchCategory = activeCategory === 'todos' || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  // Featured sections
  const combos = products.filter(p => p.isCombo);
  const coldBeers = products.filter(p => p.category === 'cervejas');
  const spirits = products.filter(p => p.category === 'destilados');
  const iceAndEssentials = products.filter(p => p.category === 'gelo_essenciais');

  const handleQuickAdd = (product: ProductItem, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAddedItemFeedback(product.id);
    setTimeout(() => {
      setAddedItemFeedback(null);
    }, 1200);
  };

  const categoriesList = [
    { id: 'todos', label: 'Todos os Itens', icon: '⚡' },
    { id: 'combos', label: 'Combos da Noite', icon: '🔥' },
    { id: 'cervejas', label: 'Cervejas Trincando', icon: '🍺' },
    { id: 'destilados', label: 'Destilados & Whiskies', icon: '🥃' },
    { id: 'vinhos', label: 'Vinhos & Espumantes', icon: '🍷' },
    { id: 'gelo_essenciais', label: 'Gelo & Carvão', icon: '🧊' },
    { id: 'sem_alcool', label: 'Energéticos & Refri', icon: '⚡' },
    { id: 'snacks', label: 'Snacks & Petiscos', icon: '🥨' },
  ];

  return (
    <div className="bg-[#090A0C] text-[#F3F4F6] min-h-screen font-sans selection:bg-[#E5A93C] selection:text-black overflow-x-hidden w-full">
      
      {/* ========================================================
          1. HERO SECTION CINEMATOGRÁFICA (BIGODE AFTER DARK)
      ======================================================== */}
      <section className="relative min-h-[85vh] lg:min-h-[90vh] flex items-center justify-center overflow-hidden border-b border-amber-500/20">
        
        {/* Background Image with Cinematic Lighting & Grain */}
        <div className="absolute inset-0 z-0">
          <SafeImage 
            src={beverageImages.brandArtHero} 
            alt="Arte Oficial da Marca e Ambiente noturno da Adega Bigode After Dark" 
            category="default"
            className="w-full h-full object-cover object-center scale-105 filter brightness-45 contrast-125"
          />
          {/* Gradients to blend smoothly with black background */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#090A0C] via-[#090A0C]/75 to-black/60 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#090A0C] via-transparent to-[#090A0C]/90 pointer-events-none" />
          {/* Amber Spotlight Glow */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center lg:text-left flex flex-col lg:flex-row items-center justify-between gap-12">
          
          {/* Left Text Column */}
          <div className="max-w-2xl space-y-6">
            
            {/* Animated Brand Emblem & Live Status */}
            <div className="flex flex-wrap items-center gap-3 justify-center lg:justify-start">
              {/* Brand Logo Emblem */}
              <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-black/80 border border-amber-500/50 shadow-lg shadow-amber-500/20 backdrop-blur-md group hover:border-amber-400 transition-all">
                <div className="relative w-6 h-6 rounded-full p-0.5 bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 shadow-md overflow-hidden shrink-0 animate-amber-glow">
                  <img 
                    src={siteConfig.logoUrl || beverageImages.brandLogo} 
                    alt="Emblema Bigode" 
                    className="w-full h-full object-cover rounded-full group-hover:scale-115 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className="font-title font-extrabold text-xs tracking-wider text-amber-400 uppercase">
                  ADEGA BIGODE
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-400/30">
                  AFTER DARK
                </span>
              </div>

              {/* Live Status Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 border border-amber-500/40 backdrop-blur-md text-xs">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="font-bold text-amber-400 uppercase tracking-widest text-[11px]">
                  {siteConfig.isOpenNow ? 'Plantão da Madrugada Ativo' : 'Abre às 18h'}
                </span>
                <span className="text-zinc-500">•</span>
                <span className="text-zinc-300">
                  Chegando em <strong className="text-white">{selectedZone.estimatedMinutes} min</strong> no {selectedZone.name}
                </span>
              </div>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-7xl font-extrabold font-title tracking-tight leading-[1.08] text-white">
              A NOITE <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 bg-clip-text text-transparent">
                COMEÇA AQUI.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-zinc-300 max-w-xl font-normal leading-relaxed">
              Cervejas estalando saídas da câmara fria a -4°C, destilados 100% originais e combos completos para a sua resenha sem sair de casa.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-3.5 pt-2 justify-center lg:justify-start">
              <button
                onClick={() => {
                  const elem = document.getElementById('cardapio-rapido');
                  elem?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-black font-extrabold text-sm hover:brightness-110 shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2.5 transition-all transform active:scale-95"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Montar Meu Pedido</span>
              </button>

              <button
                onClick={() => {
                  const elem = document.getElementById('combos-da-noite');
                  elem?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-6 py-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/15 backdrop-blur-sm flex items-center justify-center gap-2 transition-all"
              >
                <Flame className="w-4 h-4 text-amber-400" />
                <span>Ver Combos da Noite</span>
              </button>
            </div>

            {/* Micro Highlights Pill */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-6 border-t border-white/10 text-center sm:text-left">
              <div>
                <span className="text-lg sm:text-2xl font-bold font-title text-amber-400 block">-4°C</span>
                <span className="text-[10px] sm:text-[11px] text-zinc-400">Cerveja no Ponto</span>
              </div>
              <div>
                <span className="text-lg sm:text-2xl font-bold font-title text-white block">30 min</span>
                <span className="text-[10px] sm:text-[11px] text-zinc-400">Entrega Média</span>
              </div>
              <div>
                <span className="text-lg sm:text-2xl font-bold font-title text-emerald-400 block">Pix / Cartão</span>
                <span className="text-[10px] sm:text-[11px] text-zinc-400">Sem Fricção</span>
              </div>
            </div>

          </div>

          {/* Right Highlight Card: Hero Promo Special */}
          <div className="w-full max-w-md bg-[#13161D]/90 border border-amber-500/30 rounded-2xl p-5 shadow-2xl backdrop-blur-xl relative group">
            
            {/* Glow badge */}
            <div className="absolute -top-3 right-6 px-3 py-1 rounded-full bg-gradient-to-r from-rose-600 to-amber-600 text-white text-[11px] font-extrabold uppercase tracking-wider shadow-lg">
              🔥 Combo After Dark
            </div>

            <div className="relative h-56 rounded-xl overflow-hidden mb-4 bg-black/60">
              <SafeImage 
                src={beverageImages.comboBlackRedBull} 
                alt="Combo After Dark Black Label"
                category="combos"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
                <span className="px-2.5 py-1 rounded-md bg-black/70 text-amber-300 font-bold backdrop-blur-sm border border-amber-500/30">
                  Kit Completo + Gelo de Coco
                </span>
                <span className="px-2.5 py-1 rounded-md bg-emerald-500/80 text-white font-bold backdrop-blur-sm">
                  Economize R$ 35,00
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-base sm:text-lg font-bold font-title text-white">
                Combo Black Label 1L + 4 Red Bull
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Acompanha 2 copos colecionáveis da Adega Bigode e 2 pedras de gelo de coco saborizado.
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 mt-3 border-t border-white/10">
              <div>
                <span className="text-[11px] text-zinc-500 block line-through">R$ 235,00</span>
                <span className="text-xl sm:text-2xl font-bold font-title text-amber-400">R$ 199,90</span>
              </div>

              <button
                onClick={(e) => {
                  const combo1 = products.find(p => p.id === 'combo-1');
                  if (combo1) handleQuickAdd(combo1, e);
                }}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all active:scale-95"
              >
                {addedItemFeedback === 'combo-1' ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Adicionado!</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Pedir Agora</span>
                  </>
                )}
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================
          2. CARROSSEL & FILTROS DE CATEGORIAS RÁPIDAS
      ======================================================== */}
      <section id="cardapio-rapido" className="py-8 bg-[#0D0F13] border-b border-white/10 sticky top-[72px] z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Category Pills (Horizontal Scroll) */}
            <div className="flex items-center gap-2 overflow-x-auto w-full pb-1 scrollbar-none">
              {categoriesList.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 shrink-0 ${
                    activeCategory === cat.id
                      ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/25 scale-102'
                      : 'bg-[#161A22] text-zinc-300 hover:text-white hover:bg-[#1E232E] border border-white/10'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>

            {/* Quick Search Input */}
            <div className="w-full md:w-64 shrink-0">
              <input
                type="text"
                placeholder="Buscar bebida ou gelo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#161A22] border border-white/15 rounded-full px-4 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-amber-500"
              />
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================
          FILTRO ATIVO / BUSCA DINÂMICA
      ======================================================== */}
      {(activeCategory !== 'todos' || searchQuery.trim() !== '') && (
        <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 border-b border-white/10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                Resultados filtrados ({filteredProducts.length})
              </span>
              <h3 className="text-xl sm:text-2xl font-bold font-title text-white">
                {categoriesList.find(c => c.id === activeCategory)?.label || 'Bebidas Selecionadas'}
                {searchQuery ? ` para "${searchQuery}"` : ''}
              </h3>
            </div>
            <button
              onClick={() => {
                setActiveCategory('todos');
                setSearchQuery('');
              }}
              className="text-xs text-zinc-400 hover:text-amber-300 underline"
            >
              Limpar filtros
            </button>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="py-16 text-center bg-[#13161C] rounded-2xl border border-white/10 p-6">
              <Package className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
              <p className="text-white font-bold text-sm">Nenhum item encontrado para esta busca.</p>
              <p className="text-xs text-zinc-400 mt-1">Experimente buscar por Heineken, Black Label, Gelo, Vodka ou Red Bull.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-6">
              {filteredProducts.map(p => (
                <div
                  key={p.id}
                  onClick={() => setSelectedProductId(p.id)}
                  className="group bg-[#13161C] border border-white/10 hover:border-amber-500/50 rounded-xl sm:rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10 cursor-pointer"
                >
                  <div>
                    <div className="relative h-36 sm:h-48 w-full overflow-hidden bg-black/40">
                      <SafeImage 
                        src={p.imageUrl} 
                        alt={p.name}
                        category={p.category}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#13161C] via-transparent to-transparent opacity-75 pointer-events-none" />
                      
                      {p.badge && (
                        <span className="absolute top-2 left-2 px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-extrabold bg-amber-500 text-black shadow-md">
                          {p.badge}
                        </span>
                      )}

                      {p.temperature === 'trincando' && (
                        <span className="absolute bottom-2 left-2 px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-bold bg-blue-600/90 text-white flex items-center gap-1 border border-blue-400/30 backdrop-blur-sm">
                          <ThermometerSnowflake className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          -4°C
                        </span>
                      )}

                      <span className="absolute top-2 right-2 px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-bold bg-black/60 text-zinc-300 border border-white/15 backdrop-blur-sm">
                        {p.volume}
                      </span>
                    </div>

                    <div className="p-2.5 sm:p-3.5 space-y-1">
                      <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-amber-400/80 block truncate">
                        {p.categoryLabel}
                      </span>
                      <h4 className="font-bold text-white font-title text-xs sm:text-sm group-hover:text-amber-300 transition-colors line-clamp-2 leading-tight">
                        {p.name}
                      </h4>
                      <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed hidden sm:block">
                        {p.description}
                      </p>
                    </div>
                  </div>

                  <div className="p-2.5 sm:p-3.5 pt-1 sm:pt-2 border-t border-white/5 flex items-center justify-between gap-1">
                    <div className="min-w-0">
                      {p.originalPrice && (
                        <span className="text-[9px] sm:text-[10px] text-zinc-500 line-through block truncate">
                          R$ {p.originalPrice.toFixed(2)}
                        </span>
                      )}
                      <span className="text-xs sm:text-base font-bold font-title text-amber-400 block truncate">
                        R$ {p.price.toFixed(2)}
                      </span>
                    </div>

                    <button
                      onClick={(e) => handleQuickAdd(p, e)}
                      className="min-h-[36px] px-2.5 sm:px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-1 transition-all active:scale-95 shadow-md shadow-amber-500/20 shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{addedItemFeedback === p.id ? 'Salvo!' : 'Pedir'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* ========================================================
          3. COMBOS DA NOITE (AUMENTO DE TICKET MÉDIO & PRATICIDADE)
      ======================================================== */}
      <section id="combos-da-noite" className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest mb-1.5">
              <Flame className="w-4 h-4 text-amber-500 animate-pulse" />
              <span>Para Esquenta, Churrasco & Resenha</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold font-title text-white">
              COMBOS DA NOITE
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-md">
            Destilado com gelo saborizado, cervejas no pack com desconto e kits completos para economizar e não perder tempo.
          </p>
        </div>

        {/* Combos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {combos.map((combo) => (
            <div
              key={combo.id}
              onClick={() => setSelectedProductId(combo.id)}
              className="group bg-[#13161C] border border-white/10 hover:border-amber-500/50 rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10 cursor-pointer"
            >
              <div>
                {/* Image */}
                <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-black/40">
                  <SafeImage 
                    src={combo.imageUrl} 
                    alt={combo.name}
                    category="combos"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#13161C] via-transparent to-transparent opacity-80 pointer-events-none" />
                  
                  {combo.badge && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[11px] font-extrabold bg-amber-500 text-black shadow-md">
                      {combo.badge}
                    </span>
                  )}

                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-bold bg-black/60 text-zinc-300 border border-white/15 backdrop-blur-sm">
                    {combo.volume}
                  </span>
                </div>

                {/* Content */}
                <div className="p-4 space-y-2">
                  <h3 className="font-bold text-white font-title text-base group-hover:text-amber-300 transition-colors line-clamp-2">
                    {combo.name}
                  </h3>
                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                    {combo.description}
                  </p>

                  {/* Combo Items Preview */}
                  {combo.comboItems && (
                    <div className="pt-2 text-[11px] text-zinc-400 space-y-1">
                      {combo.comboItems.slice(0, 2).map((ci, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 truncate">
                          <Check className="w-3 h-3 text-amber-400 shrink-0" />
                          <span className="truncate">{ci}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Price & Action */}
              <div className="p-4 pt-2 border-t border-white/5 flex items-center justify-between">
                <div>
                  {combo.originalPrice && (
                    <span className="text-[10px] text-zinc-500 line-through block">
                      R$ {combo.originalPrice.toFixed(2)}
                    </span>
                  )}
                  <span className="text-lg font-bold font-title text-amber-400">
                    R$ {combo.price.toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={(e) => handleQuickAdd(combo, e)}
                  className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 shadow-md shadow-amber-500/20"
                >
                  {addedItemFeedback === combo.id ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <Plus className="w-3.5 h-3.5" />
                  )}
                  <span>{addedItemFeedback === combo.id ? 'No Cooler' : 'Adicionar'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* ========================================================
          4. CERVEJAS TRINCANDO (SAÍDAS DA CÂMARA FRIA A -4°C)
      ======================================================== */}
      <section className="py-12 bg-[#0C0E12] border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-widest mb-1.5">
                <ThermometerSnowflake className="w-4 h-4 text-blue-400 animate-spin" />
                <span>Câmara Fria Industrial a -4°C</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold font-title text-white">
                CERVEJAS ESTALANDO
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-md">
              Direto para a sua mão prontas para abrir. Sem garrafa morna, sem esperar gelar.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-4">
            {coldBeers.map((beer) => (
              <div
                key={beer.id}
                onClick={() => setSelectedProductId(beer.id)}
                className="group bg-[#14171E] border border-white/10 hover:border-blue-500/40 rounded-xl overflow-hidden flex flex-col justify-between transition-all duration-200 cursor-pointer"
              >
                <div>
                  <div className="relative h-36 sm:h-40 w-full overflow-hidden bg-black/30">
                    <SafeImage 
                      src={beer.imageUrl} 
                      alt={beer.name} 
                      category="cervejas"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-bold bg-blue-600/90 text-white flex items-center gap-1 border border-blue-400/30">
                        🥶 Gelada
                      </span>
                    </div>
                    <span className="absolute bottom-2 right-2 text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded bg-black/70 text-zinc-300">
                      {beer.volume}
                    </span>
                  </div>

                  <div className="p-2.5 sm:p-3 space-y-1">
                    <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-300 line-clamp-1">
                      {beer.name}
                    </h4>
                    <p className="text-[11px] text-zinc-400 line-clamp-1">
                      {beer.description}
                    </p>
                  </div>
                </div>

                <div className="p-2.5 sm:p-3 pt-1 flex items-center justify-between gap-1">
                  <div className="min-w-0">
                    {beer.originalPrice && (
                      <span className="text-[9px] sm:text-[10px] text-zinc-500 line-through block truncate">
                        R$ {beer.originalPrice.toFixed(2)}
                      </span>
                    )}
                    <span className="text-xs sm:text-base font-bold text-amber-400 font-title block truncate">
                      R$ {beer.price.toFixed(2)}
                    </span>
                  </div>

                  <button
                    onClick={(e) => handleQuickAdd(beer, e)}
                    className="min-w-[38px] min-h-[38px] w-9 h-9 sm:w-8 sm:h-8 rounded-lg bg-amber-500/20 text-amber-400 hover:bg-amber-500 hover:text-black border border-amber-500/30 flex items-center justify-center transition-all active:scale-95 shrink-0"
                    title="Adicionar ao cooler"
                    aria-label={`Adicionar ${beer.name} ao cooler`}
                  >
                    {addedItemFeedback === beer.id ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================
          5. DESTILADOS ORIGINAIS & GELO/CONVENIÊNCIA
      ======================================================== */}
      <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Left: Destilados & Whiskies */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest mb-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>100% Autênticos com Selo IPI</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold font-title text-white">
                DESTILADOS SELECIONADOS
              </h3>
            </div>

            <div className="space-y-3">
              {spirits.map(spirit => (
                <div 
                  key={spirit.id}
                  onClick={() => setSelectedProductId(spirit.id)}
                  className="p-3 rounded-xl bg-[#13161C] border border-white/10 hover:border-amber-500/40 flex items-center gap-3.5 transition-all cursor-pointer group"
                >
                  <SafeImage 
                    src={spirit.imageUrl} 
                    alt={spirit.name} 
                    category="destilados"
                    className="w-16 h-16 rounded-lg object-cover bg-black/40 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors truncate">
                      {spirit.name}
                    </h4>
                    <p className="text-xs text-zinc-400 truncate">{spirit.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-bold text-amber-400">R$ {spirit.price.toFixed(2)}</span>
                      <span className="text-[10px] text-zinc-500">• {spirit.volume}</span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleQuickAdd(spirit, e)}
                    className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500 hover:text-black text-amber-400 text-xs font-bold border border-amber-500/20 transition-all shrink-0"
                  >
                    + Adicionar
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Gelo, Carvão & Emergências da Resenha */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1.5">
                <Zap className="w-4 h-4 text-emerald-400" />
                <span>O Gelo Acabou? A Gente Salva.</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold font-title text-white">
                GELO & ESSENCIAIS
              </h3>
            </div>

            <div className="space-y-3">
              {iceAndEssentials.map(item => (
                <div 
                  key={item.id}
                  onClick={() => setSelectedProductId(item.id)}
                  className="p-3 rounded-xl bg-[#13161C] border border-white/10 hover:border-emerald-500/40 flex items-center gap-3.5 transition-all cursor-pointer group"
                >
                  <SafeImage 
                    src={item.imageUrl} 
                    alt={item.name} 
                    category="gelo_essenciais"
                    className="w-16 h-16 rounded-lg object-cover bg-black/40 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors truncate">
                      {item.name}
                    </h4>
                    <p className="text-xs text-zinc-400 truncate">{item.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-bold text-amber-400">R$ {item.price.toFixed(2)}</span>
                      <span className="text-[10px] text-zinc-500">• {item.volume}</span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleQuickAdd(item, e)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500 hover:text-black text-emerald-400 text-xs font-bold border border-emerald-500/20 transition-all shrink-0"
                  >
                    + Adicionar
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

      </section>

      {/* ========================================================
          BRAND ARTWORK & IDENTIDADE VISUAL EXCLUSIVA
      ======================================================== */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="relative rounded-3xl overflow-hidden border border-amber-500/30 bg-[#0E1117] shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            
            {/* Left: Brand Showcase & Manifesto */}
            <div className="lg:col-span-7 p-8 sm:p-12 space-y-6 relative z-10">
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Identidade Visual da Marca</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 p-1 shadow-xl shadow-amber-500/25 shrink-0 overflow-hidden">
                  <img 
                    src={siteConfig.logoUrl || beverageImages.brandLogo} 
                    alt="Logo Bigode Delivery"
                    className="w-full h-full object-cover rounded-xl"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold font-title text-white">
                    <span className="text-amber-400 font-bold mr-2">ADEGA</span>BIGODE <span className="text-amber-400 font-light">DELIVERY</span>
                  </h3>
                  <p className="text-xs text-zinc-400 uppercase tracking-widest font-semibold">
                    A Curadoria Noturna Oficial da Cidade
                  </p>
                </div>
              </div>

              <p className="text-sm text-zinc-300 leading-relaxed max-w-xl">
                Nossa identidade visual une a sofisticação do preto profundo (#090A0C) com a vibração acolhedora do dourado âmbar (#E5A93C). O emblemático bigode estilizado simboliza hospitalidade, tradição boêmia e a promessa inegociável de entregar cervejas trincando a -4°C e destilados 100% originais no conforto da sua casa.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs text-zinc-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#E5A93C]" />
                  <span>Dourado Âmbar (#E5A93C)</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs text-zinc-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#090A0C] border border-zinc-700" />
                  <span>Preto Profundo (#090A0C)</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs text-emerald-400 font-semibold">
                  <span>✓ 100% Bebidas Originais</span>
                </div>
              </div>
            </div>

            {/* Right: Full Brand Art Showcase Canvas */}
            <div className="lg:col-span-5 relative h-72 sm:h-96 lg:h-full min-h-[320px]">
              <SafeImage 
                src={beverageImages.brandArtHero} 
                alt="Arte da marca Bigode Delivery" 
                category="default"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#0E1117] via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-black/70 border border-amber-500/30 text-[11px] text-amber-300 font-mono backdrop-blur-sm">
                Arte Oficial • Bigode After Dark
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================
          6. SEÇÃO SOBRE A EMPRESA: A ADEGA BIGODE REAL
      ======================================================== */}
      <section className="py-16 sm:py-24 bg-[#0C0E13] border-t border-white/10 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Story & Philosophy */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Nossa Origem & Compromisso Noturno</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-extrabold font-title text-white leading-tight">
                MAIS QUE UM DELIVERY. <br />
                <span className="text-amber-400">A SUA ADEGA DA MADRUGADA.</span>
              </h2>

              <p className="text-sm text-zinc-300 leading-relaxed">
                A <strong>Adega Bigode Delivery</strong> nasceu da frustração clássica de quem está reunido com os amigos e percebe que a cerveja acabou, o gelo virou água e nenhum aplicativo tradicional entrega rápido ou com a temperatura que a ocasião exige.
              </p>

              <p className="text-sm text-zinc-300 leading-relaxed">
                Investimos em uma <strong>câmara fria industrial permanente regulada a -4°C</strong> em nossa loja física, frota de motoboys parceiros dedicados por bairro e curadoria rigorosa de destilados com procedência certificada. Aqui o seu pedido não é um número qualquer: é a garantia de que a sua noite não vai parar.
              </p>

              {/* 3 Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                <div className="p-3.5 rounded-xl bg-[#141820] border border-white/10 space-y-1">
                  <span className="text-amber-400 font-bold text-sm block">1. Geladaça</span>
                  <span className="text-xs text-zinc-400">Pronta para abrir e brindar imediatamente.</span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#141820] border border-white/10 space-y-1">
                  <span className="text-amber-400 font-bold text-sm block">2. Ágil</span>
                  <span className="text-xs text-zinc-400">Média de 30 minutos sem enrolação.</span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#141820] border border-white/10 space-y-1">
                  <span className="text-amber-400 font-bold text-sm block">3. Direto ao Ponto</span>
                  <span className="text-xs text-zinc-400">Pix e cartão na mão do entregador.</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => navigateTo('about')}
                  className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors uppercase tracking-wider"
                >
                  <span>Conhecer detalhes da nossa estrutura física</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>

            {/* Visual Adega Showcase: High-Quality Auto-Playing Image Carousel */}
            <div className="relative pb-6">
              <AdegaImageCarousel className="shadow-2xl shadow-black/80" />

              {/* Floating Quality Assurance Badge */}
              <div className="absolute -bottom-2 sm:-bottom-3 left-4 sm:left-6 p-2.5 sm:p-3.5 rounded-2xl bg-[#090A0C]/95 border border-amber-500/40 shadow-2xl backdrop-blur-md flex items-center gap-3 z-30">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-amber-400 to-amber-700 p-0.5 shrink-0 overflow-hidden shadow-lg shadow-amber-500/20">
                  <img 
                    src={siteConfig.logoUrl || beverageImages.brandLogo} 
                    alt="Logo Bigode Delivery"
                    className="w-full h-full object-cover rounded-[10px]"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="text-xs">
                  <span className="font-bold text-white block">Adega Física Estabelecida</span>
                  <span className="text-zinc-400 text-[11px]">Identidade oficial e compromisso com a noite</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================
          7. GALERIA & MOMENTOS AFTER DARK
      ======================================================== */}
      <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6">
        
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
            Vibe Noturna & Estrutura
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-title text-white">
            GALERIA DA NOITE
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            Acompanhe um pouco da nossa rotina noturna, câmara fria e logística de atendimento.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {portfolioItems.map(item => (
            <div 
              key={item.id}
              className="group relative h-64 rounded-2xl overflow-hidden border border-white/10 bg-[#12151B]"
            >
              <SafeImage 
                src={item.imageUrl} 
                alt={item.title} 
                category="default"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-85 group-hover:opacity-95 transition-opacity pointer-events-none" />
              
              <div className="absolute bottom-4 left-4 right-4 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                  {item.category}
                </span>
                <h4 className="text-sm font-bold text-white font-title">
                  {item.title}
                </h4>
                <p className="text-xs text-zinc-300 line-clamp-2 pt-0.5">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* ========================================================
          8. DEPOIMENTOS REAIS DE CLIENTES DA REGIÃO
      ======================================================== */}
      <section className="py-16 sm:py-20 bg-[#0C0E13] border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
              Quem Pede, Recomenda
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold font-title text-white">
              AVALIAÇÕES DA RESENHA
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              Depoimentos reais de quem confiou na Bigode para salvar o esquenta ou o churrasco.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map(item => (
              <div 
                key={item.id}
                className="p-6 rounded-2xl bg-[#14171E] border border-white/10 flex flex-col justify-between space-y-4 hover:border-amber-500/30 transition-all shadow-lg"
              >
                <div className="space-y-3">
                  {/* Stars */}
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
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
                      className="w-9 h-9 rounded-full object-cover border border-amber-500/30"
                    />
                    <div>
                      <span className="text-xs font-bold text-white block">{item.name}</span>
                      <span className="text-[11px] text-zinc-400">{item.neighborhood}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-amber-400 font-bold block">{item.deliveryTime}</span>
                    <span className="text-[10px] text-zinc-500">{item.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================
          9. PERGUNTAS FREQUENTES (FAQ)
      ======================================================== */}
      <section className="py-14 sm:py-20 max-w-4xl mx-auto px-4 sm:px-6">
        
        <div className="text-center mb-10 space-y-2">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center justify-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-amber-400" />
            Tire Suas Dúvidas
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-title text-white">
            PERGUNTAS FREQUENTES
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            Tudo o que você precisa saber sobre o funcionamento do delivery na madrugada.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div 
                key={faq.id}
                className="rounded-xl border border-white/10 bg-[#12151B] overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-white hover:text-amber-300 transition-colors"
                >
                  <span className="font-title">{faq.question}</span>
                  <ChevronDown className={`w-4 h-4 shrink-0 text-amber-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-4 pb-5 sm:px-5 text-xs text-zinc-300 leading-relaxed border-t border-white/5 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </section>

      {/* ========================================================
          10. CHAMADA PARA AÇÃO FINAL (CTA NOTURNA)
      ======================================================== */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-[#090A0C] via-[#151922] to-[#090A0C] border-t border-amber-500/20 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
            <Flame className="w-3.5 h-3.5" />
            <span>A Noite Não Espera</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold font-title text-white">
            SUA BEBIDA TÁ NO PONTO. <br />
            <span className="text-amber-400">FAÇA SEU PEDIDO AGORA.</span>
          </h2>

          <p className="text-sm text-zinc-300 max-w-xl mx-auto leading-relaxed">
            Monte seu cooler pelo site e pague com segurança, ou se preferir, mande uma mensagem direta no WhatsApp da adega. Entregamos na sua porta em minutos.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => setIsCartOpen(true)}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-black font-extrabold text-sm hover:brightness-110 shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Abrir Meu Carrinho</span>
            </button>

            <a
              href={`https://wa.me/${siteConfig.whatsapp.replace(/\D/g, '')}?text=Ol%C3%A1%20Bigode%21%20Quero%20fazer%20um%20pedido%20agora.`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chamar no WhatsApp da Adega</span>
            </a>
          </div>

          <p className="text-[11px] text-zinc-500 pt-4">
            Atendimento local imediato • Entregamos de Terça a Domingo a partir das 18h
          </p>

        </div>
      </section>

    </div>
  );
};
