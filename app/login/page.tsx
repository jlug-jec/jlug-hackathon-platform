"use client";

import { signIn, useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import FloatingPaths from "../../components/ui/FloatingPath";
import AnimatedStarryBackground from "../../components/ui/AnimatedStarryBackground";
import ContactUs from "../../components/home/ContactUs";

export default function LoginPage() {
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isInstagram, setIsInstagram] = useState(false);

  useEffect(() => {
    const checkBrowser = () => {
      const isInsta = navigator.userAgent.includes("Instagram");
      setIsInstagram(isInsta);
    };
    checkBrowser();
  }, []);

  const handleSignIn = async () => {
    if (isInstagram) {
      alert("Please open this link in your actual browser (Chrome, Safari) for a better experience.");
      return;
    }
    setIsSigningIn(true);
    try {
      await signIn("google", {
        callbackUrl: `${window.location.origin}/hackathon`,
        redirect: true
      });
    } catch (error) {
      setIsSigningIn(false);
      console.error("Sign in error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
      <FloatingPaths position={0.5} opacity={0.3} />
      <FloatingPaths position={-0.5} opacity={0.3} />
      <AnimatedStarryBackground />
      <motion.div 
        className="bg-white/10 p-8 rounded-2xl backdrop-blur-xl w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-white text-center mb-8">Welcome to CodeKumbh</h1>
        
        <button
          onClick={handleSignIn}
          disabled={isSigningIn}
          className="w-full flex items-center justify-center gap-3 bg-white text-gray-900 px-6 py-3 rounded-lg hover:bg-white/90 transition-colors disabled:opacity-50"
        >
          {isSigningIn ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Signing in...
            </>
          ) : (
            <>
              <img src="/google.svg" alt="Google" className="w-5 h-5" />
              Continue with Google
            </>
          )}
        </button>

        <ContactUs/>
      </motion.div>
    </div>
  );
}