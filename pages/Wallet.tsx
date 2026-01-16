
import React, { useState } from 'react';
import { User, Transaction } from '../types';
import { Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft, Clock, CheckCircle2, XCircle, CreditCard, Landmark } from 'lucide-react';

interface WalletProps {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const Wallet: React.FC<WalletProps> = ({ user, setUser }) => {
  const [activeTab, setActiveTab] = useState<'history' | 'withdraw'>('history');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState<'Pix' | 'PayPal' | 'PagBank'>('Pix');

  // Fix: Added missing 'userName' property to transaction objects to satisfy the Transaction interface requirements defined in types.ts
  const transactions: Transaction[] = [
    { id: 't1', userId: user.id, userName: user.name, amount: 0.50, type: 'checkin', status: 'completed', date: '2023-11-20T08:00:00Z' },
    { id: 't2', userId: user.id, userName: user.name, amount: 0.15, type: 'reward', status: 'completed', date: '2023-11-19T14:30:00Z' },
    { id: 't3', userId: user.id, userName: user.name, amount: 0.15, type: 'reward', status: 'completed', date: '2023-11-19T14:28:00Z' },
    { id: 't4', userId: user.id, userName: user.name, amount: 25.00, type: 'withdrawal', status: 'pending', method: 'Pix', date: '2023-11-18T10:00:00Z' },
  ];

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount < 20) {
      alert('O valor mínimo para saque é R$ 20,00');
      return;
    }
    if (amount > user.balance) {
      alert('Saldo insuficiente');
      return;
    }

    alert(`Solicitação de saque de R$ ${amount.toFixed(2)} via ${withdrawMethod} enviada para aprovação!`);
    setWithdrawAmount('');
  };

  return (
    <div className="p-4 space-y-6">
      {/* Wallet Balance Card */}
      <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <WalletIcon size={120} />
        </div>
        
        <div className="relative z-10">
          <p className="text-slate-400 text-sm font-medium mb-1">Saldo Disponível</p>
          <h2 className="text-4xl font-bold mb-6">
            <span className="text-2xl font-normal opacity-70">R$</span> {user.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </h2>
          
          <div className="flex gap-4">
            <div className="bg-white/10 p-3 rounded-2xl flex-1">
              <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Pendente</p>
              <p className="font-bold text-orange-400">R$ {user.pendingBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </div>
            <div className="bg-white/10 p-3 rounded-2xl flex-1">
              <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Total Ganho</p>
              <p className="font-bold text-green-400">R$ {(user.balance + 150).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-200 p-1 rounded-xl">
        <button 
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'history' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}
        >
          Histórico
        </button>
        <button 
          onClick={() => setActiveTab('withdraw')}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'withdraw' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}
        >
          Sacar
        </button>
      </div>

      {activeTab === 'history' ? (
        <div className="space-y-3">
          {transactions.map(t => (
            <div key={t.id} className="bg-white p-4 rounded-2xl flex items-center justify-between border border-slate-100">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${t.type === 'withdrawal' ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'}`}>
                  {t.type === 'withdrawal' ? <ArrowUpRight size={20} /> : <ArrowDownLeft size={20} />}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">
                    {t.type === 'checkin' ? 'Bônus de Check-in' : t.type === 'reward' ? 'Recompensa de Anúncio' : `Saque ${t.method}`}
                  </p>
                  <p className="text-[10px] text-slate-400">{new Date(t.date).toLocaleDateString()} • {new Date(t.date).toLocaleTimeString()}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold ${t.type === 'withdrawal' ? 'text-red-500' : 'text-green-500'}`}>
                  {t.type === 'withdrawal' ? '-' : '+'} R$ {t.amount.toFixed(2)}
                </p>
                <div className="flex items-center justify-end gap-1 mt-1">
                  {t.status === 'completed' ? (
                    <span className="text-[10px] text-green-600 font-medium">Concluído</span>
                  ) : t.status === 'pending' ? (
                    <span className="text-[10px] text-orange-500 font-medium">Pendente</span>
                  ) : (
                    <span className="text-[10px] text-red-500 font-medium">Rejeitado</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <form onSubmit={handleWithdraw} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Valor do Saque</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">R$</span>
              <input 
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder="0,00"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 pl-12 pr-4 text-xl font-bold focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-2">Mínimo: R$ 20,00 | Disponível: R$ {user.balance.toFixed(2)}</p>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Método de Recebimento</label>
            <div className="grid grid-cols-1 gap-3">
              <button 
                type="button"
                onClick={() => setWithdrawMethod('Pix')}
                className={`flex items-center justify-between p-4 border rounded-xl transition-all ${withdrawMethod === 'Pix' ? 'border-blue-500 bg-blue-50' : 'border-slate-200'}`}
              >
                <div className="flex items-center gap-3">
                  <div className="bg-blue-600 p-1.5 rounded-lg text-white"><Landmark size={18} /></div>
                  <span className="font-bold text-slate-700">Pix</span>
                </div>
                {withdrawMethod === 'Pix' && <CheckCircle2 size={20} className="text-blue-500" />}
              </button>
              
              <button 
                type="button"
                onClick={() => setWithdrawMethod('PayPal')}
                className={`flex items-center justify-between p-4 border rounded-xl transition-all ${withdrawMethod === 'PayPal' ? 'border-blue-500 bg-blue-50' : 'border-slate-200'}`}
              >
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-600 p-1.5 rounded-lg text-white"><CreditCard size={18} /></div>
                  <span className="font-bold text-slate-700">PayPal</span>
                </div>
                {withdrawMethod === 'PayPal' && <CheckCircle2 size={20} className="text-blue-500" />}
              </button>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-blue-700 active:scale-[0.98] transition-all"
          >
            Solicitar Saque
          </button>
        </form>
      )}
    </div>
  );
};

export default Wallet;
