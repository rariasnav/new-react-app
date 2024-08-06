import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../js/store/appContext";

export const Login = () => {
  const { actions, store } = useContext(Context);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await actions.login(form);
    if (response.ok) {
      navigate("/");
    }
  };

  useEffect(() => {
    if (store.loggedUser) {
      navigate("/");
    }
  }, [store.loggedUser, navigate]);

  if (store.loggedUser === null) {
    return (
      <div className="container">
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "100vh" }}
        >
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="container">
      <div className="body text-center m-5">
        <h1>Login</h1>
        <form className="m-auto" style={{ width: "26rem" }}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="text"
              className="form-control"
              aria-describedby="emailHelp"
              name="username"
              value={form.username}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              name="password"
              value={form.password}
              onChange={handleChange}
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            onClick={(e) => handleSubmit(e)}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};
