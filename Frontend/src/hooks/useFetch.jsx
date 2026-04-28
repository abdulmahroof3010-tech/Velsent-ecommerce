import React, { useEffect, useState } from 'react'
import { api } from '../Service/Axios'
function useFetch(url) {

const [datas,setDatas]=useState([]);
const [loading,setLoading]=useState(true);
const [error,setError]=useState(null)
const [totalPages,setTotalPages]=useState(1)

useEffect(()=>{
  const fetchData=async()=>{
          setLoading(true);       
      setError(null);       


    try{
      const res=await api.get(`/${url}`)

      if(res.data.Products){
      setDatas(res.data.Products);
      setTotalPages(res.data.totalPages)
      }else if(res.data.Product){
        setDatas(res.data.Product);
    }else if(res.data.UserData){
      setDatas(res.data.UserData)
    }else if(res.data.orderData){
      setDatas(res.data.orderData)
    }else{
        setDatas(res.data);
      }

    }catch(err){
      setError(err)
    }finally{
      setLoading(false)
    }
  }
  fetchData()
},[url])


  return {datas,error,loading,totalPages}
}

export default useFetch