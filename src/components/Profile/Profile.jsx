import { useContext, useState } from "react";
import { account, databases, DATABASE_ID, USERS_COLLECTION_ID } from "../../appwriteConfig";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Profile = () => {
  const { user, userDoc, setUserDoc, updateUserProfile, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    phone: userDoc?.phone || "",
    address: userDoc?.address || "",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const updatedDoc = await databases.updateDocument(DATABASE_ID, USERS_COLLECTION_ID, user.$id, formData);
      setUserDoc(updatedDoc);
      updateUserProfile();
      setEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await account.deleteSession("current");
      navigate("/");
      window.location.reload(); // Ensure full reset
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  if (loading) {
    return <div className="text-center mt-10 text-lg">Loading profile...</div>;
  }

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-center mb-6">My Profile</h2>
      {userDoc ? (
        <>
          <p className="text-xl"><strong>Name:</strong> {userDoc.name}</p>
          <p className="text-xl"><strong>Email:</strong> {userDoc.email}</p>
          {editing ? (
            <>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="border p-2 w-full mb-2"
              />
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="border p-2 w-full"
              />
              <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded mt-4">Save</button>
            </>
          ) : (
            <>
              <p className="text-xl"><strong>Phone:</strong> {userDoc.phone || "Not set"}</p>
              <p className="text-xl"><strong>Address:</strong> {userDoc.address || "Not set"}</p>
              <button onClick={() => setEditing(true)} className="bg-yellow-500 text-white px-4 py-2 rounded mt-4">Edit</button>
            </>
          )}
          <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded mt-4">Logout</button>
        </>
      ) : (
        <p className="text-red-500 text-center">User data not found.</p>
      )}
    </div>
  );
};

export default Profile;
