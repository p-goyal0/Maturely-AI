import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Eye, EyeOff, Lock, Mail, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Standalone Create Password screen.
 * URL: /create-password?email=user@example.com
 * Email comes from URL params, prefilled and read-only. User enters new password and confirm.
 */
export function CreatePasswordPage() {
  const [searchParams] = useSearchParams();
  const emailFromParams = searchParams.get('email') || '';

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
      // TODO: Replace with actual create/reset password API call
      await new Promise((r) => setTimeout(r, 800));
      setSuccess(true);
      setNewPassword('');
      setConfirmPassword('');
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
          <div className="w-16 h-16 rounded-full bg-[#15ae99]/20 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-[#15ae99]" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 mb-2">Password updated</h1>
          <p className="text-slate-600">Your password has been set successfully.</p>
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
            <div className="w-12 h-12 rounded-xl bg-[#15ae99]/10 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-6 h-6 text-[#15ae99]" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Create password</h1>
            <p className="text-slate-600">Choose a new password for your account.</p>
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
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 z-10" />
                <Input
                  type="email"
                  placeholder="Email (from link)"
                  value={email}
                  readOnly
                  className="pl-10 h-11 bg-slate-100 border border-slate-200 text-slate-600 rounded-lg cursor-not-allowed focus:outline-none focus:ring-0"
                  required
                />
              </div>
            </div>

            {/* New password */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">New password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 z-10" />
                <Input
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="New password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pl-10 pr-10 h-11 bg-gray-50 border border-gray-300 text-slate-900 placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#15ae99]/30 focus:border-[#15ae99]"
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
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Confirm new password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 z-10" />
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 pr-10 h-11 bg-gray-50 border border-gray-300 text-slate-900 placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#15ae99]/30 focus:border-[#15ae99]"
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
              className="w-full h-11 rounded-lg text-white font-semibold bg-[#15ae99] hover:bg-[#129a85] transition-colors"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Submitting...
                </span>
              ) : (
                'Submit'
              )}
            </Button>
          </form>
        </div>
      </motion.div>
      </div>
    </div>
  );
}
