import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { toast } from 'sonner';
import { listNotifications, updateNotification } from '@/lib/dataApi.js';
import { getEntityId } from '@/lib/propertyMappers.js';

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
        const records = await listNotifications({ userId: currentUser.id });
        setNotifications(records);
        setUnreadCount(records.filter(n => !n.isRead).length);
      } catch (e) {
        console.error('Error fetching notifications:', e);
      }
    };

    fetchNotifications();
    const intervalId = window.setInterval(fetchNotifications, 15000);
    return () => window.clearInterval(intervalId);
  }, [currentUser]);

  const markAsRead = async (id) => {
    try {
      await updateNotification(id, { isRead: true });
      setNotifications((current) =>
        current.map((notification) =>
          getEntityId(notification) === id ? { ...notification, isRead: true } : notification
        )
      );
      setUnreadCount((current) => Math.max(0, current - 1));
    } catch (e) {
      console.error('Error marking notification as read:', e);
    }
  };

  const markAllAsRead = async () => {
    const unread = notifications.filter(n => !n.isRead);
    for (const n of unread) {
      try {
        await updateNotification(getEntityId(n), { isRead: true });
      } catch (e) {
        console.error('Error marking notification as read:', e);
      }
    }
    setNotifications((current) => current.map((notification) => ({ ...notification, isRead: true })));
    setUnreadCount(0);
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);