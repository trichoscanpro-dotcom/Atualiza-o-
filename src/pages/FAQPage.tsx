import React, { useState } from 'react';
import { useCMS } from '../context/CMSContext';
import { HelpCircle, ChevronDown, MessageCircle, Phone, Search } from 'lucide-react';

export const FAQPage: React.FC = () => {
  const { faqs, siteConfig, navigateTo } = useCMS();
  const [search, setSearch] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filtered = faqs.filter(f => 
    f.question.toLowerCase().includes(search.toLowerCase()) || 
    f.answer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-[#090A0C] text-[#F3F4F6] min-h-screen py-12 px-4 sm:px-6 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center justify-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-amber-400" />
            Central de Ajuda
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-['Syne'] text-white">
            DÚVIDAS FREQUENTES
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Respostas rápidas para as principais dúvidas sobre pedidos, formas de pagamento, temperatura das bebidas e entrega na madrugada.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto">
          <input 
            type="text"
            placeholder="Digite sua dúvida (ex: gelada, pagamento, horário, troco)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#12151B] border border-white/15 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-3">
          {filtered.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div 
                key={faq.id}
                className="bg-[#12151B] border border-white/10 rounded-2xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-white hover:text-amber-300 transition-colors"
                >
                  <span className="font-['Syne']">{faq.question}</span>
                  <ChevronDown className={`w-4 h-4 text-amber-400 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-zinc-300 leading-relaxed border-t border-white/5 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* WhatsApp Help Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-[#161B24] to-amber-500/10 border border-amber-500/20 text-center space-y-3">
          <h3 className="text-base font-bold text-white font-['Syne']">
            Não encontrou a resposta que precisava?
          </h3>
          <p className="text-xs text-zinc-400 max-w-md mx-auto">
            Fale diretamente com nossa equipe no WhatsApp da Adega. Atendemos você em poucos segundos.
          </p>
          <a
            href={`https://wa.me/${siteConfig.whatsapp.replace(/\D/g, '')}?text=Ol%C3%A1%20Bigode%2C%20estou%20com%20uma%20d%C3%BAvida%20sobre%20o%20delivery.`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chamar Atendente no WhatsApp</span>
          </a>
        </div>

      </div>
    </div>
  );
};
