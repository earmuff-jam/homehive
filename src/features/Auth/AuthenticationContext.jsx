import { createContext, useContext } from "react";

// AuthContext ...
// defines the app level authentication context
export const AuthContext = createContext({
  user: null,
  loading: true,
});

// useAuth ...
// defines a function that reads context of the current app
export const useAuth = () => {
  return useContext(AuthContext);
};
