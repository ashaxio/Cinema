import { useState, useEffect } from "react";
import closeIcon from "../assets/close.svg";
import toast from "react-hot-toast";

const ChangeUsernameModal = ({
  currentUsername,
  userId,
  onSuccess,
  onClose,
}) => {
  const [newUsername, setNewUsername] = useState(currentUsername);
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 10);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 200);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newUsername.trim()) {
      setError("Username is required.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/user/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, newUsername }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Username updated!");
        onSuccess(data.user);
        handleClose();
      } else {
        setError(data.error || "Error updating username.");
      }
    } catch {
      setError("Something went wrong.");
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
          className="absolute cursor-pointer top-4 right-4"
        >
          <img
            src={closeIcon}
            alt="Close"
            className="w-6 h-6 hover:scale-110 transition-transform"
          />
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center">Change Username</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={newUsername}
            onChange={(e) => {
              setNewUsername(e.target.value);
              setError("");
            }}
            placeholder="New username"
            className="w-full p-3 rounded-lg bg-[#192231] focus:outline-none focus:ring-2 focus:ring-[#5031D6]"
          />

          <div className="min-h-[20px] mb-1">
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>

          <div className="flex justify-center gap-3 mt-4">
            <button
              type="submit"
              className="min-w-[100px] bg-[#5031D6] hover:bg-[#6a4ff7] text-white px-5 py-2 rounded-lg transition-colors"
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

export default ChangeUsernameModal;
