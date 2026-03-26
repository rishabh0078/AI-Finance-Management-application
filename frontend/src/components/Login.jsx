import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, TrendingUp, PieChart, Wallet, ArrowUpRight, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });

  const { login, register, loading, error, clearError } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) {
      clearError();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLogin && formData.password !== formData.confirmPassword) {
      return;
    }
    try {
      if (isLogin) {
        await login({
          email: formData.email,
          password: formData.password
        });
      } else {
        await register({
          name: formData.name,
          email: formData.email,
          password: formData.password
        });
      }
    } catch (error) {
      console.error('Auth error:', error);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      email: '',
      password: '',
      name: '',
      confirmPassword: ''
    });
    clearError();
  };

  return (
    <div className="login-page">
      {/* ===== Left Branded Panel ===== */}
      <div className="login-brand-panel">
        {/* Animated background orbs */}
        <div className="login-orb login-orb-1" />
        <div className="login-orb login-orb-2" />
        <div className="login-orb login-orb-3" />

        {/* Grid pattern overlay */}
        <div className="login-grid-overlay" />

        <div className="login-brand-content">
          {/* Logo */}
          <div className="login-logo">
            <div className="login-logo-icon">
              <Wallet size={28} strokeWidth={2} />
            </div>
            <span className="login-logo-text">FinanceTracker</span>
          </div>

          {/* Hero Text */}
          <div className="login-hero-text">
            <h1>Take control of<br />your <span className="login-hero-highlight">finances</span></h1>
            <p className="login-hero-sub">
              Track expenses, set budgets, and gain insights into your spending
              habits with AI-powered analytics.
            </p>
          </div>

          {/* Floating Feature Cards */}
          <div className="login-feature-cards">
            <div className="login-feature-card">
              <div className="login-feature-icon login-feature-icon-emerald">
                <TrendingUp size={18} />
              </div>
              <div>
                <div className="login-feature-title">Smart Analytics</div>
                <div className="login-feature-desc">AI-powered spending insights</div>
              </div>
            </div>

            <div className="login-feature-card">
              <div className="login-feature-icon login-feature-icon-violet">
                <PieChart size={18} />
              </div>
              <div>
                <div className="login-feature-title">Budget Tracking</div>
                <div className="login-feature-desc">Stay on top of your goals</div>
              </div>
            </div>

            <div className="login-feature-card">
              <div className="login-feature-icon login-feature-icon-amber">
                <Shield size={18} />
              </div>
              <div>
                <div className="login-feature-title">Bank-grade Security</div>
                <div className="login-feature-desc">Your data is always safe</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom attribution */}
        <div className="login-brand-footer">
          <p>© 2026 FinanceTracker. Built with ❤️</p>
        </div>
      </div>

      {/* ===== Right Form Panel ===== */}
      <div className="login-form-panel">
        <div className="login-form-container">
          {/* Mobile logo (hidden on desktop) */}
          <div className="login-mobile-logo">
            <div className="login-logo-icon">
              <Wallet size={24} strokeWidth={2} />
            </div>
            <span className="login-logo-text" style={{ fontSize: '1.25rem' }}>FinanceTracker</span>
          </div>

          <div className="login-form-header">
            <h2>{isLogin ? 'Welcome back' : 'Create account'}</h2>
            <p>{isLogin ? 'Enter your credentials to access your account' : 'Get started with your free account today'}</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {/* Error Message */}
            {error && (
              <div className="login-error">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {/* Name Field (Register only) */}
            {!isLogin && (
              <div className="login-field" style={{ animationDelay: '0.05s' }}>
                <label htmlFor="name">Full Name</label>
                <div className="login-input-wrap">
                  <User size={18} className="login-input-icon" />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    required={!isLogin}
                    autoComplete="name"
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div className="login-field">
              <label htmlFor="email">Email address</label>
              <div className="login-input-wrap">
                <Mail size={18} className="login-input-icon" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="login-field">
              <div className="login-label-row">
                <label htmlFor="password">Password</label>
                {isLogin && (
                  <button type="button" className="login-forgot-btn" tabIndex={-1}>
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="login-input-wrap">
                <Lock size={18} className="login-input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  required
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="login-eye-btn"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field (Register only) */}
            {!isLogin && (
              <div className="login-field" style={{ animationDelay: '0.15s' }}>
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className={`login-input-wrap ${formData.confirmPassword && formData.password !== formData.confirmPassword ? 'login-input-error' : ''}`}>
                  <Lock size={18} className="login-input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    required={!isLogin}
                    autoComplete="new-password"
                  />
                </div>
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <span className="login-field-error">Passwords do not match</span>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || (!isLogin && formData.password !== formData.confirmPassword)}
              className="login-submit-btn"
            >
              {loading ? (
                <div className="login-spinner" />
              ) : (
                <>
                  {isLogin ? 'Sign in' : 'Create account'}
                  <ArrowUpRight size={18} style={{ marginLeft: '8px' }} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="login-divider">
            <div className="login-divider-line" />
            <span>or</span>
            <div className="login-divider-line" />
          </div>

          {/* Toggle Mode */}
          <div className="login-toggle">
            <p>
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button type="button" onClick={toggleMode} className="login-toggle-btn">
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
