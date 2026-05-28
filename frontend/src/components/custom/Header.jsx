import React, { useState } from "react";
import { Button } from "../ui/button";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/Services/login";
import { addUserData } from "@/features/user/userFeatures";
import { 
  Compass, 
  LogOut, 
  LayoutDashboard, 
  Rocket,
  Menu,
  X 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function Header({ user }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      const response = await logoutUser();
      if (response.statusCode === 200) {
        dispatch(addUserData(""));
        navigate("/");
      }
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  return (
    <nav className="sticky top-0 z-[100] border-b border-sky-100/70 bg-white/90 backdrop-blur-xl transition-all duration-300">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
        
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 p-2.5 shadow-lg shadow-cyan-200 transition-all duration-300 group-hover:rotate-6">
            <div className="absolute inset-0 bg-white/10" />
            <Compass className="relative z-10 h-5 w-5 text-white" />
          </div>
          <h1 className="text-xl font-black tracking-tight text-slate-900 md:text-2xl">
            ElevateCV <span className="text-cyan-600">Studio</span>
          </h1>
        </Link>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Button
                variant="ghost"
                className={`hidden md:flex items-center gap-2 font-bold rounded-2xl h-11 px-6 transition-all ${
                  location.pathname === "/dashboard" 
                  ? "border border-cyan-200 bg-cyan-50 text-cyan-700" 
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
                onClick={() => navigate("/dashboard")}
              >
                <LayoutDashboard className="w-4 h-4" />
                Workspace
              </Button>

              <Button
                variant="ghost"
                className="hidden h-11 items-center gap-2 rounded-2xl px-4 font-bold text-slate-600 transition-all hover:bg-red-50 hover:text-red-500 md:flex"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4"/>
                Sign Out
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6"/> : <Menu className="w-6 h-6"/>}
              </Button>
              
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="relative h-10 w-10 cursor-pointer overflow-hidden rounded-2xl border border-cyan-100 bg-gradient-to-tr from-cyan-500 to-blue-500 shadow-md"
              >
                <div className="absolute inset-0 bg-white/20" />
              </motion.div>
            </>
          ) : (
            <Link to="/auth/sign-in">
              <Button className="group flex h-12 gap-2 rounded-2xl bg-slate-900 px-8 text-[10px] font-black uppercase tracking-[0.2em] text-white transition-all hover:bg-cyan-600">
                Launch <Rocket className="h-4 w-4 text-cyan-300 transition-colors group-hover:text-white"/>
              </Button>
            </Link>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && user && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col gap-2 border-b border-sky-100 bg-white p-4 backdrop-blur-xl md:hidden"
          >
            <Button 
              variant="ghost"
              className={`w-full justify-start h-12 rounded-xl font-bold gap-3 ${
                location.pathname === "/dashboard"
                ? "bg-cyan-50 text-cyan-700"
                : "text-slate-700"
              }`}
              onClick={() => { 
                navigate("/dashboard"); 
                setIsMobileMenuOpen(false); 
              }}
            >
              <LayoutDashboard className="w-4 h-4" /> 
              Workspace
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start h-12 rounded-xl font-bold gap-3 text-red-400 hover:bg-red-500/10" 
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4"/> Sign Out
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Header;