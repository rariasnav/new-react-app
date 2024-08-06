import React, { useContext, useEffect } from "react";
import { Context } from "../js/store/appContext";
import { useNavigate } from "react-router-dom";

export const LoginPreview = () => {
  const navigate = useNavigate();

  return (
    <div className="container">
      <div className="body text-center m-5">
        <div className="d-grid gap-2 m-auto" style={{ width: "26rem" }}>
          <h1 className="text-primary-custom">Welcome!</h1>
          <p className="text-secondary-custom">
            If you already have an account Login otherwise Signup
          </p>
          <button
            className="btn btn-primary mb-3"
            type="button"
            onClick={() => navigate("/signUp")}
          >
            Sign up
          </button>
          <button
            className="btn btn-primary"
            type="button"
            onClick={() => navigate("/login")}
          >
            Log in
          </button>
        </div>
      </div>
    </div>
  );
};
