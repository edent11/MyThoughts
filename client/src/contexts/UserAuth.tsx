import React, { createContext, useState, useContext } from 'react';


export interface User {
    id: string;
    name: string;
    email: string;
}

interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
}

interface AuthContextType {
    authState: AuthState;
    getUserID: () => string | null;
    login: (user: User) => boolean;
    logout: () => void;
    getUserName: () => string | null;
}

const initialAuthState: AuthState = {
    isAuthenticated: false,
    user: null,
};

interface Props {
    children: React.ReactNode;
}

const AuthContext = createContext<AuthContextType>({
    authState: initialAuthState,
    login: () => false,
    logout: () => { },
    getUserName: () => null,
    getUserID: () => null,
});

export const useAuth = () => useContext(AuthContext);

const AuthProvider: React.FC<Props> = ({ children }) => {

    const [authState, setAuthState] = useState<AuthState>(initialAuthState);

    const login = (user: User) => {
        setAuthState({
            isAuthenticated: true,
            user: user,
        });
        return true;
    };

    const logout = () => {
        setAuthState({
            isAuthenticated: false,
            user: null,
        });
    };

    const getUserName = () => {

        if (authState.user)
            return authState?.user?.name;
        return null;
    };

    const getUserID = () => {

        if (authState.user)
            return authState?.user?.id;
        return null;

    };
    return (

        <AuthContext.Provider value={{ authState, login, logout, getUserName, getUserID }}>
            {children}
        </AuthContext.Provider>
    )
}


export default AuthProvider;