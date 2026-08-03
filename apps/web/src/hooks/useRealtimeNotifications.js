import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext.jsx';

export const useRealtimeNotifications = () => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!currentUser) return;

    const fetchNotifications = async () => {
      try {
        const records = await pb.collection('notifications').getList(1, 50, {
          filter: `userId = "${currentUser.id}"`,
          sort: '-created',
          $autoCancel: false
        });
        setNotifications(records.items);
        setUnreadCount(records.items.filter(n => !n.isRead).length);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    };

    fetchNotifications();

    let unsubscribeFunc = null;
    const subscribe = async () => {
      try {
        unsubscribeFunc = await pb.collection('notifications').subscribe('*', function (e) {
          if (e.record.userId !== currentUser.id) return;
          
          if (e.action === 'create') {
            setNotifications(prev => [e.record, ...prev]);
            setUnreadCount(prev => prev + 1);
          } else if (e.action === 'update') {
            setNotifications(prev => prev.map(n => n.id === e.record.id ? e.record : n));
            setUnreadCount(prev => {
              const wasRead = notifications.find(n => n.id === e.record.id)?.isRead;
              if (!wasRead && e.record.isRead) return Math.max(0, prev - 1);
              if (wasRead && !e.record.isRead) return prev + 1;
              return prev;
            });
          } else if (e.action === 'delete') {
            setNotifications(prev => prev.filter(n => n.id !== e.record.id));
            if (!e.record.isRead) setUnreadCount(prev => Math.max(0, prev - 1));
          }
        });
      } catch (err) {
        console.error("Failed to subscribe to notifications:", err);
      }
    };

    subscribe();

    return () => {
      if (unsubscribeFunc) unsubscribeFunc();
      else pb.collection('notifications').unsubscribe('*');
    };
  }, [currentUser]);

  return { notifications, unreadCount };
};