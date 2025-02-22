// "use client"
// import React, { useEffect, useState } from 'react';
// import { Calendar, Clock, MapPin, AlertCircle, User, Phone, Mail, Globe2, Users, PieChart as PieChartIcon } from 'lucide-react';
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   LineChart,
//   Line,
//   BarChart,
//   Bar,
//   PieChart,
//   Pie,
//   Cell,
//   XAxis,
//   YAxis,
//   Tooltip,
//   Legend,
//   ResponsiveContainer
// } from 'recharts';
// import { BookingCard } from '@/components/cards/BookingCard';
// import axios from 'axios';

// // Previous interfaces remain the same...

// // New analytics data
// const monthlyTours = [
//   { month: 'Jan', tours: 4 },
//   { month: 'Feb', tours: 3 },
//   { month: 'Mar', tours: 5 },
//   { month: 'Apr', tours: 4 },
//   { month: 'May', tours: 6 },
//   { month: 'Jun', tours: 8 }
// ];

// const languageDistribution = [
//   { name: 'English', value: 45 },
//   { name: 'Japanese', value: 30 },
//   { name: 'Mandarin', value: 15 },
//   { name: 'Spanish', value: 10 }
// ];

// const tourTypes = [
//   { name: 'Cultural', value: 40 },
//   { name: 'Adventure', value: 25 },
//   { name: 'Food & Drink', value: 20 },
//   { name: 'Nature', value: 15 }
// ];

// const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// const AnalyticsDashboard: React.FC = () => {
//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
//       {/* Quick Stats */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Quick Stats</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             <div className="flex justify-between items-center">
//               <span className="text-gray-600">Tours This Month</span>
//               <span className="text-2xl font-bold">8</span>
//             </div>
//             <div className="flex justify-between items-center">
//               <span className="text-gray-600">Upcoming Tours</span>
//               <span className="text-2xl font-bold">5</span>
//             </div>
//             <div className="flex justify-between items-center">
//               <span className="text-gray-600">Total Travelers</span>
//               <span className="text-2xl font-bold">24</span>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Monthly Tours Chart */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Tours per Month</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="h-[200px]">
//             <ResponsiveContainer width="100%" height="100%">
//               <LineChart data={monthlyTours}>
//                 <XAxis dataKey="month" />
//                 <YAxis />
//                 <Tooltip />
//                 <Line type="monotone" dataKey="tours" stroke="#0088FE" strokeWidth={2} />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Languages Distribution */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Language Distribution</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="h-[200px]">
//             <ResponsiveContainer width="100%" height="100%">
//               <PieChart>
//                 <Pie
//                   data={languageDistribution}
//                   cx="50%"
//                   cy="50%"
//                   innerRadius={60}
//                   outerRadius={80}
//                   fill="#8884d8"
//                   dataKey="value"
//                   label
//                 >
//                   {languageDistribution.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//                 <Legend />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };
// const mockGuideBookings = [
//     { id: 1, status: 'upcoming', name: 'Tokyo Cultural Tour' },
//     { id: 2, status: 'completed', name: 'Mount Fuji Adventure' }
//   ];
  
// const UpcomingReminders: React.FC = () => {
//   return (
//     <Card className="mb-8">
//       <CardHeader>
//         <CardTitle>Upcoming Reminders</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <div className="space-y-4">
//           <div className="flex items-start bg-blue-50 p-4 rounded-lg">
//             <AlertCircle className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
//             <div>
//               <p className="text-sm font-medium text-blue-800">Tokyo Cultural Tour - Tomorrow</p>
//               <p className="text-sm text-blue-600">Contact clients for meeting point confirmation</p>
//             </div>
//           </div>
//           <div className="flex items-start bg-yellow-50 p-4 rounded-lg">
//             <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
//             <div>
//               <p className="text-sm font-medium text-yellow-800">Mount Fuji Tour - Next Week</p>
//               <p className="text-sm text-yellow-600">Check weather conditions and prepare equipment</p>
//             </div>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// const GuideDashboard: React.FC = () => {
//   const [activeTab, setActiveTab] = useState<'upcoming' | 'completed'>('upcoming');
//   const [selectedBooking, setSelectedBooking] = useState<any>(null);
//   useEffect(()=>{
//     const getGuideBookings = async () => {
//       try {
//         const response = await axios.post(`http://localhost:8000/bookings/guide-bookings`, 
//           { guideId:localStorage.getItem('take-travel-userId') }, 
//           {
//             headers: {
//               'Content-Type': 'application/json'
//             }
//           }
//         );
    
//         console.log('Bookings:', response.data.data.bookings);
//         return response.data.data.bookings;
//       } catch (error) {
//         console.error('Error fetching guide bookings:');
//         throw error;
//       }
//     };
    
//     // Example Usage
//     getGuideBookings();
//   },[])

//   const filteredBookings = mockGuideBookings.filter((booking:any) => 
//     activeTab === 'upcoming' ? booking.status !== 'completed' : booking.status === 'completed'
//   );

//   return (
//     <div className="max-w-7xl mx-auto py-12 px-6 lg:px-20">
//       <div className="flex justify-between items-center mb-8">
//         <div>
//           <h1 className="text-4xl font-bold">Guide Dashboard</h1>
//           <p className="text-gray-600 mt-2">Welcome back, Tanaka Yuki</p>
//         </div>
//         <div className="bg-blue-100 px-4 py-2 rounded-lg">
//           <p className="text-blue-800 font-medium">Rating: 4.9/5 ⭐</p>
//         </div>
//       </div>

//       {/* Analytics Dashboard */}
//       <AnalyticsDashboard />

//       {/* Upcoming Reminders */}
//       <UpcomingReminders />

//       {/* Rest of the existing dashboard code... */}
//       <div className="flex space-x-4 mb-8 border-b">
//         <button
//           className={`pb-4 px-4 ${
//             activeTab === 'upcoming'
//               ? 'border-b-2 border-blue-600 text-blue-600 font-medium'
//               : 'text-gray-500 hover:text-gray-700'
//           }`}
//           onClick={() => setActiveTab('upcoming')}
//         >
//           Upcoming & Active Tours
//         </button>
//         <button
//           className={`pb-4 px-4 ${
//             activeTab === 'completed'
//               ? 'border-b-2 border-blue-600 text-blue-600 font-medium'
//               : 'text-gray-500 hover:text-gray-700'
//           }`}
//           onClick={() => setActiveTab('completed')}
//         >
//           Past Tours
//         </button>
//       </div>

//       {filteredBookings.length > 0 ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {filteredBookings.map((booking: any) => (
//             <BookingCard 
//               key={booking.id} 
//               booking={booking} 
//               onViewDetails={setSelectedBooking}
//             />
//           ))}
//         </div>
//       ) : (
//         <div className="text-center py-12">
//           <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//           <h3 className="text-lg font-medium text-gray-900 mb-2">No {activeTab} tours</h3>
//           <p className="text-gray-500">
//             {activeTab === 'upcoming'
//               ? "You don't have any upcoming tours scheduled."
//               : "You haven't completed any tours yet."}
//           </p>
//         </div>
//       )}

//       {selectedBooking && (
//         // <BookingDetails
//         //   booking={selectedBooking}
//         //   onClose={() => setSelectedBooking(null)}
//         // />
//         <Card></Card>
//       )}
//     </div>
//   );
// };

// export default GuideDashboard;
"use client"
import React, { useEffect, useState } from 'react';
import { Calendar, Clock, MapPin, AlertCircle, User, Phone, Mail, Globe2, Users, PieChart as PieChartIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { BookingCard, BookingDetails } from '@/components/cards/BookingCard';
import axios from 'axios';

// Define interfaces for the API data structure
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

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const AnalyticsDashboard: React.FC<{ bookings: Booking[] }> = ({ bookings }) => {
  // Calculate analytics from actual bookings
  const currentMonth = new Date().getMonth();
  const toursThisMonth = bookings.filter(booking => 
    new Date(booking.startDate).getMonth() === currentMonth
  ).length;

  const upcomingTours = bookings.filter(booking => 
    new Date(booking.startDate) > new Date() && booking.status !== 'cancelled'
  ).length;

  const totalTravelers = bookings.length;

  // Generate monthly data from actual bookings
  const monthlyTours = Array.from({ length: 6 }, (_, i) => {
    const month = new Date();
    month.setMonth(month.getMonth() - 5 + i);
    const count = bookings.filter(booking => 
      new Date(booking.startDate).getMonth() === month.getMonth()
    ).length;
    return {
      month: month.toLocaleString('default', { month: 'short' }),
      tours: count
    };
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Tours This Month</span>
              <span className="text-2xl font-bold">{toursThisMonth}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Upcoming Tours</span>
              <span className="text-2xl font-bold">{upcomingTours}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Travelers</span>
              <span className="text-2xl font-bold">{totalTravelers}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Tours Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Tours per Month</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTours}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="tours" stroke="#0088FE" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const UpcomingReminders: React.FC<{ bookings: Booking[] }> = ({ bookings }) => {
  const upcomingBookings = bookings
    .filter(booking => 
      new Date(booking.startDate) > new Date() && 
      booking.status !== 'cancelled'
    )
    .sort((a, b) => 
      new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    )
    .slice(0, 2);

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Upcoming Reminders</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upcomingBookings.map(booking => (
            <div key={booking._id} className="flex items-start bg-blue-50 p-4 rounded-lg">
              <AlertCircle className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-800">
                  {booking.packageId.name} - {new Date(booking.startDate).toLocaleDateString()}
                </p>
                <p className="text-sm text-blue-600">
                  Contact {booking.userId.name} for meeting point confirmation
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const GuideDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed'>('upcoming');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const getGuideBookings = async () => {
      try {
        const response = await axios.post(
          `http://localhost:8000/bookings/guide-bookings`, 
          { guideId: localStorage.getItem('take-travel-userId') }, 
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
        setBookings(response.data.data.bookings);
      } catch (error) {
        console.error('Error fetching guide bookings:', error);
      }
    };
    
    getGuideBookings();
  }, []);

  const filteredBookings = bookings.filter(booking => 
    activeTab === 'upcoming' 
      ? new Date(booking.startDate) > new Date() && booking.status !== 'cancelled'
      : new Date(booking.startDate) <= new Date() || booking.status === 'cancelled'
  );

  return (
    <div className="max-w-7xl mx-auto py-12 px-6 lg:px-20">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold">Guide Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back</p>
        </div>
      </div>

      <AnalyticsDashboard bookings={bookings} />
      <UpcomingReminders bookings={bookings} />

      <div className="flex space-x-4 mb-8 border-b">
        <button
          className={`pb-4 px-4 ${
            activeTab === 'upcoming'
              ? 'border-b-2 border-blue-600 text-blue-600 font-medium'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming & Active Tours
        </button>
        <button
          className={`pb-4 px-4 ${
            activeTab === 'completed'
              ? 'border-b-2 border-blue-600 text-blue-600 font-medium'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('completed')}
        >
          Past Tours
        </button>
      </div>

      {filteredBookings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBookings.map((booking) => (
            <BookingCard 
              key={booking._id} 
              booking={booking} 
              onViewDetails={setSelectedBooking}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No {activeTab} tours</h3>
          <p className="text-gray-500">
            {activeTab === 'upcoming'
              ? "You don't have any upcoming tours scheduled."
              : "You haven't completed any tours yet."}
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

export default GuideDashboard;