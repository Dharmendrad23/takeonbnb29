import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock, Shield, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const PropertyHighlightCard = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border shadow-sm hover:shadow-md transition-shadow">
    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <p className="text-sm text-muted-foreground font-medium">{label}</p>
      <p className="font-bold text-foreground">{value}</p>
    </div>
  </div>
);

export const AmenityCard = ({ icon: Icon, name }) => (
  <div className="flex items-center gap-3 p-3 rounded-lg border border-border/50 hover:border-primary/30 transition-colors bg-card">
    <Icon className="w-5 h-5 text-primary" />
    <span className="text-sm font-medium">{name}</span>
  </div>
);

export const BedroomCard = ({ title, bedType, view, amenities }) => (
  <Card className="overflow-hidden border-border/50 shadow-sm hover:shadow-md transition-all duration-300">
    <div className="aspect-[4/3] bg-muted relative">
      <img 
        src="https://images.unsplash.com/photo-1630994347131-96d17ec41ba2?w=600&q=80" 
        alt={title}
        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
      />
    </div>
    <CardContent className="p-5">
      <h4 className="text-xl font-bold mb-2">{title}</h4>
      <p className="text-sm text-muted-foreground mb-4">{bedType} • {view}</p>
      <div className="flex flex-wrap gap-2">
        {amenities.map((am, i) => (
          <Badge key={i} variant="secondary" className="bg-muted text-foreground hover:bg-muted">
            {am}
          </Badge>
        ))}
      </div>
    </CardContent>
  </Card>
);

export const ExperienceCard = ({ icon: Icon, title, description }) => (
  <div className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/50 shadow-sm hover:shadow-md transition-all duration-300">
    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform duration-300">
      <Icon className="w-7 h-7" />
    </div>
    <h4 className="text-xl font-bold mb-3">{title}</h4>
    <p className="text-muted-foreground leading-relaxed text-sm">{description}</p>
  </div>
);

export const HostCard = ({ host }) => (
  <Card className="bg-secondary text-secondary-foreground border-none overflow-hidden relative">
    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
    <CardContent className="p-8 relative z-10">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary">
          <img 
            src={host?.avatar || "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&q=80"} 
            alt={host?.name || "Host"} 
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h3 className="text-3xl font-bold mb-2">Hosted by {host?.name || "Take on BNB"}</h3>
          <p className="text-secondary-foreground/70">Premium Host • Verified</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 py-6 border-y border-secondary-foreground/10">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium">Verified Identity</span>
        </div>
        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium">Fast Response</span>
        </div>
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium">24/7 Support</span>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button className="bg-primary hover:bg-primary/90 text-white font-bold px-8">
          <MessageCircle className="w-4 h-4 mr-2" />
          Contact Host
        </Button>
      </div>
    </CardContent>
  </Card>
);