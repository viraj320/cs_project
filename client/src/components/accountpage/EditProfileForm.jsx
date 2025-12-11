import React, { useState, useEffect } from 'react';
import API from "../../services/api"; // Your API service

const EditProfileForm = ({ user }) => {
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setName(user?.name || '');
    setEmail(user?.email || '');
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');

    const updatedData = { name, email };

    try {
      // Send updated data to backend
      const response = await API.put('/auth/user/profile', updatedData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      console.log('Profile updated successfully:', response.data);
      setIsEditing(false); // Exit edit mode
    } catch (err) {
      console.error('Error updating profile:', err.response?.data?.message || err.message);
      setError('Error updating profile, please try again.');
    }
  };

  return (
    <div className="bg-white mt-12 p-6 rounded shadow space-y-6">
      <h2 className="text-lg font-medium bg-gray-100 p-3 rounded-t">My Profile</h2>

      {!isEditing ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name:</label>
            <p className="w-full border px-4 py-2 rounded">{name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email:</label>
            <p className="w-full border px-4 py-2 rounded">{email}</p>
          </div>

          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Edit
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border px-4 py-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border px-4 py-2 rounded"
              required
            />
          </div>

          {error && <p className="text-red-500">{error}</p>}
          <button
            type="submit"
            className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
          >
            SAVE CHANGES
          </button>
        </form>
      )}
    </div>
  );
};

export default EditProfileForm;
