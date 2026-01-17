
import React, { useState, useRef, useEffect } from 'react';
import { User, Message } from '../types.ts';
import { 
  ChevronLeft, Send, Image as ImageIcon, Mic, Phone, 
  Video, MoreVertical, X, PhoneOff, Check, User as UserIcon
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

interface ChatRoomProps {
  user: User;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ user }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [activeCall, setActiveCall] = useState<'voice' | 'video' | null>(null);
  const [callTimer, setCallTimer] = useState(0);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const allMessages = JSON.parse(localStorage.getItem('erie_messages') || '[]');
    // Filtrar mensagens para esta conversa (simulada)
    const filtered = allMessages.filter((m: Message) => 
      (m.senderId === user.id && m.receiverId === id) || 
      (m.senderId === id && m.receiverId === user.id)
    );
    setMessages(filtered);
  }, [id, user.id]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    let interval: any;
    if (activeCall) {
      interval = setInterval(() => setCallTimer(prev => prev + 1), 1000);
    } else {
      setCallTimer(0);
    }
    return () => clearInterval(interval);
  }, [activeCall]);

  const handleSendMessage = (content: string) => {
    if (!content.trim()) return;
    const newMessage: Message = {
      id: 'msg_' + Date.now(),
      senderId: user.id,
      receiverId: id || 'system',
      content,
      type: 'text',
      timestamp: new Date().toISOString(),
      read: false
    };

    const allMessages = JSON.parse(localStorage.getItem('erie_messages') || '[]');
    const updated = [...allMessages, newMessage];
    localStorage.setItem('erie_messages', JSON.stringify(updated));
    setMessages(prev => [...prev, newMessage]);
    setInputText('');
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (id === 'list') {
    return (
      <div className="h-full flex flex-col bg-white">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-black italic tracking-tighter">MENSAGENS</h2>
        </div>
        <div className="flex-1 overflow-y-auto pb-20 no-scrollbar p-2">
          {/* Mocked conversation list based on "real" system logic */}
          <div className="p-10 text-center opacity-30 flex flex-col items-center">
             <UserIcon size={48} className="mb-2" />
             <p className="text-sm font-bold italic">Você ainda não tem conversas.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-[#efeae2] relative overflow-hidden">
      {/* Call UI Layer */}
      {activeCall && (
        <div className="fixed inset-0 z-[100] bg-slate-900 flex flex-col items-center justify-between p-12 text-white animate-in zoom-in duration-300">
           <div className="text-center space-y-4">
              <div className="w-32 h-32 bg-slate-800 rounded-full mx-auto flex items-center justify-center border-4 border-white/10 shadow-2xl">
                 <UserIcon size={64} className="text-slate-600" />
              </div>
              <h2 className="text-2xl font-black">Contato Teste</h2>
              <p className="text-sm font-bold text-blue-400 uppercase tracking-widest">{formatTime(callTimer)}</p>
           </div>
           
           <div className="flex gap-8">
              <button onClick={() => setActiveCall(null)} className="bg-red-500 w-16 h-16 rounded-full flex items-center justify-center shadow-2xl shadow-red-900/50 active:scale-90 transition-transform">
                 <PhoneOff size={28} />
              </button>
           </div>
        </div>
      )}

      {/* Chat Header */}
      <div className="bg-white p-4 flex items-center gap-3 shadow-sm z-40 sticky top-0 border-b border-slate-100">
        <button onClick={() => navigate('/chat/list')} className="text-blue-600 p-1">
            <ChevronLeft size={28} />
        </button>
        <div className="flex flex-1 items-center gap-3">
            <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center font-black text-slate-400">?</div>
            <div className="flex-1">
              <h3 className="text-sm font-black text-slate-800 tracking-tight">Contato Teste</h3>
              <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">Online agora</p>
            </div>
        </div>
        <div className="flex items-center gap-2">
            <button onClick={() => setActiveCall('voice')} className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><Phone size={20}/></button>
            <button onClick={() => setActiveCall('video')} className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><Video size={20}/></button>
        </div>
      </div>

      {/* Chat Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar pb-6 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat opacity-90">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full opacity-20">
             <p className="text-xs font-black uppercase tracking-[0.3em]">Criptografia de ponta-a-ponta</p>
          </div>
        )}
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl shadow-sm relative group ${msg.senderId === user.id ? 'bg-[#dcf8c6] rounded-tr-none' : 'bg-white rounded-tl-none'}`}>
              <p className="text-sm font-medium text-slate-800 pr-8">{msg.content}</p>
              <div className="absolute bottom-1 right-2 flex items-center gap-1">
                 <span className="text-[9px] text-slate-400 font-bold">{new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                 {msg.senderId === user.id && <Check size={10} className="text-blue-500" />}
              </div>
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      {/* Chat Input */}
      <div className="p-4 bg-white flex items-center gap-3 border-t border-slate-100 z-30">
        <button className="text-slate-400"><ImageIcon size={22} /></button>
        <button className="text-slate-400"><Mic size={22} /></button>
        <input 
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
          placeholder="Mensagem..."
          className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl py-3 px-5 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20"
        />
        <button 
          onClick={() => handleSendMessage(inputText)}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-lg active:scale-90 ${inputText.trim() ? 'bg-blue-600 text-white shadow-blue-200' : 'bg-slate-100 text-slate-300'}`}
        >
          <Send size={20} fill={inputText.trim() ? 'currentColor' : 'none'} />
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
