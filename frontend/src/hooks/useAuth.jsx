import { useState, createContext, useContext } from "react";
import { authService } from "@/services/authService";
const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const userData = await authService.getCurrentUser();
//         setUser(userData);
//       } catch (error) {
//         console.error("Failed to fetch user:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUser();
//   }, []);

    const login = async (credentials) => {
      try {
        const userData = await authService.login(credentials.email, credentials.password);
        // you should assign it is profile but for now we will just set the user data
        setUser(userData);
        setIsAuthenticated(true);
        setIsLoading(false);
        return {
          success: true,
          data: userData,
        }
      } catch (error) {
        console.error("Login failed:", error?.message);
        return {
          success: false,
          error: error?.message || "Login failed",
        };
      }
    };
    const register = async (credentials) => {
      try {
        const userData = await authService.register(credentials.email, credentials.password);
        setUser(userData);
        setIsAuthenticated(true);
        setIsLoading(false);
        return {
          success: true,
          data: userData,
        };
      } catch (error) {
        console.error("Registration failed:", error?.message);
        return {
          success: false,
          error: error?.message || "Registration failed",
        };
      }
    };

    const value = {
      user,
      login,
      register,
      isAuthenticated,
      isLoading,
    };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};