import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Loader2 } from 'lucide-react';
import { messageService } from '../services/api';
import { useAuthStore } from '../hooks/useAuthStore';
import { toast } from './ui/Toast';

export function MessagePanel({ recipientId, recipientName, onClose }) {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [content, setContent] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);
  
  const { user } = useAuthStore();
  const currentUserId = user?._id;

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setIsLoading(true);
        const res = await messageService.getConversation(recipientId);
        if (res.success) {
          setMessages(res.data || []);
        }
      } catch (err) {
        toast.error('Failed to load conversation');
      } finally {
        setIsLoading(false);
      }
    };
    if (recipientId) fetchMessages();
  }, [recipientId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    try {
      setIsSending(true);
      const res = await messageService.send(recipientId, content.trim());
      if (res.success && res.data) {
        setMessages(prev => [...prev, res.data]);
        setContent('');
      } else {
        toast.error('Failed to send message');
      }
    } catch (err) {
      toast.error('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed bottom-0 right-0 md:bottom-6 md:right-8 w-full md:w-[380px] h-[540px] bg-[#121214]/95 backdrop-blur-2xl border border-white/10 md:rounded-3xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.7)] flex flex-col z-[70] overflow-hidden animate-in slide-in-from-bottom-8 duration-300">
      <div className="p-4 border-b border-white/5 bg-gradient-to-r from-[#18181b] to-[#1f1f22] flex items-center gap-3 shrink-0 shadow-sm relative z-10 w-full justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6366f1] to-[#a855f7] p-[2px]">
              <div className="w-full h-full bg-[#18181b] rounded-full flex items-center justify-center">
                 <span className="text-white font-bold text-sm tracking-wider uppercase">{(recipientName || 'U').charAt(0)}</span>
              </div>
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#10b981] border-2 border-[#18181b] rounded-full"></div>
          </div>
          <div>
            <h3 className="text-[#fafafa] font-bold text-sm tracking-wide">{recipientName || 'User'}</h3>
            <p className="text-[0.65rem] text-[#10b981] font-bold uppercase tracking-widest mt-0.5">Active</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 text-[#a1a1aa] hover:text-white rounded-full hover:bg-white/10 transition-all shrink-0">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 bg-[#09090b]/60 relative custom-scrollbar">
        {isLoading ? (
          <div className="h-full flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-6 h-6 text-[#6366f1] animate-spin" />
            <span className="text-xs text-[#a1a1aa] font-medium tracking-wide">Syncing secure channel...</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
               <Send className="w-6 h-6 text-[#6366f1] opacity-50" />
            </div>
            <p className="text-[#fafafa] font-bold text-sm">No messages yet</p>
            <p className="text-xs mt-2 text-[#a1a1aa] leading-relaxed">This is the beginning of your direct conversation with {recipientName || 'this user'}.</p>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isMine = String(msg.sender?._id || msg.sender) === String(currentUserId);
            const timeText = new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            // Add slight margin bottom to last message in a cluster
            const isLast = idx === messages.length - 1;
            const nextMsg = !isLast ? messages[idx + 1] : null;
            const nextIsMine = nextMsg ? String(nextMsg.sender?._id || nextMsg.sender) === String(currentUserId) : null;
            const clusterEnd = isLast || nextIsMine !== isMine;

            return (
              <div key={msg._id} className={`flex w-full ${clusterEnd ? 'mb-4' : 'mb-1'} ${isMine ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex flex-col ${isMine ? 'items-end' : 'items-start'} max-w-[85%]`}>
                  <div className={`px-4 py-2.5 text-[0.85rem] shadow-sm leading-relaxed ${
                    isMine 
                      ? 'bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] text-white rounded-2xl rounded-tr-sm' 
                      : 'bg-[#27272a]/80 backdrop-blur-md text-[#e4e4e7] border border-white/5 rounded-2xl rounded-tl-sm'
                  }`}>
                    {msg.content}
                  </div>
                  {clusterEnd && (
                    <span className="text-[0.65rem] text-[#71717a] mt-1 font-medium tracking-widest px-1">
                      {timeText}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="p-4 border-t border-white/5 bg-[#18181b] shrink-0">
        <div className="relative flex items-center cursor-text">
          <input
            type="text"
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Type your message..."
            className="w-full bg-[#27272a] border border-white/10 rounded-full pl-5 pr-14 py-3 text-sm text-[#fafafa] focus:outline-none focus:border-[#6366f1]/50 focus:ring-1 focus:ring-[#6366f1]/50 transition-all placeholder:text-[#52525b]"
            disabled={isSending}
          />
          <button
            type="submit"
            disabled={!content.trim() || isSending}
            className="absolute right-1.5 w-9 h-9 rounded-full bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] hover:opacity-90 disabled:opacity-50 flex items-center justify-center text-white transition-all shadow-md shrink-0"
          >
            {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 ml-0.5" />}
          </button>
        </div>
      </form>
    </div>
  );
}

export default MessagePanel;
