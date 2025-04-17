import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { addUser } from "./utils/userSlice";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import Layout from "./components/Layout";
import Protected from "./pages/Protected";
import Profile from "./pages/manageprofile/Profile";
import CreateGroup from "./pages/managegroup/CreateGroup";
import MyGroups from "./pages/managegroup/MyGroups";
import JoinedGroups from "./pages/managegroup/JoinedGroup";
import PublicDiscussion from "./pages/publicdiscussion/PublicDiscussion";
import ViewGroup from "./pages/managegroup/ViewGroup";
import Question from "./components/group/Question";
import JoinGroup from "./pages/managegroup/JoinGroup";

function App() {
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);
  const location = useLocation();

  useEffect(() => {
    // Check if the current route is a public route where we don't need to fetch the user.
    if (
      location.pathname === "/" ||
      location.pathname === "/login" ||
      location.pathname === "/register"
    ) {
      return;
    }

    const fetchUser = async () => {
      try {
        console.log("Fetching user...");
        const response = await axios.get("http://localhost:7777/profile/view", {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        });
        dispatch(addUser(response.data));
      } catch (e) {
        // Redirect only if we're not already on the login page.
        window.location.href = "/login";
      }
    };

    if (!user) {
      fetchUser();
    }
  }, [dispatch, location, user]);

  return (
    <>
      <Routes>
        {/* Auth routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <Layout>
              <Protected Cmp={Dashboard} />
            </Layout>
          }
        />
        <Route
          path="/profile"
          element={
            <Layout>
              <Protected Cmp={Profile} />
            </Layout>
          }
        />
        <Route
          path="/publicdiscussion"
          element={
            <Layout>
              <Protected Cmp={PublicDiscussion} />
            </Layout>
          }
        />
        {/* Question Route */}
        <Route
          path="/publicdiscussion/question/:qid/group/:grpID"
          element={
            <Layout>
              <Protected Cmp={Question} />
            </Layout>
          }
        />
        <Route
          path="/creategroup"
          element={
            <Layout>
              <Protected Cmp={CreateGroup} />
            </Layout>
          }
        />
        <Route
          path="/viewgroup/:groupId/from/:frm"
          element={
            <Layout>
              <Protected Cmp={ViewGroup} />
            </Layout>
          }
        />
        <Route
          path="/mygroups"
          element={
            <Layout>
              <Protected Cmp={MyGroups} />
            </Layout>
          }
        />
        <Route
          path="/joinedgroups"
          element={
            <Layout>
              <Protected Cmp={JoinedGroups} />
            </Layout>
          }
        />
        {/* Question Route */}
        <Route
          path="/question/:qid/group/:grpID"
          element={
            <Layout>
              <Protected Cmp={Question} />
            </Layout>
          }
        />

        {/* joingroup Route */}
        <Route
          path="/joingroup"
          element={
            <Layout>
              <Protected Cmp={JoinGroup} />
            </Layout>
          }
        />
      </Routes>
    </>
  );
}

export default function RootApp() {
  return (
    <Router>
      <App />
      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        pauseOnFocusLoss={false}
        theme="light"
      />
    </Router>
  );
}
