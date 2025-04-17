import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { removeUser } from "../../utils/userSlice"; // Adjust the import path as needed

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const logout = () => { 
    sessionStorage.clear(); 
    document.cookie = "token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;"; 
    dispatch(removeUser()); 
    navigate("/login");
  };
  
  const goToProfile = () => {
    navigate("/profile");
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-white border-b shadow px-6 py-4 flex justify-between items-center">
      {/* Left: Toggle/Search */}
      <div className="flex items-center gap-4">
        <button className="text-xl text-gray-700 focus:outline-none">
          <i className="mdi mdi-menu mdi-24px" />
        </button>
        <div className="hidden md:flex items-center text-gray-500">
          <i className="mdi mdi-magnify mdi-24px mr-2" />
          <span className="text-sm">Search (Ctrl+/)</span>
        </div>
      </div>

      {/* Right: User dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={toggleDropdown}
          className="focus:outline-none flex items-center space-x-2"
        >
          <img
            src={user?.profile_pic || "https://cdn.jsdelivr.net/npm/@mdi/svg/svg/account-circle.svg"}
            alt="User Avatar"
            className="w-10 h-10 rounded-full border"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "https://cdn.jsdelivr.net/npm/@mdi/svg/svg/account-circle.svg";
            }}
          />
          <span className="hidden md:inline text-gray-700 font-medium">
            {user?.firstName || "User"}
          </span>
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50">
            <div className="px-4 py-3 border-b">
              <p className="text-sm font-medium text-gray-800">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500">{user?.emailId}</p>
            </div>
            <ul className="py-2">
              <li>
                <button
                  onClick={goToProfile}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  My Profile
                </button>
              </li>
              <li>
                <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Settings
                </button>
              </li>
              <li>
                <button
                  onClick={logout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100"
                >
                  Log Out
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;
