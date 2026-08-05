import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import api from '@/lib/api.js';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';

const RegisterPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', passwordConfirm: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if(formData.password !== formData.passwordConfirm) {
      setError("Passwords do not match"); return;
    }
    
    setIsLoading(true);
    try {
      await pb.collection('users').create({
        ...formData,
        userType: 'guest'
      }, { $autoCancel: false });
      
      toast.success("Account created! Please log in.");
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Failed to create account.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <Helmet><title>Sign Up | Take On BnB</title></Helmet>
      <div className="bg-card w-full max-w-md p-8 rounded-3xl shadow-hover border border-border">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Create Account</h1>
          <p className="text-muted-foreground mt-1">Join Take On BnB today</p>
        </div>

        {error && <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg mb-6">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="mt-1 bg-background" />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="mt-1 bg-background" />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required minLength={8} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="mt-1 bg-background" />
          </div>
          <div>
            <Label htmlFor="passwordConfirm">Confirm Password</Label>
            <Input id="passwordConfirm" type="password" required value={formData.passwordConfirm} onChange={e => setFormData({...formData, passwordConfirm: e.target.value})} className="mt-1 bg-background" />
          </div>
          <Button type="submit" className="w-full h-12 rounded-xl text-base mt-2" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Sign Up'}
          </Button>
        </form>

        <p className="text-center mt-8 text-sm text-muted-foreground">
          Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;