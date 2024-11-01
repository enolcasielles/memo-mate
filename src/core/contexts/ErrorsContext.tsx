"use client";

import { useCallback, useState, createContext, useContext } from "react";

interface ErrorContextProps {
  isShowing: boolean;
  error: string;
  showError: (error: Error) => void;
  hideError: () => void;
}

export const ErrorsContext = createContext<ErrorContextProps>(null);

export const useErrorsContext = () => useContext(ErrorsContext);

export const ErrorsContextProvider = ({ children }: any) => {
  const [isShowing, setIsShowing] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const showError = useCallback((error: Error) => {
    setError(error.message);
    setIsShowing(true);
  }, []);

  const hideError = useCallback(() => {
    setError(null);
    setIsShowing(false);
  }, []);

  const value = { isShowing, error, showError, hideError };

  return (
    <ErrorsContext.Provider value={value}>{children}</ErrorsContext.Provider>
  );
};
