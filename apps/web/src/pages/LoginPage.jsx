// import React, { useState, useEffect } from 'react';
// import { useNavigate, useLocation, Link } from 'react-router-dom';
// import { Helmet } from 'react-helmet';
// import { useAuth } from '@/contexts/AuthContext.jsx';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { toast } from 'sonner';
// import {
//   Mail,
//   Lock,
//   Loader2,
//   ArrowLeft,
//   Eye,
//   EyeOff,
//   UserPlus,
// } from 'lucide-react';

// const LoginPage = () => {
//   const { login, isAuthenticated, isHost } = useAuth();

//   const navigate = useNavigate();
//   const location = useLocation();

//   const [loading, setLoading] = useState(false);

//   // Login steps
//   const [step, setStep] = useState(1);

//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const [showPassword, setShowPassword] = useState(false);

//   // Redirect already authenticated users
//   useEffect(() => {
//     if (isAuthenticated) {
//       navigate(
//         isHost ? '/host/dashboard' : '/guest/dashboard',
//         { replace: true }
//       );
//     }
//   }, [isAuthenticated, isHost, navigate]);

//   const handleContinue = (e) => {
//     e.preventDefault();

//     const cleanEmail = email.trim().toLowerCase();

//     if (!cleanEmail) {
//       toast.error('Please enter your email address');
//       return;
//     }

//     // Basic email validation
//     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
//       toast.error('Please enter a valid email address');
//       return;
//     }

//     setEmail(cleanEmail);
//     setStep(2);
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     if (!email || !password) {
//       toast.error('Please enter your password');
//       return;
//     }

//     setLoading(true);

//     try {
//       const authData = await login(email, password);

//       const user = authData.record;

//       toast.success('Logged in successfully');

//       const destination =
//         location.state?.from?.pathname ||
//         (user.role === 'host'
//           ? '/host/dashboard'
//           : '/guest/dashboard');

//       navigate(destination, { replace: true });
//     } catch (err) {
//       console.error('Login error:', err);

//       toast.error(
//         err?.message || 'Invalid email or password'
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleGoogleLogin = () => {
//     toast.info('Google login is coming soon.');
//   };

//   const handleAppleLogin = () => {
//     toast.info('Apple login is coming soon.');
//   };

//   return (
//     <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">

//       <Helmet>
//         <title>Log in or Sign up | Take On BnB</title>
//         <meta
//           name="description"
//           content="Log in or create your Take On BnB account to book your next stay."
//         />
//       </Helmet>

//       <div className="w-full max-w-[520px]">

//         {/* Main Login Card */}
//         <div className="bg-card border border-border rounded-[28px] shadow-xl overflow-hidden">

//           {/* Header */}
//           <div className="px-6 sm:px-10 pt-10 pb-7 text-center">

//             {/* Logo */}
//             <div className="flex justify-center mb-7">
//               <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
//                 <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
//                   <span className="text-white text-2xl font-extrabold">
//                     T
//                   </span>
//                 </div>
//               </div>
//             </div>

//             <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
//               Log in or sign up
//             </h1>

//             <p className="text-muted-foreground mt-3">
//               Welcome to Take On BnB
//             </p>

//           </div>

//           {/* Content */}
//           <div className="px-6 sm:px-10 pb-10">

//             {/* STEP 1 - EMAIL */}
//             {step === 1 && (
//               <form
//                 onSubmit={handleContinue}
//                 className="space-y-5"
//               >

//                 <div className="space-y-2">

//                   <label className="text-sm font-semibold text-foreground">
//                     Email address
//                   </label>

//                   <div className="relative">

//                     <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />

//                     <Input
//                       type="email"
//                       value={email}
//                       onChange={(e) =>
//                         setEmail(e.target.value)
//                       }
//                       placeholder="Enter your email"
//                       autoComplete="email"
//                       className="
//                         h-14
//                         pl-12
//                         pr-4
//                         rounded-xl
//                         text-base
//                         border-border
//                         focus-visible:ring-primary
//                       "
//                       autoFocus
//                       required
//                     />

//                   </div>

//                 </div>

//                 <Button
//                   type="submit"
//                   className="
//                     w-full
//                     h-14
//                     rounded-xl
//                     text-base
//                     font-bold
//                     bg-primary
//                     hover:bg-primary/90
//                   "
//                   disabled={!email.trim()}
//                 >
//                   Continue
//                 </Button>

//               </form>
//             )}

//             {/* STEP 2 - PASSWORD */}
//             {step === 2 && (
//               <form
//                 onSubmit={handleLogin}
//                 className="space-y-5"
//               >

//                 {/* Email Preview */}
//                 <div className="rounded-xl bg-muted/50 border border-border p-4">

//                   <div className="flex items-center justify-between gap-3">

//                     <div className="min-w-0">

//                       <p className="text-xs text-muted-foreground mb-1">
//                         Email
//                       </p>

//                       <p className="font-semibold text-foreground truncate">
//                         {email}
//                       </p>

//                     </div>

//                     <button
//                       type="button"
//                       onClick={() => {
//                         setPassword('');
//                         setStep(1);
//                       }}
//                       className="text-sm font-semibold text-primary hover:underline shrink-0"
//                     >
//                       Change
//                     </button>

//                   </div>

//                 </div>

//                 {/* Password */}
//                 <div className="space-y-2">

//                   <label className="text-sm font-semibold text-foreground">
//                     Password
//                   </label>

//                   <div className="relative">

//                     <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />

//                     <Input
//                       type={showPassword ? 'text' : 'password'}
//                       value={password}
//                       onChange={(e) =>
//                         setPassword(e.target.value)
//                       }
//                       placeholder="Enter your password"
//                       autoComplete="current-password"
//                       className="
//                         h-14
//                         pl-12
//                         pr-12
//                         rounded-xl
//                         text-base
//                         border-border
//                         focus-visible:ring-primary
//                       "
//                       autoFocus
//                       required
//                     />

//                     <button
//                       type="button"
//                       onClick={() =>
//                         setShowPassword(!showPassword)
//                       }
//                       className="
//                         absolute
//                         right-4
//                         top-1/2
//                         -translate-y-1/2
//                         text-muted-foreground
//                         hover:text-foreground
//                       "
//                       aria-label={
//                         showPassword
//                           ? 'Hide password'
//                           : 'Show password'
//                       }
//                     >
//                       {showPassword ? (
//                         <EyeOff className="w-5 h-5" />
//                       ) : (
//                         <Eye className="w-5 h-5" />
//                       )}
//                     </button>

//                   </div>

//                 </div>

//                 <Button
//                   type="submit"
//                   className="
//                     w-full
//                     h-14
//                     rounded-xl
//                     text-base
//                     font-bold
//                     bg-primary
//                     hover:bg-primary/90
//                   "
//                   disabled={loading || !password}
//                 >
//                   {loading ? (
//                     <>
//                       <Loader2 className="w-5 h-5 mr-2 animate-spin" />
//                       Logging in...
//                     </>
//                   ) : (
//                     'Log In'
//                   )}
//                 </Button>

//               </form>
//             )}

//             {/* Divider */}
//             <div className="flex items-center gap-4 my-7">

//               <div className="h-px bg-border flex-1" />

//               <span className="text-sm text-muted-foreground">
//                 or
//               </span>

//               <div className="h-px bg-border flex-1" />

//             </div>

//             {/* Social Login UI */}
//             <div className="grid grid-cols-2 gap-3">

//               <button
//                 type="button"
//                 onClick={handleGoogleLogin}
//                 className="
//                   h-14
//                   rounded-xl
//                   border
//                   border-border
//                   bg-background
//                   hover:bg-muted
//                   transition
//                   flex
//                   items-center
//                   justify-center
//                   gap-3
//                   font-semibold
//                 "
//               >
//                 <span className="text-xl font-bold">
//                   G
//                 </span>

//                 <span className="hidden sm:inline">
//                   Google
//                 </span>
//               </button>

//               <button
//                 type="button"
//                 onClick={handleAppleLogin}
//                 className="
//                   h-14
//                   rounded-xl
//                   border
//                   border-border
//                   bg-background
//                   hover:bg-muted
//                   transition
//                   flex
//                   items-center
//                   justify-center
//                   gap-3
//                   font-semibold
//                 "
//               >
//                 <span className="text-xl">
//                   
//                 </span>

//                 <span className="hidden sm:inline">
//                   Apple
//                 </span>
//               </button>

//             </div>

//             {/* Guest Registration */}
//             <div className="mt-8 text-center">

//               <p className="text-sm text-muted-foreground">
//                 Don't have an account?
//               </p>

//               <Link
//                 to="/signup"
//                 className="
//                   mt-2
//                   inline-flex
//                   items-center
//                   justify-center
//                   gap-2
//                   text-primary
//                   font-bold
//                   hover:underline
//                 "
//               >
//                 <UserPlus className="w-4 h-4" />
//                 Sign up as Guest
//               </Link>

//             </div>

//             {/* Host Login */}
//             <div className="mt-6 pt-6 border-t border-border text-center">

//               <p className="text-sm text-muted-foreground">
//                 Want to list your property?
//               </p>

//               <Link
//                 to="/host/login"
//                 className="inline-block mt-1 text-sm text-primary hover:underline font-bold"
//               >
//                 Become a Host
//               </Link>

//             </div>

//           </div>

//         </div>
//       </div>

//     </div>
//   );
// };

// export default LoginPage;


























// import React, { useEffect, useRef, useState } from "react";
// // import { Link } from "react-router-dom";
// import { useNavigate } from "react-router-dom";

// export default function LoginPage() {
//   const [showLogin, setShowLogin] = useState(true);
//   const [method, setMethod] = useState("email");
//   const [step, setStep] = useState("login");

//   const [value, setValue] = useState("");
//   const [otp, setOtp] = useState(["", "", "", "", "", ""]);
//   const [error, setError] = useState("");
//   const [seconds, setSeconds] = useState(30);
//   const navigate = useNavigate();

//   const otpRefs = useRef([]);

//   const isEmail = method === "email";

//   /* =====================================================
//      TEMPORARY DEHRADUN PROPERTIES
//      3 ROWS × 7 PROPERTIES = 21
//   ===================================================== */

//   const properties = [
//     {
//       name: "Luxury Valley Villa",
//       location: "Rajpur Road, Dehradun",
//       type: "Villa",
//       guests: "6 Guests",
//       price: "₹4,999/night",
//       image:
//         "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=80",
//     },
//     {
//       name: "The Forest Retreat",
//       location: "Sahastradhara Road, Dehradun",
//       type: "Resort",
//       guests: "4 Guests",
//       price: "₹3,499/night",
//       image:
//         "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=900&q=80",
//     },
//     {
//       name: "Green View Apartment",
//       location: "Canal Road, Dehradun",
//       type: "2 BHK",
//       guests: "4 Guests",
//       price: "₹2,499/night",
//       image:
//         "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=900&q=80",
//     },
//     {
//       name: "Mountain Mist Villa",
//       location: "Jakhan, Dehradun",
//       type: "Villa",
//       guests: "8 Guests",
//       price: "₹5,999/night",
//       image:
//         "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80",
//     },
//     {
//       name: "Urban Nest Stay",
//       location: "GMS Road, Dehradun",
//       type: "1 BHK",
//       guests: "2 Guests",
//       price: "₹1,899/night",
//       image:
//         "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=80",
//     },
//     {
//       name: "Hillside Haven",
//       location: "Maldevta, Dehradun",
//       type: "Villa",
//       guests: "6 Guests",
//       price: "₹4,499/night",
//       image:
//         "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=900&q=80",
//     },
//     {
//       name: "Royal Garden Stay",
//       location: "Rajpur Road, Dehradun",
//       type: "3 BHK",
//       guests: "6 Guests",
//       price: "₹3,999/night",
//       image:
//         "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80",
//     },

//     {
//       name: "Pine Valley Resort",
//       location: "Sinola, Dehradun",
//       type: "Resort",
//       guests: "4 Guests",
//       price: "₹3,799/night",
//       image:
//         "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=900&q=80",
//     },
//     {
//       name: "The Dehradun House",
//       location: "Jakhan, Dehradun",
//       type: "2 BHK",
//       guests: "4 Guests",
//       price: "₹2,799/night",
//       image:
//         "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=80",
//     },
//     {
//       name: "Valley Breeze Villa",
//       location: "Bhagwant Pur, Dehradun",
//       type: "Villa",
//       guests: "8 Guests",
//       price: "₹5,499/night",
//       image:
//         "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=900&q=80",
//     },
//     {
//       name: "Cozy Corner BnB",
//       location: "GMS Road, Dehradun",
//       type: "1 BHK",
//       guests: "2 Guests",
//       price: "₹1,699/night",
//       image:
//         "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=80",
//     },
//     {
//       name: "Sunset Valley Home",
//       location: "Canal Road, Dehradun",
//       type: "3 BHK",
//       guests: "6 Guests",
//       price: "₹3,299/night",
//       image:
//         "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=80",
//     },
//     {
//       name: "Oakwood Retreat",
//       location: "Kimadi, Dehradun",
//       type: "Villa",
//       guests: "6 Guests",
//       price: "₹4,799/night",
//       image:
//         "https://images.unsplash.com/photo-1600585152915-d208bec867a1?auto=format&fit=crop&w=900&q=80",
//     },
//     {
//       name: "The Orange Nest",
//       location: "Sahastradhara Road, Dehradun",
//       type: "2 BHK",
//       guests: "4 Guests",
//       price: "₹2,599/night",
//       image:
//         "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=900&q=80",
//     },

//     {
//       name: "Himalayan Pearl Villa",
//       location: "Maldevta, Dehradun",
//       type: "Villa",
//       guests: "8 Guests",
//       price: "₹6,499/night",
//       image:
//         "https://images.unsplash.com/photo-1600047509782-20d39509f26d?auto=format&fit=crop&w=900&q=80",
//     },
//     {
//       name: "Valley View BnB",
//       location: "Thano, Dehradun",
//       type: "1 BHK",
//       guests: "2 Guests",
//       price: "₹1,799/night",
//       image:
//         "https://images.unsplash.com/photo-1600566753051-f0b89df2dd90?auto=format&fit=crop&w=900&q=80",
//     },
//     {
//       name: "Mountain Pearl Resort",
//       location: "Bhagwant Pur, Dehradun",
//       type: "Resort",
//       guests: "6 Guests",
//       price: "₹4,299/night",
//       image:
//         "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80",
//     },
//     {
//       name: "Modern Hills Apartment",
//       location: "Canal Road, Dehradun",
//       type: "2 BHK",
//       guests: "4 Guests",
//       price: "₹2,299/night",
//       image:
//         "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=900&q=80",
//     },
//     {
//       name: "Luxury Pine House",
//       location: "Kimadi, Dehradun",
//       type: "3 BHK",
//       guests: "6 Guests",
//       price: "₹3,899/night",
//       image:
//         "https://images.unsplash.com/photo-1600585154363-67c6f8f3f3a8?auto=format&fit=crop&w=900&q=80",
//     },
//     {
//       name: "Garden Escape Villa",
//       location: "Sinola, Dehradun",
//       type: "Villa",
//       guests: "6 Guests",
//       price: "₹4,699/night",
//       image:
//         "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=900&q=80",
//     },
//     {
//       name: "City Comfort Stay",
//       location: "GMS Road, Dehradun",
//       type: "1 BHK",
//       guests: "2 Guests",
//       price: "₹1,599/night",
//       image:
//         "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=80",
//     },
//   ];


 

//   useEffect(() => {
//     if (step !== "otp" || seconds <= 0) return;

//     const timer = setInterval(() => {
//       setSeconds((s) => s - 1);
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [step, seconds]);

//   /* ================= ICONS ================= */

//   const CloseIcon = () => (
//     <svg viewBox="0 0 24 24">
//       <path d="M6 6L18 18M18 6L6 18" />
//     </svg>
//   );

//   const MailIcon = () => (
//     <svg viewBox="0 0 24 24">
//       <rect x="3" y="5" width="18" height="14" rx="3" />
//       <path d="M4 7l8 6 8-6" />
//     </svg>
//   );

//   const PhoneIcon = () => (
//     <svg viewBox="0 0 24 24">
//       <path d="M7.5 3.8l2.2-.5c.8-.2 1.5.3 1.7 1l.9 2.8c.2.6 0 1.2-.5 1.6l-1.5 1.3c1 1.9 2.5 3.4 4.4 4.4l1.3-1.5c.4-.5 1-.7 1.6-.5l2.8.9c.7.2 1.1 1 .9 1.7l-.5 2.2c-.2 1-1.1 1.7-2.1 1.7C11.3 18.8 5.2 12.7 4.4 5.9c-.1-1 .6-1.9 1.6-2.1l1.5-.3Z" />
//     </svg>
//   );

//   const ArrowIcon = () => (
//     <svg viewBox="0 0 24 24">
//       <path d="M5 12h13M13 6l6 6-6 6" />
//     </svg>
//   );

//   const CheckIcon = () => (
//     <svg viewBox="0 0 24 24">
//       <path d="M5 12.5l4.2 4.2L19 7" />
//     </svg>
//   );

//   const GoogleIcon = () => (
//     <svg viewBox="0 0 24 24">
//       <path
//         fill="#4285F4"
//         d="M21.35 12.23c0-.7-.06-1.37-.18-2H12v3.79h5.22a4.46 4.46 0 0 1-1.94 2.92v2.43h3.14c1.84-1.69 2.93-4.18 2.93-7.14Z"
//       />
//       <path
//         fill="#34A853"
//         d="M12 21.6c2.63 0 4.84-.87 6.45-2.36l-3.14-2.43c-.87.58-1.98.92-3.31.92-2.54 0-4.7-1.72-5.47-4.03H3.28v2.5A9.74 9.74 0 0 0 12 21.6Z"
//       />
//       <path
//         fill="#FBBC05"
//         d="M6.53 13.7A5.85 5.85 0 0 1 6.22 12c0-.59.11-1.16.31-1.7V7.8H3.28A9.6 9.6 0 0 0 2.25 12c0 1.52.36 2.95 1.03 4.2l3.25-2.5Z"
//       />
//       <path
//         fill="#EA4335"
//         d="M12 6.27c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.84 3.37 14.63 2.4 12 2.4a9.74 9.74 0 0 0-8.72 5.4l3.25 2.5c.77-2.31 2.93-4.03 5.47-4.03Z"
//       />
//     </svg>
//   );

//   const AppleIcon = () => (
//     <svg viewBox="0 0 24 24">
//       <path
//         fill="currentColor"
//         d="M16.77 12.62c.02 2.05 1.8 2.73 1.82 2.74-.02.05-.28.97-.94 1.92-.56.81-1.14 1.62-2.06 1.64-.9.02-1.2-.53-2.24-.53-1.05 0-1.38.51-2.23.55-.9.03-1.58-.88-2.15-1.69-1.17-1.7-2.06-4.8-.86-6.89.6-1.04 1.58-1.69 2.65-1.71.84-.02 1.63.57 2.24.57.61 0 1.75-.7 2.94-.6.5.02 1.91.2 2.81 1.53-.07.04-1.68.98-1.66 2.47ZM14.83 7.39c.54-.65.9-1.56.8-2.46-.78.03-1.72.52-2.28 1.17-.5.57-.93 1.49-.81 2.37.87.07 1.75-.44 2.29-1.08Z"
//       />
//     </svg>
//   );

//   /* ================= LOGIN ================= */

//   const continueLogin = (e) => {
//     e.preventDefault();
//     setError("");

//     if (isEmail) {
//       if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
//         setError("Please enter a valid email address.");
//         return;
//       }
//     } else {
//       if (!/^[+]?[0-9\s()-]{8,18}$/.test(value)) {
//         setError("Please enter a valid phone number.");
//         return;
//       }
//     }

//     setOtp(["", "", "", "", "", ""]);
//     setSeconds(30);
//     setStep("otp");

//     setTimeout(() => {
//       otpRefs.current[0]?.focus();
//     }, 150);
//   };

//   /* ================= OTP ================= */

//   const changeOTP = (index, text) => {
//     const digit = text.replace(/\D/g, "").slice(-1);

//     const next = [...otp];
//     next[index] = digit;

//     setOtp(next);
//     setError("");

//     if (digit && index < 5) {
//       otpRefs.current[index + 1]?.focus();
//     }
//   };

//   const otpKeyDown = (index, e) => {
//     if (e.key === "Backspace" && !otp[index] && index > 0) {
//       otpRefs.current[index - 1]?.focus();
//     }
//   };

//   const verifyOTP = (e) => {
//     e.preventDefault();

//     const code = otp.join("");

//     if (code.length !== 6) {
//       setError("Please enter the 6-digit code.");
//       return;
//     }

//     if (code !== "123456") {
//       setError("For preview, enter 123456.");
//       return;
//     }

//     setStep("done");
//   };

//   const resendOTP = () => {
//     if (seconds > 0) return;

//     setOtp(["", "", "", "", "", ""]);
//     setError("");
//     setSeconds(30);

//     setTimeout(() => {
//       otpRefs.current[0]?.focus();
//     }, 100);
//   };

//   const changeMethod = (newMethod) => {
//     setMethod(newMethod);
//     setValue("");
//     setError("");
//     setStep("login");
//   };

//   return (
//     <>
//       <style>{`

//         * {
//           box-sizing: border-box;
//         }

//         html,
//         body,
//         #root {
//           margin: 0;
//           min-height: 100%;
//         }

//         body {
//           font-family:
//             Inter,
//             ui-sans-serif,
//             system-ui,
//             -apple-system,
//             BlinkMacSystemFont,
//             "Segoe UI",
//             sans-serif;

//           color: #1f1f1f;
//           background: #f6f3ef;
//         }

//         button,
//         input {
//           font-family: inherit;
//         }

//         button {
//           cursor: pointer;
//         }

//         /* =====================================================
//            LOGIN PAGE BACKGROUND
//         ===================================================== */

//         .loginPage {
//           min-height: 100vh;
//           width: 100%;

//           position: relative;
//           overflow: hidden;

//           display: flex;
//           align-items: center;
//           justify-content: center;

//           padding: 20px;

//           background: #eee9e3;
//         }

//         /* =====================================================
//            PROPERTY BACKGROUND
//         ===================================================== */

//         .propertyBackground {
//           position: absolute;
//           inset: 0;

//           width: 100%;
//           height: 100%;

//           overflow: hidden;

//           display: flex;
//           flex-direction: column;
//           justify-content: center;

//           gap: 18px;

//           padding: 20px 0;

//           background:
//             linear-gradient(
//               rgba(246,243,239,.24),
//               rgba(246,243,239,.24)
//             );

//           z-index: 1;
//         }

//         .propertyRow {
//           display: flex;

//           width: max-content;

//           gap: 16px;

//           animation:
//             propertyMove 42s linear infinite;
//         }

//         .propertyRow:nth-child(2) {
//           animation-duration: 48s;
//           animation-direction: reverse;
//         }

//         .propertyRow:nth-child(3) {
//           animation-duration: 44s;
//         }

//         @keyframes propertyMove {
//           from {
//             transform: translateX(0);
//           }

//           to {
//             transform: translateX(-50%);
//           }
//         }

//         .propertyCard {
//           width: 245px;
//           min-width: 245px;

//           height: 155px;

//           position: relative;

//           overflow: hidden;

//           border-radius: 18px;

//           background: #fff;

//           box-shadow:
//             0 8px 25px
//             rgba(0,0,0,.12);

//           border:
//             1px solid
//             rgba(255,255,255,.8);
//         }

//         .propertyCard img {
//           width: 100%;
//           height: 100%;

//           object-fit: cover;

//           display: block;
//         }

//         .propertyCard::after {
//           content: "";

//           position: absolute;

//           inset: 0;

//           background:
//             linear-gradient(
//               to top,
//               rgba(0,0,0,.78),
//               rgba(0,0,0,.04) 70%
//             );
//         }

//         .propertyDetails {
//           position: absolute;

//           left: 13px;
//           right: 13px;
//           bottom: 11px;

//           z-index: 2;

//           color: #fff;
//         }

//         .propertyDetails h3 {
//           margin: 0 0 3px;

//           font-size: 13px;

//           font-weight: 750;

//           white-space: nowrap;
//           overflow: hidden;
//           text-overflow: ellipsis;
//         }

//         .propertyLocation {
//           margin: 0 0 5px;

//           font-size: 10px;

//           opacity: .88;

//           white-space: nowrap;
//           overflow: hidden;
//           text-overflow: ellipsis;
//         }

//         .propertyMeta {
//           display: flex;

//           align-items: center;

//           justify-content: space-between;

//           gap: 8px;

//           font-size: 9px;

//           opacity: .95;
//         }

//         .propertyPrice {
//           font-weight: 800;
//         }

//         /* =====================================================
//            BACKGROUND DARK OVERLAY
//         ===================================================== */

//         .backgroundShade {
//           position: absolute;

//           inset: 0;

//           z-index: 2;

//           background:
//             rgba(25,21,18,.28);

//           backdrop-filter:
//             blur(1.5px);
//         }

//         /* =====================================================
//            OVERLAY
//         ===================================================== */

//         .overlay {
//           position: fixed;

//           inset: 0;

//           z-index: 1000;

//           display: flex;

//           align-items: center;
//           justify-content: center;

//           padding: 20px;

//           background:
//             rgba(18,16,15,.50);

//           backdrop-filter:
//             blur(8px);
//         }

//         /* =====================================================
//            PREMIUM MODAL
//         ===================================================== */

//         .modal {
//           width: 100%;
//           max-width: 445px;

//           position: relative;

//           overflow: hidden;

//           border-radius: 27px;

//           padding:
//             31px
//             30px
//             22px;

//           background:
//             linear-gradient(
//               145deg,
//               rgba(255,255,255,.99),
//               rgba(251,249,246,.99)
//             );

//           border:
//             1px solid
//             rgba(255,255,255,.85);

//           box-shadow:
//             0 45px 110px
//             rgba(0,0,0,.30),
//             0 12px 35px
//             rgba(0,0,0,.10);

//           animation:
//             modalIn .25s cubic-bezier(.2,.8,.2,1);
//         }

//         .modal::before {
//           content: "";

//           position: absolute;

//           left: 0;
//           right: 0;
//           top: 0;

//           height: 3px;

//           background:
//             linear-gradient(
//               90deg,
//               #ff9f43,
//               #f97316,
//               #ffb15c
//             );
//         }

//         @keyframes modalIn {
//           from {
//             opacity: 0;

//             transform:
//               translateY(12px)
//               scale(.975);
//           }

//           to {
//             opacity: 1;

//             transform:
//               translateY(0)
//               scale(1);
//           }
//         }

//         /* =====================================================
//            CLOSE
//         ===================================================== */

//         .close {
//           position: absolute;

//           top: 17px;
//           left: 17px;

//           width: 33px;
//           height: 33px;

//           border-radius: 50%;

//           border:
//             1px solid
//             #e4dfd9;

//           background:
//             rgba(255,255,255,.85);

//           display: grid;
//           place-items: center;

//           z-index: 5;

//           transition: .18s;
//         }

//         .close:hover {
//           transform: rotate(5deg);

//           background: #f7f4f0;

//           border-color: #d3cdc6;
//         }

//         .close svg {
//           width: 16px;

//           fill: none;

//           stroke: #333;

//           stroke-width: 1.7;
//         }

//         /* =====================================================
//            HEADER
//         ===================================================== */

//         .loginHeader {
//           text-align: center;

//           padding:
//             8px 20px 23px;
//         }

//         .miniLogo {
//           width: 45px;
//           height: 45px;

//           margin:
//             0 auto 15px;

//           border-radius: 15px;

//           display: grid;
//           place-items: center;

//           color: #f97316;

//           background:
//             linear-gradient(
//               145deg,
//               #fff7ed,
//               #ffedd5
//             );

//           box-shadow:
//             0 8px 20px
//             rgba(249,115,22,.09),
//             inset 0 0 0 1px
//             rgba(249,115,22,.05);

//           animation:
//             loginIconMove 2.4s ease-in-out infinite;
//         }

//         @keyframes loginIconMove {
//           0% {
//             transform:
//               translateX(-7px)
//               scale(.92)
//               rotate(-5deg);

//             opacity: .65;
//           }

//           25% {
//             transform:
//               translateX(0)
//               scale(1.08)
//               rotate(0deg);

//             opacity: 1;
//           }

//           50% {
//             transform:
//               translateX(0)
//               scale(1)
//               rotate(0deg);

//             opacity: 1;
//           }

//           75% {
//             transform:
//               translateX(7px)
//               scale(1.08)
//               rotate(5deg);

//             opacity: 1;
//           }

//           100% {
//             transform:
//               translateX(-7px)
//               scale(.92)
//               rotate(-5deg);

//             opacity: .65;
//           }
//         }

//         .miniLogo svg {
//           width: 20px;

//           fill: none;

//           stroke: currentColor;

//           stroke-width: 1.6;

//           animation:
//             iconPulse 2.4s ease-in-out infinite;
//         }

//         @keyframes iconPulse {
//           0% {
//             transform: scale(.88);
//           }

//           25% {
//             transform: scale(1.08);
//           }

//           50% {
//             transform: scale(1);
//           }

//           75% {
//             transform: scale(1.08);
//           }

//           100% {
//             transform: scale(.88);
//           }
//         }

//         .loginHeader h2 {
//           margin: 0;

//           color: #202020;

//           font-family: Georgia, serif;

//           font-size: 27px;

//           font-weight: 500;

//           letter-spacing: -.7px;

//           display: inline-block;

//           animation:
//             loginTitleFloat 2.8s ease-in-out infinite;
//         }

//         @keyframes loginTitleFloat {
//           0% {
//             opacity: .72;
//             transform: translateX(-18px);
//             letter-spacing: -1.5px;
//           }

//           25% {
//             opacity: 1;
//             transform: translateX(0);
//             letter-spacing: -.7px;
//           }

//           55% {
//             opacity: 1;
//             transform: translateX(0);
//             letter-spacing: -.7px;
//           }

//           80% {
//             opacity: .95;
//             transform: translateX(14px);
//             letter-spacing: -.2px;
//           }

//           100% {
//             opacity: .72;
//             transform: translateX(-18px);
//             letter-spacing: -1.5px;
//           }
//         }

//         .loginHeader p {
//           margin:
//             9px 0 0;

//           font-size: 13px;

//           line-height: 1.55;

//           position: relative;

//           display: inline-block;

//           background:
//             linear-gradient(
//               110deg,
//               #77716c 0%,
//               #77716c 36%,
//               #f97316 46%,
//               #ffb15c 50%,
//               #f97316 54%,
//               #77716c 64%,
//               #77716c 100%
//             );

//           background-size: 300% 100%;

//           background-position: 120% 0;

//           -webkit-background-clip: text;
//           background-clip: text;

//           -webkit-text-fill-color: transparent;

//           animation:
//             welcomeShine 2.8s linear infinite;
//         }

//         @keyframes welcomeShine {
//           0% {
//             background-position: 120% 0;
//           }

//           100% {
//             background-position: -120% 0;
//           }
//         }

//         /* =====================================================
//            TABS
//         ===================================================== */

//         .tabs {
//           display: flex;

//           border-bottom:
//             1px solid
//             #e2ddd7;

//           margin-bottom: 20px;
//         }

//         .tabs button {
//           position: relative;

//           flex: 1;

//           border: 0;

//           background: transparent;

//           padding:
//             12px 5px;

//           color: #8b8580;

//           font-size: 13px;

//           font-weight: 700;
//         }

//         .tabs button.active {
//           color: #272522;
//         }

//         .tabs button.active::after {
//           content: "";

//           position: absolute;

//           left: 18%;
//           right: 18%;
//           bottom: -1px;

//           height: 2px;

//           border-radius: 99px;

//           background:
//             linear-gradient(
//               90deg,
//               #ff9f43,
//               #f97316
//             );
//         }

//         /* =====================================================
//            INPUT
//         ===================================================== */

//         .label {
//           display: block;

//           margin-bottom: 7px;

//           color: #373330;

//           font-size: 12px;

//           font-weight: 750;
//         }

//         .input {
//           height: 55px;

//           display: flex;
//           align-items: center;

//           padding: 0 14px;

//           border-radius: 12px;

//           background: #fff;

//           border:
//             1px solid
//             #cec8c2;

//           box-shadow:
//             0 2px 7px
//             rgba(0,0,0,.025);

//           transition: .18s;
//         }

//         .input:focus-within {
//           border-color: #f97316;

//           box-shadow:
//             0 0 0 3px
//             rgba(249,115,22,.075),
//             0 5px 15px
//             rgba(0,0,0,.035);
//         }

//         .input svg {
//           width: 18px;

//           margin-right: 10px;

//           fill: none;

//           stroke: #77716d;

//           stroke-width: 1.7;
//         }

//         .input input {
//           flex: 1;

//           min-width: 0;

//           height: 100%;

//           border: 0;

//           outline: 0;

//           background: transparent;

//           color: #222;

//           font-size: 14px;
//         }

//         .input input::placeholder {
//           color: #aaa39d;
//         }

//         .terms {
//           margin:
//             9px 1px 15px;

//           color: #88817c;

//           font-size: 10.5px;

//           line-height: 1.5;
//         }

//         .terms a {
//           color: #4c4844;

//           font-weight: 650;
//         }

//         /* =====================================================
//            ERROR
//         ===================================================== */

//         .error {
//           margin-bottom: 12px;

//           padding: 9px 10px;

//           border-radius: 9px;

//           border:
//             1px solid
//             #f0d5da;

//           background: #fff2f4;

//           color: #a63c51;

//           font-size: 11px;
//         }

//         /* =====================================================
//            MAIN BUTTON
//         ===================================================== */

//         .continue {
//           width: 100%;

//           height: 51px;

//           display: flex;
//           align-items: center;
//           justify-content: center;

//           gap: 9px;

//           border: 0;

//           border-radius: 12px;

//           color: white;

//           background:
//             linear-gradient(
//               135deg,
//               #ff9f43 0%,
//               #f97316 100%
//             );

//           font-size: 14px;

//           font-weight: 750;

//           box-shadow:
//             0 10px 25px
//             rgba(249,115,22,.19);

//           transition:
//             transform .18s,
//             box-shadow .18s;
//         }

//         .continue:hover {
//           transform: translateY(-1px);

//           box-shadow:
//             0 13px 29px
//             rgba(249,115,22,.25);
//         }

//         .continue:active {
//           transform: translateY(0);
//         }

//         .continue svg {
//           width: 17px;

//           fill: none;

//           stroke: currentColor;

//           stroke-width: 1.8;
//         }

//         /* =====================================================
//            DIVIDER
//         ===================================================== */

//         .divider {
//           display: flex;
//           align-items: center;

//           gap: 12px;

//           margin:
//             19px 0 15px;

//           color: #aaa29b;

//           font-size: 11px;
//         }

//         .divider::before,
//         .divider::after {
//           content: "";

//           flex: 1;

//           height: 1px;

//           background:
//             linear-gradient(
//               90deg,
//               transparent,
//               #dfd9d3
//             );
//         }

//         .divider::after {
//           background:
//             linear-gradient(
//               90deg,
//               #dfd9d3,
//               transparent
//             );
//         }

//         /* =====================================================
//            SOCIAL ICONS
//         ===================================================== */

//         .socialIcons {
//           display: flex;

//           justify-content: center;

//           gap: 18px;
//         }

//         .socialIcon {
//           width: 45px;
//           height: 45px;

//           display: grid;
//           place-items: center;

//           border-radius: 50%;

//           border:
//             1px solid
//             #ddd7d1;

//           background: #fff;

//           color: #222;

//           box-shadow:
//             0 4px 12px
//             rgba(0,0,0,.035);

//           transition: .18s;
//         }

//         .socialIcon:hover {
//           transform:
//             translateY(-2px);

//           background: #faf8f5;

//           border-color:
//             #c9c2bb;

//           box-shadow:
//             0 8px 18px
//             rgba(0,0,0,.07);
//         }

//         .socialIcon svg {
//           width: 19px;
//           height: 19px;
//         }

//         /* =====================================================
//            OTP
//         ===================================================== */

//         .otpScreen {
//           text-align: center;

//           padding:
//             11px 4px 5px;
//         }

//         .otpLogo {
//           width: 48px;
//           height: 48px;

//           margin:
//             0 auto 16px;

//           display: grid;
//           place-items: center;

//           border-radius: 15px;

//           color: #34794d;

//           background:
//             linear-gradient(
//               145deg,
//               #eff9f2,
//               #e2f1e7
//             );

//           box-shadow:
//             0 8px 20px
//             rgba(52,121,77,.08);
//         }

//         .otpLogo svg {
//           width: 22px;

//           fill: none;

//           stroke: currentColor;

//           stroke-width: 2;
//         }

//         .otpScreen h2 {
//           margin: 0;

//           color: #202020;

//           font-family: Georgia, serif;

//           font-size: 27px;

//           font-weight: 500;

//           letter-spacing: -.5px;
//         }

//         .otpScreen p {
//           margin:
//             9px 0 21px;

//           color: #77716c;

//           font-size: 13px;

//           line-height: 1.55;
//         }

//         .otpScreen strong {
//           color: #282522;
//         }

//         .otpBoxes {
//           display: grid;

//           grid-template-columns:
//             repeat(6, 1fr);

//           gap: 7px;

//           margin-bottom: 14px;
//         }

//         .otpBoxes input {
//           width: 100%;
//           height: 53px;

//           border:
//             1px solid
//             #cec8c2;

//           border-radius: 11px;

//           background: #fff;

//           outline: 0;

//           text-align: center;

//           font-size: 19px;

//           font-weight: 750;

//           color: #24211f;

//           transition: .18s;

//           box-shadow:
//             0 2px 7px
//             rgba(0,0,0,.025);
//         }

//         .otpBoxes input:focus {
//           border-color: #f97316;

//           box-shadow:
//             0 0 0 3px
//             rgba(249,115,22,.075);
//         }

//         .otpBottom {
//           display: flex;

//           justify-content: space-between;

//           margin-top: 16px;
//         }

//         .otpBottom button {
//           border: 0;

//           background: transparent;

//           padding: 2px;

//           color: #56514d;

//           font-size: 11px;

//           font-weight: 650;
//         }

//         .otpBottom button:last-child {
//           color: #f97316;
//         }

//         .otpBottom button:disabled {
//           color: #aaa39d;
//         }

//         /* =====================================================
//            DONE
//         ===================================================== */

//         .done {
//           text-align: center;

//           padding:
//             19px 5px 8px;
//         }

//         .doneIcon {
//           width: 62px;
//           height: 62px;

//           margin:
//             0 auto 18px;

//           display: grid;
//           place-items: center;

//           border-radius: 19px;

//           color: #34794d;

//           background:
//             linear-gradient(
//               145deg,
//               #eff9f2,
//               #e1f1e7
//             );

//           box-shadow:
//             0 10px 25px
//             rgba(52,121,77,.09);
//         }

//         .doneIcon svg {
//           width: 25px;

//           fill: none;

//           stroke: currentColor;

//           stroke-width: 2;
//         }

//         .done h2 {
//           margin:
//             0 0 7px;

//           font-family: Georgia, serif;

//           font-size: 28px;

//           font-weight: 500;

//           color: #202020;
//         }

//         .done p {
//           margin:
//             0 0 22px;

//           color: #77716c;

//           font-size: 13px;
//         }

//         /* =====================================================
//            FOOTER
//         ===================================================== */

//         .footer {
//           margin-top: 20px;

//           padding-top: 15px;

//           border-top:
//             1px solid
//             #ebe6e0;

//           text-align: center;

//           color: #817b75;

//           font-size: 11px;
//         }

//         .footer button {
//           border: 0;

//           padding: 0;

//           background: transparent;

//           color: #393532;

//           font-weight: 700;

//           text-decoration: underline;

//           text-underline-offset: 2px;
//         }

//         /* =====================================================
//            MOBILE
//         ===================================================== */

//         @media (max-width: 480px) {

//           .propertyCard {
//             width: 190px;
//             min-width: 190px;

//             height: 135px;
//           }

//           .propertyRow {
//             gap: 11px;
//           }

//           .propertyBackground {
//             gap: 11px;
//           }

//           .modal {
//             max-width: 100%;

//             padding:
//               29px 20px 20px;

//             border-radius: 23px;
//           }

//           .loginHeader {
//             padding-bottom: 20px;
//           }

//           .loginHeader h2 {
//             font-size: 24px;
//           }

//           .otpBoxes {
//             gap: 5px;
//           }

//           .otpBoxes input {
//             height: 48px;
//           }

//         }

//       `}</style>

//       <div className="loginPage">

//         {/* =====================================================
//             BACKGROUND PROPERTY SECTION
//             3 ROWS × 7 PROPERTIES
//         ===================================================== */}

//         <div className="propertyBackground">

//           {[0, 1, 2].map((row) => {

//             const rowProperties =
//               properties.slice(
//                 row * 7,
//                 row * 7 + 7
//               );

//             return (
//               <div
//                 className="propertyRow"
//                 key={row}
//               >

//                 {/* Original 7 */}
//                 {rowProperties.map(
//                   (property, index) => (
//                     <div
//                       className="propertyCard"
//                       key={`original-${index}`}
//                     >

//                       <img
//                         src={property.image}
//                         alt={property.name}
//                       />

//                       <div className="propertyDetails">

//                         <h3>
//                           {property.name}
//                         </h3>

//                         <div className="propertyLocation">
//                           {property.location}
//                         </div>

//                         <div className="propertyMeta">

//                           <span>
//                             {property.type}
//                             {" • "}
//                             {property.guests}
//                           </span>

//                           <span className="propertyPrice">
//                             {property.price}
//                           </span>

//                         </div>

//                       </div>

//                     </div>
//                   )
//                 )}

//                 {/* Duplicate 7 for seamless scrolling */}
//                 {rowProperties.map(
//                   (property, index) => (
//                     <div
//                       className="propertyCard"
//                       key={`duplicate-${index}`}
//                     >

//                       <img
//                         src={property.image}
//                         alt={property.name}
//                       />

//                       <div className="propertyDetails">

//                         <h3>
//                           {property.name}
//                         </h3>

//                         <div className="propertyLocation">
//                           {property.location}
//                         </div>

//                         <div className="propertyMeta">

//                           <span>
//                             {property.type}
//                             {" • "}
//                             {property.guests}
//                           </span>

//                           <span className="propertyPrice">
//                             {property.price}
//                           </span>

//                         </div>

//                       </div>

//                     </div>
//                   )
//                 )}

//               </div>
//             );

//           })}

//         </div>

//         {/* Background shade */}
//         <div className="backgroundShade" />

//         {/* ================= LOGIN POPUP ================= */}

//         {showLogin && (

//           <div className="overlay">

//             <div className="modal">

//               {/* CLOSE */}

//               <button
//                 className="close"
//                 onClick={() => setShowLogin(false)}
//                 aria-label="Close"
//               >
//                 <CloseIcon />
//               </button>

//               {/* ================= LOGIN ================= */}

//               {step === "login" && (

//                 <>

//                   <div className="loginHeader">

//                     <div className="miniLogo">

//                       {isEmail
//                         ? <MailIcon />
//                         : <PhoneIcon />
//                       }

//                     </div>

//                     <h2>
//                       Log in or sign up
//                     </h2>

//                     <p>
//                       Welcome back. Enter your details
//                       to continue.
//                     </p>

//                   </div>

//                   {/* EMAIL / PHONE */}

//                   <div className="tabs">

//                     <button
//                       type="button"
//                       className={
//                         isEmail ? "active" : ""
//                       }
//                       onClick={() =>
//                         changeMethod("email")
//                       }
//                     >
//                       Email
//                     </button>

//                     <button
//                       type="button"
//                       className={
//                         !isEmail ? "active" : ""
//                       }
//                       onClick={() =>
//                         changeMethod("phone")
//                       }
//                     >
//                       Phone
//                     </button>

//                   </div>

//                   <form onSubmit={continueLogin}>

//                     <label className="label">

//                       {isEmail
//                         ? "Email address"
//                         : "Phone number"
//                       }

//                     </label>

//                     <div className="input">

//                       {isEmail
//                         ? <MailIcon />
//                         : <PhoneIcon />
//                       }

//                       <input
//                         autoFocus
//                         type={
//                           isEmail
//                             ? "email"
//                             : "tel"
//                         }
//                         value={value}
//                         onChange={(e) =>
//                           setValue(e.target.value)
//                         }
//                         placeholder={
//                           isEmail
//                             ? "Email address"
//                             : "+91 98765 43210"
//                         }
//                       />

//                     </div>

//                     <div className="terms">

//                       By continuing, you agree to our{" "}
//                       <a href="#">
//                         Terms of Service
//                       </a>{" "}
//                       and{" "}
//                       <a href="#">
//                         Privacy Policy
//                       </a>.

//                     </div>

//                     {error && (
//                       <div className="error">
//                         {error}
//                       </div>
//                     )}

//                     <button
//                       className="continue"
//                       type="submit"
//                     >
//                       Continue
//                       <ArrowIcon />
//                     </button>

//                   </form>

//                   {/* DIVIDER */}

//                   <div className="divider">
//                     or
//                   </div>

//                   {/* SOCIAL */}

//                   <div className="socialIcons">

//                     <button
//                       type="button"
//                       className="socialIcon"
//                       aria-label="Continue with Google"
//                     >
//                       <GoogleIcon />
//                     </button>

//                     <button
//                       type="button"
//                       className="socialIcon"
//                       aria-label="Continue with Apple"
//                     >
//                       <AppleIcon />
//                     </button>

//                   </div>

//                 </>

//               )}

//               {/* ================= OTP ================= */}

//               {step === "otp" && (

//                 <form
//                   className="otpScreen"
//                   onSubmit={verifyOTP}
//                 >

//                   <div className="otpLogo">
//                     <CheckIcon />
//                   </div>

//                   <h2>
//                     Enter the code
//                   </h2>

//                   <p>
//                     We've sent a verification code to
//                     <br />
//                     <strong>
//                       {value}
//                     </strong>
//                   </p>

//                   <div className="otpBoxes">

//                     {otp.map((digit, index) => (

//                       <input
//                         key={index}
//                         ref={(el) =>
//                           (otpRefs.current[index] = el)
//                         }
//                         value={digit}
//                         maxLength={1}
//                         inputMode="numeric"
//                         onChange={(e) =>
//                           changeOTP(
//                             index,
//                             e.target.value
//                           )
//                         }
//                         onKeyDown={(e) =>
//                           otpKeyDown(index, e)
//                         }
//                       />

//                     ))}

//                   </div>

//                   {error && (
//                     <div className="error">
//                       {error}
//                     </div>
//                   )}

//                   <button
//                     className="continue"
//                     type="submit"
//                   >
//                     Done
//                     <ArrowIcon />
//                   </button>

//                   <div className="otpBottom">

//                     <button
//                       type="button"
//                       onClick={() => {
//                         setStep("login");
//                         setError("");
//                       }}
//                     >
//                       ← Change{" "}
//                       {isEmail
//                         ? "email"
//                         : "number"}
//                     </button>

//                     <button
//                       type="button"
//                       disabled={seconds > 0}
//                       onClick={resendOTP}
//                     >
//                       {seconds > 0
//                         ? `Resend in ${seconds}s`
//                         : "Resend code"}
//                     </button>

//                   </div>

//                 </form>

//               )}

//               {/* ================= DONE ================= */}

//               {step === "done" && (

//                 <div className="done">

//                   <div className="doneIcon">
//                     <CheckIcon />
//                   </div>

//                   <h2>
//                     You're all set!
//                   </h2>

//                   <p>
//                     Your account has been successfully
//                     verified.
//                   </p>

//                   <button
//                     className="continue"
//                     onClick={() => {
//                       window.location.href =
//                         "https://takeonbnb.com/";
//                     }}
//                   >
//                     Continue
//                     <ArrowIcon />
//                   </button>

//                 </div>

//               )}

//               {/* ================= FOOTER ================= */}

//               {/* {step !== "done" && (

//                 <div className="footer">

//                   New to Take On BnB?{" "}

//                   <button
//                     type="button"
//                   >
//                     Create an account
//                   </button>

//                 </div>

//               )} */}



//               {step !== "done" && (

//   <div className="footer">

//     New to Take On BnB?{" "}

//     <button
//       type="button"
//       onClick={() => navigate("/signup")}
//     >
//       Create an account
//     </button>

//   </div>

// )}

//             </div>

//           </div>

//         )}

//       </div>
//     </>
//   );
// }


















// import React, { useEffect, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";

// export default function LoginPage() {
//   console.log("🔥 NEW LOGIN PAGE LOADED");
//   const [showLogin, setShowLogin] = useState(true);
//   const [step, setStep] = useState("login");
//   const [value, setValue] = useState("");
//   const [otp, setOtp] = useState(["", "", "", "", "", ""]);
//   const [error, setError] = useState("");
//   const [seconds, setSeconds] = useState(30);

//   const navigate = useNavigate();
//   const otpRefs = useRef([]);

//   /* =====================================================
//      TEMPORARY DEHRADUN PROPERTIES
//      3 ROWS × 7 PROPERTIES
//   ===================================================== */

//   const properties = [
//     {
//       name: "Luxury Valley Villa",
//       location: "Rajpur Road, Dehradun",
//       type: "Villa",
//       guests: "6 Guests",
//       price: "₹4,999/night",
//       image:
//         "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=80",
//     },
//     {
//       name: "The Forest Retreat",
//       location: "Sahastradhara Road, Dehradun",
//       type: "Resort",
//       guests: "4 Guests",
//       price: "₹3,499/night",
//       image:
//         "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=900&q=80",
//     },
//     {
//       name: "Green View Apartment",
//       location: "Canal Road, Dehradun",
//       type: "2 BHK",
//       guests: "4 Guests",
//       price: "₹2,499/night",
//       image:
//         "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=900&q=80",
//     },
//     {
//       name: "Mountain Mist Villa",
//       location: "Jakhan, Dehradun",
//       type: "Villa",
//       guests: "8 Guests",
//       price: "₹5,999/night",
//       image:
//         "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80",
//     },
//     {
//       name: "Urban Nest Stay",
//       location: "GMS Road, Dehradun",
//       type: "1 BHK",
//       guests: "2 Guests",
//       price: "₹1,899/night",
//       image:
//         "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=80",
//     },
//     {
//       name: "Hillside Haven",
//       location: "Maldevta, Dehradun",
//       type: "Villa",
//       guests: "6 Guests",
//       price: "₹4,499/night",
//       image:
//         "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=900&q=80",
//     },
//     {
//       name: "Royal Garden Stay",
//       location: "Rajpur Road, Dehradun",
//       type: "3 BHK",
//       guests: "6 Guests",
//       price: "₹3,999/night",
//       image:
//         "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80",
//     },
//     {
//       name: "Pine Valley Resort",
//       location: "Sinola, Dehradun",
//       type: "Resort",
//       guests: "4 Guests",
//       price: "₹3,799/night",
//       image:
//         "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=900&q=80",
//     },
//     {
//       name: "The Dehradun House",
//       location: "Jakhan, Dehradun",
//       type: "2 BHK",
//       guests: "4 Guests",
//       price: "₹2,799/night",
//       image:
//         "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=80",
//     },
//     {
//       name: "Valley Breeze Villa",
//       location: "Bhagwant Pur, Dehradun",
//       type: "Villa",
//       guests: "8 Guests",
//       price: "₹5,499/night",
//       image:
//         "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=900&q=80",
//     },
//     {
//       name: "Cozy Corner BnB",
//       location: "GMS Road, Dehradun",
//       type: "1 BHK",
//       guests: "2 Guests",
//       price: "₹1,699/night",
//       image:
//         "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=80",
//     },
//     {
//       name: "Sunset Valley Home",
//       location: "Canal Road, Dehradun",
//       type: "3 BHK",
//       guests: "6 Guests",
//       price: "₹3,299/night",
//       image:
//         "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=80",
//     },
//     {
//       name: "Oakwood Retreat",
//       location: "Kimadi, Dehradun",
//       type: "Villa",
//       guests: "6 Guests",
//       price: "₹4,799/night",
//       image:
//         "https://images.unsplash.com/photo-1600585152915-d208bec867a1?auto=format&fit=crop&w=900&q=80",
//     },
//     {
//       name: "The Orange Nest",
//       location: "Sahastradhara Road, Dehradun",
//       type: "2 BHK",
//       guests: "4 Guests",
//       price: "₹2,599/night",
//       image:
//         "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=900&q=80",
//     },
//     {
//       name: "Himalayan Pearl Villa",
//       location: "Maldevta, Dehradun",
//       type: "Villa",
//       guests: "8 Guests",
//       price: "₹6,499/night",
//       image:
//         "https://images.unsplash.com/photo-1600047509782-20d39509f26d?auto=format&fit=crop&w=900&q=80",
//     },
//     {
//       name: "Valley View BnB",
//       location: "Thano, Dehradun",
//       type: "1 BHK",
//       guests: "2 Guests",
//       price: "₹1,799/night",
//       image:
//         "https://images.unsplash.com/photo-1600566753051-f0b89df2dd90?auto=format&fit=crop&w=900&q=80",
//     },
//     {
//       name: "Mountain Pearl Resort",
//       location: "Bhagwant Pur, Dehradun",
//       type: "Resort",
//       guests: "6 Guests",
//       price: "₹4,299/night",
//       image:
//         "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80",
//     },
//     {
//       name: "Modern Hills Apartment",
//       location: "Canal Road, Dehradun",
//       type: "2 BHK",
//       guests: "4 Guests",
//       price: "₹2,299/night",
//       image:
//         "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=900&q=80",
//     },
//     {
//       name: "Luxury Pine House",
//       location: "Kimadi, Dehradun",
//       type: "3 BHK",
//       guests: "6 Guests",
//       price: "₹3,899/night",
//       image:
//         "https://images.unsplash.com/photo-1600585154363-67c6f8f3f3a8?auto=format&fit=crop&w=900&q=80",
//     },
//     {
//       name: "Garden Escape Villa",
//       location: "Sinola, Dehradun",
//       type: "Villa",
//       guests: "6 Guests",
//       price: "₹4,699/night",
//       image:
//         "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=900&q=80",
//     },
//     {
//       name: "City Comfort Stay",
//       location: "GMS Road, Dehradun",
//       type: "1 BHK",
//       guests: "2 Guests",
//       price: "₹1,599/night",
//       image:
//         "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=80",
//     },
//   ];

//   /* =====================================================
//      TIMER
//   ===================================================== */

//   useEffect(() => {
//     if (step !== "otp" || seconds <= 0) return;

//     const timer = setInterval(() => {
//       setSeconds((s) => s - 1);
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [step, seconds]);

//   /* =====================================================
//      ICONS
//   ===================================================== */

//   const CloseIcon = () => (
//     <svg viewBox="0 0 24 24">
//       <path d="M6 6L18 18M18 6L6 18" />
//     </svg>
//   );

//   const LoginIcon = () => (
//     <svg viewBox="0 0 24 24">
//       <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v13a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 18.5z" />
//       <path d="M12 12h8M16 8l4 4-4 4" />
//     </svg>
//   );

//   const ArrowIcon = () => (
//     <svg viewBox="0 0 24 24">
//       <path d="M5 12h13M13 6l6 6-6 6" />
//     </svg>
//   );

//   const CheckIcon = () => (
//     <svg viewBox="0 0 24 24">
//       <path d="M5 12.5l4.2 4.2L19 7" />
//     </svg>
//   );

//   const GoogleIcon = () => (
//     <svg viewBox="0 0 24 24">
//       <path
//         fill="#4285F4"
//         d="M21.35 12.23c0-.7-.06-1.37-.18-2H12v3.79h5.22a4.46 4.46 0 0 1-1.94 2.92v2.43h3.14c1.84-1.69 2.93-4.18 2.93-7.14Z"
//       />
//       <path
//         fill="#34A853"
//         d="M12 21.6c2.63 0 4.84-.87 6.45-2.36l-3.14-2.43c-.87.58-1.98.92-3.31.92-2.54 0-4.7-1.72-5.47-4.03H3.28v2.5A9.74 9.74 0 0 0 12 21.6Z"
//       />
//       <path
//         fill="#FBBC05"
//         d="M6.53 13.7A5.85 5.85 0 0 1 6.22 12c0-.59.11-1.16.31-1.7V7.8H3.28A9.6 9.6 0 0 0 2.25 12c0 1.52.36 2.95 1.03 4.2l3.25-2.5Z"
//       />
//       <path
//         fill="#EA4335"
//         d="M12 6.27c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.84 3.37 14.63 2.4 12 2.4a9.74 9.74 0 0 0-8.72 5.4l3.25 2.5c.77-2.31 2.93-4.03 5.47-4.03Z"
//       />
//     </svg>
//   );

//   const AppleIcon = () => (
//     <svg viewBox="0 0 24 24">
//       <path
//         fill="currentColor"
//         d="M16.77 12.62c.02 2.05 1.8 2.73 1.82 2.74-.02.05-.28.97-.94 1.92-.56.81-1.14 1.62-2.06 1.64-.9.02-1.2-.53-2.24-.53-1.05 0-1.38.51-2.23.55-.9.03-1.58-.88-2.15-1.69-1.17-1.7-2.06-4.8-.86-6.89.6-1.04 1.58-1.69 2.65-1.71.84-.02 1.63.57 2.24.57.61 0 1.75-.7 2.94-.6.5.02 1.91.2 2.81 1.53-.07.04-1.68.98-1.66 2.47ZM14.83 7.39c.54-.65.9-1.56.8-2.46-.78.03-1.72.52-2.28 1.17-.5.57-.93 1.49-.81 2.37.87.07 1.75-.44 2.29-1.08Z"
//       />
//     </svg>
//   );

//   /* =====================================================
//      EMAIL / PHONE AUTO DETECTION
//   ===================================================== */

//   const isEmail = value.includes("@");

//   const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//   const isValidPhone = /^[+]?[0-9\s()-]{8,18}$/;

//   /* =====================================================
//      LOGIN
//   ===================================================== */

//   const continueLogin = (e) => {
//     e.preventDefault();
//     setError("");

//     const cleanValue = value.trim();

//     if (!cleanValue) {
//       setError("Please enter your phone number or email.");
//       return;
//     }

//     if (cleanValue.includes("@")) {
//       if (!isValidEmail.test(cleanValue)) {
//         setError("Please enter a valid email address.");
//         return;
//       }
//     } else {
//       if (!isValidPhone.test(cleanValue)) {
//         setError("Please enter a valid phone number.");
//         return;
//       }
//     }

//     setOtp(["", "", "", "", "", ""]);
//     setSeconds(30);
//     setStep("otp");

//     setTimeout(() => {
//       otpRefs.current[0]?.focus();
//     }, 150);
//   };

//   /* =====================================================
//      OTP
//   ===================================================== */

//   const changeOTP = (index, text) => {
//     const digit = text.replace(/\D/g, "").slice(-1);

//     const next = [...otp];
//     next[index] = digit;

//     setOtp(next);
//     setError("");

//     if (digit && index < 5) {
//       otpRefs.current[index + 1]?.focus();
//     }
//   };

//   const otpKeyDown = (index, e) => {
//     if (e.key === "Backspace" && !otp[index] && index > 0) {
//       otpRefs.current[index - 1]?.focus();
//     }
//   };

//   const verifyOTP = (e) => {
//     e.preventDefault();

//     const code = otp.join("");

//     if (code.length !== 6) {
//       setError("Please enter the 6-digit code.");
//       return;
//     }

//     if (code !== "123456") {
//       setError("For preview, enter 123456.");
//       return;
//     }

//     setStep("done");
//   };

//   const resendOTP = () => {
//     if (seconds > 0) return;

//     setOtp(["", "", "", "", "", ""]);
//     setError("");
//     setSeconds(30);

//     setTimeout(() => {
//       otpRefs.current[0]?.focus();
//     }, 100);
//   };

//   /* =====================================================
//      CSS
//   ===================================================== */

//   return (
//     <>
//       <style>{`
//         * {
//           box-sizing: border-box;
//         }

//         html,
//         body,
//         #root {
//           margin: 0;
//           min-height: 100%;
//         }

//         body {
//           font-family:
//             Inter,
//             ui-sans-serif,
//             system-ui,
//             -apple-system,
//             BlinkMacSystemFont,
//             "Segoe UI",
//             sans-serif;
//           color: #1f1f1f;
//           background: #f6f3ef;
//         }

//         button,
//         input {
//           font-family: inherit;
//         }

//         button {
//           cursor: pointer;
//         }

//         /* =====================================================
//            FULL BACKGROUND
//         ===================================================== */

//         .loginPage {
//           min-height: 100vh;
//           width: 100%;
//           position: relative;
//           overflow: hidden;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           padding: 20px;
//           background: #eee9e3;
//         }

//         /* =====================================================
//            WEBSITE BACKGROUND
//         ===================================================== */

//         .propertyBackground {
//           position: absolute;
//           inset: 0;
//           width: 100%;
//           height: 100%;
//           overflow: hidden;
//           display: flex;
//           flex-direction: column;
//           justify-content: center;
//           gap: 18px;
//           padding: 20px 0;
//           background: #eee9e3;
//           z-index: 1;
//         }

//         .propertyRow {
//           display: flex;
//           width: max-content;
//           gap: 16px;
//           animation: propertyMove 42s linear infinite;
//         }

//         .propertyRow:nth-child(2) {
//           animation-duration: 48s;
//           animation-direction: reverse;
//         }

//         .propertyRow:nth-child(3) {
//           animation-duration: 44s;
//         }

//         @keyframes propertyMove {
//           from {
//             transform: translateX(0);
//           }

//           to {
//             transform: translateX(-50%);
//           }
//         }

//         .propertyCard {
//           width: 245px;
//           min-width: 245px;
//           height: 155px;
//           position: relative;
//           overflow: hidden;
//           border-radius: 18px;
//           background: #fff;
//           box-shadow:
//             0 8px 25px rgba(0, 0, 0, 0.12);
//           border: 1px solid rgba(255, 255, 255, 0.8);
//         }

//         .propertyCard img {
//           width: 100%;
//           height: 100%;
//           object-fit: cover;
//           display: block;
//         }

//         .propertyCard::after {
//           content: "";
//           position: absolute;
//           inset: 0;
//           background:
//             linear-gradient(
//               to top,
//               rgba(0, 0, 0, 0.78),
//               rgba(0, 0, 0, 0.04) 70%
//             );
//         }

//         .propertyDetails {
//           position: absolute;
//           left: 13px;
//           right: 13px;
//           bottom: 11px;
//           z-index: 2;
//           color: #fff;
//         }

//         .propertyDetails h3 {
//           margin: 0 0 3px;
//           font-size: 13px;
//           font-weight: 750;
//           white-space: nowrap;
//           overflow: hidden;
//           text-overflow: ellipsis;
//         }

//         .propertyLocation {
//           margin: 0 0 5px;
//           font-size: 10px;
//           opacity: 0.88;
//           white-space: nowrap;
//           overflow: hidden;
//           text-overflow: ellipsis;
//         }

//         .propertyMeta {
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//           gap: 8px;
//           font-size: 9px;
//           opacity: 0.95;
//         }

//         .propertyPrice {
//           font-weight: 800;
//         }

//         /* =====================================================
//            BACKGROUND SHADE
//            LIGHTER SO IMAGES ARE CLEARLY VISIBLE
//         ===================================================== */

//         .backgroundShade {
//           position: absolute;
//           inset: 0;
//           z-index: 2;
//           background: rgba(25, 21, 18, 0.10);
//           backdrop-filter: blur(0.8px);
//         }

//         /* =====================================================
//            LOGIN OVERLAY
//         ===================================================== */

//         .overlay {
//           position: fixed;
//           inset: 0;
//           z-index: 1000;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           padding: 20px;
//           background: rgba(18, 16, 15, 0.38);
//           backdrop-filter: blur(4px);
//         }

//         /* =====================================================
//            MODAL
//         ===================================================== */

//         .modal {
//           width: 100%;
//           max-width: 445px;
//           position: relative;
//           overflow: hidden;
//           border-radius: 27px;
//           padding: 31px 30px 22px;
//           background:
//             linear-gradient(
//               145deg,
//               rgba(255, 255, 255, 0.99),
//               rgba(251, 249, 246, 0.99)
//             );
//           border: 1px solid rgba(255, 255, 255, 0.85);
//           box-shadow:
//             0 45px 110px rgba(0, 0, 0, 0.30),
//             0 12px 35px rgba(0, 0, 0, 0.10);

//           animation:
//             modalIn 0.25s cubic-bezier(.2, .8, .2, 1);
//         }

//         .modal::before {
//           content: "";
//           position: absolute;
//           left: 0;
//           right: 0;
//           top: 0;
//           height: 3px;
//           background:
//             linear-gradient(
//               90deg,
//               #ff9f43,
//               #f97316,
//               #ffb15c
//             );
//         }

//         @keyframes modalIn {
//           from {
//             opacity: 0;
//             transform:
//               translateY(12px)
//               scale(.975);
//           }

//           to {
//             opacity: 1;
//             transform:
//               translateY(0)
//               scale(1);
//           }
//         }

//         /* =====================================================
//            CLOSE
//         ===================================================== */

//         .close {
//           position: absolute;
//           top: 17px;
//           left: 17px;
//           width: 33px;
//           height: 33px;
//           border-radius: 50%;
//           border: 1px solid #e4dfd9;
//           background: rgba(255, 255, 255, 0.85);
//           display: grid;
//           place-items: center;
//           z-index: 5;
//           transition: 0.18s;
//         }

//         .close:hover {
//           transform: rotate(5deg);
//           background: #f7f4f0;
//           border-color: #d3cdc6;
//         }

//         .close svg {
//           width: 16px;
//           fill: none;
//           stroke: #333;
//           stroke-width: 1.7;
//         }

//         /* =====================================================
//            LOGIN HEADER
//         ===================================================== */

//         .loginHeader {
//           text-align: center;
//           padding: 8px 20px 23px;
//         }

//         .miniLogo {
//           width: 45px;
//           height: 45px;
//           margin: 0 auto 15px;
//           border-radius: 15px;
//           display: grid;
//           place-items: center;
//           color: #f97316;

//           background:
//             linear-gradient(
//               145deg,
//               #fff7ed,
//               #ffedd5
//             );

//           box-shadow:
//             0 8px 20px rgba(249, 115, 22, 0.09),
//             inset 0 0 0 1px rgba(249, 115, 22, 0.05);

//           animation:
//             loginIconMove 2.4s ease-in-out infinite;
//         }

//         @keyframes loginIconMove {
//           0% {
//             transform:
//               translateX(-7px)
//               scale(.92)
//               rotate(-5deg);
//             opacity: .65;
//           }

//           25% {
//             transform:
//               translateX(0)
//               scale(1.08)
//               rotate(0deg);
//             opacity: 1;
//           }

//           50% {
//             transform:
//               translateX(0)
//               scale(1)
//               rotate(0deg);
//             opacity: 1;
//           }

//           75% {
//             transform:
//               translateX(7px)
//               scale(1.08)
//               rotate(5deg);
//             opacity: 1;
//           }

//           100% {
//             transform:
//               translateX(-7px)
//               scale(.92)
//               rotate(-5deg);
//             opacity: .65;
//           }
//         }

//         .miniLogo svg {
//           width: 20px;
//           fill: none;
//           stroke: currentColor;
//           stroke-width: 1.6;

//           animation:
//             iconPulse 2.4s ease-in-out infinite;
//         }

//         @keyframes iconPulse {
//           0% {
//             transform: scale(.88);
//           }

//           25% {
//             transform: scale(1.08);
//           }

//           50% {
//             transform: scale(1);
//           }

//           75% {
//             transform: scale(1.08);
//           }

//           100% {
//             transform: scale(.88);
//           }
//         }

//         .loginHeader h2 {
//           margin: 0;
//           color: #202020;
//           font-family: Georgia, serif;
//           font-size: 27px;
//           font-weight: 500;
//           letter-spacing: -.7px;
//           display: inline-block;

//           animation:
//             loginTitleFloat 2.8s ease-in-out infinite;
//         }

//         @keyframes loginTitleFloat {
//           0% {
//             opacity: .72;
//             transform: translateX(-18px);
//             letter-spacing: -1.5px;
//           }

//           25% {
//             opacity: 1;
//             transform: translateX(0);
//             letter-spacing: -.7px;
//           }

//           55% {
//             opacity: 1;
//             transform: translateX(0);
//             letter-spacing: -.7px;
//           }

//           80% {
//             opacity: .95;
//             transform: translateX(14px);
//             letter-spacing: -.2px;
//           }

//           100% {
//             opacity: .72;
//             transform: translateX(-18px);
//             letter-spacing: -1.5px;
//           }
//         }

//         .loginHeader p {
//           margin: 9px 0 0;
//           font-size: 13px;
//           line-height: 1.55;
//           position: relative;
//           display: inline-block;

//           background:
//             linear-gradient(
//               110deg,
//               #77716c 0%,
//               #77716c 36%,
//               #f97316 46%,
//               #ffb15c 50%,
//               #f97316 54%,
//               #77716c 64%,
//               #77716c 100%
//             );

//           background-size: 300% 100%;
//           background-position: 120% 0;

//           -webkit-background-clip: text;
//           background-clip: text;
//           -webkit-text-fill-color: transparent;

//           animation:
//             welcomeShine 2.8s linear infinite;
//         }

//         @keyframes welcomeShine {
//           0% {
//             background-position: 120% 0;
//           }

//           100% {
//             background-position: -120% 0;
//           }
//         }

//         /* =====================================================
//            SINGLE LOGIN FIELD
//         ===================================================== */

//         .label {
//           display: block;
//           margin-bottom: 7px;
//           color: #373330;
//           font-size: 12px;
//           font-weight: 750;
//         }

//         .input {
//           height: 55px;
//           display: flex;
//           align-items: center;
//           padding: 0 14px;
//           border-radius: 12px;
//           background: #fff;
//           border: 1px solid #cec8c2;

//           box-shadow:
//             0 2px 7px rgba(0, 0, 0, .025);

//           transition: .18s;
//         }

//         .input:focus-within {
//           border-color: #f97316;

//           box-shadow:
//             0 0 0 3px rgba(249, 115, 22, .075),
//             0 5px 15px rgba(0, 0, 0, .035);
//         }

//         .inputIcon {
//           width: 18px;
//           height: 18px;
//           margin-right: 10px;
//           color: #77716d;
//           flex-shrink: 0;
//         }

//         .inputIcon svg {
//           width: 100%;
//           height: 100%;
//           fill: none;
//           stroke: currentColor;
//           stroke-width: 1.7;
//         }

//         .input input {
//           flex: 1;
//           min-width: 0;
//           height: 100%;
//           border: 0;
//           outline: 0;
//           background: transparent;
//           color: #222;
//           font-size: 14px;
//         }

//         .input input::placeholder {
//           color: #aaa39d;
//         }

//         .terms {
//           margin: 9px 1px 15px;
//           color: #88817c;
//           font-size: 10.5px;
//           line-height: 1.5;
//         }

//         .terms a {
//           color: #4c4844;
//           font-weight: 650;
//         }

//         /* =====================================================
//            ERROR
//         ===================================================== */

//         .error {
//           margin-bottom: 12px;
//           padding: 9px 10px;
//           border-radius: 9px;

//           border: 1px solid #f0d5da;
//           background: #fff2f4;
//           color: #a63c51;
//           font-size: 11px;
//         }

//         /* =====================================================
//            MAIN BUTTON
//         ===================================================== */

//         .continue {
//           width: 100%;
//           height: 51px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           gap: 9px;

//           border: 0;
//           border-radius: 12px;

//           color: white;

//           background:
//             linear-gradient(
//               135deg,
//               #ff9f43 0%,
//               #f97316 100%
//             );

//           font-size: 14px;
//           font-weight: 750;

//           box-shadow:
//             0 10px 25px rgba(249, 115, 22, .19);

//           transition:
//             transform .18s,
//             box-shadow .18s;
//         }

//         .continue:hover {
//           transform: translateY(-1px);

//           box-shadow:
//             0 13px 29px rgba(249, 115, 22, .25);
//         }

//         .continue:active {
//           transform: translateY(0);
//         }

//         .continue svg {
//           width: 17px;
//           fill: none;
//           stroke: currentColor;
//           stroke-width: 1.8;
//         }

//         /* =====================================================
//            DIVIDER
//         ===================================================== */

//         .divider {
//           display: flex;
//           align-items: center;
//           gap: 12px;
//           margin: 19px 0 15px;
//           color: #aaa29b;
//           font-size: 11px;
//         }

//         .divider::before,
//         .divider::after {
//           content: "";
//           flex: 1;
//           height: 1px;
//           background:
//             linear-gradient(
//               90deg,
//               transparent,
//               #dfd9d3
//             );
//         }

//         .divider::after {
//           background:
//             linear-gradient(
//               90deg,
//               #dfd9d3,
//               transparent
//             );
//         }

//         /* =====================================================
//            SOCIAL
//         ===================================================== */

//         .socialIcons {
//           display: flex;
//           justify-content: center;
//           gap: 18px;
//         }

//         .socialIcon {
//           width: 45px;
//           height: 45px;
//           display: grid;
//           place-items: center;
//           border-radius: 50%;
//           border: 1px solid #ddd7d1;
//           background: #fff;
//           color: #222;

//           box-shadow:
//             0 4px 12px rgba(0, 0, 0, .035);

//           transition: .18s;
//         }

//         .socialIcon:hover {
//           transform: translateY(-2px);
//           background: #faf8f5;
//           border-color: #c9c2bb;

//           box-shadow:
//             0 8px 18px rgba(0, 0, 0, .07);
//         }

//         .socialIcon svg {
//           width: 19px;
//           height: 19px;
//         }

//         /* =====================================================
//            OTP
//         ===================================================== */

//         .otpScreen {
//           text-align: center;
//           padding: 11px 4px 5px;
//         }

//         .otpLogo {
//           width: 48px;
//           height: 48px;
//           margin: 0 auto 16px;
//           display: grid;
//           place-items: center;
//           border-radius: 15px;

//           color: #34794d;

//           background:
//             linear-gradient(
//               145deg,
//               #eff9f2,
//               #e2f1e7
//             );

//           box-shadow:
//             0 8px 20px rgba(52, 121, 77, .08);
//         }

//         .otpLogo svg {
//           width: 22px;
//           fill: none;
//           stroke: currentColor;
//           stroke-width: 2;
//         }

//         .otpScreen h2 {
//           margin: 0;
//           color: #202020;
//           font-family: Georgia, serif;
//           font-size: 27px;
//           font-weight: 500;
//           letter-spacing: -.5px;
//         }

//         .otpScreen p {
//           margin: 9px 0 21px;
//           color: #77716c;
//           font-size: 13px;
//           line-height: 1.55;
//         }

//         .otpScreen strong {
//           color: #282522;
//         }

//         .otpBoxes {
//           display: grid;
//           grid-template-columns: repeat(6, 1fr);
//           gap: 7px;
//           margin-bottom: 14px;
//         }

//         .otpBoxes input {
//           width: 100%;
//           height: 53px;
//           border: 1px solid #cec8c2;
//           border-radius: 11px;
//           background: #fff;
//           outline: 0;

//           text-align: center;
//           font-size: 19px;
//           font-weight: 750;
//           color: #24211f;

//           transition: .18s;

//           box-shadow:
//             0 2px 7px rgba(0, 0, 0, .025);
//         }

//         .otpBoxes input:focus {
//           border-color: #f97316;

//           box-shadow:
//             0 0 0 3px rgba(249, 115, 22, .075);
//         }

//         .otpBottom {
//           display: flex;
//           justify-content: space-between;
//           margin-top: 16px;
//         }

//         .otpBottom button {
//           border: 0;
//           background: transparent;
//           padding: 2px;
//           color: #56514d;
//           font-size: 11px;
//           font-weight: 650;
//         }

//         .otpBottom button:last-child {
//           color: #f97316;
//         }

//         .otpBottom button:disabled {
//           color: #aaa39d;
//         }

//         /* =====================================================
//            DONE
//         ===================================================== */

//         .done {
//           text-align: center;
//           padding: 19px 5px 8px;
//         }

//         .doneIcon {
//           width: 62px;
//           height: 62px;
//           margin: 0 auto 18px;

//           display: grid;
//           place-items: center;
//           border-radius: 19px;

//           color: #34794d;

//           background:
//             linear-gradient(
//               145deg,
//               #eff9f2,
//               #e1f1e7
//             );

//           box-shadow:
//             0 10px 25px rgba(52, 121, 77, .09);
//         }

//         .doneIcon svg {
//           width: 25px;
//           fill: none;
//           stroke: currentColor;
//           stroke-width: 2;
//         }

//         .done h2 {
//           margin: 0 0 7px;
//           font-family: Georgia, serif;
//           font-size: 28px;
//           font-weight: 500;
//           color: #202020;
//         }

//         .done p {
//           margin: 0 0 22px;
//           color: #77716c;
//           font-size: 13px;
//         }

//         /* =====================================================
//            FOOTER
//         ===================================================== */

//         .footer {
//           margin-top: 20px;
//           padding-top: 15px;
//           border-top: 1px solid #ebe6e0;
//           text-align: center;
//           color: #817b75;
//           font-size: 11px;
//         }

//         .footer button {
//           border: 0;
//           padding: 0;
//           background: transparent;
//           color: #393532;
//           font-weight: 700;
//           text-decoration: underline;
//           text-underline-offset: 2px;
//         }

//         /* =====================================================
//            MOBILE
//         ===================================================== */

//         @media (max-width: 480px) {
//           .propertyCard {
//             width: 190px;
//             min-width: 190px;
//             height: 135px;
//           }

//           .propertyRow {
//             gap: 11px;
//           }

//           .propertyBackground {
//             gap: 11px;
//           }

//           .modal {
//             max-width: 100%;
//             padding: 29px 20px 20px;
//             border-radius: 23px;
//           }

//           .loginHeader {
//             padding-bottom: 20px;
//           }

//           .loginHeader h2 {
//             font-size: 24px;
//           }

//           .otpBoxes {
//             gap: 5px;
//           }

//           .otpBoxes input {
//             height: 48px;
//           }
//         }
//       `}</style>

//       <div className="loginPage">

//         {/* =====================================================
//             FULL WEBSITE BACKGROUND
//         ===================================================== */}

//         <div className="propertyBackground">

//           {[0, 1, 2].map((row) => {
//             const rowProperties = properties.slice(
//               row * 7,
//               row * 7 + 7
//             );

//             return (
//               <div
//                 className="propertyRow"
//                 key={row}
//               >

//                 {/* Original properties */}

//                 {rowProperties.map((property, index) => (
//                   <div
//                     className="propertyCard"
//                     key={`original-${index}`}
//                   >
//                     <img
//                       src={property.image}
//                       alt={property.name}
//                     />

//                     <div className="propertyDetails">

//                       <h3>
//                         {property.name}
//                       </h3>

//                       <div className="propertyLocation">
//                         {property.location}
//                       </div>

//                       <div className="propertyMeta">

//                         <span>
//                           {property.type}
//                           {" • "}
//                           {property.guests}
//                         </span>

//                         <span className="propertyPrice">
//                           {property.price}
//                         </span>

//                       </div>

//                     </div>
//                   </div>
//                 ))}

//                 {/* Duplicate properties for smooth animation */}

//                 {rowProperties.map((property, index) => (
//                   <div
//                     className="propertyCard"
//                     key={`duplicate-${index}`}
//                   >
//                     <img
//                       src={property.image}
//                       alt={property.name}
//                     />

//                     <div className="propertyDetails">

//                       <h3>
//                         {property.name}
//                       </h3>

//                       <div className="propertyLocation">
//                         {property.location}
//                       </div>

//                       <div className="propertyMeta">

//                         <span>
//                           {property.type}
//                           {" • "}
//                           {property.guests}
//                         </span>

//                         <span className="propertyPrice">
//                           {property.price}
//                         </span>

//                       </div>

//                     </div>
//                   </div>
//                 ))}

//               </div>
//             );
//           })}

//         </div>

//         {/* =====================================================
//             LIGHT BACKGROUND SHADE
//         ===================================================== */}

//         <div className="backgroundShade" />

//         {/* =====================================================
//             LOGIN POPUP
//         ===================================================== */}

//         {showLogin && (
//           <div className="overlay">

//             <div className="modal">

//               {/* CLOSE */}

//               <button
//                 className="close"
//                 onClick={() => setShowLogin(false)}
//                 aria-label="Close"
//               >
//                 <CloseIcon />
//               </button>

//               {/* =================================================
//                   LOGIN SCREEN
//               ================================================= */}

//               {step === "login" && (
//                 <>
//                   <div className="loginHeader">

//                     <div className="miniLogo">
//                       <LoginIcon />
//                     </div>

//                     <h2>
//                       Log in or sign up
//                     </h2>

//                     <p>
//                       Welcome back. Enter your details
//                       to continue.
//                     </p>

//                   </div>

//                   <form onSubmit={continueLogin}>

//                     <label className="label">
//                       Phone number or email
//                     </label>

//                     <div className="input">

//                       <div className="inputIcon">
//                         <LoginIcon />
//                       </div>

//                       <input
//                         autoFocus
//                         type="text"
//                         value={value}
//                         onChange={(e) => {
//                           setValue(e.target.value);
//                           setError("");
//                         }}
//                         placeholder="Phone number or email"
//                         autoComplete="username"
//                       />

//                     </div>

//                     <div className="terms">
//                       By continuing, you agree to our{" "}
//                       <a href="#">
//                         Terms of Service
//                       </a>{" "}
//                       and{" "}
//                       <a href="#">
//                         Privacy Policy
//                       </a>.
//                     </div>

//                     {error && (
//                       <div className="error">
//                         {error}
//                       </div>
//                     )}

//                     <button
//                       className="continue"
//                       type="submit"
//                     >
//                       Continue
//                       <ArrowIcon />
//                     </button>

//                   </form>

//                   {/* DIVIDER */}

//                   <div className="divider">
//                     or
//                   </div>

//                   {/* SOCIAL */}

//                   <div className="socialIcons">

//                     <button
//                       type="button"
//                       className="socialIcon"
//                       aria-label="Continue with Google"
//                     >
//                       <GoogleIcon />
//                     </button>

//                     <button
//                       type="button"
//                       className="socialIcon"
//                       aria-label="Continue with Apple"
//                     >
//                       <AppleIcon />
//                     </button>

//                   </div>
//                 </>
//               )}

//               {/* =================================================
//                   OTP SCREEN
//               ================================================= */}

//               {step === "otp" && (
//                 <form
//                   className="otpScreen"
//                   onSubmit={verifyOTP}
//                 >

//                   <div className="otpLogo">
//                     <CheckIcon />
//                   </div>

//                   <h2>
//                     Enter the code
//                   </h2>

//                   <p>
//                     We've sent a verification code to
//                     <br />

//                     <strong>
//                       {value}
//                     </strong>
//                   </p>

//                   <div className="otpBoxes">

//                     {otp.map((digit, index) => (
//                       <input
//                         key={index}
//                         ref={(el) =>
//                           (otpRefs.current[index] = el)
//                         }
//                         value={digit}
//                         maxLength={1}
//                         inputMode="numeric"
//                         onChange={(e) =>
//                           changeOTP(
//                             index,
//                             e.target.value
//                           )
//                         }
//                         onKeyDown={(e) =>
//                           otpKeyDown(index, e)
//                         }
//                       />
//                     ))}

//                   </div>

//                   {error && (
//                     <div className="error">
//                       {error}
//                     </div>
//                   )}

//                   <button
//                     className="continue"
//                     type="submit"
//                   >
//                     Done
//                     <ArrowIcon />
//                   </button>

//                   <div className="otpBottom">

//                     <button
//                       type="button"
//                       onClick={() => {
//                         setStep("login");
//                         setError("");
//                       }}
//                     >
//                       ← Change
//                     </button>

//                     <button
//                       type="button"
//                       disabled={seconds > 0}
//                       onClick={resendOTP}
//                     >
//                       {seconds > 0
//                         ? `Resend in ${seconds}s`
//                         : "Resend code"}
//                     </button>

//                   </div>

//                 </form>
//               )}

//               {/* =================================================
//                   DONE SCREEN
//               ================================================= */}

//               {step === "done" && (
//                 <div className="done">

//                   <div className="doneIcon">
//                     <CheckIcon />
//                   </div>

//                   <h2>
//                     You're all set!
//                   </h2>

//                   <p>
//                     Your account has been successfully
//                     verified.
//                   </p>

//                   <button
//                     className="continue"
//                     onClick={() => {
//                       window.location.href =
//                         "https://takeonbnb.com/";
//                     }}
//                   >
//                     Continue
//                     <ArrowIcon />
//                   </button>

//                 </div>
//               )}

//               {/* =================================================
//                   SIGNUP FOOTER
//               ================================================= */}

//               {step !== "done" && (
//                 <div className="footer">

//                   New to Take On BnB?{" "}

//                   <button
//                     type="button"
//                     onClick={() => navigate("/signup")}
//                   >
//                     Create an account
//                   </button>

//                 </div>
//               )}

//             </div>
//           </div>
//         )}

//       </div>
//     </>
//   );
// }



































// import React, { useEffect, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";

// export default function LoginPage() {
//   console.log("🔥 NEW LOGIN PAGE LOADED");

//   const [showLogin, setShowLogin] = useState(true);
//   const [step, setStep] = useState("login");
//   const [value, setValue] = useState("");
//   const [otp, setOtp] = useState(["", "", "", "", "", ""]);
//   const [error, setError] = useState("");
//   const [seconds, setSeconds] = useState(30);

//   const navigate = useNavigate();
//   const otpRefs = useRef([]);

//   /* =====================================================
//      TEMPORARY DEHRADUN PROPERTIES
//      3 ROWS × 7 PROPERTIES
//   ===================================================== */
//   const properties = [
//     {
//       name: "Luxury Valley Villa",
//       location: "Rajpur Road, Dehradun",
//       type: "Villa",
//       guests: "6 Guests",
//       price: "₹4,999/night",
//       image:
//         "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=80",
//     },
//     {
//       name: "The Forest Retreat",
//       location: "Sahastradhara Road, Dehradun",
//       type: "Resort",
//       guests: "4 Guests",
//       price: "₹3,499/night",
//       image:
//         "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=900&q=80",
//     },
//     {
//       name: "Green View Apartment",
//       location: "Canal Road, Dehradun",
//       type: "2 BHK",
//       guests: "4 Guests",
//       price: "₹2,499/night",
//       image:
//         "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=900&q=80",
//     },
//     {
//       name: "Mountain Mist Villa",
//       location: "Jakhan, Dehradun",
//       type: "Villa",
//       guests: "8 Guests",
//       price: "₹5,999/night",
//       image:
//         "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80",
//     },
//     {
//       name: "Urban Nest Stay",
//       location: "GMS Road, Dehradun",
//       type: "1 BHK",
//       guests: "2 Guests",
//       price: "₹1,899/night",
//       image:
//         "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=80",
//     },
//     {
//       name: "Hillside Haven",
//       location: "Maldevta, Dehradun",
//       type: "Villa",
//       guests: "6 Guests",
//       price: "₹4,499/night",
//       image:
//         "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=900&q=80",
//     },
//     {
//       name: "Royal Garden Stay",
//       location: "Rajpur Road, Dehradun",
//       type: "3 BHK",
//       guests: "6 Guests",
//       price: "₹3,999/night",
//       image:
//         "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80",
//     },
//     {
//       name: "Pine Valley Resort",
//       location: "Sinola, Dehradun",
//       type: "Resort",
//       guests: "4 Guests",
//       price: "₹3,799/night",
//       image:
//         "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=900&q=80",
//     },
//     {
//       name: "The Dehradun House",
//       location: "Jakhan, Dehradun",
//       type: "2 BHK",
//       guests: "4 Guests",
//       price: "₹2,799/night",
//       image:
//         "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=80",
//     },
//     {
//       name: "Valley Breeze Villa",
//       location: "Bhagwant Pur, Dehradun",
//       type: "Villa",
//       guests: "8 Guests",
//       price: "₹5,499/night",
//       image:
//         "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=900&q=80",
//     },
//     {
//       name: "Cozy Corner BnB",
//       location: "GMS Road, Dehradun",
//       type: "1 BHK",
//       guests: "2 Guests",
//       price: "₹1,699/night",
//       image:
//         "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=80",
//     },
//     {
//       name: "Sunset Valley Home",
//       location: "Canal Road, Dehradun",
//       type: "3 BHK",
//       guests: "6 Guests",
//       price: "₹3,299/night",
//       image:
//         "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=80",
//     },
//     {
//       name: "Oakwood Retreat",
//       location: "Kimadi, Dehradun",
//       type: "Villa",
//       guests: "6 Guests",
//       price: "₹4,799/night",
//       image:
//         "https://images.unsplash.com/photo-1600585152915-d208bec867a1?auto=format&fit=crop&w=900&q=80",
//     },
//     {
//       name: "The Orange Nest",
//       location: "Sahastradhara Road, Dehradun",
//       type: "2 BHK",
//       guests: "4 Guests",
//       price: "₹2,599/night",
//       image:
//         "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=900&q=80",
//     },
//     {
//       name: "Himalayan Pearl Villa",
//       location: "Maldevta, Dehradun",
//       type: "Villa",
//       guests: "8 Guests",
//       price: "₹6,499/night",
//       image:
//         "https://images.unsplash.com/photo-1600047509782-20d39509f26d?auto=format&fit=crop&w=900&q=80",
//     },
//     {
//       name: "Valley View BnB",
//       location: "Thano, Dehradun",
//       type: "1 BHK",
//       guests: "2 Guests",
//       price: "₹1,799/night",
//       image:
//         "https://images.unsplash.com/photo-1600566753051-f0b89df2dd90?auto=format&fit=crop&w=900&q=80",
//     },
//     {
//       name: "Mountain Pearl Resort",
//       location: "Bhagwant Pur, Dehradun",
//       type: "Resort",
//       guests: "6 Guests",
//       price: "₹4,299/night",
//       image:
//         "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80",
//     },
//     {
//       name: "Modern Hills Apartment",
//       location: "Canal Road, Dehradun",
//       type: "2 BHK",
//       guests: "4 Guests",
//       price: "₹2,299/night",
//       image:
//         "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=900&q=80",
//     },
//     {
//       name: "Luxury Pine House",
//       location: "Kimadi, Dehradun",
//       type: "3 BHK",
//       guests: "6 Guests",
//       price: "₹3,899/night",
//       image:
//         "https://images.unsplash.com/photo-1600585154363-67c6f8f3f3a8?auto=format&fit=crop&w=900&q=80",
//     },
//     {
//       name: "Garden Escape Villa",
//       location: "Sinola, Dehradun",
//       type: "Villa",
//       guests: "6 Guests",
//       price: "₹4,699/night",
//       image:
//         "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=900&q=80",
//     },
//     {
//       name: "City Comfort Stay",
//       location: "GMS Road, Dehradun",
//       type: "1 BHK",
//       guests: "2 Guests",
//       price: "₹1,599/night",
//       image:
//         "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=80",
//     },
//   ];

//   /* =====================================================
//      TIMER
//   ===================================================== */
//   useEffect(() => {
//     if (step !== "otp" || seconds <= 0) return;

//     const timer = setInterval(() => {
//       setSeconds((s) => s - 1);
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [step, seconds]);

//   /* =====================================================
//      ICONS
//   ===================================================== */
//   const CloseIcon = () => (
//     <svg viewBox="0 0 24 24">
//       <path d="M6 6L18 18M18 6L6 18" />
//     </svg>
//   );

//   const LoginIcon = () => (
//     <svg viewBox="0 0 24 24">
//       <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v13a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 18.5z" />
//       <path d="M12 12h8M16 8l4 4-4 4" />
//     </svg>
//   );

//   const ArrowIcon = () => (
//     <svg viewBox="0 0 24 24">
//       <path d="M5 12h13M13 6l6 6-6 6" />
//     </svg>
//   );

//   const CheckIcon = () => (
//     <svg viewBox="0 0 24 24">
//       <path d="M5 12.5l4.2 4.2L19 7" />
//     </svg>
//   );

//   const GoogleIcon = () => (
//     <svg viewBox="0 0 24 24">
//       <path
//         fill="#4285F4"
//         d="M21.35 12.23c0-.7-.06-1.37-.18-2H12v3.79h5.22a4.46 4.46 0 0 1-1.94 2.92v2.43h3.14c1.84-1.69 2.93-4.18 2.93-7.14Z"
//       />
//       <path
//         fill="#34A853"
//         d="M12 21.6c2.63 0 4.84-.87 6.45-2.36l-3.14-2.43c-.87.58-1.98.92-3.31.92-2.54 0-4.7-1.72-5.47-4.03H3.28v2.5A9.74 9.74 0 0 0 12 21.6Z"
//       />
//       <path
//         fill="#FBBC05"
//         d="M6.53 13.7A5.85 5.85 0 0 1 6.22 12c0-.59.11-1.16.31-1.7V7.8H3.28A9.6 9.6 0 0 0 2.25 12c0 1.52.36 2.95 1.03 4.2l3.25-2.5Z"
//       />
//       <path
//         fill="#EA4335"
//         d="M12 6.27c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.84 3.37 14.63 2.4 12 2.4a9.74 9.74 0 0 0-8.72 5.4l3.25 2.5c.77-2.31 2.93-4.03 5.47-4.03Z"
//       />
//     </svg>
//   );

//   const AppleIcon = () => (
//     <svg viewBox="0 0 24 24">
//       <path
//         fill="currentColor"
//         d="M16.77 12.62c.02 2.05 1.8 2.73 1.82 2.74-.02.05-.28.97-.94 1.92-.56.81-1.14 1.62-2.06 1.64-.9.02-1.2-.53-2.24-.53-1.05 0-1.38.51-2.23.55-.9.03-1.58-.88-2.15-1.69-1.17-1.7-2.06-4.8-.86-6.89.6-1.04 1.58-1.69 2.65-1.71.84-.02 1.63.57 2.24.57.61 0 1.75-.7 2.94-.6.5.02 1.91.2 2.81 1.53-.07.04-1.68.98-1.66 2.47ZM14.83 7.39c.54-.65.9-1.56.8-2.46-.78.03-1.72.52-2.28 1.17-.5.57-.93 1.49-.81 2.37.87.07 1.75-.44 2.29-1.08Z"
//       />
//     </svg>
//   );

//   /* =====================================================
//      EMAIL / PHONE AUTO DETECTION
//   ===================================================== */
//   const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   const isValidPhone = /^[+]?[0-9\s()-]{8,18}$/;

//   /* =====================================================
//      LOGIN
//   ===================================================== */
//   const continueLogin = (e) => {
//     e.preventDefault();
//     setError("");

//     const cleanValue = value.trim();

//     if (!cleanValue) {
//       setError("Please enter your phone number or email.");
//       return;
//     }

//     if (cleanValue.includes("@")) {
//       if (!isValidEmail.test(cleanValue)) {
//         setError("Please enter a valid email address.");
//         return;
//       }
//     } else {
//       if (!isValidPhone.test(cleanValue)) {
//         setError("Please enter a valid phone number.");
//         return;
//       }
//     }

//     setOtp(["", "", "", "", "", ""]);
//     setSeconds(30);
//     setStep("otp");

//     setTimeout(() => {
//       otpRefs.current[0]?.focus();
//     }, 150);
//   };

//   /* =====================================================
//      OTP
//   ===================================================== */
//   const changeOTP = (index, text) => {
//     const digit = text.replace(/\D/g, "").slice(-1);
//     const next = [...otp];

//     next[index] = digit;

//     setOtp(next);
//     setError("");

//     if (digit && index < 5) {
//       otpRefs.current[index + 1]?.focus();
//     }
//   };

//   const otpKeyDown = (index, e) => {
//     if (e.key === "Backspace" && !otp[index] && index > 0) {
//       otpRefs.current[index - 1]?.focus();
//     }
//   };

//   const verifyOTP = (e) => {
//     e.preventDefault();

//     const code = otp.join("");

//     if (code.length !== 6) {
//       setError("Please enter the 6-digit code.");
//       return;
//     }

//     if (code !== "123456") {
//       setError("For preview, enter 123456.");
//       return;
//     }

//     setStep("done");
//   };

//   const resendOTP = () => {
//     if (seconds > 0) return;

//     setOtp(["", "", "", "", "", ""]);
//     setError("");
//     setSeconds(30);

//     setTimeout(() => {
//       otpRefs.current[0]?.focus();
//     }, 100);
//   };

//   return (
//     <>
//       <style>{`
//         * {
//           box-sizing: border-box;
//         }

//         html,
//         body,
//         #root {
//           margin: 0;
//           min-height: 100%;
//         }

//         body {
//           font-family:
//             Inter,
//             ui-sans-serif,
//             system-ui,
//             -apple-system,
//             BlinkMacSystemFont,
//             "Segoe UI",
//             sans-serif;
//           color: #1f1f1f;
//           background: #f6f3ef;
//         }

//         button,
//         input {
//           font-family: inherit;
//         }

//         button {
//           cursor: pointer;
//         }

//         .loginPage {
//           min-height: 100vh;
//           width: 100%;
//           position: relative;
//           overflow: hidden;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           padding: 20px;
//           background: #eee9e3;
//         }

//         .propertyBackground {
//           position: absolute;
//           inset: 0;
//           width: 100%;
//           height: 100%;
//           overflow: hidden;
//           display: flex;
//           flex-direction: column;
//           justify-content: center;
//           gap: 18px;
//           padding: 20px 0;
//           background: #eee9e3;
//           z-index: 1;
//         }

//         .propertyRow {
//           display: flex;
//           width: max-content;
//           gap: 16px;
//           animation: propertyMove 42s linear infinite;
//         }

//         .propertyRow:nth-child(2) {
//           animation-duration: 48s;
//           animation-direction: reverse;
//         }

//         .propertyRow:nth-child(3) {
//           animation-duration: 44s;
//         }

//         @keyframes propertyMove {
//           from {
//             transform: translateX(0);
//           }
//           to {
//             transform: translateX(-50%);
//           }
//         }

//         .propertyCard {
//           width: 245px;
//           min-width: 245px;
//           height: 155px;
//           position: relative;
//           overflow: hidden;
//           border-radius: 18px;
//           background: #fff;
//           box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
//           border: 1px solid rgba(255, 255, 255, 0.8);
//         }

//         .propertyCard img {
//           width: 100%;
//           height: 100%;
//           object-fit: cover;
//           display: block;
//         }

//         .propertyCard::after {
//           content: "";
//           position: absolute;
//           inset: 0;
//           background: linear-gradient(
//             to top,
//             rgba(0, 0, 0, 0.78),
//             rgba(0, 0, 0, 0.04) 70%
//           );
//         }

//         .propertyDetails {
//           position: absolute;
//           left: 13px;
//           right: 13px;
//           bottom: 11px;
//           z-index: 2;
//           color: #fff;
//         }

//         .propertyDetails h3 {
//           margin: 0 0 3px;
//           font-size: 13px;
//           font-weight: 750;
//           white-space: nowrap;
//           overflow: hidden;
//           text-overflow: ellipsis;
//         }

//         .propertyLocation {
//           margin: 0 0 5px;
//           font-size: 10px;
//           opacity: 0.88;
//           white-space: nowrap;
//           overflow: hidden;
//           text-overflow: ellipsis;
//         }

//         .propertyMeta {
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//           gap: 8px;
//           font-size: 9px;
//           opacity: 0.95;
//         }

//         .propertyPrice {
//           font-weight: 800;
//         }

//         .backgroundShade {
//           position: absolute;
//           inset: 0;
//           z-index: 2;
//           background: rgba(25, 21, 18, 0.1);
//           backdrop-filter: blur(0.8px);
//         }

//         .overlay {
//           position: fixed;
//           inset: 0;
//           z-index: 1000;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           padding: 20px;
//           background: rgba(18, 16, 15, 0.38);
//           backdrop-filter: blur(4px);
//         }

//         .modal {
//           width: 100%;
//           max-width: 445px;
//           position: relative;
//           overflow: hidden;
//           border-radius: 27px;
//           padding: 31px 30px 22px;
//           background: linear-gradient(
//             145deg,
//             rgba(255, 255, 255, 0.99),
//             rgba(251, 249, 246, 0.99)
//           );
//           border: 1px solid rgba(255, 255, 255, 0.85);
//           box-shadow:
//             0 45px 110px rgba(0, 0, 0, 0.3),
//             0 12px 35px rgba(0, 0, 0, 0.1);
//         }

//         .modal::before {
//           content: "";
//           position: absolute;
//           left: 0;
//           right: 0;
//           top: 0;
//           height: 3px;
//           background: linear-gradient(
//             90deg,
//             #ff9f43,
//             #f97316,
//             #ffb15c
//           );
//         }

//         .close {
//           position: absolute;
//           top: 17px;
//           left: 17px;
//           width: 33px;
//           height: 33px;
//           border-radius: 50%;
//           border: 1px solid #e4dfd9;
//           background: rgba(255, 255, 255, 0.85);
//           display: grid;
//           place-items: center;
//           z-index: 5;
//         }

//         .close svg {
//           width: 16px;
//           fill: none;
//           stroke: #333;
//           stroke-width: 1.7;
//         }

//         .loginHeader {
//           text-align: center;
//           padding: 8px 20px 23px;
//         }

//         .miniLogo {
//           width: 45px;
//           height: 45px;
//           margin: 0 auto 15px;
//           border-radius: 15px;
//           display: grid;
//           place-items: center;
//           color: #f97316;
//           background: #fff7ed;
//         }

//         .miniLogo svg {
//           width: 20px;
//           fill: none;
//           stroke: currentColor;
//           stroke-width: 1.6;
//         }

//         .loginHeader h2 {
//           margin: 0;
//           color: #202020;
//           font-family: Georgia, serif;
//           font-size: 27px;
//           font-weight: 500;
//         }

//         .loginHeader p {
//           margin: 9px 0 0;
//           font-size: 13px;
//           line-height: 1.55;
//           color: #77716c;
//         }

//         .label {
//           display: block;
//           margin-bottom: 7px;
//           color: #373330;
//           font-size: 12px;
//           font-weight: 750;
//         }

//         .input {
//           height: 55px;
//           display: flex;
//           align-items: center;
//           padding: 0 14px;
//           border-radius: 12px;
//           background: #fff;
//           border: 1px solid #cec8c2;
//         }

//         .input:focus-within {
//           border-color: #f97316;
//           box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.075);
//         }

//         .inputIcon {
//           width: 18px;
//           height: 18px;
//           margin-right: 10px;
//           color: #77716d;
//         }

//         .inputIcon svg {
//           width: 100%;
//           height: 100%;
//           fill: none;
//           stroke: currentColor;
//           stroke-width: 1.7;
//         }

//         .input input {
//           flex: 1;
//           min-width: 0;
//           height: 100%;
//           border: 0;
//           outline: 0;
//           background: transparent;
//           color: #222;
//           font-size: 14px;
//         }

//         .terms {
//           margin: 9px 1px 15px;
//           color: #88817c;
//           font-size: 10.5px;
//           line-height: 1.5;
//         }

//         .terms a {
//           color: #4c4844;
//           font-weight: 650;
//         }

//         .error {
//           margin-bottom: 12px;
//           padding: 9px 10px;
//           border-radius: 9px;
//           border: 1px solid #f0d5da;
//           background: #fff2f4;
//           color: #a63c51;
//           font-size: 11px;
//         }

//         .continue {
//           width: 100%;
//           height: 51px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           gap: 9px;
//           border: 0;
//           border-radius: 12px;
//           color: white;
//           background: linear-gradient(
//             135deg,
//             #ff9f43 0%,
//             #f97316 100%
//           );
//           font-size: 14px;
//           font-weight: 750;
//         }

//         .continue svg {
//           width: 17px;
//           fill: none;
//           stroke: currentColor;
//           stroke-width: 1.8;
//         }

//         .divider {
//           display: flex;
//           align-items: center;
//           gap: 12px;
//           margin: 19px 0 15px;
//           color: #aaa29b;
//           font-size: 11px;
//         }

//         .divider::before,
//         .divider::after {
//           content: "";
//           flex: 1;
//           height: 1px;
//           background: #dfd9d3;
//         }

//         .socialIcons {
//           display: flex;
//           justify-content: center;
//           gap: 18px;
//         }

//         .socialIcon {
//           width: 45px;
//           height: 45px;
//           display: grid;
//           place-items: center;
//           border-radius: 50%;
//           border: 1px solid #ddd7d1;
//           background: #fff;
//           color: #222;
//         }

//         .socialIcon svg {
//           width: 19px;
//           height: 19px;
//         }

//         .otpScreen {
//           text-align: center;
//           padding: 11px 4px 5px;
//         }

//         .otpLogo {
//           width: 48px;
//           height: 48px;
//           margin: 0 auto 16px;
//           display: grid;
//           place-items: center;
//           border-radius: 15px;
//           color: #34794d;
//           background: #eff9f2;
//         }

//         .otpLogo svg {
//           width: 22px;
//           fill: none;
//           stroke: currentColor;
//           stroke-width: 2;
//         }

//         .otpScreen h2 {
//           margin: 0;
//           color: #202020;
//           font-family: Georgia, serif;
//           font-size: 27px;
//           font-weight: 500;
//         }

//         .otpScreen p {
//           margin: 9px 0 21px;
//           color: #77716c;
//           font-size: 13px;
//           line-height: 1.55;
//         }

//         .otpBoxes {
//           display: grid;
//           grid-template-columns: repeat(6, 1fr);
//           gap: 7px;
//           margin-bottom: 14px;
//         }

//         .otpBoxes input {
//           width: 100%;
//           height: 53px;
//           border: 1px solid #cec8c2;
//           border-radius: 11px;
//           background: #fff;
//           outline: 0;
//           text-align: center;
//           font-size: 19px;
//           font-weight: 750;
//           color: #24211f;
//         }

//         .otpBoxes input:focus {
//           border-color: #f97316;
//         }

//         .otpBottom {
//           display: flex;
//           justify-content: space-between;
//           margin-top: 16px;
//         }

//         .otpBottom button {
//           border: 0;
//           background: transparent;
//           padding: 2px;
//           color: #56514d;
//           font-size: 11px;
//           font-weight: 650;
//         }

//         .otpBottom button:last-child {
//           color: #f97316;
//         }

//         .otpBottom button:disabled {
//           color: #aaa39d;
//         }

//         .done {
//           text-align: center;
//           padding: 19px 5px 8px;
//         }

//         .doneIcon {
//           width: 62px;
//           height: 62px;
//           margin: 0 auto 18px;
//           display: grid;
//           place-items: center;
//           border-radius: 19px;
//           color: #34794d;
//           background: #eff9f2;
//         }

//         .doneIcon svg {
//           width: 25px;
//           fill: none;
//           stroke: currentColor;
//           stroke-width: 2;
//         }

//         .done h2 {
//           margin: 0 0 7px;
//           font-family: Georgia, serif;
//           font-size: 28px;
//           font-weight: 500;
//           color: #202020;
//         }

//         .done p {
//           margin: 0 0 22px;
//           color: #77716c;
//           font-size: 13px;
//         }

//         .footer {
//           margin-top: 20px;
//           padding-top: 15px;
//           border-top: 1px solid #ebe6e0;
//           text-align: center;
//           color: #817b75;
//           font-size: 11px;
//         }

//         .footer button {
//           border: 0;
//           padding: 0;
//           background: transparent;
//           color: #393532;
//           font-weight: 700;
//           text-decoration: underline;
//         }

//         @media (max-width: 480px) {
//           .propertyCard {
//             width: 190px;
//             min-width: 190px;
//             height: 135px;
//           }

//           .propertyRow {
//             gap: 11px;
//           }

//           .propertyBackground {
//             gap: 11px;
//           }

//           .modal {
//             max-width: 100%;
//             padding: 29px 20px 20px;
//             border-radius: 23px;
//           }

//           .loginHeader h2 {
//             font-size: 24px;
//           }

//           .otpBoxes {
//             gap: 5px;
//           }

//           .otpBoxes input {
//             height: 48px;
//           }
//         }
//       `}</style>

//       <div className="loginPage">
//         <div className="propertyBackground">
//           {[0, 1, 2].map((row) => {
//             const rowProperties = properties.slice(row * 7, row * 7 + 7);

//             return (
//               <div className="propertyRow" key={row}>
//                 {rowProperties.map((property, index) => (
//                   <div className="propertyCard" key={`original-${index}`}>
//                     <img src={property.image} alt={property.name} />

//                     <div className="propertyDetails">
//                       <h3>{property.name}</h3>

//                       <div className="propertyLocation">
//                         {property.location}
//                       </div>

//                       <div className="propertyMeta">
//                         <span>
//                           {property.type} • {property.guests}
//                         </span>

//                         <span className="propertyPrice">
//                           {property.price}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 ))}

//                 {rowProperties.map((property, index) => (
//                   <div className="propertyCard" key={`duplicate-${index}`}>
//                     <img src={property.image} alt={property.name} />

//                     <div className="propertyDetails">
//                       <h3>{property.name}</h3>

//                       <div className="propertyLocation">
//                         {property.location}
//                       </div>

//                       <div className="propertyMeta">
//                         <span>
//                           {property.type} • {property.guests}
//                         </span>

//                         <span className="propertyPrice">
//                           {property.price}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             );
//           })}
//         </div>

//         <div className="backgroundShade" />

//         {showLogin && (
//           <div className="overlay">
//             <div className="modal">
//               <button
//                 className="close"
//                 type="button"
//                 onClick={() => setShowLogin(false)}
//                 aria-label="Close"
//               >
//                 <CloseIcon />
//               </button>

//               {step === "login" && (
//                 <>
//                   <div className="loginHeader">
//                     <div className="miniLogo">
//                       <LoginIcon />
//                     </div>

//                     <h2>Log in or sign up</h2>

//                     <p>
//                       Welcome back. Enter your details to continue.
//                     </p>
//                   </div>

//                   <form onSubmit={continueLogin}>
//                     <label className="label">
//                       Phone number or email
//                     </label>

//                     <div className="input">
//                       <div className="inputIcon">
//                         <LoginIcon />
//                       </div>

//                       <input
//                         autoFocus
//                         type="text"
//                         value={value}
//                         onChange={(e) => {
//                           setValue(e.target.value);
//                           setError("");
//                         }}
//                         placeholder="Phone number or email"
//                         autoComplete="username"
//                       />
//                     </div>

//                     <div className="terms">
//                       By continuing, you agree to our{" "}
//                       <a href="#">Terms of Service</a> and{" "}
//                       <a href="#">Privacy Policy</a>.
//                     </div>

//                     {error && <div className="error">{error}</div>}

//                     <button
//                       className="continue"
//                       type="submit"
//                     >
//                       Continue
//                       <ArrowIcon />
//                     </button>
//                   </form>

//                   <div className="divider">or</div>

//                   <div className="socialIcons">
//                     <button
//                       type="button"
//                       className="socialIcon"
//                       aria-label="Continue with Google"
//                     >
//                       <GoogleIcon />
//                     </button>

//                     <button
//                       type="button"
//                       className="socialIcon"
//                       aria-label="Continue with Apple"
//                     >
//                       <AppleIcon />
//                     </button>
//                   </div>
//                 </>
//               )}

//               {step === "otp" && (
//                 <form
//                   className="otpScreen"
//                   onSubmit={verifyOTP}
//                 >
//                   <div className="otpLogo">
//                     <CheckIcon />
//                   </div>

//                   <h2>Enter the code</h2>

//                   <p>
//                     We've sent a verification code to
//                     <br />
//                     <strong>{value}</strong>
//                   </p>

//                   <div className="otpBoxes">
//                     {otp.map((digit, index) => (
//                       <input
//                         key={index}
//                         ref={(el) => (otpRefs.current[index] = el)}
//                         value={digit}
//                         maxLength={1}
//                         inputMode="numeric"
//                         onChange={(e) =>
//                           changeOTP(index, e.target.value)
//                         }
//                         onKeyDown={(e) =>
//                           otpKeyDown(index, e)
//                         }
//                       />
//                     ))}
//                   </div>

//                   {error && <div className="error">{error}</div>}

//                   <button
//                     className="continue"
//                     type="submit"
//                   >
//                     Done
//                     <ArrowIcon />
//                   </button>

//                   <div className="otpBottom">
//                     <button
//                       type="button"
//                       onClick={() => {
//                         setStep("login");
//                         setError("");
//                       }}
//                     >
//                       ← Change
//                     </button>

//                     <button
//                       type="button"
//                       disabled={seconds > 0}
//                       onClick={resendOTP}
//                     >
//                       {seconds > 0
//                         ? `Resend in ${seconds}s`
//                         : "Resend code"}
//                     </button>
//                   </div>
//                 </form>
//               )}

//               {step === "done" && (
//                 <div className="done">
//                   <div className="doneIcon">
//                     <CheckIcon />
//                   </div>

//                   <h2>You're all set!</h2>

//                   <p>
//                     Your account has been successfully verified.
//                   </p>

//                   <button
//                     type="button"
//                     className="continue"
//                     onClick={() => {
//                       navigate("/guest-dashboard");
//                     }}
//                   >
//                     Go to Guest Dashboard
//                     <ArrowIcon />
//                   </button>
//                 </div>
//               )}

//               {step !== "done" && (
//                 <div className="footer">
//                   New to Take On BnB?{" "}
//                   <button
//                     type="button"
//                     onClick={() => navigate("/signup")}
//                   >
//                     Create an account
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// }





















// import React, { useEffect, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";

// export default function LoginPage() {
//   console.log("🔥 LOGIN PAGE LOADED");

//   const [showLogin, setShowLogin] = useState(true);
//   const [step, setStep] = useState("login");
//   const [value, setValue] = useState("");
//   const [otp, setOtp] = useState(["", "", "", "", "", ""]);
//   const [error, setError] = useState("");
//   const [seconds, setSeconds] = useState(30);

//   const navigate = useNavigate();
//   const otpRefs = useRef([]);

//   const properties = [
//     {
//       name: "Luxury Valley Villa",
//       location: "Rajpur Road, Dehradun",
//       type: "Villa",
//       guests: "6 Guests",
//       price: "₹4,999/night",
//       image:
//         "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=80",
//     },
//     {
//       name: "The Forest Retreat",
//       location: "Sahastradhara Road, Dehradun",
//       type: "Resort",
//       guests: "4 Guests",
//       price: "₹3,499/night",
//       image:
//         "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=900&q=80",
//     },
//     {
//       name: "Green View Apartment",
//       location: "Canal Road, Dehradun",
//       type: "2 BHK",
//       guests: "4 Guests",
//       price: "₹2,499/night",
//       image:
//         "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=900&q=80",
//     },
//     {
//       name: "Mountain Mist Villa",
//       location: "Jakhan, Dehradun",
//       type: "Villa",
//       guests: "8 Guests",
//       price: "₹5,999/night",
//       image:
//         "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80",
//     },
//     {
//       name: "Urban Nest Stay",
//       location: "GMS Road, Dehradun",
//       type: "1 BHK",
//       guests: "2 Guests",
//       price: "₹1,899/night",
//       image:
//         "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=80",
//     },
//     {
//       name: "Hillside Haven",
//       location: "Maldevta, Dehradun",
//       type: "Villa",
//       guests: "6 Guests",
//       price: "₹4,499/night",
//       image:
//         "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=900&q=80",
//     },
//     {
//       name: "Royal Garden Stay",
//       location: "Rajpur Road, Dehradun",
//       type: "3 BHK",
//       guests: "6 Guests",
//       price: "₹3,999/night",
//       image:
//         "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80",
//     },
//     {
//       name: "Pine Valley Resort",
//       location: "Sinola, Dehradun",
//       type: "Resort",
//       guests: "4 Guests",
//       price: "₹3,799/night",
//       image:
//         "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=900&q=80",
//     },
//     {
//       name: "The Dehradun House",
//       location: "Jakhan, Dehradun",
//       type: "2 BHK",
//       guests: "4 Guests",
//       price: "₹2,799/night",
//       image:
//         "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=80",
//     },
//     {
//       name: "Valley Breeze Villa",
//       location: "Bhagwant Pur, Dehradun",
//       type: "Villa",
//       guests: "8 Guests",
//       price: "₹5,499/night",
//       image:
//         "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=900&q=80",
//     },
//     {
//       name: "Cozy Corner BnB",
//       location: "GMS Road, Dehradun",
//       type: "1 BHK",
//       guests: "2 Guests",
//       price: "₹1,699/night",
//       image:
//         "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=80",
//     },
//     {
//       name: "Sunset Valley Home",
//       location: "Canal Road, Dehradun",
//       type: "3 BHK",
//       guests: "6 Guests",
//       price: "₹3,299/night",
//       image:
//         "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=80",
//     },
//     {
//       name: "Oakwood Retreat",
//       location: "Kimadi, Dehradun",
//       type: "Villa",
//       guests: "6 Guests",
//       price: "₹4,799/night",
//       image:
//         "https://images.unsplash.com/photo-1600585152915-d208bec867a1?auto=format&fit=crop&w=900&q=80",
//     },
//     {
//       name: "The Orange Nest",
//       location: "Sahastradhara Road, Dehradun",
//       type: "2 BHK",
//       guests: "4 Guests",
//       price: "₹2,599/night",
//       image:
//         "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=900&q=80",
//     },
//     {
//       name: "Himalayan Pearl Villa",
//       location: "Maldevta, Dehradun",
//       type: "Villa",
//       guests: "8 Guests",
//       price: "₹6,499/night",
//       image:
//         "https://images.unsplash.com/photo-1600047509782-20d39509f26d?auto=format&fit=crop&w=900&q=80",
//     },
//     {
//       name: "Valley View BnB",
//       location: "Thano, Dehradun",
//       type: "1 BHK",
//       guests: "2 Guests",
//       price: "₹1,799/night",
//       image:
//         "https://images.unsplash.com/photo-1600566753051-f0b89df2dd90?auto=format&fit=crop&w=900&q=80",
//     },
//     {
//       name: "Mountain Pearl Resort",
//       location: "Bhagwant Pur, Dehradun",
//       type: "Resort",
//       guests: "6 Guests",
//       price: "₹4,299/night",
//       image:
//         "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80",
//     },
//     {
//       name: "Modern Hills Apartment",
//       location: "Canal Road, Dehradun",
//       type: "2 BHK",
//       guests: "4 Guests",
//       price: "₹2,299/night",
//       image:
//         "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=900&q=80",
//     },
//     {
//       name: "Luxury Pine House",
//       location: "Kimadi, Dehradun",
//       type: "3 BHK",
//       guests: "6 Guests",
//       price: "₹3,899/night",
//       image:
//         "https://images.unsplash.com/photo-1600585154363-67c6f8f3f3a8?auto=format&fit=crop&w=900&q=80",
//     },
//     {
//       name: "Garden Escape Villa",
//       location: "Sinola, Dehradun",
//       type: "Villa",
//       guests: "6 Guests",
//       price: "₹4,699/night",
//       image:
//         "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=900&q=80",
//     },
//     {
//       name: "City Comfort Stay",
//       location: "GMS Road, Dehradun",
//       type: "1 BHK",
//       guests: "2 Guests",
//       price: "₹1,599/night",
//       image:
//         "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=80",
//     },
//   ];

//   useEffect(() => {
//     if (step !== "otp" || seconds <= 0) return;

//     const timer = setInterval(() => {
//       setSeconds((currentSeconds) => currentSeconds - 1);
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [step, seconds]);











//   const CloseIcon = () => (
//     <svg viewBox="0 0 24 24">
//       <path d="M6 6L18 18M18 6L6 18" />
//     </svg>
//   );

//   const LoginIcon = () => (
//     <svg viewBox="0 0 24 24">
//       <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v13a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 18.5z" />
//       <path d="M12 12h8M16 8l4 4-4 4" />
//     </svg>
//   );

//   const ArrowIcon = () => (
//     <svg viewBox="0 0 24 24">
//       <path d="M5 12h13M13 6l6 6-6 6" />
//     </svg>
//   );

//   const CheckIcon = () => (
//     <svg viewBox="0 0 24 24">
//       <path d="M5 12.5l4.2 4.2L19 7" />
//     </svg>
//   );

//   const GoogleIcon = () => (
//     <svg viewBox="0 0 24 24">
//       <path
//         fill="#4285F4"
//         d="M21.35 12.23c0-.7-.06-1.37-.18-2H12v3.79h5.22a4.46 4.46 0 0 1-1.94 2.92v2.43h3.14c1.84-1.69 2.93-4.18 2.93-7.14Z"
//       />
//       <path
//         fill="#34A853"
//         d="M12 21.6c2.63 0 4.84-.87 6.45-2.36l-3.14-2.43c-.87.58-1.98.92-3.31.92-2.54 0-4.7-1.72-5.47-4.03H3.28v2.5A9.74 9.74 0 0 0 12 21.6Z"
//       />
//       <path
//         fill="#FBBC05"
//         d="M6.53 13.7A5.85 5.85 0 0 1 6.22 12c0-.59.11-1.16.31-1.7V7.8H3.28A9.6 9.6 0 0 0 2.25 12c0 1.52.36 2.95 1.03 4.2l3.25-2.5Z"
//       />
//       <path
//         fill="#EA4335"
//         d="M12 6.27c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.84 3.37 14.63 2.4 12 2.4a9.74 9.74 0 0 0-8.72 5.4l3.25 2.5c.77-2.31 2.93-4.03 5.47-4.03Z"
//       />
//     </svg>
//   );

//   const AppleIcon = () => (
//     <svg viewBox="0 0 24 24">
//       <path
//         fill="currentColor"
//         d="M16.77 12.62c.02 2.05 1.8 2.73 1.82 2.74-.02.05-.28.97-.94 1.92-.56.81-1.14 1.62-2.06 1.64-.9.02-1.2-.53-2.24-.53-1.05 0-1.38.51-2.23.55-.9.03-1.58-.88-2.15-1.69-1.17-1.7-2.06-4.8-.86-6.89.6-1.04 1.58-1.69 2.65-1.71.84-.02 1.63.57 2.24.57.61 0 1.75-.7 2.94-.6.5.02 1.91.2 2.81 1.53-.07.04-1.68.98-1.66 2.47ZM14.83 7.39c.54-.65.9-1.56.8-2.46-.78.03-1.72.52-2.28 1.17-.5.57-.93 1.49-.81 2.37.87.07 1.75-.44 2.29-1.08Z"
//       />
//     </svg>
//   );

//   const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   const isValidPhone = /^[+]?[0-9\s()-]{8,18}$/;

//   const continueLogin = (event) => {
//     event.preventDefault();
//     setError("");

//     const cleanValue = value.trim();

//     if (!cleanValue) {
//       setError("Please enter your phone number or email.");
//       return;
//     }

//     if (cleanValue.includes("@")) {
//       if (!isValidEmail.test(cleanValue)) {
//         setError("Please enter a valid email address.");
//         return;
//       }
//     } else if (!isValidPhone.test(cleanValue)) {
//       setError("Please enter a valid phone number.");
//       return;
//     }

//     setOtp(["", "", "", "", "", ""]);
//     setSeconds(30);
//     setStep("otp");

//     setTimeout(() => {
//       otpRefs.current[0]?.focus();
//     }, 150);
//   };

//   const changeOTP = (index, text) => {
//     const digit = text.replace(/\D/g, "").slice(-1);
//     const nextOtp = [...otp];

//     nextOtp[index] = digit;
//     setOtp(nextOtp);
//     setError("");

//     if (digit && index < 5) {
//       otpRefs.current[index + 1]?.focus();
//     }
//   };

//   const otpKeyDown = (index, event) => {
//     if (event.key === "Backspace" && !otp[index] && index > 0) {
//       otpRefs.current[index - 1]?.focus();
//     }
//   };

//   // const verifyOTP = (event) => {
//   //   event.preventDefault();

//   //   const code = otp.join("");

//   //   if (code.length !== 6) {
//   //     setError("Please enter the 6-digit code.");
//   //     return;
//   //   }

//   //   if (code !== "123456") {
//   //     setError("For preview, enter 123456.");
//   //     return;
//   //   }

//   //   setError("");
//   //   setStep("done");

//   //   setTimeout(() => {
//   //     navigate("/guest-dashboard");
//   //   }, 800);
//   // };

// const verifyOTP = (e) => {
//   e.preventDefault();

//   const code = otp.join("");

//   if (code.length !== 6) {
//     setError("Please enter the 6-digit code.");
//     return;
//   }

//   if (code !== "123456") {
//     setError("For preview, enter 123456.");
//     return;
//   }

//   navigate("/guest-dashboard");
// };














//   const resendOTP = () => {
//     if (seconds > 0) return;

//     setOtp(["", "", "", "", "", ""]);
//     setError("");
//     setSeconds(30);

//     setTimeout(() => {
//       otpRefs.current[0]?.focus();
//     }, 100);
//   };

//   const redirectToGuestDashboard = () => {
//     navigate("/guest-dashboard");
//   };

//   return (
//     <>
//       <style>{`
//         * {
//           box-sizing: border-box;
//         }

//         html,
//         body,
//         #root {
//           margin: 0;
//           min-height: 100%;
//         }

//         body {
//           font-family: Inter, ui-sans-serif, system-ui, -apple-system,
//             BlinkMacSystemFont, "Segoe UI", sans-serif;
//           color: #1f1f1f;
//           background: #f6f3ef;
//         }

//         button,
//         input {
//           font-family: inherit;
//         }

//         button {
//           cursor: pointer;
//         }

//         .loginPage {
//           min-height: 100vh;
//           width: 100%;
//           position: relative;
//           overflow: hidden;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           padding: 20px;
//           background: #eee9e3;
//         }

//         .propertyBackground {
//           position: absolute;
//           inset: 0;
//           width: 100%;
//           height: 100%;
//           overflow: hidden;
//           display: flex;
//           flex-direction: column;
//           justify-content: center;
//           gap: 18px;
//           padding: 20px 0;
//           background: #eee9e3;
//           z-index: 1;
//         }

//         .propertyRow {
//           display: flex;
//           width: max-content;
//           gap: 16px;
//           animation: propertyMove 42s linear infinite;
//         }

//         .propertyRow:nth-child(2) {
//           animation-duration: 48s;
//           animation-direction: reverse;
//         }

//         .propertyRow:nth-child(3) {
//           animation-duration: 44s;
//         }

//         @keyframes propertyMove {
//           from {
//             transform: translateX(0);
//           }

//           to {
//             transform: translateX(-50%);
//           }
//         }

//         .propertyCard {
//           width: 245px;
//           min-width: 245px;
//           height: 155px;
//           position: relative;
//           overflow: hidden;
//           border-radius: 18px;
//           background: #fff;
//           box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
//           border: 1px solid rgba(255, 255, 255, 0.8);
//         }

//         .propertyCard img {
//           width: 100%;
//           height: 100%;
//           object-fit: cover;
//           display: block;
//         }

//         .propertyCard::after {
//           content: "";
//           position: absolute;
//           inset: 0;
//           background: linear-gradient(
//             to top,
//             rgba(0, 0, 0, 0.78),
//             rgba(0, 0, 0, 0.04) 70%
//           );
//         }

//         .propertyDetails {
//           position: absolute;
//           left: 13px;
//           right: 13px;
//           bottom: 11px;
//           z-index: 2;
//           color: #fff;
//         }

//         .propertyDetails h3 {
//           margin: 0 0 3px;
//           font-size: 13px;
//           font-weight: 750;
//           white-space: nowrap;
//           overflow: hidden;
//           text-overflow: ellipsis;
//         }

//         .propertyLocation {
//           margin: 0 0 5px;
//           font-size: 10px;
//           opacity: 0.88;
//           white-space: nowrap;
//           overflow: hidden;
//           text-overflow: ellipsis;
//         }

//         .propertyMeta {
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//           gap: 8px;
//           font-size: 9px;
//           opacity: 0.95;
//         }

//         .propertyPrice {
//           font-weight: 800;
//         }

//         .backgroundShade {
//           position: absolute;
//           inset: 0;
//           z-index: 2;
//           background: rgba(25, 21, 18, 0.10);
//           backdrop-filter: blur(0.8px);
//         }

//         .overlay {
//           position: fixed;
//           inset: 0;
//           z-index: 1000;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           padding: 20px;
//           background: rgba(18, 16, 15, 0.38);
//           backdrop-filter: blur(4px);
//         }

//         .modal {
//           width: 100%;
//           max-width: 445px;
//           position: relative;
//           overflow: hidden;
//           border-radius: 27px;
//           padding: 31px 30px 22px;
//           background: linear-gradient(
//             145deg,
//             rgba(255, 255, 255, 0.99),
//             rgba(251, 249, 246, 0.99)
//           );
//           border: 1px solid rgba(255, 255, 255, 0.85);
//           box-shadow:
//             0 45px 110px rgba(0, 0, 0, 0.30),
//             0 12px 35px rgba(0, 0, 0, 0.10);
//           animation: modalIn 0.25s cubic-bezier(.2, .8, .2, 1);
//         }

//         .modal::before {
//           content: "";
//           position: absolute;
//           left: 0;
//           right: 0;
//           top: 0;
//           height: 3px;
//           background: linear-gradient(
//             90deg,
//             #ff9f43,
//             #f97316,
//             #ffb15c
//           );
//         }

//         @keyframes modalIn {
//           from {
//             opacity: 0;
//             transform: translateY(12px) scale(.975);
//           }

//           to {
//             opacity: 1;
//             transform: translateY(0) scale(1);
//           }
//         }

//         .close {
//           position: absolute;
//           top: 17px;
//           left: 17px;
//           width: 33px;
//           height: 33px;
//           border-radius: 50%;
//           border: 1px solid #e4dfd9;
//           background: rgba(255, 255, 255, 0.85);
//           display: grid;
//           place-items: center;
//           z-index: 5;
//           transition: 0.18s;
//         }

//         .close:hover {
//           transform: rotate(5deg);
//           background: #f7f4f0;
//           border-color: #d3cdc6;
//         }

//         .close svg {
//           width: 16px;
//           fill: none;
//           stroke: #333;
//           stroke-width: 1.7;
//         }

//         .loginHeader {
//           text-align: center;
//           padding: 8px 20px 23px;
//         }

//         .miniLogo {
//           width: 45px;
//           height: 45px;
//           margin: 0 auto 15px;
//           border-radius: 15px;
//           display: grid;
//           place-items: center;
//           color: #f97316;
//           background: linear-gradient(
//             145deg,
//             #fff7ed,
//             #ffedd5
//           );
//           box-shadow:
//             0 8px 20px rgba(249, 115, 22, 0.09),
//             inset 0 0 0 1px rgba(249, 115, 22, 0.05);
//         }

//         .miniLogo svg {
//           width: 20px;
//           fill: none;
//           stroke: currentColor;
//           stroke-width: 1.6;
//         }

//         .loginHeader h2 {
//           margin: 0;
//           color: #202020;
//           font-family: Georgia, serif;
//           font-size: 27px;
//           font-weight: 500;
//           letter-spacing: -.7px;
//         }

//         .loginHeader p {
//           margin: 9px 0 0;
//           color: #77716c;
//           font-size: 13px;
//           line-height: 1.55;
//         }

//         .label {
//           display: block;
//           margin-bottom: 7px;
//           color: #373330;
//           font-size: 12px;
//           font-weight: 750;
//         }

//         .input {
//           height: 55px;
//           display: flex;
//           align-items: center;
//           padding: 0 14px;
//           border-radius: 12px;
//           background: #fff;
//           border: 1px solid #cec8c2;
//           box-shadow: 0 2px 7px rgba(0, 0, 0, .025);
//           transition: .18s;
//         }

//         .input:focus-within {
//           border-color: #f97316;
//           box-shadow:
//             0 0 0 3px rgba(249, 115, 22, .075),
//             0 5px 15px rgba(0, 0, 0, .035);
//         }

//         .inputIcon {
//           width: 18px;
//           height: 18px;
//           margin-right: 10px;
//           color: #77716d;
//           flex-shrink: 0;
//         }

//         .inputIcon svg {
//           width: 100%;
//           height: 100%;
//           fill: none;
//           stroke: currentColor;
//           stroke-width: 1.7;
//         }

//         .input input {
//           flex: 1;
//           min-width: 0;
//           height: 100%;
//           border: 0;
//           outline: 0;
//           background: transparent;
//           color: #222;
//           font-size: 14px;
//         }

//         .input input::placeholder {
//           color: #aaa39d;
//         }

//         .terms {
//           margin: 9px 1px 15px;
//           color: #88817c;
//           font-size: 10.5px;
//           line-height: 1.5;
//         }

//         .terms a {
//           color: #4c4844;
//           font-weight: 650;
//         }

//         .error {
//           margin-bottom: 12px;
//           padding: 9px 10px;
//           border-radius: 9px;
//           border: 1px solid #f0d5da;
//           background: #fff2f4;
//           color: #a63c51;
//           font-size: 11px;
//         }

//         .continue {
//           width: 100%;
//           height: 51px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           gap: 9px;
//           border: 0;
//           border-radius: 12px;
//           color: white;
//           background: linear-gradient(
//             135deg,
//             #ff9f43 0%,
//             #f97316 100%
//           );
//           font-size: 14px;
//           font-weight: 750;
//           box-shadow: 0 10px 25px rgba(249, 115, 22, .19);
//           transition: transform .18s, box-shadow .18s;
//         }

//         .continue:hover {
//           transform: translateY(-1px);
//           box-shadow: 0 13px 29px rgba(249, 115, 22, .25);
//         }

//         .continue:active {
//           transform: translateY(0);
//         }

//         .continue svg {
//           width: 17px;
//           fill: none;
//           stroke: currentColor;
//           stroke-width: 1.8;
//         }

//         .divider {
//           display: flex;
//           align-items: center;
//           gap: 12px;
//           margin: 19px 0 15px;
//           color: #aaa29b;
//           font-size: 11px;
//         }

//         .divider::before,
//         .divider::after {
//           content: "";
//           flex: 1;
//           height: 1px;
//           background: linear-gradient(
//             90deg,
//             transparent,
//             #dfd9d3
//           );
//         }

//         .divider::after {
//           background: linear-gradient(
//             90deg,
//             #dfd9d3,
//             transparent
//           );
//         }

//         .socialIcons {
//           display: flex;
//           justify-content: center;
//           gap: 18px;
//         }

//         .socialIcon {
//           width: 45px;
//           height: 45px;
//           display: grid;
//           place-items: center;
//           border-radius: 50%;
//           border: 1px solid #ddd7d1;
//           background: #fff;
//           color: #222;
//           box-shadow: 0 4px 12px rgba(0, 0, 0, .035);
//           transition: .18s;
//         }

//         .socialIcon:hover {
//           transform: translateY(-2px);
//           background: #faf8f5;
//           border-color: #c9c2bb;
//           box-shadow: 0 8px 18px rgba(0, 0, 0, .07);
//         }

//         .socialIcon svg {
//           width: 19px;
//           height: 19px;
//         }

//         .otpScreen {
//           text-align: center;
//           padding: 11px 4px 5px;
//         }

//         .otpLogo {
//           width: 48px;
//           height: 48px;
//           margin: 0 auto 16px;
//           display: grid;
//           place-items: center;
//           border-radius: 15px;
//           color: #34794d;
//           background: linear-gradient(
//             145deg,
//             #eff9f2,
//             #e2f1e7
//           );
//           box-shadow: 0 8px 20px rgba(52, 121, 77, .08);
//         }

//         .otpLogo svg {
//           width: 22px;
//           fill: none;
//           stroke: currentColor;
//           stroke-width: 2;
//         }

//         .otpScreen h2 {
//           margin: 0;
//           color: #202020;
//           font-family: Georgia, serif;
//           font-size: 27px;
//           font-weight: 500;
//           letter-spacing: -.5px;
//         }

//         .otpScreen p {
//           margin: 9px 0 21px;
//           color: #77716c;
//           font-size: 13px;
//           line-height: 1.55;
//         }

//         .otpScreen strong {
//           color: #282522;
//         }

//         .otpBoxes {
//           display: grid;
//           grid-template-columns: repeat(6, 1fr);
//           gap: 7px;
//           margin-bottom: 14px;
//         }

//         .otpBoxes input {
//           width: 100%;
//           height: 53px;
//           border: 1px solid #cec8c2;
//           border-radius: 11px;
//           background: #fff;
//           outline: 0;
//           text-align: center;
//           font-size: 19px;
//           font-weight: 750;
//           color: #24211f;
//           transition: .18s;
//           box-shadow: 0 2px 7px rgba(0, 0, 0, .025);
//         }

//         .otpBoxes input:focus {
//           border-color: #f97316;
//           box-shadow: 0 0 0 3px rgba(249, 115, 22, .075);
//         }

//         .otpBottom {
//           display: flex;
//           justify-content: space-between;
//           margin-top: 16px;
//         }

//         .otpBottom button {
//           border: 0;
//           background: transparent;
//           padding: 2px;
//           color: #56514d;
//           font-size: 11px;
//           font-weight: 650;
//         }

//         .otpBottom button:last-child {
//           color: #f97316;
//         }

//         .otpBottom button:disabled {
//           color: #aaa39d;
//         }

//         .done {
//           text-align: center;
//           padding: 19px 5px 8px;
//         }

//         .doneIcon {
//           width: 62px;
//           height: 62px;
//           margin: 0 auto 18px;
//           display: grid;
//           place-items: center;
//           border-radius: 19px;
//           color: #34794d;
//           background: linear-gradient(
//             145deg,
//             #eff9f2,
//             #e1f1e7
//           );
//           box-shadow: 0 10px 25px rgba(52, 121, 77, .09);
//         }

//         .doneIcon svg {
//           width: 25px;
//           fill: none;
//           stroke: currentColor;
//           stroke-width: 2;
//         }

//         .done h2 {
//           margin: 0 0 7px;
//           font-family: Georgia, serif;
//           font-size: 28px;
//           font-weight: 500;
//           color: #202020;
//         }

//         .done p {
//           margin: 0 0 22px;
//           color: #77716c;
//           font-size: 13px;
//         }

//         .footer {
//           margin-top: 20px;
//           padding-top: 15px;
//           border-top: 1px solid #ebe6e0;
//           text-align: center;
//           color: #817b75;
//           font-size: 11px;
//         }

//         .footer button {
//           border: 0;
//           padding: 0;
//           background: transparent;
//           color: #393532;
//           font-weight: 700;
//           text-decoration: underline;
//           text-underline-offset: 2px;
//         }

//         @media (max-width: 480px) {
//           .propertyCard {
//             width: 190px;
//             min-width: 190px;
//             height: 135px;
//           }

//           .propertyRow {
//             gap: 11px;
//           }

//           .propertyBackground {
//             gap: 11px;
//           }

//           .modal {
//             max-width: 100%;
//             padding: 29px 20px 20px;
//             border-radius: 23px;
//           }

//           .loginHeader {
//             padding-bottom: 20px;
//           }

//           .loginHeader h2 {
//             font-size: 24px;
//           }

//           .otpBoxes {
//             gap: 5px;
//           }

//           .otpBoxes input {
//             height: 48px;
//           }
//         }
//       `}</style>

//       <div className="loginPage">
//         <div className="propertyBackground">
//           {[0, 1, 2].map((row) => {
//             const rowProperties = properties.slice(
//               row * 7,
//               row * 7 + 7
//             );

//             return (
//               <div className="propertyRow" key={row}>
//                 {[...rowProperties, ...rowProperties].map(
//                   (property, index) => (
//                     <div
//                       className="propertyCard"
//                       key={`${row}-${index}`}
//                     >
//                       <img
//                         src={property.image}
//                         alt={property.name}
//                       />

//                       <div className="propertyDetails">
//                         <h3>{property.name}</h3>

//                         <div className="propertyLocation">
//                           {property.location}
//                         </div>

//                         <div className="propertyMeta">
//                           <span>
//                             {property.type} • {property.guests}
//                           </span>

//                           <span className="propertyPrice">
//                             {property.price}
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   )
//                 )}
//               </div>
//             );
//           })}
//         </div>

//         <div className="backgroundShade" />

//         {showLogin && (
//           <div className="overlay">
//             <div className="modal">
//               <button
//                 className="close"
//                 onClick={() => setShowLogin(false)}
//                 aria-label="Close"
//               >
//                 <CloseIcon />
//               </button>

//               {step === "login" && (
//                 <>
//                   <div className="loginHeader">
//                     <div className="miniLogo">
//                       <LoginIcon />
//                     </div>

//                     <h2>Log in or sign up</h2>

//                     <p>
//                       Welcome back. Enter your details
//                       <br />
//                       to continue.
//                     </p>
//                   </div>

//                   <form onSubmit={continueLogin}>
//                     <label className="label">
//                       Phone number or email
//                     </label>

//                     <div className="input">
//                       <div className="inputIcon">
//                         <LoginIcon />
//                       </div>

//                       <input
//                         autoFocus
//                         type="text"
//                         value={value}
//                         onChange={(event) => {
//                           setValue(event.target.value);
//                           setError("");
//                         }}
//                         placeholder="Phone number or email"
//                         autoComplete="username"
//                       />
//                     </div>

//                     <div className="terms">
//                       By continuing, you agree to our{" "}
//                       <a href="#">Terms of Service</a> and{" "}
//                       <a href="#">Privacy Policy</a>.
//                     </div>

//                     {error && (
//                       <div className="error">{error}</div>
//                     )}






//                     {/* <button
//                       className="continue"
//                       type="submit"
//                     >
//                       Continue
//                       <ArrowIcon />
//                     </button> */}




//                     <button
//   className="continue"
//   onClick={() => navigate("/guest-dashboard")}
// >
//   Continue
//   <ArrowIcon />
// </button>




//                   </form>

//                   <div className="divider">or</div>

//                   <div className="socialIcons">
//                     <button
//                       type="button"
//                       className="socialIcon"
//                       aria-label="Continue with Google"
//                     >
//                       <GoogleIcon />
//                     </button>

//                     <button
//                       type="button"
//                       className="socialIcon"
//                       aria-label="Continue with Apple"
//                     >
//                       <AppleIcon />
//                     </button>
//                   </div>
//                 </>
//               )}

//               {step === "otp" && (
//                 <form
//                   className="otpScreen"
//                   onSubmit={verifyOTP}
//                 >
//                   <div className="otpLogo">
//                     <CheckIcon />
//                   </div>

//                   <h2>Enter the code</h2>

//                   <p>
//                     We've sent a verification code to
//                     <br />
//                     <strong>{value}</strong>
//                   </p>

//                   <div className="otpBoxes">
//                     {otp.map((digit, index) => (
//                       <input
//                         key={index}
//                         ref={(element) => {
//                           otpRefs.current[index] = element;
//                         }}
//                         value={digit}
//                         maxLength={1}
//                         inputMode="numeric"
//                         onChange={(event) =>
//                           changeOTP(
//                             index,
//                             event.target.value
//                           )
//                         }
//                         onKeyDown={(event) =>
//                           otpKeyDown(index, event)
//                         }
//                       />
//                     ))}
//                   </div>

//                   {error && (
//                     <div className="error">{error}</div>
//                   )}

//                   <button
//                     className="continue"
//                     type="submit"
//                   >
//                     Verify & Continue
//                     <ArrowIcon />
//                   </button>

//                   <div className="otpBottom">
//                     <button
//                       type="button"
//                       onClick={() => {
//                         setStep("login");
//                         setError("");
//                       }}
//                     >
//                       ← Change
//                     </button>

//                     <button
//                       type="button"
//                       disabled={seconds > 0}
//                       onClick={resendOTP}
//                     >
//                       {seconds > 0
//                         ? `Resend in ${seconds}s`
//                         : "Resend code"}
//                     </button>
//                   </div>
//                 </form>
//               )}

//               {step === "done" && (
//                 <div className="done">
//                   <div className="doneIcon">
//                     <CheckIcon />
//                   </div>

//                   <h2>You're all set!</h2>

//                   <p>
//                     Your account has been successfully
//                     verified.
//                   </p>

//                   <button
//                     className="continue"
//                     onClick={redirectToGuestDashboard}
//                   >
//                     Go to My Bookings
//                     <ArrowIcon />
//                   </button>
//                 </div>
//               )}

//               {step !== "done" && (
//                 <div className="footer">
//                   New to Take On BnB?{" "}
//                   <button
//                     type="button"
//                     onClick={() => navigate("/signup")}
//                   >
//                     Create an account
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// }

























import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

  const [showLogin, setShowLogin] = useState(true);
  const [step, setStep] = useState("login");
  const [value, setValue] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [seconds, setSeconds] = useState(30);

  const otpRefs = useRef([]);

  const properties = [
    {
      name: "Luxury Valley Villa",
      location: "Rajpur Road, Dehradun",
      type: "Villa",
      guests: "6 Guests",
      price: "₹4,999/night",
      image:
        "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=80",
    },
    {
      name: "The Forest Retreat",
      location: "Sahastradhara Road, Dehradun",
      type: "Resort",
      guests: "4 Guests",
      price: "₹3,499/night",
      image:
        "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=900&q=80",
    },
    {
      name: "Green View Apartment",
      location: "Canal Road, Dehradun",
      type: "2 BHK",
      guests: "4 Guests",
      price: "₹2,499/night",
      image:
        "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=900&q=80",
    },
    {
      name: "Mountain Mist Villa",
      location: "Jakhan, Dehradun",
      type: "Villa",
      guests: "8 Guests",
      price: "₹5,999/night",
      image:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80",
    },
    {
      name: "Urban Nest Stay",
      location: "GMS Road, Dehradun",
      type: "1 BHK",
      guests: "2 Guests",
      price: "₹1,899/night",
      image:
        "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=80",
    },
    {
      name: "Hillside Haven",
      location: "Maldevta, Dehradun",
      type: "Villa",
      guests: "6 Guests",
      price: "₹4,499/night",
      image:
        "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=900&q=80",
    },
    {
      name: "Royal Garden Stay",
      location: "Rajpur Road, Dehradun",
      type: "3 BHK",
      guests: "6 Guests",
      price: "₹3,999/night",
      image:
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80",
    },
    {
      name: "Pine Valley Resort",
      location: "Sinola, Dehradun",
      type: "Resort",
      guests: "4 Guests",
      price: "₹3,799/night",
      image:
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=900&q=80",
    },
    {
      name: "The Dehradun House",
      location: "Jakhan, Dehradun",
      type: "2 BHK",
      guests: "4 Guests",
      price: "₹2,799/night",
      image:
        "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=80",
    },
    {
      name: "Valley Breeze Villa",
      location: "Bhagwant Pur, Dehradun",
      type: "Villa",
      guests: "8 Guests",
      price: "₹5,499/night",
      image:
        "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=900&q=80",
    },
    {
      name: "Cozy Corner BnB",
      location: "GMS Road, Dehradun",
      type: "1 BHK",
      guests: "2 Guests",
      price: "₹1,699/night",
      image:
        "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=80",
    },
    {
      name: "Sunset Valley Home",
      location: "Canal Road, Dehradun",
      type: "3 BHK",
      guests: "6 Guests",
      price: "₹3,299/night",
      image:
        "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=80",
    },
    {
      name: "Oakwood Retreat",
      location: "Kimadi, Dehradun",
      type: "Villa",
      guests: "6 Guests",
      price: "₹4,799/night",
      image:
        "https://images.unsplash.com/photo-1600585152915-d208bec867a1?auto=format&fit=crop&w=900&q=80",
    },
    {
      name: "The Orange Nest",
      location: "Sahastradhara Road, Dehradun",
      type: "2 BHK",
      guests: "4 Guests",
      price: "₹2,599/night",
      image:
        "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=900&q=80",
    },
    {
      name: "Himalayan Pearl Villa",
      location: "Maldevta, Dehradun",
      type: "Villa",
      guests: "8 Guests",
      price: "₹6,499/night",
      image:
        "https://images.unsplash.com/photo-1600047509782-20d39509f26d?auto=format&fit=crop&w=900&q=80",
    },
    {
      name: "Valley View BnB",
      location: "Thano, Dehradun",
      type: "1 BHK",
      guests: "2 Guests",
      price: "₹1,799/night",
      image:
        "https://images.unsplash.com/photo-1600566753051-f0b89df2dd90?auto=format&fit=crop&w=900&q=80",
    },
    {
      name: "Mountain Pearl Resort",
      location: "Bhagwant Pur, Dehradun",
      type: "Resort",
      guests: "6 Guests",
      price: "₹4,299/night",
      image:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80",
    },
    {
      name: "Modern Hills Apartment",
      location: "Canal Road, Dehradun",
      type: "2 BHK",
      guests: "4 Guests",
      price: "₹2,299/night",
      image:
        "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=900&q=80",
    },
    {
      name: "Luxury Pine House",
      location: "Kimadi, Dehradun",
      type: "3 BHK",
      guests: "6 Guests",
      price: "₹3,899/night",
      image:
        "https://images.unsplash.com/photo-1600585154363-67c6f8f3f3a8?auto=format&fit=crop&w=900&q=80",
    },
    {
      name: "Garden Escape Villa",
      location: "Sinola, Dehradun",
      type: "Villa",
      guests: "6 Guests",
      price: "₹4,699/night",
      image:
        "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=900&q=80",
    },
    {
      name: "City Comfort Stay",
      location: "GMS Road, Dehradun",
      type: "1 BHK",
      guests: "2 Guests",
      price: "₹1,599/night",
      image:
        "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=80",
    },
  ];

  useEffect(() => {
    if (step !== "otp" || seconds <= 0) return;

    const timer = setInterval(() => {
      setSeconds((currentSeconds) => currentSeconds - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [step, seconds]);

  const CloseIcon = () => (
    <svg viewBox="0 0 24 24">
      <path d="M6 6L18 18M18 6L6 18" />
    </svg>
  );

  const LoginIcon = () => (
    <svg viewBox="0 0 24 24">
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v13a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 18.5z" />
      <path d="M12 12h8M16 8l4 4-4 4" />
    </svg>
  );

  const ArrowIcon = () => (
    <svg viewBox="0 0 24 24">
      <path d="M5 12h13M13 6l6 6-6 6" />
    </svg>
  );

  const CheckIcon = () => (
    <svg viewBox="0 0 24 24">
      <path d="M5 12.5l4.2 4.2L19 7" />
    </svg>
  );

  const GoogleIcon = () => (
    <svg viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M21.35 12.23c0-.7-.06-1.37-.18-2H12v3.79h5.22a4.46 4.46 0 0 1-1.94 2.92v2.43h3.14c1.84-1.69 2.93-4.18 2.93-7.14Z"
      />
      <path
        fill="#34A853"
        d="M12 21.6c2.63 0 4.84-.87 6.45-2.36l-3.14-2.43c-.87.58-1.98.92-3.31.92-2.54 0-4.7-1.72-5.47-4.03H3.28v2.5A9.74 9.74 0 0 0 12 21.6Z"
      />
      <path
        fill="#FBBC05"
        d="M6.53 13.7A5.85 5.85 0 0 1 6.22 12c0-.59.11-1.16.31-1.7V7.8H3.28A9.6 9.6 0 0 0 2.25 12c0 1.52.36 2.95 1.03 4.2l3.25-2.5Z"
      />
      <path
        fill="#EA4335"
        d="M12 6.27c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.84 3.37 14.63 2.4 12 2.4a9.74 9.74 0 0 0-8.72 5.4l3.25 2.5c.77-2.31 2.93-4.03 5.47-4.03Z"
      />
    </svg>
  );

  const AppleIcon = () => (
    <svg viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M16.77 12.62c.02 2.05 1.8 2.73 1.82 2.74-.02.05-.28.97-.94 1.92-.56.81-1.14 1.62-2.06 1.64-.9.02-1.2-.53-2.24-.53-1.05 0-1.38.51-2.23.55-.9.03-1.58-.88-2.15-1.69-1.17-1.7-2.06-4.8-.86-6.89.6-1.04 1.58-1.69 2.65-1.71.84-.02 1.63.57 2.24.57.61 0 1.75-.7 2.94-.6.5.02 1.91.2 2.81 1.53-.07.04-1.68.98-1.66 2.47ZM14.83 7.39c.54-.65.9-1.56.8-2.46-.78.03-1.72.52-2.28 1.17-.5.57-.93 1.49-.81 2.37.87.07 1.75-.44 2.29-1.08Z"
      />
    </svg>
  );

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValidPhone = /^[+]?[0-9\s()-]{8,18}$/;

  const continueLogin = (event) => {
  event.preventDefault();
  setError("");

  const cleanValue = value.trim();

  if (!cleanValue) {
    setError("Please enter your phone number or email.");
    return;
  }

  // Preview login
  // Pehle OTP screen par jayega
  setOtp(["", "", "", "", "", ""]);
  setSeconds(30);
  setStep("otp");

  setTimeout(() => {
    otpRefs.current[0]?.focus();
  }, 150);
};


  const changeOTP = (index, text) => {
    const digit = text.replace(/\D/g, "").slice(-1);

    const nextOtp = [...otp];
    nextOtp[index] = digit;

    setOtp(nextOtp);
    setError("");

    if (digit && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const otpKeyDown = (index, event) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

// const verifyOTP = (event) => {
//   event.preventDefault();

//   const code = otp.join("");

//   if (code.length !== 6) {
//     setError("Please enter the 6-digit code.");
//     return;
//   }

//   if (code !== "123456") {
//     setError("For preview, enter 123456.");
//     return;
//   }

//   setError("");
//   setStep("done");

//   setTimeout(() => {
//     navigate("/guest/dashboard", { replace: true });
//   }, 500);
// };



const verifyOTP = (e) => {
  e.preventDefault();

  const code = otp.join("");

  if (code.length !== 6) {
    setError("Please enter the 6-digit code.");
    return;
  }

  if (code !== "123456") {
    setError("For preview, enter 123456.");
    return;
  }

  setError("");

  navigate("/guest/dashboard", {
    replace: true,
  });
};
  const resendOTP = () => {
    if (seconds > 0) return;

    setOtp(["", "", "", "", "", ""]);
    setError("");
    setSeconds(30);

    setTimeout(() => {
      otpRefs.current[0]?.focus();
    }, 100);
  };

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }

        html,
        body,
        #root {
          margin: 0;
          min-height: 100%;
        }

        body {
          font-family: Inter, ui-sans-serif, system-ui, -apple-system,
            BlinkMacSystemFont, "Segoe UI", sans-serif;
          color: #1f1f1f;
          background: #eee9e3;
        }

        button,
        input {
          font-family: inherit;
        }

        button {
          cursor: pointer;
        }

        .loginPage {
          min-height: 100vh;
          width: 100%;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: #eee9e3;
        }

        .propertyBackground {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 18px;
          padding: 20px 0;
          background: #eee9e3;
          z-index: 1;
        }

        .propertyRow {
          display: flex;
          width: max-content;
          gap: 16px;
          animation: propertyMove 42s linear infinite;
        }

        .propertyRow:nth-child(2) {
          animation-duration: 48s;
          animation-direction: reverse;
        }

        .propertyRow:nth-child(3) {
          animation-duration: 44s;
        }

        @keyframes propertyMove {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(-50%);
          }
        }

        .propertyCard {
          width: 245px;
          min-width: 245px;
          height: 155px;
          position: relative;
          overflow: hidden;
          border-radius: 18px;
          background: #fff;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
          border: 1px solid rgba(255, 255, 255, 0.8);
        }

        .propertyCard img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .propertyCard::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(0, 0, 0, 0.78),
            rgba(0, 0, 0, 0.04) 70%
          );
        }

        .propertyDetails {
          position: absolute;
          left: 13px;
          right: 13px;
          bottom: 11px;
          z-index: 2;
          color: #fff;
        }

        .propertyDetails h3 {
          margin: 0 0 3px;
          font-size: 13px;
          font-weight: 750;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .propertyLocation {
          margin: 0 0 5px;
          font-size: 10px;
          opacity: 0.88;
        }

        .propertyMeta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          font-size: 9px;
        }

        .propertyPrice {
          font-weight: 800;
        }

        /* BLACK BACKGROUND LAYER REMOVED */
        .backgroundShade {
          display: none;
        }

        .overlay {
          position: fixed;
          inset: 0;
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;

          /* BLACK LAYER REMOVED */
          background: transparent;

          backdrop-filter: none;
        }

        .modal {
          width: 100%;
          max-width: 445px;
          position: relative;
          overflow: hidden;
          border-radius: 27px;
          padding: 31px 30px 22px;
          background: rgba(255, 255, 255, 0.98);
          border: 1px solid rgba(255, 255, 255, 0.85);
          box-shadow:
            0 45px 110px rgba(0, 0, 0, 0.30),
            0 12px 35px rgba(0, 0, 0, 0.10);
          animation: modalIn 0.25s cubic-bezier(.2, .8, .2, 1);
        }

        .modal::before {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          height: 3px;
          background: linear-gradient(
            90deg,
            #ff9f43,
            #f97316,
            #ffb15c
          );
        }

        @keyframes modalIn {
          from {
            opacity: 0;
            transform: translateY(12px) scale(.975);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .close {
          position: absolute;
          top: 17px;
          left: 17px;
          width: 33px;
          height: 33px;
          border-radius: 50%;
          border: 1px solid #e4dfd9;
          background: #fff;
          display: grid;
          place-items: center;
          z-index: 5;
        }

        .close svg {
          width: 16px;
          fill: none;
          stroke: #333;
          stroke-width: 1.7;
        }

        .loginHeader {
          text-align: center;
          padding: 8px 20px 23px;
        }

        .miniLogo {
          width: 45px;
          height: 45px;
          margin: 0 auto 15px;
          border-radius: 15px;
          display: grid;
          place-items: center;
          color: #f97316;
          background: #fff7ed;
        }

        .miniLogo svg {
          width: 20px;
          fill: none;
          stroke: currentColor;
          stroke-width: 1.6;
        }

        .loginHeader h2,
        .otpScreen h2 {
          margin: 0;
          color: #202020;
          font-family: Georgia, serif;
          font-size: 27px;
          font-weight: 500;
        }

        .loginHeader p,
        .otpScreen p {
          margin: 9px 0 0;
          color: #77716c;
          font-size: 13px;
          line-height: 1.55;
        }

        .label {
          display: block;
          margin-bottom: 7px;
          color: #373330;
          font-size: 12px;
          font-weight: 750;
        }

        .input {
          height: 55px;
          display: flex;
          align-items: center;
          padding: 0 14px;
          border-radius: 12px;
          background: #fff;
          border: 1px solid #cec8c2;
        }

        .input:focus-within {
          border-color: #f97316;
        }

        .inputIcon {
          width: 18px;
          height: 18px;
          margin-right: 10px;
          color: #77716d;
        }

        .inputIcon svg {
          width: 100%;
          height: 100%;
          fill: none;
          stroke: currentColor;
          stroke-width: 1.7;
        }

        .input input {
          flex: 1;
          min-width: 0;
          height: 100%;
          border: 0;
          outline: 0;
          background: transparent;
          color: #222;
          font-size: 14px;
        }

        .terms {
          margin: 9px 1px 15px;
          color: #88817c;
          font-size: 10.5px;
          line-height: 1.5;
        }

        .terms a {
          color: #4c4844;
          font-weight: 650;
        }

        .error {
          margin-bottom: 12px;
          padding: 9px 10px;
          border-radius: 9px;
          border: 1px solid #f0d5da;
          background: #fff2f4;
          color: #a63c51;
          font-size: 11px;
        }

        .continue {
          width: 100%;
          height: 51px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          border: 0;
          border-radius: 12px;
          color: white;
          background: linear-gradient(
            135deg,
            #ff9f43 0%,
            #f97316 100%
          );
          font-size: 14px;
          font-weight: 750;
        }

        .continue svg {
          width: 17px;
          fill: none;
          stroke: currentColor;
          stroke-width: 1.8;
        }

        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 19px 0 15px;
          color: #aaa29b;
          font-size: 11px;
        }

        .divider::before,
        .divider::after {
          content: "";
          flex: 1;
          height: 1px;
          background: #dfd9d3;
        }

        .socialIcons {
          display: flex;
          justify-content: center;
          gap: 18px;
        }

        .socialIcon {
          width: 45px;
          height: 45px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          border: 1px solid #ddd7d1;
          background: #fff;
          color: #222;
        }

        .socialIcon svg {
          width: 19px;
          height: 19px;
        }

        .otpScreen {
          text-align: center;
          padding: 11px 4px 5px;
        }

        .otpLogo {
          width: 48px;
          height: 48px;
          margin: 0 auto 16px;
          display: grid;
          place-items: center;
          border-radius: 15px;
          color: #34794d;
          background: #eff9f2;
        }

        .otpLogo svg {
          width: 22px;
          fill: none;
          stroke: currentColor;
          stroke-width: 2;
        }

        .otpScreen p {
          margin-bottom: 21px;
        }

        .otpBoxes {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 7px;
          margin-bottom: 14px;
        }

        .otpBoxes input {
          width: 100%;
          height: 53px;
          border: 1px solid #cec8c2;
          border-radius: 11px;
          background: #fff;
          outline: 0;
          text-align: center;
          font-size: 19px;
          font-weight: 750;
        }

        .otpBoxes input:focus {
          border-color: #f97316;
        }

        .otpBottom {
          display: flex;
          justify-content: space-between;
          margin-top: 16px;
        }

        .otpBottom button {
          border: 0;
          background: transparent;
          padding: 2px;
          color: #56514d;
          font-size: 11px;
          font-weight: 650;
        }

        .otpBottom button:last-child {
          color: #f97316;
        }

        .otpBottom button:disabled {
          color: #aaa39d;
        }

        .done {
          text-align: center;
          padding: 19px 5px 8px;
        }

        .doneIcon {
          width: 62px;
          height: 62px;
          margin: 0 auto 18px;
          display: grid;
          place-items: center;
          border-radius: 19px;
          color: #34794d;
          background: #eff9f2;
        }

        .doneIcon svg {
          width: 25px;
          fill: none;
          stroke: currentColor;
          stroke-width: 2;
        }

        .done h2 {
          margin: 0 0 7px;
          font-family: Georgia, serif;
          font-size: 28px;
          font-weight: 500;
        }

        .done p {
          margin: 0 0 22px;
          color: #77716c;
          font-size: 13px;
        }

        .footer {
          margin-top: 20px;
          padding-top: 15px;
          border-top: 1px solid #ebe6e0;
          text-align: center;
          color: #817b75;
          font-size: 11px;
        }

        .footer button {
          border: 0;
          padding: 0;
          background: transparent;
          color: #393532;
          font-weight: 700;
          text-decoration: underline;
        }

        @media (max-width: 480px) {
          .propertyCard {
            width: 190px;
            min-width: 190px;
            height: 135px;
          }

          .propertyRow {
            gap: 11px;
          }

          .propertyBackground {
            gap: 11px;
          }

          .modal {
            max-width: 100%;
            padding: 29px 20px 20px;
            border-radius: 23px;
          }

          .otpBoxes {
            gap: 5px;
          }

          .otpBoxes input {
            height: 48px;
          }
        }
      `}</style>

      <div className="loginPage">
        <div className="propertyBackground">
          {[0, 1, 2].map((row) => {
            const rowProperties = properties.slice(
              row * 7,
              row * 7 + 7
            );

            return (
              <div className="propertyRow" key={row}>
                {[...rowProperties, ...rowProperties].map(
                  (property, index) => (
                    <div
                      className="propertyCard"
                      key={`${row}-${index}`}
                    >
                      <img
                        src={property.image}
                        alt={property.name}
                      />

                      <div className="propertyDetails">
                        <h3>{property.name}</h3>

                        <div className="propertyLocation">
                          {property.location}
                        </div>

                        <div className="propertyMeta">
                          <span>
                            {property.type} • {property.guests}
                          </span>

                          <span className="propertyPrice">
                            {property.price}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            );
          })}
        </div>

        {showLogin && (
          <div className="overlay">
            <div className="modal">
              <button
                className="close"
                onClick={() => navigate("/")}
                aria-label="Close"
                type="button"
              >
                <CloseIcon />
              </button>

              {step === "login" && (
                <>
                  <div className="loginHeader">
                    <div className="miniLogo">
                      <LoginIcon />
                    </div>

                    <h2>Log in or sign up</h2>

                    <p>
                      Welcome back. Enter your details
                      <br />
                      to continue.
                    </p>
                  </div>

                  <form onSubmit={continueLogin}>
                    <label className="label">
                      Phone number or email
                    </label>

                    <div className="input">
                      <div className="inputIcon">
                        <LoginIcon />
                      </div>

                      <input
                        autoFocus
                        type="text"
                        value={value}
                        onChange={(event) => {
                          setValue(event.target.value);
                          setError("");
                        }}
                        placeholder="Phone number or email"
                        autoComplete="username"
                      />
                    </div>

                    <div className="terms">
                      By continuing, you agree to our{" "}
                      <a href="#terms">Terms of Service</a> and{" "}
                      <a href="#privacy">Privacy Policy</a>.
                    </div>

                    {error && (
                      <div className="error">{error}</div>
                    )}

                   
                  </form>

                <button className="continue" type="submit">
                    Continue
                     <ArrowIcon />
                 </button>


                 

                  <div className="divider">or</div>

                  <div className="socialIcons">
                    <button
                      type="button"
                      className="socialIcon"
                      aria-label="Continue with Google"
                    >
                      <GoogleIcon />
                    </button>

                    <button
                      type="button"
                      className="socialIcon"
                      aria-label="Continue with Apple"
                    >
                      <AppleIcon />
                    </button>
                  </div>
                </>
              )}

              {step === "otp" && (
                <form
                  className="otpScreen"
                  onSubmit={verifyOTP}
                >
                  <div className="otpLogo">
                    <CheckIcon />
                  </div>

                  <h2>Enter the code</h2>

                  <p>
                    We've sent a verification code to
                    <br />
                    <strong>{value}</strong>
                  </p>

                  <div className="otpBoxes">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={(element) => {
                          otpRefs.current[index] = element;
                        }}
                        value={digit}
                        maxLength={1}
                        inputMode="numeric"
                        onChange={(event) =>
                          changeOTP(
                            index,
                            event.target.value
                          )
                        }
                        onKeyDown={(event) =>
                          otpKeyDown(index, event)
                        }
                      />
                    ))}
                  </div>

                  {error && (
                    <div className="error">{error}</div>
                  )}

                  <button
                    className="continue"
                    type="submit"
                  >
                    Verify & Continue
                    <ArrowIcon />
                  </button>

                  <div className="otpBottom">
                    <button
                      type="button"
                      onClick={() => {
                        setStep("login");
                        setError("");
                      }}
                    >
                      ← Change
                    </button>

                    <button
                      type="button"
                      disabled={seconds > 0}
                      onClick={resendOTP}
                    >
                      {seconds > 0
                        ? `Resend in ${seconds}s`
                        : "Resend code"}
                    </button>
                  </div>
                </form>
              )}

              {step === "done" && (
                <div className="done">
                  <div className="doneIcon">
                    <CheckIcon />
                  </div>

                  <h2>You're all set!</h2>

                  <p>
                    Your account has been successfully verified.
                  </p>
                </div>
              )}

              {step !== "done" && (
                <div className="footer">
                  New to Take On BnB?{" "}

                  <button
                    type="button"
                    onClick={() => navigate("/signup")}
                  >
                    Create an account
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}