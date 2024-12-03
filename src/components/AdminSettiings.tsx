import React, { useState } from 'react';
import { useAdmin } from '../contexts/AdminContext';
import { useNavigate } from 'react-router-dom';
import Toast from './Toast';

export default function AdminSettings() {
  const { updateAdminCredentials, logout } = useAdmin();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!currentPassword) {
      setError('Current password is required');
      return;
    }

    try {
      // If no new email or password is provided, use empty strings
      const success = await updateAdminCredentials(
        email || '', // Only update if new email is provided
        currentPassword,
        newPassword || '' // Only update if new password is provided
      );

      if (success) {
        setToastMessage('Admin credentials updated successfully. Please login again.');
        setShowToast(true);
        
        // Clear form
        setEmail('');
        setCurrentPassword('');
        setNewPassword('');
        
        // Logout and redirect after a short delay
        setTimeout(() => {
          logout();
          navigate('/admin/login');
        }, 2000);
      } else {
        setError('Current password is incorrect');
      }
    } catch (err) {
      setError('An error occurred while updating credentials');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Admin Settings</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            New Email (optional)
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
            placeholder="Leave blank to keep current email"
          />
        </div>

        <div>
          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
            Current Password
          </label>
          <input
            type="password"
            id="currentPassword"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
            New Password (optional)
          </label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
            placeholder="Leave blank to keep current password"
          />
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
        >
          Update Credentials
        </button>
      </form>

      <Toast
        show={showToast}
        message={toastMessage}
        onClose={() => setShowToast(false)}
        duration={2000}
      />
    </div>
  );
}