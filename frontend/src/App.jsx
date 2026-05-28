import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { useDispatch, useSelector } from "react-redux";

// ALIGNMENT FIX: Use direct production imports to avoid Mock Fallback
import Header from "./components/custom/Header"; 
import { addUserData } from "./features/user/userFeatures";
import { startUser } from "./Services/login";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  const user = useSelector((state) => state.editUser?.userData);
  const [authChecking, setAuthChecking] = useState(true);

  useEffect(() => {
    const verifySession = async () => {
      try {
        const response = await startUser();
        if (response && response.statusCode === 200) {
          // Syncs real user data to Redux
          dispatch(addUserData(response.data));
        } else {
          dispatch(addUserData(null));
        }
      } catch (error) {
        dispatch(addUserData(null));
      } finally {
        setAuthChecking(false);
      }
    };
    verifySession();
  }, [dispatch]);

  useEffect(() => {
    if (!authChecking && !user) {
      if (location.pathname.includes("/dashboard")) {
        navigate("/");
      }
    }
  }, [authChecking, user, navigate, location]);

  if (authChecking) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-cyan-600"></div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Verifying workspace session...</p>
        </div>
      </div>
    );
  }

 return (
  <>
    <Toaster />
    <div className="min-h-screen bg-slate-50">
      {/* HEADER FIX: This will now show your real Sign Out button */}
      <Header user={user} />
      <main>
        <Outlet />
      </main>
    </div>
  </>
);
}

export default App;