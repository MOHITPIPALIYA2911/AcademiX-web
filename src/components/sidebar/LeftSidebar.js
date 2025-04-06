import React from 'react';

const LeftSidebar = () => {
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usertype");
    sessionStorage.clear();
    window.location.href = "/login";
  };

  const navigateTo = (path) => {
    window.location.href = path;
  };

  return (
    <aside className="w-64 bg-green-600 text-white flex flex-col p-5 min-h-screen">
      <h2 className="text-2xl font-bold mb-8">AcademiX</h2>

      {/* General Navigation */}
      <div className="space-y-2 mb-6">
        <div onClick={() => navigateTo("/dashboard")} className="block py-2 px-4 rounded hover:bg-green-700 cursor-pointer">🏠 Dashboard</div>
        <div onClick={() => navigateTo("/profile")} className="block py-2 px-4 rounded hover:bg-green-700 cursor-pointer">👤 Profile</div>
      </div>

      {/* Manage Groups Section */}
      <div className="mb-6">
        <h3 className="uppercase text-xs font-semibold text-green-200 mb-2 tracking-wide pl-1">Manage Groups</h3>
        <nav className="space-y-2">
          <div onClick={() => navigateTo("/creategroup")} className="block py-2 px-4 rounded hover:bg-green-700 cursor-pointer">👥 Create Group</div>
          <div onClick={() => navigateTo("/mygroups")} className="block py-2 px-4 rounded hover:bg-green-700 cursor-pointer">📌 My Groups</div>
          <div onClick={() => navigateTo("/joinedgroups")} className="block py-2 px-4 rounded hover:bg-green-700 cursor-pointer">📎  Joined Groups</div>
          <div onClick={() => navigateTo("/viewgroups")} className="block py-2 px-4 rounded hover:bg-green-700 cursor-pointer">📂 View Groups</div>
          <div onClick={() => navigateTo("/publicdiscussion")} className="block py-2 px-4 rounded hover:bg-green-700 cursor-pointer">💬 Public Discussion</div>
        </nav>
      </div>

      {/* Logout */}
      <div className="mt-auto">
        <div onClick={logout} className="block py-2 px-4 rounded hover:bg-red-500 cursor-pointer">🚪 Logout</div>
      </div>
    </aside>
  );
};

export default LeftSidebar;
