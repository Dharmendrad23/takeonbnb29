
import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { Quote, Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Maya Chen',
    location: 'Stayed in Bali Villa',
    text: 'An absolutely breathtaking experience. The villa exceeded all expectations and the local concierge team anticipated our every need. Cannot wait to book again.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150'
  },
  {
    id: 2,
    name: 'David & Sarah',
    location: 'Stayed in Swiss Alps Chalet',
    text: 'The seamless booking process and instant communication made planning our honeymoon stress-free. The mountain views from the living room were unmatched.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'
  },
  {
    id: 3,
    name: 'Raj Patel',
    location: 'Stayed in Dubai Penthouse',
    text: 'A flawless stay from check-in to check-out. The premium amenities and spotless cleanliness proved why Take on BnB is the only platform I use for business travel.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150'
  },
  {
    id: 4,
    name: 'Lucia Torres',
    location: 'Stayed in Tuscany Estate',
    text: 'Living among the vineyards in a historic restored farmhouse was magical. The photos were highly accurate, but the feeling of being there was even better.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150'
  },
  {
    id: 5,
    name: 'Kwame Asante',
    location: 'Stayed in Maldives Water Villa',
    text: 'The 24/7 support answered our questions immediately. Stepping right into the ocean from our private deck was the highlight of our year.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150'
  }
];

const Testimonials = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'center' }, [Autoplay({ delay: 5000, stopOnInteraction: true })]);

  return (
    <section className="py-24 bg-background overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-primary font-semibold tracking-wider uppercase text-sm mb-4">Guest Stories</h2>
        <h3 className="font-heading text-4xl md:text-5xl font-bold mb-12 text-foreground">Don't just take our word for it</h3>

        <div className="embla cursor-grab active:cursor-grabbing" ref={emblaRef}>
          <div className="embla__container flex">
            {testimonials.map((t) => (
              <div key={t.id} className="embla__slide flex-[0_0_100%] min-w-0 px-4">
                <div className="flex flex-col items-center">
                  <Quote className="w-12 h-12 text-primary/20 mb-6" />
                  <p className="text-xl md:text-2xl font-medium leading-relaxed text-foreground mb-8">
                    "{t.text}"
                  </p>
                  <div className="flex gap-1 mb-6">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-amber-500 text-amber-500" />
                    ))}
                  </div>
                  <div className="flex items-center gap-4">
                    <img src={t.avatar} alt={t.name} className="w-14 h-14 rounded-full object-cover border-2 border-primary/20" />
                    <div className="text-left">
                      <div className="font-bold text-foreground">{t.name}</div>
                      <div className="text-sm text-muted-foreground">{t.location}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className="w-2.5 h-2.5 rounded-full bg-border hover:bg-primary transition-colors"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
