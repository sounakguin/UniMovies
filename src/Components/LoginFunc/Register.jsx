import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { auth, db } from "../LoginFunc/Firebase";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

function Register() {
  const [formdata, setFormData] = useState({
    email: "",
    password: "",
    confirmpassword: "",
    fullname: "",
    phone: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formdata,
      [name]: value,
    });
  };

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^\+91\d{10}$/;
    return phoneRegex.test(phone);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[!@#$%^&*])(?=.*\d)(?=.*[a-zA-Z]).{8,}$/;
    return passwordRegex.test(password);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const { email, password, confirmpassword, fullname, phone } = formdata;

    let hasError = false;

    if (!validatePhoneNumber(phone)) {
      toast.error("Phone number must start with +91 and be 10 digits long", {
        position: "top-right",
      });
      hasError = true;
    }

    if (!validatePassword(password)) {
      toast.error("Password must contain at least one special character, one number, one letter, and be 8 characters long", {
        position: "top-right",
      });
      hasError = true;
    }

    if (password !== confirmpassword) {
      toast.error("Passwords do not match", {
        position: "top-right",
      });
      hasError = true;
    }

    if (!validateEmail(email)) {
      toast.error("Invalid email format", {
        position: "top-right",
      });
      hasError = true;
    }

    if (hasError) {
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
    

      await setDoc(doc(db, "Users", user.uid), {
        Email: user.email,
        FullName: fullname,
        PhoneNumber: phone,
        Password: password,
      });
      

      setFormData({
        email: "",
        password: "",
        confirmpassword: "",
        fullname: "",
        phone: "",
      });

      toast.success("Registration successful! Redirecting to login...", {
        position: "top-right",
      });
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        toast.error("Email is already in use", {
          position: "top-right",
        });
      } else {
        toast.error("Error registering user: " + error.message, {
          position: "top-right",
        });
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="flex justify-center items-center min-h-screen login">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
      <form
        onSubmit={handleRegister}
        className="bg-gray-200 p-6 rounded shadow-md w-full max-w-sm relative"
      >
        <h3 className="text-2xl font-bold mb-4">Sign Up</h3>

        <div className="mb-4">
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            name="fullname"
            className="w-full px-3 py-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Full name"
            value={formdata.fullname}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Phone Number</label>
          <input
            type="tel"
            name="phone"
            className="w-full px-3 py-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter phone number"
            value={formdata.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Email address</label>
          <input
            type="text"
            name="email"
            className="w-full px-3 py-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter email"
            value={formdata.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4 relative">
          <label className="block text-gray-700">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            className="w-full px-3 py-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter password"
            value={formdata.password}
            onChange={handleChange}
            required
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 flex items-center pr-3 pt-8"
          >
            <FontAwesomeIcon
              icon={showPassword ? faEyeSlash : faEye}
              className="text-black"
            />
          </button>
        </div>

        <div className="mb-4 relative">
          <label className="block text-gray-700">Confirm Password</label>
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmpassword"
            className="w-full px-3 py-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Re-enter password"
            value={formdata.confirmpassword}
            onChange={handleChange}
            required
          />
          <button
            type="button"
            onClick={toggleConfirmPasswordVisibility}
            className="absolute inset-y-0 right-0 flex items-center pr-3 pt-8"
          >
            <FontAwesomeIcon
              icon={showConfirmPassword ? faEyeSlash : faEye}
              className="text-black"
            />
          </button>
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
