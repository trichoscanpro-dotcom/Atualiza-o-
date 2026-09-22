import React, { useState } from 'react';
import { useCMS } from '../context/CMSContext';
import { 
  Settings, 
  Package, 
  ShoppingBag, 
  Truck, 
  Clock, 
  MapPin, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  LogOut, 
  Check, 
  ArrowLeft,
  DollarSign,
  Beer,
  ThermometerSnowflake,
  MessageCircle,
  Phone,
  Power,
  Search,
  Filter,
  ExternalLink,
  Users,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { ProductItem, Order, DeliveryZone, CRMLead, CRMStatus } from '../types';
import { SafeImage } from '../components/SafeImage';
import { beverageImages } from '../assets/beverageImages';

type AdminTab = 'orders' | 'products' | 'general' | 'zones' | 'leads';

export const AdminPanelPage: React.FC = () => {
  const { 
    siteConfig, 
    updateSiteConfig, 
    products, 
    addProduct, 
    updateProduct, 
    deleteProduct,
    orders,
    updateOrderStatus,
    deliveryZones,
    updateDeliveryZones,
    leads,
    crmLeads,
    updateCRMStatus,
    deleteCRMLead,
    addOrUpdateCRMLead,
    logoutAdmin,
    navigateTo,
    isAdminAuthenticated
  } = useCMS();

  if (!isAdminAuthenticated) {
    navigateTo('admin-login');
    return null;
  }

  const [activeTab, setActiveTab] = useState<AdminTab>('orders');
  const [configForm, setConfigForm] = useState(siteConfig);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // CRM filter & search states
  const [crmSearch, setCrmSearch] = useState('');
  const [crmStatusFilter, setCrmStatusFilter] = useState<string>('Todos');

  // Product editing modal state
  const [editingProduct, setEditingProduct] = useState<Partial<ProductItem> | null>(null);

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteConfig(configForm);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editingProduct.name || !editingProduct.price) return;

    if (editingProduct.id) {
      updateProduct(editingProduct as ProductItem);
    } else {
      const newProduct: ProductItem = {
        id: `prod-${Date.now()}`,
        name: editingProduct.name,
        category: editingProduct.category || 'cervejas',
        categoryLabel: editingProduct.categoryLabel || 'Cervejas',
        price: Number(editingProduct.price),
        originalPrice: editingProduct.originalPrice ? Number(editingProduct.originalPrice) : undefined,
        description: editingProduct.description || '',
        imageUrl: editingProduct.imageUrl || beverageImages.beerHeinekenCold,
        volume: editingProduct.volume || '350ml',
        temperature: editingProduct.temperature || 'trincando',
        stock: editingProduct.stock ? Number(editingProduct.stock) : 50,
        badge: editingProduct.badge || '',
        isCombo: !!editingProduct.isCombo,
        comboItems: editingProduct.comboItems || []
      };
      addProduct(newProduct);
    }
    setEditingProduct(null);
  };

  return (
    <div className="bg-[#090A0C] text-[#F3F4F6] min-h-screen font-sans pb-16">
      
      {/* Top Admin Header */}
      <header className="bg-[#12151B] border-b border-amber-500/20 px-4 sm:px-6 py-4 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigateTo('home')}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
              title="Voltar ao site"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-['Syne'] font-extrabold text-base text-white">PAINEL DO BIGODE</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  ADMINISTRADOR
                </span>
              </div>
              <span className="text-xs text-zinc-400 block">Gerenciamento em tempo real do delivery</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Open/Close Toggle */}
            <button
              onClick={() => {
                const updated = !siteConfig.isOpenNow;
                updateSiteConfig({ isOpenNow: updated });
                setConfigForm({ ...configForm, isOpenNow: updated });
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                siteConfig.isOpenNow
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:bg-rose-500/30'
              }`}
            >
              <Power className="w-3.5 h-3.5" />
              <span>{siteConfig.isOpenNow ? 'Adega Aberta' : 'Adega Fechada'}</span>
            </button>

            <button
              onClick={logoutAdmin}
              className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 transition-colors"
              title="Encerrar Sessão"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Tabs Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/10 scrollbar-none">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'orders' 
                ? 'bg-amber-500 text-black shadow-md' 
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Pedidos em Tempo Real</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-black/40 font-mono text-white">
              {orders.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'products' 
                ? 'bg-amber-500 text-black shadow-md' 
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Beer className="w-4 h-4" />
            <span>Cardápio & Estoque</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-black/40 font-mono text-white">
              {products.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('general')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'general' 
                ? 'bg-amber-500 text-black shadow-md' 
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Configurações & Horários</span>
          </button>

          <button
            onClick={() => setActiveTab('zones')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'zones' 
                ? 'bg-amber-500 text-black shadow-md' 
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Bairros & Taxas</span>
          </button>

          <button
            onClick={() => setActiveTab('leads')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'leads' 
                ? 'bg-amber-500 text-black shadow-md' 
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>CRM de Atendimento</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-black/40 font-mono text-white">
              {crmLeads.length}
            </span>
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        
        {/* ========================================================
            TAB 1: PEDIDOS
        ======================================================== */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold font-['Syne'] text-white">Gestão de Pedidos</h2>
                <p className="text-xs text-zinc-400">Altere o status para atualizar o rastreamento em tempo real do cliente</p>
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="p-12 text-center bg-[#12151B] rounded-2xl border border-white/10 space-y-2">
                <ShoppingBag className="w-10 h-10 text-zinc-600 mx-auto" />
                <h4 className="text-sm font-bold text-white">Nenhum pedido registrado ainda</h4>
                <p className="text-xs text-zinc-400">Assim que os clientes finalizarem pedidos pelo site, eles aparecerão aqui com alerta.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map(order => (
                  <div 
                    key={order.id}
                    className="p-5 rounded-2xl bg-[#12151B] border border-white/10 space-y-4 hover:border-amber-500/30 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-['Syne'] font-bold text-amber-400 text-lg">#{order.id}</span>
                          <span className="text-xs text-zinc-400">• {order.createdAt}</span>
                        </div>
                        <h4 className="text-sm font-bold text-white">{order.customerName} - {order.phone}</h4>
                        <p className="text-xs text-zinc-300">{order.address} ({order.neighborhood})</p>
                        {order.complement && <p className="text-xs text-zinc-400">Compl: {order.complement}</p>}
                      </div>

                      <div className="flex flex-col sm:items-end gap-1.5">
                        <span className="text-lg font-bold font-['Syne'] text-white">
                          R$ {order.total.toFixed(2)}
                        </span>
                        <span className="text-xs text-zinc-400 uppercase">
                          Pag: <strong>{order.paymentMethod === 'pix' ? 'Pix' : order.paymentMethod === 'card_delivery' ? 'Cartão na Entrega' : 'Dinheiro'}</strong>
                        </span>
                      </div>
                    </div>

                    {/* Items List */}
                    <div className="text-xs space-y-1 text-zinc-300">
                      {order.items.map((it, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span>{it.quantity}x {it.product.name}</span>
                          <span className="font-mono text-zinc-400">R$ {(it.product.price * it.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    {/* Status Changer & WhatsApp shortcut */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-zinc-400 font-semibold">Alterar Status:</span>
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                          className="bg-[#0A0C0E] border border-white/20 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                        >
                          <option value="recebido">1. Recebido</option>
                          <option value="separando">2. Na Câmara Fria / Separando</option>
                          <option value="em_rota">3. Em Rota com Motoboy</option>
                          <option value="entregue">4. Entregue</option>
                          <option value="cancelado">Cancelado</option>
                        </select>
                      </div>

                      <a
                        href={`https://wa.me/${order.phone.replace(/\D/g, '')}?text=Ol%C3%A1%20${encodeURIComponent(order.customerName)}%2C%20aqui%20%C3%A9%20da%20Adega%20Bigode%21%20Seu%20pedido%20%23${order.id}%20est%C3%A1%20sendo%20preparado.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Abrir WhatsApp do Cliente</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TAB 2: PRODUTOS & CARDÁPIO
        ======================================================== */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold font-['Syne'] text-white">Catálogo de Bebidas & Combos</h2>
                <p className="text-xs text-zinc-400">Edite preços, estoque, descrições e cadastre novos itens</p>
              </div>

              <button
                onClick={() => setEditingProduct({
                  name: '',
                  category: 'cervejas',
                  categoryLabel: 'Cervejas',
                  price: 0,
                  stock: 50,
                  volume: '350ml',
                  temperature: 'trincando',
                  imageUrl: beverageImages.beerHeinekenCold,
                  description: ''
                })}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Adicionar Novo Produto</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map(p => (
                <div 
                  key={p.id}
                  className="p-4 rounded-xl bg-[#12151B] border border-white/10 flex items-center justify-between gap-3"
                >
                  <SafeImage 
                    src={p.imageUrl} 
                    alt={p.name} 
                    category={p.category}
                    className="w-16 h-16 rounded-lg object-cover bg-black/40 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] text-amber-400 font-bold uppercase">{p.categoryLabel}</span>
                    <h4 className="text-sm font-bold text-white truncate">{p.name}</h4>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-bold text-white font-['Syne']">R$ {p.price.toFixed(2)}</span>
                      <span className="text-zinc-500">Estoque: {p.stock} un</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => setEditingProduct(p)}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white"
                      title="Editar"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Excluir ${p.name}?`)) deleteProduct(p.id);
                      }}
                      className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 3: CONFIGURAÇÕES GERAIS
        ======================================================== */}
        {activeTab === 'general' && (
          <form onSubmit={handleSaveConfig} className="max-w-2xl bg-[#12151B] p-6 rounded-2xl border border-white/10 space-y-4">
            <h2 className="text-lg font-bold font-['Syne'] text-white">Configurações Principais da Loja</h2>
            
            {savedSuccess && (
              <div className="p-3 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                Configurações salvas com sucesso!
              </div>
            )}

            {/* Brand Logo Identity Preview */}
            <div className="p-4 rounded-xl bg-[#090A0C] border border-amber-500/30 flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-amber-400 to-amber-700 p-0.5 shrink-0 overflow-hidden shadow-lg shadow-amber-500/20">
                <img 
                  src={configForm.logoUrl || beverageImages.brandLogo} 
                  alt="Logo da Marca" 
                  className="w-full h-full object-cover rounded-[10px]"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-white block font-['Syne']">Logo Atual da Marca (Bigode Delivery)</span>
                <p className="text-[11px] text-zinc-400">
                  Emblema em tons âmbar e ouro sobre fundo preto profundo.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1">Nome da Empresa</label>
                <input 
                  type="text"
                  value={configForm.companyName}
                  onChange={(e) => setConfigForm({...configForm, companyName: e.target.value})}
                  className="w-full bg-[#0A0C0E] border border-white/15 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">WhatsApp de Atendimento</label>
                <input 
                  type="text"
                  value={configForm.whatsapp}
                  onChange={(e) => setConfigForm({...configForm, whatsapp: e.target.value})}
                  className="w-full bg-[#0A0C0E] border border-white/15 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">E-mail de Contato</label>
                <input 
                  type="email"
                  value={configForm.email}
                  onChange={(e) => setConfigForm({...configForm, email: e.target.value})}
                  className="w-full bg-[#0A0C0E] border border-white/15 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Instagram (@...)</label>
                <input 
                  type="text"
                  value={configForm.instagramUrl}
                  onChange={(e) => setConfigForm({...configForm, instagramUrl: e.target.value})}
                  className="w-full bg-[#0A0C0E] border border-white/15 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-zinc-400 mb-1">Endereço Físico da Adega</label>
                <input 
                  type="text"
                  value={configForm.address}
                  onChange={(e) => setConfigForm({...configForm, address: e.target.value})}
                  className="w-full bg-[#0A0C0E] border border-white/15 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-zinc-400 mb-1">Texto de Horários</label>
                <input 
                  type="text"
                  value={configForm.openingHoursText}
                  onChange={(e) => setConfigForm({...configForm, openingHoursText: e.target.value})}
                  className="w-full bg-[#0A0C0E] border border-white/15 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-zinc-400 mb-1">Texto do Ticker Superior</label>
                <input 
                  type="text"
                  value={configForm.announcementTicker}
                  onChange={(e) => setConfigForm({...configForm, announcementTicker: e.target.value})}
                  className="w-full bg-[#0A0C0E] border border-white/15 rounded-lg p-2.5 text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Alterações</span>
            </button>
          </form>
        )}

        {/* ========================================================
            TAB 4: BAIRROS & TAXAS
        ======================================================== */}
        {activeTab === 'zones' && (
          <div className="max-w-3xl space-y-4">
            <h2 className="text-xl font-bold font-['Syne'] text-white">Bairros Atendidos & Taxas de Entrega</h2>
            <div className="space-y-2">
              {deliveryZones.map((zone, idx) => (
                <div key={zone.id} className="p-4 rounded-xl bg-[#12151B] border border-white/10 flex items-center justify-between gap-4 text-xs">
                  <div>
                    <span className="font-bold text-white block text-sm">{zone.name}</span>
                    <span className="text-zinc-400">Tempo estimado: {zone.estimatedMinutes} min</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-amber-400 font-['Syne'] text-sm">
                      Taxa: R$ {zone.fee.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 5: CRM DE ATENDIMENTO (ADMIN EXCLUSIVO)
        ======================================================== */}
        {activeTab === 'leads' && (
          <div className="space-y-6">
            {/* CRM Header & Metrics */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#12151B] p-4 sm:p-6 rounded-2xl border border-white/10">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-bold font-title text-white">CRM de Atendimento</h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] bg-amber-500/20 text-amber-400 font-semibold border border-amber-500/30">
                    Área Administrativa
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-1">
                  Gerenciamento de contatos, histórico de mensagens e status de pedidos em andamento.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-400">Total de contatos:</span>
                <span className="text-sm font-bold font-mono text-amber-400 bg-black/40 px-3 py-1 rounded-lg border border-white/10">
                  {crmLeads.length}
                </span>
              </div>
            </div>

            {/* Search & Status Filters */}
            <div className="space-y-3 bg-[#12151B] p-4 rounded-2xl border border-white/10">
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Search field */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={crmSearch}
                    onChange={(e) => setCrmSearch(e.target.value)}
                    placeholder="Buscar por nome ou telefone do cliente..."
                    className="w-full pl-10 pr-4 py-2.5 bg-[#090A0E] border border-white/15 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 transition-colors"
                  />
                  {crmSearch && (
                    <button
                      onClick={() => setCrmSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white text-xs"
                    >
                      Limpar
                    </button>
                  )}
                </div>

                {/* Filter Selector */}
                <div className="sm:w-64">
                  <select
                    value={crmStatusFilter}
                    onChange={(e) => setCrmStatusFilter(e.target.value)}
                    className="w-full py-2.5 px-3 bg-[#090A0E] border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Todos">Todos os status</option>
                    <option value="Novo contato">Novo contato</option>
                    <option value="Aguardando resposta">Aguardando resposta</option>
                    <option value="Pedido em montagem">Pedido em montagem</option>
                    <option value="Aguardando pagamento">Aguardando pagamento</option>
                    <option value="Pedido confirmado">Pedido confirmado</option>
                    <option value="Saiu para entrega">Saiu para entrega</option>
                    <option value="Entregue">Entregue</option>
                    <option value="Cancelado">Cancelado</option>
                  </select>
                </div>
              </div>

              {/* Status Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] no-scrollbar">
                {[
                  'Todos',
                  'Novo contato',
                  'Aguardando resposta',
                  'Pedido em montagem',
                  'Aguardando pagamento',
                  'Pedido confirmado',
                  'Saiu para entrega',
                  'Entregue',
                  'Cancelado'
                ].map((st) => (
                  <button
                    key={st}
                    onClick={() => setCrmStatusFilter(st)}
                    className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                      crmStatusFilter === st
                        ? 'bg-amber-500 text-black font-bold shadow-sm'
                        : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Leads List */}
            {(() => {
              const filteredLeads = crmLeads.filter(lead => {
                const matchesSearch = 
                  crmSearch === '' || 
                  lead.customerName.toLowerCase().includes(crmSearch.toLowerCase()) || 
                  lead.phone.replace(/\D/g, '').includes(crmSearch.replace(/\D/g, ''));
                
                const matchesStatus = 
                  crmStatusFilter === 'Todos' || 
                  lead.status === crmStatusFilter;

                return matchesSearch && matchesStatus;
              });

              if (filteredLeads.length === 0) {
                return (
                  <div className="p-8 text-center bg-[#12151B] border border-white/10 rounded-2xl text-zinc-500 text-xs">
                    Nenhum contato encontrado para o filtro selecionado.
                  </div>
                );
              }

              return (
                <div className="space-y-3.5">
                  {filteredLeads.map((lead) => {
                    const statusColors: Record<string, string> = {
                      'Novo contato': 'bg-blue-500/15 text-blue-400 border-blue-500/30',
                      'Aguardando resposta': 'bg-amber-500/15 text-amber-400 border-amber-500/30',
                      'Pedido em montagem': 'bg-purple-500/15 text-purple-400 border-purple-500/30',
                      'Aguardando pagamento': 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
                      'Pedido confirmado': 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
                      'Saiu para entrega': 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
                      'Entregue': 'bg-zinc-500/20 text-zinc-300 border-zinc-500/30',
                      'Cancelado': 'bg-rose-500/15 text-rose-400 border-rose-500/30',
                    };

                    const cleanPhone = lead.phone.replace(/\D/g, '');
                    const waLink = `https://wa.me/${cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`}`;

                    return (
                      <div 
                        key={lead.id}
                        className="p-4 sm:p-5 rounded-2xl bg-[#12151B] border border-white/10 space-y-3 hover:border-amber-500/30 transition-all shadow-md"
                      >
                        {/* Top info: Name, Date, Status */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <span className="font-bold text-white text-sm sm:text-base font-title">
                              {lead.customerName}
                            </span>
                            <span className="text-[11px] text-zinc-500 flex items-center gap-1 font-mono">
                              <Calendar className="w-3 h-3 text-zinc-500" />
                              {lead.dateTime}
                            </span>
                          </div>

                          {/* Status changer */}
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-zinc-400 hidden sm:inline">Status:</span>
                            <select
                              value={lead.status}
                              onChange={(e) => updateCRMStatus(lead.id, e.target.value as CRMStatus)}
                              className={`text-xs px-2.5 py-1 rounded-lg border font-bold focus:outline-none cursor-pointer ${
                                statusColors[lead.status] || 'bg-white/10 text-white'
                              }`}
                            >
                              <option value="Novo contato">Novo contato</option>
                              <option value="Aguardando resposta">Aguardando resposta</option>
                              <option value="Pedido em montagem">Pedido em montagem</option>
                              <option value="Aguardando pagamento">Aguardando pagamento</option>
                              <option value="Pedido confirmado">Pedido confirmado</option>
                              <option value="Saiu para entrega">Saiu para entrega</option>
                              <option value="Entregue">Entregue</option>
                              <option value="Cancelado">Cancelado</option>
                            </select>
                          </div>
                        </div>

                        {/* Last Message */}
                        <div className="bg-[#0A0C0F] p-3 rounded-xl border border-white/5 space-y-1 text-xs">
                          <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
                            Última Mensagem:
                          </span>
                          <p className="text-zinc-200 italic">"{lead.lastMessage}"</p>
                        </div>

                        {/* Products & Total */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-white/5 text-xs">
                          <div className="space-y-1">
                            <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
                              Produtos Escolhidos:
                            </span>
                            {lead.orderedProducts && lead.orderedProducts.length > 0 ? (
                              <div className="flex flex-wrap gap-1.5 mt-1">
                                {lead.orderedProducts.map((prod, idx) => (
                                  <span 
                                    key={idx}
                                    className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-zinc-300 text-[11px]"
                                  >
                                    {prod.quantity}x {prod.name} (R$ {(prod.unitPrice * prod.quantity).toFixed(2).replace('.', ',')})
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <p className="text-zinc-500 text-[11px]">Nenhum produto fechado ainda</p>
                            )}
                          </div>

                          <div className="flex items-center gap-4 shrink-0 sm:text-right">
                            <div>
                              <span className="text-[10px] text-zinc-400 block uppercase">Valor Total</span>
                              <span className="font-bold text-amber-400 text-sm sm:text-base font-mono">
                                R$ {lead.totalValue.toFixed(2).replace('.', ',')}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Bottom Actions: Open WhatsApp directly & Delete */}
                        <div className="flex items-center justify-between gap-3 pt-2 border-t border-white/5">
                          <div className="flex items-center gap-2 text-xs text-zinc-400">
                            <Phone className="w-3.5 h-3.5 text-zinc-500" />
                            <span className="font-mono text-zinc-300">{lead.phone}</span>
                            {lead.address && (
                              <span className="text-zinc-500 hidden md:inline">• {lead.address}</span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <a
                              href={waLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>Abrir no WhatsApp</span>
                              <ExternalLink className="w-3 h-3 ml-0.5" />
                            </a>

                            <button
                              onClick={() => deleteCRMLead(lead.id)}
                              className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                              title="Excluir Contato"
                              aria-label="Excluir contato do CRM"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        )}

      </div>

      {/* Product Edit / Create Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <form onSubmit={handleSaveProduct} className="bg-[#141820] border border-amber-500/30 rounded-2xl max-w-lg w-full p-6 space-y-4 text-xs text-white max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold font-['Syne'] text-amber-400">
              {editingProduct.id ? 'Editar Produto' : 'Novo Produto'}
            </h3>

            <div>
              <label className="block text-zinc-400 mb-1">Nome do Produto</label>
              <input 
                type="text"
                required
                value={editingProduct.name || ''}
                onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                className="w-full bg-[#0A0C0E] border border-white/15 rounded-lg p-2.5 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-zinc-400 mb-1">Preço (R$)</label>
                <input 
                  type="number"
                  step="0.01"
                  required
                  value={editingProduct.price || 0}
                  onChange={(e) => setEditingProduct({...editingProduct, price: Number(e.target.value)})}
                  className="w-full bg-[#0A0C0E] border border-white/15 rounded-lg p-2.5 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Preço Original / De (opcional)</label>
                <input 
                  type="number"
                  step="0.01"
                  value={editingProduct.originalPrice || ''}
                  onChange={(e) => setEditingProduct({...editingProduct, originalPrice: e.target.value ? Number(e.target.value) : undefined})}
                  className="w-full bg-[#0A0C0E] border border-white/15 rounded-lg p-2.5 text-white font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-zinc-400 mb-1">Categoria</label>
                <select
                  value={editingProduct.category || 'cervejas'}
                  onChange={(e) => {
                    const cat = e.target.value;
                    const labels: Record<string, string> = {
                      cervejas: 'Cervejas',
                      destilados: 'Destilados',
                      combos: 'Combos da Noite',
                      vinhos: 'Vinhos',
                      gelo_essenciais: 'Gelo & Essenciais',
                      sem_alcool: 'Não Alcoólicos',
                      snacks: 'Snacks'
                    };
                    setEditingProduct({
                      ...editingProduct, 
                      category: cat as any,
                      categoryLabel: labels[cat] || cat,
                      isCombo: cat === 'combos'
                    });
                  }}
                  className="w-full bg-[#0A0C0E] border border-white/15 rounded-lg p-2.5 text-white"
                >
                  <option value="combos">Combos da Noite</option>
                  <option value="cervejas">Cervejas</option>
                  <option value="destilados">Destilados</option>
                  <option value="vinhos">Vinhos</option>
                  <option value="gelo_essenciais">Gelo & Essenciais</option>
                  <option value="sem_alcool">Sem Álcool / Energéticos</option>
                  <option value="snacks">Snacks</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Volume / Tamanho</label>
                <input 
                  type="text"
                  value={editingProduct.volume || '350ml'}
                  onChange={(e) => setEditingProduct({...editingProduct, volume: e.target.value})}
                  className="w-full bg-[#0A0C0E] border border-white/15 rounded-lg p-2.5 text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-zinc-400 mb-1">URL da Imagem</label>
              <input 
                type="text"
                value={editingProduct.imageUrl || ''}
                onChange={(e) => setEditingProduct({...editingProduct, imageUrl: e.target.value})}
                className="w-full bg-[#0A0C0E] border border-white/15 rounded-lg p-2.5 text-white"
              />
            </div>

            <div>
              <label className="block text-zinc-400 mb-1">Descrição</label>
              <textarea 
                rows={2}
                value={editingProduct.description || ''}
                onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                className="w-full bg-[#0A0C0E] border border-white/15 rounded-lg p-2.5 text-white"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="px-4 py-2 rounded-xl bg-white/10 text-white font-bold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-amber-500 text-black font-bold"
              >
                Salvar Produto
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
