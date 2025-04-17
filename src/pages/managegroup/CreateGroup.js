import React, { useState } from 'react';
import { triggerNotification } from '../../utils/toastUtil';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateGroup = () => {
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!groupName.trim() || !description.trim()) {
      triggerNotification('error', 'Both fields are required.');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:7777/groups',
        {
          groupName,
          description,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );

      triggerNotification('success', 'Group created successfully.');
      setGroupName('');
      setDescription('');

      // Redirect to dashboard after a short delay
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (error) {
      console.error('Error creating group:', error);
      triggerNotification(
        'error',
        error?.response?.data?.message || 'Server error. Try again later.'
      );
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center text-green-700">
        Create New Group
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Group Name
          </label>
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
            placeholder="Enter group name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
            rows="4"
            placeholder="Describe your group"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg"
        >
          Create Group
        </button>
      </form>
    </div>
  );
};

export default CreateGroup;
