
import React, { useState, useRef, useEffect } from 'react';
import { User, Message, ChatThread } from '../types.ts';
import { 
  ChevronLeft, Send, Image as ImageIcon, Mic, Phone, 
  Video, X, Check, Search, Plus, UserPlus, AtSign
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
  
  // New Chat States
  const [showNewChat, setShowNewChat] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [threads, setThreads] = useState<ChatThread[]>([]);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Carregar Threads (conversas ativas)
    const allUsers = JSON.parse(localStorage.getItem('erie_all_users') || '[]');
    const allMessages = JSON.parse(localStorage.getItem('erie_messages') || '[]');
    
    // Simular agrupamento de mensagens em threads
    const userThreadsMap = new Map<string, ChatThread>();
    
    allMessages.forEach((m: Message) => {
      if (m.senderId === user.id || m.receiverId === user.id) {
        const otherId = m.senderId === user.id ? m.receiverId : m.senderId;
        const otherUser = allUsers.find((u: User) => u.id === otherId);
        
        if (otherUser) {
          userThreadsMap.set(otherId, {
            participantId: otherUser.id,
            participantName: otherUser.name,
            participantUsername: otherUser.username,
            participantAvatar: otherUser.avatar,
            lastMessage: m.content,
            timestamp: m.timestamp,
            unreadCount: 0 // Mock simples
          });
        }
      }
    });

    setThreads(Array.from(userThreadsMap.values()).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));

    // Se estiver em uma sala específica, carregar mensagens
    if (id && id !== 'list') {
      const filtered = allMessages.filter((m: Message) => 
        (m.senderId === user.id && m.receiverId === id) || 
        (m.senderId === id && m.receiverId === user.id)
      );
      setMessages(filtered);
    }
  }, [id, user.id]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }
    const allUsers = JSON.parse(localStorage.getItem('erie_all_users') || '[]');
    const filtered = allUsers.filter((u: User) => 
      u.id !== user.id && 
      (u.email.toLowerCase().includes(term.toLowerCase()) || 
       u.username.toLowerCase().includes(term.toLowerCase()))
    );
    setSearchResults(filtered);
  };

  const startChat = (targetUser: User) => {
    setShowNewChat(false);
    navigate(`/chat/${targetUser.id}`);
  };

  const handleSendMessage = (content: string) => {
    if (!content.trim() || id === 'list') return;
    
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
    localStorage.setItem('erie_messages', JSON.stringify([...allMessages, newMessage]));
    setMessages(prev => [...prev, newMessage]);
    setInputText('');
  };

  if (id === 'list') {
    return (
      <div className="h-full flex flex-col bg-white animate-in fade-in duration-300">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between sticky top-0 bg-white z-10">
          <h2 className="text-3xl font-black tracking-tighter italic">CHATS</h2>
          <button 
            onClick={() => setShowNewChat(true)}
            className="bg-blue-600 text-white p-3 rounded-2xl shadow-lg shadow-blue-100 active:scale-90 transition-transform flex items-center gap-2"
          >
            <Plus size={20} />
            <span className="text-xs font-black uppercase">Novo</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pb-32 no-scrollbar">
          {threads.length === 0 ? (
            <div className="py-32 text-center opacity-20 flex flex-col items-center">
               <UserPlus size={64} className="mb-4" />
               <p className="font-black italic text-sm uppercase tracking-widest">Inicie sua primeira conversa.</p>
            </div>
          ) : (
            threads.map(thread => (
              <button 
                key={thread.participantId}
                onClick={() => navigate(`/chat/${thread.participantId}`)}
                className="w-full p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors border-b border-slate-50"
              >
                <img src={thread.participantAvatar} className="w-14 h-14 rounded-full border-2 border-slate-100" />
                <div className="flex-1 text-left">
                  <div className="flex justify-between items-center">
                    <p className="font-black text-slate-800">{thread.participantName}</p>
                    <span className="text-[10px] text-slate-400 font-bold">{new Date(thread.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                  <p className="text-[10px] text-blue-600 font-black mb-1">@{thread.participantUsername}</p>
                  <p className="text-sm text-slate-400 line-clamp-1 font-medium">{thread.lastMessage}</p>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Modal de Nova Conversa */}
        {showNewChat && (
          <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-end md:items-center justify-center p-4">
            <div className="bg-white w-full max-w-lg rounded-[3rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-20 duration-300">
              <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                <h3 className="font-black text-xl tracking-tight">NOVA CONVERSA</h3>
                <button onClick={() => {setShowNewChat(false); setSearchResults([]); setSearchTerm('');}} className="p-2 text-slate-400 bg-slate-50 rounded-full hover:bg-slate-100"><X size={20}/></button>
              </div>
              <div className="p-6">
                 <div className="relative mb-6">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                      type="text"
                      autoFocus
                      placeholder="Buscar por E-mail ou @username"
                      value={searchTerm}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/10"
                    />
                 </div>
                 
                 <div className="max-h-80 overflow-y-auto space-y-2 no-scrollbar">
                    {searchResults.map(result => (
                      <button 
                        key={result.id}
                        onClick={() => startChat(result)}
                        className="w-full p-4 flex items-center gap-4 rounded-3xl border border-slate-50 hover:bg-blue-50 transition-colors group"
                      >
                         <img src={result.avatar} className="w-12 h-12 rounded-full border border-white" />
                         <div className="text-left flex-1">
                            <p className="font-black text-sm text-slate-800">{result.name}</p>
                            <p className="text-xs text-blue-600 font-bold italic">@{result.username}</p>
                         </div>
                         <Plus size={20} className="text-slate-300 group-hover:text-blue-600" />
                      </button>
                    ))}
                    {searchTerm && searchResults.length === 0 && (
                      <div className="p-10 text-center opacity-40">
                         <p className="text-xs font-black uppercase tracking-widest">Nenhum usuário encontrado.</p>
                      </div>
                    )}
                 </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Visualização de Conversa Aberta
  const otherParticipant = JSON.parse(localStorage.getItem('erie_all_users') || '[]').find((u: User) => u.id === id);

  return (
    <div className="h-full flex flex-col bg-[#efeae2] relative overflow-hidden">
      <div className="bg-white p-4 flex items-center gap-3 shadow-sm z-40 sticky top-0 border-b border-slate-100">
        <button onClick={() => navigate('/chat/list')} className="text-blue-600 p-1">
            <ChevronLeft size={28} />
        </button>
        <div className="flex flex-1 items-center gap-3">
            <img src={otherParticipant?.avatar || ''} className="w-10 h-10 rounded-full border border-slate-100" />
            <div className="flex-1">
              <h3 className="text-sm font-black text-slate-800 tracking-tight">{otherParticipant?.name || 'Carregando...'}</h3>
              <p className="text-[10px] text-blue-600 font-black uppercase tracking-wider">@{otherParticipant?.username}</p>
            </div>
        </div>
        <div className="flex items-center gap-2">
            <button onClick={() => setActiveCall('voice')} className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><Phone size={20}/></button>
            <button onClick={() => setActiveCall('video')} className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><Video size={20}/></button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar pb-6 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat opacity-90">
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

      <div className="p-4 bg-white flex items-center gap-3 border-t border-slate-100 z-30">
        <button className="text-slate-400"><ImageIcon size={22} /></button>
        <button className="text-slate-400"><Mic size={22} /></button>
        <input 
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
          placeholder="Escreva algo..."
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
