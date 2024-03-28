import React, { useEffect } from 'react';
import { Outlet, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/UserAuth';


const PrivateRoute: React.FC = ({


}) => {

    const { isAuthenticated } = useAuth();

    return isAuthenticated() ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;