import React, { useState } from "react";
import { 
  User, 
  Lock, 
  LogIn, 
  UserPlus, 
  Eye, 
  EyeOff, 
  Compass, 
  Loader2,
  Mail,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { loginUser, registerUser } from "@/Services/login";
import { useNavigate } from "react-router-dom";

function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (event) => {
    setError("");
    event.preventDefault();
    const formData = new FormData(event.target);
    const email = formData.get("email");
    const password = formData.get("password");
    const fullName = formData.get("fullname");

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        const response = await registerUser({ fullName, email, password });
        if (response?.statusCode === 201) {
          const loginRes = await loginUser({ email, password });
          if (loginRes?.statusCode === 200) navigate("/dashboard");
        }
      } else {
        const user = await loginUser({ email, password });
        if (user?.statusCode === 200) navigate("/dashboard");
      }
    } catch (err) {
      setError(err.message || "Authentication failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-50 p-6 selection:bg-cyan-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-16 -top-16 h-72 w-72 rounded-full bg-cyan-200/50 blur-3xl" />
        <div className="absolute -bottom-20 right-0 h-80 w-80 rounded-full bg-blue-200/40 blur-3xl" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 mb-8 text-center"
      >
        <div className="mb-4 inline-flex items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 p-3.5 shadow-xl shadow-cyan-100">
          <Compass className="h-6 w-6 text-white" />
        </div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900">
          ElevateCV <span className="text-cyan-600">Studio</span>
        </h1>
        <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
          Smart Access for Career Builders
        </p>
      </motion.div>

      <motion.div
        className="relative z-10 w-full max-w-md rounded-[2rem] border border-slate-100 bg-white p-8 shadow-[0_50px_100px_-20px_rgba(15,23,42,0.12)] sm:p-10"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="mb-10 flex rounded-2xl border border-slate-100 bg-slate-50 p-1.5">
          <button
            onClick={() => { setIsSignUp(false); setError(""); }}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${
              !isSignUp ? "bg-white text-slate-900 shadow-md" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <LogIn className="w-4 h-4" /> Sign In
          </button>
          <button
            onClick={() => { setIsSignUp(true); setError(""); }}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${
              isSignUp ? "bg-white text-slate-900 shadow-md" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <UserPlus className="w-4 h-4" /> Join
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={isSignUp ? "signup" : "signin"}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="mb-8">
               <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                {isSignUp ? "Start Your Journey" : "Welcome Back"}
              </h2>
              <p className="text-slate-500 text-sm font-medium mt-1">
                {isSignUp ? "Create an account to build your future." : "Please enter your details to continue."}
              </p>
            </div>
            
            <form onSubmit={handleAuth} className="space-y-5">
              {isSignUp && (
                <div className="group relative">
                  <User className="absolute left-4 top-4 h-5 w-5 text-slate-300 transition-colors group-focus-within:text-cyan-600" />
                  <input
                    type="text"
                    name="fullname"
                    placeholder="Your Full Name"
                    required
                    className="w-full rounded-2xl border-none bg-slate-50 py-4 pl-12 pr-4 font-bold text-slate-700 outline-none transition-all focus:bg-white focus:ring-8 focus:ring-cyan-600/10"
                  />
                </div>
              )}
              
              <div className="group relative">
                <Mail className="absolute left-4 top-4 h-5 w-5 text-slate-300 transition-colors group-focus-within:text-cyan-600" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  required
                  className="w-full rounded-2xl border-none bg-slate-50 py-4 pl-12 pr-4 font-bold text-slate-700 outline-none transition-all focus:bg-white focus:ring-8 focus:ring-cyan-600/10"
                />
              </div>

              <div className="group relative">
                <Lock className="absolute left-4 top-4 h-5 w-5 text-slate-300 transition-colors group-focus-within:text-cyan-600" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  required
                  className="w-full rounded-2xl border-none bg-slate-50 py-4 pl-12 pr-12 font-bold text-slate-700 outline-none transition-all focus:bg-white focus:ring-8 focus:ring-cyan-600/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-4 text-slate-300 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group mt-4 flex w-full items-center justify-center gap-3 rounded-2xl bg-slate-900 py-5 text-xs font-black uppercase tracking-[0.2em] text-white shadow-xl shadow-slate-200 transition-all hover:bg-cyan-600 active:scale-95"
              >
                {loading ? (
                  <Loader2 className="animate-spin w-5 h-5" />
                ) : (
                  <>
                    {isSignUp ? "Create Account" : "Sign In"}
                    <Sparkles className="h-4 w-4 text-cyan-300 transition-transform group-hover:rotate-12" />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </AnimatePresence>

        {error && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="mt-8 flex items-center justify-center gap-2 rounded-2xl border border-red-100 bg-red-50 p-4 text-[10px] font-black uppercase tracking-widest text-red-600"
          >
            <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />
            {error}
          </motion.div>
        )}
      </motion.div>
      
      <p className="relative z-10 mt-10 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
        Secure Access Verified
      </p>
    </div>
  );
}

export default AuthPage;