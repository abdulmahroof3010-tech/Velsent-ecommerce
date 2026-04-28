import React, { useState,useEffect } from "react";
import {
  EnvelopeIcon,
  UserIcon,
  LockClosedIcon,
  LockOpenIcon,
} from "@heroicons/react/24/outline";
import useFetch from "../../hooks/useFetch";
import { api } from "../../Service/Axios";
import { toast } from "react-toastify";

function Users() {
  const { datas: users, loading } = useFetch("admin/usersList");
  const [userList, setUserList] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setUserList(users);
  }, [users]);

  // Filter users based on search
  const filteredUsers = userList.filter((user) => {
    if (user.role === "Admin") return false;
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      (user.name?.toLowerCase() || "").includes(searchLower) ||
      (user.email?.toLowerCase() || "").includes(searchLower)
    );
  });

  const handleBlockUser = async (userId, currentStatus, userName) => {
    const action = !currentStatus ? "block" : "unblock";

    if (window.confirm(`Are you sure you want to ${action} ${userName}?`)) {
      try {
        await api.patch(`admin/blockOrUnblock/${userId}`);
        setUserList((prev) =>
          prev.map((user) =>
            user._id === userId
              ? { ...user, isBlocked: !user.isBlocked }
              : user,
          ),
        );
        toast.success(`User ${action}ed successfully`);
      } catch (error) {
        toast.warn(`Error ${action}ing user`);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-500">Loading users...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Users</h1>
        <p className="text-gray-600 mt-2">
          Manage registered users and their status
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Search users by name or email..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="ml-4 text-sm text-gray-500">
            {filteredUsers.length} users found
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cart Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Wishlist Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => {
                const displayName = user.name?.trim() || "Unknown";
                return (
                  <tr
                    key={user._id}
                    className={`hover:bg-gray-50 ${user.isBlocked ? "bg-red-50" : ""}`}
                  >
                    {/* User Info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <UserIcon className="w-5 h-5 text-gray-600" />
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">
                            {displayName}
                          </div>
                          <div className="flex items-center mt-1">
                            <EnvelopeIcon className="w-3 h-3 text-gray-400 mr-1" />
                            <span className="text-sm text-gray-500">
                              {user.email}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        User
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      {user.isBlocked ? (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 flex items-center w-fit">
                          <LockClosedIcon className="w-3 h-3 mr-1" />
                          Blocked
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 flex items-center w-fit">
                          <LockOpenIcon className="w-3 h-3 mr-1" />
                          Active
                        </span>
                      )}
                    </td>

                    {/* Cart Items */}
                    <td className="px-6 py-4">
                      <div className="text-center">
                        <span
                          className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
                            user.cartCount > 0
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {user.cartCount || 0}
                        </span>
                      </div>
                    </td>

                    {/* Wishlist Items */}
                    <td className="px-6 py-4">
                      <div className="text-center">
                        <span
                          className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
                            user.wishlistCount > 0
                              ? "bg-pink-100 text-pink-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {user.wishlistCount || 0}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                     
                          <button
                            onClick={() =>
                              handleBlockUser(
                                user._id,
                                user.isBlocked,
                                displayName,
                              )
                            }
                            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center ${
                              user.isBlocked
                                ? "bg-green-600 text-white hover:bg-green-700"
                                : "bg-red-600 text-white hover:bg-red-700"
                            }`}
                          >
                            {user.isBlocked ? (
                              <>
                                <LockOpenIcon className="w-4 h-4 mr-1" />
                                Unblock
                              </>
                            ) : (
                              <>
                                <LockClosedIcon className="w-4 h-4 mr-1" />
                                Block
                              </>
                            )}
                          </button>
                      
                    
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
             Showing {filteredUsers.length} of {userList.filter(u => u.role !== 'Admin').length} users
            </div>
            <div className="text-sm text-gray-500">
              {filteredUsers.filter((u) => u.isBlocked).length} blocked users
            </div>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <UserIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No users found
          </h3>
          <p className="text-gray-600">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );
}

export default Users;
