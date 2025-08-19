import React from "react";
import { FaReact, FaAngular, FaVuejs, FaJs, FaTypo3 } from "react-icons/fa";

export default function Hero() {
  return (
    <section className="flex flex-col md:flex-row items-center justify-between px-12 py-20">
      {/* Left Content */}
      <div className="max-w-xl space-y-6">
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
          A better way to build <br /> with modern components
        </h1>
        <p className="text-lg text-gray-200">
          Bit is a scalable and collaborative way to build and reuse
          components. It's everything you need from local development to
          cross-project integrations. Try it for free.
        </p>
        <div className="flex gap-4">
          <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-semibold">
            Get Started
          </button>
          <button className="px-6 py-3 border border-gray-300 hover:bg-white hover:text-black rounded-lg font-semibold">
            Learn More
          </button>
        </div>

        {/* Icons */}
        <div className="flex gap-6 mt-6 text-4xl">
          <FaReact className="text-cyan-400" />
          <FaVuejs className="text-green-400" />
          <FaAngular className="text-red-500" />
          <FaTypo3 className="text-blue-400" />
          <FaJs className="text-yellow-400" />
        </div>
      </div>

      {/* Right Image */}
      <div className="mt-10 md:mt-0">
        <img
          src="https://cdn.dribbble.com/users/1162077/screenshots/3848914/programmer.gif"
          alt="Illustration"
          className="w-[400px] rounded-lg"
        />
      </div>
    </section>
  );
}
