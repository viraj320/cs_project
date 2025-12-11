import React, { useState } from 'react';
import AccountSidebar from '../../components/accountpage/AccountSideBar';
import AccountDashboard from '../../components/accountpage/AccountDashboard';
import EditProfileForm from '../../components/accountpage/EditProfileForm';
import MyOrders from '../../components/accountpage/MyOrders';
import MyWishlist from '../../components/accountpage/MyWishlist'; 
import MyReviews from '../../components/accountpage/MyReviews';
import AccountSectionTemplate from '../../components/accountpage/AccountSectionTemplate';

const AccountPage = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const userRole = typeof window !== 'undefined' ? localStorage.getItem('userRole') : null;
  const [selectedTab, setSelectedTab] = useState('dashboard');

  // Prevent non-customers from opening customer-only tabs
  React.useEffect(() => {
    if ((selectedTab === 'orders' || selectedTab === 'wishlist' || selectedTab === 'reviews') && userRole !== 'customer') {
      setSelectedTab('dashboard');
    }
  }, [selectedTab, userRole]);

  return (
    <div className="flex p-6 bg-gray-50 min-h-[500px] gap-6">
      <AccountSidebar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      <div className="flex-1">
        {selectedTab === 'dashboard' && (
          <AccountDashboard user={user} onEditClick={() => setSelectedTab('editProfile')} />
        )}
        {selectedTab === 'editProfile' && <EditProfileForm user={user} />}
        {selectedTab === 'orders' && userRole === 'customer' && <MyOrders />}
        {selectedTab === 'wishlist' && userRole === 'customer' && <MyWishlist />} 
        {selectedTab === 'reviews' && userRole === 'customer' && <MyReviews />}
      </div>
    </div>
  );
};

export default AccountPage;
