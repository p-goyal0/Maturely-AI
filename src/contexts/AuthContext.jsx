import { createContext, useContext, useState, useEffect } from "react";
import usersConfig from "../config/users.json";

const AuthContext = createContext(null);

// Get initial users from config file
const initialUsers = usersConfig.users || [];

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState(() => {
    // Combine users from JSON config and localStorage
    const savedUsers = localStorage.getItem("registeredUsers");
    let localUsers = [];
    
    if (savedUsers) {
      try {
        localUsers = JSON.parse(savedUsers);
      } catch (e) {
        localUsers = [];
      }
    }
    
    // Merge initial users from JSON with locally registered users
    // Remove duplicates by username
    const allUsers = [...initialUsers];
    localUsers.forEach(localUser => {
      if (!allUsers.find(user => user.username === localUser.username)) {
        allUsers.push(localUser);
      }
    });
    
    return allUsers;
  });

  // Check if user is authenticated on mount (from localStorage)
  useEffect(() => {
    const savedAuth = localStorage.getItem("isAuthenticated");
    const savedUser = localStorage.getItem("currentUser");
    if (savedAuth === "true" && savedUser) {
      setIsAuthenticated(true);
      setCurrentUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  // Save only newly registered users to localStorage (not the initial ones from JSON)
  useEffect(() => {
    const newUsers = users.filter(user => 
      !initialUsers.find(initialUser => initialUser.username === user.username)
    );
    localStorage.setItem("registeredUsers", JSON.stringify(newUsers));
  }, [users]);

  const signIn = (username, password) => {
    // Check if user exists and password matches
    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      setIsAuthenticated(true);
      setCurrentUser({ username: user.username });
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("currentUser", JSON.stringify({ username: user.username }));
      return { success: true };
    } else {
      return { success: false, error: "Invalid username or password" };
    }
  };

  const signUp = (username, password) => {
    // Check if username already exists (in both JSON config and localStorage)
    const userExists = users.find((u) => u.username === username);
    
    if (userExists) {
      return { success: false, error: "Username already exists" };
    }

    // Add new user
    const newUser = { username, password, registeredAt: new Date().toISOString() };
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);

    // Auto sign in after sign up
    setIsAuthenticated(true);
    setCurrentUser({ username });
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("currentUser", JSON.stringify({ username }));
    
    console.log(`✅ New user registered: ${username}`);
    console.log(`📝 Total users: ${updatedUsers.length}`);
    console.log(`💾 Saved to localStorage as 'registeredUsers'`);
    
    return { success: true };
  };

  const signOut = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("currentUser");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        currentUser,
        isLoading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

