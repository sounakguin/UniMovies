import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { auth, db } from "../LoginFunc/Firebase";

function Register() {
  const [formdata, setformData] = useState({
    email: "",
    password: "",
    confirmpassword: "",
    fullname: "",
    phone: "",
  });

  const [error, setError] = useState({
    email: "",
    password: "",
    confirmpassword: "",
    fullname: "",
    phone: "",
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

  const validatePhoneNumber = (phone) => {
    // Regex for 10 digit phone number starting with +91
    const phoneRegex = /^\+91\d{10}$/;
    return phoneRegex.test(phone);
  };

  const validatePassword = (password) => {
    // Regex for password with at least one special character, one number, one letter, and be 8 characters long
    const passwordRegex = /^(?=.*[!@#$%^&*])(?=.*\d)(?=.*[a-zA-Z]).{8,}$/;
    return passwordRegex.test(password);
  };

  const validateEmail = (email) => {
    // Custom email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const { email, password, confirmpassword, fullname, phone } = formdata;

    // Validation checks
    let hasError = false;
    const newErrors = {
      email: "",
      password: "",
      confirmpassword: "",
      fullname: "",
      phone: "",
    };

    if (!validatePhoneNumber(phone)) {
      newErrors.phone =
        "Phone number must start with +91 and be 10 digits long";
      hasError = true;
    }

    if (!validatePassword(password)) {
      newErrors.password =
        "Password must contain at least one special character, one number, one letter, and be 8 characters long";
      hasError = true;
    }

    if (password !== confirmpassword) {
      newErrors.confirmpassword = "Passwords do not match";
      hasError = true;
    }

    if (!validateEmail(email)) {
      newErrors.email = "Invalid email format";
      hasError = true;
    }

    if (hasError) {
      setError(newErrors);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log("User created:", user);

      // Save the user data in Firestore
      await setDoc(doc(db, "Users", user.uid), {
        Email: user.email,
        FullName: fullname,
        PhoneNumber: phone,
        Password: password,
      });
      console.log("Data stored in Firestore");

      // Clear form data and errors
      setformData({
        email: "",
        password: "",
        confirmpassword: "",
        fullname: "",
        phone: "",
      });
      setError({});

      // Redirect to login page
      navigate('/login');
    } catch (error) {
      console.log("Error registering user:", error.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen login">
      <form
        onSubmit={handleRegister}
        className="bg-gray-200 p-6 rounded shadow-md w-full max-w-sm"
      >
        <h3 className="text-2xl font-bold mb-4">Sign Up</h3>

        <div className="mb-4">
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            name="fullname"
            className={`w-full px-3 py-2 border ${
              error.fullname ? "border-red-500" : "border-gray-300"
            } rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="Full name"
            value={formdata.fullname}
            onChange={handleChange}
            required
          />
          {error.fullname && (
            <p className="text-red-500 text-xs mt-1">{error.fullname}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Phone Number</label>
          <input
            type="tel"
            name="phone"
            className={`w-full px-3 py-2 border ${
              error.phone ? "border-red-500" : "border-gray-300"
            } rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="Enter phone number (+91XXXXXXXXXX)"
            value={formdata.phone}
            onChange={handleChange}
            required
          />
          {error.phone && (
            <p className="text-red-500 text-xs mt-1">{error.phone}</p>
          )}
        </div>

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

        <div className="mb-4">
          <label className="block text-gray-700">Confirm Password</label>
          <input
            type="password"
            name="confirmpassword"
            className={`w-full px-3 py-2 border ${
              error.confirmpassword ? "border-red-500" : "border-gray-300"
            } rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="Re-enter password"
            value={formdata.confirmpassword}
            onChange={handleChange}
            required
          />
          {error.confirmpassword && (
            <p className="text-red-500 text-xs mt-1">{error.confirmpassword}</p>
          )}
        </div>

        <div className="flex items-center justify-between mb-4">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Sign Up
          </button>
        </div>

        <p className="text-center">
          Already registered?{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}

export default Register;
