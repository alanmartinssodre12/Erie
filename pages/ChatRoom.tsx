
import React, { useState, useRef, useEffect } from 'react';
import { User, Message } from '../types';
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

  // Close menu when clicking outside
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

  // Call Timer logic
  useEffect(() => {
    let interval: any;
    if (activeCall) {
      interval = setInterval(() => setCallTimer(prev => prev + 1), 1000);
      if (activeCall === 'video') {
        startCamera();
      }
    } else {
      setCallTimer(0);
      stopCamera();
    }
    return () => clearInterval(interval);
  }, [activeCall]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      console.error("Erro ao acessar câmera:", err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

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

    if (type === 'text') {
      setTimeout(() => {
        const reply: Message = {
          id: (Date.now() + 1).toString(),
          senderId: 'other',
          receiverId: user.id,
          content: 'Mensagem recebida com sucesso no sistema ERIE!',
          type: 'text',
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, reply]);
      }, 2000);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleSendMessage(reader.result as string, 'image');
      };
      reader.readAsDataURL(file);
    }
  };

  if (id === 'list') {
    return (
      <div className="h-full flex flex-col bg-white">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <button onClick={() => navigate('/')} className="text-blue-600 active:scale-95">
                <ChevronLeft size={24} />
            </button>
            <h2 className="text-xl font-bold">Mensagens</h2>
          </div>
          <button className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-md active:scale-95 transition-all">Novo Chat</button>
        </div>
        <div className="flex-1 overflow-y-auto pb-20 no-scrollbar">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div 
              key={i} 
              onClick={() => navigate(`/chat/${i}`)}
              className="p-4 flex items-center gap-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 active:bg-slate-100 transition-colors"
            >
              <div className="relative">
                <img src={`https://picsum.photos/seed/chat${i}/100`} className="w-14 h-14 rounded-full border border-slate-100 shadow-sm" alt="avatar" />
                {i % 2 === 0 && <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-slate-800 text-sm">Contato ERIE {i}</span>
                  <span className="text-[10px] text-slate-400">14:30</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-500 truncate pr-4">Fala Alan, já conferiu os novos anúncios recompensados?</p>
                  {i === 1 && <div className="bg-blue-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">1</div>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-[#efeae2] relative overflow-hidden">
      {/* Hidden File Input */}
      <input 
        type="file" 
        accept="image/*" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
      />

      {/* Call Overlays */}
      {activeCall && (
        <div className="fixed inset-0 z-[100] bg-slate-900 flex flex-col items-center justify-between p-12 animate-in fade-in zoom-in duration-300">
          <div className="text-center space-y-4">
            <div className="relative inline-block">
              <img src="https://picsum.photos/seed/other/200" className="w-32 h-32 rounded-full border-4 border-slate-700 shadow-2xl" alt="caller" />
              {activeCall === 'video' && (
                <div className="absolute -bottom-2 -right-2 w-20 h-28 bg-black rounded-lg border-2 border-white overflow-hidden shadow-lg">
                  <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                </div>
              )}
            </div>
            <h2 className="text-2xl font-bold text-white">Contato Teste</h2>
            <p className="text-blue-400 font-medium tracking-widest">{formatTime(callTimer)}</p>
          </div>

          <div className="flex items-center gap-6">
            <button className="w-14 h-14 bg-slate-800 rounded-full flex items-center justify-center text-white hover:bg-slate-700">
              <MicOff size={24} />
            </button>
            <button 
              onClick={() => setActiveCall(null)}
              className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg active:scale-90 transition-transform"
            >
              <PhoneOff size={32} />
            </button>
            <button className="w-14 h-14 bg-slate-800 rounded-full flex items-center justify-center text-white hover:bg-slate-700">
              <Volume2 size={24} />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white p-3 flex items-center gap-3 shadow-md z-40 sticky top-0">
        <div className="flex items-center">
            <button 
                onClick={() => navigate('/chat/list')} 
                className="text-blue-600 active:scale-90 transition-transform flex items-center gap-0.5"
            >
                <ChevronLeft size={28} />
                <span className="text-xs font-bold hidden xs:block">Sair</span>
            </button>
        </div>
        
        <div className="flex flex-1 items-center gap-3 cursor-pointer" onClick={() => setIsMenuOpen(true)}>
            <img src="https://picsum.photos/seed/other/100" className="w-10 h-10 rounded-full border border-slate-100 shadow-sm" alt="avatar" />
            <div className="flex-1">
              <h3 className="text-sm font-bold text-slate-800 leading-tight">Contato Teste</h3>
              <p className="text-[10px] text-green-500 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Online
              </p>
            </div>
        </div>

        <div className="flex items-center gap-1 text-blue-600">
          <button 
            onClick={() => setActiveCall('voice')}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <Phone size={20} />
          </button>
          <button 
            onClick={() => setActiveCall('video')}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <Video size={20} />
          </button>
          <div className="relative" ref={menuRef}>
            <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`p-2 hover:bg-slate-100 rounded-full transition-colors ${isMenuOpen ? 'bg-slate-100' : ''}`}
            >
                <MoreVertical size={20} className="text-slate-400" />
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <button className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-slate-50 text-sm font-medium text-slate-700">
                        <UserIcon size={18} className="text-slate-400" /> Ver Perfil
                    </button>
                    <button className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-slate-50 text-sm font-medium text-slate-700">
                        <ImageIcon size={18} className="text-slate-400" /> Mídia e Links
                    </button>
                    <button className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-slate-50 text-sm font-medium text-slate-700 border-t border-slate-50">
                        <BellOff size={18} className="text-slate-400" /> Silenciar
                    </button>
                    <button 
                        onClick={() => navigate('/')}
                        className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-slate-50 text-sm font-bold text-blue-600 border-t border-slate-50"
                    >
                        <HomeIcon size={18} /> Ir para o Início
                    </button>
                    <button 
                        onClick={() => { setMessages([]); setIsMenuOpen(false); }}
                        className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-slate-50 text-sm font-medium text-red-500 border-t border-slate-50"
                    >
                        <Trash2 size={18} /> Limpar Conversa
                    </button>
                    <button className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-slate-50 text-sm font-medium text-red-600">
                        <Ban size={18} /> Bloquear
                    </button>
                </div>
            )}
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar pb-6 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat">
        {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-2 opacity-50">
                <Info size={40} />
                <p className="text-sm font-medium">Nenhuma mensagem nesta conversa.</p>
            </div>
        )}
        {messages.map((msg) => {
          const isMe = msg.senderId === user.id;
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
              <div className={`max-w-[85%] p-1 rounded-xl shadow-sm relative ${isMe ? 'bg-[#dcf8c6] text-slate-800 rounded-tr-none' : 'bg-white text-slate-800 rounded-tl-none'}`}>
                {msg.type === 'image' ? (
                  <div className="space-y-1">
                    <img src={msg.content} alt="sent" className="rounded-lg max-h-64 w-full object-cover shadow-sm" />
                    <div className="flex items-center justify-end gap-1 px-1 pb-1">
                        <p className="text-[9px] text-right opacity-60">
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        {isMe && <Check size={10} className="text-blue-500" />}
                    </div>
                  </div>
                ) : msg.type === 'audio' ? (
                  <div className="flex items-center gap-3 p-2 min-w-[200px]">
                    <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                      <Mic size={18} />
                    </div>
                    <div className="flex-1 h-1 bg-slate-300 rounded-full overflow-hidden">
                       <div className="w-2/3 h-full bg-blue-500"></div>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-500">0:12</p>
                        <div className="flex items-center justify-end gap-1">
                            <p className="text-[8px] opacity-40">14:32</p>
                            {isMe && <Check size={10} className="text-blue-500" />}
                        </div>
                    </div>
                  </div>
                ) : (
                  <div className="px-2 py-1.5">
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                    <div className="flex items-center justify-end gap-1 mt-1">
                      <p className="text-[8px] opacity-50">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      {isMe && <Check size={10} className="text-blue-500" />}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={scrollRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 bg-white flex items-center gap-2 border-t border-slate-200 z-30">
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="text-slate-500 hover:text-blue-600 p-1 active:scale-90 transition-all"
        >
          <ImageIcon size={24} />
        </button>
        
        <div className="flex-1 relative">
          {isRecording ? (
            <div className="w-full bg-slate-100 rounded-full py-2 px-4 flex items-center justify-between animate-pulse border border-red-100">
               <div className="flex items-center gap-2 text-red-500 font-bold text-xs uppercase tracking-tighter">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                  Gravando...
               </div>
               <span className="text-xs font-mono text-slate-500">00:04</span>
            </div>
          ) : (
            <input 
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
              placeholder="Digite uma mensagem..."
              className="w-full bg-slate-100 rounded-full py-2 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all border border-transparent focus:bg-white focus:border-slate-200"
            />
          )}
        </div>

        {inputText.trim() ? (
          <button 
            onClick={() => handleSendMessage(inputText)}
            className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform"
          >
            <Send size={18} fill="white" />
          </button>
        ) : (
          <button 
            onMouseDown={() => setIsRecording(true)}
            onMouseUp={() => {
              setIsRecording(false);
              handleSendMessage('audio-message', 'audio');
            }}
            onTouchStart={(e) => { e.preventDefault(); setIsRecording(true); }}
            onTouchEnd={(e) => { e.preventDefault(); setIsRecording(false); handleSendMessage('audio-message', 'audio'); }}
            className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all ${isRecording ? 'bg-red-500 text-white scale-125' : 'bg-blue-600 text-white'}`}
          >
            <Mic size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

export default ChatRoom;
