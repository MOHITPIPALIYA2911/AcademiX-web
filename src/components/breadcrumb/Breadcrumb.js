import React from "react";
import { useNavigate } from "react-router-dom";

const Breadcrumb = ({ paths }) => {
  const navigate = useNavigate();

  return (
    <nav className="text-sm text-gray-600 mb-4 flex gap-1 flex-wrap">
      {paths.map((item, idx) => (
        <span key={idx} className="flex items-center gap-1">
          {idx > 0 && <span className="text-gray-400">/</span>}
          {item.path ? (
            <span
              className="text-green-600 hover:underline cursor-pointer"
              onClick={() => navigate(item.path)}
            >
              {item.label}
            </span>
          ) : (
            <span className="text-gray-700 font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
};

export default Breadcrumb;
