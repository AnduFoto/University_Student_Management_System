import React from 'react'
import {useState} from 'react'
import { Link } from 'react-router-dom';
function Navbar() {
     const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (

    
          <div className=" text-gray-800">
            {/* Navbar */}
            <header className="fixed top-0 left-0 w-full z-50 shadow bg-gray-100 text-gray-900 px-6 py-3 flex items-center justify-between border-b">
              <h1 className="text-2xl font-bold">DEBRE BERHAN UNIVERSITY</h1>
      
              {/* Desktop Nav */}
              <nav className="hidden md:flex space-x-6 text-md font-medium">
               <Link to="/">Home</Link>
               <Link to="/contact">Contact</Link>
               <Link to="/about">About Us</Link>   
               <Link to="/registration">Register</Link>
              </nav>
      
              {/* Mobile Menu Button */}
              <button
                className="md:hidden text-white"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                ☰
              </button>
      
            <div className="hidden md:flex items-center space-x-4">
                <button className="bg-orange-600 hover:bg-orange-700 text-gary-900 font-semibold px-5 py-2 rounded">
                 <Link to={"/login"}>LOGIN</Link> 
                </button>
              </div>
            </header>
      
            {/* Mobile Nav */}
            {isMenuOpen && (
              <nav className="md:hidden mt-8 flex flex-col items-start px-6 py-16 space-y-2 bg-slate-800 text-white">
              <Link to="/">Home</Link>
               <Link to="/contact">Contact</Link>
               <Link to="/about">About Us</Link>   
               <Link to="/registration">Register</Link>
               
                <button className="bg-orange-600 mt-2 hover:bg-orange-700 text-gary-900 font-semibold px-4 py-2 rounded">
                  LOGIN
                </button>
              </nav>
            )}
    </div>
  )
}

export default Navbar



