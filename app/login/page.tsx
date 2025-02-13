"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
      <div className="bg-white/10 p-8 rounded-2xl backdrop-blur-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-white text-center mb-8">Welcome to CodeKumbh</h1>
        <button
          onClick={() => signIn("google", { callbackUrl: "/register" })}
          className="w-full flex items-center justify-center gap-3 bg-white text-gray-900 px-6 py-3 rounded-lg hover:bg-white/90 transition-colors"
        >
          <img src="/google.svg" alt="Google" className="w-5 h-5" />
          Continue with Google
        </button>
      </div>
    </div>
  );
}