import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { toast } from "sonner";
import { User, Mail, Lock, Loader2, KeyRound } from "lucide-react";

const HostRegisterPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("email");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!name || !email) {
      toast.error("Please fill your name and email");
      return;
    }
    try {
      setLoading(true);
      await api.post("/auth/request-email-otp", { email });
      toast.success("OTP sent to your email");
      setStep("otp");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) {
      toast.error("Please enter the OTP");
      return;
    }
    try {
      setLoading(true);
      await api.post("/auth/verify-email-otp", { email, otpCode: otp });
      toast.success("OTP verified");
      setStep("password");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      toast.error("Please set your password");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      setLoading(true);
      await api.post("/auth/register", {
        fullName: name,
        email,
        password,
        role: "host",
      });
      toast.success("Host account created successfully");
      navigate("/host/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setLoading(true);
      await api.post("/auth/request-email-otp", { email });
      toast.success("OTP resent to your email");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-12 pt-28">
      <Helmet>
        <title> Become a Host | Take On BnB</title>
      </Helmet>
      <Card className="w-full max-w-md shadow-xl rounded-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-red-600">
            Become a Host
          </CardTitle>
          <CardDescription>
            {step === "email" && "Enter your details to get started"}
            {step === "otp" && "Enter the OTP sent to your email"}
            {step === "password" && "Set your account password"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === "email" && (
            <form onSubmit={handleSendOtp} className="space-y-5">
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input className="pl-10" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input type="email" className="pl-10" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Sending OTP...</>) : ("Send OTP")}
              </Button>
            </form>
          )}
          {step === "otp" && (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div className="relative">
                <KeyRound className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input type="text" maxLength={6} className="pl-10 text-center tracking-widest" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Verifying...</>) : ("Verify OTP")}
              </Button>
              <div className="flex justify-between text-sm">
                <button type="button" onClick={() => setStep("email")} className="text-muted-foreground hover:underline">Back</button>
                <button type="button" onClick={handleResendOtp} disabled={loading} className="text-primary hover:underline">Resend OTP</button>
              </div>
            </form>
          )}
          {step === "password" && (
            <form onSubmit={handleRegister} className="space-y-5">
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input type="password" className="pl-10" placeholder="Password (min 8 characters)" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input type="password" className="pl-10" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating...</>) : ("Create Host Account")}
              </Button>
            </form>
          )}
          <div className="text-center mt-6">
            Already a host?{" "}
            <Link to="/host/login" className="text-primary font-semibold">Login</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HostRegisterPage;
