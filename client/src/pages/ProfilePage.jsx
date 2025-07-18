import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, GraduationCap, BookOpen, Calendar, School } from 'lucide-react';

const ProfilePage = () => {
  const { user } = useAuth();
  const [showEditProfileForm, setShowEditProfileForm] = useState(false);
  const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
          <p className="text-gray-400">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  const handleEditProfileClose = () => setShowEditProfileForm(false);
  const handleEditProfileUpdate = (updatedUser) => {
    // Assuming onUpdate is passed as a prop or handled by context/state
    // For now, we'll just update the user in the context
    // In a real app, you'd update the user state in AuthContext
  };

  const handleChangePasswordClose = () => setShowChangePasswordForm(false);

  return (
    <div className="min-h-screen bg-black py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">My Profile</h1>
          <p className="text-gray-400">Manage your account information</p>
        </div>

        {/* Profile Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 mb-8">
          <div className="flex items-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-red-600 rounded-full flex items-center justify-center mr-6">
              <User size={40} className="text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">{user.name}</h2>
              <p className="text-gray-400">{user.email}</p>
            </div>
          </div>

          {/* Profile Information */}
          <div className="mb-8 grid md:grid-cols-2 gap-6">
                {/* Contact Information */}
                <div>
                  <div className="flex items-center mb-4">
                    <User className="text-purple-400 mr-3" size={24} />
                    <h3 className="text-xl font-semibold text-white">Contact Information</h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Email Address
                      </label>
                      <p className="text-white">{user.email}</p>
                    </div>
                  </div>
                </div>
                {/* Personal Details */}
                <div>
                  <div className="flex items-center mb-4">
                    <User className="text-purple-400 mr-3" size={24} />
                    <h3 className="text-xl font-semibold text-white">Personal Details</h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Full Name
                      </label>
                      <p className="text-white">{user.name}</p>
                    </div>
                  </div>
                </div>
                {/* Academic Information */}
                <div className="md:col-span-2">
                  <div className="flex items-center mb-4">
                    <GraduationCap className="text-purple-400 mr-3" size={24} />
                    <h3 className="text-xl font-semibold text-white">Academic Information</h3>
                  </div>
                  <div className="space-y-3 md:flex md:space-y-0 md:space-x-8">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        College
                      </label>
                      <p className="text-white">{user.college}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Stream
                      </label>
                      <p className="text-white">{user.stream}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Branch
                      </label>
                      <p className="text-white">{user.branch}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Current Year
                      </label>
                      <p className="text-white">{user.year}</p>
                    </div>
                  </div>
                </div>
              </div>
        </div>

        {/* Quick Stats */}
        {/* Removed quick stats: Papers Downloaded, Days Active, Subjects Studied */}

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <button
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            onClick={() => setShowEditProfileForm(true)}
          >
            Edit Profile
          </button>
          <button
            className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
            onClick={() => setShowChangePasswordForm(true)}
          >
            Change Password
          </button>
        </div>

        {showEditProfileForm && (
          <EditProfileForm user={user} onClose={handleEditProfileClose} onUpdate={handleEditProfileUpdate} />
        )}

        {showChangePasswordForm && (
          <ChangePasswordForm onClose={handleChangePasswordClose} />
        )}
      </div>
    </div>
  );
};

const EditProfileForm = ({ user, onClose, onUpdate }) => {
  const [form, setForm] = useState({
    name: user.name,
    college: user.college,
    stream: user.stream,
    branch: user.branch,
    year: user.year
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const API_URL = import.meta.env.VITE_API_URL;
    const res = await fetch(`${API_URL}/api/users/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    if (res.ok) {
      setMessage('Profile updated!');
      onUpdate(data.user);
      onClose();
    } else {
      setMessage(data.message || 'Error updating profile');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-gray-900 p-6 rounded-lg">
      <input name="name" value={form.name} onChange={handleChange} className="w-full p-2 rounded" />
      <input name="college" value={form.college} onChange={handleChange} className="w-full p-2 rounded" />
      <input name="stream" value={form.stream} onChange={handleChange} className="w-full p-2 rounded" />
      <input name="branch" value={form.branch} onChange={handleChange} className="w-full p-2 rounded" />
      <input name="year" value={form.year} onChange={handleChange} className="w-full p-2 rounded" />
      <button type="submit" className="w-full bg-purple-600 text-white py-2 rounded">Save</button>
      {message && <div className="text-green-400">{message}</div>}
    </form>
  );
};

const ChangePasswordForm = ({ onClose }) => {
  const [form, setForm] = useState({ oldPassword: '', newPassword: '', confirm: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirm) {
      setMessage('Passwords do not match');
      return;
    }
    const API_URL = import.meta.env.VITE_API_URL;
    const res = await fetch(`${API_URL}/api/users/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ oldPassword: form.oldPassword, newPassword: form.newPassword })
    });
    const data = await res.json();
    if (res.ok) {
      setMessage('Password updated!');
      onClose();
    } else {
      setMessage(data.message || 'Error updating password');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-gray-900 p-6 rounded-lg">
      <input name="oldPassword" type="password" placeholder="Old Password" onChange={handleChange} className="w-full p-2 rounded" />
      <input name="newPassword" type="password" placeholder="New Password" onChange={handleChange} className="w-full p-2 rounded" />
      <input name="confirm" type="password" placeholder="Confirm New Password" onChange={handleChange} className="w-full p-2 rounded" />
      <button type="submit" className="w-full bg-purple-600 text-white py-2 rounded">Change Password</button>
      {message && <div className="text-green-400">{message}</div>}
    </form>
  );
};

export default ProfilePage;