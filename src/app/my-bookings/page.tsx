"use client";

import React, { useEffect, useState } from 'react';
import { Calendar, Clock, MapPin, AlertCircle, CheckCircle, User } from 'lucide-react';
import axios from 'axios';

interface Guide {
  name: string;
  languages: string[];
  experience: number;
  contactNumber: string;
}

interface Booking {
  id: number;
  destination: string;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'completed';
  cost: string;
  image: string;
  paymentStatus: 'paid' | 'pending';
  bookingReference: string;
  travelers: number;
  itinerary: string[];
  guide?: Guide;
}

interface BookingCardProps {
  booking: Booking;
  onViewDetails: (booking: Booking) => void;
}

interface BookingDetailsProps {
  booking: Booking;
  onClose: () => void;
}

const mockBookings: Booking[] = [
  {
    id: 1,
    destination: "Japan",
    startDate: "2025-03-15",
    endDate: "2025-04-02",
    status: "upcoming",
    cost: "$25,000",
    image: "/api/placeholder/400/300",
    paymentStatus: "paid",
    bookingReference: "JP25031501",
    travelers: 2,
    itinerary: [
      "Day 1-3: Tokyo Exploration",
      "Day 4-6: Kyoto Temples",
      "Day 7-8: Mount Fuji"
    ],
    guide: {
      name: "Tanaka Yuki",
      languages: ["English", "Japanese", "Mandarin"],
      experience: 8,
      contactNumber: "+81-XXX-XXXX-XXXX"
    }
  },
  {
    id: 2,
    destination: "Italy",
    startDate: "2025-06-10",
    endDate: "2025-07-08",
    status: "upcoming",
    cost: "$15,000",
    image: "/api/placeholder/400/300",
    paymentStatus: "pending",
    bookingReference: "IT25061002",
    travelers: 4,
    itinerary: [
      "Day 1-4: Rome",
      "Day 5-7: Florence",
      "Day 8-10: Venice"
    ],
    guide: {
      name: "Marco Rossi",
      languages: ["English", "Italian", "French"],
      experience: 12,
      contactNumber: "+39-XXX-XXX-XXXX"
    }
  },
  {
    id: 3,
    destination: "Thailand",
    startDate: "2024-12-01",
    endDate: "2024-12-08",
    status: "completed",
    cost: "$5,000",
    image: "/api/placeholder/400/300",
    paymentStatus: "paid",
    bookingReference: "TH24120103",
    travelers: 2,
    itinerary: [
      "Day 1-3: Bangkok",
      "Day 4-6: Phuket",
      "Day 7-8: Phi Phi Islands"
    ],
    guide: {
      name: "Somchai Phan",
      languages: ["English", "Thai"],
      experience: 5,
      contactNumber: "+66-XX-XXX-XXXX"
    }
  }
];

const BookingCard: React.FC<BookingCardProps> = ({ booking, onViewDetails }) => {
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative">
        <img
          src={booking.image}
          alt={booking.destination}
          className="w-full h-48 object-cover"
        />
        <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium ${
          booking.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {booking.paymentStatus === 'paid' ? 'Paid' : 'Payment Pending'}
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold mb-2">{booking.destination}</h3>
            <p className="text-gray-600 text-sm mb-2">Booking Ref: {booking.bookingReference}</p>
          </div>
          <span className="text-lg font-semibold text-orange-600">{booking.cost}</span>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            <span className="text-sm">
              {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
            </span>
          </div>
          <div className="flex items-center text-gray-600">
            <Clock className="w-4 h-4 mr-2" />
            <span className="text-sm">{booking.travelers} Travelers</span>
          </div>
          {booking.guide && (
            <div className="flex items-center text-gray-600">
              <User className="w-4 h-4 mr-2" />
              <span className="text-sm">Guide: {booking.guide.name}</span>
            </div>
          )}
        </div>

        <button
          onClick={() => onViewDetails(booking)}
          className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

const BookingDetails: React.FC<BookingDetailsProps> = ({ booking, onClose }) => {
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-2xl font-semibold">{booking.destination}</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Booking Reference</span>
              <span className="font-medium">{booking.bookingReference}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-600">Status</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                booking.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {booking.paymentStatus === 'paid' ? 'Paid' : 'Payment Pending'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-600">Total Cost</span>
              <span className="font-medium text-orange-600">{booking.cost}</span>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">Trip Details</h4>
              <div className="space-y-2">
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>
                    {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                  </span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>{booking.travelers} Travelers</span>
                </div>
              </div>
            </div>

            {booking.guide && (
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Your Guide</h4>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div className="flex items-center">
                    <User className="w-5 h-5 mr-2 text-gray-600" />
                    <span className="font-medium">{booking.guide.name}</span>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>Languages: {booking.guide.languages.join(", ")}</p>
                    <p>{booking.guide.experience} years of experience</p>
                    <p>Contact: {booking.guide.contactNumber}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">Itinerary Overview</h4>
              <ul className="space-y-2">
                {booking.itinerary.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 mt-1 text-green-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {booking.status === 'upcoming' && (
              <div className="border-t pt-4">
                <div className="bg-blue-50 p-4 rounded-lg flex items-start">
                  <AlertCircle className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-800">
                    Your trip is coming up! Make sure to check your email for important travel documents and pre-departure information.
                    {booking.guide && " Your guide will contact you 48 hours before the trip starts."}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const MyBookingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed'>('upcoming');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  useEffect(()=>{
    const getGuideBookings = async () => {
      try {
        const response = await axios.post(`http://localhost:8000/bookings/user-bookings`, 
          { userId:localStorage.getItem('take-travel-userId') }, 
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
    
        console.log('Bookings:', response.data.data.bookings);
        return response.data.data.bookings;
      } catch (error) {
        console.error('Error fetching guide bookings:');
        throw error;
      }
    };
    
    // Example Usage
    getGuideBookings();
  },[])
  const filteredBookings = mockBookings.filter(booking => booking.status === activeTab);

  return (
    <div className="max-w-7xl mx-auto py-12 px-6 lg:px-20">
      <h1 className="text-4xl font-bold mb-8">My Bookings</h1>

      <div className="flex space-x-4 mb-8 border-b">
        <button
          className={`pb-4 px-4 ${
            activeTab === 'upcoming'
              ? 'border-b-2 border-orange-600 text-orange-600 font-medium'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming Trips
        </button>
        <button
          className={`pb-4 px-4 ${
            activeTab === 'completed'
              ? 'border-b-2 border-orange-600 text-orange-600 font-medium'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('completed')}
        >
          Past Trips
        </button>
      </div>

      {filteredBookings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBookings.map(booking => (
            <BookingCard 
              key={booking.id} 
              booking={booking} 
              onViewDetails={setSelectedBooking}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No {activeTab} trips</h3>
          <p className="text-gray-500">
            {activeTab === 'upcoming'
              ? "You don't have any upcoming trips. Start planning your next adventure!"
              : "You haven't completed any trips yet. Your travel history will appear here."}
          </p>
        </div>
      )}

      {selectedBooking && (
        <BookingDetails
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      )}
    </div>
  );
};

export default MyBookingsPage;