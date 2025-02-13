"use client";

import { signIn, useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push('/register');
    }
  }, [session, router]);

  const handleSignIn = async () => {
    await signIn("google", {
      callbackUrl: "/register",
      redirect: true
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
      <motion.div 
        className="bg-white/10 p-8 rounded-2xl backdrop-blur-xl w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-white text-center mb-8">Welcome to CodeKumbh</h1>
        <button
          onClick={handleSignIn}
          className="w-full flex items-center justify-center gap-3 bg-white text-gray-900 px-6 py-3 rounded-lg hover:bg-white/90 transition-colors"
        >
          <img src="/google.svg" alt="Google" className="w-5 h-5" />
          Continue with Google
        </button>
      </motion.div>
    </div>
  );
}