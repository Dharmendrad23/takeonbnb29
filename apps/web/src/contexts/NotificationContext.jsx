import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { toast } from 'sonner';

const NotificationContext = createContext({
  notifications: [],
  unreadCount: 0,
  markAsRead: async () => {},
  markAllAsRead: async () => {}
});

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    const fetchNotifications = async () => {
      try {
        const records = await pb.collection('notifications').getList(1, 50, {
          filter: `userId="${currentUser.id}"`,
          sort: '-created',
          $autoCancel: false
        });
        setNotifications(records.items);
        setUnreadCount(records.items.filter(n => !n.isRead).length);
      } catch (e) {
        console.error('Error fetching notifications:', e);
      }
    };

    fetchNotifications();

    pb.collection('notifications').subscribe('*', (e) => {
      if (e.record.userId === currentUser.id) {
        fetchNotifications();
        if (e.action === 'create' && !e.record.isRead) {
          toast(e.record.message, {
            description: 'New update on your account',
            action: {
              label: 'View',
              onClick: () => {}
            }
          });
        }
      }
    });

    return () => pb.collection('notifications').unsubscribe('*');
  }, [currentUser]);

  const markAsRead = async (id) => {
    try {
      await pb.collection('notifications').update(id, { isRead: true }, { $autoCancel: false });
      // Local state is updated automatically via realtime subscription
    } catch (e) {
      console.error('Error marking notification as read:', e);
    }
  };

  const markAllAsRead = async () => {
    const unread = notifications.filter(n => !n.isRead);
    for (const n of unread) {
      try {
        await pb.collection('notifications').update(n.id, { isRead: true }, { $autoCancel: false });
      } catch (e) {
        console.error('Error marking notification as read:', e);
      }
    }
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);