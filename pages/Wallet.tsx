
import React, { useState, useEffect } from 'react';
import { User, Transaction, SystemConfig } from '../types.ts';
import { DEFAULT_CONFIG } from '../constants.tsx';
import { Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft, Landmark, History, AlertTriangle, TrendingUp } from 'lucide-react';

interface WalletProps {
  user: User;
  setUser: (u: User) => void;
}

const Wallet: React.FC<WalletProps> = ({ user, setUser }) => {
  const [activeTab, setActiveTab] = useState<'history' | 'withdraw'>('history');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [pixKey, setPixKey] = useState('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const allTransactions = JSON.parse(localStorage.getItem('erie_transactions') || '[]');
    setTransactions(allTransactions.filter((t: Transaction) => t.userId === user.id));
  }, [user.id]);

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(withdrawAmount);
    
    if (isNaN(amount) || amount < DEFAULT_CONFIG.minWithdrawal) {
      alert(`O valor mínimo para saque é R$ ${DEFAULT_CONFIG.minWithdrawal.toFixed(2)}`);
      return;
    }
    if (amount > user.balance) {
      alert('Saldo insuficiente.');
      return;
    }
    if (!pixKey.trim()) {
      alert('Chave Pix obrigatória.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const newTx: Transaction = {
        id: 'tx_' + Date.now(),
        userId: user.id,
        userName: user.name,
        amount: amount,
        type: 'withdrawal',
        status: 'pending',
        method: 'Pix',
        pixKey: pixKey,
        date: new Date().toISOString()
      };

      const all = JSON.parse(localStorage.getItem('erie_transactions') || '[]');
      localStorage.setItem('erie_transactions', JSON.stringify([newTx, ...all]));
      setTransactions([newTx, ...transactions]);
      setUser({ ...user, balance: user.balance - amount });

      setWithdrawAmount('');
      setPixKey('');
      setLoading(false);
      setActiveTab('history');
      alert('Solicitação de saque enviada ao ERIE Financial Core!');
    }, 1500);
  };

  return (
    <div className="p-4 md:p-10 space-y-8 bg-slate-50 min-h-full pb-32">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card Principal de Saldo */}
        <div className="lg:col-span-2 bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden border border-white/5">
          <div className="absolute top-[-40px] right-[-40px] opacity-10 rotate-12">
            <WalletIcon size={240} />
          </div>
          
          <div className="relative z-10 space-y-8">
            <div className="flex items-center gap-3">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
               <p className="text-slate-400 text-xs font-black uppercase tracking-[0.3em]">Carteira Auditada ERIE</p>
            </div>
            
            <div className="flex flex-col md:flex-row md:items-end gap-2">
               <span className="text-xl font-medium opacity-40 mb-2">Saldo Disponível</span>
               <h2 className="text-6xl font-black tracking-tighter">
                 <span className="text-2xl font-normal opacity-30 mr-2">R$</span> 
                 {user.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
               </h2>
            </div>
            
            <div className="grid grid-cols-2 gap-6 pt-6">
              <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/5">
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Processando (Google Ads)</p>
                <p className="text-xl font-black text-blue-400">R$ {user.pendingBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              </div>
              <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/5">
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Receita Histórica</p>
                <p className="text-xl font-black text-emerald-400">R$ {(user.balance + user.pendingBalance).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Ad Monetization Preview (Google Style) */}
        <div className="bg-white rounded-[3rem] p-8 border border-slate-100 shadow-sm flex flex-col justify-between">
           <div>
              <div className="flex items-center gap-2 mb-6">
                 <TrendingUp size={20} className="text-blue-600" />
                 <h3 className="font-black text-sm tracking-tight">Monetização Google</h3>
              </div>
              <div className="space-y-4">
                 <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-400">RPM Estimado</span>
                    <span className="font-black">R$ 12,40</span>
                 </div>
                 <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-400">Visualizações Reais</span>
                    <span className="font-black">{user.totalAdsWatched}</span>
                 </div>
                 <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-400">Share da Plataforma</span>
                    <span className="font-black text-blue-600">{100 - DEFAULT_CONFIG.revenueShareUser}%</span>
                 </div>
              </div>
           </div>
           <div className="mt-8 p-4 bg-blue-50 rounded-2xl border border-blue-100 text-[10px] font-bold text-blue-600 leading-relaxed italic">
              "Os ganhos de anúncios levam até 48h para serem validados pelo Google Core e liberados para saque."
           </div>
        </div>
      </div>

      <div className="flex bg-slate-200/50 p-2 rounded-2xl border border-slate-200 max-w-xl mx-auto">
        <button onClick={() => setActiveTab('history')} className={`flex-1 py-4 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-2 ${activeTab === 'history' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>
          <History size={18}/> EXTRATO REAL
        </button>
        <button onClick={() => setActiveTab('withdraw')} className={`flex-1 py-4 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-2 ${activeTab === 'withdraw' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>
          <ArrowUpRight size={18}/> RESGATAR PIX
        </button>
      </div>

      <div className="max-w-xl mx-auto w-full">
        {activeTab === 'history' ? (
          <div className="space-y-4">
            {transactions.length === 0 ? (
              <div className="py-20 text-center opacity-30 italic font-bold flex flex-col items-center">
                <Landmark size={48} className="mb-4" />
                Nenhuma movimentação real detectada.
              </div>
            ) : (
              transactions.map(t => (
                <div key={t.id} className="bg-white p-6 rounded-[2rem] flex items-center justify-between border border-slate-100 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl ${t.type === 'withdrawal' ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-500'}`}>
                      {t.type === 'withdrawal' ? <ArrowUpRight size={22} /> : <ArrowDownLeft size={22} />}
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-800 tracking-tight uppercase">{t.type === 'withdrawal' ? 'Resgate Pix' : 'Ganho AdSense'}</p>
                      <p className="text-[10px] text-slate-400 font-bold">{new Date(t.date).toLocaleString('pt-BR')}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-black tracking-tighter ${t.type === 'withdrawal' ? 'text-red-600' : 'text-emerald-600'}`}>
                      {t.type === 'withdrawal' ? '-' : '+'} R$ {t.amount.toFixed(2)}
                    </p>
                    <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-md ${t.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : t.status === 'pending' ? 'bg-orange-100 text-orange-600' : 'bg-red-100 text-red-600'}`}>
                      {t.status === 'completed' ? 'PAGO' : t.status === 'pending' ? 'EM ANÁLISE' : 'RECUSADO'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <form onSubmit={handleWithdraw} className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 space-y-8 animate-in slide-in-from-right-10 duration-500">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-2">Valor do Resgate (Mín R$ 20,00)</label>
              <div className="relative">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 font-black text-2xl">R$</span>
                <input type="number" value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} placeholder="0,00" className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] py-6 pl-16 pr-6 text-3xl font-black outline-none focus:ring-4 focus:ring-blue-500/10" />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-2">Chave Pix Válida</label>
              <input type="text" value={pixKey} onChange={(e) => setPixKey(e.target.value)} placeholder="CPF, E-mail ou Celular" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-6 px-6 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/10" />
            </div>

            <div className="p-6 bg-red-50 rounded-2xl border border-red-100 flex items-start gap-4">
               <AlertTriangle size={24} className="text-red-600 shrink-0" />
               <p className="text-[11px] text-red-700 font-bold leading-relaxed italic">Atenção: A chave Pix deve pertencer à mesma titularidade da conta ERIE para evitar bloqueios por fraude.</p>
            </div>

            <button disabled={loading} className="w-full bg-blue-600 text-white font-black py-6 rounded-[2rem] shadow-2xl shadow-blue-200 active:scale-95 transition-all disabled:opacity-50">
              {loading ? 'ANALISANDO TRANSAÇÃO...' : 'CONFIRMAR RESGATE AGORA'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Wallet;
