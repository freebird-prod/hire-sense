import React, { useState, useEffect } from "react";
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
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { auth } from "../../../configs/FirebaseConfig";
import { Eye, EyeClosed, ArrowLeft, Loader2 } from "lucide-react";

function AuthPage() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [authUser, setAuthUser] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Check if user is already authenticated
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthUser(user);
      setIsInitializing(false);
      
      if (user) {
        const savedRole = localStorage.getItem("userRole");
        if (savedRole) {
          const redirectPath = savedRole === "recruiter" ? "/dashboard" : "/applier-dashboard";
          navigate(redirectPath);
        }
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // Load saved role from localStorage
  useEffect(() => {
    const savedRole = localStorage.getItem("userRole");
    if (savedRole) {
      setRole(savedRole);
    }
  }, []);

  // Email validation
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password validation
  const isValidPassword = (password) => {
    return password.length >= 6;
  };

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    localStorage.setItem("userRole", selectedRole);
  };

  const handleBack = () => {
    setRole(null);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    localStorage.removeItem("userRole");
  };

  const validateForm = () => {
    if (!email.trim()) {
      toast.error("Email is required", {
        position: "top-right",
        autoClose: 3000,
      });
      return false;
    }

    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address", {
        position: "top-right",
        autoClose: 3000,
      });
      return false;
    }

    if (!password) {
      toast.error("Password is required", {
        position: "top-right",
        autoClose: 3000,
      });
      return false;
    }

    if (!isValidPassword(password)) {
      toast.error("Password must be at least 6 characters long", {
        position: "top-right",
        autoClose: 3000,
      });
      return false;
    }

    if (isSignUp) {
      if (!confirmPassword) {
        toast.error("Please confirm your password", {
          position: "top-right",
          autoClose: 3000,
        });
        return false;
      }

      if (password !== confirmPassword) {
        toast.error("Passwords do not match", {
          position: "top-right",
          autoClose: 3000,
        });
        return false;
      }
    }

    return true;
  };

  const handleAuth = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      let userCredential;
      
      if (isSignUp) {
        userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
        toast.success("Account created successfully! Welcome aboard!", {
          position: "top-right",
          autoClose: 2000,
        });
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
        toast.success(`Welcome back, ${userCredential.user.email}!`, {
          position: "top-right",
          autoClose: 2000,
        });
      }

      // Clear form
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      // Navigate to appropriate dashboard
      const redirectPath = role === "recruiter" ? "/dashboard" : "/applier-dashboard";
      setTimeout(() => navigate(redirectPath), 1000);

    } catch (error) {
      console.error("Authentication Error:", error);
      handleAuthError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthError = (error) => {
    let errorMessage = "Authentication failed. Please try again.";
    
    switch (error.code) {
      case "auth/email-already-in-use":
        errorMessage = "This email is already registered. Try signing in instead.";
        break;
      case "auth/invalid-email":
        errorMessage = "Invalid email format. Please check your email address.";
        break;
      case "auth/user-not-found":
        errorMessage = "No account found with this email. Please sign up first.";
        break;
      case "auth/wrong-password":
        errorMessage = "Incorrect password. Please try again.";
        break;
      case "auth/invalid-credential":
        errorMessage = "Invalid email or password. Please check your credentials.";
        break;
      case "auth/weak-password":
        errorMessage = "Password is too weak. Please use at least 6 characters.";
        break;
      case "auth/too-many-requests":
        errorMessage = "Too many failed attempts. Please try again later.";
        break;
      case "auth/network-request-failed":
        errorMessage = "Network error. Please check your internet connection.";
        break;
      default:
        errorMessage = error.message || "An unexpected error occurred.";
    }

    toast.error(errorMessage, { 
      position: "top-right", 
      autoClose: 4000 
    });
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    
    try {
      const result = await signInWithPopup(auth, provider);
      toast.success(`Welcome, ${result.user.displayName || result.user.email}!`, {
        position: "top-right",
        autoClose: 2000,
      });
      
      const redirectPath = role === "recruiter" ? "/dashboard" : "/applier-dashboard";
      setTimeout(() => navigate(redirectPath), 1000);
      
    } catch (error) {
      console.error("Google Sign-in Error:", error);
      
      let errorMessage = "Google Sign-in failed. Please try again.";
      if (error.code === "auth/popup-closed-by-user") {
        errorMessage = "Sign-in was cancelled. Please try again.";
      } else if (error.code === "auth/popup-blocked") {
        errorMessage = "Popup was blocked. Please allow popups and try again.";
      }
      
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("userRole");
      setRole(null);
      setAuthUser(null);
      toast.success("Signed out successfully", {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("Failed to sign out", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  // Show loading while initializing auth state
  if (isInitializing) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  const renderRoleSelection = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center w-full"
    >
      {authUser && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-700">
            You're signed in as: {authUser.email}
          </p>
          <button
            onClick={handleSignOut}
            className="text-xs text-green-600 hover:text-green-800 underline mt-1"
          >
            Sign out
          </button>
        </div>
      )}
      
      <h2 className="text-3xl font-bold text-gray-800 mb-4">
        Choose Your Role
      </h2>
      <p className="text-gray-600 mb-8">
        Are you here to hire or to get hired?
      </p>
      <div className="flex flex-col space-y-4">
        <Button
          onClick={() => handleRoleSelect("recruiter")}
          size="lg"
          className="w-full bg-primary hover:bg-primary/80"
          disabled={isLoading}
        >
          For Recruiters
        </Button>
        <Button
          onClick={() => handleRoleSelect("applier")}
          size="lg"
          variant="outline"
          className="w-full border-black hover:border-primary"
          disabled={isLoading}
        >
          For Job Appliers
        </Button>
      </div>
    </motion.div>
  );

  const renderAuthForm = () => (
    <motion.div
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      <button
        onClick={handleBack}
        className="flex items-center gap-2 text-red-700 font-medium transition-colors hover:text-red-500 mb-4"
        disabled={isLoading}
      >
        <ArrowLeft size={20} /> Back
      </button>
      
      <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
        {isSignUp ? "Create an Account" : "Sign In"} (
        {role === "recruiter" ? "Recruiter" : "Job Applier"})
      </h2>
      
      <p className="text-gray-600 text-center mb-6">
        {isSignUp
          ? "Create your account with email or use Google"
          : "Sign in with your email or Google account"}
      </p>

      <form onSubmit={handleAuth} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-semibold mb-1">
            Email Address *
          </label>
          <Input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            className={`${!isValidEmail(email) && email ? 'border-red-300' : ''}`}
            required
          />
          {email && !isValidEmail(email) && (
            <p className="text-red-500 text-xs mt-1">Please enter a valid email address</p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-1">
            Password *
          </label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className={`${!isValidPassword(password) && password ? 'border-red-300' : ''}`}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
              disabled={isLoading}
            >
              {showPassword ? <EyeClosed size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {password && !isValidPassword(password) && (
            <p className="text-red-500 text-xs mt-1">Password must be at least 6 characters</p>
          )}
        </div>

        {isSignUp && (
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Confirm Password *
            </label>
            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                className={`${confirmPassword && password !== confirmPassword ? 'border-red-300' : ''}`}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
                disabled={isLoading}
              >
                {showConfirmPassword ? <EyeClosed size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {confirmPassword && password !== confirmPassword && (
              <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
            )}
          </div>
        )}

        <Button 
          type="submit" 
          className="w-full bg-primary text-white"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              {isSignUp ? "Creating Account..." : "Signing In..."}
            </div>
          ) : (
            isSignUp ? "Create Account" : "Sign In"
          )}
        </Button>
      </form>

      <div className="flex items-center justify-center my-4">
        <span className="text-gray-400">or</span>
      </div>

      <Button
        onClick={handleGoogleSignIn}
        variant="outline"
        className="w-full font-medium text-md"
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Connecting...
          </div>
        ) : (
          <>
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="google"
              className="w-5 h-5 mr-2"
            />
            {isSignUp ? "Sign up with Google" : "Sign in with Google"}
          </>
        )}
      </Button>

      <p className="mt-6 text-center text-sm text-gray-600">
        {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
        <button
          onClick={() => {
            setIsSignUp(!isSignUp);
            setPassword("");
            setConfirmPassword("");
          }}
          className="text-indigo-600 font-medium hover:underline ml-1"
          disabled={isLoading}
        >
          {isSignUp ? "Sign In" : "Sign Up"}
        </button>
      </p>
    </motion.div>
  );

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="hidden md:flex items-center justify-center bg-indigo-100"
        >
          <img
            src={loginImg}
            alt="Login Visual"
            className="w-full h-full object-cover hover:scale-105 transition-all duration-500"
          />
        </motion.div>

        <div className="w-full p-8 flex flex-col justify-center items-center">
          {role ? renderAuthForm() : renderRoleSelection()}
          <ToastContainer />
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
