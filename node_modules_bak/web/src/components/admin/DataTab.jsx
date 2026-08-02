import React, { useState } from 'react';
import { Database, RefreshCw } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import LiveDataViewer from './LiveDataViewer.jsx';

const COLLECTIONS = [
  'properties',
  'bookings',
  'users',
  'reviews',
  'amenities',
  'admin_users',
  'guests',
  'activity_logs',
  'email_notifications',
  'whatsapp_messages',
  'invoices',
  'notifications'
];

const DataTab = () => {
  const [selectedCollection, setSelectedCollection] = useState('bookings');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 bg-card border border-border p-6 rounded-2xl shadow-sm">
        <div>
          <h2 className="text-2xl font-serif font-bold text-foreground flex items-center gap-2">
            <Database className="w-6 h-6 text-primary" />
            Live Data Explorer
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            View, search, and export live records across all platform databases.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-full sm:w-56">
            <Select value={selectedCollection} onValueChange={setSelectedCollection}>
              <SelectTrigger className="bg-background border-border">
                <SelectValue placeholder="Select collection" />
              </SelectTrigger>
              <SelectContent>
                {COLLECTIONS.map(col => (
                  <SelectItem key={col} value={col} className="capitalize">
                    {col.replace('_', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" onClick={handleRefresh} className="shrink-0 border-border" aria-label="Refresh Data">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main Viewer Component */}
      <LiveDataViewer 
        collectionName={selectedCollection} 
        refreshTrigger={refreshTrigger} 
      />
    </div>
  );
};

export default DataTab;