import { useTheme } from "./ThemeContext";

const LogoutModal = ({ onConfirm, onCancel }) => {
  const { isDarkMode } = useTheme();
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
            className={`cursor-pointer min-w-[120px] bg-[var(--bg-navbar-second)] text-[var(--text-color)] px-5 py-2 rounded-lg transition-colors
              ${isDarkMode ? "hover:bg-[#2a3240]" : "hover:bg-[#e2e8f0]"}`}
          >
            Ні
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
