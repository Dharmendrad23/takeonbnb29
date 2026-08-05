import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext.jsx';
import PropertyForm from '@/components/property/PropertyForm.jsx';

const HostPropertyListingForm = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleSuccess = () => {
    toast.success('Property submitted for review! It will go live once approved by our team.');
    navigate('/host/dashboard');
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <Helmet><title>Add New Property | Take on BNB</title></Helmet>
      <PropertyForm
        hostId={currentUser?.id}
        defaultStatus="pending"
        submitLabel="Submit Property"
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default HostPropertyListingForm;
