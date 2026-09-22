import React, { useState, useEffect } from 'react';
import { useCMS } from '../context/CMSContext';
import { 
  X, 
  Plus, 
  Minus, 
  Trash2, 
  ShoppingBag, 
  Sparkles, 
  MapPin, 
  Tag, 
  ArrowRight, 
  CheckCircle2, 
  MessageCircle, 
  CreditCard, 
  QrCode, 
  Banknote,
  Clock,
  ShieldCheck,
  ChevronRight,
  Copy,
  Check
} from 'lucide-react';
import { SafeImage } from './SafeImage';
import { generatePixBrCode, generatePixQrCodeDataUrl } from '../utils/pix';
import { getWhatsAppOrderUrl } from '../utils/whatsapp';

export const CartDrawer: React.FC = () => {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    updateCartQuantity, 
    removeFromCart, 
    clearCart,
    subtotal, 
    deliveryFee, 
    discount, 
    total, 
    freeDeliveryRemaining, 
    siteConfig,
    deliveryZones,
    selectedZone,
    setSelectedZone,
    couponCode,
    applyCoupon,
    createOrder,
    navigateTo,
    addOrUpdateCRMLead
  } = useCMS();

  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ success?: boolean; message?: string }>({});

  // Checkout form state
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [complement, setComplement] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card_delivery' | 'cash'>('pix');
  const [changeFor, setChangeFor] = useState('');
  const [notes, setNotes] = useState('');
  const [createdOrderNumber, setCreatedOrderNumber] = useState('');
  const [orderWhatsappUrl, setOrderWhatsappUrl] = useState('');
  const [pixQrCodeUrl, setPixQrCodeUrl] = useState('');
  const [pixCodeString, setPixCodeString] = useState('');
  const [copiedPix, setCopiedPix] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  // Pre-generate Pix BR Code with receiver "ADEGA BIGODE"
  useEffect(() => {
    if (total > 0) {
      const code = generatePixBrCode({
        receiverName: 'ADEGA BIGODE',
        pixKey: 'pix@adegabigode.com.br',
        city: 'SAO PAULO',
        amount: total,
        transactionId: createdOrderNumber ? `BG${createdOrderNumber}` : 'BIGODE',
      });
      setPixCodeString(code);
      generatePixQrCodeDataUrl(code).then(url => {
        if (url) setPixQrCodeUrl(url);
      });
    }
  }, [total, createdOrderNumber]);

  const handleCopyPix = () => {
    if (!pixCodeString) return;
    navigator.clipboard.writeText(pixCodeString).then(() => {
      setCopiedPix(true);
      setTimeout(() => setCopiedPix(false), 3000);
    }).catch(() => {
      // Fallback manual copy
    });
  };

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput) return;
    const res = applyCoupon(couponInput);
    setCouponFeedback(res);
  };

  const handleFinishOrder = (sendWhatsApp: boolean = false) => {
    if (!customerName.trim() || !phone.trim() || !address.trim()) {
      setCheckoutError('Por favor, preencha seu nome, WhatsApp e endereço completo para a entrega.');
      return;
    }
    setCheckoutError(null);

    // Capture items snapshot with unit prices before order creation
    const itemsSnapshot = cart.map(item => ({
      name: item.product.name,
      quantity: item.quantity,
      unitPrice: item.product.price
    }));

    const newOrder = createOrder({
      customerName,
      phone,
      address,
      neighborhood: selectedZone.name,
      complement,
      paymentMethod,
      changeFor: paymentMethod === 'cash' ? changeFor : undefined,
      items: cart,
      subtotal,
      deliveryFee,
      discount,
      total,
      notes
    });

    setCreatedOrderNumber(newOrder.id);

    // Build complete WhatsApp message with all required fields
    const waUrl = getWhatsAppOrderUrl(siteConfig.whatsapp, {
      orderId: newOrder.id,
      customerName,
      phone,
      address,
      neighborhood: selectedZone.name,
      complement,
      items: itemsSnapshot,
      subtotal,
      deliveryFee,
      discount,
      total,
      paymentMethod,
      changeFor,
      notes
    });

    setOrderWhatsappUrl(waUrl);
    setStep('success');

    // Register lead into CRM
    try {
      addOrUpdateCRMLead({
        customerName: customerName || 'Cliente Delivery',
        phone: phone || siteConfig.whatsapp,
        dateTime: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        lastMessage: `Pedido #${newOrder.id} (${itemsSnapshot.length} itens, R$ ${total.toFixed(2).replace('.', ',')})`,
        orderedProducts: itemsSnapshot,
        totalValue: total,
        status: 'Pedido confirmado',
        address: `${address}${complement ? `, ${complement}` : ''} - ${selectedZone.name}`,
        paymentMethod: paymentMethod === 'pix' ? 'Pix Instantâneo' : paymentMethod === 'card_delivery' ? 'Cartão na Entrega' : `Dinheiro (Troco para ${changeFor || 'Sem troco'})`
      });
    } catch (err) {
      console.error(err);
    }

    if (sendWhatsApp) {
      window.open(waUrl, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-[70] overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-full sm:max-w-md bg-[#12151A] border-l border-amber-500/20 text-[#F3F4F6] shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-[#161A20]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-lg text-white font-['Syne'] tracking-wide">
                  {step === 'cart' && 'Seu Carrinho After Dark'}
                  {step === 'checkout' && 'Finalizar Pedido Noturno'}
                  {step === 'success' && 'Pedido Confirmado!'}
                </h2>
                <p className="text-xs text-zinc-400">
                  {step === 'cart' && `${cart.length} ${cart.length === 1 ? 'item' : 'itens'} no cooler`}
                  {step === 'checkout' && 'Bebida estalando a caminho da sua porta'}
                  {step === 'success' && 'Nossa equipe já está separando no freezer'}
                </p>
              </div>
            </div>

            <button 
              onClick={() => {
                setIsCartOpen(false);
                setStep('cart');
              }}
              className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free delivery tracker */}
          {step === 'cart' && cart.length > 0 && (
            <div className="px-5 py-3 bg-amber-500/10 border-b border-amber-500/20">
              <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
                <span className="flex items-center gap-1.5 text-amber-300">
                  <Sparkles className="w-3.5 h-3.5" />
                  {freeDeliveryRemaining > 0 
                    ? `Faltam R$ ${freeDeliveryRemaining.toFixed(2)} para FRETE GRÁTIS!` 
                    : '🎉 PARABÉNS! Você ganhou FRETE GRÁTIS!'}
                </span>
                <span className="text-zinc-400 font-bold">R$ {siteConfig.freeDeliveryThreshold.toFixed(0)}</span>
              </div>
              <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-300 rounded-full"
                  style={{ width: `${Math.min(100, (subtotal / siteConfig.freeDeliveryThreshold) * 100)}%` }}
                />
              </div>
            </div>
          )}

          {/* Content Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {/* STEP 1: CART VIEW */}
            {step === 'cart' && (
              <>
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-16 space-y-4">
                    <div className="w-20 h-20 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500">
                      <ShoppingBag className="w-10 h-10" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-white">Seu cooler tá vazio</h3>
                      <p className="text-sm text-zinc-400 max-w-xs">
                        Adicione cervejas trincando, combos da noite ou gelo para começar sua resenha.
                      </p>
                    </div>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="px-6 py-2.5 rounded-full bg-amber-500 text-black font-bold text-sm hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/20"
                    >
                      Ver Bebidas Geladas
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Items List */}
                    <div className="space-y-3">
                      {cart.map((item) => (
                        <div 
                          key={item.product.id}
                          className="p-3 rounded-xl bg-[#181C23] border border-white/5 flex gap-3 items-center group hover:border-amber-500/30 transition-all"
                        >
                          <SafeImage 
                            src={item.product.imageUrl} 
                            alt={item.product.name} 
                            category={item.product.category}
                            className="w-16 h-16 rounded-lg object-cover bg-black/40 shrink-0 border border-white/10"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-white truncate group-hover:text-amber-300 transition-colors">
                              {item.product.name}
                            </h4>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs text-amber-400 font-bold">
                                R$ {item.product.price.toFixed(2)}
                              </span>
                              {item.product.temperature === 'trincando' && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 font-medium">
                                  🥶 Gelada
                                </span>
                              )}
                            </div>
                            
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-3 mt-2">
                              <div className="flex items-center border border-white/15 rounded-lg bg-black/30 overflow-hidden">
                                <button
                                  onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                                  className="w-7 h-7 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                                >
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span className="w-8 text-center text-xs font-bold text-white">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                                  className="w-7 h-7 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              <span className="text-xs text-zinc-400">
                                Total: R$ {(item.product.price * item.quantity).toFixed(2)}
                              </span>

                              <button
                                onClick={() => removeFromCart(item.product.id)}
                                className="ml-auto text-zinc-500 hover:text-rose-400 p-1 transition-colors"
                                title="Remover item"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Neighborhood Delivery Selector */}
                    <div className="p-3.5 rounded-xl bg-[#161A20] border border-white/10 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-zinc-300">
                        <span className="flex items-center gap-1.5 text-amber-400">
                          <MapPin className="w-4 h-4" />
                          Bairro de Entrega
                        </span>
                        <span className="text-zinc-400 font-normal">
                          {selectedZone.estimatedMinutes} min médios
                        </span>
                      </div>
                      <select
                        value={selectedZone.id}
                        onChange={(e) => {
                          const zone = deliveryZones.find(z => z.id === e.target.value);
                          if (zone) setSelectedZone(zone);
                        }}
                        className="w-full bg-[#0D0F12] border border-white/15 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                      >
                        {deliveryZones.map(zone => (
                          <option key={zone.id} value={zone.id} className="bg-[#12151A] text-white">
                            {zone.name} — Taxa: R$ {zone.fee.toFixed(2)} ({zone.estimatedMinutes} min)
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Coupon Box */}
                    <form onSubmit={handleApplyCoupon} className="space-y-1.5">
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Tag className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                          <input 
                            type="text"
                            value={couponInput}
                            onChange={(e) => setCouponInput(e.target.value)}
                            placeholder="Cupom (ex: BIGODE10)"
                            className="w-full bg-[#161A20] border border-white/10 rounded-lg pl-9 pr-3 py-2 text-xs text-white uppercase placeholder:text-zinc-500 focus:outline-none focus:border-amber-500"
                          />
                        </div>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-white/10 hover:bg-amber-500 hover:text-black text-white text-xs font-bold rounded-lg transition-colors"
                        >
                          Aplicar
                        </button>
                      </div>
                      {couponFeedback.message && (
                        <p className={`text-[11px] ${couponFeedback.success ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {couponFeedback.message}
                        </p>
                      )}
                      {couponCode && (
                        <div className="flex items-center justify-between text-xs text-emerald-400 font-medium bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
                          <span>Cupom ativado: <strong>{couponCode}</strong></span>
                          <span>-10%</span>
                        </div>
                      )}
                    </form>
                  </>
                )}
              </>
            )}

            {/* STEP 2: CHECKOUT VIEW */}
            {step === 'checkout' && (
              <div className="space-y-4">
                <button
                  onClick={() => setStep('cart')}
                  className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-medium"
                >
                  ← Voltar para revisão do carrinho
                </button>

                {checkoutError && (
                  <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                    <span className="font-semibold">{checkoutError}</span>
                  </div>
                )}

                <div className="space-y-3 bg-[#161A20] p-4 rounded-xl border border-white/10">
                  <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    1. Dados de Contato & Entrega
                  </h3>

                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">Seu Nome Completo *</label>
                    <input 
                      type="text"
                      required
                      placeholder="Ex: João Silva"
                      value={customerName}
                      onChange={(e) => { setCustomerName(e.target.value); setCheckoutError(null); }}
                      className="w-full bg-[#0D0F12] border border-white/15 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">WhatsApp para aviso da rota *</label>
                    <input 
                      type="tel"
                      required
                      placeholder="(11) 98765-4321"
                      value={phone}
                      onChange={(e) => { setPhone(e.target.value); setCheckoutError(null); }}
                      className="w-full bg-[#0D0F12] border border-white/15 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">Endereço com Número *</label>
                    <input 
                      type="text"
                      required
                      placeholder="Rua, Avenida, Número..."
                      value={address}
                      onChange={(e) => { setAddress(e.target.value); setCheckoutError(null); }}
                      className="w-full bg-[#0D0F12] border border-white/15 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] text-zinc-400 mb-1">Bairro Selecionado</label>
                      <input 
                        type="text"
                        disabled
                        value={selectedZone.name}
                        className="w-full bg-[#090A0C] border border-white/10 rounded-lg px-3 py-2 text-xs text-zinc-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-zinc-400 mb-1">Complemento / Ap.</label>
                      <input 
                        type="text"
                        placeholder="Apto 42, Bloco B..."
                        value={complement}
                        onChange={(e) => setComplement(e.target.value)}
                        className="w-full bg-[#0D0F12] border border-white/15 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Selection */}
                <div className="space-y-3 bg-[#161A20] p-4 rounded-xl border border-white/10">
                  <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    2. Forma de Pagamento
                  </h3>

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('pix')}
                      className={`p-2.5 rounded-lg border text-center flex flex-col items-center justify-center gap-1.5 transition-all ${
                        paymentMethod === 'pix' 
                          ? 'border-amber-500 bg-amber-500/10 text-white font-bold' 
                          : 'border-white/10 bg-[#0D0F12] text-zinc-400 hover:text-white'
                      }`}
                    >
                      <QrCode className="w-4 h-4 text-amber-400" />
                      <span className="text-[11px]">Pix Rápido</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card_delivery')}
                      className={`p-2.5 rounded-lg border text-center flex flex-col items-center justify-center gap-1.5 transition-all ${
                        paymentMethod === 'card_delivery' 
                          ? 'border-amber-500 bg-amber-500/10 text-white font-bold' 
                          : 'border-white/10 bg-[#0D0F12] text-zinc-400 hover:text-white'
                      }`}
                    >
                      <CreditCard className="w-4 h-4 text-amber-400" />
                      <span className="text-[11px]">Cartão Maquininha</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cash')}
                      className={`p-2.5 rounded-lg border text-center flex flex-col items-center justify-center gap-1.5 transition-all ${
                        paymentMethod === 'cash' 
                          ? 'border-amber-500 bg-amber-500/10 text-white font-bold' 
                          : 'border-white/10 bg-[#0D0F12] text-zinc-400 hover:text-white'
                      }`}
                    >
                      <Banknote className="w-4 h-4 text-amber-400" />
                      <span className="text-[11px]">Dinheiro</span>
                    </button>
                  </div>

                  {paymentMethod === 'pix' && (
                    <div className="p-3 bg-[#0D1016] rounded-xl border border-amber-500/30 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                          <QrCode className="w-4 h-4" />
                          <span>Pix Instantâneo Pré-Configurado</span>
                        </div>
                        <span className="text-[10px] font-bold uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                          Oficial
                        </span>
                      </div>

                      <div className="bg-black/50 p-2.5 rounded-lg border border-white/5 space-y-1 text-[11px]">
                        <div className="flex justify-between items-center">
                          <span className="text-zinc-400">Nome do Recebedor:</span>
                          <span className="text-white font-extrabold tracking-wide font-['Syne']">ADEGA BIGODE</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-zinc-400">Chave Pix:</span>
                          <span className="text-amber-300 font-mono">pix@adegabigode.com.br</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-zinc-400">Valor a pagar:</span>
                          <span className="text-emerald-400 font-bold">R$ {total.toFixed(2)}</span>
                        </div>
                      </div>

                      <p className="text-[10px] text-zinc-400 leading-tight">
                        ⚡ Ao confirmar, o QR Code e chave Pix Copia e Cola serão exibidos na tela com o nome oficial <strong>ADEGA BIGODE</strong> para aprovação imediata.
                      </p>
                    </div>
                  )}

                  {paymentMethod === 'cash' && (
                    <div>
                      <label className="block text-[11px] text-zinc-400 mb-1">Precisa de troco para quanto?</label>
                      <input 
                        type="text"
                        placeholder="Ex: Troco para R$ 100,00"
                        value={changeFor}
                        onChange={(e) => setChangeFor(e.target.value)}
                        className="w-full bg-[#0D0F12] border border-white/15 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">Observações do Pedido (Opcional)</label>
                    <input 
                      type="text"
                      placeholder="Ex: Tocar o interfone 3 vezes, cerveja o mais gelada possível..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full bg-[#0D0F12] border border-white/15 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: SUCCESS / TRACKING VIEW */}
            {step === 'success' && (
              <div className="py-8 text-center space-y-5">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                
                <div className="space-y-2">
                  <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">
                    Pedido Gravado #{createdOrderNumber}
                  </span>
                  <h3 className="text-xl font-bold text-white font-['Syne']">
                    A NOITE TÁ SALVA!
                  </h3>
                  <p className="text-xs text-zinc-300 max-w-sm mx-auto leading-relaxed">
                    Nossa equipe na adega já retirou suas bebidas da câmara fria a -4°C e o motoboy já foi acionado para {selectedZone.name}.
                  </p>
                </div>

                {/* Pix QR Code Display for Instant Payment */}
                {paymentMethod === 'pix' && (
                  <div className="p-4 rounded-2xl bg-[#0D1016] border border-amber-500/40 text-left space-y-3 shadow-xl">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <div className="flex items-center gap-2">
                        <QrCode className="w-5 h-5 text-amber-400" />
                        <span className="font-['Syne'] font-bold text-sm text-white">PIX OFICIAL DA ADEGA</span>
                      </div>
                      <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                        Aprovação Automática
                      </span>
                    </div>

                    {/* Pre-configured Receiver Identity */}
                    <div className="bg-black/60 p-3 rounded-xl border border-white/10 space-y-1.5 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-zinc-400">Nome do Recebedor:</span>
                        <span className="text-white font-extrabold font-['Syne'] tracking-wide">ADEGA BIGODE</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-zinc-400">Chave Pix:</span>
                        <span className="text-amber-300 font-mono font-medium">pix@adegabigode.com.br</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-zinc-400">Valor exato:</span>
                        <span className="text-amber-400 font-bold text-base">R$ {total.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* QR Code Container */}
                    <div className="flex flex-col items-center justify-center p-3 bg-white rounded-xl shadow-inner">
                      {pixQrCodeUrl ? (
                        <img 
                          src={pixQrCodeUrl} 
                          alt="Pix QR Code Adega Bigode" 
                          className="w-48 h-48 sm:w-52 sm:h-52 object-contain"
                        />
                      ) : (
                        <div className="w-48 h-48 flex items-center justify-center text-zinc-500 text-xs">
                          Gerando QR Code...
                        </div>
                      )}
                      <span className="text-[10px] font-bold text-zinc-800 uppercase tracking-widest mt-1">
                        Escaneie no app do seu banco
                      </span>
                    </div>

                    {/* Copia e Cola Button */}
                    <div className="space-y-1.5">
                      <button
                        type="button"
                        onClick={handleCopyPix}
                        className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                          copiedPix 
                            ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' 
                            : 'bg-amber-500 hover:bg-amber-400 text-black shadow-lg shadow-amber-500/20 active:scale-98'
                        }`}
                      >
                        {copiedPix ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span>Código Pix Copiado com Sucesso!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            <span>Copiar Código Pix Copia e Cola</span>
                          </>
                        )}
                      </button>

                      <p className="text-[10px] text-zinc-400 text-center">
                        Abra o app do seu banco ➔ <strong>Pix Copia e Cola</strong> ➔ Cole o código e confirme o pagamento para <strong>ADEGA BIGODE</strong>.
                      </p>
                    </div>
                  </div>
                )}

                {/* Timeline */}
                <div className="p-4 rounded-xl bg-[#161A20] border border-white/10 text-left space-y-3">
                  <div className="flex items-center gap-3 text-xs">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-white font-bold">Status Atual: Na Câmara Fria / Em Separação</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span>Previsão de entrega: <strong>{selectedZone.estimatedMinutes} minutos</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <MapPin className="w-4 h-4 text-amber-400" />
                    <span>Destino: <strong>{address} ({selectedZone.name})</strong></span>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  {orderWhatsappUrl && (
                    <a
                      href={orderWhatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 active:scale-[0.99]"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span>Enviar / Acompanhar no WhatsApp</span>
                    </a>
                  )}

                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      navigateTo('track');
                    }}
                    className="w-full py-3 bg-amber-500 text-black font-bold text-sm rounded-xl hover:bg-amber-400 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
                  >
                    Acompanhar Pedido na Tela
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      navigateTo('home');
                    }}
                    className="w-full py-2.5 bg-white/10 text-zinc-300 hover:text-white font-semibold text-xs rounded-xl hover:bg-white/15 transition-colors"
                  >
                    Continuar Navegando
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer with totals & action buttons */}
          {cart.length > 0 && step !== 'success' && (
            <div className="p-4 sm:p-5 border-t border-white/10 bg-[#161A20] space-y-3">
              {/* Financial Breakdown */}
              <div className="space-y-1.5 text-xs text-zinc-300">
                <div className="flex justify-between">
                  <span>Subtotal dos itens</span>
                  <span className="font-semibold text-white">R$ {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxa de entrega ({selectedZone.name})</span>
                  <span className={deliveryFee === 0 ? 'text-emerald-400 font-bold' : 'text-white'}>
                    {deliveryFee === 0 ? 'GRÁTIS' : `R$ ${deliveryFee.toFixed(2)}`}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-medium">
                    <span>Desconto do Cupom</span>
                    <span>- R$ {discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-white/10">
                  <span className="font-['Syne']">Total Geral</span>
                  <span className="text-amber-400 font-['Syne'] text-lg">R$ {total.toFixed(2)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              {step === 'cart' ? (
                <div className="space-y-2">
                  <button
                    onClick={() => setStep('checkout')}
                    disabled={subtotal < siteConfig.minimumOrder}
                    className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                      subtotal < siteConfig.minimumOrder
                        ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-amber-500 to-amber-400 text-black hover:brightness-110 shadow-lg shadow-amber-500/25 active:scale-[0.99]'
                    }`}
                  >
                    {subtotal < siteConfig.minimumOrder ? (
                      `Mínimo de R$ ${siteConfig.minimumOrder.toFixed(2)} para entrega`
                    ) : (
                      <>
                        <span>Avançar para Entrega</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-400">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                    <span>Bebida conferida e lacrada direto da adega</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => handleFinishOrder(false)}
                    className="w-full py-3.5 rounded-xl bg-amber-500 text-black font-bold text-sm hover:bg-amber-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-[0.99]"
                  >
                    <span>Confirmar e Finalizar Pedido</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleFinishOrder(true)}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Enviar Cópia no WhatsApp da Adega</span>
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
