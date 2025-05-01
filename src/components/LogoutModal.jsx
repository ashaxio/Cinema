import React from "react";

const LogoutModal = ({ onConfirm, onCancel }) => {
  return (
    <div
      className="fixed inset-0 backdrop-blur-sm bg-black/40 flex items-center justify-center z-50"
      onClick={onCancel}
    >
      <div
        className="relative bg-[#0f1827] text-white p-8 rounded-2xl w-full max-w-md shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-4 text-center">
          Are you sure you want to log out?
        </h2>
        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className="min-w-[120px] px-4 py-2 rounded-lg bg-[#5031D6] cursor-pointer hover:bg-[#6a4ff7] transition-colors"
          >
            Yes
          </button>
          <button
            onClick={onCancel}
            className="min-w-[120px] px-4 py-2 rounded-lg bg-[#192231] cursor-pointer hover:bg-[#2a3240] transition-colors"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
