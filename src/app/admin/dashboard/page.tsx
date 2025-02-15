'use client'

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Edit, ChevronDown, ChevronUp, Check, Search } from 'lucide-react';
import { motion } from 'framer-motion';

interface Booking {
  id: number;
  username: string;
  destination: string;
  from: string;
  to: string;
  status: string;
  guideId: number | null;
}

interface Guide {
  id: number;
  name: string;
  status: 'Available' | 'Booked';
}

interface BookingChartData {
  month: string;
  bookings: number;
}

interface AccountsChartData {
  month: string;
  accounts: number;
}

type SortDirection = 'asc' | 'desc';
type SortableColumn = keyof Booking | null;

const bookingData: Booking[] = [
  { id: 1, username: 'johndoe', destination: 'Paris', from: '2024-03-15', to: '2024-03-22', status: 'Confirmed', guideId: 2 },
  { id: 2, username: 'janesmith', destination: 'Tokyo', from: '2024-04-10', to: '2024-04-20', status: 'Pending', guideId: null },
  { id: 3, username: 'michaelb', destination: 'New York', from: '2024-03-01', to: '2024-03-10', status: 'Completed', guideId: 1 },
  { id: 4, username: 'sarahc', destination: 'Barcelona', from: '2024-05-05', to: '2024-05-15', status: 'Cancelled', guideId: null },
  { id: 5, username: 'robertj', destination: 'Rome', from: '2024-06-20', to: '2024-06-30', status: 'Confirmed', guideId: 3 },
  { id: 6, username: 'emilyd', destination: 'Bali', from: '2024-07-01', to: '2024-07-14', status: 'Pending', guideId: null }
];

const guidesData: Guide[] = [
  { id: 1, name: 'Alex Thompson', status: 'Booked' },
  { id: 2, name: 'Maria Rodriguez', status: 'Booked' },
  { id: 3, name: 'James Wilson', status: 'Booked' },
  { id: 4, name: 'Sarah Lee', status: 'Available' },
  { id: 5, name: 'David Chen', status: 'Available' },
  { id: 6, name: 'Emma Davis', status: 'Available' },
  { id: 7, name: 'Michael Brown', status: 'Available' },
  { id: 8, name: 'Olivia Kim', status: 'Available' }
];

const bookingsChartData: BookingChartData[] = [
  { month: 'Jan', bookings: 120 },
  { month: 'Feb', bookings: 180 },
  { month: 'Mar', bookings: 200 },
  { month: 'Apr', bookings: 300 },
  { month: 'May', bookings: 250 }
];

const newAccountsData: AccountsChartData[] = [
  { month: 'Feb', accounts: 85 },
  { month: 'Mar', accounts: 100 },
  { month: 'Apr', accounts: 130 },
  { month: 'May', accounts: 170 }
];

const statusOptions = ['Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'];

const TravelDashboard: React.FC = () => {
  const [sortColumn, setSortColumn] = useState<SortableColumn>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [bookings, setBookings] = useState<Booking[]>(bookingData);
  const [guides, setGuides] = useState<Guide[]>(guidesData);
  const [guideSearch, setGuideSearch] = useState<string>('');

  const handleSort = (column: keyof Booking) => {
    const newDirection = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortDirection(newDirection);
    setSortColumn(column);

    const sortedData = [...bookings].sort((a, b) => {
      if (a[column] === null && b[column] === null) return 0;
      if (a[column] === null) return 1;
      if (b[column] === null) return -1;
      
      if (newDirection === 'asc') {
        return a[column] > b[column] ? 1 : -1;
      } else {
        return a[column] < b[column] ? 1 : -1;
      }
    });

    setBookings(sortedData);
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'Confirmed': return 'bg-green-500';
      case 'Pending': return 'bg-yellow-500';
      case 'In Progress': return 'bg-purple-500';
      case 'Completed': return 'bg-blue-500';
      case 'Cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const handleStatusChange = (bookingId: number, newStatus: string) => {
    setBookings(bookings.map(booking => 
      booking.id === bookingId ? { ...booking, status: newStatus } : booking
    ));
  };

  const handleGuideAssign = (bookingId: number, guideId: number | null) => {
    setBookings(bookings.map(booking => 
      booking.id === bookingId ? { ...booking, guideId } : booking
    ));
    
    if (guideId !== null) {
      setGuides(guides.map(guide => 
        guide.id === guideId ? { ...guide, status: 'Booked' } : guide
      ));
    }
    
    const previousBooking = bookings.find(b => b.id === bookingId);
    if (previousBooking?.guideId && previousBooking.guideId !== guideId) {
      const stillAssigned = bookings.some(b => 
        b.id !== bookingId && b.guideId === previousBooking.guideId
      );
      
      if (!stillAssigned) {
        setGuides(guides.map(guide => 
          guide.id === previousBooking.guideId ? { ...guide, status: 'Available' } : guide
        ));
      }
    }
  };

  const filteredGuides = guides.filter(guide => 
    guide.name.toLowerCase().includes(guideSearch.toLowerCase())
  );

  const getGuideName = (guideId: number | null): string => {
    if (guideId === null) return 'Not assigned';
    const guide = guides.find(g => g.id === guideId);
    return guide ? guide.name : 'Unknown';
  };

  return (
    <div className="flex flex-col gap-6 p-8 bg-gray-50 min-h-screen">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Travel Booking Dashboard</h1>
        <div className="flex gap-2">
          <Button variant="outline">Export Data</Button>
          <Button style={{ backgroundColor: '#EA580C' }}>New Booking</Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Total Bookings</CardTitle>
              <CardDescription>Last 5 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={bookingsChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="bookings" 
                      stroke="#EA580C" 
                      fill="#EA580C" 
                      fillOpacity={0.2} 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>New User Accounts</CardTitle>
              <CardDescription>Last 4 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={newAccountsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="accounts" fill="#EA580C" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>Manage and review recent booking activities</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('id')}>
                    ID
                    {sortColumn === 'id' && (
                      sortDirection === 'asc' ? <ChevronUp className="inline ml-1 h-4 w-4" /> : <ChevronDown className="inline ml-1 h-4 w-4" />
                    )}
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('username')}>
                    Username
                    {sortColumn === 'username' && (
                      sortDirection === 'asc' ? <ChevronUp className="inline ml-1 h-4 w-4" /> : <ChevronDown className="inline ml-1 h-4 w-4" />
                    )}
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('destination')}>
                    Destination
                    {sortColumn === 'destination' && (
                      sortDirection === 'asc' ? <ChevronUp className="inline ml-1 h-4 w-4" /> : <ChevronDown className="inline ml-1 h-4 w-4" />
                    )}
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('from')}>
                    From
                    {sortColumn === 'from' && (
                      sortDirection === 'asc' ? <ChevronUp className="inline ml-1 h-4 w-4" /> : <ChevronDown className="inline ml-1 h-4 w-4" />
                    )}
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('to')}>
                    To
                    {sortColumn === 'to' && (
                      sortDirection === 'asc' ? <ChevronUp className="inline ml-1 h-4 w-4" /> : <ChevronDown className="inline ml-1 h-4 w-4" />
                    )}
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned Guide</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>{booking.id}</TableCell>
                    <TableCell>{booking.username}</TableCell>
                    <TableCell>{booking.destination}</TableCell>
                    <TableCell>{booking.from}</TableCell>
                    <TableCell>{booking.to}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="p-0 h-auto">
                            <Badge className={`${getStatusColor(booking.status)}`}>
                              {booking.status}
                            </Badge>
                            <ChevronDown className="h-4 w-4 ml-1" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          {statusOptions.map(status => (
                            <DropdownMenuItem 
                              key={status}
                              onClick={() => handleStatusChange(booking.id, status)}
                            >
                              <div className="flex items-center">
                                {status === booking.status && (
                                  <Check className="h-4 w-4 mr-2" />
                                )}
                                <span className={status === booking.status ? "font-bold" : ""}>
                                  {status}
                                </span>
                              </div>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="w-full justify-between">
                            <span className="truncate mr-2">
                              {getGuideName(booking.guideId)}
                            </span>
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                          <div className="p-2">
                            <div className="flex items-center border rounded-md px-2">
                              <Search className="h-4 w-4 text-gray-400" />
                              <Input 
                                placeholder="Search guides..." 
                                className="border-0 focus-visible:ring-0"
                                value={guideSearch}
                                onChange={(e) => setGuideSearch(e.target.value)}
                              />
                            </div>
                          </div>
                          <DropdownMenuItem 
                            onClick={() => handleGuideAssign(booking.id, null)}
                          >
                            <div className="flex items-center">
                              {booking.guideId === null && (
                                <Check className="h-4 w-4 mr-2" />
                              )}
                              <span className={booking.guideId === null ? "font-bold" : ""}>
                                Not assigned
                              </span>
                            </div>
                          </DropdownMenuItem>
                          {filteredGuides.map(guide => (
                            <DropdownMenuItem 
                              key={guide.id}
                              disabled={guide.status === 'Booked' && booking.guideId !== guide.id}
                              onClick={() => handleGuideAssign(booking.id, guide.id)}
                            >
                              <div className="flex items-center">
                                {booking.guideId === guide.id && (
                                  <Check className="h-4 w-4 mr-2" />
                                )}
                                <div className="flex flex-col">
                                  <span className={booking.guideId === guide.id ? "font-bold" : ""}>
                                    {guide.name}
                                  </span>
                                  <span className={`text-xs ${guide.status === 'Available' ? 'text-green-500' : 'text-gray-400'}`}>
                                    {guide.status}
                                  </span>
                                </div>
                              </div>
                            </DropdownMenuItem>
                          ))}
                          {filteredGuides.length === 0 && (
                            <div className="py-2 px-4 text-sm text-gray-500">
                              No guides found
                            </div>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default TravelDashboard;