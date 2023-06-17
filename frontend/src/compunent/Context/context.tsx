import { createContext, useState, useEffect, Dispatch, SetStateAction, ReactNode } from "react";
import axios from 'axios';

export type User = {
  username: string;
  avatar: string;
  intraId: string;
  avatarSmall:string;
}

export interface UserContextInterface {
  user: User;
  setUser: Dispatch<SetStateAction<User>>;
}

const defaultState = {
  user: {
    username: '',
    intraId: '',
    avatar: '',
    avatarSmall: ''
  },
  setUser: (user: User) => {}
} as UserContextInterface;

export const UserContext = createContext(defaultState);

type UserProviderProps = {
  children: ReactNode;
}

export default function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User>({
    username: '',
    avatar: '',
    intraId: '',
    avatarSmall: ''
  });




  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}