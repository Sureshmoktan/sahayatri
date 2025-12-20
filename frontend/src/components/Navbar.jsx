import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../redux/slices/authSlice'

export default function Navbar() {
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  console.log(user,"user")

  return (
    <nav className="bg-blue-900 text-white px-6 py-4 flex justify-between items-center shadow-lg">
    <h1 className="text-2xl font-bold hover:scale-105 transition-transform duration-300">
      <Link to="/">Sahayarti</Link>
    </h1>
    <div className="flex items-center space-x-4 md:space-x-6">
      <Link
        to="/"
        className="hover:text-blue-300 transform hover:scale-105 transition duration-300"
      >
        Home
      </Link>
      <Link
        to="/about"
        className="hover:text-blue-300 transform hover:scale-105 transition duration-300"
      >
        About
      </Link>
      <Link
        to="/contact"
        className="hover:text-blue-300 transform hover:scale-105 transition duration-300"
      >
        Contact
      </Link>
      <Link
        to="/gallery"
        className="hover:text-blue-300 transform hover:scale-105 transition duration-300"
      >
        Gallery
      </Link>
  
     {user ? (
  <>
    <span className="font-semibold px-2 py-1 rounded hover:bg-blue-800 transition">
      Hi, {user.name}
    </span>
    {user.role === "admin" ? (
      <>
      <Link to="/admin" className="px-3 py-1 rounded hover:bg-blue-800 transition transform hover:scale-105">
        Dashboard
      </Link>
        <Link to="/workshop" className="px-3 py-1 rounded hover:bg-blue-800 transition transform hover:scale-105">
        Add workshop
      </Link>
      </>
    ) : (
      <Link to="/owner" className="px-3 py-1 rounded hover:bg-blue-800 transition transform hover:scale-105">
        Profile
      </Link>
    )}
    <button
      onClick={() => dispatch(logout())}
      className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition transform hover:scale-105"
    >
      Logout
    </button>
  </>
) : (
  <>
    <span className="font-semibold px-2 py-1">Hi,</span>
    <Link
      to="/login"
      className="px-4 py-2 bg-white text-blue-900 rounded shadow hover:bg-gray-100 transform hover:scale-105 transition"
    >
      Login
    </Link>
    <Link
      to="/register"
      className="px-4 py-2 bg-white text-blue-900 rounded shadow hover:bg-gray-100 transform hover:scale-105 transition"
    >
      Register
    </Link>
  </>
)}

    </div>
  </nav>
  
  )
}
