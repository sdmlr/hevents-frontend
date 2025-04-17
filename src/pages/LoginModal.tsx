import { useEffect, useRef, useState } from "react";
import { supabase } from "../supabase";

type Props = {
  onClose: () => void;
};

const LoginModal = ({ onClose }: Props) => {
  const [show, setShow] = useState(false); // for animation trigger
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Trigger fade/scale in after mount
    setTimeout(() => setShow(true), 10);
  }, []);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      .value;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      alert(error.message);
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
      alert("Login succeeded but failed to fetch role");
      return;
    }

    // Optional: Save to localStorage
    localStorage.setItem("userRole", roleData.role);

    // Optional redirect based on role
    if (roleData.role === "staff") {
      window.location.href = "/admin";
    } else {
      window.location.href = "/events";
    }

    onClose(); // Close modal
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs bg-black/50"
      onClick={onClose} // close if backdrop clicked
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()} // prevent close on modal click
        className={`rounded-lg w-full max-w-sm shadow-lg relative transform transition-all duration-300 ${
          show ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-400 hover:text-gray-600 text-xl"
        >
          &times;
        </button>
        <div className="bg-white rounded-lg">
          <div className="bg-primary rounded-t-lg py-3 mb-3 justify-center items-center">
            <h2 className="text-xl font-bold text-center text-white">Login</h2>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-3 px-8">
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="border border-gray-300 p-2 rounded"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="border border-gray-300 p-2 rounded"
              required
            />
            <button
              type="submit"
              className="bg-red-500 text-primary py-2 rounded hover:bg-red-600 transition"
            >
              Join!
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
