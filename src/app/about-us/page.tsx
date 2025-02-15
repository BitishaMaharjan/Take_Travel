import React from 'react'
import {ASSETS} from '../../../public/Assets'
import WhyUs from '@/components/template/about/WhyUs'
import BestPlaces from '@/components/template/home/subhome/BestPlaces'
import LatestBlog from '@/components/template/home/subhome/LatestBlog'
import AboutTravelTrills from '@/components/template/about/AboutTravelTrills'
import Slider from '@/components/template/about/carosalAbout/AboutCarousal'
import HeroSection from '@/components/template/heroSection/HeroSection'
function page() {
  return (
    <div className=' pb-11'>
      <HeroSection image={ASSETS.blog_banner} title="About Us"  />
<AboutTravelTrills/>
<WhyUs/>

    </div>
  )
}

export default page
