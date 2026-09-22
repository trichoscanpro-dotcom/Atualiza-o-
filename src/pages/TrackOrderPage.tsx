import React, { useState } from 'react';
import { useCMS } from '../context/CMSContext';
import { 
  Package, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Truck, 
  ThermometerSnowflake, 
  MessageCircle, 
  Search,
  Phone,
  ArrowRight
} from 'lucide-react';

export const TrackOrderPage: React.FC = () => {
  const { currentOrder, orders, siteConfig, navigateTo } = useCMS();
  const [searchCode, setSearchCode] = useState('');
  const [searchedOrder, setSearchedOrder] = useState(currentOrder);
  const [searchError, setSearchError] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError(null);
    if (!searchCode.trim()) {
      setSearchError('Por favor, digite o código do pedido ou WhatsApp para buscar.');
      return;
    }
    const clean = searchCode.trim().toUpperCase().replace('#', '');
    const found = orders.find(o => o.id.toUpperCase() === clean || o.phone.replace(/\D/g, '').includes(clean.replace(/\D/g, '')));
    if (found) {
      setSearchedOrder(found);
    } else {
      setSearchError('Nenhum pedido encontrado com este código ou número de telefone. Verifique os dados ou fale conosco no WhatsApp.');
    }
  };

  const activeOrder = searchedOrder || currentOrder;

  return (
    <div className="bg-[#090A0C] text-[#F3F4F6] min-h-screen py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Title */}
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
            Acompanhamento em Tempo Real
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-['Syne'] text-white">
            RASTREAR MEU PEDIDO
          </h1>
          <p className="text-sm text-zinc-400 max-w-md mx-auto">
            Veja em qual etapa sua bebida está: da nossa câmara fria até a chegada do motoboy no seu endereço.
          </p>
        </div>

        {/* Search Code Bar */}
        <div className="max-w-md mx-auto space-y-2">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input 
                type="text"
                placeholder="Digite o código (Ex: BG-123456) ou Whats"
                value={searchCode}
                onChange={(e) => { setSearchCode(e.target.value); setSearchError(null); }}
                className="w-full bg-[#13161C] border border-white/15 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-amber-500"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition-colors shrink-0 font-['Syne'] cursor-pointer"
            >
              Buscar
            </button>
          </form>

          {searchError && (
            <p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-xl text-center">
              {searchError}
            </p>
          )}
        </div>

        {activeOrder ? (
          <div className="bg-[#12151B] border border-amber-500/30 rounded-2xl p-6 sm:p-8 space-y-8 shadow-2xl">
            
            {/* Top Order Summary */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
              <div>
                <span className="text-xs text-zinc-400">Código do Pedido:</span>
                <h3 className="text-xl sm:text-2xl font-bold font-['Syne'] text-amber-400">
                  #{activeOrder.id}
                </h3>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-xs text-zinc-400">Horário do Pedido:</span>
                <p className="text-sm font-bold text-white">{activeOrder.createdAt}</p>
                <span className="text-[11px] text-emerald-400 font-semibold">
                  Previsão média: 25 a 35 min
                </span>
              </div>
            </div>

            {/* Stepper Timeline */}
            <div className="space-y-6">
              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Status da Entrega
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                {/* Step 1: Recebido */}
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center sm:flex-col gap-3 text-left sm:text-center">
                  <div className="w-10 h-10 rounded-full bg-emerald-500 text-black flex items-center justify-center font-bold shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">1. Recebido</span>
                    <span className="text-[11px] text-zinc-400">Pedido computado no sistema</span>
                  </div>
                </div>

                {/* Step 2: Câmara Fria */}
                <div className={`p-4 rounded-xl border flex items-center sm:flex-col gap-3 text-left sm:text-center ${
                  activeOrder.status === 'separando' || activeOrder.status === 'em_rota' || activeOrder.status === 'entregue'
                    ? 'bg-blue-500/10 border-blue-500/30 text-white'
                    : 'bg-white/5 border-white/10 text-zinc-500'
                }`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0 ${
                    activeOrder.status === 'separando'
                      ? 'bg-blue-500 text-white animate-pulse'
                      : activeOrder.status === 'em_rota' || activeOrder.status === 'entregue'
                      ? 'bg-blue-500 text-white'
                      : 'bg-zinc-800 text-zinc-500'
                  }`}>
                    <ThermometerSnowflake className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold block">2. Na Câmara Fria</span>
                    <span className="text-[11px] text-zinc-400">Separando a -4°C na bag</span>
                  </div>
                </div>

                {/* Step 3: Em Rota */}
                <div className={`p-4 rounded-xl border flex items-center sm:flex-col gap-3 text-left sm:text-center ${
                  activeOrder.status === 'em_rota' || activeOrder.status === 'entregue'
                    ? 'bg-amber-500/10 border-amber-500/30 text-white'
                    : 'bg-white/5 border-white/10 text-zinc-500'
                }`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0 ${
                    activeOrder.status === 'em_rota'
                      ? 'bg-amber-500 text-black animate-bounce'
                      : activeOrder.status === 'entregue'
                      ? 'bg-amber-500 text-black'
                      : 'bg-zinc-800 text-zinc-500'
                  }`}>
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold block">3. Em Rota</span>
                    <span className="text-[11px] text-zinc-400">Motoboy a caminho</span>
                  </div>
                </div>

                {/* Step 4: Entregue */}
                <div className={`p-4 rounded-xl border flex items-center sm:flex-col gap-3 text-left sm:text-center ${
                  activeOrder.status === 'entregue'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-white'
                    : 'bg-white/5 border-white/10 text-zinc-500'
                }`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0 ${
                    activeOrder.status === 'entregue' ? 'bg-emerald-500 text-black' : 'bg-zinc-800 text-zinc-500'
                  }`}>
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold block">4. Entregue</span>
                    <span className="text-[11px] text-zinc-400">Noite salva! Aproveite</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Destination & Items details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/10 text-xs">
              <div className="space-y-2">
                <h5 className="font-bold text-amber-400 uppercase tracking-wider">Endereço de Entrega</h5>
                <p className="text-white font-medium">{activeOrder.customerName} ({activeOrder.phone})</p>
                <p className="text-zinc-300">{activeOrder.address} - {activeOrder.neighborhood}</p>
                {activeOrder.complement && <p className="text-zinc-400">Compl: {activeOrder.complement}</p>}
                <p className="text-zinc-400 pt-1">
                  Pagamento: <strong className="text-white uppercase">{activeOrder.paymentMethod === 'pix' ? 'Pix' : activeOrder.paymentMethod === 'card_delivery' ? 'Cartão na Entrega' : 'Dinheiro'}</strong>
                </p>
              </div>

              <div className="space-y-2">
                <h5 className="font-bold text-amber-400 uppercase tracking-wider">Itens do Pedido</h5>
                <ul className="space-y-1.5 text-zinc-300">
                  {activeOrder.items.map((item, idx) => (
                    <li key={idx} className="flex justify-between">
                      <span>{item.quantity}x {item.product.name}</span>
                      <span className="font-bold text-white">R$ {(item.product.price * item.quantity).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-2 border-t border-white/10 flex justify-between font-bold text-sm text-white">
                  <span>Total com entrega:</span>
                  <span className="text-amber-400 font-['Syne']">R$ {activeOrder.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Direct Support WhatsApp */}
            <div className="pt-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
              <a
                href={`https://wa.me/${siteConfig.whatsapp.replace(/\D/g, '')}?text=Ol%C3%A1%2C%20gostaria%20de%20informa%C3%A7%C3%B5es%20do%20meu%20pedido%20%23${activeOrder.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Falar com o Motoboy / Adega no Whats</span>
              </a>

              <button
                onClick={() => navigateTo('catalog')}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <span>Fazer Outro Pedido</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        ) : (
          <div className="p-12 text-center bg-[#13161D] rounded-2xl border border-white/10 space-y-4">
            <Package className="w-12 h-12 text-zinc-600 mx-auto" />
            <h3 className="text-lg font-bold text-white font-['Syne']">Você ainda não tem pedidos ativos</h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              Assim que você fizer um pedido pelo cardápio, poderá acompanhar todo o trajeto da entrega aqui.
            </p>
            <button
              onClick={() => navigateTo('home')}
              className="px-6 py-2.5 rounded-xl bg-amber-500 text-black font-bold text-xs hover:bg-amber-400 transition-colors"
            >
              Ir para o Cardápio de Bebidas
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
