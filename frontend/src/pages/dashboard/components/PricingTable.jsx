import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check, Sparkles, Crown, Zap, Loader2, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";

const plans = [
  {
    name: "Standard Engine",
    price: "0",
    description: "Perfect for a quick professional refresh.",
    features: ["3 AI Credits", "Modern Template", "Standard PDF Export", "Community Support"],
    buttonText: "Current Plan",
    pro: false,
  },
  {
    name: "Executive Suite",
    price: "499",
    description: "Unlimited power for serious career moves.",
    features: [
      "Unlimited AI Generations",
      "All Premium Templates",
      "High-Fidelity PDF Forge",
      "ATS Keyword Analysis",
      "Priority Support",
    ],
    buttonText: "Upgrade to Pro",
    pro: true,
  },
];

export default function PricingTable({ user }) {
  const [loading, setLoading] = useState(false);
  const isPro = user?.subscriptionStatus === "pro";

  const handleSubscription = async () => {
    setLoading(true);
    try {
      const rawUrl = import.meta.env.VITE_APP_URL || "http://localhost:5001";
      const baseUrl = rawUrl.replace(/\/+$/, "");
      
      const response = await axios.post(
        `${baseUrl}/api/payments/create-checkout`,
        {},
        { withCredentials: true }
      );

      if (response.data?.data?.url) {
        window.location.href = response.data.data.url;
      }
    } catch (error) {
      toast.error("Stripe gateway is currently unavailable.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto py-12 px-4">
      {plans.map((plan, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className={`relative p-10 rounded-[3rem] border transition-all duration-500 ${
            plan.pro 
            ? "bg-slate-900 border-slate-800 text-white shadow-2xl shadow-purple-500/10" 
            : "bg-white border-slate-100 text-slate-900 shadow-sm"
          }`}
        >
          {plan.pro && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-purple-600 px-5 py-1.5 rounded-full flex items-center gap-2 shadow-lg shadow-purple-600/20">
              <Sparkles className="w-3 h-3 text-white" />
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white">Most Popular</span>
            </div>
          )}

          <div className="mb-10">
            <h3 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${plan.pro ? "text-purple-400" : "text-slate-400"}`}>
              {plan.name}
            </h3>
            <div className="flex items-baseline gap-1">
              <span className="text-6xl font-black tracking-tighter">₹{plan.price}</span>
              <span className={`text-xs font-bold ${plan.pro ? "opacity-40" : "text-slate-300"}`}>/lifetime</span>
            </div>
            <p className={`mt-6 text-[11px] font-medium leading-relaxed ${plan.pro ? "text-slate-400" : "text-slate-500"}`}>
              {plan.description}
            </p>
          </div>

          <div className="space-y-5 mb-12">
            {plan.features.map((feature, fIdx) => (
              <div key={fIdx} className="flex items-center gap-4">
                <div className={`p-1.5 rounded-xl ${plan.pro ? "bg-purple-500/10 text-purple-400" : "bg-slate-50 text-slate-400"}`}>
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span className={`text-xs font-bold tracking-tight ${plan.pro ? "text-slate-200" : "text-slate-600"}`}>
                  {feature}
                </span>
              </div>
            ))}
          </div>

          <Button
            onClick={plan.pro ? handleSubscription : null}
            disabled={loading || (isPro && plan.pro) || (!plan.pro)}
            className={`w-full h-16 rounded-2xl font-black uppercase text-[10px] tracking-[0.25em] transition-all active:scale-95 flex gap-3 shadow-xl ${
              plan.pro 
              ? "bg-purple-600 hover:bg-purple-500 text-white shadow-purple-600/20" 
              : "bg-slate-50 text-slate-300 border border-slate-100 cursor-default"
            }`}
          >
            {loading ? (
              <Loader2 className="animate-spin w-5 h-5" />
            ) : isPro && plan.pro ? (
              <>
                <Crown className="w-4 h-4 text-purple-400" />
                Executive Suite Active
              </>
            ) : (
              <>
                {plan.pro ? <Zap className="w-4 h-4" /> : <Rocket className="w-4 h-4" />}
                {plan.buttonText}
              </>
            )}
          </Button>
        </motion.div>
      ))}
    </div>
  );
}