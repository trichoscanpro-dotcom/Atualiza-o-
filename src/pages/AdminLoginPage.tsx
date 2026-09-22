import React, { useState } from 'react';
import { useCMS } from '../context/CMSContext';
import { Lock, ShieldCheck, AlertCircle, ArrowLeft, KeyRound, Sparkles } from 'lucide-react';
import { beverageImages } from '../assets/beverageImages';

export const AdminLoginPage: React.FC = () => {
  const { loginAdmin, navigateTo, isAdminAuthenticated, siteConfig } = useCMS();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  // If already authenticated, redirect immediately
  if (isAdminAuthenticated) {
    navigateTo('admin-panel');
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginAdmin(password);
    if (success) {
      navigateTo('admin-panel');
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#090A0C]">
      <div className="max-w-md w-full space-y-8 bg-[#12151B] p-8 sm:p-10 rounded-3xl border border-amber-500/20 shadow-2xl shadow-black/80 relative overflow-hidden">
        
        {/* Subtle Ambient Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center space-y-3 relative z-10">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 p-0.5 shadow-xl shadow-amber-500/20 overflow-hidden flex items-center justify-center">
            <img 
              src={siteConfig.logoUrl || beverageImages.brandLogo} 
              alt="Adega Bigode"
              className="w-full h-full object-cover rounded-2xl"
              referrerPolicy="no-referrer"
            />
          </div>
          <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest block">
            Painel de Controle
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-title tracking-tight">
            ÁREA ADMINISTRATIVA
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm">
            Acesso exclusivo para gerenciar pedidos em tempo real, estoque, taxas de entrega e cardápio.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm flex items-start gap-3 relative z-10">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Chave de acesso inválida</p>
              <p className="text-xs mt-0.5 text-rose-300/80">Senha incorreta. Verifique os dados e tente novamente.</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div>
            <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
              Senha de Acesso do Administrador
            </label>
            <div className="relative">
              <KeyRound className="w-5 h-5 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="admin-password-input"
                type="password"
                required
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(false); }}
                placeholder="Digite sua senha de acesso"
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#090A0C] border border-white/15 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
              />
            </div>
          </div>

          <button
            id="admin-login-submit-btn"
            type="submit"
            className="w-full py-3.5 px-4 rounded-xl font-bold text-black bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-lg shadow-amber-500/25 transition cursor-pointer flex items-center justify-center gap-2 font-title text-sm tracking-wide min-h-[44px]"
          >
            <ShieldCheck className="w-5 h-5" />
            <span>ACESSAR PAINEL DO BIGODE</span>
          </button>
        </form>

        <div className="pt-4 border-t border-white/10 text-center relative z-10">
          <button
            onClick={() => navigateTo('home')}
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-amber-400 transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar ao site da adega</span>
          </button>
        </div>

      </div>
    </div>
  );
};

