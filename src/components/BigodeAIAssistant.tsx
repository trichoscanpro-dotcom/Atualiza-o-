import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  X, 
  ShoppingBag, 
  PhoneCall, 
  CheckCircle2, 
  ArrowRight,
  ExternalLink,
  MessageCircle,
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { useCMS } from '../context/CMSContext';
import { 
  OFFICIAL_WHATSAPP_NUMBER, 
  buildOrderConfirmationWhatsAppText,
  HIGH_CONVERTING_MESSAGES
} from '../utils/whatsapp';
import { ProductItem } from '../types';

export interface ChatActionButton {
  label: string;
  action?: () => void;
  actionType?: 'open_cart' | 'open_checkout' | 'whatsapp' | 'preset' | 'close';
  presetText?: string;
  whatsappUrl?: string;
  variant?: 'primary' | 'whatsapp' | 'secondary';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  time: string;
  actionButtons?: ChatActionButton[];
  addedProducts?: {
    product: ProductItem;
    quantity: number;
  }[];
  showGoToCheckout?: boolean;
}

export const BigodeAIAssistant: React.FC = () => {
  const { 
    products, 
    cart, 
    addToCart, 
    removeFromCart,
    updateCartQuantity,
    clearCart,
    total, 
    deliveryFee, 
    selectedZone,
    setIsCartOpen,
    addOrUpdateCRMLead
  } = useCMS();

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingProgress, setTypingProgress] = useState(0);
  const [countdownSeconds, setCountdownSeconds] = useState(7);

  // Customer info identified in conversation
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    address: '',
    neighborhood: '',
    paymentMethod: 'Pix'
  });

  // Initial greeting
  const initialWelcomeMessage: ChatMessage = {
    id: 'msg-welcome-bigode',
    role: 'assistant',
    content: 'Olá! Sou o assistente virtual da Adega Bigode Delivery. Como posso ajudar com seu pedido hoje?',
    time: 'Agora',
    actionButtons: [
      {
        label: '🍺 Quero uma haikene de 300',
        presetText: 'Quero uma haikene de 300',
        actionType: 'preset',
        variant: 'primary'
      },
      {
        label: '❄️ Tem cerveja gelada?',
        presetText: 'Tem cerveja gelada?',
        actionType: 'preset',
        variant: 'secondary'
      },
      {
        label: '💰 Qual a bebida mais barata?',
        presetText: 'Qual a bebida mais barata?',
        actionType: 'preset',
        variant: 'secondary'
      },
      {
        label: '📍 Onde entregam?',
        presetText: 'Onde entregam?',
        actionType: 'preset',
        variant: 'secondary'
      },
      {
        label: '💬 Falar com atendente',
        presetText: 'Quero falar com uma pessoa',
        actionType: 'preset',
        variant: 'secondary'
      }
    ]
  };

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('bigode_chat_history_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return [initialWelcomeMessage];
    } catch {
      return [initialWelcomeMessage];
    }
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  useEffect(() => {
    try {
      localStorage.setItem('bigode_chat_history_v2', JSON.stringify(messages));
    } catch (e) {
      console.error(e);
    }
  }, [messages]);

  const handleClearHistory = () => {
    try {
      localStorage.removeItem('bigode_chat_history_v2');
    } catch (e) {
      console.error(e);
    }
    setMessages([initialWelcomeMessage]);
  };

  // Sync to CRM whenever customer interacts
  const syncCRM = (lastMsg: string) => {
    try {
      addOrUpdateCRMLead({
        customerName: customerInfo.name || 'Cliente Chatbot',
        phone: OFFICIAL_WHATSAPP_NUMBER,
        dateTime: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        lastMessage: lastMsg,
        orderedProducts: cart.map(c => ({
          name: c.product.name,
          quantity: c.quantity,
          unitPrice: c.product.price
        })),
        totalValue: total,
        status: cart.length > 0 ? 'Pedido em montagem' : 'Novo contato',
        address: customerInfo.address || selectedZone.name,
        paymentMethod: customerInfo.paymentMethod
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenCart = () => {
    setIsCartOpen(true);
    if (window.innerWidth < 640) {
      setIsOpen(false);
    }
  };

  // WhatsApp order URL generation adhering to Requirement 7
  const triggerWhatsAppOrderConfirmation = () => {
    const items = cart.map(c => ({
      name: c.product.name,
      quantity: c.quantity,
      unitPrice: c.product.price
    }));

    const text = buildOrderConfirmationWhatsAppText({
      items,
      total,
      customerName: customerInfo.name || 'Cliente',
      address: customerInfo.address || selectedZone.name,
      neighborhood: customerInfo.neighborhood,
      paymentMethod: customerInfo.paymentMethod || 'A combinar'
    });

    const url = `https://wa.me/5538988608576?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const triggerWhatsAppAttendant = () => {
    const url = `https://wa.me/5538988608576?text=${encodeURIComponent(HIGH_CONVERTING_MESSAGES.attendant)}`;
    window.open(url, '_blank');
  };

  const handleButtonClick = (btn: ChatActionButton) => {
    if (btn.actionType === 'open_cart' || btn.actionType === 'open_checkout') {
      handleOpenCart();
      return;
    }

    if (btn.actionType === 'close' || btn.label.includes('Continuar comprando')) {
      setIsOpen(false);
      return;
    }

    if (btn.actionType === 'whatsapp' || btn.variant === 'whatsapp' || /finalizar pelo whatsapp/i.test(btn.label)) {
      if (/falar com atendente|falar no whatsapp/i.test(btn.label)) {
        triggerWhatsAppAttendant();
        return;
      }
      triggerWhatsAppOrderConfirmation();
      return;
    }

    if (btn.presetText) {
      handleSendMessage(btn.presetText);
      return;
    }

    if (typeof btn.action === 'function') {
      btn.action();
      return;
    }

    handleSendMessage(btn.label);
  };

  // Main Send Message with ~7-second visual thinking delay and Gemini API
  const handleSendMessage = async (customText?: string) => {
    const rawText = (customText !== undefined ? customText : input).trim();
    if (!rawText || isTyping) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: rawText,
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);
    setTypingProgress(0);
    setCountdownSeconds(7);

    // Sync CRM
    syncCRM(rawText);

    // 1. Immediately launch API request in background
    const apiPromise = fetch('/api/gemini/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: rawText,
        history: newMessages.slice(-8).map(m => ({
          role: m.role === 'user' ? 'user' : 'model',
          content: m.content
        })),
        cart: cart.map(c => ({
          id: c.product.id,
          name: c.product.name,
          quantity: c.quantity,
          price: c.product.price
        })),
        customerInfo
      })
    })
      .then(res => res.json())
      .catch(err => {
        console.error('Chat error:', err);
        // Resposta inteligente caso offline
        const lower = rawText.toLowerCase();
        let prodFound = products.find(p => lower.includes(p.name.toLowerCase()));
        if (!prodFound) {
          if (lower.includes('black label')) prodFound = products.find(p => p.id === 'spirit-1');
          else if (lower.includes('gelo')) prodFound = products.find(p => p.id === 'ice-1');
          else if (lower.includes('carvao') || lower.includes('carvão')) prodFound = products.find(p => p.id === 'ice-3');
          else if (lower.includes('jack')) prodFound = products.find(p => p.id === 'spirit-2');
          else if (lower.includes('heineken')) prodFound = products.find(p => p.id === 'beer-1');
        }

        if (prodFound) {
          return {
            reply: `Anotado! Adicionei ${prodFound.name} ao seu carrinho. Quer adicionar algo mais, como gelo de 5kg ou carvão, ou posso finalizar o seu pedido?`,
            cartAction: { type: 'ADD', productId: prodFound.id, productName: prodFound.name, quantity: 1 },
            quickReplies: ['Pode finalizar pedido', 'Adicionar Gelo 5kg', 'Adicionar Carvão 3kg'],
            showWhatsAppFinalize: false,
            showTalkToHuman: false
          };
        }

        return {
          reply: 'Perfeito! Anotei seu pedido. Deseja adicionar mais alguma bebida trincando a -4°C, saco de gelo ou carvão, ou posso finalizar seu pedido?',
          cartAction: { type: 'NONE', productId: '', productName: '', quantity: 0 },
          quickReplies: ['Pode finalizar pedido', 'Quero Black Label (R$ 159,90)', 'Saco de gelo 5kg', 'Carvão 3kg'],
          showWhatsAppFinalize: cart.length > 0,
          showTalkToHuman: false
        };
      });

    // 2. Delay responsivo e natural de digitação (1 segundo)
    const TARGET_DELAY_MS = 1000;
    const startTime = Date.now();

    const progressTimer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / TARGET_DELAY_MS) * 100));
      const remaining = Math.max(1, Math.ceil((TARGET_DELAY_MS - elapsed) / 1000));
      setTypingProgress(pct);
      setCountdownSeconds(remaining);
    }, 150);

    const [apiResult] = await Promise.all([
      apiPromise,
      new Promise(resolve => setTimeout(resolve, TARGET_DELAY_MS))
    ]);

    clearInterval(progressTimer);
    setIsTyping(false);
    setTypingProgress(0);

    // 3. Process API result
    const replyText = apiResult?.reply || (cart.length > 0 ? 'Anotado! Deseja acrescentar mais algo ou posso finalizar seu pedido?' : 'Entendido! Me diga o que gostaria de pedir agora que já adiciono ao seu carrinho!');
    const isFallback = !!apiResult?.isFallback;
    const showTalkToHuman = !!apiResult?.showTalkToHuman;
    const showWhatsAppFinalize = !!apiResult?.showWhatsAppFinalize;

    // Apply cart actions if instructed by Gemini
    const action = apiResult?.cartAction;
    const addedItemsList: { product: ProductItem; quantity: number }[] = [];

    if (action && action.type && action.type !== 'NONE') {
      const prod = products.find(p => p.id === action.productId) ||
                   products.find(p => p.name.toLowerCase().includes((action.productName || '').toLowerCase()));
      if (prod) {
        if (action.type === 'ADD') {
          const qty = Math.max(1, action.quantity || 1);
          addToCart(prod, qty);
          addedItemsList.push({ product: prod, quantity: qty });
        } else if (action.type === 'UPDATE_QUANTITY') {
          updateCartQuantity(prod.id, action.quantity);
        } else if (action.type === 'REMOVE') {
          removeFromCart(prod.id);
        } else if (action.type === 'CLEAR') {
          clearCart();
        }
      }
    }

    // Update customer info if detected by AI
    if (apiResult?.detectedInfo) {
      setCustomerInfo(prev => ({
        name: apiResult.detectedInfo.customerName || prev.name,
        address: apiResult.detectedInfo.address || prev.address,
        neighborhood: apiResult.detectedInfo.neighborhood || prev.neighborhood,
        paymentMethod: apiResult.detectedInfo.paymentMethod || prev.paymentMethod
      }));
    }

    // 4. Assemble Action Buttons strictly per requirements
    const actionButtons: ChatActionButton[] = [];

    if (showWhatsAppFinalize || /finalizar|resumo|pedido está pronto|deseja finalizar/i.test(replyText)) {
      actionButtons.push({
        label: '📲 Finalizar pelo WhatsApp',
        actionType: 'whatsapp',
        variant: 'whatsapp'
      });
      actionButtons.push({
        label: '💬 Falar com atendente',
        actionType: 'whatsapp',
        variant: 'secondary'
      });
      actionButtons.push({
        label: '🛒 Continuar comprando',
        actionType: 'close',
        variant: 'secondary'
      });
    } else if (isFallback || showTalkToHuman || replyText.includes('atendente')) {
      actionButtons.push({
        label: '💬 Falar no WhatsApp',
        actionType: 'whatsapp',
        variant: 'whatsapp'
      });
      actionButtons.push({
        label: '🛒 Continuar comprando',
        actionType: 'close',
        variant: 'secondary'
      });
    }

    // Add contextual quick replies suggested by AI
    if (Array.isArray(apiResult?.quickReplies)) {
      apiResult.quickReplies.forEach((q: string) => {
        if (!actionButtons.some(b => b.label.toLowerCase() === q.toLowerCase())) {
          actionButtons.push({
            label: q,
            presetText: q,
            actionType: 'preset',
            variant: 'secondary'
          });
        }
      });
    }

    const botMessage: ChatMessage = {
      id: `bot-${Date.now()}`,
      role: 'assistant',
      content: replyText,
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      actionButtons: actionButtons.length > 0 ? actionButtons : undefined,
      addedProducts: addedItemsList.length > 0 ? addedItemsList : undefined,
      showGoToCheckout: showWhatsAppFinalize || addedItemsList.length > 0
    };

    setMessages(prev => [...prev, botMessage]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-18 sm:bottom-6 right-3 sm:right-6 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="group relative flex items-center gap-2 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-black font-bold text-xs sm:text-sm shadow-xl shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all duration-300 border border-amber-300/50 cursor-pointer min-h-[44px]"
          title="Atendimento e Pedidos - Adega Bigode"
          aria-label="Abrir assistente de pedidos Adega Bigode"
        >
          <div className="relative shrink-0">
            <Bot className="w-5 h-5 text-black" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-black animate-pulse" />
          </div>
          <span className="hidden sm:inline font-semibold tracking-tight">Adega Bigode AI</span>
          <span className="sm:hidden font-bold text-xs">Assistente Bigode</span>
          {cart.length > 0 && (
            <span className="bg-black text-amber-400 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-amber-400 shrink-0">
              {cart.length}
            </span>
          )}
        </button>
      </div>

      {/* Chat Window Modal */}
      {isOpen && (
        <div 
          className="fixed bottom-18 sm:bottom-20 right-2 sm:right-6 left-2 sm:left-auto z-50 max-w-sm sm:max-w-md bg-[#0D1015] border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300"
          style={{ height: '540px', maxHeight: '80vh' }}
        >
          {/* Header */}
          <div className="p-3.5 sm:p-4 bg-gradient-to-r from-[#141820] to-[#0D1015] border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 p-0.5 shadow-md shrink-0">
                <div className="w-full h-full bg-black rounded-[10px] flex items-center justify-center">
                  <Bot className="w-5 h-5 text-amber-400" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-black" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white leading-tight">Adega Bigode Delivery</h3>
                <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Online • Assistente Conversacional
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={handleClearHistory}
                className="p-2 text-zinc-400 hover:text-amber-400 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                title="Limpar histórico da conversa"
                aria-label="Limpar histórico"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={handleOpenCart}
                className="p-2 text-zinc-400 hover:text-amber-400 hover:bg-white/5 rounded-lg transition-colors relative cursor-pointer"
                title="Abrir cooler"
                aria-label="Abrir cooler de bebidas"
              >
                <ShoppingBag className="w-5 h-5" />
                {cart.length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-amber-400 text-black text-[10px] font-extrabold flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                aria-label="Fechar chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs bg-[#0D1015]/95">
            {messages.map(msg => {
              const isAssistant = msg.role === 'assistant';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl p-3.5 leading-relaxed ${
                      isAssistant
                        ? 'bg-[#181C24] text-zinc-200 border border-white/10 rounded-tl-xs shadow-md'
                        : 'bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold rounded-tr-xs shadow-md'
                    }`}
                  >
                    <div className="whitespace-pre-line text-[13px]">{msg.content}</div>

                    {/* Added Products Card */}
                    {msg.addedProducts && msg.addedProducts.length > 0 && (
                      <div className="mt-2.5 pt-2.5 border-t border-white/10 space-y-2">
                        <div className="text-[11px] font-bold text-amber-400 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>Adicionado ao seu pedido:</span>
                        </div>
                        <div className="space-y-1.5 bg-black/60 rounded-xl p-2.5 border border-white/10">
                          {msg.addedProducts.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between gap-2 text-xs">
                              <div className="flex items-center gap-2 min-w-0">
                                <img 
                                  src={item.product.imageUrl} 
                                  alt={item.product.name} 
                                  className="w-9 h-9 rounded-lg object-cover shrink-0 border border-white/10 bg-zinc-900"
                                  referrerPolicy="no-referrer"
                                />
                                <div className="truncate">
                                  <span className="font-semibold text-white truncate block text-[11px]">
                                    {item.quantity}x {item.product.name}
                                  </span>
                                  <span className="text-[10px] text-zinc-400">
                                    R$ {item.product.price.toFixed(2).replace('.', ',')} un.
                                  </span>
                                </div>
                              </div>
                              <span className="font-bold text-amber-400 shrink-0 font-mono text-[11px]">
                                R$ {(item.product.price * item.quantity).toFixed(2).replace('.', ',')}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons inside Assistant Message */}
                    {msg.actionButtons && msg.actionButtons.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-white/10 flex flex-wrap gap-1.5">
                        {msg.actionButtons.map((btn, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleButtonClick(btn)}
                            className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                              btn.variant === 'whatsapp'
                                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm font-bold'
                                : btn.variant === 'primary'
                                ? 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black shadow-sm font-bold'
                                : 'bg-white/10 hover:bg-white/20 text-zinc-200'
                            }`}
                          >
                            <span>{btn.label}</span>
                            {btn.variant === 'whatsapp' && <ExternalLink className="w-3 h-3 shrink-0" />}
                            {btn.variant === 'primary' && <ArrowRight className="w-3 h-3 shrink-0" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-zinc-500 mt-1 px-1">{msg.time}</span>
                </div>
              );
            })}

            {/* Requirement 6: "Analisando seu pedido…" with 3 Animated Bouncing Dots & ~7s Visual Simulation */}
            {isTyping && (
              <div className="flex flex-col gap-1.5 bg-[#181C24] text-zinc-300 border border-amber-500/30 rounded-2xl rounded-tl-xs p-3.5 w-fit max-w-[85%] shadow-xl">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-xs font-semibold text-amber-300 ml-1">Analisando seu pedido…</span>
                </div>
                <div className="w-full bg-black/50 h-1.5 rounded-full overflow-hidden mt-1">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-300 rounded-full"
                    style={{ width: `${typingProgress}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[10px] text-zinc-400 font-mono mt-0.5">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    Inteligência Adega Bigode
                  </span>
                  <span>{countdownSeconds}s</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Preset Prompts Pills */}
          <div className="p-2 bg-[#10131A] border-t border-white/5 overflow-x-auto flex gap-1.5 no-scrollbar shrink-0">
            <button
              onClick={() => handleSendMessage('Quero uma haikene de 300')}
              className="px-2.5 py-1 rounded-full bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-[11px] whitespace-nowrap active:scale-95 transition-all font-semibold cursor-pointer"
            >
              🍺 Quero uma haikene de 300
            </button>
            <button
              onClick={() => handleSendMessage('Tem cerveja gelada?')}
              className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 text-[11px] whitespace-nowrap active:scale-95 transition-all cursor-pointer"
            >
              ❄️ Tem cerveja gelada?
            </button>
            <button
              onClick={() => handleSendMessage('Qual a bebida mais barata?')}
              className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 text-[11px] whitespace-nowrap active:scale-95 transition-all cursor-pointer"
            >
              💰 Mais barata?
            </button>
            <button
              onClick={() => handleSendMessage('Onde entregam?')}
              className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 text-[11px] whitespace-nowrap active:scale-95 transition-all cursor-pointer"
            >
              📍 Onde entregam?
            </button>
            <button
              onClick={() => triggerWhatsAppAttendant()}
              className="px-2.5 py-1 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[11px] whitespace-nowrap active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
            >
              <PhoneCall className="w-3 h-3" /> Falar com atendente
            </button>
          </div>

          {/* Chat Input Field */}
          <div className="p-3 bg-[#13161F] border-t border-white/10">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ex: Quero uma haikene de 300..."
                className="flex-1 bg-[#1A1E27] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 transition-colors"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!input.trim() || isTyping}
                className={`p-2.5 rounded-xl transition-all ${
                  input.trim() && !isTyping
                    ? 'bg-amber-400 hover:bg-amber-300 text-black cursor-pointer shadow-md'
                    : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                }`}
                aria-label="Enviar mensagem"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
