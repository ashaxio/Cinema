import { useContext, useState } from "react";
import { AuthContext } from "../components/AuthContext";
import { useTheme } from "../components/ThemeContext";
import Navbar from "../components/navbar";
import ChangeUsernameModal from "../components/ChangeUsernameModal";
import ChangePasswordModal from "../components/ChangePasswordModal";
import avatarIcon from "../assets/person.svg";
import avatarIconDark from "../assets/person-dark.svg";

const ProfilePage = () => {
  const { isDarkMode } = useTheme();
  const { user, login } = useContext(AuthContext);
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  if (!user) {
    return (
      <Navbar>
        <div className="text-white p-6">Loading user data...</div>
      </Navbar>
    );
  }

  return (
    <Navbar>
      <div className="flex justify-center items-center p-8">
        <div className="bg-[var(--bg-navbar-main)] text-[var(--text-color)] p-8 rounded-2xl shadow-2xl w-full max-w-xl transition-all duration-300">
          <div className="flex flex-col items-center mb-6">
            <img
              src={isDarkMode ? avatarIcon : avatarIconDark}
              alt="Avatar"
              className="w-24 h-24 rounded-full border-4 border-[var(--color-accent)] mb-4"
            />
            <h1 className="text-3xl font-bold">Мій профіль</h1>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm text-[var(--text-color)] mb-1">
                Ім'я користувача
              </label>
              <div className="flex justify-between items-center bg-[var(--bg-navbar-second)] p-3 rounded-lg">
                <span className="text-lg">{user.username}</span>
                <button
                  onClick={() => setShowUsernameModal(true)}
                  className={`text-sm ${
                    isDarkMode ? "text-blue-400" : "text-blue-600"
                  } hover:underline`}
                >
                  Змінити
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm text-[var(--text-color)] mb-1">
                Email
              </label>
              <div className="bg-[var(--bg-navbar-second)] p-3 rounded-lg text-lg">
                {user.email}
              </div>
            </div>

            <div>
              <label className="block text-sm text-[var(--text-color)] mb-1">
                Роль
              </label>
              <div className="bg-[var(--bg-navbar-second)] p-3 rounded-lg text-lg flex items-center gap-2">
                {user.role === "admin" ? "🛠️ Адміністратор" : "👤 Користувач"}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowPasswordModal(true)}
                className={`text-sm ${
                  isDarkMode ? "text-blue-400" : "text-blue-600"
                } hover:underline`}
              >
                Змінити пароль
              </button>
            </div>
          </div>
        </div>
      </div>

      {showUsernameModal && (
        <ChangeUsernameModal
          currentUsername={user.username}
          userId={user.id}
          onSuccess={(updatedUser) => login(updatedUser)}
          onClose={() => setShowUsernameModal(false)}
        />
      )}
      {showPasswordModal && (
        <ChangePasswordModal
          userId={user.id}
          onClose={() => setShowPasswordModal(false)}
        />
      )}
    </Navbar>
  );
};

export default ProfilePage;
