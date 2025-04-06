import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Protected = (props) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  // useEffect(() => {
  //   if (!token) {
  //     navigate("/login");
  //   }
  // });
  let Cmp = props.Cmp;
  return (
    <>
      <Cmp />
    </>
  );
};

export default Protected;
