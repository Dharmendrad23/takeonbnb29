import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '@/lib/api.js';
import { useAuth } from '@/contexts/AuthContext.jsx';

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
        const response = await api.get(`/api/notifications?userId=${currentUser.id}`);
        const items = Array.isArray(response.data) ? response.data : response.data?.items || [];
        setNotifications(items);
        setUnreadCount(items.filter(n => !n.isRead).length);
      } catch (e) {
        console.error('Error fetching notifications:', e);
      }
    };

    fetchNotifications();

    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [currentUser]);

  const markAsRead = async (id) => {
    try {
      await api.put(`/api/notifications/${id}`, { isRead: true });
      setNotifications(prev => prev.map(n => n._id === id || n.id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (e) {
      console.error('Error marking notification as read:', e);
    }
  };

  const markAllAsRead = async () => {
    const unread = notifications.filter(n => !n.isRead);
    for (const n of unread) {
      try {
        const nId = n._id || n.id;
        await api.put(`/api/notifications/${nId}`, { isRead: true });
      } catch (e) {
        console.error('Error marking notification as read:', e);
      }
    }
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);