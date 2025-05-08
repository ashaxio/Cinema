import { useState, useEffect } from "react";
import closeIcon from "../assets/close.svg";

const ChangePasswordModal = ({ userId, onClose }) => {
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
      setMessage("Password cannot be empty.");
      return;
    }

    if (newPassword.length < 6) {
      setMessage("Password must be at least 6 characters.");
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
        setMessage("Password updated!");
        setNewPassword("");
        handleClose();
      } else {
        setMessage(data.error || "Error");
      }
    } catch {
      setMessage("Something went wrong");
    }
  };

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm bg-black/70 flex items-center justify-center z-50"
      onClick={handleClose}
    >
      <div
        className={`relative bg-[#0f1827] text-white p-8 rounded-2xl w-full max-w-md shadow-lg
          transform transition-all duration-200
          ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
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
        <h2 className="text-2xl font-bold mb-4 text-center">Change Password</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New password"
            className="w-full p-3 mb-1 rounded-lg bg-[#192231] focus:outline-none focus:ring-2 focus:ring-[#5031D6]"
          />

          <div className="min-h-[20px] mb-1">
            {message && <p className="text-sm text-red-500">{message}</p>}
          </div>

          <div className="flex justify-center gap-3 mt-3">
            <button
              type="submit"
              className="min-w-[100px] bg-[#5031D6] px-4 py-2 rounded-lg hover:bg-[#6a4ff7] transition-colors"
            >
              Save
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="min-w-[100px] bg-[#192231] hover:bg-[#2a3240] text-white px-5 py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
