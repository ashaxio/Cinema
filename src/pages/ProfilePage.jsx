import { useContext, useState } from "react";
import { AuthContext } from "../components/AuthContext";
import Navbar from "../components/navbar";
import ChangeUsernameModal from "../components/ChangeUsernameModal";
import ChangePasswordModal from "../components/ChangePasswordModal";
import avatarIcon from "../assets/person.svg";

const ProfilePage = () => {
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
        <div className="bg-[#0f1827] text-white p-8 rounded-2xl shadow-2xl w-full max-w-xl transition-all duration-300">
          <div className="flex flex-col items-center mb-6">
            <img
              src={avatarIcon}
              alt="Avatar"
              className="w-24 h-24 rounded-full border-4 border-[#5031D6] mb-4"
            />
            <h1 className="text-3xl font-bold">My Profile</h1>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Username
              </label>
              <div className="flex justify-between items-center bg-[#192231] p-3 rounded-lg">
                <span className="text-lg">{user.username}</span>
                <button
                  onClick={() => setShowUsernameModal(true)}
                  className="text-sm text-blue-400 hover:underline"
                >
                  Change
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Email</label>
              <div className="bg-[#192231] p-3 rounded-lg text-lg">
                {user.email}
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Role</label>
              <div className="bg-[#192231] p-3 rounded-lg text-lg flex items-center gap-2">
                {user.role === "admin" ? "🛠️ Admin" : "👤 User"}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowPasswordModal(true)}
                className="text-sm text-blue-400 hover:underline"
              >
                Change Password
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
