import React from 'react';
import { Star, Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

export const ReviewCarousel = ({ reviews }) => {
  if (!reviews || reviews.length === 0) return null;

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
          {reviews.map((review, index) => (
            <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
              <Card className="h-full bg-[#F5F2EC] border-none shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6 flex flex-col h-full">
                  <Quote className="w-8 h-8 text-[#C8A96B]/30 mb-4" />
                  <p className="text-foreground/80 leading-relaxed mb-6 flex-grow line-clamp-4">
                    "{review.reviewText}"
                  </p>
                  <div className="flex items-center gap-4 mt-auto pt-4 border-t border-border/50">
                    <div className="w-12 h-12 rounded-full bg-white overflow-hidden">
                      <img 
                        src={review.expand?.guestId?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${review.expand?.guestId?.name || 'Guest'}`} 
                        alt="Guest" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h5 className="font-semibold text-sm">{review.expand?.guestId?.name || 'Verified Guest'}</h5>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-[#C8A96B] text-[#C8A96B]' : 'text-muted'}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="-left-12 bg-white border-border hover:bg-[#F5F2EC] hover:text-[#C8A96B]" />
        <CarouselNext className="-right-12 bg-white border-border hover:bg-[#F5F2EC] hover:text-[#C8A96B]" />
      </Carousel>
    </div>
  );
};