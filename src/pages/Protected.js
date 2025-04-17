import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const getTokenFromCookie = () => {
  const match = document.cookie.match(/(^| )token=([^;]+)/);
  return match ? match[2] : null;
};

const Protected = (props) => {
  const navigate = useNavigate();
  const token = getTokenFromCookie();

  // useEffect(() => {
  //   if (!token) {
  //     navigate("/login");
  //   }
  // }, [token, navigate]);

  const Cmp = props.Cmp;
  return <Cmp />;
};

export default Protected;
