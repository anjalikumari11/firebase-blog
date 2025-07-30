import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import UseGoogleLoginStore from '../../store/LoginGoogleStore';

const ProtectedAdmin = ({ children }) => {
  const { getUser } = UseGoogleLoginStore();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const u = getUser();
    setUser(u);
    setLoading(false);
  }, []);

  if (loading) return <div>Loading...</div>;

  return user ? children : <Navigate to="/adminLogin" />;
};

export default ProtectedAdmin;
