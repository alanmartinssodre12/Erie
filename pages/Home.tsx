
import React, { useState, useEffect, useRef } from 'react';
import { User as UserType, Post, PostComment } from '../types.ts';
import { 
  Heart, MessageCircle, Share2, PlusSquare, Image as ImageIcon, 
  Send, X, Play, Video as VideoIcon, Plus
} from 'lucide-react';

interface HomeProps {
  user: UserType;
  setUser: (u: UserType) => void;
}

const Home: React.FC<HomeProps> = ({ user, setUser }) => {
  const [tab, setTab] = useState<'feed' | 'reels'>('feed');
  const [posts, setPosts] = useState<Post[]>([]);
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [postType, setPostType] = useState<'feed' | 'reel'>('feed');
  
  // Create Post States
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [selectedFileType, setSelectedFileType] = useState<'image' | 'video' | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const type = file.type.startsWith('video/') ? 'video' : 'image';
      setSelectedFileType(type);
      
      const reader = new FileReader();
      reader.onload = (re) => {
        setSelectedFile(re.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim() && !selectedFile) return;

    // Fix: Added missing userUsername property to satisfy Post interface requirements
    const newPost: Post = {
      id: 'post_' + Date.now(),
      userId: user.id,
      userName: user.name,
      userUsername: user.username,
      userAvatar: user.avatar,
      content: newPostContent,
      mediaUrl: selectedFile || undefined,
      mediaType: selectedFileType || (newPostContent ? 'text' : undefined),
      likes: [],
      comments: [],
      timestamp: new Date().toISOString(),
      type: postType
    };

    savePosts([newPost, ...posts]);
    resetPostForm();
  };

  const resetPostForm = () => {
    setNewPostContent('');
    setSelectedFile(null);
    setSelectedFileType(null);
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

  const filteredPosts = posts.filter(p => p.type === tab);

  return (
    <div className="min-h-full pb-20 bg-slate-50 relative">
      {/* Header Tabs */}
      <div className="flex items-center justify-center bg-white sticky top-0 z-40 border-b border-slate-100">
        <button onClick={() => setTab('feed')} className={`px-10 py-4 text-sm font-black transition-all relative ${tab === 'feed' ? 'text-blue-600' : 'text-slate-400'}`}>
          FEED {tab === 'feed' && <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-t-full"></div>}
        </button>
        <button onClick={() => setTab('reels')} className={`px-10 py-4 text-sm font-black transition-all relative ${tab === 'reels' ? 'text-blue-600' : 'text-slate-400'}`}>
          REELS {tab === 'reels' && <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-t-full"></div>}
        </button>
      </div>

      <div className="p-4 space-y-4 max-w-2xl mx-auto animate-in fade-in duration-500">
        {tab === 'feed' && (
          <div className="bg-white rounded-[2.5rem] p-5 shadow-sm border border-slate-100 mb-6">
            <div className="flex items-center gap-4">
              <img src={user.avatar} className="w-12 h-12 rounded-full border border-slate-100" />
              <button 
                onClick={() => { setPostType('feed'); setIsCreatingPost(true); }}
                className="flex-1 text-left bg-slate-50 text-slate-400 py-3.5 px-6 rounded-2xl text-sm font-bold border border-slate-100 hover:bg-slate-100 transition-all"
              >
                O que você quer compartilhar, {user.name.split(' ')[0]}?
              </button>
            </div>
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-50">
               <button onClick={() => { setPostType('feed'); setIsCreatingPost(true); }} className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl hover:bg-slate-50 transition-colors text-xs font-black text-slate-500">
                 <ImageIcon size={18} className="text-emerald-500" /> FOTO
               </button>
               <button onClick={() => { setPostType('feed'); setIsCreatingPost(true); }} className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl hover:bg-slate-50 transition-colors text-xs font-black text-slate-500">
                 <VideoIcon size={18} className="text-blue-500" /> VÍDEO
               </button>
            </div>
          </div>
        )}

        {filteredPosts.length === 0 ? (
          <div className="py-32 text-center opacity-20 flex flex-col items-center">
            <PlusSquare size={64} className="mb-4" />
            <p className="font-black italic uppercase tracking-widest text-sm">Nada por aqui ainda.</p>
          </div>
        ) : (
          filteredPosts.map(post => (
            <div key={post.id} className={`bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-100 ${post.type === 'reel' ? 'aspect-[9/16] relative bg-black' : ''}`}>
              {/* Header Post */}
              <div className={`p-5 flex items-center justify-between ${post.type === 'reel' ? 'absolute top-0 left-0 w-full z-10 bg-gradient-to-b from-black/60 to-transparent text-white' : ''}`}>
                <div className="flex items-center gap-3">
                  <img src={post.userAvatar} className="w-10 h-10 rounded-full border border-white/20" />
                  <div>
                    <p className="text-sm font-black tracking-tight">{post.userName}</p>
                    <p className={`text-[10px] font-bold uppercase tracking-widest ${post.type === 'reel' ? 'text-white/60' : 'text-slate-400'}`}>há pouco</p>
                  </div>
                </div>
              </div>

              {/* Media Content */}
              {post.type === 'feed' ? (
                <div className="space-y-4">
                  {post.content && <p className="px-6 text-sm text-slate-700 leading-relaxed font-medium">{post.content}</p>}
                  {post.mediaUrl && (
                    <div className="w-full bg-slate-100">
                      {post.mediaType === 'image' ? (
                        <img src={post.mediaUrl} className="w-full h-auto max-h-[500px] object-cover" alt="Post" />
                      ) : (
                        <video src={post.mediaUrl} controls className="w-full h-auto max-h-[500px]" />
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-full w-full flex items-center justify-center">
                  <video src={post.mediaUrl} autoPlay loop muted className="h-full w-full object-cover" />
                  <div className="absolute bottom-10 left-6 right-6">
                     <p className="text-white font-bold text-sm drop-shadow-lg">{post.content}</p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className={`p-4 flex items-center justify-between ${post.type === 'reel' ? 'absolute bottom-2 right-2 flex-col gap-6 w-auto' : 'border-t border-slate-50'}`}>
                <div className={`flex items-center gap-6 ${post.type === 'reel' ? 'flex-col' : ''}`}>
                  <button 
                    onClick={() => toggleLike(post.id)}
                    className={`flex items-center gap-1.5 transition-all ${post.likes.includes(user.id) ? 'text-red-500 scale-110' : post.type === 'reel' ? 'text-white' : 'text-slate-500'}`}
                  >
                    <Heart size={post.type === 'reel' ? 28 : 22} fill={post.likes.includes(user.id) ? 'currentColor' : 'none'} />
                    <span className="text-xs font-black">{post.likes.length}</span>
                  </button>
                  <button 
                    onClick={() => setActiveCommentId(activeCommentId === post.id ? null : post.id)}
                    className={`flex items-center gap-1.5 ${post.type === 'reel' ? 'text-white' : 'text-slate-500'}`}
                  >
                    <MessageCircle size={post.type === 'reel' ? 28 : 22} />
                    <span className="text-xs font-black">{post.comments.length}</span>
                  </button>
                  <button className={`${post.type === 'reel' ? 'text-white' : 'text-slate-500'}`}><Share2 size={post.type === 'reel' ? 28 : 22} /></button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Post Reel FAB */}
      {tab === 'reels' && (
        <button 
          onClick={() => { setPostType('reel'); setIsCreatingPost(true); }}
          className="fixed bottom-24 right-6 w-16 h-16 bg-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center z-50 active:scale-90 transition-transform"
        >
          <Plus size={32} />
        </button>
      )}

      {/* Create Media Modal */}
      {isCreatingPost && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-end md:items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[3rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-20 duration-300">
            <div className="p-6 border-b border-slate-50 flex items-center justify-between">
               <h3 className="font-black text-xl tracking-tight uppercase">Postar {postType === 'reel' ? 'Reel' : 'no Feed'}</h3>
               <button onClick={resetPostForm} className="p-2 text-slate-400 bg-slate-50 rounded-full"><X size={20}/></button>
            </div>
            
            <form onSubmit={handleCreatePost} className="p-8 space-y-6">
              {selectedFile ? (
                <div className="relative rounded-3xl overflow-hidden bg-slate-900 border-4 border-slate-50 shadow-inner group">
                   {selectedFileType === 'image' ? (
                     <img src={selectedFile} className="w-full h-64 object-cover" alt="Preview" />
                   ) : (
                     <video src={selectedFile} className="w-full h-64 object-cover" muted autoPlay loop />
                   )}
                   <button 
                     type="button"
                     onClick={() => setSelectedFile(null)}
                     className="absolute top-4 right-4 bg-red-600 text-white p-2 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-opacity"
                   >
                     <Trash2 size={18} />
                   </button>
                </div>
              ) : (
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-48 border-4 border-dashed border-slate-100 rounded-[2.5rem] flex flex-col items-center justify-center text-slate-300 hover:border-blue-200 hover:text-blue-300 transition-all group"
                >
                   <PlusSquare size={48} className="mb-2 group-hover:scale-110 transition-transform" />
                   <span className="text-xs font-black uppercase tracking-widest">Selecionar {postType === 'reel' ? 'Vídeo' : 'Mídia'}</span>
                </button>
              )}

              <textarea 
                value={newPostContent}
                onChange={e => setNewPostContent(e.target.value)}
                placeholder={postType === 'reel' ? "Dê uma legenda ao seu Reel..." : "O que está acontecendo?"}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/10 min-h-[100px]"
              />

              <input 
                type="file" 
                hidden 
                ref={fileInputRef} 
                onChange={handleFileSelect} 
                accept={postType === 'reel' ? "video/*" : "image/*,video/*"} 
              />

              <button 
                type="submit"
                disabled={!selectedFile && !newPostContent.trim()}
                className="w-full bg-blue-600 text-white font-black py-5 rounded-[2rem] shadow-2xl shadow-blue-200 active:scale-95 transition-all disabled:opacity-30 uppercase tracking-widest"
              >
                Publicar Agora
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const Trash2 = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
  </svg>
);

export default Home;
