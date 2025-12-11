import React from "react";
import {
  FaTachometerAlt, FaShoppingCart, FaHeart, FaCommentDots, FaUser, FaSignOutAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AccountBreadcrumb from "./AccountBreadCrumb";
//import AccountBreadcrumb from "../../components/accountpage/AccountBreadcrumb"; 

const AccountSidebar = ({ selectedTab, setSelectedTab }) => {
  const navigate = useNavigate();
  // determine role (guard for SSR safety)
  const userRole = typeof window !== 'undefined' ? localStorage.getItem('userRole') : null;

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const tabItem = (icon, label, tabKey) => (
    <li
      className={`flex items-center gap-3 cursor-pointer ${
        selectedTab === tabKey ? 'text-red-600 font-medium' : 'text-gray-700 hover:text-red-600'
      }`}
      onClick={() => setSelectedTab(tabKey)}
    >
      {icon}
      {label}
    </li>
  );

  return (
    <div className="w-full max-w-xs p-4 space-y-4">
      <AccountBreadcrumb selectedTab={selectedTab} /> {/*  Dynamic Breadcrumb */}
      <ul className="space-y-8 pt-4">
        {tabItem(<FaTachometerAlt />, 'Dashboard', 'dashboard')}

        {/* Only customers should see Orders / Wishlist / Reviews */}
        {userRole === 'customer' && tabItem(<FaShoppingCart />, 'My Orders', 'orders')}
        {userRole === 'customer' && tabItem(<FaHeart />, 'My Wishlist', 'wishlist')}
        {userRole === 'customer' && tabItem(<FaCommentDots />, 'My Reviews', 'reviews')}

        {tabItem(<FaUser />, 'My Profile', 'editProfile')}
        <li
          className="flex items-center gap-3 text-gray-700 cursor-pointer hover:text-red-600"
          onClick={handleLogout}
        >
          <FaSignOutAlt /> Logout
        </li>
      </ul>
    </div>
  );
};

export default AccountSidebar;
