import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/authService';
import { userService } from '../services/userService';
import { uploadAvatar } from '../../services/cloudinaryService';
import ConfirmModal from '../../components/ConfirmModal';
import ChangePassword from './ChangePassword';

export default function ProfileScreen() {
  const { user, userProfile, logout, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verifySent, setVerifySent] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  const handleSendVerification = async () => {
    setVerifying(true);
    try {
      await authService.sendEmailVerification();
      setVerifySent(true);
    } catch (err) {
      console.error('Failed to send verification:', err);
    } finally {
      setVerifying(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    setPreviewUrl(URL.createObjectURL(file));
    uploadFile(file);
  };

  const uploadFile = async (file) => {
    setUploading(true);
    setUploadProgress(0);
    try {
      const { url } = await uploadAvatar(file, setUploadProgress);
      await userService.updateUser(user.uid, { profileImage: url });
      if (refreshProfile) await refreshProfile();
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleRemovePhoto = async () => {
    setShowRemoveConfirm(false);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setDeleting(true);
    try {
      await userService.updateUser(user.uid, { profileImage: '' });
      if (refreshProfile) await refreshProfile();
    } catch (err) {
      console.error('Failed to remove photo:', err);
    } finally {
      setDeleting(false);
    }
  };

  const avatarUrl = previewUrl || userProfile?.profileImage;

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all mb-4"
      >
        ← Back
      </button>
      <div className="glass-card p-6 sm:p-8 animate-slideUp">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative shrink-0">
            <div className={`w-16 h-16 rounded-full overflow-hidden ${!avatarUrl ? 'bg-gradient-to-br from-primary to-secondary flex items-center justify-center' : ''}`}>
              {avatarUrl ? (
                <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-white text-2xl font-bold">
                  {(userProfile?.displayName || user.email || 'U')[0].toUpperCase()}
                </span>
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary text-white text-xs flex items-center justify-center border-2 border-white dark:border-slate-900 hover:bg-primary/80 transition-all disabled:opacity-50"
              title="Upload photo"
            >
              📷
            </button>
            {avatarUrl && (
              <button
                onClick={() => setShowRemoveConfirm(true)}
                disabled={uploading || deleting}
                className="absolute -bottom-1 -left-1 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center border-2 border-white dark:border-slate-900 hover:bg-red-400 transition-all disabled:opacity-50"
                title="Remove photo"
                aria-label="Remove photo"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14z" />
                  <line x1="10" y1="11" x2="10" y2="17" />
                  <line x1="14" y1="11" x2="14" y2="17" />
                </svg>
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white truncate">
              {userProfile?.displayName || 'User'}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
          </div>
        </div>

        {(uploading || deleting) && (
          <div className="mb-4 p-3 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20">
            <div className="flex items-center justify-between text-sm text-blue-600 dark:text-blue-400 mb-2">
              <span>{deleting ? 'Deleting photo...' : 'Uploading...'}</span>
              {!deleting && <span>{uploadProgress}%</span>}
            </div>
            {deleting ? (
              <div className="flex justify-center py-1">
                <div className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
              </div>
            ) : (
              <div className="w-full h-2 bg-blue-200 dark:bg-blue-500/20 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-black/5 dark:bg-white/5">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Role</p>
            <p className="text-gray-900 dark:text-white font-medium capitalize">
              {userProfile?.role || '—'}
              {userProfile?.roleSubtype && <span className="text-gray-400"> ({userProfile.roleSubtype})</span>}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-black/5 dark:bg-white/5">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Status</p>
            <p className="text-gray-900 dark:text-white font-medium capitalize">{userProfile?.status || 'Active'}</p>
          </div>
          <div className="p-4 rounded-xl bg-black/5 dark:bg-white/5">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Phone</p>
            <p className="text-gray-900 dark:text-white font-medium">{userProfile?.phone || '—'}</p>
          </div>
          <div className="p-4 rounded-xl bg-black/5 dark:bg-white/5">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Email Verified</p>
            {user.emailVerified ? (
              <p className="text-gray-900 dark:text-white font-medium">✅ Yes</p>
            ) : (
              <div className="flex items-center gap-2">
                <p className="text-gray-900 dark:text-white font-medium">❌ No</p>
                {verifySent ? (
                  <span className="text-xs text-green-600 dark:text-green-400">Verification email sent!</span>
                ) : (
                  <button
                    onClick={handleSendVerification}
                    disabled={verifying}
                    className="text-xs px-2 py-1 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-all disabled:opacity-50"
                  >
                    {verifying ? 'Sending...' : 'Send Verification'}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {showChangePassword ? (
          <div className="mb-4">
            <ChangePassword
              onCancel={() => setShowChangePassword(false)}
              onSuccess={() => setShowChangePassword(false)}
            />
          </div>
        ) : (
          <button
            onClick={() => setShowChangePassword(true)}
            className="w-full px-4 py-3 rounded-xl text-sm font-medium border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all mb-3"
          >
            🔑 Change Password
          </button>
        )}

        <button
          onClick={() => navigate('/dashboard')}
          className="w-full px-4 py-3 rounded-xl text-sm font-medium border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all mb-2"
        >
          📊 Go to Dashboard
        </button>
        <button
          onClick={handleLogout}
          className="w-full px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 border border-red-200 dark:border-red-500/20 transition-all"
        >
          🚪 Sign Out
        </button>
      </div>

      <ConfirmModal
        isOpen={showRemoveConfirm}
        onClose={() => setShowRemoveConfirm(false)}
        onConfirm={handleRemovePhoto}
        title="Remove profile photo?"
        description="Your photo will be removed from your profile and the staff directory."
        confirmText="Remove"
        confirmLoadingText="Removing..."
        isLoading={deleting}
        variant="danger"
      />
    </div>
  );
}
