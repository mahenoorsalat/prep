import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/ui/Logo';
import './Login.css';

export default function Login() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!userId.trim()) {
      setError('User ID is required');
      return;
    }
    if (!password.trim()) {
      setError('Password is required');
      return;
    }

    setLoading(true);
    try {
      await login(userId, password);
      navigate('/dashboard', { replace: true });
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Left panel - Figma Illustration */}
      <div className="login-page__illustration">
        <div className="login-page__illustration-content">
          <div className="login-page__robot">
            <div style={{ width: 467, height: 344, position: 'relative', transform: 'scale(0.85)', transformOrigin: 'center' }}>
              <div style={{ width: 63.77, height: 82.58, left: 227.91, top: 138.81, position: 'absolute', background: 'black' }} />
              <div style={{ width: 13.85, height: 4.56, left: 153.08, top: 138.81, position: 'absolute', background: 'black' }} />
              <div style={{ width: 62.10, height: 284.29, left: 166.38, top: 29.58, position: 'absolute', background: 'rgba(179, 253, 249, 0)' }} />
              <div style={{ width: 53.17, height: 61.50, left: 170.84, top: 126.27, position: 'absolute', background: 'var(--core-colors-student-primary-Brand-semi-white, #F7FBFF)' }} />
              <div style={{ width: 53.17, height: 78.76, left: 170.84, top: 235.11, position: 'absolute', background: 'var(--core-colors-student-primary-Brand-semi-white, #F7FBFF)' }} />
              <div style={{ width: 100.44, height: 29.58, left: 147.21, top: 313.86, position: 'absolute', background: 'var(--core-colors-student-primary-Brand-semi-light, #BFDBFE)' }} />
              <div style={{ width: 9.14, height: 9.14, left: 178.76, top: 104.68, position: 'absolute', background: 'black' }} />
              <div style={{ width: 9.14, height: 9.14, left: 206.94, top: 104.68, position: 'absolute', background: 'black' }} />
              <div style={{ width: 5.92, height: 3.45, left: 194.47, top: 116.86, position: 'absolute', background: 'black' }} />
              <div style={{ width: 100.43, height: 29.58, left: 147.21, top: 0, position: 'absolute', background: 'var(--core-colors-student-primary-Brand-semi-light, #BFDBFE)' }} />
              <div style={{ width: 41.97, height: 1.12, left: 188.52, top: 337.20, position: 'absolute', background: 'black' }} />
              <div style={{ width: 15.20, height: 1.12, left: 165.36, top: 337.20, position: 'absolute', background: 'black' }} />
              <div style={{ width: 34.71, height: 283.29, left: 189.85, top: 29.90, position: 'absolute', background: 'black' }} />
              <div style={{ width: 33.79, height: 283.29, left: 170.28, top: 29.90, position: 'absolute', background: 'black' }} />
              <div style={{ width: 5.41, height: 7.24, left: 193.39, top: 181.09, position: 'absolute', background: 'black' }} />
              <div style={{ width: 2.44, height: 3.04, left: 199.01, top: 176.18, position: 'absolute', background: 'black' }} />
              <div style={{ width: 45.54, height: 1.12, left: 176.18, top: 5.13, position: 'absolute', background: 'black' }} />
              <div style={{ width: 467, height: 14.97, left: 0, top: 189.32, position: 'absolute', background: 'var(--core-colors-semantic-text-color-low, #6B7180)' }} />
              <div style={{ width: 5.69, height: 14.81, left: 336.17, top: 189.44, position: 'absolute', background: 'var(--core-colors-semantic-text-color-medium, #374151)' }} />
              <div style={{ width: 1.12, height: 140.27, left: 345.03, top: 203.73, position: 'absolute', background: 'var(--core-colors-semantic-text-color-medium, #374151)' }} />
              <div style={{ width: 1.12, height: 140.27, left: 457.58, top: 203.73, position: 'absolute', background: 'var(--core-colors-semantic-text-color-medium, #374151)' }} />
              <div style={{ width: 1.12, height: 140.27, left: 120.86, top: 203.73, position: 'absolute', background: 'var(--core-colors-semantic-text-color-medium, #374151)' }} />
              <div style={{ width: 1.12, height: 140.27, left: 8.31, top: 203.73, position: 'absolute', background: 'var(--core-colors-semantic-text-color-medium, #374151)' }} />
              <div style={{ width: 194.66, height: 77.29, left: 29.35, top: 112.03, position: 'absolute', background: 'var(--core-colors-gray-gray-200, #E5E7EB)' }} />
              <div style={{ width: 2.63, height: 4.92, left: 175.16, top: 181.12, position: 'absolute', background: 'black' }} />
              <div style={{ width: 11.31, height: 11.31, left: 292.98, top: 102.21, position: 'absolute', background: 'black' }} />
              <div style={{ width: 1.12, height: 4.65, left: 396.39, top: 152.15, position: 'absolute', background: 'black' }} />
              <div style={{ width: 1.12, height: 4.65, left: 396.39, top: 144.95, position: 'absolute', background: 'black' }} />
              <div style={{ width: 4.65, height: 1.12, left: 391.02, top: 150.31, position: 'absolute', background: 'black' }} />
              <div style={{ width: 4.65, height: 1.12, left: 398.22, top: 150.31, position: 'absolute', background: 'black' }} />
              <div style={{ width: 1.12, height: 7.05, left: 85.64, top: 59.75, position: 'absolute', background: 'black' }} />
              <div style={{ width: 1.12, height: 7.05, left: 85.64, top: 47.67, position: 'absolute', background: 'black' }} />
              <div style={{ width: 7.05, height: 1.12, left: 76.64, top: 56.68, position: 'absolute', background: 'black' }} />
              <div style={{ width: 7.05, height: 1.12, left: 88.72, top: 56.68, position: 'absolute', background: 'black' }} />
              <div style={{ width: 49.80, height: 16.58, left: 227.91, top: 173.40, position: 'absolute', background: 'black' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Right panel - White Login Card */}
      <div className="login-page__form-wrapper">
        <div className="login-page__form-card">
          {/* Logo */}
          <div className="login-page__logo">
            <Logo size="sm" />
          </div>

          {/* Title & Subtitle */}
          <div>
            <h1 className="login-page__title">Login</h1>
            <p className="login-page__subtitle">Use your company provided Login credentials</p>
          </div>

          {/* Error Message */}
          {error && <div className="login-page__error">{error}</div>}

          {/* Form Fields */}
          <form onSubmit={handleSubmit} className="login-page__form">
            <div className="login-page__form-field">
              <label htmlFor="userId">User ID</label>
              <input
                id="userId"
                type="text"
                className="login-page__input"
                placeholder="Enter User ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                autoComplete="username"
              />
            </div>

            <div className="login-page__form-field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                className="login-page__input"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            <a href="#" onClick={(e) => e.preventDefault()} className="login-page__forgot">
              Forgot password?
            </a>

            <button type="submit" className="login-page__button" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
