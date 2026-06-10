import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

interface UserData {
  uid: string;
  favorites?: string[];
  folders?: { id: string; name: string; wordIds: string[] }[];
}

export const UserManager = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const usersRef = collection(db, "users");
        const snapshot = await getDocs(usersRef);
        const userData = snapshot.docs.map((doc) => ({
          uid: doc.id,
          ...(doc.data() as any),
        }));
        setUsers(userData);
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="text-center p-8 bg-white rounded-lg shadow-sm">
        <p className="text-gray-600">Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 bg-red-50 text-red-700 rounded-lg shadow-sm">
        <p>
          <strong>Error:</strong> {error}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold text-gray-800">
          User Manager ({users.length})
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                User ID (UID)
              </th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                Favorites
              </th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                Folders
              </th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((user) => (
              <tr
                key={user.uid}
                className="hover:bg-blue-50/50 transition-colors group"
              >
                <td className="px-6 py-3 font-mono text-xs text-gray-700">
                  {user.uid}
                </td>
                <td className="px-6 py-3 text-gray-600">
                  {user.favorites?.length || 0}
                </td>
                <td className="px-6 py-3 text-gray-600">
                  {user.folders?.length || 0}
                </td>
                <td className="px-6 py-3 text-right">
                  <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};