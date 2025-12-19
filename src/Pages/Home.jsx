import React from 'react'
import { Link } from 'react-router-dom'
import NavBar from '../components/NavBar'
import MainSection from '../components/MainSection'
import Fragrance from '../components/Fragrances'
import Sauvage from '../components/Sauvage'
import DiorHomme from '../components/DiorHomme'
import Higher from '../components/Higher'
import Footer from '../components/Footer'
import Banner from '../components/Banner'

function Home() {
  return (
    <div className="scroll-smooth">
      

       <NavBar />
       <Banner />
       <MainSection />
       <Fragrance id="fragrance-section" />
      <Sauvage id="sauvage-section" />
      <DiorHomme id="dior-section" />
      <Higher id="higher-section" />
      <Footer />
    </div>
  )
}

export default Home
