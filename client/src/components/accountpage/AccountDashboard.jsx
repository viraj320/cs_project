import React from 'react';
import { FaEnvelope, FaUser } from 'react-icons/fa';

const AccountDashboard = ({ user, onEditClick }) => {
  const fullName = user?.name || 'Name not available';

  return (
    <div className="bg-white border rounded-md w-full max-w-3xl mt-20">
      {/* Header */}
      <div className="flex justify-between items-center bg-gray-100 px-6 py-4 border-b">
        <h2 className="text-lg font-medium text-gray-800">Account Information</h2>
        <button
          className="text-sm text-gray-500 hover:text-red-600"
          onClick={onEditClick}
        >
          Edit
        </button>
      </div>

      {/* Details */}
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4 text-gray-700">
          <FaUser className="text-2xl text-gray-500" />
          <span className="text-base">{fullName}</span>
        </div>
        <div className="flex items-center gap-4 text-gray-700">
          <FaEnvelope className="text-2xl text-gray-500" />
          <span className="text-base">{user?.email}</span>
        </div>
      </div>
    </div>
  );
};

export default AccountDashboard;
