import React from 'react';

const AdminStatCard = ({
  title,
  value,
  change,
  icon: Icon,
  iconClass = 'text-primary',
  iconBg = 'bg-primary/10',
  loading = false,
}) => {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/5 transition-transform duration-500 group-hover:scale-150" />

      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {title}
          </p>

          {loading ? (
            <div className="mt-3 h-9 w-24 animate-pulse rounded-lg bg-muted" />
          ) : (
            <h3 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground">
              {value}
            </h3>
          )}

          {change && (
            <div className="mt-3 inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-600">
              {change}
            </div>
          )}
        </div>

        {Icon && (
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${iconBg} border border-border shadow-sm`}>
            <Icon className={`h-6 w-6 ${iconClass}`} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminStatCard;
