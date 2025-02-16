import React from 'react'
import {ASSETS} from '../../../../public/Assets'
import PopularDestinations from '@/components/template/planner//PopularDestinations';

function page({params}:any) {
    const {slug} = params
    // console.log(slug)
    const formatCountryName = (slug:any) => {
      const decodedName = decodeURIComponent(slug);
      return decodedName
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
  };

  const formattedCountryName = formatCountryName(slug);
  return (
    <>
     <div
        className="h-[20vh] w-full flex  items-end "
        style={
          {
            backgroundImage:`url(${ASSETS.banner})`,
            backgroundSize:"cover",
            backgroundPosition:"center"
          }
        }
      >
      <h1
      data-aos="fade-down"
      className='text-2xl md:text-5xl capitalize text-white font-bold mb-8 ml-4'
      >{formattedCountryName ? formattedCountryName : ""}</h1>

      </div>
    <PopularDestinations destination={slug} />
    </>

  )
}

export default page
