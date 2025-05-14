import { useState, useEffect } from "react";
import { useTheme } from "./ThemeContext";
import closeIcon from "../assets/close.svg";
import closeIconDark from "../assets/close-dark.svg";

const ChangePasswordModal = ({ userId, onClose }) => {
  const { isDarkMode } = useTheme();
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 10);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 200);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword.trim()) {
      setMessage("Пароль обов'язковий.");
      return;
    }

    if (newPassword.length < 6) {
      setMessage("Пароль має містити щонайменше 6 символів.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/user/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Пароль оновлено!");
        setNewPassword("");
        handleClose();
      } else {
        setMessage(data.error || "Помилка");
      }
    } catch {
      setMessage("Щось пішло не так");
    }
  };

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm bg-black/70 flex items-center justify-center z-50"
      onClick={handleClose}
    >
      <div
        className={`relative bg-[var(--bg-navbar-main)] text-[var(--text-color)] p-8 rounded-2xl w-full max-w-md shadow-lg
          transform transition-all duration-200
          ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 cursor-pointer"
        >
          <img
            src={isDarkMode ? closeIcon : closeIconDark}
            alt="Close"
            className="w-6 h-6 hover:scale-110 transition-transform"
          />
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center">Змінити пароль</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Новий пароль"
            className="w-full p-3 mb-1 rounded-lg bg-[var(--bg-navbar-second)] focus:outline-none focus:ring-2 focus:ring-[#5031D6]"
          />

          <div className="min-h-[20px] mb-1">
            {message && <p className="text-sm text-red-500">{message}</p>}
          </div>

          <div className="flex justify-center gap-3 mt-3">
            <button
              type="submit"
              className="min-w-[120px] bg-[#5031D6] text-white px-4 py-2 rounded-lg hover:bg-[#6a4ff7] transition-colors"
            >
              Зберегти
            </button>
            <button
              type="button"
              onClick={handleClose}
              className={`min-w-[120px] bg-[var(--bg-navbar-second)] text-[var(--text-color)] px-5 py-2 rounded-lg transition-colors
                ${isDarkMode ? "hover:bg-[#2a3240]" : "hover:bg-[#e2e8f0]"}`}
            >
              Скасувати
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
