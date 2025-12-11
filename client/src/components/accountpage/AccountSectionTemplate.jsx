// src/components/accountpage/AccountSectionTemplate.jsx
import React from 'react';

const AccountSectionTemplate = ({ title, message }) => {
  return (
    <div className="bg-white border rounded-md w-full max-w-3xl mt-12">
      {/* Header */}
      <div className="bg-gray-100 px-6 py-4 border-b">
        <h2 className="text-lg font-medium text-gray-800">{title}</h2>
      </div>

      {/* Content */}
      <div className="p-6 text-center text-gray-600">
        {message}
      </div>
    </div>
  );
};

export default AccountSectionTemplate;
