    import axios from "axios";
    import { toast } from "react-toastify";

    export const api=axios.create({
        baseURL: "http://localhost:3005/api",
        withCredentials:true
    })


    let isRedirecting = false;

    api.interceptors.response.use((response)=>
        response,

        async(error)=>{
            const originalRequest=error.config;

            if (error.response?.status === 403  &&!originalRequest.url.includes("/auth/getUser")  && !error.config.url.includes("/auth/login")  &&  !isRedirecting ) {
                isRedirecting = true;
     toast.error("Access denied. Please try again later.");

      try {
        await api.post("/auth/logout");
      } catch (e) {}

      window.location.href = "/login";

      return Promise.reject(error);
    }

      if(error.response?.status ===401 &&  !originalRequest._retry &&
      !originalRequest.url.includes("/auth/login") &&
      !originalRequest.url.includes("/auth/register") &&

      !originalRequest.url.includes("/auth/refresh")){
                originalRequest._retry=true;

                try{
                    await api.post("/auth/refresh");

                    return api(originalRequest);
                }catch(err){
                    
                    return Promise.reject(err);

                }
            }

            return Promise.reject(error)
        }

)