import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { content } from '@/api/content';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await content.auth.login(password);
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-cream flex items-center justify-center px-4 sm:px-6 py-8">
      <div className="w-full max-w-md bg-white border border-gray-200 shadow-sm p-6 sm:p-8">
        <p className="text-[10px] tracking-[0.2em] uppercase text-rust mb-2">Admin</p>
        <h1 className="font-playfair text-navy text-2xl font-bold uppercase mb-6">
          Shakespeare on the Sound
        </h1>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
              Password
            </label>
            <input
              type="password"
              autoComplete="current-password"
              className="w-full border border-gray-200 px-3 py-3 text-base sm:text-sm text-navy focus:outline-none focus:border-navy min-h-[44px]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full min-h-[44px] bg-navy text-white text-xs tracking-[0.2em] uppercase font-medium py-3 hover:bg-navy/90 transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-500">
          <Link to="/" className="text-rust hover:underline">
            Back to site
          </Link>
        </p>
      </div>
    </div>
  );
}
