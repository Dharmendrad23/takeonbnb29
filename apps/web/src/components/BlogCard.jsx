import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';

const BlogCard = ({ post, featured = false }) => {
  return (
    <Card className={`overflow-hidden border-border bg-card shadow-soft hover:shadow-luxury-hover transition-smooth group flex flex-col h-full ${featured ? 'md:flex-row' : ''}`}>
      <div className={`relative overflow-hidden ${featured ? 'md:w-1/2 shrink-0' : 'aspect-[16/10]'}`}>
        <img 
          src={post.image} 
          alt={post.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
        />
        <div className="absolute top-4 left-4 z-10">
          <Badge className="bg-primary/90 text-primary-foreground hover:bg-primary backdrop-blur-sm border-none shadow-sm">
            {post.category}
          </Badge>
        </div>
      </div>
      <CardContent className={`p-6 flex flex-col flex-1 ${featured ? 'md:p-8 md:justify-center' : ''}`}>
        <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">
          <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {post.date}</span>
        </div>
        <h3 className={`font-serif font-bold text-foreground mb-3 text-balance group-hover:text-primary transition-colors ${featured ? 'text-2xl md:text-3xl' : 'text-xl'}`}>
          <Link to={`/blog/${post.id}`} className="focus:outline-none">
            {post.title}
          </Link>
        </h3>
        <p className="text-muted-foreground leading-relaxed mb-6 flex-1">
          {post.excerpt}
        </p>
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
          <div className="flex items-center gap-3">
            <Avatar className="w-8 h-8 border border-border">
              <AvatarImage src={post.author.avatar} alt={post.author.name} />
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">{post.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-semibold text-foreground">{post.author.name}</span>
          </div>
          <Link 
            to={`/blog/${post.id}`} 
            className="text-sm font-bold text-primary flex items-center gap-1 hover:gap-2 transition-all"
          >
            Read More <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default BlogCard;