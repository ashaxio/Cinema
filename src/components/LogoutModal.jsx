import React from "react";

const LogoutModal = ({ onConfirm, onCancel }) => {
  return (
    <div
      className="fixed inset-0 backdrop-blur-sm bg-black/70 flex items-center justify-center z-50"
      onClick={onCancel}
    >
      <div
        className="relative text-white p-8 rounded-2xl w-full max-w-md shadow-lg"
        style={{
          backgroundColor: "var(--bg-navbar-main)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          className="text-2xl font-bold mb-4 text-center"
          style={{ color: "var(--text-color)" }}
        >
          Ви впевнені, що хочете вийти?
        </h2>
        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className="min-w-[120px] px-4 py-2 rounded-lg bg-[#5031D6] cursor-pointer hover:bg-[#6a4ff7] transition-colors"
          >
            Так
          </button>
          <button
            onClick={onCancel}
            className="min-w-[120px] px-4 py-2 rounded-lg cursor-pointer hover:bg-[#2a3240] transition-colors"
            style={{
              backgroundColor: "var(--bg-navbar-second)",
              color: "var(--text-color)",
            }}
          >
            Ні
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
