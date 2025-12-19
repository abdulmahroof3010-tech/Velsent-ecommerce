import React, { useEffect, useState } from 'react'
import { api } from '../Service/Axios'
function useFetch(url) {

const [datas,setDatas]=useState([])

useEffect(()=>{
      api.get(url)
      .then((res)=>setDatas(res.data))
},[url])


  return datas
}

export default useFetch