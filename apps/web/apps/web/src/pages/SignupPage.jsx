import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import { useAuth } from '@/contexts/AuthContext.jsx';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';

import { toast } from 'sonner';

import {
  Lock,
  User,
  Loader2,
  Mail
} from 'lucide-react';


const SignupPage = () => {

  const navigate = useNavigate();

  const { signup } = useAuth();

  const [loading, setLoading] = useState(false);

  const [name, setName] = useState('');

  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');

  const [confirmPassword, setConfirmPassword] = useState('');


  const handleSignup = async (e) => {

    e.preventDefault();

    const cleanName = name.trim();

    const cleanEmail = email
      .trim()
      .toLowerCase();


    if (!cleanName) {

      toast.error(
        'Please enter your full name'
      );

      return;
    }


    if (!cleanEmail) {

      toast.error(
        'Please enter your email'
      );

      return;
    }


    if (password.length < 8) {

      toast.error(
        'Password must be at least 8 characters'
      );

      return;
    }


    if (password !== confirmPassword) {

      toast.error(
        'Passwords do not match'
      );

      return;
    }


    setLoading(true);


    try {

      console.log(
        '[Guest Signup] Creating account:',
        cleanEmail
      );


      const result = await signup(

        cleanEmail,

        password,

        cleanName,

        'guest'

      );


      console.log(
        '[Guest Signup] Success:',
        result
      );


      toast.success(
        'Account created successfully!'
      );


      /*
       Guest ab automatically logged in hai
       Home page par bhej do
      */

      navigate('/');


    } catch (error) {

      console.error(
        '[Guest Signup] Error:',
        error
      );


      toast.error(

        error.message ||

        'Failed to create account. Please try again.'

      );


    } finally {

      setLoading(false);

    }

  };


  return (

    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-12 pt-28">

      <Helmet>

        <title>
          Sign Up | TakeOn BnB
        </title>

      </Helmet>


      <Card className="w-full max-w-md shadow-xl border-border rounded-2xl overflow-hidden">


        <CardHeader className="text-center pb-6 bg-primary-gradient text-white">


          <CardTitle className="text-3xl font-extrabold tracking-tight">

            Join TakeOn BnB

          </CardTitle>


          <CardDescription className="text-white/80 mt-2">

            Create an account to book your perfect stay

          </CardDescription>


        </CardHeader>



        <CardContent className="pt-8">


          <form
            onSubmit={handleSignup}
            className="space-y-5"
          >


            {/* FULL NAME */}

            <div className="space-y-2">

              <label className="text-sm font-bold text-foreground">

                Full Name

              </label>


              <div className="relative">

                <User className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />


                <Input

                  required

                  value={name}

                  onChange={(e) =>
                    setName(e.target.value)
                  }

                  className="pl-10 h-12"

                  placeholder="Enter your name"

                  disabled={loading}

                />

              </div>

            </div>



            {/* EMAIL */}

            <div className="space-y-2">

              <label className="text-sm font-bold text-foreground">

                Email

              </label>


              <div className="relative">

                <Mail className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />


                <Input

                  required

                  type="email"

                  value={email}

                  onChange={(e) =>
                    setEmail(e.target.value)
                  }

                  className="pl-10 h-12"

                  placeholder="your@email.com"

                  disabled={loading}

                />

              </div>

            </div>



            {/* PASSWORD */}

            <div className="space-y-2">

              <label className="text-sm font-bold text-foreground">

                Password

              </label>


              <div className="relative">

                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />


                <Input

                  required

                  type="password"

                  value={password}

                  onChange={(e) =>
                    setPassword(e.target.value)
                  }

                  className="pl-10 h-12"

                  placeholder="Minimum 8 characters"

                  disabled={loading}

                />

              </div>

            </div>



            {/* CONFIRM PASSWORD */}

            <div className="space-y-2">

              <label className="text-sm font-bold text-foreground">

                Confirm Password

              </label>


              <div className="relative">

                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />


                <Input

                  required

                  type="password"

                  value={confirmPassword}

                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }

                  className="pl-10 h-12"

                  placeholder="Confirm password"

                  disabled={loading}

                />

              </div>

            </div>



            {/* SUBMIT */}

            <Button

              type="submit"

              className="w-full h-12 text-base font-bold rounded-xl mt-4 bg-primary text-white hover:bg-primary/90"

              disabled={
                loading ||
                !name ||
                !email ||
                !password ||
                !confirmPassword
              }

            >

              {loading ? (

                <>

                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />

                  Creating Account...

                </>

              ) : (

                'Create Account'

              )}

            </Button>


          </form>



          <div className="mt-6 text-center text-sm">

            <span className="text-muted-foreground">

              Already have an account?

            </span>


            {' '}


            <Link

              to="/login"

              className="text-primary hover:underline font-bold"

            >

              Log in

            </Link>

          </div>


        </CardContent>


      </Card>


    </div>

  );

};


export default SignupPage;