
"use client";

import React from 'react';
import { Calendar, Clock, MapPin, AlertCircle, CheckCircle, User } from 'lucide-react';

interface Package {
  _id: string;
  name: string;
  price: number;
  duration: number;
}

interface User {
  _id: string;
  name: string;
  email: string;
}

interface Booking {
  _id: string;
  createdAt: string;
  endDate: string;
  guideId: string;
  id: string;
  packageId: Package;
  startDate: string;
  status: string;
  totalPrice: number;
  updatedAt: string;
  userId: User;
}
interface BookingCardProps {
  booking: Booking;
  onViewDetails: (booking: Booking) => void;
}

interface BookingDetailsProps {
  booking: Booking;
  onClose: () => void;
}

interface BookingCardProps {
  booking: Booking;
  onViewDetails: (booking: Booking) => void;
}

export const BookingCard: React.FC<BookingCardProps> = ({ booking, onViewDetails }) => {
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative">
        <img
          src="/api/placeholder/400/200"
          alt={booking.packageId.name}
          className="w-full h-48 object-cover"
        />
        <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold mb-2">{booking.packageId.name}</h3>
            <p className="text-gray-600 text-sm mb-2">Booking ID: {booking.id}</p>
          </div>
          <span className="text-lg font-semibold text-orange-600">${booking.totalPrice}</span>
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
            <span className="text-sm">Duration: {booking.packageId.duration} days</span>
          </div>
          <div className="flex items-center text-gray-600">
            <User className="w-4 h-4 mr-2" />
            <span className="text-sm">Customer: {booking.userId.name}</span>
          </div>
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

export const BookingDetails: React.FC<BookingDetailsProps> = ({ booking, onClose }) => {
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
            <h3 className="text-2xl font-semibold">{booking.packageId.name}</h3>
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
              <span className="font-medium">{booking.id}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-600">Status</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                booking.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {booking.status === 'paid' ? 'Paid' : 'Payment Pending'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-600">Total Cost</span>
              <span className="font-medium text-orange-600">{booking.totalPrice}</span>
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
                  <span>{booking.userId.name} Traveler</span>
                </div>
              </div>
            </div>

            {booking.guideId && (
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Your Guide</h4>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div className="flex items-center">
                    <User className="w-5 h-5 mr-2 text-gray-600" />
                    <span className="font-medium">{booking.guideId}</span>
                  </div>
                  {/* <div className="space-y-2 text-sm text-gray-600">
                    <p>Languages: {booking.guide.languages.join(", ")}</p>
                    <p>{booking.guide.experience} years of experience</p>
                    <p>Contact: {booking.guide.contactNumber}</p>
                  </div> */}
                </div>
              </div>
            )}

            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">Itinerary Overview</h4>
              <ul className="space-y-2">
                {/* {booking.itinerary.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 mt-1 text-green-600" />
                    <span>{item}</span>
                  </li>
                ))} */}
              </ul>
            </div>

            {booking.status === 'upcoming' && (
              <div className="border-t pt-4">
                <div className="bg-blue-50 p-4 rounded-lg flex items-start">
                  <AlertCircle className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-800">
                    Your trip is coming up! Make sure to check your email for important travel documents and pre-departure information.
                    {booking.guideId && " Your guide will contact you 48 hours before the trip starts."}
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