import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FaPhoneAlt, FaEnvelope, FaShoppingCart, FaUser,
  FaFacebookF, FaInstagram, FaLinkedinIn,
  FaBars, FaTimes
} from 'react-icons/fa';
import Garage from '../../assets/Garage.png';
import {CartContext} from'../../context/CartContext'

const NavBar = ({ handleSidebarToggle }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const {getTotalPrice} = useContext(CartContext)
  const totalPrice = getTotalPrice();

  useEffect(() => {
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user);
  }, [location]);

  const handleContactClick = () => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        window.scrollToContact?.();
      }, 300);
    } else {
      window.scrollToContact?.();
    }
    setMenuOpen(false);
  };

  const handleAccountClick = () => {
    navigate('/account');
    setMenuOpen(false);
  };

  // Removed direct Garage Dashboard link - garage dashboard is now an independent admin/owner area

  return (
    <header className="shadow-md sticky top-0 z-50 bg-white">
      {/* Top Bar */}
      <div className="bg-gray-100 text-sm flex justify-between items-center px-4 py-2">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <FaEnvelope className="text-blue-600" />
            <span>vehiclespare@gmail.com</span>
          </div>
          <div className="flex items-center gap-2">
            <FaPhoneAlt className="text-blue-600" />
            <span>0479892752</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-gray-700">
          <a
            href="https://www.facebook.com/sanduni.wathsala.14203544?mibextid=ZbWKwL"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600"
          >
            <FaFacebookF />
          </a>
          <a
            href="https://www.linkedin.com/in/sanduni-wathsala-90894a254"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600"
          >
            <FaLinkedinIn />
          </a>
          <a
            href="https://www.instagram.com/sanduni_wathsala_sw/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600"
          >
            <FaInstagram />
          </a>
          <div className="flex items-center gap-1 cursor-pointer hover:text-blue-600">
            <FaUser />
            {isLoggedIn ? (
              <span onClick={handleAccountClick}>Account</span>
            ) : (
              <Link to="/login" className="hover:text-blue-600">Login</Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <div className="bg-white px-1 py-0 flex justify-between items-center min-h-[50px]">
        <div className="flex items-center">
          <img src={Garage} alt="Logo" className="h-12 md:h-16 w-auto object-contain" />
        </div>

        <nav className="hidden md:flex gap-6 text-gray-700 font-medium text-sm">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <Link to="/emer" className="hover:text-blue-600">Emergency</Link>
          <Link to="/spareparts" className="hover:text-blue-600">Spare Parts</Link>
          <Link to="/garage" className="hover:text-blue-600">Find Garages</Link>

          {/* Garage dashboard removed from main nav - accessed separately */}

          <Link to="/aboutus" className="hover:text-blue-600">About</Link>
          <button onClick={handleContactClick} className="hover:text-blue-600">Contact</button>
        </nav>

        <div className="flex items-center gap-3 text-gray-700 text-sm">
          <button className="flex items-center gap-1" onClick={handleSidebarToggle}>
            <FaShoppingCart />
            <span className="hidden sm:inline">Rs {totalPrice?.toLocaleString()}</span>
          </button>
          <button className="md:hidden text-xl" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <nav className="flex flex-col items-center md:hidden bg-white gap-4 py-4 shadow-md text-gray-700 font-medium">
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/spareparts" onClick={() => setMenuOpen(false)}>Spare Parts</Link>
          <Link to="/emer" onClick={() => setMenuOpen(false)}>Emergency</Link>
          <Link to="/garage" onClick={() => setMenuOpen(false)}>Find Garages</Link>

          {/* Garage dashboard removed from main nav - accessed separately */}

          <Link to="/aboutus" onClick={() => setMenuOpen(false)}>About</Link>
          <button onClick={handleContactClick}>Contact</button>
          {isLoggedIn ? (
            <button onClick={handleAccountClick}>Account</button>
          ) : (
            <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
          )}
        </nav>
      )}
    </header>
  );
};

export default NavBar;