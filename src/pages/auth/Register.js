import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import regiImg from '../../assets/bgregi.png';
import Logo from '../../assets/ClosedLogo5.jpg';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const validateForm = () => {
    if (!name.trim()) {
      toast.error('⚠️ Full Name is required!', { position: 'top-right' });
      return false;
    }
    if (!email.trim()) {
      toast.error('⚠️ Email is required!', { position: 'top-right' });
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('⚠️ Invalid email format!', { position: 'top-right' });
      return false;
    }
    if (password.length < 6) {
      toast.error('⚠️ Password must be at least 6 characters long!', { position: 'top-right' });
      return false;
    }
    if (password !== confirmPassword) {
      toast.error('⚠️ Passwords do not match!', { position: 'top-right' });
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    toast.success('🎉 Registration successful!', { position: 'top-right' });
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Password:', password);
    setTimeout(() => navigate('/login'), 2000); // Redirect after a delay
  };

  return (
    <div className="relative bg-no-repeat bg-cover bg-center min-h-screen" 
      style={{ backgroundImage: `url(${regiImg})` }}>
      <div className="absolute inset-0 bg-gradient-to-b from-green-500 to-green-400 opacity-75"></div>
      <div className="flex flex-col sm:flex-row justify-center items-center min-h-screen">
        <div className="flex justify-center self-center z-10">
          <div className="p-12 bg-white mx-auto rounded-2xl w-96 shadow-lg">
            <div className="mb-4">
              <img src={Logo} alt="AcademiX Logo" className="h-16 mb-3 rounded shadow-lg mx-auto" />
              <p className="text-gray-500">Create your account</p>
            </div>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Full Name</label>
                <input 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-400" 
                  type="text" 
                  placeholder="John Doe" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <input 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-400" 
                  type="email" 
                  placeholder="mail@gmail.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <input 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-400" 
                  type="password" 
                  placeholder="Enter your password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Confirm Password</label>
                <input 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-400" 
                  type="password" 
                  placeholder="Confirm your password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <button type="submit" className="w-full flex justify-center bg-green-400 hover:bg-green-500 text-white p-3 rounded-full font-semibold shadow-lg transition duration-500">
                Sign up
              </button>
            </form>
            <div className="text-center mt-3">
              <p className="text-sm text-gray-600">
                Already have an account?
                <span className="text-green-500 cursor-pointer hover:underline ml-1" onClick={() => navigate('/login')}>
                  Sign in
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover draggable />
    </div>
  );
};

export default Register;
