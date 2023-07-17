import { createContext, useState, Dispatch, SetStateAction, ReactNode, useContext, useEffect } from "react";
import { UserRole } from "../ChatContext";
import axios from "axios";

export type User = {
  userName: string;
  avatar: string;
  intraId: string;
  status?: string,
  // userRole?: string,

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
    // userRole: '',
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
    status: '',
    // userRole: '',
  });



  useEffect(() => {
    const fetchData = async () => {
      try {
      const response = await axios.get('http://localhost:3001/auth/status', {withCredentials: true})
      console.log("onceden " + user.userName);
      setUser(response.data);
      console.log("sonrasinda  "+ user.userName + " asdasd " + JSON.stringify(response.data) + "    bundan sonra" + window.location.pathname);
      console.log(response.data.avatar + " asdasd")
      } catch (error) {
        if(!window.location.pathname.match('/login'))
          window.location.href = '/login'
      }
    };

    fetchData();
  }, []);





  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}