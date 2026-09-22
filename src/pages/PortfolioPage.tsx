import React, { useState } from 'react';
import { useCMS } from '../context/CMSContext';
import { X, Sparkles, MapPin, Tag } from 'lucide-react';
import { PortfolioItem } from '../types';
import { SafeImage } from '../components/SafeImage';

export const PortfolioPage: React.FC = () => {
  const { portfolioItems } = useCMS();
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [activeModalItem, setActiveModalItem] = useState<PortfolioItem | null>(null);

  const allTags = ['all', ...Array.from(new Set(portfolioItems.flatMap(i => i.tags || [])))];

  const filtered = portfolioItems.filter(item => {
    if (selectedTag === 'all') return true;
    return item.tags?.includes(selectedTag);
  });

  return (
    <div className="bg-[#090A0C] text-[#F3F4F6] min-h-screen py-12 px-4 sm:px-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Bastidores & Vibe Noturna
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-['Syne'] text-white">
            GALERIA DA NOITE
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Conheça um pouco da nossa câmara fria industrial, balcão de atendimento, expedição rápida e a resenha dos nossos clientes.
          </p>
        </div>

        {/* Filter Tags */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedTag === tag
                  ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                  : 'bg-[#141820] text-zinc-300 hover:text-white border border-white/10'
              }`}
            >
              {tag === 'all' ? 'Todos os Momentos' : `#${tag}`}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(item => (
            <div
              key={item.id}
              onClick={() => setActiveModalItem(item)}
              className="group bg-[#12151B] border border-white/10 hover:border-amber-500/40 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10"
            >
              <div className="relative h-60 w-full overflow-hidden bg-black/40">
                <SafeImage 
                  src={item.imageUrl} 
                  alt={item.title}
                  category="default"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#12151B] via-transparent to-transparent opacity-80 pointer-events-none" />
                <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded bg-black/70 text-amber-300 border border-amber-500/30">
                  {item.category}
                </span>
              </div>

              <div className="p-5 space-y-2">
                <h3 className="font-bold text-white font-['Syne'] text-base group-hover:text-amber-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>

                {item.tags && (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {item.tags.map((t, idx) => (
                      <span key={idx} className="text-[10px] text-zinc-500 bg-white/5 px-2 py-0.5 rounded">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Modal Lightbox */}
        {activeModalItem && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#141820] border border-amber-500/30 rounded-2xl max-w-xl w-full overflow-hidden text-white shadow-2xl relative">
              <button
                onClick={() => setActiveModalItem(null)}
                className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/70 flex items-center justify-center text-zinc-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="relative h-72 w-full overflow-hidden">
                <SafeImage 
                  src={activeModalItem.imageUrl} 
                  alt={activeModalItem.title} 
                  category="default"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-6 space-y-3">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  {activeModalItem.category}
                </span>
                <h2 className="text-xl font-bold font-['Syne'] text-white">
                  {activeModalItem.title}
                </h2>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  {activeModalItem.description}
                </p>
                <button
                  onClick={() => setActiveModalItem(null)}
                  className="w-full py-2.5 rounded-xl bg-amber-500 text-black font-bold text-xs hover:bg-amber-400 transition-colors mt-2"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
