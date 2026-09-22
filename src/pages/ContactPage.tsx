import React, { useState } from 'react';
import { useCMS } from '../context/CMSContext';
import { 
  Phone, 
  MapPin, 
  Clock, 
  Instagram, 
  Mail, 
  Send, 
  CheckCircle2, 
  MessageCircle,
  Sparkles
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { siteConfig, addLead } = useCMS();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: '',
    interest: 'duvida'
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    addLead({
      name: formData.name,
      phone: formData.phone,
      message: `${formData.interest.toUpperCase()}: ${formData.message}`
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', phone: '', message: '', interest: 'duvida' });
    }, 4000);
  };

  return (
    <div className="bg-[#090A0C] text-[#F3F4F6] min-h-screen py-12 px-4 sm:px-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
            Fale Com a Adega
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-['Syne'] text-white">
            CONTATO & ATENDIMENTO
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Dúvidas, pedidos especiais para eventos, churrascos e parcerias comerciais. Estamos à sua disposição.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* Contact Details & Direct Channels */}
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-[#12151B] border border-white/10 space-y-4">
              <h3 className="text-lg font-bold font-['Syne'] text-white">Canais Oficiais</h3>
              
              <div className="space-y-3 text-xs sm:text-sm">
                <a 
                  href={`https://wa.me/${siteConfig.whatsapp.replace(/\D/g, '')}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between hover:bg-emerald-500/20 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-emerald-400" />
                    <div>
                      <span className="font-bold text-white block">WhatsApp Central</span>
                      <span className="text-zinc-400 text-xs">{siteConfig.whatsapp}</span>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-md bg-emerald-500 text-black text-xs font-bold">
                    Conversar
                  </span>
                </a>

                <a 
                  href={siteConfig.instagramUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Instagram className="w-5 h-5 text-amber-400" />
                    <div>
                      <span className="font-bold text-white block">Instagram</span>
                      <span className="text-zinc-400 text-xs">@adegabigode.delivery</span>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-md bg-white/10 text-white text-xs font-bold">
                    Seguir
                  </span>
                </a>

                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                  <Mail className="w-5 h-5 text-blue-400" />
                  <div>
                    <span className="font-bold text-white block">E-mail Comercial</span>
                    <span className="text-zinc-400 text-xs">{siteConfig.email}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Address & Hours Card */}
            <div className="p-6 rounded-2xl bg-[#12151B] border border-white/10 space-y-3 text-xs text-zinc-300">
              <h3 className="text-sm font-bold font-['Syne'] text-amber-400 uppercase tracking-wider">
                Endereço & Atendimento Noturno
              </h3>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{siteConfig.address}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{siteConfig.openingHoursText}</span>
              </div>
            </div>
          </div>

          {/* Contact / Event Inquiry Form */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#12151B] border border-amber-500/20 space-y-4">
            <h3 className="text-lg font-bold font-['Syne'] text-white">
              Envie uma Mensagem
            </h3>
            <p className="text-xs text-zinc-400">
              Preencha o formulário para orçamentos de kits para eventos, festas corporativas ou dúvidas gerais.
            </p>

            {submitted ? (
              <div className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="text-sm font-bold text-white">Mensagem Enviada com Sucesso!</h4>
                <p className="text-xs text-zinc-400">Nossa equipe entrará em contato pelo seu telefone informado.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Seu Nome</label>
                  <input 
                    type="text"
                    required
                    placeholder="Como prefere ser chamado?"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-[#0A0C0E] border border-white/15 rounded-xl p-3 text-white placeholder:text-zinc-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">WhatsApp / Telefone com DDD</label>
                  <input 
                    type="tel"
                    required
                    placeholder="(11) 99999-9999"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-[#0A0C0E] border border-white/15 rounded-xl p-3 text-white placeholder:text-zinc-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Assunto / Interesse</label>
                  <select
                    value={formData.interest}
                    onChange={(e) => setFormData({...formData, interest: e.target.value})}
                    className="w-full bg-[#0A0C0E] border border-white/15 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="duvida">Dúvida sobre Entrega / Pedido</option>
                    <option value="festa">Orçamento para Festa / Churrasco / Evento</option>
                    <option value="parceria">Parceria Comercial / Fornecedor</option>
                    <option value="outro">Outro assunto</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Sua Mensagem</label>
                  <textarea 
                    rows={4}
                    placeholder="Conte como podemos te ajudar..."
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full bg-[#0A0C0E] border border-white/15 rounded-xl p-3 text-white placeholder:text-zinc-500 focus:outline-none focus:border-amber-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-black font-bold text-xs hover:brightness-110 shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <Send className="w-4 h-4" />
                  <span>Enviar Mensagem</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
