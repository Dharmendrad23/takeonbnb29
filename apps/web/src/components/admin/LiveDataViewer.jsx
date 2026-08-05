import React, { useState, useEffect, useMemo } from 'react';
import { Download, Search, ChevronLeft, ChevronRight, AlertCircle, RefreshCw } from 'lucide-react';
import api from '@/lib/api.js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';

const LiveDataViewer = ({ collectionName, refreshTrigger }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'created', direction: 'desc' });

  const perPage = 25;

  const fetchData = async () => {
    if (!collectionName) return;
    setLoading(true);
    setError(null);
    try {
      const records = await pb.collection(collectionName).getList(page, perPage, {
        sort: `${sortConfig.direction === 'desc' ? '-' : ''}${sortConfig.key}`,
        $autoCancel: false
      });
      setData(records.items);
      setTotalPages(records.totalPages);
      setTotalRecords(records.totalItems);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message || 'Failed to fetch collection data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [collectionName, page, sortConfig, refreshTrigger]);

  useEffect(() => {
    if (!collectionName) return;

    // Set up realtime subscription
    const subscribeToCollection = async () => {
      try {
        await pb.collection(collectionName).subscribe('*', function (e) {
          if (e.action === 'create') {
            setData(prev => [e.record, ...prev].slice(0, perPage));
            setTotalRecords(prev => prev + 1);
            toast.success(`New record added to ${collectionName}`);
          } else if (e.action === 'update') {
            setData(prev => prev.map(item => item.id === e.record.id ? e.record : item));
          } else if (e.action === 'delete') {
            setData(prev => prev.filter(item => item.id !== e.record.id));
            setTotalRecords(prev => Math.max(0, prev - 1));
          }
        });
      } catch (err) {
        console.error('Realtime subscription failed:', err);
      }
    };

    subscribeToCollection();

    return () => {
      pb.collection(collectionName).unsubscribe('*').catch(console.error);
    };
  }, [collectionName]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    const lowerSearch = searchTerm.toLowerCase();
    return data.filter(item => {
      return Object.values(item).some(val => 
        String(val).toLowerCase().includes(lowerSearch)
      );
    });
  }, [data, searchTerm]);

  const renderCellContent = (value) => {
    if (value === null || value === undefined || value === '') return <span className="text-muted-foreground">-</span>;
    if (typeof value === 'boolean') return value ? <Badge className="bg-success">Yes</Badge> : <Badge variant="secondary">No</Badge>;
    if (typeof value === 'object') return <span className="text-xs truncate max-w-[150px] inline-block">{JSON.stringify(value)}</span>;
    const str = String(value);
    return str.length > 50 ? <span className="truncate max-w-[200px] inline-block" title={str}>{str}</span> : str;
  };

  const exportToCSV = () => {
    if (!data.length) return;
    const headers = Object.keys(data[0]);
    const csvRows = data.map(row => {
      return headers.map(header => {
        const val = row[header];
        let cell = val === null || val === undefined ? '' : String(val);
        cell = cell.replace(/"/g, '""');
        if (cell.includes(',') || cell.includes('"') || cell.includes('\n')) {
          cell = `"${cell}"`;
        }
        return cell;
      }).join(',');
    });
    
    const csvString = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${collectionName}_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!collectionName) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-card border border-border border-dashed rounded-2xl">
        <Search className="w-12 h-12 text-muted-foreground/50 mb-4" />
        <h3 className="text-xl font-bold">No Collection Selected</h3>
        <p className="text-muted-foreground">Please select a collection from the dropdown to view live data.</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-2xl shadow-sm flex flex-col overflow-hidden">
      {/* Toolbar */}
      <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 justify-between items-center bg-muted/10">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search current page..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-background border-border"
            />
          </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Badge variant="secondary" className="px-3 py-1 font-medium bg-background border border-border">
            Total: {totalRecords} records
          </Badge>
          <Button variant="outline" onClick={exportToCSV} className="border-border">
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </Button>
        </div>
      </div>

      {/* Table Area */}
      <div className="flex-1 overflow-auto min-h-[400px] relative">
        {loading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/50 backdrop-blur-sm z-10">
            <RefreshCw className="w-8 h-8 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground font-medium">Loading collection data...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <AlertCircle className="w-12 h-12 text-destructive mb-4 opacity-80" />
            <h3 className="text-lg font-bold text-foreground mb-2">Failed to load data</h3>
            <p className="text-muted-foreground mb-4 max-w-md">{error}</p>
            <Button onClick={fetchData} variant="outline"><RefreshCw className="w-4 h-4 mr-2" /> Retry</Button>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center text-muted-foreground">
            <p>No records found matching your criteria.</p>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-muted/30 sticky top-0 z-10 backdrop-blur-md">
              <TableRow className="border-border hover:bg-transparent">
                {Object.keys(filteredData[0] || {}).map(key => (
                  <TableHead 
                    key={key} 
                    className="cursor-pointer font-semibold text-foreground whitespace-nowrap"
                    onClick={() => handleSort(key)}
                  >
                    <div className="flex items-center gap-1">
                      {key}
                      {sortConfig.key === key && (
                        <span className="text-primary text-xs">
                          {sortConfig.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item, i) => (
                <TableRow key={item.id || i} className="border-border hover:bg-muted/20">
                  {Object.keys(filteredData[0] || {}).map(key => (
                    <TableCell key={key} className="py-3 px-4">
                      {renderCellContent(item[key])}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Pagination */}
      {!loading && !error && data.length > 0 && (
        <div className="p-4 border-t border-border flex items-center justify-between bg-muted/10">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium text-foreground">{data.length}</span> items on page <span className="font-medium text-foreground">{page}</span> of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="border-border"
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Prev
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="border-border"
            >
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveDataViewer;