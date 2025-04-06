import React, { useState, useRef, useEffect } from "react";

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usertype");
    sessionStorage.clear();
    window.location.href = "/login";
  };
  

  // Close dropdown when clicking outside
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
        <button onClick={toggleDropdown} className="focus:outline-none flex items-center space-x-2">
          <img
            src="/assets/img/avatars/1.png"
            alt="User Avatar"
            className="w-10 h-10 rounded-full border"
            onError={(e) => (e.target.style.display = "none")} // fallback if image not found
          />
          <span className="hidden md:inline text-gray-700 font-medium">John Doe</span>
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50">
            <div className="px-4 py-3 border-b">
              <p className="text-sm font-medium text-gray-800">John Doe</p>
              <p className="text-xs text-gray-500">Admin</p>
            </div>  
            <ul className="py-2">
              <li>
                <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
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
