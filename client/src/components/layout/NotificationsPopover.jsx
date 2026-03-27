import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, ExternalLink, Loader2 } from 'lucide-react';
import { notificationService } from '../../services/api';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { useAuthStore } from '../../hooks/useAuthStore';

export function NotificationsPopover() {
  const { user } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const popoverRef = useRef(null);

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await notificationService.getNotifications();
      if (res.success) {
        setNotifications(res.data.notifications || []);
        setUnreadCount(res.data.unreadCount || 0);
      }
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll every 60 seconds
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative" ref={popoverRef}>
      <button 
        onClick={() => {
           setIsOpen(!isOpen);
           if (!isOpen) fetchNotifications();
        }} 
        className="relative p-2 text-[#a1a1aa] hover:text-[#fafafa] transition-colors rounded-full hover:bg-white/[0.03] focus:outline-none"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-2 w-2.5 h-2.5 rounded-full bg-[#f43f5e] ring-2 ring-[#18181b]"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-[#27272a] bg-[#18181b] shadow-2xl overflow-hidden z-50 flex flex-col max-h-[80vh]">
          <div className="px-4 py-3 border-b border-[#27272a] flex items-center justify-between bg-[#09090b]">
            <h3 className="font-bold text-[#fafafa] flex items-center gap-2">
              Notifications {unreadCount > 0 && <span className="px-2 py-0.5 rounded-full bg-[#6366f1] text-xs text-white">{unreadCount} new</span>}
            </h3>
            {unreadCount > 0 && (
              <button onClick={handleMarkAllAsRead} className="text-xs text-[#a1a1aa] hover:text-[#fafafa] transition-colors">
                Mark all read
              </button>
            )}
          </div>
          
          <div className="overflow-y-auto flex-1 hide-scrollbar">
            {loading && notifications.length === 0 ? (
              <div className="p-8 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-[#6366f1]" /></div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-[#a1a1aa]">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-20" />
                <p className="text-sm">You're all caught up!</p>
              </div>
            ) : (
              <div className="divide-y divide-[#27272a]">
                {notifications.map(n => (
                  <Link 
                    key={n._id} 
                    to={n.link || '#'} 
                    onClick={() => setIsOpen(false)}
                    className={`block p-4 hover:bg-white/[0.02] transition-colors ${!n.read ? 'bg-[#6366f1]/5' : ''}`}
                  >
                    <div className="flex gap-3">
                      <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${!n.read ? 'bg-[#6366f1]' : 'bg-transparent'}`} />
                      <div className="flex-1 min-w-0">
                         <p className={`text-sm ${!n.read ? 'text-[#fafafa] font-medium' : 'text-[#a1a1aa]'}`}>
                           {n.message}
                         </p>
                         <div className="flex items-center justify-between mt-2">
                           <span className="text-xs text-[#71717a]">{formatDistanceToNow(new Date(n.createdAt), {addSuffix: true})}</span>
                           {!n.read && (
                             <button onClick={(e) => handleMarkAsRead(n._id, e)} className="text-xs text-[#6366f1] hover:text-[#818cf8] font-medium transition-colors">
                               Mark read
                             </button>
                           )}
                         </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
