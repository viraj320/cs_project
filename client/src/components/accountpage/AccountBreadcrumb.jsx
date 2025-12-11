import React from 'react';
import { Link } from 'react-router-dom';

const tabLabels = {
  dashboard: 'My Account',
  orders: 'My Orders',
  wishlist: 'My Wishlist',
  reviews: 'My Reviews',
  editProfile: 'My Profile',
};

const AccountBreadcrumb = ({ selectedTab }) => {
  const label = tabLabels[selectedTab] || 'My Account';

  return (
    <h3 className="text-sm text-gray-500 mb-10">
      <Link
        to="/"
        className="no-underline text-gray-500 hover:text-red-600 transition-colors"
      >
        Home
      </Link>
      &nbsp;&gt;&nbsp;
      <span className="text-gray-800 font-medium">My Account</span>
      {selectedTab !== 'dashboard' && (
        <>
          &nbsp;&gt;&nbsp;
          <span className="text-gray-800 font-medium">{label}</span>
        </>
      )}
    </h3>
  );
};

export default AccountBreadcrumb;
