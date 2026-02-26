import React, { useState } from 'react';
import { signup, login } from '../services/api';
import { useAuth } from '../context/AuthContext';

// Eye open icon
const EyeOpen = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

// Eye closed icon
const EyeClosed = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

export default function AuthPage() {
  const { loginUser } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [form, setForm] = useState({
    name: '', email: '', password: '', confirm: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors(prev => ({ ...prev, [e.target.name]: '' }));
    setGlobalError('');
  };

  const validate = () => {
    const errs = {};
    if (mode === 'signup' && !form.name.trim())
      errs.name = 'Name is required';
    if (!form.email.trim())
      errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email))
      errs.email = 'Enter a valid email';
    if (!form.password)
      errs.password = 'Password is required';
    else if (form.password.length < 6)
      errs.password = 'Minimum 6 characters';
    if (mode === 'signup' && form.password !== form.confirm)
      errs.confirm = 'Passwords do not match';
    return errs;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    setGlobalError('');
    try {
      let res;
      if (mode === 'signup') {
        res = await signup(form.name, form.email, form.password);
      } else {
        res = await login(form.email, form.password);
      }
      loginUser(res.data.token, res.data.user);
    } catch (err) {
      setGlobalError(err.response?.data?.error || 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode(m => m === 'login' ? 'signup' : 'login');
    setForm({ name: '', email: '', password: '', confirm: '' });
    setErrors({});
    setGlobalError('');
    setShowPassword(false);
    setShowConfirm(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <div className="auth-page">

      {/* Left branding panel — tablet+ only */}
      <div className="auth-brand">
        <div className="auth-brand__logo">
          CipherSQL<span>Studio</span>
        </div>
        <div className="auth-brand__tagline">practice. query. master.</div>
        <div className="auth-brand__features">
          <div className="auth-brand__feature">
            <div className="auth-brand__feature-icon">⚡</div>
            <div className="auth-brand__feature-text">
              <h4>Real-time Execution</h4>
              <p>Run SQL queries instantly against live sandboxed databases</p>
            </div>
          </div>
          <div className="auth-brand__feature">
            <div className="auth-brand__feature-icon">💡</div>
            <div className="auth-brand__feature-text">
              <h4>AI-Powered Hints</h4>
              <p>Get intelligent hints that guide you without giving away the answer</p>
            </div>
          </div>
          <div className="auth-brand__feature">
            <div className="auth-brand__feature-icon">📊</div>
            <div className="auth-brand__feature-text">
              <h4>Track Progress</h4>
              <p>Save your attempts and pick up right where you left off</p>
            </div>
          </div>
          <div className="auth-brand__feature">
            <div className="auth-brand__feature-icon">🎯</div>
            <div className="auth-brand__feature-text">
              <h4>Structured Challenges</h4>
              <p>Easy to hard assignments designed to build real SQL skills</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="auth-form-panel">

        {/* Mobile logo */}
        <div className="auth-mobile-logo">
          <div className="auth-mobile-logo__title">
            CipherSQL<span>Studio</span>
          </div>
          <div className="auth-mobile-logo__sub">practice. query. master.</div>
        </div>

        <div className="auth-form">
          <h2 className="auth-form__title">
            {mode === 'login' ? 'Welcome back' : 'Create account'}
          </h2>
          <p className="auth-form__subtitle">
            {mode === 'login'
              ? 'Sign in to continue your SQL journey'
              : 'Start practicing SQL with real databases'}
          </p>

          {/* Global error */}
          {globalError && (
            <div className="auth-form__global-error">
              ⚠ {globalError}
            </div>
          )}

          {/* Name field — signup only */}
          {mode === 'signup' && (
            <div className="auth-form__group">
              <label className="auth-form__label">Full Name</label>
              <div className="auth-form__input-wrap">
                <input
                  className={`auth-form__input${errors.name ? ' auth-form__input--error' : ''}`}
                  type="text"
                  name="name"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  autoComplete="name"
                />
              </div>
              {errors.name && <div className="auth-form__error">⚠ {errors.name}</div>}
            </div>
          )}

          {/* Email */}
          <div className="auth-form__group">
            <label className="auth-form__label">Email</label>
            <div className="auth-form__input-wrap">
              <input
                className={`auth-form__input${errors.email ? ' auth-form__input--error' : ''}`}
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                autoComplete="email"
              />
            </div>
            {errors.email && <div className="auth-form__error">⚠ {errors.email}</div>}
          </div>

          {/* Password */}
          <div className="auth-form__group">
            <label className="auth-form__label">Password</label>
            <div className="auth-form__input-wrap">
              <input
                className={`auth-form__input auth-form__input--password${errors.password ? ' auth-form__input--error' : ''}`}
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              />
              <button
                type="button"
                className="auth-form__eye"
                onClick={() => setShowPassword(p => !p)}
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOpen /> : <EyeClosed />}
              </button>
            </div>
            {errors.password && <div className="auth-form__error">⚠ {errors.password}</div>}
          </div>

          {/* Confirm password — signup only */}
          {mode === 'signup' && (
            <div className="auth-form__group">
              <label className="auth-form__label">Confirm Password</label>
              <div className="auth-form__input-wrap">
                <input
                  className={`auth-form__input auth-form__input--password${errors.confirm ? ' auth-form__input--error' : ''}`}
                  type={showConfirm ? 'text' : 'password'}
                  name="confirm"
                  placeholder="Repeat your password"
                  value={form.confirm}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="auth-form__eye"
                  onClick={() => setShowConfirm(p => !p)}
                  tabIndex={-1}
                  aria-label={showConfirm ? 'Hide password' : 'Show password'}
                >
                  {showConfirm ? <EyeOpen /> : <EyeClosed />}
                </button>
              </div>
              {errors.confirm && <div className="auth-form__error">⚠ {errors.confirm}</div>}
            </div>
          )}

          {/* Submit */}
          <button
            className="auth-form__submit"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading
              ? <><span className="auth-spinner" />{mode === 'login' ? 'Signing in...' : 'Creating account...'}</>
              : mode === 'login' ? 'Sign In' : 'Create Account'
            }
          </button>

          {/* Switch mode */}
          <div className="auth-form__switch">
            {mode === 'login'
              ? <>Don't have an account? <button onClick={switchMode}>Sign up</button></>
              : <>Already have an account? <button onClick={switchMode}>Sign in</button></>
            }
          </div>
        </div>
      </div>
    </div>
  );
}