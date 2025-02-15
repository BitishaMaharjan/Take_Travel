"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ASSETS } from '../../../public/Assets';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';

const tours = [
    { src: ASSETS.itely, title: "Italy", cost: "$15k", trip: "28 days" },
    { src: ASSETS.thailand, title: "Thailand", cost: "$5k", trip: "8 days" },
    { src: ASSETS.south_africa, title: "South Africa", cost: "$20k", trip: "20 days" },
    { src: ASSETS.japan, title: "Japan", cost: "$25k", trip: "18 days" },
    { src: ASSETS.spain, title: "Spain", cost: "$10k", trip: "10 days" },
    { src: ASSETS.columbia, title: "Columbia", cost: "$15k", trip: "28 days" },
    { src: ASSETS.france, title: "France", cost: "$35k", trip: "28 days" },
    { src: ASSETS.indonesia, title: "Indonesia", cost: "$35k", trip: "38 days" },
    { src: ASSETS.canada, title: "Canada", cost: "$1k", trip: "2 days" },
    { src: ASSETS.india, title: "India", cost: "$5k", trip: "8 days" },
    { src: ASSETS.australia, title: "Australia", cost: "$1k", trip: "2 days" },
    { src: ASSETS.USA, title: "USA", cost: "$5k", trip: "18 days" },
    { src: ASSETS.brazil, title: "Brazil", cost: "$115k", trip: "28 days" },
    { src: ASSETS.mexico, title: "Mexico", cost: "$10k", trip: "18 days" },
    { src: ASSETS.china, title: "China", cost: "$35k", trip: "26 days" },
];

const ITEMS_PER_PAGE = 6;

const ExplorePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [duration, setDuration] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredTours = tours.filter(tour => {
    const matchesSearch = tour.title.toLowerCase().includes(searchQuery.toLowerCase());
    const cost = parseInt(tour.cost.replace(/[^0-9]/g, ''));
    const days = parseInt(tour.trip);
    
    const matchesPrice = !priceRange || 
      (priceRange === '0-5000' && cost <= 5000) ||
      (priceRange === '5000-15000' && cost > 5000 && cost <= 15000) ||
      (priceRange === '15000+' && cost > 15000);
      
    const matchesDuration = !duration ||
      (duration === 'short' && days <= 7) ||
      (duration === 'medium' && days > 7 && days <= 14) ||
      (duration === 'long' && days > 14);
      
    return matchesSearch && matchesPrice && matchesDuration;
  });

  const totalPages = Math.ceil(filteredTours.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedTours = filteredTours.slice(startIndex, startIndex + ITEMS_PER_PAGE);

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
          Showing {Math.min(startIndex + 1, filteredTours.length)} - {Math.min(startIndex + ITEMS_PER_PAGE, filteredTours.length)} of {filteredTours.length} tours
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {paginatedTours.map((tour, index) => (
            <div key={index} className="rounded-xl overflow-hidden shadow-lg bg-white hover:shadow-xl transition-shadow duration-300">
              <div className="relative">
                <img
                  src={tour.src}
                  alt={tour.title}
                  className="object-cover w-full h-56"
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold">{tour.title}</h3>
                  <span className="font-semibold text-green-600">{tour.cost}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span className="ml-2 text-sm">{tour.trip}</span>
                </div>
                <Link href={`/country-detail/${tour.title}`}>
                  <button className="mt-4 w-full bg-orange-600 text-white py-2 rounded-lg hover:ring-2 hover:ring-orange-400 transition">
                    More about {tour.title}
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {filteredTours.length > 0 && (
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
        {filteredTours.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No tours found matching your criteria
          </div>
        )}
      </div>
    </section>
  );
};

export default ExplorePage;