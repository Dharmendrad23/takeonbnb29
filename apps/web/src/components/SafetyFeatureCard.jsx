import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const SafetyFeatureCard = ({ feature }) => {
  const Icon = feature.icon;
  return (
    <Card className="border-border bg-card shadow-soft hover:shadow-luxury transition-smooth h-full rounded-2xl group">
      <CardContent className="p-8">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300 text-primary">
          <Icon className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-serif font-bold text-foreground mb-3">{feature.title}</h3>
        <p className="text-muted-foreground leading-relaxed">
          {feature.description}
        </p>
      </CardContent>
    </Card>
  );
};

export default SafetyFeatureCard;