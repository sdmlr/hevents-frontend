// src/pages/ResetPassword.tsx
import { useState } from "react";
import { supabase } from "../supabase";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.updateUser({
      password,
    });
    if (error) {
      setError(error.message);
    } else {
      setSuccess("Password updated! You can now log in.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <form
        onSubmit={handleUpdate}
        className="bg-white p-6 rounded shadow-md w-full max-w-md"
      >
        <h1 className="text-xl font-bold mb-4">Reset Password</h1>
        {success && <p className="text-green-500">{success}</p>}
        {error && <p className="text-red-500">{error}</p>}
        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Update Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
