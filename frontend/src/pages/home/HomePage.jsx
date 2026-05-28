// pages/Homepage.jsx
import React from 'react';
import Hero from './Hero';
import { Features } from './Features';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from 'react-router-dom';

function Homepage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-cyan-100">
      <main>
        <Hero />

        <section className="border-y border-slate-100 bg-white py-20">
          <div className="mx-auto max-w-7xl px-6 md:px-10">
            <div className="mb-14 text-center">
              <h2 className="mb-3 text-[10px] font-black uppercase tracking-[0.3em] text-cyan-600">How It Works</h2>
              <h3 className="text-4xl font-black tracking-tight text-slate-900 md:text-5xl">Three Steps to Your Next Opportunity</h3>
            </div>
            
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {[
                { step: "01", title: "Upload Experience", desc: "Bring your work history, projects, and target role details." },
                { step: "02", title: "Optimize with AI", desc: "Refine language, impact, and keywords with guided suggestions." },
                { step: "03", title: "Export & Apply", desc: "Download clean PDF resumes built for recruiters and ATS." }
              ].map((item, i) => (
                <div key={i} className="rounded-3xl border border-slate-100 bg-slate-50 p-8 shadow-sm">
                  <div className="mb-5 inline-flex rounded-full bg-cyan-100 px-3 py-1 text-xs font-black tracking-wider text-cyan-700">{item.step}</div>
                  <h4 className="mb-3 text-2xl font-black tracking-tight text-slate-900">{item.title}</h4>
                  <p className="font-medium leading-relaxed text-slate-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Features />

        <section className="py-24 pb-28">
          <div className="mx-auto max-w-5xl px-6 text-center md:px-10">
            <h2 className="mb-8 text-5xl font-black tracking-tight text-slate-900 md:text-6xl">Ready to Level Up Your Career Story?</h2>
            <p className="mx-auto mb-10 max-w-3xl text-lg font-medium text-slate-600">
              Create tailored resumes that spotlight your strongest wins and match each role with precision.
            </p>
            <Button 
              onClick={() => navigate('/dashboard')}
              className="h-16 rounded-2xl bg-slate-900 px-12 text-xs font-black uppercase tracking-[0.25em] text-white shadow-xl transition-all hover:bg-cyan-600"
            >
              Enter Workspace <ArrowRight className="ml-3 h-5 w-5" />
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white py-12">
        <div className="mx-auto max-w-7xl px-6 text-center text-[10px] font-black uppercase tracking-widest text-slate-400 md:px-10">
           © 2026 ElevateCV Studio • Crafted for career acceleration
        </div>
      </footer>
    </div>
  );
}

export default Homepage;