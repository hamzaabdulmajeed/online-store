import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Helper function to set user session (matching your order components)
  const setUserSession = (userData, token) => {
    localStorage.setItem('isAuthenticated', 'true'); // This was missing!
    localStorage.setItem('authToken', token);
    localStorage.setItem('userId', userData.id || userData._id);
    localStorage.setItem('userEmail', userData.email);
    localStorage.setItem('userName', userData.name || userData.username || '');
    
    // Store admin status if available
    if (userData.isAdmin !== undefined) {
      localStorage.setItem('isAdmin', userData.isAdmin.toString());
    }
  };

  const handleLogin = async (loginData) => {
    setIsLoading(true);
    try {
      const response = await fetch('https://stylishmenshoes.vercel.app/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      const data = await response.json();
      
      // Check if we have the required data
      if (!data.token) {
        throw new Error('No authentication token received');
      }
      
      if (!data.user || !data.user.id) {
        throw new Error('Invalid user data received');
      }
      
      // Store authentication data using the helper function
      setUserSession(data.user, data.token);
      
      console.log('Login successful', {
        userId: data.user.id,
        email: data.user.email,
        isAdmin: data.user.isAdmin
      });
      
      // Navigate to dashboard or home page
      navigate('/');
      
    } catch (error) {
      console.error('Login error:', error.message);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    
    // Basic validation
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }
    
    // Create clean login data object
    const loginData = {
      email: email.trim(),
      password
    };
    
    // Call handleLogin with clean data
    await handleLogin(loginData);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-100 p-2 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400 disabled:bg-gray-100"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400 disabled:bg-gray-100"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          Don't have an account?{' '}
          <a href="/signup" className="text-blue-600 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

// Helper function for logout (use this in your header/navbar)
const handleLogout = () => {
  // Clear all user session data
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('authToken');
  localStorage.removeItem('userId');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userName');
  localStorage.removeItem('isAdmin');
  
  // Navigate to login
  window.location.href = '/login';
};

// Helper function to check if user is authenticated (use anywhere)
const isUserAuthenticated = () => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const hasToken = localStorage.getItem('authToken');
  const hasUserId = localStorage.getItem('userId');
  
  return isAuthenticated && hasToken && hasUserId;
};

// Helper function to get current user info
const getCurrentUser = () => {
  if (!isUserAuthenticated()) return null;
  
  return {
    id: localStorage.getItem('userId'),
    email: localStorage.getItem('userEmail'),
    name: localStorage.getItem('userName'),
    isAdmin: localStorage.getItem('isAdmin') === 'true',
    token: localStorage.getItem('authToken')
  };
};

// Export the Login component
export default Login;

// Export helper functions if needed in other components
export { handleLogout, isUserAuthenticated, getCurrentUser };
