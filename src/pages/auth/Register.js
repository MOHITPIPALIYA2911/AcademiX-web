import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import regiImg from '../../assets/bgregi.png';
import Logo from '../../assets/ClosedLogo5.jpg';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    emailId: '',
    password: '',
    confirmPassword: '',
    bio: '',
    profile_pic: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const { firstName, lastName, emailId, password, confirmPassword } = formData;
    if (!firstName.trim() || !lastName.trim()) {
      toast.error('⚠️ First and Last Name are required!');
      return false;
    }
    if (!emailId.trim()) {
      toast.error('⚠️ Email is required!');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailId)) {
      toast.error('⚠️ Invalid email format!');
      return false;
    }
    if (password.length < 6) {
      toast.error('⚠️ Password must be at least 6 characters!');
      return false;
    }
    if (password !== confirmPassword) {
      toast.error('⚠️ Passwords do not match!');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      emailId: formData.emailId,
      password: formData.password,
      reputation: 1,
      bio: formData.bio || 'New User!',
      profile_pic: formData.profile_pic || 'https://via.placeholder.com/150',
    };

    try {
      const res = await axios.post('http://localhost:7777/auth/signup', payload, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.status === 200 || res.status === 201) {
        toast.success('🎉 Registration successful!');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        toast.error('❌ Registration failed. Try again.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      toast.error('🚫 Something went wrong. Please try again.');
    }
  };

  return (
    <div className="relative bg-no-repeat bg-cover bg-center min-h-screen" style={{ backgroundImage: `url(${regiImg})` }}>
      <div className="absolute inset-0 bg-gradient-to-b from-green-500 to-green-400 opacity-75"></div>
      <div className="flex flex-col sm:flex-row justify-center items-center min-h-screen">
        <div className="flex justify-center self-center z-10">
          <div className="p-12 bg-white mx-auto rounded-2xl w-[650px] h-[600px] shadow-lg">
            <div className="mb-4 text-center">
              <img src={Logo} alt="AcademiX Logo" className="h-16 mb-3 rounded shadow-lg mx-auto" />
              <p className="text-gray-500">Create your account</p>
            </div>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="flex gap-2">
                <input name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} className="w-1/2 px-3 py-2 border rounded-lg" />
                <input name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} className="w-1/2 px-3 py-2 border rounded-lg" />
              </div>
              <input name="emailId" placeholder="Email" type="email" value={formData.emailId} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
              <input name="password" placeholder="Password" type="password" value={formData.password} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
              <input name="confirmPassword" placeholder="Confirm Password" type="password" value={formData.confirmPassword} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
              <input name="bio" placeholder="Bio (optional)" value={formData.bio} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
              <input name="profile_pic" placeholder="Profile Pic URL (optional)" value={formData.profile_pic} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
              <button type="submit" className="w-full bg-green-400 hover:bg-green-500 text-white p-3 rounded-full font-semibold shadow-lg transition duration-300">Sign up</button>
            </form>
            <div className="text-center mt-3">
              <p className="text-sm text-gray-600">
                Already have an account?
                <span className="text-green-500 cursor-pointer hover:underline ml-1" onClick={() => navigate('/login')}>Sign in</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer autoClose={3000} />
    </div>
  );
};

export default Register;
