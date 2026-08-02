import React from 'react';
import { CreditCard, Smartphone, Landmark, Wallet, ShieldCheck, Lock } from 'lucide-react';

const PaymentMethodsDisplay = () => {
  const methods = [
    { id: 'cards', name: 'Credit/Debit Cards', icon: CreditCard },
    { id: 'upi', name: 'UPI', icon: Smartphone },
    { id: 'netbanking', name: 'Net Banking', icon: Landmark },
    { id: 'wallets', name: 'Digital Wallets', icon: Wallet },
  ];

  return (
    <div className="flex flex-col space-y-4 w-full">
      <div className="flex flex-wrap gap-3">
        {methods.map((method) => {
          const Icon = method.icon;
          return (
            <div 
              key={method.id} 
              className="flex items-center justify-center bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-300 hover:text-primary hover:border-primary/50 transition-colors"
              title={method.name}
            >
              <Icon className="w-5 h-5" aria-hidden="true" />
              <span className="sr-only">{method.name}</span>
            </div>
          );
        })}
      </div>
      
      <div className="flex items-center gap-4 text-xs text-slate-400 font-medium">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-primary" />
          <span>SSL Secure</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Lock className="w-4 h-4 text-primary" />
          <span>PCI Compliant</span>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodsDisplay;