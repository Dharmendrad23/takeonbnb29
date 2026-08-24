// import React, { useState, useEffect } from 'react';



// import { Link, useLocation } from 'react-router-dom';



// import { motion, AnimatePresence } from 'framer-motion';



// import { Menu, X, User as UserIcon } from 'lucide-react';



// import { Button } from '@/components/ui/button';



// import { useAuth } from '@/contexts/AuthContext.jsx';



// import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';







// const Header = () => {



//   const [scrolled, setScrolled] = useState(false);



//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);



//   const location = useLocation();



//   const { isAuthenticated, isHost, logout } = useAuth();







//   useEffect(() => {



//     const handleScroll = () => {



//       setScrolled(window.scrollY > 20);



//     };



//     window.addEventListener('scroll', handleScroll);



//     return () => window.removeEventListener('scroll', handleScroll);



//   }, []);







//   useEffect(() => {



//     setMobileMenuOpen(false);



//   }, [location]);







//   const navLinks = [



//     { name: 'Home', path: '/' },



//     { name: 'Properties', path: '/properties' },



//   ];







//   return (



//     <motion.header



//       initial={{ y: -50 }}



//       animate={{ y: 0 }}



//       className={`relative w-full z-50 transition-smooth ${scrolled ? 'bg-background/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'



//         }`}



//     >



//       <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">



//         <Link to="/" className="flex items-center group">



//           <img



//             src="https://horizons-cdn.hostinger.com/2ceef933-42f9-4bf3-b184-5d8c655ff5d5/0cbd9e7f2fa675b1aaff550ff98f8777.jpg"



//             alt="Take on BnB"



//             className="h-[70px] md:h-[50px] w-auto object-contain transition-transform group-hover:scale-105"



//           />



//         </Link>







//         {/* Desktop Nav */}



//         <nav className="hidden md:flex items-center gap-8">



//           {navLinks.map((link) => (



//             <Link



//               key={link.name}



//               to={link.path}



//               className={`text-sm font-semibold transition-colors hover:text-primary ${location.pathname === link.path ? 'text-primary' : 'text-foreground/90'



//                 }`}



//             >



//               {link.name}



//             </Link>



//           ))}



//         </nav>







//         {/* Desktop Actions */}



//         <div className="hidden md:flex items-center gap-4">



//           {!isHost && (

//             <Button variant="ghost" asChild className="font-semibold text-foreground hover:bg-muted rounded-full">

//               <Link to="/host/login">Become a Host</Link>

//             </Button>

//           )}

//           <Button variant="ghost" asChild className="font-semibold text-foreground hover:bg-muted rounded-full">
//             <Link to="/admin/login">Admin Login</Link>
//           </Button>



//           {!isAuthenticated ? (



//             <div className="flex items-center gap-2">



//               <Button variant="outline" asChild className="font-semibold rounded-full border-border">



//                 <Link to="/login">Log In</Link>



//               </Button>



//             </div>



//           ) : (



//             <DropdownMenu>



//               <DropdownMenuTrigger asChild>



//                 <Button variant="outline" size="icon" className="rounded-full w-10 h-10 border-border bg-card shadow-sm hover:shadow-md transition-all">



//                   <UserIcon className="w-5 h-5 text-foreground/80" />



//                 </Button>



//               </DropdownMenuTrigger>



//               <DropdownMenuContent align="end" className="w-48 rounded-xl mt-2">



//                 <DropdownMenuItem asChild className="cursor-pointer font-medium py-2.5">



//                   <Link to={isHost ? '/host/dashboard' : '/guest/dashboard'}>Dashboard</Link>



//                 </DropdownMenuItem>



//                 <DropdownMenuItem className="cursor-pointer font-medium py-2.5 text-destructive focus:text-destructive" onClick={logout}>



//                   Log Out



//                 </DropdownMenuItem>



//               </DropdownMenuContent>



//             </DropdownMenu>



//           )}



//         </div>







//         {/* Mobile Menu Toggle */}



//         <button



//           className="md:hidden p-2 text-foreground bg-background/50 rounded-full backdrop-blur-sm"



//           onClick={() => setMobileMenuOpen(!mobileMenuOpen)}



//           aria-label="Toggle menu"



//         >



//           {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}



//         </button>



//       </div>







//       {/* Mobile Nav */}



//       <AnimatePresence>



//         {mobileMenuOpen && (



//           <motion.div



//             initial={{ opacity: 0, height: 0 }}



//             animate={{ opacity: 1, height: 'auto' }}



//             exit={{ opacity: 0, height: 0 }}



//             className="md:hidden bg-background border-b border-border overflow-hidden"



//           >



//             <div className="px-4 py-6 flex flex-col gap-4">



//               {navLinks.map((link) => (



//                 <Link



//                   key={link.name}



//                   to={link.path}



//                   className="text-lg font-semibold text-foreground py-2 border-b border-border/50"



//                 >



//                   {link.name}



//                 </Link>



//               ))}



//               {!isHost && (

//                 <Link to="/host/login" className="text-lg font-semibold text-foreground py-2 border-b border-border/50">

//                   Become a Host

//                 </Link>

//               )}

//               <Link to="/admin/login" className="text-lg font-semibold text-foreground py-2 border-b border-border/50">
//                 Admin Login
//               </Link>



//               <div className="flex flex-col gap-3 mt-4">



//                 {!isAuthenticated ? (



//                   <>



//                     <Button variant="outline" asChild className="w-full justify-center rounded-xl h-12 text-base">



//                       <Link to="/login">Log In</Link>



//                     </Button>



//                   </>



//                 ) : (



//                   <>



//                     <Button variant="outline" asChild className="w-full justify-center rounded-xl h-12 text-base">



//                       <Link to={isHost ? '/host/dashboard' : '/guest/dashboard'}>Dashboard</Link>



//                     </Button>



//                     <Button variant="ghost" onClick={logout} className="w-full justify-center text-destructive h-12 text-base">



//                       Log Out



//                     </Button>



//                   </>



//                 )}



//               </div>



//             </div>



//           </motion.div>



//         )}



//       </AnimatePresence>



//     </motion.header>



//   );



// };







// export default Header;













































import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext.jsx';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const location = useLocation();

  const {
    isAuthenticated,
    isHost,
    logout
  } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    {
      name: 'Home',
      path: '/'
    },
    {
      name: 'Properties',
      path: '/properties'
    }
  ];

  return (
    <motion.header
      initial={{ y: -50 }}
      animate={{ y: 0 }}
      className={`relative w-full z-50 transition-smooth ${
        scrolled
          ? 'bg-background/90 backdrop-blur-md shadow-sm py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">

        {/* LOGO */}
        <Link to="/" className="flex items-center group">
          <img
            src="https://horizons-cdn.hostinger.com/2ceef933-42f9-4bf3-b184-5d8c655ff5d5/0cbd9e7f2fa675b1aaff550ff98f8777.jpg"
            alt="Take on BnB"
            className="h-[70px] md:h-[50px] w-auto object-contain transition-transform group-hover:scale-105"
          />
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-sm font-semibold transition-colors hover:text-primary ${
                location.pathname === link.path
                  ? 'text-primary'
                  : 'text-foreground/90'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* DESKTOP ACTIONS */}
        <div className="hidden md:flex items-center gap-4">

          {!isHost && (
            <Button
              variant="ghost"
              asChild
              className="font-semibold text-foreground hover:bg-muted rounded-full"
            >
              <Link to="/host/login">
                Become a Host
              </Link>
            </Button>
          )}

          <Button
            variant="ghost"
            asChild
            className="font-semibold text-foreground hover:bg-muted rounded-full"
          >
            <Link to="/admin/login">
              Admin Login
            </Link>
          </Button>

          {/* LOGIN */}
          {!isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                asChild
                className="font-semibold rounded-full border-border"
              >
                <Link to="/login">
                  Log In
                </Link>
              </Button>
            </div>
          ) : (
            <DropdownMenu>

              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full w-10 h-10 border-border bg-card shadow-sm hover:shadow-md transition-all"
                >
                  <UserIcon className="w-5 h-5 text-foreground/80" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-48 rounded-xl mt-2"
              >
                <DropdownMenuItem
                  asChild
                  className="cursor-pointer font-medium py-2.5"
                >
                  <Link
                    to={
                      isHost
                        ? '/host/dashboard'
                        : '/guest/dashboard'
                    }
                  >
                    Dashboard
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="cursor-pointer font-medium py-2.5 text-destructive focus:text-destructive"
                  onClick={logout}
                >
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>

            </DropdownMenu>
          )}
        </div>

        {/* MOBILE MENU TOGGLE */}
        <button
          className="md:hidden p-2 text-foreground bg-background/50 rounded-full backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen
            ? <X size={24} />
            : <Menu size={24} />
          }
        </button>

      </div>

      {/* MOBILE NAV */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{
              opacity: 0,
              height: 0
            }}
            animate={{
              opacity: 1,
              height: 'auto'
            }}
            exit={{
              opacity: 0,
              height: 0
            }}
            className="md:hidden bg-background border-b border-border overflow-hidden"
          >

            <div className="px-4 py-6 flex flex-col gap-4">

              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-lg font-semibold text-foreground py-2 border-b border-border/50"
                >
                  {link.name}
                </Link>
              ))}

              {!isHost && (
                <Link
                  to="/host/login"
                  className="text-lg font-semibold text-foreground py-2 border-b border-border/50"
                >
                  Become a Host
                </Link>
              )}

              <Link
                to="/admin/login"
                className="text-lg font-semibold text-foreground py-2 border-b border-border/50"
              >
                Admin Login
              </Link>

              <div className="flex flex-col gap-3 mt-4">

                {!isAuthenticated ? (
                  <Button
                    variant="outline"
                    asChild
                    className="w-full justify-center rounded-xl h-12 text-base"
                  >
                    <Link to="/login">
                      Log In
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      asChild
                      className="w-full justify-center rounded-xl h-12 text-base"
                    >
                      <Link
                        to={
                          isHost
                            ? '/host/dashboard'
                            : '/guest/dashboard'
                        }
                      >
                        Dashboard
                      </Link>
                    </Button>

                    <Button
                      variant="ghost"
                      onClick={logout}
                      className="w-full justify-center text-destructive h-12 text-base"
                    >
                      Log Out
                    </Button>
                  </>
                )}

              </div>

            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </motion.header>
  );
};

export default Header;