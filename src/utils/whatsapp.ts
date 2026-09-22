export const OFFICIAL_WHATSAPP_NUMBER = '5538988608576';
export const OFFICIAL_WHATSAPP_DISPLAY = '+55 (38) 98860-8576';
export const OFFICIAL_WHATSAPP_LINK = 'https://wa.me/5538988608576';

/**
 * High-Converting WhatsApp CTA Messages for Adega Bigode Delivery
 */
export const HIGH_CONVERTING_MESSAGES = {
  // Main CTA for mobile bar & fast night orders
  general: `Olá, Adega Bigode! Quero fazer um pedido de bebidas estalando de geladas. Pode me enviar o cardápio ou as promoções de hoje?`,

  // Attendant CTA
  attendant: `Olá, Adega Bigode! Gostaria de falar com um atendente para tirar uma dúvida sobre meu pedido.`,

  // CTA for emergency party refill
  urgent: `Olá, Adega Bigode! O estoque tá acabando aqui na nossa resenha! Preciso de cerveja trincando e gelo com urgência. Consegue despachar agora?`,

  // Product specific
  product: (productName: string) =>
    `Olá, Adega Bigode! Vi o produto ${productName} no site e quero pedir agora no capricho com entrega expressa. Podem separar pra mim?`,

  // Combos
  combo: `Olá, Adega Bigode! Quero garantir um combo top para o esquenta de hoje com entrega expressa. Como tá a fila de entrega agora?`,

  // Fast help
  help: `Olá, Adega Bigode! Quero fazer um pedido rápido pelo WhatsApp. Qual a melhor recomendação de cerveja ou combo para hoje?`,
};

export interface OrderItemWhatsApp {
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface OrderWhatsAppPayload {
  orderId?: string;
  customerName?: string;
  phone?: string;
  address?: string;
  neighborhood?: string;
  complement?: string;
  items: OrderItemWhatsApp[];
  subtotal?: number;
  deliveryFee?: number;
  discount?: number;
  total: number;
  paymentMethod?: 'pix' | 'card_delivery' | 'cash' | string;
  changeFor?: string;
  notes?: string;
}

/**
 * Builds the exact message specified in Requirement 5:
 * “Olá, Adega Bigode! Quero fazer um pedido.
 * 
 * Produtos:
 * [LISTA DOS PRODUTOS]
 * 
 * Total:
 * [VALOR TOTAL]
 * 
 * Nome:
 * [NOME DO CLIENTE]
 * 
 * Endereço:
 * [ENDEREÇO]
 * 
 * Forma de pagamento:
 * [FORMA DE PAGAMENTO]
 * 
 * Aguardo a confirmação do pedido.”
 */
export function buildOrderWhatsAppText(data: OrderWhatsAppPayload): string {
  const itemsText = data.items.length > 0
    ? data.items
        .map(item => `- ${item.quantity}x ${item.name} (R$ ${(item.unitPrice * item.quantity).toFixed(2).replace('.', ',')})`)
        .join('\n')
    : '- Nenhum item adicionado';

  let paymentText = 'A combinar';
  if (data.paymentMethod === 'pix') {
    paymentText = 'Pix Instantâneo';
  } else if (data.paymentMethod === 'card_delivery' || data.paymentMethod?.toLowerCase().includes('cart')) {
    paymentText = 'Cartão na Entrega (Débito/Crédito)';
  } else if (data.paymentMethod === 'cash' || data.paymentMethod?.toLowerCase().includes('dinheiro')) {
    paymentText = `Dinheiro em Espécie${data.changeFor ? ` (Troco para R$ ${data.changeFor})` : ' (Sem troco)'}`;
  } else if (data.paymentMethod) {
    paymentText = data.paymentMethod;
  }

  const customerNameText = data.customerName?.trim() || 'A informar';
  const fullAddress = [
    data.address?.trim(),
    data.neighborhood?.trim() ? `Bairro: ${data.neighborhood.trim()}` : '',
    data.complement?.trim() ? `(${data.complement.trim()})` : ''
  ].filter(Boolean).join(' - ') || 'A combinar';

  const totalFormatted = `R$ ${data.total.toFixed(2).replace('.', ',')}`;

  return `Olá, Adega Bigode! Quero fazer um pedido.

Produtos:
${itemsText}

Total:
${totalFormatted}

Nome:
${customerNameText}

Endereço:
${fullAddress}

Forma de pagamento:
${paymentText}

Aguardo a confirmação do pedido.`;
}

/**
 * Builds the exact message specified in Requirement 7:
 * “Olá, Adega Bigode! Quero confirmar meu pedido.
 * 
 * Produtos:
 * [PRODUTOS]
 * 
 * Total:
 * [VALOR TOTAL]
 * 
 * Nome:
 * [NOME]
 * 
 * Endereço:
 * [ENDEREÇO]
 * 
 * Forma de pagamento:
 * [FORMA DE PAGAMENTO]”
 */
export function buildOrderConfirmationWhatsAppText(data: OrderWhatsAppPayload): string {
  const itemsText = data.items.length > 0
    ? data.items
        .map(item => `- ${item.quantity}x ${item.name} (R$ ${(item.unitPrice * item.quantity).toFixed(2).replace('.', ',')})`)
        .join('\n')
    : '- Nenhum item adicionado';

  let paymentText = 'A combinar';
  if (data.paymentMethod === 'pix') {
    paymentText = 'Pix Instantâneo';
  } else if (data.paymentMethod === 'card_delivery' || data.paymentMethod?.toLowerCase().includes('cart')) {
    paymentText = 'Cartão na Entrega (Débito/Crédito)';
  } else if (data.paymentMethod === 'cash' || data.paymentMethod?.toLowerCase().includes('dinheiro')) {
    paymentText = `Dinheiro em Espécie${data.changeFor ? ` (Troco para R$ ${data.changeFor})` : ' (Sem troco)'}`;
  } else if (data.paymentMethod) {
    paymentText = data.paymentMethod;
  }

  const customerNameText = data.customerName?.trim() || 'A informar';
  const fullAddress = [
    data.address?.trim(),
    data.neighborhood?.trim() ? `Bairro: ${data.neighborhood.trim()}` : '',
    data.complement?.trim() ? `(${data.complement.trim()})` : ''
  ].filter(Boolean).join(' - ') || 'A combinar';

  const totalFormatted = `R$ ${data.total.toFixed(2).replace('.', ',')}`;

  return `Olá, Adega Bigode! Quero confirmar meu pedido.

Produtos:
${itemsText}

Total:
${totalFormatted}

Nome:
${customerNameText}

Endereço:
${fullAddress}

Forma de pagamento:
${paymentText}`;
}

export function formatWhatsAppPhone(phone: string = OFFICIAL_WHATSAPP_NUMBER): string {
  let clean = phone.replace(/\D/g, '');
  if (clean.length === 10 || clean.length === 11) {
    clean = `55${clean}`;
  }
  return clean || OFFICIAL_WHATSAPP_NUMBER;
}

export function getWhatsAppUrl(phone: string = OFFICIAL_WHATSAPP_NUMBER, text: string = HIGH_CONVERTING_MESSAGES.general): string {
  const cleanPhone = formatWhatsAppPhone(phone);
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

export function getOfficialWhatsAppUrl(text: string = HIGH_CONVERTING_MESSAGES.general): string {
  return `https://wa.me/${OFFICIAL_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

export function getWhatsAppOrderUrl(phone: string = OFFICIAL_WHATSAPP_NUMBER, data: OrderWhatsAppPayload): string {
  const message = buildOrderWhatsAppText(data);
  return getWhatsAppUrl(phone, message);
}

export function getWhatsAppConfirmationUrl(phone: string = OFFICIAL_WHATSAPP_NUMBER, data: OrderWhatsAppPayload): string {
  const message = buildOrderConfirmationWhatsAppText(data);
  return getWhatsAppUrl(phone, message);
}

