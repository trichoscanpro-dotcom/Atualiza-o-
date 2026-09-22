import React from 'react';
import { useCMS } from '../context/CMSContext';
import { 
  ThermometerSnowflake, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  Sparkles, 
  Phone, 
  Instagram, 
  Truck, 
  Beer,
  Award
} from 'lucide-react';
import { SafeImage } from '../components/SafeImage';
import { beverageImages } from '../assets/beverageImages';

export const AboutPage: React.FC = () => {
  const { siteConfig, navigateTo } = useCMS();

  return (
    <div className="bg-[#090A0C] text-[#F3F4F6] min-h-screen py-12 px-4 sm:px-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 p-1 shadow-xl shadow-amber-500/25 overflow-hidden">
            <img 
              src={siteConfig.logoUrl || beverageImages.brandLogo} 
              alt="Logo Oficial Bigode Delivery" 
              className="w-full h-full object-cover rounded-xl"
              referrerPolicy="no-referrer"
            />
          </div>
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block">
            A História da Marca
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-['Syne'] text-white">
            A ADEGA BIGODE
          </h1>
          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
            Uma adega real, com câmara fria industrial, equipe dedicada e compromisso de entregar sua bebida trincando sem você precisar sair de casa.
          </p>
        </div>

        {/* Feature Grid / Core Truth */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#12151B] border border-amber-500/20 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <ThermometerSnowflake className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-['Syne'] text-white">Câmara Fria a -4°C</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Não colocamos a cerveja na geladeira na hora que o pedido sai. Nossas bebidas passam horas estabilizadas no ponto de congelamento perfeito.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#12151B] border border-amber-500/20 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-['Syne'] text-white">Logística Noturna Própria</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Entregadores experientes da região equipados com bags de isolamento térmico de alta densidade para garantir que o gelo não derreta.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#12151B] border border-amber-500/20 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-['Syne'] text-white">Origem Certificada</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Whiskies, vodkas, gins e vinhos adquiridos diretamente das distribuidoras homologadas das marcas com selo IPI oficial.
            </p>
          </div>
        </div>

        {/* Narrative & Visual Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-[#101319] p-8 sm:p-12 rounded-3xl border border-white/10">
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-4xl font-bold font-['Syne'] text-white leading-tight">
              A NOITE NÃO TEM TEMPO A PERDER.
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Quem vive a noite brasileira sabe: a resenha boa não é planejada nos mínimos detalhes. Ela simplesmente acontece. O churrasco começa às duas da tarde e vira a madrugada. O encontro a dois se prolonga. O jogo vai para os pênaltis.
            </p>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              É nesses momentos cruciais que a <strong>Bigode Delivery</strong> entra em ação. Criamos uma marca de lifestyle noturno, com identidade elegante, visual cinematográfico e atendimento ágil para que o anfitrião nunca precise pedir desculpas pela bebida ter acabado.
            </p>

            <div className="pt-4 flex items-center gap-4">
              <button
                onClick={() => navigateTo('catalog')}
                className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition-all shadow-lg shadow-amber-500/20"
              >
                Conhecer Nosso Cardápio
              </button>
              <a
                href={siteConfig.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs flex items-center gap-2 border border-white/10 transition-colors"
              >
                <Instagram className="w-4 h-4" />
                <span>Instagram Oficial</span>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="relative rounded-xl overflow-hidden border border-amber-500/30">
              <SafeImage 
                src={beverageImages.brandArtHero} 
                alt="Arte Oficial da Marca Bigode Delivery" 
                category="default"
                className="w-full h-48 object-cover"
              />
              <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 text-amber-300 font-bold text-[10px] border border-amber-500/30">
                Arte Oficial
              </span>
            </div>
            <SafeImage 
              src={beverageImages.beerColdFreezer} 
              alt="Câmara fria da Adega" 
              category="cervejas"
              className="w-full h-48 object-cover rounded-xl border border-white/10"
            />
            <SafeImage 
              src={beverageImages.adegaFrontNight} 
              alt="Adega física à noite" 
              category="destilados"
              className="w-full h-48 object-cover rounded-xl border border-white/10"
            />
            <SafeImage 
              src={beverageImages.beerCheersNight} 
              alt="Amigos reunidos na adega brindando e consumindo bebidas" 
              category="default"
              className="w-full h-48 object-cover rounded-xl border border-white/10"
            />
          </div>
        </div>

        {/* Location & Hours */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#12151B] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-base font-bold text-white font-['Syne']">Prefere Retirar no Balcão da Adega?</h4>
            <p className="text-xs text-zinc-400">
              Estamos localizados em: <strong>{siteConfig.address}</strong>
            </p>
            <p className="text-xs text-amber-400 font-semibold">{siteConfig.openingHoursText}</p>
          </div>

          <a
            href={`https://wa.me/${siteConfig.whatsapp.replace(/\D/g, '')}?text=Ol%C3%A1%2C%20gostaria%20de%20saber%20como%20chegar%20na%20Adega%20Bigode.`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 transition-colors shrink-0"
          >
            <Phone className="w-4 h-4" />
            <span>Falar no WhatsApp da Loja</span>
          </a>
        </div>

      </div>
    </div>
  );
};
