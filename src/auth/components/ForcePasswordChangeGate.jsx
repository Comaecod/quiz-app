import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/userService';
import ChangePassword from './ChangePassword';

export default function ForcePasswordChangeGate() {
  const { userProfile, refreshProfile } = useAuth();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const forceRequired = userProfile?.forcePasswordChange === true;

  if (!forceRequired) return null;

  const handleSuccess = async () => {
    setSaving(true);
    setError('');
    try {
      await userService.updateUser(userProfile.id, { forcePasswordChange: false });
      await refreshProfile();
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#1e1e38] border border-gray-200 dark:border-white/10 rounded-2xl w-full max-w-md p-6 animate-slideUp">
        <div className="text-center mb-5">
          <div className="text-4xl mb-2">🔒</div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Welcome, {userProfile.displayName}!</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">You're using a temporary password. Please set a new password to continue.</p>
        </div>
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20">
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}
        {saving ? (
          <div className="flex items-center justify-center py-6">
            <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : (
          <ChangePassword onSuccess={handleSuccess} />
        )}
      </div>
    </div>
  );
}