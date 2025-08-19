import React from "react";
import { Link } from "react-router-dom";

import images from "../assets/images.jpg";
import kkk from "../assets/kkk.jpg";
import lll from "../assets/lll.jpg";
import nnn from "../assets/nnn.jpg";
import bg from "../assets/bg.jpg";
import Navbar from "./comman/Navbar";
import Footer from "./comman/Footer";



export default function Home() {
  return (
    <div>
      <Navbar/>
      {/* Hero Section */}
      <section className="px-6 py-44 bg-neutral-0">
        <div className="flex flex-col md:flex-row md:px-16 md:gap-20">
          {/* Text */}
          <div className="md:w-1/2 mb-6">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Debre Berhan University
            </h1>
            <h2 className="text-lg md:text-xl mb-6">
              Join over 20,000 university and startups.
            </h2>
            <button className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-5 py-3 rounded">
              <Link to={"/login"}>Get Started</Link> 
            </button>
          </div>

          {/* Images */}
          <div className="flex flex-col items-center md:w-1/2 space-y-4">
            <div className="flex justify-center gap-4">
              <img
                src={images}
                alt="img3"
                className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-orange-600"
              />
              <img
                src={kkk}
                alt="img4"
                className="w-16 h-16 md:w-20 md:h-20 mt-8 rounded-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Second Image Row */}
        <div className="flex flex-col md:flex-row gap- mt-">
          <div className="w-full md:w-1/2  justify-center">
            <img src={bg} alt="bg" className="max-w-full h-auto" />
          </div>
          <div className="w-full md:w-1/2 flex justify-center gap-4 items-center">
            <img
              src={lll}
              alt="img1"
              className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover"
            />
            <img
              src={nnn}
              alt="img2"
              className="w-32 h-32 md:w-48 md:h-48 rounded-full object-cover border-4 border-orange-600"
            />
          </div>
        </div>

        {/* Button Row */}
        <div className="w-full bg-gray-200 py-6 mt-">
          <div className="flex flex-wrap justify-center gap-4">
            {[...Array(5)].map((_, i) => (
              <button
                key={i}
                className="bg-slate-500 hover:bg-slate-600 text-white font-semibold px-6 py-4 rounded"
              >
               <Link to={"/login"}>Get Started</Link> 
              </button>
            ))}
          </div>
        </div>

        {/* Footer Label */}
        <div className="text-center text-xl font-semibold text-gray-800 mt-6">
          Courses We Offer
        </div>
      </section>

      {/* Full Footer */}
      <Footer/>
    </div>
  );
}