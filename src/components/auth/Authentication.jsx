import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import loginImg from "/login.jpeg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../../../configs/FirebaseConfig";

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleEmailAuth = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields", {
        position: "top-right",
        autoClose: 1500,
      });
      return;
    }

    try {
      // Try logging in
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      toast.success(`Welcome back, ${userCredential.user.email}!`, {
        position: "top-right",
        autoClose: 1500,
      });

      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (loginError) {
      // If login fails, create the user
      try {
        const newUserCredential = await createUserWithEmailAndPassword(auth, email, password);
        toast.success("Account created and logged in successfully!", {
          position: "top-right",
          autoClose: 1500,
        });

        setTimeout(() => navigate("/dashboard"), 1500);
      } catch (signupError) {
        toast.error("Authentication failed. Please check your credentials.", {
          position: "top-right",
          autoClose: 1500,
        });
        console.error("Auth Error:", signupError);
      }
    }
  };

  const handleGoogleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;

        toast.success(`Signed in as ${user.displayName}`, {
          position: "top-right",
          autoClose: 1500,
        });

        setTimeout(() => navigate("/dashboard"), 1500);
      })
      .catch((err) => {
        toast.error("Google Sign-in Failed", {
          position: "top-right",
          autoClose: 1500,
        });
        console.error("Google Sign-in Error:", err);
      });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -50, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="hidden md:flex items-center justify-center bg-indigo-100"
        >
          <img
            src={loginImg}
            alt="Login"
            className="w-full h-full object-cover hover:scale-105 transition-all duration-500"
          />
        </motion.div>

        <div className="w-full p-8 flex flex-col justify-center items-center">
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="w-full"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
              Sign In
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Login using your email or Google account
            </p>

            <form onSubmit={handleEmailAuth} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold">Email</label>
                <Input
                  type="email"
                  placeholder="user@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold">Password</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-2 top-2 text-sm text-blue-600 hover:underline"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full bg-primary text-white">
                Continue
              </Button>
            </form>

            <div className="flex items-center justify-center my-4">
              <span className="text-gray-400">or</span>
            </div>

            <Button
              onClick={handleGoogleSignIn}
              variant="outline"
              className="w-full font-medium text-md"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="google"
                className="w-5 h-5 mr-2"
              />
              Sign in with Google
            </Button>
          </motion.div>

          <ToastContainer />
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
