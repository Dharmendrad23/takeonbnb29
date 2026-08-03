import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import api from '@/lib/api.js';
import { Activity, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const AdminActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const records = await pb.collection('activity_logs').getList(1, 50, {
          sort: '-created',
          expand: 'adminId',
          $autoCancel: false
        });
        setLogs(records.items);
      } catch (error) {
        console.error("Logs fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      <Helmet><title>Activity Logs | Admin</title></Helmet>

      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground flex items-center gap-3">
          <Activity className="w-8 h-8 text-primary" /> System Activity
        </h1>
        <p className="text-muted-foreground mt-2">Track admin actions and system events.</p>
      </div>

      <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-muted/40 border-b border-border">
            <tr>
              <th className="px-6 py-4">Timestamp</th>
              <th className="px-6 py-4">Admin/User</th>
              <th className="px-6 py-4">Action</th>
              <th className="px-6 py-4">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr><td colSpan="4" className="px-6 py-8 text-center text-muted-foreground">Loading logs...</td></tr>
            ) : logs.length === 0 ? (
              <tr><td colSpan="4" className="px-6 py-8 text-center text-muted-foreground">No recent activity recorded.</td></tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-muted/10 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-muted-foreground flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary/50" />
                    {new Date(log.created).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 font-medium text-foreground">
                    {log.expand?.adminId?.name || 'System Auto'}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="outline" className="capitalize bg-secondary/10 text-secondary-foreground border-secondary/20">
                      {log.actionType?.replace('_', ' ')}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground max-w-md truncate">
                    {log.details || `Target ID: ${log.targetId} (${log.targetType})`}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminActivityLogs;