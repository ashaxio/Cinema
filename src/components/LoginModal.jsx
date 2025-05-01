import { useState, useContext, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import closeIcon from "../assets/close.svg";
import toast from "react-hot-toast";

const LoginModal = ({ onClose, switchToRegister }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",
  });
  const { login } = useContext(AuthContext);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toastMessage = sessionStorage.getItem("toastMessage");
    if (toastMessage) {
      toast.success(toastMessage);
      sessionStorage.removeItem("toastMessage");
    }

    setTimeout(() => setIsVisible(true), 10);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 200);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "", general: "" });
  };

  const validate = () => {
    const newErrors = { email: "", password: "", general: "" };
    let isValid = true;

    if (!form.email.trim()) {
      newErrors.email = "Email is required.";
      isValid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email)) {
        newErrors.email = "Invalid email format.";
        isValid = false;
      }
    }

    if (!form.password.trim()) {
      newErrors.password = "Password is required.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    try {
      const res = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      sessionStorage.setItem("toastMessage", "Login successful!");
      login({ token: data.token, email: form.email });
      handleClose();

      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (err) {
      setErrors((prev) => ({ ...prev, general: err.message }));
    }
  };

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm bg-black/40 flex items-center justify-center z-50"
      onClick={handleClose}
    >
      <div
        className={`
          relative bg-[#0f1827] text-white p-8 rounded-2xl w-full max-w-md shadow-lg
          transform transition-all duration-200
          ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 cursor-pointer"
        >
          <img
            src={closeIcon}
            alt="Close"
            className="w-6 h-6 hover:scale-110 transition-transform"
          />
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

        {errors.general && (
          <div className="h-6 mb-4">
            <p className="text-red-500 text-sm transition-opacity opacity-100">
              {errors.general}
            </p>
          </div>
        )}

        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full p-3 mb-1 rounded-lg bg-[#192231] focus:outline-none focus:ring-2 focus:ring-[#5031D6]"
        />
        <div className="h-6">
          {errors.email && (
            <p className="text-red-500 text-sm transition-opacity opacity-100">
              {errors.email}
            </p>
          )}
        </div>

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full p-3 mb-1 rounded-lg bg-[#192231] focus:outline-none focus:ring-2 focus:ring-[#5031D6]"
        />
        <div className="h-6">
          {errors.password && (
            <p className="text-red-500 text-sm transition-opacity opacity-100">
              {errors.password}
            </p>
          )}
        </div>

        <button
          onClick={handleLogin}
          className="w-full bg-[#5031D6] cursor-pointer hover:bg-[#6a4ff7] text-white py-3 rounded-lg transition-colors"
        >
          Login
        </button>

        <p className="mt-4 text-sm text-center">
          Don’t have an account?{" "}
          <button
            onClick={() => {
              handleClose();
              setTimeout(switchToRegister, 200);
            }}
            className="text-[#5031D6] cursor-pointer hover:underline"
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginModal;
