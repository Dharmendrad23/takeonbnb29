import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const EmptyState = ({ icon: Icon, title, description, actionLabel, actionPath }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      {Icon && <Icon className="w-16 h-16 text-muted-foreground mb-4" />}
      <h3 className="text-2xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-md">{description}</p>
      {actionLabel && actionPath && (
        <Button onClick={() => navigate(actionPath)}>{actionLabel}</Button>
      )}
    </div>
  );
};

export default EmptyState;