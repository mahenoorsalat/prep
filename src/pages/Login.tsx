import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
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
      {/* Left illustration panel */}
      <div className="login-page__illustration">
        <div className="login-page__illustration-content">
          <svg className="login-page__robot" viewBox="0 0 300 280" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Desk */}
            <rect x="40" y="200" width="220" height="6" rx="3" fill="#C4C8D4" />
            <rect x="80" y="206" width="8" height="50" rx="2" fill="#B0B5C3" />
            <rect x="212" y="206" width="8" height="50" rx="2" fill="#B0B5C3" />
            {/* Laptop */}
            <rect x="95" y="165" width="100" height="35" rx="4" fill="#A0A8BA" />
            <rect x="100" y="170" width="90" height="25" rx="2" fill="#D6DAE4" />
            <rect x="85" y="200" width="120" height="4" rx="2" fill="#8890A0" />
            {/* Robot body */}
            <rect x="120" y="85" width="60" height="80" rx="12" fill="#E8ECF4" stroke="#C4C8D4" strokeWidth="2" />
            {/* Robot head */}
            <rect x="125" y="40" width="50" height="50" rx="10" fill="#E8ECF4" stroke="#C4C8D4" strokeWidth="2" />
            {/* Antenna */}
            <line x1="150" y1="25" x2="150" y2="40" stroke="#C4C8D4" strokeWidth="2" />
            <circle cx="150" cy="22" r="4" fill="#2563EB" />
            {/* Eyes */}
            <circle cx="140" cy="58" r="4" fill="#2563EB" />
            <circle cx="160" cy="58" r="4" fill="#2563EB" />
            {/* Mouth */}
            <rect x="140" y="70" width="20" height="3" rx="1.5" fill="#C4C8D4" />
            {/* Arms */}
            <line x1="120" y1="110" x2="95" y2="140" stroke="#C4C8D4" strokeWidth="3" strokeLinecap="round" />
            <line x1="180" y1="110" x2="205" y2="140" stroke="#C4C8D4" strokeWidth="3" strokeLinecap="round" />
            {/* Hand dots */}
            <circle cx="93" cy="142" r="4" fill="#E8ECF4" stroke="#C4C8D4" strokeWidth="1.5" />
            <circle cx="207" cy="142" r="4" fill="#E8ECF4" stroke="#C4C8D4" strokeWidth="1.5" />
            {/* Floating elements */}
            <text x="72" y="100" fill="#C4C8D4" fontSize="16" fontFamily="monospace">+</text>
            <text x="215" y="85" fill="#C4C8D4" fontSize="12" fontFamily="monospace">○</text>
            <text x="230" y="130" fill="#C4C8D4" fontSize="16" fontFamily="monospace">+</text>
          </svg>
        </div>
      </div>

      {/* Right form panel */}
      <div className="login-page__form-wrapper">
        <div className="login-page__form-card animate-slideUp">
          <div className="login-page__logo">
            <span className="login-page__logo-p">P</span>
            <span className="login-page__logo-text">rep</span>
            <span className="login-page__logo-route">route</span>
          </div>

          <h1 className="login-page__title">Login</h1>
          <p className="login-page__subtitle">Use your company provided Login credentials</p>

          <form onSubmit={handleSubmit} className="login-page__form">
            {error && (
              <div className="login-page__error animate-fadeIn">
                {error}
              </div>
            )}

            <Input
              label="User ID"
              placeholder="Enter User ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              autoComplete="username"
              id="login-userid"
            />

            <Input
              label="Password"
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              id="login-password"
            />

            <a href="#" className="login-page__forgot" onClick={(e) => e.preventDefault()}>
              Forgot password?
            </a>

            <Button
              type="submit"
              fullWidth
              size="lg"
              loading={loading}
              id="login-submit"
            >
              Login
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
