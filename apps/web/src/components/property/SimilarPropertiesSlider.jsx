import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import api from '@/lib/api';
import { formatCurrency } from '@/lib/bookingUtils.js';
import PropertyCardSkeleton from '@/components/PropertyCardSkeleton.jsx';

export const SimilarPropertiesSlider = ({ currentPropertyId, propertyType }) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSimilar = async () => {
      try {
        const records = await pb.collection('properties').getList(1, 6, {
          filter: `propertyType='${propertyType}' && approvalStatus='approved' && id!='${currentPropertyId}'`,
          $autoCancel: false
        });
        setProperties(records.items);
      } catch (err) {
        console.error("Failed to fetch similar properties", err);
      } finally {
        setLoading(false);
      }
    };
    if (propertyType && currentPropertyId) {
      fetchSimilar();
    }
  }, [propertyType, currentPropertyId]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => <PropertyCardSkeleton key={i} />)}
      </div>
    );
  }

  if (!properties || properties.length === 0) return null;

  return (
    <div className="relative px-12">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {properties.map((property) => {
            const imageUrl = property.photos && property.photos.length > 0
              ? pb.files.getUrl(property, property.photos[0], { thumb: '600x400' })
              : 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80';

            return (
              <CarouselItem key={property.id} className="pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <Link to={`/property/${property.id}`}>
                  <Card className="overflow-hidden border-none shadow-sm hover:shadow-hover transition-all duration-300 group h-full bg-card">
                    <div className="aspect-[4/3] relative overflow-hidden rounded-t-2xl">
                      <img 
                        src={imageUrl} 
                        alt={property.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1 text-sm font-medium shadow-sm">
                        <Star className="w-3.5 h-3.5 fill-foreground text-foreground" />
                        {property.rating || 'New'}
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2 uppercase tracking-wider font-medium">
                        <MapPin className="w-3 h-3" />
                        {property.location}
                      </div>
                      <h4 className="text-lg font-semibold mb-2 line-clamp-1 group-hover:text-primary transition-colors">{property.title}</h4>
                      <div className="flex items-baseline gap-1">
                        <span className="font-semibold text-foreground">{formatCurrency(property.pricePerNight)}</span>
                        <span className="text-sm text-muted-foreground">/ night</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious className="-left-4 bg-background border-border hover:bg-muted hover:text-foreground" />
        <CarouselNext className="-right-4 bg-background border-border hover:bg-muted hover:text-foreground" />
      </Carousel>
    </div>
  );
};

export default SimilarPropertiesSlider;