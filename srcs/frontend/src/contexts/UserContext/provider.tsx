import { createContext, useState, Dispatch, SetStateAction, ReactNode, useContext, useEffect } from "react";
import { UserRole } from "../ChatContext";
import axios from "axios";

export type User = {
  userName: string;
  avatar: string;
  intraId: string;
  status?: string,
  userRole?: string,

}

export interface UserContextInterface {
  user: User;
  setUser: Dispatch<SetStateAction<User>>;
}

const defaultState = {
  user: {
    userName: '',
    intraId: '',
    avatar: '',
    status: '',
    userRole: '',
  },
  setUser: (user: User) => {}
} as UserContextInterface;

export const UserContext = createContext(defaultState);

export function useUser() {
    return useContext(UserContext);
}

type UserProviderProps = {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User>({
    userName: 'unknown',
    avatar: '',
    intraId: '',
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}