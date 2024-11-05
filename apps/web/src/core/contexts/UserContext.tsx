"use client";

import { createContext, useContext, PropsWithChildren } from "react";

interface IContext {
  userId: string;
}

export const UserContext = createContext<IContext>(null);

export const useUserContext = () => useContext(UserContext);

interface UserContextProps {
  userId: string;
}

export const UserContextProvider = ({
  userId,
  children,
}: PropsWithChildren<UserContextProps>) => {
  const value = { userId };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
