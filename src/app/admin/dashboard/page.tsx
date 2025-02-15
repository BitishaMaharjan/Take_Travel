'use client'

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Edit, ChevronDown, ChevronUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface Booking {
  id: number;
  username: string;
  destination: string;
  from: string;
  to: string;
  status: string;
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
  { id: 1, username: 'johndoe', destination: 'Paris', from: '2024-03-15', to: '2024-03-22', status: 'Confirmed' },
  { id: 2, username: 'janesmith', destination: 'Tokyo', from: '2024-04-10', to: '2024-04-20', status: 'Pending' },
  { id: 3, username: 'michaelb', destination: 'New York', from: '2024-03-01', to: '2024-03-10', status: 'Completed' },
  { id: 4, username: 'sarahc', destination: 'Barcelona', from: '2024-05-05', to: '2024-05-15', status: 'Cancelled' },
  { id: 5, username: 'robertj', destination: 'Rome', from: '2024-06-20', to: '2024-06-30', status: 'Confirmed' },
  { id: 6, username: 'elon musk', destination: 'Bali', from: '2024-07-01', to: '2024-07-14', status: 'Pending' }
];

const bookingsChartData: BookingChartData[] = [
  { month: 'Jan', bookings: 120 },
  { month: 'Feb', bookings: 180 },
  { month: 'Mar', bookings: 200 },
  { month: 'Apr', bookings: 300 },
  { month: 'May', bookings: 250 }
];

// Mock data for new accounts
const newAccountsData: AccountsChartData[] = [
  { month: 'Feb', accounts: 85 },
  { month: 'Mar', accounts: 100 },
  { month: 'Apr', accounts: 130 },
  { month: 'May', accounts: 170 }
];

const TravelDashboard: React.FC = () => {
  const [sortColumn, setSortColumn] = useState<SortableColumn>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [bookings, setBookings] = useState<Booking[]>(bookingData);

  const handleSort = (column: keyof Booking) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }

    const sortedData = [...bookings].sort((a, b) => {
      if (sortDirection === 'asc') {
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
      case 'Completed': return 'bg-blue-500';
      case 'Cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
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
                  <TableHead className="cursor-pointer" onClick={() => handleSort('status')}>
                    Status
                    {sortColumn === 'status' && (
                      sortDirection === 'asc' ? <ChevronUp className="inline ml-1 h-4 w-4" /> : <ChevronDown className="inline ml-1 h-4 w-4" />
                    )}
                  </TableHead>
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
                      <Badge className={`${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </Badge>
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