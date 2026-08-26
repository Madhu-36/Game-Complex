import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      navigate('/');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-start font-sans">
      {/* LEFT SIDE: Completely Transparent Container */}
      <div className="w-full lg:w-1/3 min-h-screen p-8 lg:p-12 xl:p-24 flex flex-col justify-center bg-transparent relative z-10">
        <div className="w-full max-w-sm mx-auto">
          <div className="mb-10">
            <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400 tracking-tighter mb-2 drop-shadow-md">Sign In</h2>
            <p className="text-gray-100 font-bold drop-shadow-sm">Welcome back to G-C</p>
          </div>
          
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 text-red-200 rounded-xl text-center text-sm font-bold backdrop-blur-md">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-300 group-focus-within:text-green-400 transition-colors z-20">
                  <FiMail size={20} />
                </div>
                <input
                  type="text"
                  placeholder="Username"
                  className="w-full pl-12 pr-4 py-4 bg-black/40 backdrop-blur-md border border-white/20 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all placeholder-gray-300 relative z-10"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-300 group-focus-within:text-green-400 transition-colors z-20">
                  <FiLock size={20} />
                </div>
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full pl-12 pr-4 py-4 bg-black/40 backdrop-blur-md border border-white/20 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all placeholder-gray-300 relative z-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-black rounded-xl transition-all flex items-center justify-center space-x-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] active:scale-[0.98]"
            >
              <span>SIGN IN</span>
              <FiArrowRight size={20} />
            </button>
          </form>
          <div className="mt-8 text-center text-sm text-gray-300">
            Don't have an account?{' '}
            <Link to="/register" className="text-green-400 hover:text-green-300 font-bold transition-colors drop-shadow-sm">
              Register now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
