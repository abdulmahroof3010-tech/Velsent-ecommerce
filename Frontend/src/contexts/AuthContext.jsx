
import React, { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../Service/Axios';

export const AuthContext = createContext();

function AuthProvider({children}) {
    const [user, setUser] = useState(null)
    const [role, setRole] = useState('user') // 'user' or 'admin'
    const [loading,setLoading]=useState(true)

    useEffect(() => {
       const fetchUser=async()=>{
        try{
            const res=await api.get("/auth/getUser");
            setUser(res.data.UserData);
            setRole(res.data.UserData.role)
        }catch(e){
             console.log("User fetch failed, maybe refreshing...");
        }finally{
            setLoading(false)
        }
       };
      
       fetchUser();
      
    }, [])

    // Check if user is admin
    const isAdmin = () => {
        return role === 'admin'
    }

    // Register user
    const registerUser = async(userData) => {
        try{
        const response=await api.post("/auth/register", userData);
         
        return {success:true,message:response.data.message}
        }catch(e){
            return {success:false,message:e.response?.data?.message || "Register failed"}

        }
    }


    const verifyOtp=async(email,otp)=>{
        try{
            const response=await api.post("/auth/verify-otp",{email,otp});
           const userData={
            name:response.data.name,
             email: response.data.email,
            role: response.data.role,
           }

            setUser(userData);
            setRole(userData.role);
           
            return{ success:true,message:response.data.message};
        }catch(e){
            return {success:false,message:e.response?.data?.message};
        }
    }


    const resendOtp=async(email)=>{
        try{
            const response=await api.post("/auth/resend-otp",{email});

            return{
                success:true,
                message:response.data.message
            };


        }catch(e){

            return {
                success:false,message:e.response?.data?.message
            }

        }
    }
    // Login user - Updated to check for admin role
    const loginUser = async(email, password) => {
        try{
         const res= await api.post("/auth/login",{email,password});

         const userData={
            name:res.data.name,
            email:res.data.email,
            role:res.data.role
         }

         console.log(userData)
         setUser(userData)
           
         setRole(userData.role)
         return { success: true, role:userData.role}
        }catch(e){
            return { success: false,message :e.response?.data?.message }
        }
    }
    
    
    // Logout user
    const logoutUser = async() => {
        try{
            await api.post("/auth/logout");
            
            setUser(null)
            setRole('user')
        }catch(e){
            console.log("Logout error:",e)
        }
        
    }

    return (
        <AuthContext.Provider value={{
            user,
            setUser,
            role,
            
            loginUser,
            registerUser,
            verifyOtp,
            resendOtp,
            logoutUser,
            isAdmin,
            loading,
           
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
export default AuthProvider