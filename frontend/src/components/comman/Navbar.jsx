// import React from 'react'
// import {useState} from 'react'
// import { Link } from 'react-router-dom';
// function Navbar() {
//      const [isMenuOpen, setIsMenuOpen] = useState(false);
//   return (

    
//           <div className=" text-gray-800">
//             {/* Navbar */}
//             <header className="fixed top-0 left-0 w-full z-50 shadow bg-gray-100 text-gray-900 px-6 py-3 flex items-center justify-between border-b">
//               <h1 className="text-2xl font-bold">DEBRE BERHAN UNIVERSITY</h1>
      
//               {/* Desktop Nav */}
//               <nav className="hidden md:flex space-x-6 text-md font-medium">
//                <Link to="/">Home</Link>
//                <Link to="/contact">Contact</Link>
//                <Link to="/about">About Us</Link>   
//                <Link to="/registration">Register</Link>
//               </nav>
      
//               {/* Mobile Menu Button */}
//               <button
//                 className="md:hidden text-white"
//                 onClick={() => setIsMenuOpen(!isMenuOpen)}
//               >
//                 ☰
//               </button>
      
//             <div className="hidden md:flex items-center space-x-4">
//                 <button className="bg-orange-600 hover:bg-orange-700 text-gary-900 font-semibold px-5 py-2 rounded">
//                  <Link to={"/login"}>LOGIN</Link> 
//                 </button>
//               </div>
//             </header>
      
//             {/* Mobile Nav */}
//             {isMenuOpen && (
//               <nav className="md:hidden mt-8 flex flex-col items-start px-6 py-16 space-y-2 bg-slate-800 text-white">
//               <Link to="/">Home</Link>
//                <Link to="/contact">Contact</Link>
//                <Link to="/about">About Us</Link>   
//                <Link to="/registration">Register</Link>
               
//                 <button className="bg-orange-600 mt-2 hover:bg-orange-700 text-gary-900 font-semibold px-4 py-2 rounded">
//                   LOGIN
//                 </button>
//               </nav>
//             )}
//     </div>
//   )
// }

// export default Navbar


import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Moon, Laptop, GraduationCap } from 'lucide-react';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Change background on scroll for that premium feel
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // const navLinks = [
  //   { name: 'Home', path: '/' },
  //   { name: 'About Us', path: '/about' },
  //   { name: 'Registration', path: '/registration' },
  //   { name: 'Contact', path: '/contact' },
  // ];

  return (
    <div className="fixed top-0 left-0 w-full z-[100] px-4 sm:px-8 py-6">
      <header 
        className={`mx-auto max-w-7xl transition-all duration-500 rounded-2xl border border-white/40 ${
          scrolled 
          /* Sligtly Gray / White when scrolled */
          ? "bg-white/70 backdrop-blur-xl shadow-xl py-3 border-white/60" 
          /* Transparent White when at top */
          : "bg-white/20 backdrop-blur-md py-4 border-white/20"
        }`}
      >
        <div className="px-6 flex items-center justify-between">
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20 group-hover:scale-110 transition-transform">
              <GraduationCap className="text-white" size={24} />
            </div>
            <div className="flex flex-col">
              {/* Changed text to gray-900 for visibility on light bg */}
              <h1 className="text-slate-900 font-black leading-none tracking-tighter text-lg uppercase">
                Infolink University College
              </h1>
              <span className="text-blue-600 text-[10px] font-bold tracking-[0.2em] uppercase">University</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          {/* <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  location.pathname === link.path 
                  ? "text-blue-400 bg-blue-400/10" 
                  : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav> */}

          {/* Action Area */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3 mr-2 border-r border-slate-200 pr-4 text-slate-500">
              <Moon size={18} className="cursor-pointer hover:text-blue-600 transition-colors" />
            </div>
            
            <Link 
              to="/login" 
              className="hidden md:block bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-95"
            >
              LOGIN
            </Link>

            {/* Mobile Menu Toggle - Changed to slate-900 for contrast */}
            <button
              className="md:hidden text-slate-900 p-2 hover:bg-black/5 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        <div 
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          {/* Mobile bg changed to light gray */}
          <nav className="flex flex-col gap-2 p-6 bg-slate-50/95 border-t border-slate-200 mt-3 rounded-b-2xl">
            {/* {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className="text-slate-300 hover:text-blue-400 font-bold py-2 transition-colors text-sm"
              >
                {link.name}
              </Link>
            ))} */}
            <Link 
              to="/login"
              className="mt-4 bg-blue-600 text-white text-center font-bold py-3 rounded-xl shadow-lg"
            >
              LOGIN
            </Link>
          </nav>
        </div>
      </header>
    </div>
  );
}

export default Navbar;