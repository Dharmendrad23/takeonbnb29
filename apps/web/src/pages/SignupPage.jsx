// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { Helmet } from 'react-helmet';
// import { useAuth } from '@/contexts/AuthContext.jsx';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from '@/components/ui/card';
// import { toast } from 'sonner';
// import { Lock, User, Loader2, Mail } from 'lucide-react';

// const SignupPage = () => {
//   const navigate = useNavigate();

//   // Direct signup function
//   const { signup } = useAuth();

//   const [loading, setLoading] = useState(false);

//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');

//   const handleSignup = async (e) => {
//     e.preventDefault();

//     const trimmedName = name.trim();
//     const normalizedEmail = email.trim().toLowerCase();

//     if (!trimmedName) {
//       toast.error('Full name is required');
//       return;
//     }

//     if (!normalizedEmail) {
//       toast.error('Email is required');
//       return;
//     }

//     if (password.length < 8) {
//       toast.error('Password must be at least 8 characters');
//       return;
//     }

//     if (password !== confirmPassword) {
//       toast.error('Passwords do not match');
//       return;
//     }

//     setLoading(true);

//     try {
//       // Direct Guest Signup
//       await signup(
//         normalizedEmail,
//         password,
//         trimmedName,
//         'guest'
//       );

//       toast.success('Guest account created successfully!');

//       // User automatically logged in
//       navigate('/', { replace: true });

//     } catch (error) {
//       console.error('Guest signup error:', error);

//       toast.error(
//         error.message || 'Failed to create account'
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-12 pt-28">

//       <Helmet>
//         <title>Sign Up | TakeOn BnB</title>
//       </Helmet>

//       <Card className="w-full max-w-md shadow-xl border-border rounded-2xl overflow-hidden">

//         <CardHeader className="text-center pb-6 bg-primary-gradient text-white">

//           <CardTitle className="text-3xl font-extrabold tracking-tight">
//             Join TakeOn BnB
//           </CardTitle>

//           <CardDescription className="text-white/80 mt-2">
//             Create an account to book your perfect stay
//           </CardDescription>

//         </CardHeader>

//         <CardContent className="pt-8">

//           <form
//             onSubmit={handleSignup}
//             className="space-y-5 animate-in fade-in"
//           >

//             {/* FULL NAME */}
//             <div className="space-y-2">

//               <label className="text-sm font-bold text-foreground">
//                 Full Name
//               </label>

//               <div className="relative">

//                 <User className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />

//                 <Input
//                   required
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   className="pl-10 h-12"
//                   placeholder="Enter your name"
//                   disabled={loading}
//                 />

//               </div>

//             </div>

//             {/* EMAIL */}
//             <div className="space-y-2">

//               <label className="text-sm font-bold text-foreground">
//                 Email
//               </label>

//               <div className="relative">

//                 <Mail className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />

//                 <Input
//                   required
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="pl-10 h-12"
//                   placeholder="your@email.com"
//                   disabled={loading}
//                 />

//               </div>

//             </div>

//             {/* PASSWORD */}
//             <div className="space-y-2">

//               <label className="text-sm font-bold text-foreground">
//                 Password
//               </label>

//               <div className="relative">

//                 <Lock className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />

//                 <Input
//                   required
//                   type="password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className="pl-10 h-12"
//                   placeholder="Minimum 8 characters"
//                   disabled={loading}
//                 />

//               </div>

//             </div>

//             {/* CONFIRM PASSWORD */}
//             <div className="space-y-2">

//               <label className="text-sm font-bold text-foreground">
//                 Confirm Password
//               </label>

//               <div className="relative">

//                 <Lock className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />

//                 <Input
//                   required
//                   type="password"
//                   value={confirmPassword}
//                   onChange={(e) =>
//                     setConfirmPassword(e.target.value)
//                   }
//                   className="pl-10 h-12"
//                   placeholder="Confirm your password"
//                   disabled={loading}
//                 />

//               </div>

//             </div>

//             {/* SIGNUP BUTTON */}
//             <Button
//               type="submit"
//               className="w-full h-12 text-base font-bold rounded-xl mt-4 bg-primary text-white hover:bg-primary/90"
//               disabled={
//                 loading ||
//                 !name.trim() ||
//                 !email.trim() ||
//                 !password ||
//                 !confirmPassword
//               }
//             >

//               {loading ? (
//                 <>
//                   <Loader2 className="w-5 h-5 mr-2 animate-spin" />
//                   Creating Account...
//                 </>
//               ) : (
//                 'Create Account'
//               )}

//             </Button>

//           </form>

//           {/* LOGIN LINK */}
//           <div className="mt-6 text-center text-sm">

//             <span className="text-muted-foreground">
//               Already have an account?{' '}
//             </span>

//             <Link
//               to="/login"
//               className="text-primary hover:underline font-bold"
//             >
//               Log in
//             </Link>

//           </div>

//         </CardContent>

//       </Card>

//     </div>
//   );
// };

// export default SignupPage;



























// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "@/contexts/AuthContext.jsx";
// import { toast } from "sonner";

// export default function SignupPage() {
//   const navigate = useNavigate();
//   const { signup } = useAuth();

//   const [loading, setLoading] = useState(false);

//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");

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

//   /* ================= SIGNUP ================= */

//   const handleSignup = async (e) => {
//     e.preventDefault();

//     const trimmedName = name.trim();
//     const normalizedEmail = email.trim().toLowerCase();

//     if (!trimmedName) {
//       toast.error("Full name is required");
//       return;
//     }

//     if (!normalizedEmail) {
//       toast.error("Email is required");
//       return;
//     }

//     if (password.length < 8) {
//       toast.error("Password must be at least 8 characters");
//       return;
//     }

//     if (password !== confirmPassword) {
//       toast.error("Passwords do not match");
//       return;
//     }

//     setLoading(true);

//     try {
//       await signup(
//         normalizedEmail,
//         password,
//         trimmedName,
//         "guest"
//       );

//       toast.success("Guest account created successfully!");

//       navigate("/", { replace: true });

//     } catch (error) {
//       console.error("Guest signup error:", error);

//       toast.error(
//         error.message || "Failed to create account"
//       );

//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= ICONS ================= */

//   const CloseIcon = () => (
//     <svg viewBox="0 0 24 24">
//       <path d="M6 6L18 18M18 6L6 18" />
//     </svg>
//   );

//   const UserIcon = () => (
//     <svg viewBox="0 0 24 24">
//       <circle cx="12" cy="8" r="4" />
//       <path d="M4.5 21c.8-4 3.5-6 7.5-6s6.7 2 7.5 6" />
//     </svg>
//   );

//   const MailIcon = () => (
//     <svg viewBox="0 0 24 24">
//       <rect x="3" y="5" width="18" height="14" rx="3" />
//       <path d="M4 7l8 6 8-6" />
//     </svg>
//   );

//   const LockIcon = () => (
//     <svg viewBox="0 0 24 24">
//       <rect x="4" y="10" width="16" height="11" rx="2" />
//       <path d="M8 10V7a4 4 0 0 1 8 0v3" />
//     </svg>
//   );

//   const ArrowIcon = () => (
//     <svg viewBox="0 0 24 24">
//       <path d="M5 12h13M13 6l6 6-6 6" />
//     </svg>
//   );

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
//            SIGNUP PAGE
//         ===================================================== */

//         .signupPage {
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
//            SIGNUP MODAL
//         ===================================================== */

//         .modal {
//           width: 100%;
//           max-width: 470px;

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

//         .signupHeader {
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
//         }

//         .miniLogo svg {
//           width: 20px;

//           fill: none;

//           stroke: currentColor;

//           stroke-width: 1.6;
//         }

//         .signupHeader h2 {
//           margin: 0;

//           color: #202020;

//           font-family: Georgia, serif;

//           font-size: 27px;

//           font-weight: 500;

//           letter-spacing: -.7px;
//         }

//         .signupHeader p {
//           margin:
//             9px 0 0;

//           color: #77716c;

//           font-size: 13px;

//           line-height: 1.55;
//         }

//         /* =====================================================
//            FORM
//         ===================================================== */

//         .field {
//           margin-bottom: 15px;
//         }

//         .label {
//           display: block;

//           margin-bottom: 7px;

//           color: #373330;

//           font-size: 12px;

//           font-weight: 750;
//         }

//         .input {
//           height: 53px;

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

//         .continue:hover:not(:disabled) {
//           transform: translateY(-1px);

//           box-shadow:
//             0 13px 29px
//             rgba(249,115,22,.25);
//         }

//         .continue:disabled {
//           opacity: .6;
//           cursor: not-allowed;
//         }

//         .continue svg {
//           width: 17px;

//           fill: none;

//           stroke: currentColor;

//           stroke-width: 1.8;
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

//           .signupHeader {
//             padding-bottom: 20px;
//           }

//           .signupHeader h2 {
//             font-size: 24px;
//           }

//         }

//       `}</style>

//       <div className="signupPage">

//         {/* =====================================================
//             BACKGROUND PROPERTY SECTION
//             3 ROWS × 7 PROPERTIES
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

//                 {/* Original 7 */}

//                 {rowProperties.map(
//                   (property, index) => (

//                     <div
//                       className="propertyCard"
//                       key={`original-${row}-${index}`}
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
//                       key={`duplicate-${row}-${index}`}
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

//         {/* =====================================================
//             SIGNUP POPUP
//         ===================================================== */}

//         <div className="overlay">

//           <div className="modal">

//             {/* CLOSE */}

//             <button
//               className="close"
//               type="button"
//               onClick={() => navigate("/")}
//               aria-label="Close"
//             >
//               <CloseIcon />
//             </button>

//             {/* HEADER */}

//             <div className="signupHeader">

//               <div className="miniLogo">
//                 <UserIcon />
//               </div>

//               <h2>
//                 Create your account
//               </h2>

//               <p>
//                 Join Take On BnB and find your
//                 perfect stay.
//               </p>

//             </div>

//             {/* SIGNUP FORM */}

//             <form onSubmit={handleSignup}>

//               {/* FULL NAME */}

//               <div className="field">

//                 <label className="label">
//                   Full Name
//                 </label>

//                 <div className="input">

//                   <UserIcon />

//                   <input
//                     required
//                     type="text"
//                     value={name}
//                     onChange={(e) =>
//                       setName(e.target.value)
//                     }
//                     placeholder="Enter your full name"
//                     disabled={loading}
//                   />

//                 </div>

//               </div>

//               {/* EMAIL */}

//               <div className="field">

//                 <label className="label">
//                   Email address
//                 </label>

//                 <div className="input">

//                   <MailIcon />

//                   <input
//                     required
//                     type="email"
//                     value={email}
//                     onChange={(e) =>
//                       setEmail(e.target.value)
//                     }
//                     placeholder="Email address"
//                     disabled={loading}
//                   />

//                 </div>

//               </div>

//               {/* PASSWORD */}

//               <div className="field">

//                 <label className="label">
//                   Password
//                 </label>

//                 <div className="input">

//                   <LockIcon />

//                   <input
//                     required
//                     type="password"
//                     value={password}
//                     onChange={(e) =>
//                       setPassword(e.target.value)
//                     }
//                     placeholder="Minimum 8 characters"
//                     disabled={loading}
//                   />

//                 </div>

//               </div>

//               {/* CONFIRM PASSWORD */}

//               <div className="field">

//                 <label className="label">
//                   Confirm Password
//                 </label>

//                 <div className="input">

//                   <LockIcon />

//                   <input
//                     required
//                     type="password"
//                     value={confirmPassword}
//                     onChange={(e) =>
//                       setConfirmPassword(e.target.value)
//                     }
//                     placeholder="Confirm your password"
//                     disabled={loading}
//                   />

//                 </div>

//               </div>

//               {/* CREATE ACCOUNT BUTTON */}

//               <button
//                 className="continue"
//                 type="submit"
//                 disabled={
//                   loading ||
//                   !name.trim() ||
//                   !email.trim() ||
//                   !password ||
//                   !confirmPassword
//                 }
//               >

//                 {loading
//                   ? "Creating Account..."
//                   : "Create Account"
//                 }

//                 {!loading && <ArrowIcon />}

//               </button>

//             </form>

//             {/* LOGIN FOOTER */}

//             <div className="footer">

//               Already have an account?{" "}

//               <button
//                 type="button"
//                 onClick={() => navigate("/login")}
//               >
//                 Log in
//               </button>

//             </div>

//           </div>

//         </div>

//       </div>
//     </>
//   );
// }

























// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "@/contexts/AuthContext.jsx";
// import { toast } from "sonner";

// export default function SignupPage() {
//   const navigate = useNavigate();
//   const { signup } = useAuth();

//   const [loading, setLoading] = useState(false);

//   const [signupMethod, setSignupMethod] = useState("email");

//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [phone, setPhone] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");

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

//   /* =====================================================
//      SIGNUP
//   ===================================================== */

//   const handleSignup = async (e) => {
//     e.preventDefault();

//     const trimmedName = name.trim();

//     if (!trimmedName) {
//       toast.error("Full name is required");
//       return;
//     }

//     if (signupMethod === "email") {
//       const normalizedEmail = email.trim().toLowerCase();

//       if (!normalizedEmail) {
//         toast.error("Email is required");
//         return;
//       }

//       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//       if (!emailRegex.test(normalizedEmail)) {
//         toast.error("Please enter a valid email address");
//         return;
//       }
//     }

//     if (signupMethod === "phone") {
//       const cleanPhone = phone.replace(/\D/g, "");

//       if (!cleanPhone) {
//         toast.error("Phone number is required");
//         return;
//       }

//       if (cleanPhone.length !== 10) {
//         toast.error("Please enter a valid 10-digit phone number");
//         return;
//       }

//       if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
//         toast.error("Please enter a valid Indian mobile number");
//         return;
//       }
//     }

//     if (password.length < 8) {
//       toast.error("Password must be at least 8 characters");
//       return;
//     }

//     if (password !== confirmPassword) {
//       toast.error("Passwords do not match");
//       return;
//     }

//     setLoading(true);

//     try {
//       const normalizedEmail =
//         signupMethod === "email"
//           ? email.trim().toLowerCase()
//           : "";

//       const cleanPhone =
//         signupMethod === "phone"
//           ? phone.replace(/\D/g, "")
//           : "";

//       /*
//        * IMPORTANT:
//        * AuthContext signup must accept this object.
//        */

//       await signup({
//         name: trimmedName,
//         email: normalizedEmail,
//         phone: cleanPhone,
//         password,
//         role: "guest",
//         signupMethod,
//       });

//       toast.success("Guest account created successfully!");

//       navigate("/", { replace: true });
//     } catch (error) {
//       console.error("Guest signup error:", error);

//       toast.error(
//         error?.message || "Failed to create account"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* =====================================================
//      ICONS
//   ===================================================== */

//   const CloseIcon = () => (
//     <svg viewBox="0 0 24 24">
//       <path d="M6 6L18 18M18 6L6 18" />
//     </svg>
//   );

//   const UserIcon = () => (
//     <svg viewBox="0 0 24 24">
//       <circle cx="12" cy="8" r="4" />
//       <path d="M4.5 21c.8-4 3.5-6 7.5-6s6.7 2 7.5 6" />
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
//       <rect x="6" y="2.5" width="12" height="19" rx="3" />
//       <path d="M10 18.5h4" />
//     </svg>
//   );

//   const LockIcon = () => (
//     <svg viewBox="0 0 24 24">
//       <rect x="4" y="10" width="16" height="11" rx="2" />
//       <path d="M8 10V7a4 4 0 0 1 8 0v3" />
//     </svg>
//   );

//   const ArrowIcon = () => (
//     <svg viewBox="0 0 24 24">
//       <path d="M5 12h13M13 6l6 6-6 6" />
//     </svg>
//   );

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

//         .signupPage {
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

//         .backgroundShade {
//           position: absolute;

//           inset: 0;

//           z-index: 2;

//           background:
//             rgba(25,21,18,.28);

//           backdrop-filter:
//             blur(1.5px);
//         }

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

//         .modal {
//           width: 100%;
//           max-width: 470px;

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

//         .signupHeader {
//           text-align: center;

//           padding:
//             8px 20px 18px;
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
//         }

//         .miniLogo svg {
//           width: 20px;

//           fill: none;

//           stroke: currentColor;

//           stroke-width: 1.6;
//         }

//         .signupHeader h2 {
//           margin: 0;

//           color: #202020;

//           font-family: Georgia, serif;

//           font-size: 27px;

//           font-weight: 500;

//           letter-spacing: -.7px;
//         }

//         .signupHeader p {
//           margin:
//             9px 0 0;

//           color: #77716c;

//           font-size: 13px;

//           line-height: 1.55;
//         }

//         /* =====================================================
//            EMAIL / PHONE SWITCH
//         ===================================================== */

//         .signupSwitch {
//           display: flex;

//           width: 100%;

//           padding: 4px;

//           margin-bottom: 18px;

//           border-radius: 12px;

//           background: #f3f0ec;

//           border:
//             1px solid
//             #e4dfd9;
//         }

//         .signupSwitch button {
//           flex: 1;

//           height: 39px;

//           border: 0;

//           border-radius: 9px;

//           background: transparent;

//           color: #77716c;

//           font-size: 12px;

//           font-weight: 700;

//           transition: .18s;
//         }

//         .signupSwitch button.active {
//           color: #f97316;

//           background: #fff;

//           box-shadow:
//             0 3px 10px
//             rgba(0,0,0,.07);
//         }

//         .field {
//           margin-bottom: 15px;
//         }

//         .label {
//           display: block;

//           margin-bottom: 7px;

//           color: #373330;

//           font-size: 12px;

//           font-weight: 750;
//         }

//         .input {
//           height: 53px;

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

//         .continue:hover:not(:disabled) {
//           transform: translateY(-1px);

//           box-shadow:
//             0 13px 29px
//             rgba(249,115,22,.25);
//         }

//         .continue:disabled {
//           opacity: .6;
//           cursor: not-allowed;
//         }

//         .continue svg {
//           width: 17px;

//           fill: none;

//           stroke: currentColor;

//           stroke-width: 1.8;
//         }

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

//           .signupHeader {
//             padding-bottom: 18px;
//           }

//           .signupHeader h2 {
//             font-size: 24px;
//           }

//         }

//       `}</style>

//       <div className="signupPage">

//         {/* =====================================================
//             BACKGROUND PROPERTY SECTION
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

//                 {/* Original 7 */}

//                 {rowProperties.map(
//                   (property, index) => (

//                     <div
//                       className="propertyCard"
//                       key={`original-${row}-${index}`}
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

//                 {/* Duplicate 7 */}

//                 {rowProperties.map(
//                   (property, index) => (

//                     <div
//                       className="propertyCard"
//                       key={`duplicate-${row}-${index}`}
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

//         <div className="backgroundShade" />

//         {/* =====================================================
//             SIGNUP POPUP
//         ===================================================== */}

//         <div className="overlay">

//           <div className="modal">

//             {/* CLOSE */}

//             <button
//               className="close"
//               type="button"
//               onClick={() => navigate("/")}
//               aria-label="Close"
//             >
//               <CloseIcon />
//             </button>

//             {/* HEADER */}

//             <div className="signupHeader">

//               <div className="miniLogo">
//                 <UserIcon />
//               </div>

//               <h2>
//                 Create your account
//               </h2>

//               <p>
//                 Join Take On BnB and find your
//                 perfect stay.
//               </p>

//             </div>

//             {/* SIGNUP METHOD */}

//             <div className="signupSwitch">

//               <button
//                 type="button"
//                 className={
//                   signupMethod === "email"
//                     ? "active"
//                     : ""
//                 }
//                 onClick={() => {
//                   setSignupMethod("email");
//                   setPhone("");
//                 }}
//                 disabled={loading}
//               >
//                 Email
//               </button>

//               <button
//                 type="button"
//                 className={
//                   signupMethod === "phone"
//                     ? "active"
//                     : ""
//                 }
//                 onClick={() => {
//                   setSignupMethod("phone");
//                   setEmail("");
//                 }}
//                 disabled={loading}
//               >
//                 Phone Number
//               </button>

//             </div>

//             {/* SIGNUP FORM */}

//             <form onSubmit={handleSignup}>

//               {/* FULL NAME */}

//               <div className="field">

//                 <label className="label">
//                   Full Name
//                 </label>

//                 <div className="input">

//                   <UserIcon />

//                   <input
//                     required
//                     type="text"
//                     value={name}
//                     onChange={(e) =>
//                       setName(e.target.value)
//                     }
//                     placeholder="Enter your full name"
//                     disabled={loading}
//                     autoComplete="name"
//                   />

//                 </div>

//               </div>

//               {/* EMAIL */}

//               {signupMethod === "email" && (

//                 <div className="field">

//                   <label className="label">
//                     Email Address
//                   </label>

//                   <div className="input">

//                     <MailIcon />

//                     <input
//                       required
//                       type="email"
//                       value={email}
//                       onChange={(e) =>
//                         setEmail(e.target.value)
//                       }
//                       placeholder="Enter your email address"
//                       disabled={loading}
//                       autoComplete="email"
//                     />

//                   </div>

//                 </div>

//               )}

//               {/* PHONE */}

//               {signupMethod === "phone" && (

//                 <div className="field">

//                   <label className="label">
//                     Phone Number
//                   </label>

//                   <div className="input">

//                     <PhoneIcon />

//                     <input
//                       required
//                       type="tel"
//                       value={phone}
//                       onChange={(e) => {
//                         const value =
//                           e.target.value
//                             .replace(/\D/g, "")
//                             .slice(0, 10);

//                         setPhone(value);
//                       }}
//                       placeholder="Enter 10-digit phone number"
//                       disabled={loading}
//                       maxLength={10}
//                       inputMode="numeric"
//                       autoComplete="tel"
//                     />

//                   </div>

//                 </div>

//               )}

//               {/* PASSWORD */}

//               <div className="field">

//                 <label className="label">
//                   Password
//                 </label>

//                 <div className="input">

//                   <LockIcon />

//                   <input
//                     required
//                     type="password"
//                     value={password}
//                     onChange={(e) =>
//                       setPassword(e.target.value)
//                     }
//                     placeholder="Minimum 8 characters"
//                     disabled={loading}
//                     autoComplete="new-password"
//                   />

//                 </div>

//               </div>

//               {/* CONFIRM PASSWORD */}

//               <div className="field">

//                 <label className="label">
//                   Confirm Password
//                 </label>

//                 <div className="input">

//                   <LockIcon />

//                   <input
//                     required
//                     type="password"
//                     value={confirmPassword}
//                     onChange={(e) =>
//                       setConfirmPassword(e.target.value)
//                     }
//                     placeholder="Confirm your password"
//                     disabled={loading}
//                     autoComplete="new-password"
//                   />

//                 </div>

//               </div>

//               {/* CREATE ACCOUNT */}

//               <button
//                 className="continue"
//                 type="submit"
//                 disabled={
//                   loading ||
//                   !name.trim() ||
//                   (signupMethod === "email"
//                     ? !email.trim()
//                     : !phone.trim()) ||
//                   !password ||
//                   !confirmPassword
//                 }
//               >

//                 {loading
//                   ? "Creating Account..."
//                   : "Create Account"
//                 }

//                 {!loading && <ArrowIcon />}

//               </button>

//             </form>

//             {/* LOGIN FOOTER */}

//             <div className="footer">

//               Already have an account?{" "}

//               <button
//                 type="button"
//                 onClick={() => navigate("/login")}
//               >
//                 Log in
//               </button>

//             </div>

//           </div>

//         </div>

//       </div>
//     </>
//   );
// }




















// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "sonner";

// export default function SignupPage() {
//   const navigate = useNavigate();

//   const [identifier, setIdentifier] = useState("");
//   const [loading, setLoading] = useState(false);

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

//   /* =====================================================
//      CONTINUE
//   ===================================================== */

//   const handleContinue = async (e) => {
//     e.preventDefault();

//     const value = identifier.trim();

//     if (!value) {
//       toast.error("Please enter your phone number or email");
//       return;
//     }

//     const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

//     const cleanPhone = value.replace(/\D/g, "");

//     const isPhone =
//       /^[6-9]\d{9}$/.test(cleanPhone) &&
//       cleanPhone.length === 10;

//     if (!isEmail && !isPhone) {
//       toast.error("Please enter a valid phone number or email");
//       return;
//     }

//     setLoading(true);

//     try {
//       /*
//        * Identifier ko next signup step par bhej rahe hain.
//        * Next page par name/password/OTP etc. liya ja sakta hai.
//        */

//       navigate("/signup-details", {
//         state: {
//           identifier: isEmail ? value.toLowerCase() : cleanPhone,
//           method: isEmail ? "email" : "phone",
//         },
//       });
//     } catch (error) {
//       console.error("Continue error:", error);

//       toast.error(
//         error?.message || "Something went wrong"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* =====================================================
//      ICONS
//   ===================================================== */

//   const CloseIcon = () => (
//     <svg viewBox="0 0 24 24">
//       <path d="M6 6L18 18M18 6L6 18" />
//     </svg>
//   );

//   const UserIcon = () => (
//     <svg viewBox="0 0 24 24">
//       <circle cx="12" cy="8" r="4" />
//       <path d="M4.5 21c.8-4 3.5-6 7.5-6s6.7 2 7.5 6" />
//     </svg>
//   );

//   const ArrowIcon = () => (
//     <svg viewBox="0 0 24 24">
//       <path d="M5 12h13M13 6l6 6-6 6" />
//     </svg>
//   );

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
//           background: #eee9e3;
//         }

//         button,
//         input {
//           font-family: inherit;
//         }

//         button {
//           cursor: pointer;
//         }

//         /* =====================================================
//            MAIN PAGE
//         ===================================================== */

//         .signupPage {
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
//            BACKGROUND
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

//           z-index: 1;

//           transform: scale(1.02);

//           background:
//             linear-gradient(
//               135deg,
//               rgba(255,255,255,.08),
//               rgba(249,115,22,.04)
//             );
//         }

//         .propertyBackground::before {
//           content: "";

//           position: absolute;

//           width: 500px;
//           height: 500px;

//           left: 50%;
//           top: 50%;

//           transform: translate(-50%, -50%);

//           border-radius: 50%;

//           background:
//             radial-gradient(
//               circle,
//               rgba(255,159,67,.13) 0%,
//               rgba(255,159,67,.04) 35%,
//               transparent 70%
//             );

//           pointer-events: none;

//           animation:
//             backgroundGlow 7s ease-in-out infinite;
//         }

//         @keyframes backgroundGlow {

//           0%,
//           100% {
//             transform:
//               translate(-50%, -50%)
//               scale(.9);
//             opacity: .65;
//           }

//           50% {
//             transform:
//               translate(-50%, -50%)
//               scale(1.15);
//             opacity: 1;
//           }
//         }

//         .propertyRow {
//           display: flex;

//           width: max-content;

//           gap: 16px;

//           animation:
//             propertyMove 42s linear infinite;

//           will-change: transform;
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
//             0 10px 30px
//             rgba(0,0,0,.14);

//           border:
//             1px solid
//             rgba(255,255,255,.9);

//           transform:
//             translateY(0)
//             scale(1);

//           animation:
//             cardFloat 5s ease-in-out infinite;

//           transition:
//             transform .35s ease,
//             box-shadow .35s ease;
//         }

//         .propertyCard:nth-child(2n) {
//           animation-delay: -1.4s;
//         }

//         .propertyCard:nth-child(3n) {
//           animation-delay: -2.7s;
//         }

//         .propertyCard:nth-child(4n) {
//           animation-delay: -3.8s;
//         }

//         @keyframes cardFloat {

//           0%,
//           100% {
//             transform:
//               translateY(0)
//               scale(1);
//           }

//           50% {
//             transform:
//               translateY(-6px)
//               scale(1.012);
//           }

//         }

//         .propertyCard img {
//           width: 100%;
//           height: 100%;

//           object-fit: cover;

//           display: block;

//           transform: scale(1.03);

//           transition:
//             transform 1.2s ease;
//         }

//         .propertyCard:hover {
//           transform:
//             translateY(-10px)
//             scale(1.04);

//           box-shadow:
//             0 20px 45px
//             rgba(0,0,0,.2);

//           z-index: 10;
//         }

//         .propertyCard:hover img {
//           transform: scale(1.1);
//         }

//         .propertyCard::after {
//           content: "";

//           position: absolute;

//           inset: 0;

//           background:
//             linear-gradient(
//               to top,
//               rgba(0,0,0,.72),
//               rgba(0,0,0,.12) 62%,
//               rgba(0,0,0,.02)
//             );

//           pointer-events: none;
//         }

//         .propertyDetails {
//           position: absolute;

//           left: 13px;
//           right: 13px;
//           bottom: 11px;

//           z-index: 2;

//           color: #fff;

//           animation:
//             detailsFade 1s ease both;
//         }

//         @keyframes detailsFade {

//           from {
//             opacity: 0;
//             transform: translateY(5px);
//           }

//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }

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

//           opacity: .9;

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

//           opacity: .96;
//         }

//         .propertyPrice {
//           font-weight: 800;
//         }

//         /* =====================================================
//            BACKGROUND SHADE
//         ===================================================== */

//         .backgroundShade {
//           position: absolute;

//           inset: 0;

//           z-index: 2;

//           background:
//             rgba(25,21,18,.08);

//           pointer-events: none;
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
//             rgba(18,16,15,.22);

//           backdrop-filter:
//             blur(2px);

//           animation:
//             overlayIn .35s ease both;
//         }

//         @keyframes overlayIn {

//           from {
//             opacity: 0;
//           }

//           to {
//             opacity: 1;
//           }

//         }

//         /* =====================================================
//            MODAL
//         ===================================================== */

//         .modal {
//           width: 100%;

//           max-width: 470px;

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
//               rgba(255,255,255,.995),
//               rgba(251,249,246,.995)
//             );

//           border:
//             1px solid
//             rgba(255,255,255,.95);

//           box-shadow:
//             0 45px 110px
//             rgba(0,0,0,.30),
//             0 12px 35px
//             rgba(0,0,0,.10);

//           animation:
//             modalIn .65s cubic-bezier(.16,1,.3,1) both;

//           transform-origin:
//             center center;
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
//               #ffb15c,
//               #f97316
//             );

//           background-size:
//             200% 100%;

//           animation:
//             gradientMove 3s linear infinite;
//         }

//         @keyframes gradientMove {

//           from {
//             background-position: 0% 50%;
//           }

//           to {
//             background-position: 200% 50%;
//           }

//         }

//         @keyframes modalIn {

//           0% {
//             opacity: 0;

//             transform:
//               translateY(35px)
//               scale(.88)
//               rotateX(8deg);
//           }

//           60% {
//             opacity: 1;

//             transform:
//               translateY(-5px)
//               scale(1.015)
//               rotateX(0deg);
//           }

//           100% {
//             opacity: 1;

//             transform:
//               translateY(0)
//               scale(1)
//               rotateX(0deg);
//           }

//         }

//         /* =====================================================
//            CLOSE BUTTON
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
//             rgba(255,255,255,.92);

//           display: grid;

//           place-items: center;

//           z-index: 5;

//           transition:
//             transform .25s ease,
//             background .2s ease,
//             box-shadow .2s ease;
//         }

//         .close:hover {
//           transform:
//             rotate(90deg)
//             scale(1.08);

//           background: #fff7ed;

//           border-color: #f97316;

//           box-shadow:
//             0 6px 18px
//             rgba(249,115,22,.18);
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

//         .signupHeader {
//           text-align: center;

//           padding:
//             8px 20px 18px;

//           animation:
//             headerIn .65s .1s cubic-bezier(.16,1,.3,1) both;
//         }

//         @keyframes headerIn {

//           from {
//             opacity: 0;

//             transform:
//               translateY(15px);
//           }

//           to {
//             opacity: 1;

//             transform:
//               translateY(0);
//           }

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
//             rgba(249,115,22,.12),
//             inset 0 0 0 1px
//             rgba(249,115,22,.06);

//           animation:
//             logoFloat 3s ease-in-out infinite;
//         }

//         @keyframes logoFloat {

//           0%,
//           100% {
//             transform:
//               translateY(0)
//               rotate(0deg);
//           }

//           50% {
//             transform:
//               translateY(-4px)
//               rotate(2deg);
//           }

//         }

//         .miniLogo svg {
//           width: 20px;

//           fill: none;

//           stroke: currentColor;

//           stroke-width: 1.6;
//         }

//         .signupHeader h2 {
//           margin: 0;

//           color: #202020;

//           font-family: Georgia, serif;

//           font-size: 27px;

//           font-weight: 500;

//           letter-spacing: -.7px;
//         }

//         .signupHeader p {
//           margin:
//             9px 0 0;

//           color: #77716c;

//           font-size: 13px;

//           line-height: 1.55;
//         }

//         /* =====================================================
//            FORM
//         ===================================================== */

//         form {
//           animation:
//             formIn .65s .25s cubic-bezier(.16,1,.3,1) both;
//         }

//         @keyframes formIn {

//           from {
//             opacity: 0;

//             transform:
//               translateY(15px);
//           }

//           to {
//             opacity: 1;

//             transform:
//               translateY(0);
//           }

//         }

//         .field {
//           margin-bottom: 17px;

//           animation:
//             fieldIn .55s .3s cubic-bezier(.16,1,.3,1) both;
//         }

//         @keyframes fieldIn {

//           from {
//             opacity: 0;

//             transform:
//               translateY(12px);
//           }

//           to {
//             opacity: 1;

//             transform:
//               translateY(0);
//           }

//         }

//         .label {
//           display: block;

//           margin-bottom: 7px;

//           color: #373330;

//           font-size: 12px;

//           font-weight: 750;
//         }

//         .input {
//           height: 53px;

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

//           transition:
//             border-color .25s ease,
//             box-shadow .25s ease,
//             transform .25s ease;
//         }

//         .input:hover {
//           border-color:
//             #bdb5ae;

//           transform:
//             translateY(-1px);
//         }

//         .input:focus-within {
//           border-color:
//             #f97316;

//           box-shadow:
//             0 0 0 3px
//             rgba(249,115,22,.075),
//             0 7px 18px
//             rgba(0,0,0,.05);

//           transform:
//             translateY(-1px);
//         }

//         .input svg {
//           width: 18px;

//           margin-right: 10px;

//           flex-shrink: 0;

//           fill: none;

//           stroke: #77716d;

//           stroke-width: 1.7;

//           transition:
//             stroke .25s ease,
//             transform .25s ease;
//         }

//         .input:focus-within svg {
//           stroke:
//             #f97316;

//           transform:
//             scale(1.08);
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

//           transition:
//             opacity .2s ease;
//         }

//         .input:focus-within input::placeholder {
//           opacity: .55;
//         }

//         /* =====================================================
//            CONTINUE BUTTON
//         ===================================================== */

//         .continue {
//           position: relative;

//           overflow: hidden;

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
//               #f97316 50%,
//               #ff9f43 100%
//             );

//           background-size:
//             200% 100%;

//           font-size: 14px;

//           font-weight: 750;

//           box-shadow:
//             0 10px 25px
//             rgba(249,115,22,.19);

//           transition:
//             transform .2s ease,
//             box-shadow .2s ease;

//           animation:
//             buttonIn .6s .45s cubic-bezier(.16,1,.3,1) both,
//             buttonGradient 4s linear infinite;
//         }

//         @keyframes buttonIn {

//           from {
//             opacity: 0;

//             transform:
//               translateY(12px)
//               scale(.98);
//           }

//           to {
//             opacity: 1;

//             transform:
//               translateY(0)
//               scale(1);
//           }

//         }

//         @keyframes buttonGradient {

//           from {
//             background-position:
//               0% 50%;
//           }

//           to {
//             background-position:
//               200% 50%;
//           }

//         }

//         .continue::before {
//           content: "";

//           position: absolute;

//           top: 0;
//           left: -120%;

//           width: 70%;
//           height: 100%;

//           background:
//             linear-gradient(
//               90deg,
//               transparent,
//               rgba(255,255,255,.35),
//               transparent
//             );

//           transform:
//             skewX(-20deg);

//           animation:
//             buttonShine 3.5s ease-in-out infinite;
//         }

//         @keyframes buttonShine {

//           0% {
//             left: -120%;
//           }

//           45%,
//           100% {
//             left: 140%;
//           }

//         }

//         .continue:hover:not(:disabled) {
//           transform:
//             translateY(-2px)
//             scale(1.01);

//           box-shadow:
//             0 15px 32px
//             rgba(249,115,22,.27);
//         }

//         .continue:active:not(:disabled) {
//           transform:
//             translateY(0)
//             scale(.985);
//         }

//         .continue:disabled {
//           opacity: .6;

//           cursor: not-allowed;
//         }

//         .continue svg {
//           position: relative;

//           z-index: 2;

//           width: 17px;

//           fill: none;

//           stroke: currentColor;

//           stroke-width: 1.8;

//           transition:
//             transform .25s ease;
//         }

//         .continue:hover:not(:disabled) svg {
//           transform:
//             translateX(4px);
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

//           animation:
//             footerIn .6s .6s ease both;
//         }

//         @keyframes footerIn {

//           from {
//             opacity: 0;
//           }

//           to {
//             opacity: 1;
//           }

//         }

//         .footer button {
//           border: 0;

//           padding: 0;

//           background: transparent;

//           color: #393532;

//           font-weight: 700;

//           text-decoration: underline;

//           text-underline-offset: 2px;

//           transition:
//             color .2s ease;
//         }

//         .footer button:hover {
//           color:
//             #f97316;
//         }

//         /* =====================================================
//            LOADING
//         ===================================================== */

//         .loadingDots {
//           display: inline-flex;

//           gap: 3px;

//           align-items: center;
//         }

//         .loadingDots span {
//           width: 4px;
//           height: 4px;

//           border-radius: 50%;

//           background: currentColor;

//           animation:
//             loadingDot 1s infinite ease-in-out;
//         }

//         .loadingDots span:nth-child(2) {
//           animation-delay: .15s;
//         }

//         .loadingDots span:nth-child(3) {
//           animation-delay: .3s;
//         }

//         @keyframes loadingDot {

//           0%,
//           80%,
//           100% {
//             opacity: .3;

//             transform:
//               translateY(0);
//           }

//           40% {
//             opacity: 1;

//             transform:
//               translateY(-3px);
//           }

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

//           .signupHeader {
//             padding-bottom: 18px;
//           }

//           .signupHeader h2 {
//             font-size: 24px;
//           }

//           .overlay {
//             padding: 12px;
//           }

//         }

//         /* =====================================================
//            REDUCE MOTION
//         ===================================================== */

//         @media (prefers-reduced-motion: reduce) {

//           *,
//           *::before,
//           *::after {
//             animation-duration: .01ms !important;
//             animation-iteration-count: 1 !important;
//             scroll-behavior: auto !important;
//           }

//         }

//       `}</style>

//       <div className="signupPage">

//         {/* =====================================================
//             BACKGROUND PROPERTY SECTION
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

//                 {/* ORIGINAL 7 */}

//                 {rowProperties.map(
//                   (property, index) => (

//                     <div
//                       className="propertyCard"
//                       key={`original-${row}-${index}`}
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

//                 {/* DUPLICATE 7 FOR SEAMLESS LOOP */}

//                 {rowProperties.map(
//                   (property, index) => (

//                     <div
//                       className="propertyCard"
//                       key={`duplicate-${row}-${index}`}
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

//         {/* LIGHT BACKGROUND SHADE */}

//         <div className="backgroundShade" />

//         {/* =====================================================
//             SIGNUP POPUP
//         ===================================================== */}

//         <div className="overlay">

//           <div className="modal">

//             {/* CLOSE */}

//             <button
//               className="close"
//               type="button"
//               onClick={() => navigate("/")}
//               aria-label="Close"
//             >
//               <CloseIcon />
//             </button>

//             {/* HEADER */}

//             <div className="signupHeader">

//               <div className="miniLogo">
//                 <UserIcon />
//               </div>

//               <h2>
//                 Create your account
//               </h2>

//               <p>
//                 Join Take On BnB and find your
//                 perfect stay.
//               </p>

//             </div>

//             {/* =================================================
//                 SINGLE PHONE / EMAIL FIELD
//             ================================================= */}

//             <form onSubmit={handleContinue}>

//               <div className="field">

//                 <div className="input">

//                   <UserIcon />

//                   <input
//                     type="text"
//                     value={identifier}
//                     onChange={(e) =>
//                       setIdentifier(e.target.value)
//                     }
//                     placeholder="Phone number or email"
//                     disabled={loading}
//                     autoComplete="email tel"
//                   />

//                 </div>

//               </div>

//               {/* CONTINUE BUTTON */}

//               <button
//                 className="continue"
//                 type="submit"
//                 disabled={
//                   loading ||
//                   !identifier.trim()
//                 }
//               >

//                 {loading ? (
//                   <>
//                     Continue

//                     <span className="loadingDots">
//                       <span />
//                       <span />
//                       <span />
//                     </span>
//                   </>
//                 ) : (
//                   <>
//                     Continue
//                     <ArrowIcon />
//                   </>
//                 )}

//               </button>

//             </form>

//             {/* LOGIN FOOTER */}

//             <div className="footer">

//               Already have an account?{" "}

//               <button
//                 type="button"
//                 onClick={() => navigate("/login")}
//               >
//                 Log in
//               </button>

//             </div>

//           </div>

//         </div>

//       </div>
//     </>
//   );
// }
























import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext.jsx";
import { toast } from "sonner";

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [loading, setLoading] = useState(false);

  // ONE FIELD: email OR phone
  const [identifier, setIdentifier] = useState("");

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  /*
  =====================================================
  TEMPORARY DEHRADUN PROPERTIES
  3 ROWS × 7 PROPERTIES = 21
  =====================================================
  */

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

  /*
  =====================================================
  SIGNUP
  =====================================================
  */

  const handleSignup = async (e) => {
    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedIdentifier = identifier.trim();

    // Name validation
    if (!trimmedName) {
      toast.error("Full name is required");
      return;
    }

    // Identifier validation
    if (!trimmedIdentifier) {
      toast.error("Phone number or email is required");
      return;
    }

    /*
    Detect whether user entered email or phone
    */

    const looksLikeEmail = trimmedIdentifier.includes("@");

    let signupMethod = "email";
    let normalizedEmail = "";
    let cleanPhone = "";

    if (looksLikeEmail) {
      // EMAIL
      normalizedEmail = trimmedIdentifier.toLowerCase();

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(normalizedEmail)) {
        toast.error("Please enter a valid email address");
        return;
      }

      signupMethod = "email";
    } else {
      // PHONE
      cleanPhone = trimmedIdentifier.replace(/\D/g, "");

      if (!cleanPhone) {
        toast.error("Phone number is required");
        return;
      }

      if (cleanPhone.length !== 10) {
        toast.error("Please enter a valid 10-digit phone number");
        return;
      }

      if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
        toast.error("Please enter a valid Indian mobile number");
        return;
      }

      signupMethod = "phone";
    }

    // Password validation
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    // Confirm password validation
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await signup({
        name: trimmedName,
        email: normalizedEmail,
        phone: cleanPhone,
        password,
        role: "guest",
        signupMethod,
      });

      toast.success("Guest account created successfully!");

      /*
      =====================================================
      REDIRECT TO MAIN TAKE ON BNB WEBSITE
      =====================================================
      */

      window.location.href = "https://takeonbnb.com/";
    } catch (error) {
      console.error("Guest signup error:", error);

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to create account"
      );
    } finally {
      setLoading(false);
    }
  };

  /*
  =====================================================
  ICONS
  =====================================================
  */

  const CloseIcon = () => (
    <svg viewBox="0 0 24 24">
      <path d="M6 6L18 18M18 6L6 18" />
    </svg>
  );

  const UserIcon = () => (
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 21c.8-4 3.5-6 7.5-6s6.7 2 7.5 6" />
    </svg>
  );

  const MailPhoneIcon = () => (
    <svg viewBox="0 0 24 24">
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="M4 7l8 6 8-6" />
      <path d="M17.5 15.5h.01" />
    </svg>
  );

  const LockIcon = () => (
    <svg viewBox="0 0 24 24">
      <rect x="4" y="10" width="16" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );

  const ArrowIcon = () => (
    <svg viewBox="0 0 24 24">
      <path d="M5 12h13M13 6l6 6-6 6" />
    </svg>
  );

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
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;

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

        /* =====================================================
           MAIN PAGE
        ===================================================== */

        .signupPage {
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

        /* =====================================================
           BACKGROUND
        ===================================================== */

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

          z-index: 1;

          transform: scale(1.02);

          background:
            linear-gradient(
              135deg,
              rgba(255,255,255,.08),
              rgba(249,115,22,.04)
            );
        }

        .propertyBackground::before {
          content: "";

          position: absolute;

          width: 500px;
          height: 500px;

          left: 50%;
          top: 50%;

          transform: translate(-50%, -50%);

          border-radius: 50%;

          background:
            radial-gradient(
              circle,
              rgba(255,159,67,.13) 0%,
              rgba(255,159,67,.04) 35%,
              transparent 70%
            );

          pointer-events: none;

          animation:
            backgroundGlow 7s ease-in-out infinite;
        }

        @keyframes backgroundGlow {
          0%,
          100% {
            transform:
              translate(-50%, -50%)
              scale(.9);
            opacity: .65;
          }

          50% {
            transform:
              translate(-50%, -50%)
              scale(1.15);
            opacity: 1;
          }
        }

        .propertyRow {
          display: flex;

          width: max-content;

          gap: 16px;

          animation:
            propertyMove 42s linear infinite;

          will-change: transform;
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

          box-shadow:
            0 10px 30px
            rgba(0,0,0,.14);

          border:
            1px solid
            rgba(255,255,255,.9);

          transform:
            translateY(0)
            scale(1);

          animation:
            cardFloat 5s ease-in-out infinite;

          transition:
            transform .35s ease,
            box-shadow .35s ease;
        }

        .propertyCard:nth-child(2n) {
          animation-delay: -1.4s;
        }

        .propertyCard:nth-child(3n) {
          animation-delay: -2.7s;
        }

        .propertyCard:nth-child(4n) {
          animation-delay: -3.8s;
        }

        @keyframes cardFloat {
          0%,
          100% {
            transform:
              translateY(0)
              scale(1);
          }

          50% {
            transform:
              translateY(-6px)
              scale(1.012);
          }
        }

        .propertyCard img {
          width: 100%;
          height: 100%;

          object-fit: cover;

          display: block;

          transform: scale(1.03);

          transition:
            transform 1.2s ease;
        }

        .propertyCard:hover {
          transform:
            translateY(-10px)
            scale(1.04);

          box-shadow:
            0 20px 45px
            rgba(0,0,0,.2);

          z-index: 10;
        }

        .propertyCard:hover img {
          transform: scale(1.1);
        }

        .propertyCard::after {
          content: "";

          position: absolute;

          inset: 0;

          background:
            linear-gradient(
              to top,
              rgba(0,0,0,.72),
              rgba(0,0,0,.12) 62%,
              rgba(0,0,0,.02)
            );

          pointer-events: none;
        }

        .propertyDetails {
          position: absolute;

          left: 13px;
          right: 13px;
          bottom: 11px;

          z-index: 2;

          color: #fff;

          animation:
            detailsFade 1s ease both;
        }

        @keyframes detailsFade {
          from {
            opacity: 0;
            transform: translateY(5px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
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

          opacity: .9;

          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .propertyMeta {
          display: flex;

          align-items: center;

          justify-content: space-between;

          gap: 8px;

          font-size: 9px;

          opacity: .96;
        }

        .propertyPrice {
          font-weight: 800;
        }

        /* =====================================================
           VERY LIGHT SHADE
        ===================================================== */

        .backgroundShade {
          position: absolute;

          inset: 0;

          z-index: 2;

          background:
            rgba(25,21,18,.08);

          pointer-events: none;
        }

        /* =====================================================
           OVERLAY
        ===================================================== */

        .overlay {
          position: fixed;

          inset: 0;

          z-index: 1000;

          display: flex;

          align-items: center;
          justify-content: center;

          padding: 20px;

          background:
            rgba(18,16,15,.22);

          backdrop-filter:
            blur(2px);

          animation:
            overlayIn .35s ease both;
        }

        @keyframes overlayIn {
          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
        }

        /* =====================================================
           MODAL
        ===================================================== */

        .modal {
          width: 100%;

          max-width: 470px;

          position: relative;

          overflow: hidden;

          border-radius: 27px;

          padding:
            31px
            30px
            22px;

          background:
            linear-gradient(
              145deg,
              rgba(255,255,255,.995),
              rgba(251,249,246,.995)
            );

          border:
            1px solid
            rgba(255,255,255,.95);

          box-shadow:
            0 45px 110px
            rgba(0,0,0,.30),
            0 12px 35px
            rgba(0,0,0,.10);

          animation:
            modalIn .65s cubic-bezier(.16,1,.3,1) both;

          transform-origin:
            center center;
        }

        .modal::before {
          content: "";

          position: absolute;

          left: 0;
          right: 0;
          top: 0;

          height: 3px;

          background:
            linear-gradient(
              90deg,
              #ff9f43,
              #f97316,
              #ffb15c,
              #f97316
            );

          background-size:
            200% 100%;

          animation:
            gradientMove 3s linear infinite;
        }

        @keyframes gradientMove {
          from {
            background-position: 0% 50%;
          }

          to {
            background-position: 200% 50%;
          }
        }

        @keyframes modalIn {
          0% {
            opacity: 0;

            transform:
              translateY(35px)
              scale(.88)
              rotateX(8deg);
          }

          60% {
            opacity: 1;

            transform:
              translateY(-5px)
              scale(1.015)
              rotateX(0deg);
          }

          100% {
            opacity: 1;

            transform:
              translateY(0)
              scale(1)
              rotateX(0deg);
          }
        }

        /* =====================================================
           CLOSE BUTTON
        ===================================================== */

        .close {
          position: absolute;

          top: 17px;
          left: 17px;

          width: 33px;
          height: 33px;

          border-radius: 50%;

          border:
            1px solid
            #e4dfd9;

          background:
            rgba(255,255,255,.92);

          display: grid;

          place-items: center;

          z-index: 5;

          transition:
            transform .25s ease,
            background .2s ease,
            box-shadow .2s ease;
        }

        .close:hover {
          transform:
            rotate(90deg)
            scale(1.08);

          background: #fff7ed;

          border-color: #f97316;

          box-shadow:
            0 6px 18px
            rgba(249,115,22,.18);
        }

        .close svg {
          width: 16px;

          fill: none;

          stroke: #333;

          stroke-width: 1.7;
        }

        /* =====================================================
           HEADER
        ===================================================== */

        .signupHeader {
          text-align: center;

          padding:
            8px 20px 18px;

          animation:
            headerIn .65s .1s cubic-bezier(.16,1,.3,1) both;
        }

        @keyframes headerIn {
          from {
            opacity: 0;

            transform:
              translateY(15px);
          }

          to {
            opacity: 1;

            transform:
              translateY(0);
          }
        }

        .miniLogo {
          width: 45px;
          height: 45px;

          margin:
            0 auto 15px;

          border-radius: 15px;

          display: grid;

          place-items: center;

          color: #f97316;

          background:
            linear-gradient(
              145deg,
              #fff7ed,
              #ffedd5
            );

          box-shadow:
            0 8px 20px
            rgba(249,115,22,.12),
            inset 0 0 0 1px
            rgba(249,115,22,.06);

          animation:
            logoFloat 3s ease-in-out infinite;
        }

        @keyframes logoFloat {
          0%,
          100% {
            transform:
              translateY(0)
              rotate(0deg);
          }

          50% {
            transform:
              translateY(-4px)
              rotate(2deg);
          }
        }

        .miniLogo svg {
          width: 20px;

          fill: none;

          stroke: currentColor;

          stroke-width: 1.6;
        }

        .signupHeader h2 {
          margin: 0;

          color: #202020;

          font-family: Georgia, serif;

          font-size: 27px;

          font-weight: 500;

          letter-spacing: -.7px;
        }

        .signupHeader p {
          margin:
            9px 0 0;

          color: #77716c;

          font-size: 13px;

          line-height: 1.55;
        }

        /* =====================================================
           FORM
        ===================================================== */

        form {
          animation:
            formIn .65s .25s cubic-bezier(.16,1,.3,1) both;
        }

        @keyframes formIn {
          from {
            opacity: 0;

            transform:
              translateY(15px);
          }

          to {
            opacity: 1;

            transform:
              translateY(0);
          }
        }

        .field {
          margin-bottom: 15px;

          animation:
            fieldIn .55s cubic-bezier(.16,1,.3,1) both;
        }

        .field:nth-child(1) {
          animation-delay: .28s;
        }

        .field:nth-child(2) {
          animation-delay: .34s;
        }

        .field:nth-child(3) {
          animation-delay: .40s;
        }

        .field:nth-child(4) {
          animation-delay: .46s;
        }

        @keyframes fieldIn {
          from {
            opacity: 0;

            transform:
              translateY(12px);
          }

          to {
            opacity: 1;

            transform:
              translateY(0);
          }
        }

        .label {
          display: block;

          margin-bottom: 7px;

          color: #373330;

          font-size: 12px;

          font-weight: 750;
        }

        .input {
          height: 53px;

          display: flex;

          align-items: center;

          padding: 0 14px;

          border-radius: 12px;

          background: #fff;

          border:
            1px solid
            #cec8c2;

          box-shadow:
            0 2px 7px
            rgba(0,0,0,.025);

          transition:
            border-color .25s ease,
            box-shadow .25s ease,
            transform .25s ease;
        }

        .input:hover {
          border-color:
            #bdb5ae;

          transform:
            translateY(-1px);
        }

        .input:focus-within {
          border-color:
            #f97316;

          box-shadow:
            0 0 0 3px
            rgba(249,115,22,.075),
            0 7px 18px
            rgba(0,0,0,.05);

          transform:
            translateY(-1px);
        }

        .input svg {
          width: 18px;

          margin-right: 10px;

          flex-shrink: 0;

          fill: none;

          stroke: #77716d;

          stroke-width: 1.7;

          transition:
            stroke .25s ease,
            transform .25s ease;
        }

        .input:focus-within svg {
          stroke:
            #f97316;

          transform:
            scale(1.08);
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

        .input input::placeholder {
          color: #aaa39d;

          transition:
            opacity .2s ease;
        }

        .input:focus-within input::placeholder {
          opacity: .55;
        }

        /* =====================================================
           CONTINUE / CREATE BUTTON
        ===================================================== */

        .continue {
          position: relative;

          overflow: hidden;

          width: 100%;

          height: 51px;

          display: flex;

          align-items: center;

          justify-content: center;

          gap: 9px;

          border: 0;

          border-radius: 12px;

          color: white;

          background:
            linear-gradient(
              135deg,
              #ff9f43 0%,
              #f97316 50%,
              #ff9f43 100%
            );

          background-size:
            200% 100%;

          font-size: 14px;

          font-weight: 750;

          box-shadow:
            0 10px 25px
            rgba(249,115,22,.19);

          transition:
            transform .2s ease,
            box-shadow .2s ease;

          animation:
            buttonIn .6s .55s cubic-bezier(.16,1,.3,1) both,
            buttonGradient 4s linear infinite;
        }

        @keyframes buttonIn {
          from {
            opacity: 0;

            transform:
              translateY(12px)
              scale(.98);
          }

          to {
            opacity: 1;

            transform:
              translateY(0)
              scale(1);
          }
        }

        @keyframes buttonGradient {
          from {
            background-position:
              0% 50%;
          }

          to {
            background-position:
              200% 50%;
          }
        }

        .continue::before {
          content: "";

          position: absolute;

          top: 0;
          left: -120%;

          width: 70%;
          height: 100%;

          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(255,255,255,.35),
              transparent
            );

          transform:
            skewX(-20deg);

          animation:
            buttonShine 3.5s ease-in-out infinite;
        }

        @keyframes buttonShine {
          0% {
            left: -120%;
          }

          45%,
          100% {
            left: 140%;
          }
        }

        .continue:hover:not(:disabled) {
          transform:
            translateY(-2px)
            scale(1.01);

          box-shadow:
            0 15px 32px
            rgba(249,115,22,.27);
        }

        .continue:active:not(:disabled) {
          transform:
            translateY(0)
            scale(.985);
        }

        .continue:disabled {
          opacity: .6;

          cursor: not-allowed;
        }

        .continue svg {
          position: relative;

          z-index: 2;

          width: 17px;

          fill: none;

          stroke: currentColor;

          stroke-width: 1.8;

          transition:
            transform .25s ease;
        }

        .continue:hover:not(:disabled) svg {
          transform:
            translateX(4px);
        }

        /* =====================================================
           FOOTER
        ===================================================== */

        .footer {
          margin-top: 20px;

          padding-top: 15px;

          border-top:
            1px solid
            #ebe6e0;

          text-align: center;

          color: #817b75;

          font-size: 11px;

          animation:
            footerIn .6s .65s ease both;
        }

        @keyframes footerIn {
          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
        }

        .footer button {
          border: 0;

          padding: 0;

          background: transparent;

          color: #393532;

          font-weight: 700;

          text-decoration: underline;

          text-underline-offset: 2px;

          transition:
            color .2s ease;
        }

        .footer button:hover {
          color:
            #f97316;
        }

        /* =====================================================
           LOADING
        ===================================================== */

        .loadingDots {
          display: inline-flex;

          gap: 3px;

          align-items: center;
        }

        .loadingDots span {
          width: 4px;
          height: 4px;

          border-radius: 50%;

          background: currentColor;

          animation:
            loadingDot 1s infinite ease-in-out;
        }

        .loadingDots span:nth-child(2) {
          animation-delay: .15s;
        }

        .loadingDots span:nth-child(3) {
          animation-delay: .3s;
        }

        @keyframes loadingDot {
          0%,
          80%,
          100% {
            opacity: .3;

            transform:
              translateY(0);
          }

          40% {
            opacity: 1;

            transform:
              translateY(-3px);
          }
        }

        /* =====================================================
           MOBILE
        ===================================================== */

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

            padding:
              29px 20px 20px;

            border-radius: 23px;
          }

          .signupHeader {
            padding-bottom: 18px;
          }

          .signupHeader h2 {
            font-size: 24px;
          }

          .overlay {
            padding: 12px;
          }
        }

        /* =====================================================
           REDUCE MOTION ACCESSIBILITY
        ===================================================== */

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: .01ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>

      <div className="signupPage">

        {/* =====================================================
            BACKGROUND PROPERTY SECTION
        ===================================================== */}

        <div className="propertyBackground">

          {[0, 1, 2].map((row) => {
            const rowProperties = properties.slice(
              row * 7,
              row * 7 + 7
            );

            return (
              <div
                className="propertyRow"
                key={row}
              >

                {/* ORIGINAL 7 */}

                {rowProperties.map(
                  (property, index) => (
                    <div
                      className="propertyCard"
                      key={`original-${row}-${index}`}
                    >
                      <img
                        src={property.image}
                        alt={property.name}
                      />

                      <div className="propertyDetails">

                        <h3>
                          {property.name}
                        </h3>

                        <div className="propertyLocation">
                          {property.location}
                        </div>

                        <div className="propertyMeta">

                          <span>
                            {property.type}
                            {" • "}
                            {property.guests}
                          </span>

                          <span className="propertyPrice">
                            {property.price}
                          </span>

                        </div>

                      </div>
                    </div>
                  )
                )}

                {/* DUPLICATE 7 FOR SEAMLESS LOOP */}

                {rowProperties.map(
                  (property, index) => (
                    <div
                      className="propertyCard"
                      key={`duplicate-${row}-${index}`}
                    >
                      <img
                        src={property.image}
                        alt={property.name}
                      />

                      <div className="propertyDetails">

                        <h3>
                          {property.name}
                        </h3>

                        <div className="propertyLocation">
                          {property.location}
                        </div>

                        <div className="propertyMeta">

                          <span>
                            {property.type}
                            {" • "}
                            {property.guests}
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

        {/* LIGHT BACKGROUND SHADE */}

        <div className="backgroundShade" />

        {/* =====================================================
            SIGNUP POPUP
        ===================================================== */}

        <div className="overlay">

          <div className="modal">

            {/* CLOSE */}

            <button
              className="close"
              type="button"
              onClick={() => {
                window.location.href = "https://takeonbnb.com/";
              }}
              aria-label="Close"
            >
              <CloseIcon />
            </button>

            {/* HEADER */}

            <div className="signupHeader">

              <div className="miniLogo">
                <UserIcon />
              </div>

              <h2>
                Create your account
              </h2>

              <p>
                Join Take On BnB and find your
                perfect stay.
              </p>

            </div>

            {/* =================================================
                SIGNUP FORM
            ================================================= */}

            <form onSubmit={handleSignup}>

              {/* FULL NAME */}

              <div className="field">

                <label className="label">
                  Full Name
                </label>

                <div className="input">

                  <UserIcon />

                  <input
                    required
                    type="text"
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                    placeholder="Enter your full name"
                    disabled={loading}
                    autoComplete="name"
                  />

                </div>

              </div>

              {/* PHONE OR EMAIL */}

              <div className="field">

                <label className="label">
                  Phone number or email
                </label>

                <div className="input">

                  <MailPhoneIcon />

                  <input
                    required
                    type="text"
                    value={identifier}
                    onChange={(e) =>
                      setIdentifier(e.target.value)
                    }
                    placeholder="Phone number or email"
                    disabled={loading}
                    autoComplete="email tel"
                    inputMode="text"
                  />

                </div>

              </div>

              {/* PASSWORD */}

              <div className="field">

                <label className="label">
                  Password
                </label>

                <div className="input">

                  <LockIcon />

                  <input
                    required
                    type="password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    placeholder="Minimum 8 characters"
                    disabled={loading}
                    autoComplete="new-password"
                  />

                </div>

              </div>

              {/* CONFIRM PASSWORD */}

              <div className="field">

                <label className="label">
                  Confirm Password
                </label>

                <div className="input">

                  <LockIcon />

                  <input
                    required
                    type="password"
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(e.target.value)
                    }
                    placeholder="Confirm your password"
                    disabled={loading}
                    autoComplete="new-password"
                  />

                </div>

              </div>

              {/* CREATE ACCOUNT BUTTON */}

              <button
                className="continue"
                type="submit"
                disabled={
                  loading ||
                  !name.trim() ||
                  !identifier.trim() ||
                  !password ||
                  !confirmPassword
                }
              >

                {loading ? (
                  <>
                    Creating Account

                    <span className="loadingDots">
                      <span />
                      <span />
                      <span />
                    </span>
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowIcon />
                  </>
                )}

              </button>

            </form>

            {/* LOGIN FOOTER */}

            <div className="footer">

              Already have an account?{" "}

              <button
                type="button"
                onClick={() => navigate("/login")}
              >
                Log in
              </button>

            </div>

          </div>

        </div>

      </div>
    </>
  );
}