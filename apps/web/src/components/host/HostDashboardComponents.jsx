
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { getEntityId } from '@/lib/propertyMappers.js';

export const DashboardCard = ({ title, value, trend, trendValue, icon: Icon }) => (
  <Card className="shadow-sm border-border">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <Icon className="w-4 h-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-foreground">{value}</div>
      <p className={`text-xs mt-1 font-medium ${trend === 'up' ? 'text-emerald-500' : 'text-destructive'}`}>
        {trend === 'up' ? '↑' : '↓'} {trendValue}% from last month
      </p>
    </CardContent>
  </Card>
);

export const RevenueChart = ({ data }) => {
  // Mock data if empty
  const chartData = data?.length > 0 ? data : [
    { name: 'Mon', total: 1200 },
    { name: 'Tue', total: 900 },
    { name: 'Wed', total: 1600 },
    { name: 'Thu', total: 2100 },
    { name: 'Fri', total: 1800 },
    { name: 'Sat', total: 2800 },
    { name: 'Sun', total: 3200 },
  ];

  return (
    <Card className="col-span-1 lg:col-span-3 shadow-sm border-border">
      <CardHeader>
        <CardTitle className="text-lg">Revenue Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dx={-10} tickFormatter={(val) => `₹${val}`} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value) => [`₹${value}`, 'Revenue']}
              />
              <Line type="monotone" dataKey="total" stroke="hsl(var(--primary))" strokeWidth={3} dot={{r: 4, fill: "hsl(var(--primary))", strokeWidth: 2, stroke: "#fff"}} activeDot={{r: 6}} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export const BookingsTable = ({ bookings }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'pending': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'checked-in': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <Card className="shadow-sm border-border overflow-hidden">
      <CardHeader>
        <CardTitle className="text-lg">Recent Bookings</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Guest</TableHead>
              <TableHead>Property</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No bookings found</TableCell>
              </TableRow>
            )}
            {bookings.slice(0, 5).map(b => (
              <TableRow key={getEntityId(b)} className="hover:bg-muted/30 transition-colors">
                <TableCell className="font-medium text-foreground">{b.guestFullName || b.guest?.name || 'Guest'}</TableCell>
                <TableCell className="text-muted-foreground">{b.propertyName || b.property?.title || b.propertyId?.title || 'Unknown Property'}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {format(new Date(b.checkInDate), 'MMM d')} - {format(new Date(b.checkOutDate), 'MMM d')}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={`${getStatusColor(b.status)} capitalize font-semibold shadow-none`}>
                    {b.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-bold text-foreground">₹{b.totalPrice?.toLocaleString('en-IN')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {bookings.length > 5 && (
          <div className="p-4 border-t border-border bg-muted/20 text-center">
            <Button variant="link" className="text-primary">View all bookings</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
