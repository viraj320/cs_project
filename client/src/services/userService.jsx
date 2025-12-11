import API from './api';

//  Get user profile
export const getUserProfile = async (token) => {
  try {
    const response = await API.get('/user/profile', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error fetching profile' };
  }
};

//  Update user profile
export const updateUserProfile = async (userData, token) => {
  try {
    const response = await API.put('/auth/user/profile', userData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error updating profile' };
  }
};
