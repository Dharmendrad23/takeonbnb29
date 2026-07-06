import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Clock, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const jobs = [
  { id: 1, title: "Senior React Developer", department: "Engineering", location: "Remote", type: "Full-time" },
  { id: 2, title: "Property Quality Inspector", department: "Operations", location: "Gurugram, India", type: "Full-time" },
  { id: 3, title: "Customer Success Specialist", department: "Support", location: "Remote", type: "Contract" },
  { id: 4, title: "Product Designer", department: "Design", location: "Remote", type: "Full-time" },
];

const CareersPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', position: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 1500));
    setIsSubmitting(false);
    toast.success("Application submitted! Our team will review it shortly.");
    setFormData({ name: '', email: '', position: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Careers | TakeOn BnB</title>
        <meta name="description" content="Join the TakeOn BnB team and help us redefine travel and hospitality." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative py-24 bg-slate-950 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1640163561346-7778a2edf353?q=80&w=2070&auto=format&fit=crop" 
            alt="Collaborative diverse team working together" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6">
              Build the future of <span className="text-primary">hospitality.</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-10">
              We're a passionate team dedicated to making every stay remarkable. If you love solving complex problems and creating joyous experiences, you belong here.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Open Positions */}
          <div className="lg:col-span-7">
            <h2 className="text-3xl font-bold text-foreground mb-8 flex items-center">
              <Briefcase className="w-8 h-8 mr-3 text-primary" /> Open Positions
            </h2>
            
            <div className="space-y-4">
              {jobs.map((job) => (
                <div key={job.id} className="bg-card border border-border rounded-2xl p-6 hover:shadow-md transition-shadow group flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{job.title}</h3>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground font-medium">
                      <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" /> {job.location}</span>
                      <span className="flex items-center"><Clock className="w-4 h-4 mr-1" /> {job.type}</span>
                      <span className="px-2.5 py-1 rounded-md bg-secondary text-secondary-foreground text-xs">{job.department}</span>
                    </div>
                  </div>
                  <Button variant="outline" className="shrink-0 border-border group-hover:border-primary group-hover:text-primary transition-colors">
                    View Details <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Apply Form */}
          <div className="lg:col-span-5">
            <div className="bg-muted/30 rounded-3xl p-8 border border-border sticky top-24">
              <h2 className="text-2xl font-bold text-foreground mb-2">Don't see a fit?</h2>
              <p className="text-muted-foreground mb-8">Send us your details and we'll keep you in mind for future roles.</p>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    required 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="bg-background h-12"
                    placeholder="Jane Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    required 
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="bg-background h-12"
                    placeholder="jane@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">Area of Interest</Label>
                  <Input 
                    id="position" 
                    required 
                    value={formData.position}
                    onChange={e => setFormData({...formData, position: e.target.value})}
                    className="bg-background h-12"
                    placeholder="e.g. Marketing, Engineering"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Why TakeOn BnB?</Label>
                  <Textarea 
                    id="message" 
                    required 
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                    className="bg-background min-h-[120px]"
                    placeholder="Tell us a bit about yourself..."
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base rounded-xl"
                >
                  {isSubmitting ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Submitting...</> : "Submit Application"}
                </Button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CareersPage;