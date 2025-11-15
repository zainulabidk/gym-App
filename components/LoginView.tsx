import React, { useState } from 'react';
import { EmailIcon, LockIcon, EyeIcon, EyeSlashIcon } from './Icons';

interface LoginViewProps {
  onLogin: () => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() === '' || password.trim() === '') {
      setError('Please enter both email and password.');
      return;
    }
    setError('');
    onLogin();
  };

  const inputBaseClasses = "block w-full px-4 py-3 text-gray-800 bg-neutral border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary placeholder-gray-500";

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral p-4">
      <div className="w-full max-w-sm p-8 space-y-6 bg-base-100 rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-secondary tracking-wider">GYM ADMIN</h1>
          <p className="mt-2 text-gray-500">Welcome back! Please sign in.</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email-address" className="sr-only">Email address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                <EmailIcon />
              </div>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={`${inputBaseClasses} pl-10`}
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <div className="relative">
               <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                <LockIcon />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                className={`${inputBaseClasses} pl-10 pr-10`}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>
          
          {error && (
              <p className="text-sm text-red-600 text-center">{error}</p>
          )}

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-primary hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200"
            >
              Sign in
            </button>
          </div>
        </form>

        <div className="text-center">
          <p className="text-xs text-gray-400">
            For demo purposes, any email/password will work.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
