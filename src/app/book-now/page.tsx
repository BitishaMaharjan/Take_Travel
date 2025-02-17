import React from 'react';
import { ASSETS } from '../../../public/Assets';
import Booking from '@/components/template/booking/Booking';
import HeroSection from '@/components/template/heroSection/HeroSection';

const BookingPage = ({ selectedPackage }:any) => {
  return (
    <div className="min-h-screen">
      
      <Booking selectedPackage={selectedPackage} />
    </div>
  );
};

export default BookingPage;