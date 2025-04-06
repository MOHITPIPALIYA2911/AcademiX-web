import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/dashboard/Dashboard';
import Layout from './components/Layout';
import Protected from './pages/Protected';
import Profile from './pages/manageprofile/Profile';
import ViewGroups from './pages/managegroup/ViewGroups';
import CreateGroup from './pages/managegroup/CreateGroup';
import MyGroups from './pages/managegroup/MyGroups';
import JoinedGroups from './pages/managegroup/JoinedGroup';
import PublicDiscussion from './pages/publicdiscussion/PublicDiscussion';

// New pages
// import CreateGroup from './pages/groups/CreateGroup';
// import PublicDiscussion from './pages/groups/PublicDiscussion';
// import JoinGroup from './pages/groups/JoinGroup';
// import ViewGroups from './pages/groups/ViewGroups';

function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
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
        {/* Public Discussion  */}
        <Route
          path="/publicdiscussion"
          element={
            <Layout>
              <Protected Cmp={PublicDiscussion} />
            </Layout>
          }
        /> 

        {/* manage group */}
        <Route
          path="/creategroup"
          element={
            <Layout>
              <Protected Cmp={CreateGroup} />
            </Layout>
          }
        />
        {/* <Route
          path="/joingroup"
          element={
            <Layout>
              <Protected Cmp={JoinGroup} />
            </Layout>
          }
        />
       */}

        <Route
          path="/viewgroups"
          element={
            <Layout>
              <Protected Cmp={ViewGroups} />
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
      </Routes>
    </Router>
  );
}

export default App;
