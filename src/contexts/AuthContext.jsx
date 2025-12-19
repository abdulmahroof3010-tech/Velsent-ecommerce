
import React, { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../Service/Axios';

export const AuthContext = createContext();

function AuthProvider({children}) {
    const [user, setUser] = useState(null)
    const [role, setRole] = useState('user') // 'user' or 'admin'

    useEffect(() => {
        const storedUser = localStorage.getItem("user")
        const storedRole = localStorage.getItem("userRole")
        if (storedUser) {
            setUser(JSON.parse(storedUser))
            setRole(storedRole || 'user')
        }
    }, [])

    // Check if user is admin
    const isAdmin = () => {
        return role === 'admin'
    }

    // Register user
    const registerUser = async(userData) => {
        return api.post("/users", userData)
    }

    // Login user - Updated to check for admin role
    const loginUser = async(email, password) => {
        const response = await api.get(`/users?email=${email}&password=${password}`);
        
        if (response.data.length > 0) {
            const loggedUser = response.data[0]
            setUser(loggedUser)
            
            // Check if user is admin (you can add admin flag to user object)
            // For now, I'll check if email contains 'admin' or use specific admin emails
            const isAdminUser = email === 'admin@gmail.com' || loggedUser.isAdmin === true
            const userRole = isAdminUser ? 'admin' : 'user'
            
            setRole(userRole)
            localStorage.setItem("user", JSON.stringify(loggedUser))
            localStorage.setItem("userRole", userRole)
            
            return { success: true, role: userRole }
        }
        return { success: false }
    }

    // Logout user
    const logoutUser = () => {
        setUser(null)
        setRole('user')
        localStorage.removeItem("user");
        localStorage.removeItem("userRole");
    }

    // Update user role (for setting admin users)
    const updateUserRole = async(userId, newRole) => {
        try {
            const response = await api.patch(`/users/${userId}`, { role: newRole })
            return response.data
        } catch (error) {
            console.error("Error updating user role:", error)
            throw error
        }
    }

    return (
        <AuthContext.Provider value={{
            user,
            role,
            loginUser,
            registerUser,
            logoutUser,
            isAdmin,
            updateUserRole
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
export default AuthProvider