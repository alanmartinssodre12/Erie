
import React, { useState, useEffect } from 'react';
import { User, Transaction } from '../types.ts';
import { Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft, CheckCircle2, Landmark, History, AlertTriangle } from 'lucide-react';

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
    
    if (isNaN(amount) || amount < 20) {
      alert('O valor mínimo para saque é R$ 20,00');
      return;
    }
    if (amount > user.balance) {
      alert('Saldo insuficiente na conta principal.');
      return;
    }
    if (!pixKey.trim()) {
      alert('Informe uma chave Pix válida.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const newTransaction: Transaction = {
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

      const allTransactions = JSON.parse(localStorage.getItem('erie_transactions') || '[]');
      const updatedAll = [newTransaction, ...allTransactions];
      localStorage.setItem('erie_transactions', JSON.stringify(updatedAll));
      setTransactions([newTransaction, ...transactions]);

      const updatedUser = {
        ...user,
        balance: user.balance - amount
      };
      setUser(updatedUser);

      setWithdrawAmount('');
      setPixKey('');
      setLoading(false);
      setActiveTab('history');
      alert('Solicitação enviada com sucesso! Aguarde aprovação em até 24h.');
    }, 1500);
  };

  return (
    <div className="p-4 space-y-6 bg-slate-50 min-h-full pb-32">
      <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden border border-white/5">
        <div className="absolute top-[-20px] right-[-20px] opacity-10 rotate-12">
          <WalletIcon size={160} />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
             <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Conta Segura ERIE</p>
          </div>
          <h2 className="text-4xl font-black mb-6 tracking-tighter">
            <span className="text-xl font-normal opacity-40 mr-1">R$</span> {user.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </h2>
          
          <div className="flex gap-4">
            <div className="bg-white/5 border border-white/5 backdrop-blur-md p-4 rounded-3xl flex-1">
              <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">A Liberar</p>
              <p className="font-black text-blue-400">R$ {user.pendingBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </div>
            <div className="bg-white/5 border border-white/5 backdrop-blur-md p-4 rounded-3xl flex-1">
              <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">Total Ganho</p>
              <p className="font-black text-emerald-400">R$ {(user.balance + user.pendingBalance).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex bg-slate-200/50 p-1.5 rounded-2xl border border-slate-200">
        <button onClick={() => setActiveTab('history')} className={`flex-1 py-3 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-2 ${activeTab === 'history' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>
          <History size={16}/> HISTÓRICO
        </button>
        <button onClick={() => setActiveTab('withdraw')} className={`flex-1 py-3 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-2 ${activeTab === 'withdraw' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>
          <ArrowUpRight size={16}/> SACAR PIX
        </button>
      </div>

      {activeTab === 'history' ? (
        <div className="space-y-3">
          {transactions.length === 0 ? (
             <div className="py-20 text-center opacity-30 italic text-sm font-bold flex flex-col items-center">
                <AlertTriangle size={32} className="mb-2" />
                Nenhuma transação registrada.
             </div>
          ) : (
            transactions.map(t => (
              <div key={t.id} className="bg-white p-5 rounded-[1.5rem] flex items-center justify-between border border-slate-100 shadow-sm group">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl ${t.type === 'withdrawal' ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-500'}`}>
                    {t.type === 'withdrawal' ? <ArrowUpRight size={20} /> : <ArrowDownLeft size={20} />}
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-800 tracking-tight uppercase">
                      {t.type === 'checkin' ? 'Check-in' : t.type === 'reward' ? 'Missão/Ads' : 'Saque Pix'}
                    </p>
                    <p className="text-[10px] text-slate-400 font-bold">{new Date(t.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-black tracking-tighter ${t.type === 'withdrawal' ? 'text-red-500' : 'text-emerald-500'}`}>
                    {t.type === 'withdrawal' ? '-' : '+'} R$ {t.amount.toFixed(2)}
                  </p>
                  <span className={`text-[9px] font-black uppercase tracking-widest ${t.status === 'completed' ? 'text-emerald-500' : t.status === 'pending' ? 'text-orange-400' : 'text-red-500'}`}>
                    {t.status === 'completed' ? 'CONCLUÍDO' : t.status === 'pending' ? 'EM ANÁLISE' : 'RECUSADO'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <form onSubmit={handleWithdraw} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-6 animate-in slide-in-from-right-4 duration-300">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Valor do Saque</label>
            <div className="relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 font-black text-lg">R$</span>
              <input 
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder="20,00"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 pl-14 pr-4 text-2xl font-black outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <p className="mt-2 text-[9px] text-slate-400 font-bold italic ml-1">* Taxa de processamento: R$ 0,00 (ERIE Free)</p>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Chave Pix (CPF, E-mail ou Celular)</label>
            <div className="relative">
              <Landmark className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
              <input 
                type="text"
                value={pixKey}
                onChange={(e) => setPixKey(e.target.value)}
                placeholder="000.000.000-00"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 pl-14 pr-4 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100/30 flex items-start gap-3">
             <AlertTriangle size={18} className="text-blue-600 mt-1 shrink-0" />
             <p className="text-[10px] text-blue-600 font-bold leading-relaxed">Verifique se sua chave Pix está correta. Transferências incorretas não poderão ser estornadas.</p>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl shadow-2xl shadow-blue-200 active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? 'PROCESSANDO...' : 'SOLICITAR SAQUE AGORA'}
          </button>
        </form>
      )}
    </div>
  );
};

export default Wallet;
