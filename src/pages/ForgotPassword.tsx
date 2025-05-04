// src/pages/ForgotPassword.tsx
import { useState } from "react";
import { supabase } from "../supabase";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "https://hevents-frontend-sdmlrs-projects.vercel.app/reset-password"
        ,
    });
    if (error) {
      setError(error.message);
      setTimeout(() => setError(""), 5000);
    } else {
      setMessage("Check your email for reset instructions.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <form
        onSubmit={handleReset}
        className="bg-white p-6 rounded shadow-md w-full max-w-md"
      >
        <h1 className="text-xl font-bold mb-4">Forgot Password</h1>
        {message && <p className="text-green-500">{message}</p>}
        {error && <p className="text-red-500">{error}</p>}
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Send Reset Link
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
