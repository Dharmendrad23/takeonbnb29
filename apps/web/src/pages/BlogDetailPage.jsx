import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import BlogCard from '@/components/BlogCard.jsx';

// Re-using mock data for detail view
const MOCK_POSTS = [
  { id: '1', title: 'Top 10 Hidden Villas in Goa You Need to See', category: 'Property Guides', date: 'May 12, 2026', author: { name: 'Priya Sharma', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&q=80', bio: 'Senior Property Curator specializing in coastal luxury estates.' }, image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200&q=80', excerpt: 'Discover the most secluded and luxurious properties across the Goan coastline for your next private getaway.' }
];

const BlogDetailPage = () => {
  const { id } = useParams();
  
  // Simulated fetch
  const post = MOCK_POSTS[0]; // In real app, fetch based on id
  
  const relatedPosts = [
    { id: '2', title: 'The Ultimate Guide to Luxury Himalayan Retreats', category: 'Travel Tips', date: 'May 08, 2026', author: { name: 'Arjun Mehta', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80' }, image: 'https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=800&q=80', excerpt: 'Planning a trip to the mountains? From heated floors to panoramic views...' },
    { id: '3', title: 'How We Ensure 5-Star Standards', category: 'Industry News', date: 'May 01, 2026', author: { name: 'Rohan Desai', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&q=80' }, image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80', excerpt: 'Take an inside look at the rigorous 100-point inspection process...' },
    { id: '4', title: 'A Family Reunion to Remember', category: 'Guest Stories', date: 'Apr 28, 2026', author: { name: 'Anita Kapoor', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&q=80' }, image: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=800&q=80', excerpt: 'Read how the Patel family transformed an ancient lakeside haveli...' }
  ];

  if (!post) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Helmet>
        <title>{post.title} | Take On BnB Blog</title>
        <meta name="description" content={post.excerpt} />
      </Helmet>
      
      <Header />

      <main className="flex-1 pb-24">
        {/* POST HEADER */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
          <Button variant="ghost" asChild className="mb-8 text-muted-foreground hover:text-foreground pl-0">
            <Link to="/blog"><ArrowLeft className="w-4 h-4 mr-2" /> Back to all articles</Link>
          </Button>
          
          <div className="mb-6">
            <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none px-3 py-1 mb-4 uppercase tracking-wider font-bold">
              {post.category}
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground mb-6 leading-tight text-balance">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-muted-foreground border-b border-border pb-8">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10 border border-border">
                  <AvatarImage src={post.author.avatar} alt={post.author.name} />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold">{post.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-bold text-foreground">{post.author.name}</p>
                </div>
              </div>
              <div className="h-6 w-px bg-border hidden sm:block"></div>
              <div className="flex items-center gap-2 text-sm font-medium">
                <Calendar className="w-4 h-4" /> {post.date}
              </div>
            </div>
          </div>
        </section>

        {/* FEATURED IMAGE */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="aspect-[21/9] rounded-3xl overflow-hidden shadow-soft">
            <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
          </div>
        </section>

        {/* POST CONTENT & SIDEBAR */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* CONTENT */}
            <article className="lg:col-span-8 prose prose-lg prose-slate text-foreground leading-relaxed max-w-none">
              <p className="text-xl text-muted-foreground font-medium mb-8">
                {post.excerpt}
              </p>
              <p>
                The allure of Goa extends far beyond its bustling beaches and crowded shacks. Hidden amidst dense coconut groves, perched on secluded cliffs, and nestled alongside quiet backwaters are some of India's most extraordinary private villas. These properties offer an exclusive slice of coastal paradise for those seeking ultimate privacy and uncompromised luxury.
              </p>
              <h2>The Private Pool Experience</h2>
              <p>
                When selecting a luxury rental, a private pool isn't just an amenity—it's the centerpiece of your stay. Our curated villas in North and South Goa feature infinity pools that blend seamlessly with the Arabian Sea horizon, complete with sunken loungers and dedicated poolside service.
              </p>
              <blockquote>
                "True luxury is found in the details. It's the scent of fresh local flowers, the thread count of the linens, and the intuitive service of a private concierge."
              </blockquote>
              <h2>Architectural Marvels</h2>
              <p>
                From restored centuries-old Portuguese mansions with high wooden ceilings and azulejo tiles, to ultra-modern glass-and-steel architectural masterpieces designed by leading Asian architects, our portfolio caters to every aesthetic preference. 
              </p>
              <p>
                Book your next Goan retreat with Take On BnB and experience coastal luxury the way it was meant to be.
              </p>
              
              <div className="mt-16 pt-8 border-t border-border flex items-center gap-6 bg-muted/30 p-6 rounded-2xl">
                <Avatar className="w-16 h-16 border-2 border-background shadow-sm">
                  <AvatarImage src={post.author.avatar} alt={post.author.name} />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold text-xl">{post.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-bold text-foreground text-lg mb-1">Written by {post.author.name}</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">{post.author.bio}</p>
                </div>
              </div>
            </article>

            {/* SIDEBAR */}
            <aside className="lg:col-span-4 space-y-12">
              <div className="bg-card border border-border rounded-3xl p-8 shadow-soft sticky top-28">
                <h3 className="text-xl font-serif font-bold text-foreground mb-6">Subscribe to our newsletter</h3>
                <p className="text-muted-foreground text-sm mb-6">Get the latest travel guides and exclusive property deals delivered to your inbox.</p>
                <form className="space-y-3">
                  <Input type="email" placeholder="Email address" className="bg-input border-border focus-visible:ring-primary shadow-sm h-12 rounded-xl" required />
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 rounded-xl font-bold">Subscribe</Button>
                </form>
              </div>

              <div>
                <h3 className="text-xl font-serif font-bold text-foreground mb-6 pb-2 border-b border-border">Related Articles</h3>
                <div className="space-y-6">
                  {relatedPosts.map(relPost => (
                    <div key={relPost.id} className="group flex gap-4">
                      <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0">
                        <img src={relPost.image} alt={relPost.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground text-sm mb-2 group-hover:text-primary transition-colors line-clamp-2">
                          <Link to={`/blog/${relPost.id}`}>{relPost.title}</Link>
                        </h4>
                        <span className="text-xs text-muted-foreground font-medium">{relPost.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default BlogDetailPage;