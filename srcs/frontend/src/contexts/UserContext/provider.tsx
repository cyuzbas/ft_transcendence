import React, { createContext, useState, useEffect, Dispatch, SetStateAction, ReactNode, useContext } from "react";
import { Route, Routes, Navigate } from 'react-router-dom';
import axios from "axios";
import { Login } from "../../pages";
import Verify2fa from '../../pages/Verify2fa'

export type User = {
  userName: string;
  avatar: string;
  intraId: string;
  status: string;
  userRole?: string;
  isLogged: boolean;
  TwoFactorAuth: boolean;
  twoFactorCorrect: boolean;
};

export interface UserContextInterface {
  user: User;
  setUser: Dispatch<SetStateAction<User>>;
  clearUser: () => void;
}

const defaultState = {
  user: {
    userName: '',
    intraId: '',
    avatar: '',
    status: '',
    userRole: '',
    isLogged: false,
    TwoFactorAuth: false,
    twoFactorCorrect: false
  },
  setUser: (user: User) => { }
} as UserContextInterface;

export const UserContext = createContext<UserContextInterface>(defaultState);

export function useUser() {
  return useContext(UserContext);
}

type UserProviderProps = {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User>(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      return JSON.parse(storedUser);
    }
    return {
      userName: '',
      avatar: '',
      intraId: '',
      status: '',
      userRole: '',
      isLogged: false,
      TwoFactorAuth: false,
      twoFactorCorrect: false
    };
  });

  const clearUser = () => {
    setUser(defaultState.user);
    localStorage.removeItem('user');
  };


  useEffect(() => {
    if (user.isLogged) {
      return;
    }
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/auth/status', { withCredentials: true });
        const updatedUser = { ...response.data, twoFactorCorrect: false };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      } catch (error) {
        if (!window.location.pathname.match('/login')) {
          window.location.href = '/login';
        }
      }
    };
    fetchData();
  }, []);
  if(!user.isLogged){
    return (
      <Routes>
      <Route path='/login' element={<Login />} />
    </Routes>
    );
  }

  else {
    if(user.TwoFactorAuth && user.twoFactorCorrect == false){
      return(
        <UserContext.Provider value={{ user, setUser, clearUser }}>
          <Routes>
          <Route path='/verify2fa' element={<Verify2fa />} />
        </Routes>
        </UserContext.Provider>
      )
    }
    else{
    return (
      <UserContext.Provider value={{ user, setUser , clearUser}}>
        {children}
      </UserContext.Provider>
    );}
  }
}
