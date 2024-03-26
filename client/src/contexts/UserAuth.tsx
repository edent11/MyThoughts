import { rejects } from 'assert';
import React, { createContext, useState, useContext } from 'react';
import useSWR, { mutate } from 'swr';

export interface User {
    username: string;
    avatar: string;
}

export interface LoginData {
    username: string;
    password: string;
}

export interface RegisterData {
    username: string;
    password: string;
    avatar: String;
}

interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
}

interface AuthContextType {
    isAuthenticated: () => boolean;
    getUser: () => User | null;
    login: (loginData: LoginData) => null | Promise<boolean | string>;
    register: (registerData: RegisterData) => null | Promise<boolean | string>;
    logout: () => void;

}

const initialAuthState: AuthState = {
    isAuthenticated: false,
    user: null,
};

interface Props {
    children: React.ReactNode;
}

const AuthContext = createContext<AuthContextType>({
    isAuthenticated: () => false,
    login: () => null,
    register: () => null,
    logout: () => { },
    getUser: () => null
});

export const useAuth = () => useContext(AuthContext);

const AuthProvider: React.FC<Props> = ({ children }) => {

    const [authState, setAuthState] = useState<AuthState>(initialAuthState);

    const login = (loginData: LoginData): Promise<string | boolean> => {

        return new Promise(async (resolve, reject) => {

            try {
                const response = await fetch('http://localhost:5000/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(loginData),
                });

                if (!response.ok) {

                    // Get the response message
                    const message = await response.text();
                    throw new Error(message);
                }

                await response.json().then(userDetails => {
                    setAuthState({
                        isAuthenticated: true,
                        user: { username: userDetails.username, avatar: userDetails.avatar },
                    });
                });
                // Invalidate the cache for the /api/user endpoint
                mutate('http://localhost:5000/auth/login');
                resolve(true);


            } catch (error: any) {
                console.error(error.message);
                reject(error.message);
            }
        })
    };

    const register = (registerData: RegisterData): Promise<string | boolean> => {

        return new Promise(async (resolve, reject) => {

            try {
                const response = await fetch('http://localhost:5000/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(registerData),
                });

                if (!response.ok) {

                    // Get the response message
                    const message = await response.text();
                    throw new Error(message);
                }

                await response.json().then(userDetails => {
                    setAuthState({
                        isAuthenticated: true,
                        user: { username: userDetails.username, avatar: userDetails.avatar },
                    });
                });
                // Invalidate the cache for the /api/user endpoint
                mutate('http://localhost:5000/auth/login');
                resolve(true);


            } catch (error: any) {
                console.error(error.message);
                reject(error.message);
            }
        })

    }



    const logout = (): void => {
        setAuthState({
            isAuthenticated: false,
            user: null,
        });
    };

    const getUser = (): User | null => {

        if (authState.user)
            return authState?.user;
        return null;
    };

    const isAuthenticated = (): boolean => {

        return authState.isAuthenticated;
    };




    return (

        <AuthContext.Provider value={{ isAuthenticated, login, register, logout, getUser }}>
            {children}
        </AuthContext.Provider>
    )
}


export default AuthProvider;