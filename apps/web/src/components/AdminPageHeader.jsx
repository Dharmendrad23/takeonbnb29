import React from 'react';
import { Search, Bell } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const AdminPageHeader = ({
  title,
  subtitle,
  searchPlaceholder = 'Search anything...',
  actions,
  showSearch = true,
}) => {
  return (
    <>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-6">
        
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            {title}
          </h1>

          {subtitle && (
            <p className="text-sm text-muted-foreground mt-1">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          {actions}
        </div>
      </div>

      {showSearch && (
        <div className="flex items-center gap-3 mb-6">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

            <Input
              placeholder={searchPlaceholder}
              className="pl-10 h-10 bg-background border-border rounded-lg"
            />
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-lg border border-border"
          >
            <Bell className="w-4 h-4" />
          </Button>
        </div>
      )}
    </>
  );
};

export default AdminPageHeader;
