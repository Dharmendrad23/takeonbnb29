import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Search, Calendar, User, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const categories = ["All", "Travel Guides", "Host Tips", "Industry News", "Company Updates"];

const blogPosts = [
  {
    id: 1,
    title: "10 Hidden Gems to Visit in Goa This Winter",
    excerpt: "Discover the untouched beaches and quiet cafes that most tourists miss when they travel to the sunshine state.",
    category: "Travel Guides",
    author: "Maya Chen",
    date: "Oct 24, 2025",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1974&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "How to Maximize Your Property Earnings",
    excerpt: "Expert advice on staging your home, pricing dynamically, and creating listings that capture immediate attention.",
    category: "Host Tips",
    author: "Raj Patel",
    date: "Oct 18, 2025",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1973&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "The Rise of Boutique Villas in India",
    excerpt: "Why travelers are ditching standard hotel rooms for curated, architecture-rich private villas across the country.",
    category: "Industry News",
    author: "Anika Bergström",
    date: "Oct 12, 2025",
    image: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 4,
    title: "TakeOn BnB Introduces Verified Stay Guarantee",
    excerpt: "Our new initiative ensures that what you see online is exactly what you get when you open the front door.",
    category: "Company Updates",
    author: "TakeOn Team",
    date: "Oct 05, 2025",
    image: "https://images.unsplash.com/photo-1556912173-3bb406ef7e77?q=80&w=2070&auto=format&fit=crop"
  }
];

const BlogPage = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = activeCategory === "All" || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Blog | TakeOn BnB</title>
        <meta name="description" content="Travel guides, host tips, and company news from TakeOn BnB." />
      </Helmet>

      <section className="bg-slate-950 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">TakeOn Journal</h1>
          <p className="text-xl text-slate-300 mb-10">Stories, guides, and tips for the modern traveler and host.</p>
          
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input 
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-14 pl-12 bg-slate-900 border-slate-800 text-white placeholder:text-slate-500 rounded-2xl text-lg focus-visible:ring-primary"
            />
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Categories */}
        <div className="flex overflow-x-auto pb-4 mb-10 gap-3 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-full whitespace-nowrap font-medium transition-all ${
                activeCategory === cat 
                ? 'bg-primary text-primary-foreground shadow-md' 
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Blog Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-10">
            {filteredPosts.map((post, i) => (
              <motion.article 
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group cursor-pointer flex flex-col h-full"
              >
                <div className="aspect-[16/9] rounded-3xl overflow-hidden mb-6 relative">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-background/95 backdrop-blur text-foreground px-3 py-1.5 rounded-lg text-sm font-bold">
                    {post.category}
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground font-medium mb-3">
                  <span className="flex items-center"><User className="w-4 h-4 mr-1.5" /> {post.author}</span>
                  <span className="flex items-center"><Calendar className="w-4 h-4 mr-1.5" /> {post.date}</span>
                </div>
                
                <h2 className="text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h2>
                
                <p className="text-muted-foreground leading-relaxed mb-6 flex-1">
                  {post.excerpt}
                </p>
                
                <div className="mt-auto">
                  <span className="inline-flex items-center text-primary font-bold">
                    Read Article <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-2xl font-bold text-foreground mb-2">No articles found</h3>
            <p className="text-muted-foreground">Try adjusting your search or category filter.</p>
            <Button variant="outline" onClick={() => { setSearchQuery(""); setActiveCategory("All"); }} className="mt-6">
              Clear Filters
            </Button>
          </div>
        )}
      </section>
    </div>
  );
};

export default BlogPage;