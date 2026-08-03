import { useState, useEffect } from 'react';
import api from '@/lib/api.js';
import { useAuth } from '@/contexts/AuthContext.jsx';

export const useRealtimeNotifications = () => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!currentUser) return;

    const fetchNotifications = async () => {
      try {
        const userId = currentUser._id || currentUser.id;
        const { data } = await api.get(`/notifications?userId=${userId}`);
        const items = data.notifications || data.items || [];
        setNotifications(items);
        setUnreadCount(items.filter(n => !n.isRead).length);
      } catch (error) {
        // Notifications endpoint may not exist yet — fail silently
        console.warn('Could not fetch notifications:', error.message);
      }
    };

    fetchNotifications();
  }, [currentUser]);

  return { notifications, unreadCount };
};