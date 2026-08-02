import React from 'react';
import { MapPin, Briefcase, Clock, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const JobCard = ({ job }) => {
  return (
    <Card className="border-border bg-card shadow-soft hover:shadow-luxury transition-smooth group flex flex-col h-full rounded-2xl overflow-hidden">
      <CardContent className="p-8 flex flex-col h-full">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 rounded-md px-3 py-1 font-semibold uppercase tracking-wider text-xs">
            {job.department}
          </Badge>
          <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground bg-muted/50 px-3 py-1 rounded-md">
            <Clock className="w-3.5 h-3.5" /> {job.type}
          </div>
        </div>
        
        <h3 className="text-2xl font-serif font-bold text-foreground mb-3">{job.title}</h3>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-5">
          <MapPin className="w-4 h-4 text-primary" /> {job.location}
        </div>
        
        <p className="text-muted-foreground leading-relaxed flex-1 mb-8">
          {job.description}
        </p>
        
        <Button className="w-full bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300 group-hover:shadow-md font-bold h-12 rounded-xl mt-auto">
          Apply Now <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default JobCard;