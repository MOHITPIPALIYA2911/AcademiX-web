import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import loginImg from '../../assets/bglogin.jpeg';
import Logo from '../../assets/ClosedLogo5.jpg';

const Login = () => {
  const [formData, setFormData] = useState({ emailId: '', password: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  const isValidEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { emailId, password } = formData;

    if (!emailId || !password) {
      toast.error('❌ Please enter both email and password!');
      return;
    }

    if (!isValidEmail(emailId)) {
      toast.error('❌ Please enter a valid email address!');
      return;
    }

    try {
      const response = await fetch('http://localhost:7777/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailId, password }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('usertype', data.usertype);
        toast.success('🎉 Login successful!');
        navigate('/dashboard', { replace: true });
      } else {
        toast.error('❌ Invalid credentials. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('🚫 Something went wrong. Please try again later.');
    }
  };

  return (
    <div
      className="relative bg-no-repeat bg-cover bg-center min-h-screen"
      style={{ backgroundImage: `url(${loginImg})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-green-500 to-green-400 opacity-75"></div>

      <div className="flex flex-col sm:flex-row justify-center items-center min-h-screen">
        {/* Left Side: Welcome Message */}
        <div className="hidden lg:block flex flex-col self-center p-10 sm:max-w-5xl xl:max-w-2xl text-white z-10">
          <h1 className="text-5xl font-bold mb-3">Welcome to AcademiX</h1>
          <b>Learn, Grow, Succeed!</b>
          <p className="pr-3 pt-8">
            Empowering learners with knowledge and skills. Start your journey today!
          </p>
        </div>

        {/* Right Side: Login Form */}
        <div className="flex justify-center self-center z-10">
          <div className="p-12 bg-white mx-auto rounded-2xl w-96 shadow-lg">
            <div className="mb-4 text-center">
              <img
                src={Logo}
                alt="AcademiX Logo"
                className="h-16 mb-3 rounded shadow-lg mx-auto"
              />
              <p className="text-gray-500">Please sign in to your account.</p>
            </div>
            <form className="space-y-5" onSubmit={handleLogin}>
              <div className="space-y-2">
                <label htmlFor="emailId" className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="emailId"
                  name="emailId"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-400"
                  type="text"
                  placeholder="mail@gmail.com"
                  value={formData.emailId}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-400"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Don't have an account?
                  <span
                    className="text-green-500 cursor-pointer hover:underline ml-1"
                    onClick={() => navigate('/register')}
                  >
                    Register
                  </span>
                </p>
              </div>

              <button
                type="submit"
                className="w-full flex justify-center bg-green-400 hover:bg-green-500 text-white p-3 rounded-full font-semibold shadow-lg transition duration-500"
              >
                Sign in
              </button>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
