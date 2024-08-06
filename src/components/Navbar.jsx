import React, { useContext } from "react";
import { Context } from "../js/store/appContext";
import { Link, useNavigate } from "react-router-dom";

export const Navbar = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();

  const handleLogout = () => {
    actions.logout();
    navigate("/");
  };
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary m-3">
      <div className="container-fluid">
        <Link to="/">
          <span className="navbar-brand mb-0">
            <h2>React App</h2>
          </span>
        </Link>
        <div className="ml-auto">
          {store.loggedUser == null && <span>Loading...</span>}
          {store.loggedUser == false && (
            <div className="navbar-buttons">
              <button
                className="btn btn-primary m-2"
                onClick={() => navigate("/loginPreview")}
              >
                Login / Register
              </button>
            </div>
          )}
          {store.loggedUser && (
            <div className="navbar-buttons">
              <button
                className="btn btn-primary m-2"
                onClick={() => navigate("/profileSection")}
              >
                My profile
              </button>
              <button
                className="btn btn-primary m-2"
                onClick={() => handleLogout()}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
