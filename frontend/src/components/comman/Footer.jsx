import React from 'react'
import {
  FaFacebookF,
  FaInstagram,
  FaXTwitter,
  FaGithub,
  FaYoutube,
} from "react-icons/fa6";
function Footer() {
  return (
    <footer className="bg-slate-700 text-gray-300 px-6 py-12">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 text-sm">
            <div>
              <h4 className="font-semibold text-white mb-4">Solutions</h4>
              <ul className="space-y-2">
                <li>Marketing</li>
                <li>Analytics</li>
                <li>Automation</li>
                <li>Commerce</li>
                <li>Insights</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2">
                <li>Submit ticket</li>
                <li>Documentation</li>
                <li>Guides</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2">
                <li>About</li>
                <li>Blog</li>
                <li>Jobs</li>
                <li>Press</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>Terms of service</li>
                <li>Privacy policy</li>
                <li>License</li>
              </ul>
            </div>
          </div>

          {/* Newsletter */}
          <div className="border-t border-gray-700 pt-8">
            <h5 className="text-white font-semibold mb-2">
              Subscribe to our newsletter
            </h5>
            <p className="text-sm text-gray-400 mb-4">
              The latest news, articles, and resources, sent to your inbox
              weekly.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:max-w-md">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 bg-[#1e293b] border border-gray-600 rounded text-white focus:outline-none"
              />
              <button
                type="submit"
                className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-5 py-2 rounded"
              >
                Subscribe
              </button>
            </form>
          </div>

          <div className="border-t border-gray-700 pt-6 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
            <p>© 2024 Your Company, Inc. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 sm:mt-0 text-white text-lg">
              <FaFacebookF />
              <FaInstagram />
              <FaXTwitter />
              <FaGithub />
              <FaYoutube />
            </div>
          </div>
        </div>
      </footer>
  )
}

export default Footer
