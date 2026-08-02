import React from 'react';
import { Bell, CheckCircle2, Inbox } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { useNotifications } from '@/contexts/NotificationContext.jsx';
import { formatDate } from '@/lib/bookingUtils.js';

export const NotificationCenter = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-muted transition-colors">
          <Bell className="w-5 h-5 text-foreground" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-primary rounded-full border-2 border-background animate-pulse" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 md:w-96 p-0 rounded-2xl shadow-xl border-border" align="end">
        <div className="flex items-center justify-between p-4 border-b border-border bg-muted/20">
          <h3 className="font-bold text-foreground">Notifications</h3>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="h-8 text-xs font-semibold text-primary hover:text-primary/80">
              Mark all as read
            </Button>
          )}
        </div>
        
        <div className="max-h-[400px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
              <Inbox className="w-10 h-10 mb-3 opacity-20" />
              <p className="font-medium text-sm">You're all caught up!</p>
              <p className="text-xs mt-1">No new notifications</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-4 border-b border-border last:border-0 hover:bg-muted/50 transition-colors cursor-pointer flex gap-3 ${!notification.isRead ? 'bg-primary/5' : ''}`}
                  onClick={() => !notification.isRead && markAsRead(notification.id)}
                >
                  <div className="shrink-0 mt-0.5">
                    {notification.isRead ? (
                      <CheckCircle2 className="w-5 h-5 text-muted-foreground opacity-50" />
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className={`text-sm ${!notification.isRead ? 'font-bold text-foreground' : 'font-medium text-muted-foreground'}`}>
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1.5 font-medium">
                      {formatDate(notification.created)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};