import { useState, useEffect } from "react";
import { useTheme } from "./ThemeContext";
import closeIcon from "../assets/close.svg";
import closeIconDark from "../assets/close-dark.svg";
import toast from "react-hot-toast";

const RegisterModal = ({ onClose, switchToLogin }) => {
  const { isDarkMode } = useTheme();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 10);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 200);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors = { username: "", email: "", password: "" };
    let isValid = true;

    if (!form.username.trim()) {
      newErrors.username = "Ім'я користувача обов'язкове.";
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim()) {
      newErrors.email = "Email обов'язковий.";
      isValid = false;
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = "Некоректний формат email.";
      isValid = false;
    }

    if (!form.password.trim()) {
      newErrors.password = "Пароль обов'язковий.";
      isValid = false;
    } else if (form.password.length < 6) {
      newErrors.password = "Пароль має бути з щонайменше 6 символів";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    try {
      const res = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      sessionStorage.setItem("toastMessage", "Реєстрація успішна!");
      window.location.reload();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm bg-black/70 flex items-center justify-center z-50"
      onClick={handleClose}
    >
      <div
        className={`
          relative bg-[#0f1827] text-white p-8 rounded-2xl w-full max-w-md shadow-lg
          transform transition-all duration-200
          ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}
        `}
        style={{
          backgroundColor: "var(--bg-navbar-main)",
          color: "var(--text-color)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute cursor-pointer top-4 right-4"
        >
          <img
            src={isDarkMode ? closeIcon : closeIconDark}
            alt="Close"
            className="w-6 h-6 hover:scale-110 transition-transform"
          />
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center">Реєстрація</h2>

        <input
          name="username"
          placeholder="Ім'я користувача"
          onChange={handleChange}
          className="w-full p-3 mb-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5031D6]"
          style={{
            backgroundColor: "var(--bg-navbar-second)",
            color: "var(--text-color)",
          }}
        />
        <div className={`h-6`}>
          {errors.username && (
            <p className="text-red-500 text-sm transition-opacity opacity-100">
              {errors.username}
            </p>
          )}
        </div>

        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full p-3 mb-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5031D6]"
          style={{
            backgroundColor: "var(--bg-navbar-second)",
            color: "var(--text-color)",
          }}
        />
        <div className={`h-6`}>
          {errors.email && (
            <p className="text-red-500 text-sm transition-opacity opacity-100">
              {errors.email}
            </p>
          )}
        </div>

        <input
          type="password"
          name="password"
          placeholder="Пароль"
          onChange={handleChange}
          className="w-full p-3 mb-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5031D6]"
          style={{
            backgroundColor: "var(--bg-navbar-second)",
            color: "var(--text-color)",
          }}
        />
        <div className={`h-6`}>
          {errors.password && (
            <p className="text-red-500 text-sm transition-opacity opacity-100">
              {errors.password}
            </p>
          )}
        </div>

        <button
          onClick={handleRegister}
          className="w-full bg-[#5031D6] cursor-pointer hover:bg-[#6a4ff7] text-white py-3 rounded-lg transition-colors"
        >
          Зареєструватись
        </button>

        <p className="mt-4 text-sm text-center">
          Вже маєте акаунт?{" "}
          <button
            onClick={() => {
              handleClose();
              setTimeout(switchToLogin, 200);
            }}
            className="text-[#5031D6] cursor-pointer hover:underline"
          >
            Увійти
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterModal;
