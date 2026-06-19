// import React from "react";
// import { Link } from "react-router-dom";

// import images from "../assets/images.jpg";
// import kkk from "../assets/kkk.jpg";
// import lll from "../assets/lll.jpg";
// import nnn from "../assets/nnn.jpg";
// import bg from "../assets/bg.jpg";
// import Navbar from "./comman/Navbar";
// import Footer from "./comman/Footer";



// export default function Home() {
//   return (
//     <div>
//       <Navbar/>
//       {/* Hero Section */}
//       <section className="px-6 py-44 bg-neutral-0">
//         <div className="flex flex-col md:flex-row md:px-16 md:gap-20">
//           {/* Text */}
//           <div className="md:w-1/2 mb-6">
//             <h1 className="text-3xl md:text-4xl font-bold mb-4">
//               Debre Berhan University
//             </h1>
//             <h2 className="text-lg md:text-xl mb-6">
//               Join over 20,000 university and startups.
//             </h2>
//             <button className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-5 py-3 rounded">
//               <Link to={"/login"}>Get Started</Link> 
//             </button>
//           </div>

//           {/* Images */}
//           <div className="flex flex-col items-center md:w-1/2 space-y-4">
//             <div className="flex justify-center gap-4">
//               <img
//                 src={images}
//                 alt="img3"
//                 className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-orange-600"
//               />
//               <img
//                 src={kkk}
//                 alt="img4"
//                 className="w-16 h-16 md:w-20 md:h-20 mt-8 rounded-full object-cover"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Second Image Row */}
//         <div className="flex flex-col md:flex-row gap- mt-">
//           <div className="w-full md:w-1/2  justify-center">
//             <img src={bg} alt="bg" className="max-w-full h-auto" />
//           </div>
//           <div className="w-full md:w-1/2 flex justify-center gap-4 items-center">
//             <img
//               src={lll}
//               alt="img1"
//               className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover"
//             />
//             <img
//               src={nnn}
//               alt="img2"
//               className="w-32 h-32 md:w-48 md:h-48 rounded-full object-cover border-4 border-orange-600"
//             />
//           </div>
//         </div>

//         {/* Button Row */}
//         <div className="w-full bg-gray-200 py-6 mt-">
//           <div className="flex flex-wrap justify-center gap-4">
//             {[...Array(5)].map((_, i) => (
//               <button
//                 key={i}
//                 className="bg-slate-500 hover:bg-slate-600 text-white font-semibold px-6 py-4 rounded"
//               >
//                <Link to={"/login"}>Get Started</Link> 
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Footer Label */}
//         <div className="text-center text-xl font-semibold text-gray-800 mt-6">
//           Courses We Offer
//         </div>
//       </section>

//       {/* Full Footer */}
//       <Footer/>
//     </div>
//   );
// }

import React from "react";
import { Link } from "react-router-dom";
import { 
  Layout, Palette, Type, Layers, BarChart3, AppWindow, 
  Terminal, ArrowRight, Sparkles, Command, Cpu, ShieldCheck 
} from "lucide-react";

import Footer from "./comman/Footer";

export default function Home() {
  return (
    /* Changed bg to a light gray-white and text to dark slate */
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-blue-500/20 font-sans overflow-x-hidden">
      
      {/* --- ADVANCED BACKGROUND ELEMENTS --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Animated Noise Texture Overlay - More visible on light bg */}
        <div className="absolute inset-0 opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-multiply" />
        
        {/* Adjusted Dynamic Glows for Light Mode */}
        <div className="absolute top-[-10%] left-[-10%] w-[70vw] h-[70vw] bg-blue-400/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-indigo-400/5 rounded-full blur-[120px]" />
      </div>

      <main className="relative z-10">
        {/* --- HERO SECTION --- */}
        <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
          <div className="text-center">
            
            {/* Minimalist Badge - Darker borders for contrast */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-200 bg-white/50 backdrop-blur-md mb-10 transform hover:scale-105 transition-all shadow-sm">
              <Sparkles size={12} className="text-blue-500" />
              <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-slate-500">
                System Version 2026.04
              </span>
            </div>

            {/* Kinetic Headline - Tighter tracking, Slate-to-Blue gradient */}
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-[0.85]">
              System for <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600">
                Academic Excellence.
              </span>
            </h1>

            {/* Subtext - Minimized Font */}
            <p className="text-sm md:text-base text-slate-500 max-w-xl mx-auto mb-10 leading-relaxed font-medium">
              A high-performance management core for Infolinc University College. 
              Built for speed, security, and seamless administrative flow.
            </p>

            {/* Minimized Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-32">
              <Link to="/login" className="px-8 py-3 bg-slate-900 text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center gap-2 shadow-xl shadow-slate-900/10">
                Launch Portal <ArrowRight size={14} />
              </Link>
              <button className="px-8 py-3 bg-white border border-slate-200 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
                Student Portal
              </button>
            </div>

            {/* --- THE ADVANCED BENTO GRID (Light Version) --- */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { icon: <Cpu size={18} />, count: "128ms", label: "Runtime Speed", color: "text-blue-600" },
                { icon: <ShieldCheck size={18} />, count: "99.9%", label: "System Uptime", color: "text-cyan-600" },
                { icon: <Command size={18} />, count: "45+", label: "Modules", color: "text-indigo-600" },
                { icon: <Layers size={18} />, count: "Postgres", label: "Core DB", color: "text-purple-600" },
                { icon: <BarChart3 size={18} />, count: "Real-time", label: "Analytics", color: "text-blue-700" },
                { icon: <AppWindow size={18} />, count: "v4.0", label: "LTS Build", color: "text-blue-500" },
              ].map((card, i) => (
                /* bg-white with a very soft shadow and thin slate border */
                <div key={i} className="group relative bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm transition-all hover:shadow-md hover:border-slate-300">
                  <div className={`mb-4 transition-transform group-hover:scale-110 ${card.color}`}>
                    {card.icon}
                  </div>
                  <h4 className="text-xl font-black mb-1 tracking-tight text-slate-800">{card.count}</h4>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">{card.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- INTERACTIVE SECTION: SYSTEM NODES (Light Mode) --- */}
        <section className="py-20 px-6 max-w-7xl mx-auto border-t border-slate-200/60">
           <div className="grid md:grid-cols-2 gap-20 items-center">
              <div>
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-4 block">Core Technology</span>
                <h2 className="text-3xl font-black mb-6 tracking-tighter">Unified Architecture.</h2>
                <p className="text-[13px] text-slate-500 leading-relaxed mb-8">
                  Our advanced system intelligence layer bridges the gap between massive academic data and actionable insights. 
                  Deploying end-to-end encryption for every student transaction.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-xs font-bold mb-1 tracking-tight text-slate-800">Cloud Sync</p>
                    <p className="text-[10px] text-slate-500">Auto-backup across nodes</p>
                  </div>
                  <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-xs font-bold mb-1 tracking-tight text-slate-800">AI Grading</p>
                    <p className="text-[10px] text-slate-500">Neural result processing</p>
                  </div>
                </div>
              </div>
              <div className="relative group">
                {/* Subtle outer glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-[2rem] blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
                <div className="relative bg-white border border-slate-200 rounded-[2rem] p-10 h-80 flex items-center justify-center shadow-sm">
                   <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 rounded-full border border-blue-500/20 border-dashed animate-spin-slow flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.3)]" />
                        </div>
                      </div>
                      <p className="text-[10px] font-mono text-slate-400">ENCRYPTED_NODE_STABLE</p>
                   </div>
                </div>
              </div>
           </div>
        </section>
      </main>

      {/* <Footer /> */}

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
      `}</style>
    </div>
  );
}