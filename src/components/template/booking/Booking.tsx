"use client"

import React, { useState, useEffect } from 'react';
import { Clock, Search } from 'lucide-react';
import { toast } from "sonner";
import axios from 'axios';

interface Package {
  id: string;
  name: string;
  title?: string;
  price: string;
  duration: string;
  imageBase64: string;
}

interface FormData {
  name: string;
  email: string;
  dateTime: string;
  destination: string;
  pickup: string;
  persons: string;
  categories: string;
  needGuide: boolean;
  specialRequest: string;
}

interface BookingProps {
  selectedPackage?: Package | null;
}

const Booking: React.FC<BookingProps> = ({ selectedPackage = null }) => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPkg, setSelectedPkg] = useState<Package | null>(selectedPackage);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    dateTime: '',
    destination: '',
    pickup: '',
    persons: '1',
    categories: 'Kids',
    needGuide: false,
    specialRequest: ''
  });

  // Fetch packages
  const getPackages = async () => {
    try {
      const result = await axios.get('http://localhost:8000/packages/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('take-travel-token')}`
        }
      });

      const fetchedPackages = result.data?.data?.packages;
      if (Array.isArray(fetchedPackages)) {
        setPackages(fetchedPackages);
      } else {
        setPackages([]);
      }
    } catch (error) {
      toast.error("Failed to fetch packages");
      console.error("Error fetching packages:", error);
    }
  };

  useEffect(() => {
    getPackages();
  }, []);

  useEffect(() => {
    if (selectedPkg) {
      setFormData(prev => ({
        ...prev,
        destination: selectedPkg?.name || ''
      }));
    }
  }, [selectedPkg]);

  const filteredPackages = packages.filter(pkg => 
    pkg.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const bookNow = (e: React.FormEvent) => {
    e.preventDefault();
    toast("We received your booking request and will contact you soon");
  };

  return (
    <div className="container-fluid booking py-5">
      <div className="container max-w-7xl mx-auto py-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Section */}
          <div className="space-y-6">
            <div>
              <h5 className="font-bold text-2xl md:text-4xl text-orange-600">Find Your Package</h5>
              <div className="mt-4 relative">
                <input
                  type="text"
                  placeholder="Search for packages..."
                  className="w-full p-4 pr-12 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Package Search Results */}
            <div className="space-y-4 max-h-[600px] p-10 overflow-y-auto pr-2">
              {filteredPackages.map((pkg, index) => (
                <div 
                  key={index}
                  className={`rounded-2xl overflow-hidden shadow-lg bg-white cursor-pointer transition-all hover:shadow-xl transform hover:-translate-y-1 
                    ${selectedPkg?.id === pkg.id ? 'ring-4 ring-orange-600' : 'hover:ring-2 hover:ring-orange-400'}`}
                  onClick={() => setSelectedPkg(pkg)}
                >
                  <div className="flex">
                    <div className="w-32 h-32 p-2">
                      <img
                        src={pkg.imageBase64}
                        alt={pkg.title || pkg.name}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                    <div className="p-4 flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold text-gray-800">{pkg.name}</h3>
                        <span className="font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">{pkg.price}</span>
                      </div>
                      <div className="flex items-center text-gray-600 mt-2">
                        <Clock className="w-4 h-4" />
                        <span className="ml-2 text-sm">{pkg.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {filteredPackages.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  No packages found matching your search
                </div>
              )}
            </div>
          </div>

          {/* Right Section - Booking Form */}
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h1 className="text-black mb-3 text-2xl font-semibold">Book A Tour Deal</h1>
            <p className="text-black mb-6">
              Get <span className="text-[#43B97F] font-semibold">50% Off</span> on your first adventure trip
            </p>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Name Input */}
                <div className="flex flex-col-reverse">
                  <input
                    type="text"
                    className="p-4 rounded-xl bg-white border border-gray-400 focus:ring-2 focus:ring-[#43B97F] focus:border-[#43B97F]"
                    id="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                  <label htmlFor="name" className="text-lg mb-2">Your Name</label>
                </div>

                {/* Email Input */}
                <div className="flex flex-col-reverse">
                  <input
                    type="email"
                    className="p-4 rounded-xl bg-white border border-gray-400 focus:ring-2 focus:ring-[#43B97F]"
                    id="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                  <label htmlFor="email" className="text-lg mb-2">Your Email</label>
                </div>

                {/* Date & Time */}
                <div className="flex flex-col-reverse">
                  <input
                    type="datetime-local"
                    className="p-4 rounded-xl bg-white border border-gray-400 focus:ring-2 focus:ring-[#43B97F]"
                    id="datetime"
                    value={formData.dateTime}
                    onChange={(e) => setFormData({...formData, dateTime: e.target.value})}
                  />
                  <label htmlFor="datetime" className="text-lg mb-2">Date & Time</label>
                </div>

                {/* Selected Package (Destination) */}
                <div className="flex flex-col-reverse">
                  <input
                    type="text"
                    className="p-4 rounded-xl border border-gray-400 focus:ring-2 focus:ring-[#43B97F] bg-gray-50"
                    id="destination"
                    value={formData.destination}
                    readOnly
                    placeholder="Select a package first"
                  />
                  <label htmlFor="destination" className="text-lg mb-2">Selected Package</label>
                </div>

                {/* Pickup Location */}
                <div className="flex flex-col-reverse col-span-2">
                  <input
                    type="text"
                    className="p-4 rounded-xl bg-white border border-gray-400 focus:ring-2 focus:ring-[#43B97F]"
                    id="pickup"
                    placeholder="Enter your pickup location"
                    value={formData.pickup}
                    onChange={(e) => setFormData({...formData, pickup: e.target.value})}
                  />
                  <label htmlFor="pickup" className="text-lg mb-2">Pickup Location</label>
                </div>

                {/* Persons */}
                <div className="flex flex-col-reverse">
                  <select
                    className="p-4 rounded-xl bg-white border border-gray-400 focus:ring-2 focus:ring-[#43B97F]"
                    id="persons"
                    value={formData.persons}
                    onChange={(e) => setFormData({...formData, persons: e.target.value})}
                  >
                    {[1, 2, 3, 4, 5].map((num) => (
                      <option key={num} value={num}>
                        {num} Person{num > 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                  <label htmlFor="persons" className="text-lg mb-2">Persons</label>
                </div>

                {/* Categories */}
                <div className="flex flex-col-reverse">
                  <select
                    className="p-4 rounded-xl bg-white border border-gray-400 focus:ring-2 focus:ring-[#43B97F]"
                    id="categories"
                    value={formData.categories}
                    onChange={(e) => setFormData({...formData, categories: e.target.value})}
                  >
                    <option value="Kids">Kids</option>
                    <option value="Adults">Adults</option>
                    <option value="Family">Family</option>
                    <option value="Couple">Couple</option>
                  </select>
                  <label htmlFor="categories" className="text-lg mb-2">Categories</label>
                </div>

                {/* Guide Option */}
                <div className="flex items-center space-x-2 col-span-2">
                  <input
                    type="checkbox"
                    id="needGuide"
                    className="w-4 h-4 text-[#43B97F] rounded focus:ring-[#43B97F]"
                    checked={formData.needGuide}
                    onChange={(e) => setFormData({...formData, needGuide: e.target.checked})}
                  />
                  <label htmlFor="needGuide" className="text-lg">Need a Tour Guide?</label>
                </div>

                {/* Special Request */}
                <div className="flex flex-col-reverse col-span-2">
                  <textarea
                    className="p-4 rounded-xl bg-white border border-gray-400 focus:ring-2 focus:ring-[#43B97F]"
                    placeholder="Special Request"
                    id="specialRequest"
                    rows={4}
                    value={formData.specialRequest}
                    onChange={(e) => setFormData({...formData, specialRequest: e.target.value})}
                  ></textarea>
                  <label htmlFor="specialRequest" className="text-lg mb-2">Special Request</label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={bookNow}
                className="w-full bg-orange-600 text-white transition-all hover:ring-4 hover:ring-orange-400 hover:ring-opacity-50 font-medium rounded-3xl p-4 focus:outline-none text-lg"
              >
                Book Now
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;