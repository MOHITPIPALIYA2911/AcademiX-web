import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Icon from "@mdi/react";
import {
  mdiViewDashboardOutline,
  mdiAccountCircleOutline,
  mdiAccountMultiplePlusOutline,
  mdiPin,
  mdiAccountMultipleCheckOutline,
  mdiForumOutline,
  mdiLogout,
  mdiAccountArrowRightOutline,
} from "@mdi/js";
import { useDispatch } from "react-redux";
import { removeUser } from "../../utils/userSlice";

const LeftSidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const logout = () => {
    sessionStorage.clear();
    document.cookie =
      "token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    dispatch(removeUser());
    navigate("/login");
  };

  const navigateTo = (path) => {
    navigate(path);
  };

  const NavItem = ({ icon, label, path }) => {
    const isActive = location.pathname === path;

    return (
      <div
        onClick={() => navigateTo(path)}
        className={`flex items-center gap-3 py-2 px-4 rounded cursor-pointer transition ${
          isActive
            ? "bg-green-800 font-semibold"
            : "hover:bg-green-700"
        }`}
      >
        <Icon path={icon} size={1} />
        <span>{label}</span>
      </div>
    );
  };

  return (
    <aside className="w-64 bg-green-600 text-white flex flex-col p-5 min-h-screen">
      <h2 className="text-2xl font-bold mb-8">AcademiX</h2>

      {/* General Navigation */}
      <div className="space-y-2 mb-6">
        <NavItem
          icon={mdiViewDashboardOutline}
          label="Dashboard"
          path="/dashboard"
        />
        <NavItem
          icon={mdiAccountCircleOutline}
          label="Profile"
          path="/profile"
        />
      </div>

      {/* Manage Groups Section */}
      <div className="mb-6">
        <h3 className="uppercase text-xs font-semibold text-green-200 mb-2 tracking-wide pl-1">
          Manage Groups
        </h3>
        <nav className="space-y-2">
          <NavItem
            icon={mdiAccountMultiplePlusOutline}
            label="Create Group"
            path="/creategroup"
          />
          <NavItem icon={mdiPin} label="My Groups" path="/mygroups" />
          <NavItem
            icon={mdiAccountMultipleCheckOutline}
            label="Joined Groups"
            path="/joinedgroups"
          />
          <NavItem
            icon={mdiForumOutline}
            label="Public Discussion"
            path="/publicdiscussion"
          />
          <NavItem
            icon={mdiAccountArrowRightOutline}
            label="Join Group"
            path="/joingroup"
          />
        </nav>
      </div>

      {/* Logout */}
      <div className="mt-auto">
        <div
          onClick={logout}
          className="flex items-center gap-3 py-2 px-4 rounded hover:bg-red-500 cursor-pointer"
        >
          <Icon path={mdiLogout} size={1} />
          <span>Logout</span>
        </div>
      </div>
    </aside>
  );
};

export default LeftSidebar;
