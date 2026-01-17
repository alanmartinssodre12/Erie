
import React, { useState, useEffect } from 'react';
import { User as UserType, Post, PostComment } from '../types.ts';
import { 
  Heart, MessageCircle, Share2, Award, Flame, PlusSquare, Image as ImageIcon, Send, X
} from 'lucide-react';

interface HomeProps {
  user: UserType;
  setUser: (u: UserType) => void;
}

const Home: React.FC<HomeProps> = ({ user, setUser }) => {
  const [tab, setTab] = useState<'feed' | 'reels'>('feed');
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    const savedPosts = JSON.parse(localStorage.getItem('erie_posts') || '[]');
    setPosts(savedPosts);
  }, []);

  const savePosts = (updatedPosts: Post[]) => {
    setPosts(updatedPosts);
    localStorage.setItem('erie_posts', JSON.stringify(updatedPosts));
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    const newPost: Post = {
      id: 'post_' + Date.now(),
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      content: newPostContent,
      likes: [],
      comments: [],
      timestamp: new Date().toISOString(),
      type: 'feed'
    };

    savePosts([newPost, ...posts]);
    setNewPostContent('');
    setIsCreatingPost(false);
  };

  const toggleLike = (postId: string) => {
    const updated = posts.map(p => {
      if (p.id === postId) {
        const hasLiked = p.likes.includes(user.id);
        return {
          ...p,
          likes: hasLiked ? p.likes.filter(id => id !== user.id) : [...p.likes, user.id]
        };
      }
      return p;
    });
    savePosts(updated);
  };

  const handleAddComment = (postId: string) => {
    if (!commentText.trim()) return;
    const updated = posts.map(p => {
      if (p.id === postId) {
        const newComment: PostComment = {
          id: 'comm_' + Date.now(),
          userId: user.id,
          userName: user.name,
          content: commentText,
          timestamp: new Date().toISOString()
        };
        return { ...p, comments: [...p.comments, newComment] };
      }
      return p;
    });
    savePosts(updated);
    setCommentText('');
    setActiveCommentId(null);
  };

  const handleShare = async (post: Post) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Post de ' + post.userName + ' no ERIE',
          text: post.content,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Erro ao compartilhar');
      }
    } else {
      alert('Link copiado para a área de transferência!');
    }
  };

  return (
    <div className="min-h-full pb-20 bg-slate-50">
      {/* Header Tabs */}
      <div className="flex items-center justify-center bg-white sticky top-0 z-40 border-b border-slate-100">
        <button onClick={() => setTab('feed')} className={`px-8 py-4 text-sm font-black transition-all relative ${tab === 'feed' ? 'text-blue-600' : 'text-slate-400'}`}>
          FEED {tab === 'feed' && <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-t-full"></div>}
        </button>
        <button onClick={() => setTab('reels')} className={`px-8 py-4 text-sm font-black transition-all relative ${tab === 'reels' ? 'text-blue-600' : 'text-slate-400'}`}>
          REELS {tab === 'reels' && <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-t-full"></div>}
        </button>
      </div>

      {tab === 'feed' ? (
        <div className="p-4 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Create Post Area */}
          <div className="bg-white rounded-[2rem] p-4 shadow-sm border border-slate-100 mb-6">
            <div className="flex items-center gap-3">
              <img src={user.avatar} className="w-10 h-10 rounded-full bg-slate-100" />
              <button 
                onClick={() => setIsCreatingPost(true)}
                className="flex-1 text-left bg-slate-50 text-slate-400 py-3 px-5 rounded-2xl text-sm font-medium border border-slate-100 hover:bg-slate-100 transition-colors"
              >
                No que você está pensando, {user.name.split(' ')[0]}?
              </button>
            </div>
          </div>

          {posts.length === 0 ? (
            <div className="py-20 text-center flex flex-col items-center opacity-30">
              <PlusSquare size={48} className="mb-4" />
              <p className="font-bold text-sm italic">Nenhuma publicação ainda.<br/>Seja o primeiro a postar!</p>
            </div>
          ) : (
            posts.map(post => (
              <div key={post.id} className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-slate-100">
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={post.userAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.userName}`} className="w-10 h-10 rounded-full border border-slate-100" />
                    <div>
                      <p className="text-sm font-black text-slate-800 tracking-tight">{post.userName}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">há pouco</p>
                    </div>
                  </div>
                </div>
                
                <div className="px-5 pb-4">
                   <p className="text-sm text-slate-700 leading-relaxed font-medium">{post.content}</p>
                </div>

                <div className="px-4 py-3 border-t border-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    <button 
                      onClick={() => toggleLike(post.id)}
                      className={`flex items-center gap-1.5 transition-all ${post.likes.includes(user.id) ? 'text-red-500 scale-110' : 'text-slate-500'}`}
                    >
                      <Heart size={20} fill={post.likes.includes(user.id) ? 'currentColor' : 'none'} />
                      <span className="text-xs font-black">{post.likes.length}</span>
                    </button>
                    <button 
                      onClick={() => setActiveCommentId(activeCommentId === post.id ? null : post.id)}
                      className="flex items-center gap-1.5 text-slate-500"
                    >
                      <MessageCircle size={20} />
                      <span className="text-xs font-black">{post.comments.length}</span>
                    </button>
                    <button onClick={() => handleShare(post)} className="text-slate-500"><Share2 size={20} /></button>
                  </div>
                </div>

                {/* Comment Section */}
                {activeCommentId === post.id && (
                  <div className="p-4 bg-slate-50/50 border-t border-slate-50 space-y-3">
                    {post.comments.map(c => (
                      <div key={c.id} className="flex gap-2">
                        <div className="bg-white p-2.5 rounded-2xl rounded-tl-none shadow-sm flex-1">
                          <p className="text-[10px] font-black text-blue-600 mb-0.5">{c.userName}</p>
                          <p className="text-xs text-slate-700 font-medium">{c.content}</p>
                        </div>
                      </div>
                    ))}
                    <div className="flex gap-2 pt-2">
                      <input 
                        type="text" 
                        value={commentText}
                        onChange={e => setCommentText(e.target.value)}
                        placeholder="Escreva um comentário..."
                        className="flex-1 bg-white border border-slate-100 rounded-xl py-2 px-4 text-xs outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                      <button onClick={() => handleAddComment(post.id)} className="bg-blue-600 text-white p-2 rounded-xl"><Send size={16}/></button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="h-[calc(100vh-120px)] bg-black relative flex flex-col items-center justify-center">
            <p className="text-white/30 font-black italic text-sm tracking-widest uppercase animate-pulse">Nenhum Reel disponível no momento</p>
        </div>
      )}

      {/* Post Creator Modal */}
      {isCreatingPost && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10">
            <div className="p-6 border-b border-slate-50 flex items-center justify-between">
               <h3 className="font-black text-lg tracking-tight">Nova Publicação</h3>
               <button onClick={() => setIsCreatingPost(false)} className="p-2 text-slate-400"><X/></button>
            </div>
            <form onSubmit={handleCreatePost} className="p-6 space-y-4">
              <textarea 
                autoFocus
                value={newPostContent}
                onChange={e => setNewPostContent(e.target.value)}
                placeholder="O que está acontecendo?"
                className="w-full min-h-[120px] bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              <button className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-200">POSTAR AGORA</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
