// frontend/src/pages/ProfilePage.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import {
  getInitials,
  getRoleGradient,
  formatDate,
} from '../utils/helpers';
import {
  User, Mail, Phone,
  Lock, Save, Eye, EyeOff,
} from 'lucide-react';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();

  const [form, setForm] = useState({
    name:    user?.name    || '',
    phone:   user?.phone   || '',
    address: user?.address || '',
  });

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword:     '',
    confirmPassword: '',
  });

  const [showPass,       setShowPass]       = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPass,    setLoadingPass]    = useState(false);

  const gradient = getRoleGradient(user?.role);

  // Update profile info
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoadingProfile(true);
    try {
      const { data } = await api.put('/auth/update-profile', form);
      updateUser(data.user);
      toast.success('Profile updated! ✅');
    } catch (err) {
      toast.error(err.message || 'Update failed');
    } finally {
      setLoadingProfile(false);
    }
  };

  // Change password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }
    if (passwords.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoadingPass(true);
    try {
      await api.put('/auth/change-password', {
        currentPassword: passwords.currentPassword,
        newPassword:     passwords.newPassword,
      });
      toast.success('Password changed! 🔐');
      setPasswords({
        currentPassword: '',
        newPassword:     '',
        confirmPassword: '',
      });
    } catch (err) {
      toast.error(err.message || 'Failed to change password');
    } finally {
      setLoadingPass(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 max-w-2xl mx-auto"
    >
      {/* Header */}
      <div>
        <h1 className="page-title">My Profile 👤</h1>
        <p className="page-subtitle">
          Manage your account information and security.
        </p>
      </div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0  }}
        className="card overflow-hidden"
      >
        {/* Banner */}
        <div className={`h-24 bg-gradient-to-r ${gradient}`} />

        <div className="px-6 pb-6">
          <div className="flex items-end gap-4 -mt-10 mb-5">
            {/* Avatar */}
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br
                            ${gradient} flex items-center justify-center
                            border-4 border-white dark:border-gray-800
                            shadow-lg flex-shrink-0`}>
              {user?.profilePhoto?.url ? (
                <img
                  src={user.profilePhoto.url}
                  alt={user?.name}
                  className="w-full h-full rounded-2xl object-cover"
                />
              ) : (
                <span className="text-white text-2xl font-black">
                  {getInitials(user?.name)}
                </span>
              )}
            </div>

            {/* Name + Role */}
            <div className="pb-2 min-w-0">
              <h2 className="text-xl font-black text-gray-800
                             dark:text-gray-200 truncate">
                {user?.name}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className={`badge capitalize ${
                  user?.role === 'admin'
                    ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400'
                    : user?.role === 'teacher'
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                    : user?.role === 'student'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                }`}>
                  {user?.role}
                </span>
              </div>
            </div>
          </div>

          {/* Email (read only) */}
          <div className="p-3 bg-gray-50 dark:bg-gray-700/50
                          rounded-xl flex items-center gap-3">
            <Mail size={16} className="text-gray-400 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500">
                Email (cannot change)
              </p>
              <p className="text-sm font-semibold text-gray-800
                            dark:text-gray-200">
                {user?.email}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Edit Profile */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0  }}
        transition={{ delay: 0.1 }}
        className="card p-6"
      >
        <h3 className="section-title mb-5 flex items-center gap-2">
          <User size={18} className="text-primary-500" />
          Personal Information
        </h3>

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div>
            <label className="input-label">Full Name</label>
            <input
              className="input-field"
              value={form.name}
              onChange={e => setForm(p => ({
                ...p, name: e.target.value
              }))}
              placeholder="Your full name"
              required
            />
          </div>

          <div>
            <label className="input-label">Phone Number</label>
            <input
              className="input-field"
              value={form.phone}
              onChange={e => setForm(p => ({
                ...p, phone: e.target.value
              }))}
              placeholder="03001234567"
            />
          </div>

          <div>
            <label className="input-label">Address</label>
            <textarea
              className="input-field resize-none"
              rows={2}
              value={form.address}
              onChange={e => setForm(p => ({
                ...p, address: e.target.value
              }))}
              placeholder="Your home address"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loadingProfile}
              className="btn-primary"
            >
              {loadingProfile ? (
                <div className="w-4 h-4 border-2 border-white/30
                                border-t-white rounded-full animate-spin" />
              ) : (
                <> <Save size={16} /> Save Changes </>
              )}
            </button>
          </div>
        </form>
      </motion.div>

      {/* Change Password */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0  }}
        transition={{ delay: 0.2 }}
        className="card p-6"
      >
        <h3 className="section-title mb-5 flex items-center gap-2">
          <Lock size={18} className="text-primary-500" />
          Change Password
        </h3>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div className="relative">
            <label className="input-label">Current Password</label>
            <input
              type={showPass ? 'text' : 'password'}
              className="input-field pr-12"
              value={passwords.currentPassword}
              onChange={e => setPasswords(p => ({
                ...p, currentPassword: e.target.value
              }))}
              placeholder="Enter current password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPass(p => !p)}
              className="absolute right-3 top-9 text-gray-400
                         hover:text-gray-600"
            >
              {showPass
                ? <EyeOff size={16} />
                : <Eye size={16} />
              }
            </button>
          </div>

          <div>
            <label className="input-label">New Password</label>
            <input
              type="password"
              className="input-field"
              value={passwords.newPassword}
              onChange={e => setPasswords(p => ({
                ...p, newPassword: e.target.value
              }))}
              placeholder="Min 6 characters"
              required
            />
          </div>

          <div>
            <label className="input-label">Confirm New Password</label>
            <input
              type="password"
              className="input-field"
              value={passwords.confirmPassword}
              onChange={e => setPasswords(p => ({
                ...p, confirmPassword: e.target.value
              }))}
              placeholder="Repeat new password"
              required
            />
          </div>

          {/* Match indicator */}
          {passwords.newPassword && passwords.confirmPassword && (
            <p className={`text-xs font-semibold ${
              passwords.newPassword === passwords.confirmPassword
                ? 'text-emerald-500'
                : 'text-red-500'
            }`}>
              {passwords.newPassword === passwords.confirmPassword
                ? '✅ Passwords match'
                : '❌ Passwords do not match'
              }
            </p>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loadingPass}
              className="btn-primary"
            >
              {loadingPass ? (
                <div className="w-4 h-4 border-2 border-white/30
                                border-t-white rounded-full animate-spin" />
              ) : (
                <> <Lock size={16} /> Change Password </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ProfilePage;