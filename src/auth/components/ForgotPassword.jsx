import { useSearchParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

const SUPER_ADMIN = {
  name: 'Mr. Venkata Vishnu',
  title: 'System Administrator',
  email: 'venkatavishnu.skksv@gmail.com',
};

export default function ForgotPassword() {
  const [searchParams] = useSearchParams();
  const forAccount = searchParams.get('reason') === 'account';

  const heading = forAccount ? 'Need an Account?' : 'Forgot Password?';
  const subtext = forAccount
    ? 'Please contact the System Administrator to create your account.'
    : 'Please contact the System Administrator to reset your password.';

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="w-full max-w-md">
        <div className="glass-card p-8 animate-slideUp">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light transition-colors mb-4"
          >
            ← Back to Home
          </Link>
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">{forAccount ? '👤' : '🔑'}</div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{heading}</h1>
            <p className="text-gray-500 dark:text-gray-400">{subtext}</p>
          </div>

          <div className="p-5 rounded-xl bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-lg font-bold shrink-0">
                VV
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-gray-900 dark:text-white">{SUPER_ADMIN.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{SUPER_ADMIN.title}</p>
              </div>
            </div>
            <a
              href={`mailto:${SUPER_ADMIN.email}`}
              className="mt-4 block px-4 py-3 rounded-xl text-center font-medium bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 transition-all"
            >
              📧 Email {SUPER_ADMIN.name} for assistance
            </a>
            <p className="mt-3 text-center text-xs text-gray-500 dark:text-gray-400 break-words">
              {SUPER_ADMIN.email}
            </p>
          </div>

          <p className="mt-6 text-center">
            <Link to="/login" className="text-sm text-primary dark:text-primary-light hover:underline">
              ← Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}