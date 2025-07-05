import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// const Signup = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleSignup = async (e) => {
//     e.preventDefault();
//     setError('');

//     try {
//       const res = await axios.post('http://localhost:3001/api/auth/signup', { email, password });
//       const { token } = res.data;

//       localStorage.setItem('token', token);
//       localStorage.setItem('isAuthenticated', 'true');

//       navigate('/');
//     } catch (err) {
//       console.error(err);
//       setError(err.response?.data?.message || 'Signup failed. Please try again.');
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
//         <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>

//         {error && (
//           <div className="mb-4 text-sm text-red-600 bg-red-100 p-2 rounded">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSignup} className="space-y-4">
//           <input
//             type="email"
//             placeholder="Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//             className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
//           />

//           <input
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//             className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
//           />

//           <button
//             type="submit"
//             className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
//           >
//             Sign Up
//           </button>
//         </form>

//         <p className="text-sm text-center mt-4">
//           Already have an account?{' '}
//           <a href="/login" className="text-blue-600 hover:underline">
//             Login
//           </a>
//         </p>
//       </div>
//     </div>
//   );
// };
const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); // Added name field
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Helper function to set user session (same as Login component)
  const setUserSession = (userData, token) => {
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('authToken', token);
    localStorage.setItem('userId', userData.id || userData._id);
    localStorage.setItem('userEmail', userData.email);
    localStorage.setItem('userName', userData.name || userData.username || '');
    
    // Store admin status if available
    if (userData.isAdmin !== undefined) {
      localStorage.setItem('isAdmin', userData.isAdmin.toString());
    }
  };

  const handleSignup = async (signupData) => {
    setIsLoading(true);
    try {
      const response = await fetch('https://online-store-backend-fdym.vercel.app/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(signupData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Signup failed');
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
      
      console.log('Signup successful', {
        userId: data.user.id,
        email: data.user.email,
        isAdmin: data.user.isAdmin
      });
      
      // Navigate to dashboard or home page (user is automatically logged in)
      navigate('/');
      
    } catch (error) {
      console.error('Signup error:', error.message);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    
    // Basic validation
    if (!email.trim() || !password.trim() || !name.trim()) {
      setError('Please fill in all fields');
      return;
    }
    
    // Password validation
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    // Create clean signup data object
    const signupData = {
      name: name.trim(),
      email: email.trim(),
      password
    };
    
    // Call handleSignup with clean data
    await handleSignup(signupData);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-100 p-2 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={isLoading}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400 disabled:bg-gray-100"
          />

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
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;

