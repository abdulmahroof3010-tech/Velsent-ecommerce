import React from 'react'
import { Link } from 'react-router-dom'
import NavBar from '../components/layout/NavBar'
import MainSection from '../components/MainSection'
import BestSeller from '../components/BestSeller'
import NewArrivals from '../components/NewArrivals'

import Banner from '../components/Banner'

function Home() {
  return (
    <div className="scroll-smooth">
      

       <NavBar />
       <Banner />
       <MainSection />
       <BestSeller />
      <NewArrivals />
     
      
    </div>
  )
}

export default Home
