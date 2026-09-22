import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini Client
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

const CATALOG_ITEMS = [
  { id: 'beer-1', name: 'Heineken Long Neck 330ml', category: 'cervejas', volume: '330ml', price: 8.49, temp: '-4°C' },
  { id: 'beer-2', name: 'Corona Extra Long Neck 330ml com Limão', category: 'cervejas', volume: '330ml', price: 8.99, temp: '-4°C' },
  { id: 'beer-3', name: 'Stella Artois Long Neck 330ml Gelada', category: 'cervejas', volume: '330ml', price: 8.49, temp: '-4°C' },
  { id: 'beer-4', name: 'Spaten Munich Helles Puro Malte 350ml', category: 'cervejas', volume: '350ml', price: 5.79, temp: '-4°C' },
  { id: 'beer-5', name: 'Pack Cerveja Amstel Puro Malte 12 Latas 350ml', category: 'cervejas', volume: '12x 350ml', price: 49.90, temp: '-4°C' },
  { id: 'beer-6', name: 'Budweiser American Lager Long Neck 330ml', category: 'cervejas', volume: '330ml', price: 7.99, temp: '-4°C' },
  { id: 'beer-7', name: 'Brahma Duplo Malte Lata 350ml Trincando', category: 'cervejas', volume: '350ml', price: 5.49, temp: '-4°C' },
  { id: 'combo-1', name: 'Combo After Dark: Black Label 1L + 4 Red Bull + Gelo de Coco', category: 'combos', volume: 'Kit Completo', price: 199.90 },
  { id: 'combo-2', name: 'Combo Resenha: 24 Heinekens Long Neck + Gelo 5kg', category: 'combos', volume: 'Pack 24un + 5kg', price: 169.90 },
  { id: 'combo-3', name: 'Combo Gin Tropical: Tanqueray + 4 Tônicas + Especiarias', category: 'combos', volume: 'Kit Drinks', price: 154.90 },
  { id: 'combo-4', name: 'Combo Esquenta Universitário: Vodka Smirnoff + 4 Balys', category: 'combos', volume: 'Kit Esquenta', price: 79.90 },
  { id: 'spirit-1', name: 'Whisky Johnnie Walker Black Label 12 Anos 1L', category: 'destilados', volume: '1L', price: 159.90 },
  { id: 'spirit-2', name: 'Whisky Jack Daniel’s Old No. 7 Tennessee 1L', category: 'destilados', volume: '1L', price: 149.90 },
  { id: 'spirit-3', name: 'Gin Tanqueray London Dry 750ml', category: 'destilados', volume: '750ml', price: 119.90 },
  { id: 'spirit-4', name: 'Vodka Absolut Regular Original 1L', category: 'destilados', volume: '1L', price: 99.90 },
  { id: 'spirit-5', name: 'Gin Beefeater London Dry 750ml', category: 'destilados', volume: '750ml', price: 109.90 },
  { id: 'spirit-6', name: 'Whisky Johnnie Walker Red Label 1L', category: 'destilados', volume: '1L', price: 98.90 },
  { id: 'wine-1', name: 'Vinho Chileno Casillero del Diablo Cabernet Sauvignon 750ml', category: 'vinhos', volume: '750ml', price: 59.90 },
  { id: 'wine-2', name: 'Espumante Chandon Réserve Brut 750ml Gelado', category: 'vinhos', volume: '750ml', price: 98.90 },
  { id: 'ice-1', name: 'Gelo Filtrado em Cubos Saco 5kg', category: 'gelo_essenciais', volume: '5kg', price: 15.00 },
  { id: 'ice-2', name: 'Gelo de Coco Natural para Drinks (Pct com 4un)', category: 'gelo_essenciais', volume: '4x 200ml', price: 14.90 },
  { id: 'ice-3', name: 'Carvão Vegetal Selecionado 3kg Eucalipto', category: 'gelo_essenciais', volume: '3kg', price: 18.90 },
  { id: 'ice-4', name: 'Kit Copos Reforçados 500ml (Pct 25 unidades)', category: 'gelo_essenciais', volume: '25un', price: 12.90 },
  { id: 'non-alc-1', name: 'Red Bull Energy Drink Lata 250ml Gelado', category: 'sem_alcool', volume: '250ml', price: 10.90 },
  { id: 'non-alc-2', name: 'Energético Monster Energy Green 473ml', category: 'sem_alcool', volume: '473ml', price: 12.90 },
  { id: 'non-alc-3', name: 'Refrigerante Coca-Cola Original Lata 350ml Gelada', category: 'sem_alcool', volume: '350ml', price: 5.50 },
];

const DELIVERY_ZONES = [
  { name: 'Centro / Região Central', fee: 6.00, time: '20 min' },
  { name: 'Vila Boêmia / Jardins', fee: 7.50, time: '25 min' },
  { name: 'Bela Vista / Consolação', fee: 8.00, time: '25 min' },
  { name: 'Pinheiros / Vila Madalena', fee: 9.00, time: '30 min' },
  { name: 'Moema / Vila Mariana', fee: 10.00, time: '35 min' },
  { name: 'Santana / Zona Norte', fee: 12.00, time: '40 min' },
  { name: 'Outros Bairros', fee: 14.00, time: '45 min' }
];

const SYSTEM_INSTRUCTION = `Você é o consultor de vendas e atendente oficial de pedidos da Adega Bigode Delivery.
WhatsApp oficial: +55 (38) 98860-8576 (link: https://wa.me/5538988608576).

REGRAS DE OURO DE ATENDIMENTO:
1. NUNCA DIGA "Não tenho essa informação no momento", "Não consigo responder" ou "Não sei". É TERMINANTEMENTE PROIBIDO responder com incapacidade ou pedir desculpas por não saber.
2. NUNCA REPITA MENSAGENS PADRÃO OU APRESENTAÇÕES INSTITUCIONAIS ("Aqui na Adega Bigode temos tudo para a sua resenha..."). Converse sempre dando andamento à conversa a partir do ponto exato onde o cliente parou.
3. CONVERSA CUMULATIVA E CARRINHO ATIVO:
   - Quando o cliente escolhe ou pede um produto (ex: "Quero Black Label", "depois o gelo", "mais um saco de carvão"):
     a) ADICIONE IMEDIATAMENTE AO CARRINHO via cartAction (type: "ADD", productId correto, productName, quantity).
     b) Confirme a inclusão no texto de forma natural: "Anotado! Adicionei [Produto] ao seu pedido."
     c) Apresente o resumo atualizado do pedido com os itens anteriores somados e o novo total.
     d) Pergunte de forma consultiva e vendedora: "Quer adicionar algo mais ao seu pedido, como gelo de coco, Red Bull ou carvão?" ou "Posso finalizar o seu pedido?".
4. QUANDO O CLIENTE PEDIR PARA FINALIZAR:
   - Confirme o valor total e todos os itens do carrinho e oriente a finalizar pelo WhatsApp com "showWhatsAppFinalize": true.
5. Fale em português do Brasil com naturalidade, simpatia e brevidade. Faça no máximo UMA pergunta por vez para conduzir ao fechamento.

GUIA DE RESPOSTAS E CONDUTAS ESPECÍFICAS:
A) BEBIDAS QUENTES / DRINKS / SUGESTÕES DE WHISKY (ex: "Quero uma bebida quente hoje o drink um whisky qual você me recomenda?"):
   - Recomende com água na boca nossos destaques com preços reais:
     * Jack Daniel's Tennessee 1L (R$ 149,90): clássico americano, sabor marcante e aveludado;
     * Johnnie Walker Black Label 12 Anos 1L (R$ 159,90): encorpado, esfumaçado e sofisticado;
     * Johnnie Walker Red Label 1L (R$ 98,90): ótimo para misturar com energético;
     * Combo After Dark (R$ 199,90): kit completo com 1 Black Label 1L + 4 Red Bull + Gelo de Coco!
   - Pergunte: "Qual desses você prefere para o seu drink hoje? Posso adicionar ao seu pedido?"

B) SACO DE GELO (ex: "quero um saco de gelo", "depois o gelo", "tem gelo?"):
   - Temos Gelo Filtrado em Cubos Saco 5kg (R$ 15,00) e Gelo de Coco Natural para drinks (R$ 14,90).
   - Adicione ao pedido via cartAction (ADD produto 'ice-1', quantity: 1).
   - INTERAJA PROATIVAMENTE: Anote a inclusão, mencione os itens já no carrinho e pergunte se quer carvão, energético ou finalizar.

C) SACO DE CARVÃO (ex: "mais um saco de carvão", "tem carvão?", "quero carvão"):
   - Temos Carvão Vegetal Selecionado 3kg Eucalipto (R$ 18,90).
   - Adicione ao pedido via cartAction (ADD produto 'ice-3', quantity: 1).
   - INTERAJA PROATIVAMENTE: Confirme a inclusão no carrinho e pergunte se precisa de copos de 500ml (R$ 12,90) ou se pode finalizar o pedido.

D) COPOS DESCARTÁVEIS (ex: "quero copos", "tem copo descartável?"):
   - Temos Kit Copos Reforçados 500ml 25 unidades (R$ 12,90).
   - Adicione via cartAction (ADD produto 'ice-4', quantity: 1).
   - Pergunte se precisa de bebidas geladas ou se já pode finalizar.

E) CERVEJAS GELADAS:
   - Confirme que saem da câmara fria estalando a -4°C: Heineken 330ml (R$ 8,49), Spaten 350ml (R$ 5,79), Brahma Duplo Malte (R$ 5,49), Corona com Limão (R$ 8,99) ou Pack Amstel 12 Latas (R$ 49,90).

F) ERROS DE DIGITAÇÃO:
   - "haikene de 300", "aquela verde", "uma heineke": Heineken 330ml (R$ 8,49).

G) QUANTIDADES CONTEXTUAIS ("Duas", "mais uma", "3 unidades"):
   - Associe ao produto em discussão, adicione e diga o novo total.

H) "TIRA UMA DO PEDIDO" / REMOÇÕES:
   - Atualize a quantidade no pedido e informe o novo total.

I) "QUANTO DEU?" / "QUAL O TOTAL?":
   - Diga os itens do carrinho e o total exato, e pergunte: "Posso finalizar o seu pedido?"

J) "ONDE ENTREGA?" / "ENTREGAM AGORA?":
   - Entregamos em toda a cidade em 20 a 35 minutos! Para calcular a taxa exata, qual o seu bairro?

K) "PODE FINALIZAR" / "FECHAR PEDIDO":
   - Resuma o pedido e oriente para envio pelo WhatsApp com showWhatsAppFinalize: true.

L) PRODUTOS NÃO LISTADOS NO CATÁLOGO:
   - Sugira com carinho o item mais próximo disponível na adega e informe os preços, sem nunca dizer "não tenho essa informação".

M) FALAR COM ATENDENTE:
   - Diga com cordialidade: "Com certeza! Você pode falar diretamente com nossa equipe pelo WhatsApp da Adega Bigode."

CATÁLOGO REAL E PREÇOS:
${JSON.stringify(CATALOG_ITEMS, null, 2)}

Bairros e taxas de entrega (25 a 35 min):
${JSON.stringify(DELIVERY_ZONES, null, 2)}
Formas de pagamento: Pix Instantâneo, Cartão na Entrega (Débito/Crédito) ou Dinheiro.

FORMATO DE SAÍDA OBRIGATÓRIO (JSON PURO):
{
  "reply": "string em pt-BR com resposta entusiasmada, direta, consultiva e vendedora",
  "cartAction": {
    "type": "NONE" | "ADD" | "UPDATE_QUANTITY" | "REMOVE" | "CLEAR",
    "productId": "id do catálogo ou vazio",
    "productName": "nome do produto",
    "quantity": número
  },
  "detectedInfo": {
    "customerName": "string ou null",
    "address": "string ou null",
    "neighborhood": "string ou null",
    "paymentMethod": "string ou null"
  },
  "quickReplies": ["sugestão 1", "sugestão 2"],
  "showWhatsAppFinalize": true ou false,
  "showTalkToHuman": true ou false
}`;

// Smart helper to locate any catalog item mentioned in natural speech
function findProductInText(text: string) {
  const t = text.toLowerCase();

  // 1. Combos
  if (t.includes('after dark') || (t.includes('combo') && (t.includes('black') || t.includes('after')))) {
    return CATALOG_ITEMS.find(p => p.id === 'combo-1');
  }
  if (t.includes('resenha') || (t.includes('combo') && (t.includes('heineken') || t.includes('cerveja')))) {
    return CATALOG_ITEMS.find(p => p.id === 'combo-2');
  }
  if (t.includes('tropical') || (t.includes('combo') && t.includes('gin'))) {
    return CATALOG_ITEMS.find(p => p.id === 'combo-3');
  }
  if (t.includes('esquenta') || (t.includes('combo') && (t.includes('vodka') || t.includes('baly')))) {
    return CATALOG_ITEMS.find(p => p.id === 'combo-4');
  }

  // 2. Whiskies
  if (t.includes('black label') || t.includes('black') || t.includes('159,90')) {
    return CATALOG_ITEMS.find(p => p.id === 'spirit-1');
  }
  if (t.includes('jack daniel') || t.includes('jack') || t.includes('tennessee') || t.includes('149,90')) {
    return CATALOG_ITEMS.find(p => p.id === 'spirit-2');
  }
  if (t.includes('red label') || (t.includes('red') && !t.includes('bull')) || t.includes('98,90')) {
    return CATALOG_ITEMS.find(p => p.id === 'spirit-6');
  }

  // 3. Gelo, Carvão e Copos
  if (t.includes('gelo de coco') || (t.includes('gelo') && t.includes('coco'))) {
    return CATALOG_ITEMS.find(p => p.id === 'ice-2');
  }
  if (t.includes('gelo') || t.includes('saco de gelo') || t.includes('gelos')) {
    return CATALOG_ITEMS.find(p => p.id === 'ice-1');
  }
  if (t.includes('carvao') || t.includes('carvão') || t.includes('saco de carvão') || t.includes('saco de carvao') || t.includes('churrasco')) {
    return CATALOG_ITEMS.find(p => p.id === 'ice-3');
  }
  if (t.includes('copo') || t.includes('copos') || t.includes('descartavel') || t.includes('descartável')) {
    return CATALOG_ITEMS.find(p => p.id === 'ice-4');
  }

  // 4. Energéticos e Refrigerantes
  if (t.includes('red bull') || t.includes('redbull')) {
    return CATALOG_ITEMS.find(p => p.id === 'non-alc-1');
  }
  if (t.includes('monster')) {
    return CATALOG_ITEMS.find(p => p.id === 'non-alc-2');
  }
  if (t.includes('coca') || t.includes('refrigerante')) {
    return CATALOG_ITEMS.find(p => p.id === 'non-alc-3');
  }

  // 5. Destilados (Gins & Vodkas)
  if (t.includes('tanqueray') || (t.includes('gin') && !t.includes('beefeater'))) {
    return CATALOG_ITEMS.find(p => p.id === 'spirit-3');
  }
  if (t.includes('beefeater')) {
    return CATALOG_ITEMS.find(p => p.id === 'spirit-5');
  }
  if (t.includes('absolut') || t.includes('vodka') || t.includes('vodca') || t.includes('smirnoff')) {
    return CATALOG_ITEMS.find(p => p.id === 'spirit-4');
  }

  // 6. Vinhos
  if (t.includes('casillero') || (t.includes('vinho') && !t.includes('espumante'))) {
    return CATALOG_ITEMS.find(p => p.id === 'wine-1');
  }
  if (t.includes('chandon') || t.includes('espumante')) {
    return CATALOG_ITEMS.find(p => p.id === 'wine-2');
  }

  // 7. Cervejas
  if (t.includes('corona')) {
    return CATALOG_ITEMS.find(p => p.id === 'beer-2');
  }
  if (t.includes('stella')) {
    return CATALOG_ITEMS.find(p => p.id === 'beer-3');
  }
  if (t.includes('spaten')) {
    return CATALOG_ITEMS.find(p => p.id === 'beer-4');
  }
  if (t.includes('amstel') || t.includes('pack amstel') || t.includes('fardo amstel')) {
    return CATALOG_ITEMS.find(p => p.id === 'beer-5');
  }
  if (t.includes('budweiser') || t.includes('bud')) {
    return CATALOG_ITEMS.find(p => p.id === 'beer-6');
  }
  if (t.includes('brahma') || t.includes('duplo malte')) {
    return CATALOG_ITEMS.find(p => p.id === 'beer-7');
  }
  if (t.includes('heineken') || t.includes('haikene') || t.includes('verde') || t.includes('300') || t.includes('330') || t.includes('long neck')) {
    return CATALOG_ITEMS.find(p => p.id === 'beer-1');
  }

  return null;
}

// Deterministic Smart Sales Engine when API key is missing or offline
function processLocalAssistant(
  message: string,
  history: Array<{ role: string; content: string }>,
  currentCart: Array<{ id: string; name: string; quantity: number; price: number }>
) {
  const text = message.toLowerCase().trim();

  // 1. Quero falar com uma pessoa
  if (text.includes('falar com uma pessoa') || text.includes('pessoa') || text.includes('humano') || text.includes('atendente') || text.includes('suporte')) {
    return {
      reply: 'Com certeza! Você pode falar diretamente com a nossa equipe pelo WhatsApp da Adega Bigode.',
      cartAction: { type: 'NONE', productId: '', productName: '', quantity: 0 },
      detectedInfo: {},
      quickReplies: ['Falar com atendente', 'Finalizar pelo WhatsApp', 'Continuar comprando'],
      showWhatsAppFinalize: false,
      showTalkToHuman: true
    };
  }

  // 2. Finalizar pedido explicitamente
  if (text.includes('pode finalizar') || text.includes('finalizar pedido') || text.includes('fechar pedido') || text.includes('concluir') || text.includes('pode fechar')) {
    const totalCalc = currentCart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalDisplay = totalCalc > 0 ? totalCalc.toFixed(2).replace('.', ',') : '0,00';
    const itemsDescription = currentCart.map(i => `${i.quantity}x ${i.name}`).join(', ');

    return {
      reply: totalCalc > 0 
        ? `Perfeito! Seu pedido com ${itemsDescription} está pronto no valor de R$ ${totalDisplay}. Clique no botão verde abaixo para enviar pelo WhatsApp da Adega Bigode e despacharmos em minutos!`
        : `Seu pedido ainda está sem itens. Me diga o que gostaria de pedir (Black Label, Jack Daniel's, cerveja gelada, gelo ou carvão) para eu adicionar agora!`,
      cartAction: { type: 'NONE', productId: '', productName: '', quantity: 0 },
      detectedInfo: {},
      quickReplies: totalCalc > 0 ? ['Finalizar pelo WhatsApp', 'Falar com atendente', 'Continuar comprando'] : ['Quero Black Label', 'Cerveja gelada', 'Saco de gelo 5kg'],
      showWhatsAppFinalize: totalCalc > 0,
      showTalkToHuman: false
    };
  }

  // 3. Consulta de Whisky / Drinks QUANDO O CLIENTE PEDE SUGESTÃO (sem escolher um rótulo específico ainda)
  const isAskingSuggestion = (
    text.includes('recomenda') || 
    text.includes('sugestao') || 
    text.includes('sugestão') || 
    text.includes('indica') || 
    text.includes('qual o melhor') ||
    text.includes('qual você') ||
    text.includes('qual voce') ||
    (text.includes('bebida quente') && !text.includes('quero') && !text.includes('adiciona')) ||
    (text.includes('drink') && !text.includes('quero') && !text.includes('adiciona'))
  );

  if (isAskingSuggestion && !text.includes('black label') && !text.includes('jack') && !text.includes('red label')) {
    return {
      reply: 'Para drink ou bebida quente, recomendo muito o nosso Jack Daniel’s Tennessee 1L (R$ 149,90), que é macio e marcante, ou o Johnnie Walker Black Label 12 Anos 1L (R$ 159,90), super sofisticado! Se quiser um kit pronto, temos o Combo After Dark com Black Label 1L + 4 Red Bull + Gelo de Coco por R$ 199,90. Qual você prefere que eu adicione ao seu pedido?',
      cartAction: { type: 'NONE', productId: 'spirit-1', productName: 'Whisky Johnnie Walker Black Label 12 Anos 1L', quantity: 0 },
      detectedInfo: {},
      quickReplies: ['Quero Black Label (R$ 159,90)', 'Quero Jack Daniel’s (R$ 149,90)', 'Combo After Dark (R$ 199,90)', 'Red Label (R$ 98,90)'],
      showWhatsAppFinalize: false,
      showTalkToHuman: false
    };
  }

  // 4. VERIFICAÇÃO SE O CLIENTE PEDIU UM PRODUTO ESPECÍFICO (ex: "Quero Black Label", "depois o gelo", "mais um saco de carvão", "duas heinekens", etc.)
  const matchedProd = findProductInText(text);
  if (matchedProd) {
    // Detect quantity
    let qty = 1;
    if (text.includes('duas') || text.includes('2')) qty = 2;
    else if (text.includes('tres') || text.includes('três') || text.includes('3')) qty = 3;
    else if (text.includes('quatro') || text.includes('4')) qty = 4;
    else if (text.includes('seis') || text.includes('6')) qty = 6;
    else if (text.includes('12') || text.includes('doze')) qty = 12;
    else if (text.includes('24') || text.includes('fardo')) qty = 24;

    // Build simulated updated cart
    const updatedCart = [...currentCart];
    const existingIndex = updatedCart.findIndex(i => i.id === matchedProd.id);
    if (existingIndex >= 0) {
      updatedCart[existingIndex] = {
        ...updatedCart[existingIndex],
        quantity: updatedCart[existingIndex].quantity + qty
      };
    } else {
      updatedCart.push({
        id: matchedProd.id,
        name: matchedProd.name,
        quantity: qty,
        price: matchedProd.price
      });
    }

    const updatedTotal = updatedCart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2).replace('.', ',');
    const cartSummaryList = updatedCart.map(i => `${i.quantity}x ${i.name}`).join(', ');

    // Cross-sell suggestions based on what's in the cart
    const hasIce = updatedCart.some(i => i.id.startsWith('ice-1') || i.id.startsWith('ice-2'));
    const hasCharcoal = updatedCart.some(i => i.id === 'ice-3');
    const hasCups = updatedCart.some(i => i.id === 'ice-4');
    const hasWhisky = updatedCart.some(i => i.id.startsWith('spirit'));
    const hasRedBull = updatedCart.some(i => i.id === 'non-alc-1');

    let question = 'Quer adicionar algo mais ao seu pedido ou posso finalizar?';
    const smartQuickReplies: string[] = [];

    if (!hasIce) {
      question = 'Quer adicionar também um saco de gelo de 5kg (R$ 15,00) ou gelo de coco para acompanhar?';
      smartQuickReplies.push('Adicionar Gelo 5kg', 'Gelo de Coco');
    } else if (!hasCharcoal && !hasWhisky) {
      question = 'Vai precisar também de carvão para a churrasqueira (R$ 18,90) ou copos descartáveis?';
      smartQuickReplies.push('Adicionar Carvão 3kg', 'Copos descartáveis');
    } else if (hasWhisky && !hasRedBull) {
      question = 'Deseja adicionar energéticos Red Bull (R$ 10,90) ou copos de 500ml para o drink?';
      smartQuickReplies.push('Adicionar 4 Red Bull', 'Copos 500ml');
    } else if (!hasCharcoal) {
      question = 'Precisa de carvão vegetal de 3kg para o churrasco ou posso finalizar o seu pedido?';
      smartQuickReplies.push('Adicionar Carvão 3kg');
    } else if (!hasCups) {
      question = 'Deseja levar um pacote de copos reforçados de 500ml ou posso finalizar o seu pedido?';
      smartQuickReplies.push('Copos 500ml');
    }

    smartQuickReplies.push('Pode finalizar pedido');

    const replyMsg = currentCart.length === 0
      ? `Anotado! Adicionei ${qty > 1 ? `${qty}x ` : ''}${matchedProd.name} (R$ ${(matchedProd.price * qty).toFixed(2).replace('.', ',')}) ao seu carrinho. ${question}`
      : `Perfeito! Adicionei também ${qty > 1 ? `${qty}x ` : ''}${matchedProd.name} ao seu carrinho. Agora você tem no pedido: ${cartSummaryList} (Total: R$ ${updatedTotal}). ${question}`;

    return {
      reply: replyMsg,
      cartAction: { type: 'ADD', productId: matchedProd.id, productName: matchedProd.name, quantity: qty },
      detectedInfo: {},
      quickReplies: smartQuickReplies,
      showWhatsAppFinalize: false,
      showTalkToHuman: false
    };
  }

  // 5. "Tira uma do pedido" / remover
  if (text.includes('tira uma') || text.includes('remover') || text.includes('tira um') || text.includes('menos uma')) {
    if (currentCart.length > 0) {
      const item = currentCart[currentCart.length - 1];
      const remainingQty = Math.max(0, item.quantity - 1);
      const newTotal = (currentCart.reduce((s, i) => s + (i.id === item.id ? item.price * remainingQty : i.price * i.quantity), 0)).toFixed(2).replace('.', ',');

      return {
        reply: remainingQty > 0
          ? `Pronto! Removi 1 unidade de ${item.name} do seu pedido. O total atualizado é R$ ${newTotal}. Deseja acrescentar mais alguma coisa ou finalizar?`
          : `Removi ${item.name} do seu pedido. O total atualizado é R$ ${newTotal}. Deseja acrescentar mais alguma coisa ou finalizar?`,
        cartAction: remainingQty > 0
          ? { type: 'UPDATE_QUANTITY', productId: item.id, productName: item.name, quantity: remainingQty }
          : { type: 'REMOVE', productId: item.id, productName: item.name, quantity: 0 },
        detectedInfo: {},
        quickReplies: ['Pode finalizar pedido', 'Adicionar outra bebida', 'Falar com atendente'],
        showWhatsAppFinalize: false,
        showTalkToHuman: false
      };
    }
  }

  // 6. "Quanto deu?" / "qual o total?"
  if (text.includes('quanto deu') || text.includes('quanto fica') || text.includes('qual o total') || text.includes('qual valor') || text.includes('quanto custa')) {
    const totalCalc = currentCart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalDisplay = totalCalc > 0 ? totalCalc.toFixed(2).replace('.', ',') : '0,00';
    const itemsDescription = currentCart.length > 0
      ? currentCart.map(i => `${i.quantity}x ${i.name}`).join(', ')
      : 'Nenhum item selecionado';

    return {
      reply: currentCart.length > 0
        ? `Seu pedido tem atualmente: ${itemsDescription} (Total: R$ ${totalDisplay}). Posso finalizar o seu pedido ou deseja adicionar algo mais?`
        : `Seu pedido ainda está sem itens. Deseja adicionar cerveja gelada, whisky Black Label, gelo ou carvão?`,
      cartAction: { type: 'NONE', productId: '', productName: '', quantity: 0 },
      detectedInfo: {},
      quickReplies: ['Pode finalizar pedido', 'Adicionar Gelo 5kg', 'Adicionar Carvão 3kg', 'Quero cerveja gelada'],
      showWhatsAppFinalize: currentCart.length > 0,
      showTalkToHuman: false
    };
  }

  // 7. "Onde eu pago?" / "forma de pagamento"
  if (text.includes('onde pago') || text.includes('onde eu pago') || text.includes('quero pagar') || text.includes('forma de pagamento')) {
    return {
      reply: 'Você escolhe a forma de pagamento na entrega ou pelo WhatsApp: aceitamos Pix Instantâneo, Cartão na entrega (Débito/Crédito) ou Dinheiro. Posso finalizar seu pedido agora?',
      cartAction: { type: 'NONE', productId: '', productName: '', quantity: 0 },
      detectedInfo: {},
      quickReplies: ['Sim, finalizar pedido', 'Pagar no Pix', 'Cartão na entrega'],
      showWhatsAppFinalize: true,
      showTalkToHuman: false
    };
  }

  // 8. "Tem entrega agora?" / "onde entregam?" / "manda aqui em casa"
  if (text.includes('entrega agora') || text.includes('onde entregam') || text.includes('manda aqui') || text.includes('entregam aqui')) {
    return {
      reply: 'Sim! Entregamos em toda a cidade em 20 a 35 minutos com bebidas estalando a -4°C. Informe seu bairro para calcularmos a taxa certinha!',
      cartAction: { type: 'NONE', productId: '', productName: '', quantity: 0 },
      detectedInfo: {},
      quickReplies: ['Centro', 'Vila Boêmia', 'Jardins', 'Bela Vista'],
      showWhatsAppFinalize: false,
      showTalkToHuman: false
    };
  }

  // 9. "Qual a bebida mais barata?"
  if (text.includes('mais barata') || text.includes('mais em conta') || text.includes('menor preco') || text.includes('menor preço')) {
    return {
      reply: 'A nossa cerveja mais em conta é a Brahma Duplo Malte Lata 350ml por R$ 5,49 (e o refrigerante Coca-Cola sai a R$ 5,50). Deseja adicionar ao seu pedido?',
      cartAction: { type: 'NONE', productId: 'beer-7', productName: 'Brahma Duplo Malte Lata 350ml Trincando', quantity: 0 },
      detectedInfo: {},
      quickReplies: ['Quero a Brahma Duplo Malte', 'Quero Spaten (R$ 5,79)', 'Ver todas'],
      showWhatsAppFinalize: false,
      showTalkToHuman: false
    };
  }

  // 10. "Tem cerveja gelada?"
  if (text.includes('cerveja gelada') || text.includes('tem gelada') || text.includes('cerveja trincando') || text.includes('tem cerveja')) {
    return {
      reply: 'Com certeza! Todas as nossas cervejas saem da câmara fria estalando a -4°C. Temos Heineken 330ml (R$ 8,49), Spaten 350ml (R$ 5,79), Brahma Duplo Malte (R$ 5,49) e Corona com Limão (R$ 8,99). Qual você prefere que eu adicione ao seu carrinho?',
      cartAction: { type: 'NONE', productId: '', productName: '', quantity: 0 },
      detectedInfo: {},
      quickReplies: ['Heineken 330ml', 'Spaten Munich 350ml', 'Brahma Duplo Malte', 'Corona Extra'],
      showWhatsAppFinalize: false,
      showTalkToHuman: false
    };
  }

  // 11. Saudações ("Oi", "Olá", "Boa noite")
  if (/^(oi|olá|ola|boa noite|bom dia|boa tarde|opa|salve)\b/i.test(text)) {
    if (currentCart.length > 0) {
      const itemsDesc = currentCart.map(i => `${i.quantity}x ${i.name}`).join(', ');
      const totalCalc = currentCart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2).replace('.', ',');
      return {
        reply: `Olá! Seu pedido atual tem: ${itemsDesc} (Total: R$ ${totalCalc}). O que mais gostaria de adicionar ou já posso finalizar para entrega?`,
        cartAction: { type: 'NONE', productId: '', productName: '', quantity: 0 },
        detectedInfo: {},
        quickReplies: ['Pode finalizar pedido', 'Adicionar Gelo 5kg', 'Adicionar Carvão 3kg'],
        showWhatsAppFinalize: true,
        showTalkToHuman: false
      };
    }
    return {
      reply: 'Olá! Bem-vindo de volta à Adega Bigode Delivery. Como posso ajudar com o seu pedido hoje? O que você gostaria de beber ou pedir agora?',
      cartAction: { type: 'NONE', productId: '', productName: '', quantity: 0 },
      detectedInfo: {},
      quickReplies: ['Quero Black Label (R$ 159,90)', 'Heineken gelada', 'Gelo e Carvão', 'Combos da noite'],
      showWhatsAppFinalize: false,
      showTalkToHuman: false
    };
  }

  // 12. Endereço ou Bairro informado
  if (text.includes('bairro') || text.includes('centro') || text.includes('jardins') || text.includes('rua') || text.includes('avenida')) {
    return {
      reply: 'Excelente! Entregamos no seu endereço em aproximadamente 20 a 35 minutos com bebidas estalando de geladas. O que você gostaria de pedir agora? Posso adicionar ao seu pedido!',
      cartAction: { type: 'NONE', productId: '', productName: '', quantity: 0 },
      detectedInfo: { neighborhood: message },
      quickReplies: ['Quero cerveja gelada', 'Whisky Black Label', 'Saco de gelo 5kg', 'Carvão 3kg'],
      showWhatsAppFinalize: false,
      showTalkToHuman: false
    };
  }

  // 13. Resposta conversacional natural de continuidade (NUNCA repete slogans institucionais!)
  if (currentCart.length > 0) {
    const itemsDesc = currentCart.map(i => `${i.quantity}x ${i.name}`).join(', ');
    const totalCalc = currentCart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2).replace('.', ',');
    return {
      reply: `Entendido! Seu pedido atual está com: ${itemsDesc} (Total: R$ ${totalCalc}). Deseja adicionar mais gelo, carvão ou bebidas, ou posso já finalizar o seu pedido?`,
      cartAction: { type: 'NONE', productId: '', productName: '', quantity: 0 },
      detectedInfo: {},
      quickReplies: ['Pode finalizar pedido', 'Adicionar Gelo 5kg', 'Adicionar Carvão 3kg', 'Falar com atendente'],
      showWhatsAppFinalize: true,
      showTalkToHuman: false
    };
  }

  return {
    reply: 'Entendido! Me diga o que você gostaria de pedir agora (cerveja trincando a -4°C, whisky, combo, gelo ou carvão) que eu já anoto e coloco no seu carrinho!',
    cartAction: { type: 'NONE', productId: '', productName: '', quantity: 0 },
    detectedInfo: {},
    quickReplies: ['Quero Black Label (R$ 159,90)', 'Heineken gelada', 'Saco de gelo 5kg', 'Carvão 3kg'],
    showWhatsAppFinalize: false,
    showTalkToHuman: false
  };
}

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', store: 'Adega Bigode Delivery', geminiEnabled: !!process.env.GEMINI_API_KEY });
});

// Gemini AI Chat Endpoint
app.post('/api/gemini/chat', async (req, res) => {
  try {
    const { message, history = [], cart = [], customerInfo = {} } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Mensagem inválida' });
    }

    const ai = getAI();
    if (!ai) {
      const fallbackData = processLocalAssistant(message, history, cart);
      return res.json({
        ...fallbackData,
        isFallback: false, // functions as natural assistant even in offline mode
      });
    }

    // Build context with contents
    const contents: any[] = [];

    // Provide cart state and customer info context into system prompt
    const cartSummary = cart.length > 0
      ? `Carrinho atual do cliente: ${cart.map((i: any) => `${i.quantity}x ${i.name} (R$ ${(i.price * i.quantity).toFixed(2)})`).join(', ')}. Subtotal: R$ ${cart.reduce((s: number, i: any) => s + i.price * i.quantity, 0).toFixed(2)}.`
      : 'O carrinho do cliente está vazio no momento.';

    const customerSummary = `Dados do cliente identificados até agora: Nome: ${customerInfo.name || 'não informado'}, Bairro/Endereço: ${customerInfo.address || customerInfo.neighborhood || 'não informado'}, Forma de pagamento: ${customerInfo.paymentMethod || 'não informado'}.`;

    // History
    if (Array.isArray(history)) {
      for (const h of history.slice(-8)) {
        if (h.role && h.content) {
          contents.push({
            role: h.role === 'user' ? 'user' : 'model',
            parts: [{ text: h.content }],
          });
        }
      }
    }

    contents.push({
      role: 'user',
      parts: [
        {
          text: `[ESTADO ATUAL DO PEDIDO: ${cartSummary} | ${customerSummary}]\nMensagem do cliente: "${message}"`
        }
      ],
    });

    let response: any = null;
    const candidateModels = ['gemini-3.6-flash', 'gemini-3.8-flash'];

    for (const modelName of candidateModels) {
      try {
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error(`Timeout on ${modelName}`)), 8000)
        );
        const apiCall = ai.models.generateContent({
          model: modelName,
          contents: contents,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            responseMimeType: 'application/json',
            temperature: 0.3,
          },
        });
        const res: any = await Promise.race([apiCall, timeoutPromise]);
        if (res && res.text) {
          response = res;
          break;
        }
      } catch (err: any) {
        console.warn(`Model ${modelName} warning:`, err?.message || err);
      }
    }

    let parsedData: any = null;
    if (response && response.text) {
      const rawText = response.text;
      try {
        parsedData = JSON.parse(rawText);
      } catch {
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsedData = JSON.parse(jsonMatch[0]);
        }
      }
    }

    if (!parsedData || !parsedData.reply) {
      parsedData = processLocalAssistant(message, history, cart);
    }

    return res.json({
      reply: parsedData.reply,
      cartAction: parsedData.cartAction || { type: 'NONE', productId: '', productName: '', quantity: 0 },
      detectedInfo: parsedData.detectedInfo || {},
      quickReplies: Array.isArray(parsedData.quickReplies) ? parsedData.quickReplies : [],
      showWhatsAppFinalize: !!parsedData.showWhatsAppFinalize,
      showTalkToHuman: !!parsedData.showTalkToHuman,
      isFallback: false,
    });
  } catch (error: any) {
    console.error('Gemini API Error in /api/gemini/chat:', error);
    const fallback = processLocalAssistant(req.body?.message || '', req.body?.history || [], req.body?.cart || []);
    return res.json({
      reply: fallback.reply,
      cartAction: fallback.cartAction || { type: 'NONE', productId: '', productName: '', quantity: 0 },
      detectedInfo: fallback.detectedInfo || {},
      quickReplies: Array.isArray(fallback.quickReplies) ? fallback.quickReplies : ['Cervejas geladas', 'Gelo e Carvão', 'Pode finalizar'],
      showWhatsAppFinalize: !!fallback.showWhatsAppFinalize,
      showTalkToHuman: !!fallback.showTalkToHuman,
      isFallback: false,
    });
  }
});


async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Adega Bigode Delivery server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

