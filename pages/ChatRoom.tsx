
import React, { useState, useRef, useEffect } from 'react';
import { User, Message } from '../types.ts';
import { 
  ChevronLeft, Send, Image as ImageIcon, Mic, Phone, 
  Video, MoreVertical, X, MicOff, Volume2, Camera, 
  VideoOff, PhoneOff, Check, User as UserIcon, Trash2, 
  BellOff, Ban, Info, Home as HomeIcon
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

interface ChatRoomProps {
  user: User;
}

type CallType = 'voice' | 'video' | null;

const ChatRoom: React.FC<ChatRoomProps> = ({ user }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', senderId: 'other', receiverId: user.id, content: 'E aí, tudo certo com o ERIE?', type: 'text', timestamp: new Date(Date.now() - 1000000).toISOString() },
    { id: '2', senderId: user.id, receiverId: 'other', content: 'Fala! Sim, o app está incrível.', type: 'text', timestamp: new Date(Date.now() - 500000).toISOString() },
  ]);
  const [inputText, setInputText] = useState('');
  const [activeCall, setActiveCall] = useState<CallType>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [callTimer, setCallTimer] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  useEffect(() => {
    let interval: any;
    if (activeCall) {
      interval = setInterval(() => setCallTimer(prev => prev + 1), 1000);
    } else {
      setCallTimer(0);
    }
    return () => clearInterval(interval);
  }, [activeCall]);

  const handleSendMessage = (content: string, type: 'text' | 'image' | 'audio' = 'text') => {
    if (type === 'text' && !content.trim()) return;
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: user.id,
      receiverId: 'other',
      content,
      type,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, newMessage]);
    setInputText('');
  };

  if (id === 'list') {
    return (
      <div className="h-full flex flex-col bg-white">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <button onClick={() => navigate('/')} className="text-blue-600">
                <ChevronLeft size={24} />
            </button>
            <h2 className="text-xl font-bold">Mensagens</h2>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto pb-20 no-scrollbar">
          {[1, 2, 3].map(i => (
            <div 
              key={i} 
              onClick={() => navigate(`/chat/${i}`)}
              className="p-4 flex items-center gap-3 hover:bg-slate-50 border-b border-slate-50"
            >
              <img src={`https://picsum.photos/seed/chat${i}/100`} className="w-14 h-14 rounded-full" alt="avatar" />
              <div className="flex-1 min-w-0">
                <span className="font-bold text-slate-800 text-sm">Contato ERIE {i}</span>
                <p className="text-xs text-slate-500 truncate">Olá!</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-[#efeae2] relative overflow-hidden">
      <div className="bg-white p-3 flex items-center gap-3 shadow-md z-40 sticky top-0">
        <button onClick={() => navigate('/chat/list')} className="text-blue-600">
            <ChevronLeft size={28} />
        </button>
        <div className="flex flex-1 items-center gap-3" onClick={() => setIsMenuOpen(true)}>
            <img src="https://picsum.photos/seed/other/100" className="w-10 h-10 rounded-full" alt="avatar" />
            <div className="flex-1">
              <h3 className="text-sm font-bold text-slate-800">Contato Teste</h3>
            </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar pb-6 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-2 rounded-xl shadow-sm ${msg.senderId === user.id ? 'bg-[#dcf8c6]' : 'bg-white'}`}>
              <p className="text-sm">{msg.content}</p>
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      <div className="p-3 bg-white flex items-center gap-2 border-t border-slate-200 z-30">
        <input 
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
          placeholder="Digite..."
          className="flex-1 bg-slate-100 rounded-full py-2 px-4 text-sm outline-none"
        />
        <button 
          onClick={() => handleSendMessage(inputText)}
          className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
