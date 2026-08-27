import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { toast } from 'sonner';
import { HostPropertyForm } from '@/components/HostPropertyForm.jsx';

const HostPropertyListingForm = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    toast.success(
      'Property submitted successfully!'
    );
    navigate('/host/dashboard');
  };

  return (
    <div className="w-full">
      <Helmet>
        <title>Add New Property | Take on BNB</title>
      </Helmet>

      <HostPropertyForm
        onSuccess={handleSuccess}
        onClose={() => navigate('/host/dashboard')}
      />
    </div>
  );
};

export default HostPropertyListingForm;
