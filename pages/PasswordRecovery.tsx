
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Phone, ChevronLeft, ArrowRight } from 'lucide-react';

const PasswordRecovery: React.FC = () => {
  const [method, setMethod] = useState<'email' | 'phone' | null>(null);
  const [value, setValue] = useState('');
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  if (sent) {
      return (
        <div className="min-h-screen bg-white p-6 flex flex-col justify-center items-center text-center">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                <Mail size={40} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Verifique seu {method === 'email' ? 'e-mail' : 'telefone'}</h2>
            <p className="text-slate-500 mt-4 px-4 leading-relaxed">
                Enviamos um código de recuperação para <strong>{value}</strong>. O link expira em 30 minutos.
            </p>
            <button 
                onClick={() => navigate('/login')}
                className="mt-8 w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg"
            >
                Voltar para o Login
            </button>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-white p-6 flex flex-col">
      <button onClick={() => navigate('/login')} className="mt-4 text-slate-400 flex items-center gap-1">
        <ChevronLeft size={20} /> Voltar
      </button>

      <div className="mt-10 mb-8">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Recuperar conta</h1>
        <p className="text-slate-500 text-sm mt-2">Escolha como deseja receber as instruções para redefinir sua senha.</p>
      </div>

      {!method ? (
          <div className="space-y-4">
              <button 
                onClick={() => setMethod('email')}
                className="w-full flex items-center justify-between p-6 border-2 border-slate-100 rounded-2xl hover:border-blue-500 transition-all text-left"
              >
                  <div className="flex items-center gap-4">
                      <div className="bg-blue-100 p-3 rounded-xl text-blue-600"><Mail /></div>
                      <div>
                          <p className="font-bold text-slate-800">E-mail</p>
                          <p className="text-xs text-slate-500">Enviar link para o e-mail cadastrado</p>
                      </div>
                  </div>
                  <ArrowRight size={20} className="text-slate-300" />
              </button>

              <button 
                onClick={() => setMethod('phone')}
                className="w-full flex items-center justify-between p-6 border-2 border-slate-100 rounded-2xl hover:border-blue-500 transition-all text-left"
              >
                  <div className="flex items-center gap-4">
                      <div className="bg-indigo-100 p-3 rounded-xl text-indigo-600"><Phone /></div>
                      <div>
                          <p className="font-bold text-slate-800">Telefone</p>
                          <p className="text-xs text-slate-500">Enviar código via SMS ou WhatsApp</p>
                      </div>
                  </div>
                  <ArrowRight size={20} className="text-slate-300" />
              </button>
          </div>
      ) : (
          <form onSubmit={handleSend} className="space-y-6">
              <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                      {method === 'email' ? 'Seu E-mail' : 'Seu Telefone'}
                  </label>
                  <input 
                    type={method === 'email' ? 'email' : 'tel'}
                    required
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder={method === 'email' ? 'exemplo@gmail.com' : '(00) 00000-0000'}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
              </div>
              <button 
                type="submit"
                className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg"
              >
                Enviar Instruções
              </button>
              <button 
                type="button"
                onClick={() => setMethod(null)}
                className="w-full text-slate-400 font-bold"
              >
                Tentar outro método
              </button>
          </form>
      )}
    </div>
  );
};

export default PasswordRecovery;
