import { useState } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      return;
    }

    const userEmail = data.user?.email;
    if (!userEmail) return;

    const { data: roleData, error: roleError } = await supabase
      .from("users")
      .select("role")
      .eq("email", userEmail)
      .single();

    if (roleError) {
      setError("Login succeeded but failed to fetch role");
      return;
    }

    localStorage.setItem("userRole", roleData.role);

    if (roleData.role === "staff") {
      navigate("/admin");
    } else {
      navigate("/calendar");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Log In</h1>
        {error && (
          <p className="text-red-500 mb-4" role="alert" aria-live="assertive">
            {error}
          </p>
        )}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-primary hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Log In
          </button>
          <p className="text-sm text-center mb-4">
            <a
              href="/forgot-password"
              className="text-primary hover:text-red-600"
            >
              Forgot your password?
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
