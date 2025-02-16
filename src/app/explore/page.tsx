"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { ASSETS } from '../../../public/Assets';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { toast } from 'sonner';

const ITEMS_PER_PAGE = 6;

const ExplorePage = () => {
  const [searchQuery, setSearchQuery] = useState(""); // Initialize as an empty string or another default value

  const [priceRange, setPriceRange] = useState('');
  const [duration, setDuration] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [packages, setPackages] = useState<any[]>([]);  // State for holding fetched packages

  // Fetching packages from the API
  const getPackage = async () => {
    try {
      const result = await axios.get('http://localhost:8000/packages/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('take-travel-token')}`
        }
      });

      console.log("Fetched Packages:", result.data); // Debugging API response

      const fetchedPackages = result.data?.data?.packages; // Extract nested packages

      if (Array.isArray(fetchedPackages)) {
        setPackages(fetchedPackages); // Ensure correct state update
      } else {
        console.error("Expected an array but got:", fetchedPackages);
        setPackages([]); // Avoid breaking the .map()
      }
    } catch (error) {
      toast.error("Failed to fetch packages");
      console.error("Error fetching packages:", error);
    }
  };

  useEffect(() => {
    getPackage(); // Call the function when the component mounts
  }, []);


  console.log(packages);
  // const filteredPackages = packages.filter(pkg => {
  //   const matchesSearch = searchQuery ? pkg.name?.toLowerCase().includes(searchQuery.toLowerCase()) : true;
  
  //   const cost = pkg.price ? parseInt(pkg.price.replace(/[^0-9]/g, '')) : 0;
  //   const days = pkg.duration ? parseInt(pkg.duration) : 0;
  
  //   const matchesPrice = !priceRange || 
  //     (priceRange === '0-5000' && cost <= 5000) ||
  //     (priceRange === '5000-15000' && cost > 5000 && cost <= 15000) ||
  //     (priceRange === '15000+' && cost > 15000);
  
  //   console.log('Checking Price Range:', matchesPrice, cost, priceRange);
  
  //   const matchesDuration = !duration ||
  //     (duration === 'short' && days <= 7) ||
  //     (duration === 'medium' && days > 7 && days <= 14) ||
  //     (duration === 'long' && days > 14);
  
  //   console.log('Checking Duration:', matchesDuration, days, duration);
  
  //   return matchesSearch && matchesPrice && matchesDuration;
  // });
  const filteredPackages = packages.filter(pkg => {
    const matchesSearch = searchQuery
      ? pkg.name?.toLowerCase().includes(searchQuery.toLowerCase()) 
      : true;
    
    // Debugging search query matching
    console.log('Searching for:', searchQuery, 'in:', pkg.title, 'Match:', matchesSearch);
  
    // Assuming cost and trip are in string format and need cleaning for filtering
    const cost = pkg.cost ? parseInt(pkg.cost.replace(/[^0-9]/g, '')) : 0;
    const days = pkg.trip ? parseInt(pkg.trip.replace(/[^0-9]/g, '')) : 0;
  
    const matchesPrice = !priceRange || 
      (priceRange === '0-5000' && cost <= 5000) ||
      (priceRange === '5000-15000' && cost > 5000 && cost <= 15000) ||
      (priceRange === '15000+' && cost > 15000);
    
    console.log('Checking Price Range:', matchesPrice, cost, priceRange);
  
    const matchesDuration = !duration ||
      (duration === 'short' && days <= 7) ||
      (duration === 'medium' && days > 7 && days <= 14) ||
      (duration === 'long' && days > 14);
    
    console.log('Checking Duration:', matchesDuration, days, duration);
  
    return matchesSearch && matchesPrice && matchesDuration;
  });
  
  console.log('Filtered Packages:', filteredPackages);
  
  

  
  const totalPages = Math.ceil(filteredPackages.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedPackages = filteredPackages.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page: any) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-12 px-6 lg:px-20">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-10">Explore Packages</h2>
        
        {/* Search and Filter Section */}
        <div className="mb-8 flex flex-wrap gap-4">
          <div className="flex-1 min-w-[300px]">
            <input
              type="text"
              placeholder="Search destinations..."
              className="w-full p-3 border rounded-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select 
            className="p-3 border rounded-lg"
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
          >
            <option value="">Price Range</option>
            <option value="0-5000">$0 - $5k</option>
            <option value="5000-15000">$5k - $15k</option>
            <option value="15000+">$15k+</option>
          </select>
          <select 
            className="p-3 border rounded-lg"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          >
            <option value="">Duration</option>
            <option value="short">1-7 days</option>
            <option value="medium">8-14 days</option>
            <option value="long">15+ days</option>
          </select>
        </div>

        {/* Results Count */}
        <div className="mb-4 text-gray-600">
          Showing {Math.min(startIndex + 1, filteredPackages.length)} - {Math.min(startIndex + ITEMS_PER_PAGE, filteredPackages.length)} of {filteredPackages.length} packages
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {paginatedPackages.map((pkg, index) => (
            <div key={index} className="rounded-xl overflow-hidden shadow-lg bg-white hover:shadow-xl transition-shadow duration-300">
              <div className="relative">
                <img
                  src={pkg.imageBase64}
                  alt={pkg.title}
                  className="object-cover w-full h-56"
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold">{pkg.name}</h3>
                  <span className="font-semibold text-green-600">{pkg.price}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span className="ml-2 text-sm">{pkg.duration}</span>
                </div>
                <Link href={`/country-detail/${pkg.name}`}>
                  <button className="mt-4 w-full bg-orange-600 text-white py-2 rounded-lg hover:ring-2 hover:ring-orange-400 transition">
                    More about {pkg.name}
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {filteredPackages.length > 0 && (
          <div className="mt-8 flex justify-center items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border enabled:hover:bg-gray-100 disabled:opacity-50"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`w-10 h-10 rounded-lg border ${
                  currentPage === index + 1
                    ? 'bg-orange-600 text-white'
                    : 'hover:bg-gray-100'
                }`}
              >
                {index + 1}
              </button>
            ))}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border enabled:hover:bg-gray-100 disabled:opacity-50"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* No Results Message */}
        {filteredPackages.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No packages found matching your criteria
          </div>
        )}
      </div>
    </section>
  );
};

export default ExplorePage;
