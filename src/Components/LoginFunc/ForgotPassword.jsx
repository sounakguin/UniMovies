import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../LoginFunc/Firebase";
import { Link } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setEmail(e.target.value);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Email is required");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen login">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-200 p-6 rounded shadow-md w-full max-w-sm"
      >
        <h3 className="text-2xl font-bold mb-4">Forgot Password</h3>

        <div className="mb-4">
          <label className="block text-gray-700">Email address</label>
          <input
            type="text"
            className={`w-full px-3 py-2 border ${
              error ? "border-red-500" : "border-gray-300"
            } rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="Enter email"
            value={email}
            onChange={handleChange}
            required
          />
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
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
          <Link to="/login" className="text-blue-500 hover:underline">
            Back to Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default ForgotPassword;
