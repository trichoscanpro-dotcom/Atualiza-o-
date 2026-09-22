import React from 'react';
import { useCMS } from '../context/CMSContext';
import { ArrowLeft, ShieldAlert } from 'lucide-react';

interface LegalPagesProps {
  type: 'privacy' | 'terms';
}

export const LegalPages: React.FC<LegalPagesProps> = ({ type }) => {
  const { siteConfig, navigateTo } = useCMS();

  return (
    <div className="bg-[#090A0C] text-[#F3F4F6] min-h-screen py-12 px-4 sm:px-6 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <button
          onClick={() => navigateTo('home')}
          className="inline-flex items-center gap-2 text-xs text-zinc-400 hover:text-amber-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para a Página Inicial</span>
        </button>

        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3 text-xs text-amber-300">
          <ShieldAlert className="w-5 h-5 shrink-0" />
          <span>
            <strong>Conformidade Legal:</strong> A venda e entrega de bebidas alcoólicas são terminantemente proibidas para menores de 18 anos, em cumprimento à Lei Federal nº 8.069/1990 (Estatuto da Criança e do Adolescente). O entregador poderá solicitar documento oficial com foto no ato do recebimento.
          </span>
        </div>

        <div className="bg-[#12151B] p-6 sm:p-10 rounded-2xl border border-white/10 space-y-6 text-xs sm:text-sm text-zinc-300 leading-relaxed">
          {type === 'privacy' ? (
            <>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-['Syne'] text-white">
                Política de Privacidade
              </h1>
              <p>
                A <strong>{siteConfig.companyName}</strong> respeita a privacidade de seus usuários e clientes. Esta política descreve como tratamos as informações fornecidas ao realizar pedidos e navegar em nossa plataforma.
              </p>
              
              <h3 className="text-base font-bold text-white font-['Syne']">1. Dados Coletados</h3>
              <p>
                Para processar e entregar seus pedidos, solicitamos nome, telefone de contato (WhatsApp) e endereço de entrega. Esses dados são utilizados única e exclusivamente para a expedição e roteirização da entrega noturna.
              </p>

              <h3 className="text-base font-bold text-white font-['Syne']">2. Segurança dos Pagamentos</h3>
              <p>
                Não armazenamos dados bancários nem números de cartões de crédito em nossos servidores. Pagamentos via Pix são transacionados por QR Codes criptografados e pagamentos por cartão são processados diretamente na maquininha sem contato no momento da entrega.
              </p>

              <h3 className="text-base font-bold text-white font-['Syne']">3. Seus Direitos (LGPD)</h3>
              <p>
                Você poderá a qualquer momento solicitar a exclusão de seus dados de cadastro enviando uma mensagem para o nosso suporte pelo e-mail <strong>{siteConfig.email}</strong>.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-['Syne'] text-white">
                Termos de Uso e Condições de Venda
              </h1>
              <p>
                Ao realizar pedidos na <strong>{siteConfig.companyName}</strong>, você concorda com as diretrizes e regras de atendimento descritas abaixo.
              </p>

              <h3 className="text-base font-bold text-white font-['Syne']">1. Restrição de Idade (+18)</h3>
              <p>
                É proibida a compra de bebidas alcoólicas por menores de 18 anos. Ao confirmar seu pedido, você declara expressamente ser maior de idade. O motoboy parceiro tem a prerrogativa de solicitar documento oficial com foto e cancelar a entrega caso o recebedor seja menor de idade.
              </p>

              <h3 className="text-base font-bold text-white font-['Syne']">2. Área e Tempo de Entrega</h3>
              <p>
                O tempo médio de entrega estimado no site (25 a 40 minutos) refere-se a condições climáticas normais e tráfego habitual da região de cobertura. Em dias de tempestades severas ou datas comemorativas de pico excepcional (ex: Réveillon, finais de campeonatos), pequenos atrasos poderão ocorrer e serão comunicados via WhatsApp.
              </p>

              <h3 className="text-base font-bold text-white font-['Syne']">3. Conferência de Itens e Temperatura</h3>
              <p>
                Recomendamos que o cliente confira os lacres e a temperatura dos produtos no ato do recebimento junto ao entregador. Em caso de avaria constatada na entrega, a troca será realizada prontamente.
              </p>
            </>
          )}
        </div>

      </div>
    </div>
  );
};
