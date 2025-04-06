import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './auth/Login';
import Register from './auth/Register';
import Home from "./Dashboard/Home";
import Layout from "../component/Layout";
import Protected from "./Protected";
import ManageMedia from "./ManageMedia";

const IndexView = () => {
  return (
    <>
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <Routes>
          <Route exact path="/" index element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Register />} />
          <Route
            path="home"
            element={
              <Layout>
                <Protected Cmp={Home} />
              </Layout>
            }
          />
          <Route
            path="/managemedia"
            element={
              <Layout>
                <Protected Cmp={ManageMedia} />
              </Layout>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default IndexView;
