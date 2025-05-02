import Navbar from "../components/navbar";
import { useContext } from "react";
import { AuthContext } from "../components/AuthContext";

const ProfilePage = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return (
      <Navbar>
        <div className="text-white p-6">Loading user data...</div>
      </Navbar>
    );
  }

  const username = user.username || "Not specified";
  const email = user.email || "Not specified";

  return (
    <Navbar>
      <div className="text-white p-6 max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Favorites Page</h1>

        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <div className="mb-4">
            <label className="block text-gray-400 text-sm mb-1">Username</label>
            <div className="text-xl font-medium">{username}</div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-400 text-sm mb-1">Email</label>
            <div className="text-xl font-medium">{email}</div>
          </div>
        </div>
      </div>
    </Navbar>
  );
};

export default ProfilePage;
