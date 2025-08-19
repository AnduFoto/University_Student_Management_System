import React from 'react'
import Navbar from './comman/Navbar.jsx'
import Footer from './comman/Footer.jsx'
import { Outlet } from 'react-router-dom'
function Root() {
  return (
    <div>
      <Navbar/>
      <Outlet/>
      <Footer/>
    </div>
  )
}

export default Root
