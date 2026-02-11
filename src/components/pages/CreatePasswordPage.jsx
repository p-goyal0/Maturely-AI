import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Eye, EyeOff, Lock, Mail, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { createPassword } from '../../services/authService';

/**
 * Standalone Create Password screen.
 * URL: https://app.maturely.ai/create-password?token=JWT&email=user@example.com&full_name=John%20Doe
 * Params: token (required), email (required), full_name (optional, for display).
 * Calls POST /api/v1/auth/create-password with password & confirm_password.
 */
export function CreatePasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tokenFromParams = searchParams.get('token') || '';
  const emailFromParams = searchParams.get('email') || '';
  const fullNameFromParams = searchParams.get('full_name') || '';

  const [email, setEmail] = useState('');
  useEffect(() => {
    setEmail(emailFromParams);
  }, [emailFromParams]);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!tokenFromParams || !tokenFromParams.trim()) {
      setError('Invalid link: token is missing. Please use the link from your invitation email.');
      return;
    }
    if (!email || !email.trim()) {
      setError('Invalid link: email is missing. Please use the link from your invitation email.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New password and confirm password do not match.');
      return;
    }
    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await createPassword(newPassword, confirmPassword, tokenFromParams);

      if (result.success && result.data) {
        setSuccess(true);
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => navigate('/signin', { replace: true }), 1500);
      } else {
        setError(result.error || 'Failed to create password. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <header className="absolute top-0 left-0 right-0 p-8 flex items-center gap-3">
          <img src="/logo/wings.png" alt="" className="h-6 w-auto object-contain" />
          <img src="/logo/maturely_logo.png" alt="Maturely" className="h-6 w-auto object-contain" />
        </header>
        <div className="flex-1 flex items-center justify-center px-4">
          <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-16 h-16 rounded-xl bg-[#66C8C3]/20 flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Lock className="w-8 h-8 text-[#66C8C3]" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 mb-2">Password updated</h1>
          <p className="text-slate-600">
            {fullNameFromParams ? `${fullNameFromParams}, your password has been set successfully.` : 'Your password has been set successfully.'}
          </p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="absolute top-0 left-0 right-0 p-4 flex items-center gap-3">
        <img src="/logo/wings.png" alt="" className="h-8 w-auto object-contain" />
        <img src="/logo/maturely_logo.png" alt="Maturely" className="h-8 w-auto object-contain" />
      </header>
      <div className="flex-1 flex items-center justify-center px-4 py-12 pt-20">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/60 p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-xl bg-[#66C8C3]/20 flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Lock className="w-7 h-7 text-[#66C8C3]" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Create password</h1>
            <p className="text-slate-600">
              {fullNameFromParams ? (
                <>
                  <span className="font-bold text-slate-800">{fullNameFromParams}</span>, choose a new password for your account.
                </>
              ) : (
                'Choose a new password for your account.'
              )}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Email – from URL params, read-only */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 z-10" />
                <Input
                  type="email"
                  placeholder=""
                  value={email}
                  disabled
                  className="pl-10 h-12 bg-slate-200 border border-slate-200 text-slate-500 rounded-xl cursor-not-allowed focus:outline-none focus:ring-0"
                  required
                />
              </div>
            </div>

            {/* New password */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">New password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 z-10" />
                <Input
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pl-10 pr-10 h-12 bg-white border border-slate-200 text-slate-900 placeholder-slate-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#66C8C3]/30 focus:border-[#66C8C3]"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-10 text-slate-400 hover:text-slate-600"
                >
                  {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm new password */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Confirm new password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 z-10" />
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 pr-10 h-12 bg-white border border-slate-200 text-slate-900 placeholder-slate-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#66C8C3]/30 focus:border-[#66C8C3]"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-10 text-slate-400 hover:text-slate-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-xl text-white font-semibold bg-[#66C8C3] hover:bg-[#5ab8b3] transition-colors mt-6"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Submitting...
                </span>
              ) : (
                'Create password'
              )}
            </Button>
          </form>
        </div>
      </motion.div>
      </div>
    </div>
  );
}
