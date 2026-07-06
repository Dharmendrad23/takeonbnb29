import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Quote } from 'lucide-react';

const TestimonialCard = ({ testimonial }) => {
  return (
    <Card className="border-border bg-muted/20 shadow-none hover:shadow-soft transition-smooth rounded-3xl relative h-full flex flex-col">
      <div className="absolute top-8 right-8 text-primary/10">
        <Quote className="w-12 h-12" fill="currentColor" />
      </div>
      <CardContent className="p-8 flex flex-col h-full">
        <div className="flex-1 mb-8 z-10">
          <p className="text-lg md:text-xl text-foreground font-serif italic leading-relaxed text-balance">
            "{testimonial.quote}"
          </p>
        </div>
        <div className="flex items-center gap-4 mt-auto">
          <Avatar className="w-14 h-14 border-2 border-background shadow-sm">
            <AvatarImage src={testimonial.avatar} alt={testimonial.name} className="object-cover" />
            <AvatarFallback className="bg-primary/20 text-primary font-bold text-lg">{testimonial.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-bold text-foreground">{testimonial.name}</h4>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">{testimonial.position}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestimonialCard;