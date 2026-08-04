import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { listNotifications } from '@/lib/dataApi.js';

export const useRealtimeNotifications = () => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!currentUser) return;

    const fetchNotifications = async () => {
      try {
        const records = await listNotifications({ userId: currentUser.id });
        setNotifications(records);
        setUnreadCount(records.filter(n => !n.isRead).length);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    };

    fetchNotifications();
    const intervalId = window.setInterval(fetchNotifications, 15000);
    return () => window.clearInterval(intervalId);
  }, [currentUser]);

  return { notifications, unreadCount };
};