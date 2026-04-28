
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function ProtectedAdminRoute({ children }) {
  const { user, role ,loading} = useAuth();

    if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

 

  if (role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedAdminRoute;