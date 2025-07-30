import React from 'react'
import Navbar from '../navbar/Navbar'
import Footer from '../footer/Footer'
import { ToastContainer } from 'react-toastify'

function Layout({ children }) {
  return (
    <div>
      <Navbar />
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="section">
        <div className="container">
          {children}
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Layout
