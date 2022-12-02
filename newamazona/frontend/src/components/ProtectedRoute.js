import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { Store } from '../Store';

export default function ProtectedRoute({ children }) {
  //Get state from store
  const { state } = useContext(Store);
  // Get userInfo from state
  const { userInfo } = state;
  return userInfo ? children : <Navigate to="/signin" />;
}
