import React from 'react';
import { Edit, Trash2, Eye, MapPin, Building, CheckCircle2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import api from '@/lib/api.js';

const HostPropertyCard = ({ property, onEdit, onDelete }) => {
  const imageUrl = property.coverImage 
    ? pb.files.getUrl(property, property.coverImage)
    : property.photos?.length > 0
      ? pb.files.getUrl(property, property.photos[0])
      : 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80';

  const getStatusConfig = (status) => {
    switch(status?.toLowerCase()) {
      case 'live':
      case 'approved':
        return { color: 'text-emerald-600 bg-emerald-100', icon: CheckCircle2, label: 'Live' };
      case 'pending':
      case 'submitted':
        return { color: 'text-amber-600 bg-amber-100', icon: Clock, label: 'Pending Approval' };
      case 'draft':
      default:
        return { color: 'text-slate-600 bg-slate-100', icon: Clock, label: 'Draft' };
    }
  };

  const statusConfig = getStatusConfig(property.status || property.approvalStatus);
  const StatusIcon = statusConfig.icon;

  return (
    <Card className="overflow-hidden group hover:shadow-dashboard-card transition-smooth border-border/50">
      <div className="relative aspect-video overflow-hidden bg-muted">
        <img 
          src={imageUrl} 
          alt={property.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm ${statusConfig.color}`}>
          <StatusIcon className="w-3.5 h-3.5" /> {statusConfig.label}
        </div>
        <div className="absolute top-3 right-3 px-2.5 py-1 bg-background/90 backdrop-blur-md rounded-full text-xs font-bold shadow-sm">
          ₹{property.pricePerNight?.toLocaleString('en-IN')}/night
        </div>
      </div>
      <CardContent className="p-5">
        <h3 className="font-bold text-lg text-foreground line-clamp-1 mb-2 group-hover:text-primary transition-colors">
          {property.title}
        </h3>
        <div className="flex flex-col gap-2 mb-6">
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 mr-1.5 text-primary/70 shrink-0" />
            <span className="line-clamp-1">{property.location}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Building className="w-4 h-4 mr-1.5 text-primary/70 shrink-0" />
            <span>{property.propertyType} • {property.bedrooms} Bed • {property.guestCapacity} Guests</span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 pt-4 border-t border-border/50">
          <Button variant="outline" size="sm" className="flex-1 hover:bg-primary/5 hover:text-primary hover:border-primary/30" onClick={() => onEdit(property)}>
            <Edit className="w-4 h-4 mr-1.5" /> Edit
          </Button>
          <Button variant="outline" size="sm" asChild className="flex-1 hover:bg-primary/5 hover:text-primary hover:border-primary/30">
            <Link to={`/property/${property.id}`} target="_blank">
              <Eye className="w-4 h-4 mr-1.5" /> View
            </Link>
          </Button>
          <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10 px-3" onClick={() => onDelete(property)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default HostPropertyCard;