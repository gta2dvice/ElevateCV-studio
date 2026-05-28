// components/custom/Hero.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, BadgeCheck, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export default function Hero() {
  const [index, setIndex] = useState(0);
  const words = ["Interviews.", "Offers.", "Momentum.", "Clarity."];

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-cyan-50 via-white to-slate-100 py-16 md:py-24">
      <div className="absolute inset-0 z-0">
        <motion.div
          animate={{ scale: [1, 1.14, 1], x: [0, 40, 0], y: [0, 30, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
          className="absolute left-[-8%] top-[-10%] h-[22rem] w-[22rem] rounded-full bg-cyan-200/50 blur-[90px]"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], x: [0, -24, 0], y: [0, -30, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-6%] right-[-4%] h-[24rem] w-[24rem] rounded-full bg-blue-200/40 blur-[100px]"
        />
      </div>

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-16 px-6 md:grid-cols-2 md:px-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex w-fit items-center gap-3 rounded-full border border-cyan-100 bg-white px-4 py-1.5 shadow-sm"
        >
          <span className="flex h-2 w-2 animate-pulse rounded-full bg-cyan-500" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">
            Personalized AI Job Narrative Engine
          </span>
        </motion.div>

        <div className="min-h-[180px] md:min-h-[240px]">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-black leading-[0.95] tracking-tight text-slate-900 md:text-7xl"
          >
            Build a Resume That Wins
            <br />
            <span className="relative mt-2 inline-block">
              <AnimatePresence mode="wait">
                <motion.span
                  key={words[index]}
                  initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                  transition={{ duration: 0.5, ease: "circOut" }}
                  className="inline-block bg-gradient-to-r from-cyan-600 to-blue-700 bg-clip-text text-transparent"
                >
                  {words[index]}
                </motion.span>
              </AnimatePresence>
            </span>
          </motion.h1>
        </div>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="max-w-xl text-lg font-medium leading-relaxed text-slate-600"
        >
          ElevateCV Studio turns your experience into focused, ATS-friendly achievements and role-specific storytelling in minutes.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-10 flex flex-col items-start gap-4 sm:flex-row"
        >
          <Link to="/auth/sign-in" className="w-full sm:w-auto">
            <Button className="flex h-14 w-full gap-3 rounded-2xl bg-slate-900 px-10 text-xs font-black uppercase tracking-widest text-white transition-all hover:bg-cyan-600 sm:w-auto">
              Start Building <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          
          <a href="#templates" className="w-full sm:w-auto">
            <Button variant="outline" className="flex h-14 w-full gap-3 rounded-2xl border-slate-200 bg-white px-10 text-xs font-black uppercase tracking-widest text-slate-700 hover:bg-slate-100 sm:w-auto">
              <BadgeCheck className="h-4 w-4 text-cyan-600" /> Explore Templates
            </Button>
          </a>
        </motion.div>

        <div className="mt-8 flex flex-wrap gap-3 text-xs font-semibold text-slate-600">
          <span className="rounded-full bg-white px-4 py-2 shadow-sm">ATS Scoring</span>
          <span className="rounded-full bg-white px-4 py-2 shadow-sm">Smart Rewrite</span>
          <span className="rounded-full bg-white px-4 py-2 shadow-sm">Designer Templates</span>
        </div>
      </div>
      <div className="relative z-10 mx-auto mt-14 max-w-7xl px-6 md:px-10">
        <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl shadow-slate-200/70 backdrop-blur">
          <div className="grid gap-5 md:grid-cols-3">
            {[
              { label: "Resumes Generated", value: "47K+" },
              { label: "Average ATS Lift", value: "32%" },
              { label: "Hiring Satisfaction", value: "4.9/5" },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl bg-slate-50 p-5">
                <p className="text-sm font-semibold text-slate-500">{item.label}</p>
                <p className="mt-2 text-3xl font-black text-slate-900">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}