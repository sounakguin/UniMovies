import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../LoginFunc/Firebase";

import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [formdata, setformData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setformData({
      ...formdata,
      [name]: value,
    });

    // Clear previous error for the field when typing
    setError({
      ...error,
      [name]: "",
    });
  };

  const validateEmail = (email) => {
    // Custom email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formdata;

    // Validation checks
    let hasError = false;
    const newErrors = {
      email: "",
      password: "",
    };

    if (!validateEmail(email)) {
      newErrors.email = "Invalid email format";
      hasError = true;
    }

    if (password.length === 0) {
      newErrors.password = "Password is required";
      hasError = true;
    }

    if (hasError) {
      setError(newErrors);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);

      navigate("/");

      setformData({
        email: "",
        password: "",
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen login">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-200 p-6 rounded shadow-md w-full max-w-sm login-form"
      >
        <h3 className="text-2xl font-bold mb-4">Login</h3>

        <div className="mb-4">
          <label className="block text-gray-700">Email address</label>
          <input
            type="text"
            name="email"
            className={`w-full px-3 py-2 border ${
              error.email ? "border-red-500" : "border-gray-300"
            } rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="Enter email"
            value={formdata.email}
            onChange={handleChange}
            required
          />
          {error.email && (
            <p className="text-red-500 text-xs mt-1">{error.email}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            name="password"
            className={`w-full px-3 py-2 border ${
              error.password ? "border-red-500" : "border-gray-300"
            } rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="Enter password"
            value={formdata.password}
            onChange={handleChange}
            required
          />
          {error.password && (
            <p className="text-red-500 text-xs mt-1">{error.password}</p>
          )}
        </div>

        <div className="flex items-center justify-between mb-4">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Submit
          </button>
        </div>

        <p className="text-center">
          New user -{" "}
          <Link to="/register" className="text-blue-500 hover:underline">
            Register Here
          </Link>
        </p>
        <p className="text-center">
          <Link to="/forgot-password" className="text-blue-500 hover:underline">
            Forgot Password?
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
