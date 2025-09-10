import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Line,
  LineChart,
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { 
  Truck, 
  Clock, 
  AlertTriangle, 
  Route, 
  TrendingUp, 
  TrendingDown,
  MapPin,
  Battery,
  Signal
} from 'lucide-react';
import { cn } from '@/lib/utils';

const stats = [
  {
    icon: <Truck className="h-6 w-6" />,
    label: 'Total Vehicles',
    value: '124',
    change: '+5.2%',
    trend: 'up',
    description: 'Across all accounts'
  },
  {
    icon: <Clock className="h-6 w-6" />,
    label: 'Average Uptime',
    value: '98.2%',
    change: '+1.1%',
    trend: 'up',
    description: '7-day average'
  },
  {
    icon: <AlertTriangle className="h-6 w-6" />,
    label: 'Active Alerts',
    value: '5',
    change: '-2',
    trend: 'down',
    description: 'Requiring attention'
  },
  {
    icon: <Route className="h-6 w-6" />,
    label: 'Active Trips',
    value: '47',
    change: '+12.5%',
    trend: 'up',
    description: 'In progress now'
  }
];

const vehicleData = [
  { time: '00:00', vehicles: 45 },
  { time: '04:00', vehicles: 38 },
  { time: '08:00', vehicles: 65 },
  { time: '12:00', vehicles: 78 },
  { time: '16:00', vehicles: 85 },
  { time: '20:00', vehicles: 58 },
  { time: '23:59', vehicles: 48 },
];

const fuelData = [
  { day: 'Mon', consumption: 245 },
  { day: 'Tue', consumption: 312 },
  { day: 'Wed', consumption: 278 },
  { day: 'Thu', consumption: 301 },
  { day: 'Fri', consumption: 265 },
  { day: 'Sat', consumption: 198 },
  { day: 'Sun', consumption: 154 },
];

const statusData = [
  { name: 'Active', value: 98 },
  { name: 'Maintenance', value: 12 },
  { name: 'Inactive', value: 14 },
];

const COLORS = ['#10B981', '#F59E0B', '#6B7280'];

const activities = [
  {
    type: 'alert',
    title: 'Speed Limit Exceeded',
    description: 'KCA 001A exceeded speed limit by 15 km/h on Thika Road',
    time: '2 minutes ago'
  },
  {
    type: 'info',
    title: 'New Trip Started',
    description: 'KBZ 205B started a new trip to Mombasa',
    time: '15 minutes ago'
  },
  {
    type: 'success',
    title: 'Maintenance Completed',
    description: 'KCF 789C completed scheduled maintenance',
    time: '1 hour ago'
  },
  {
    type: 'info',
    title: 'Zone Entry',
    description: 'KCA 001A entered Warehouse Zone',
    time: '2 hours ago'
  }
];

export const DashboardPage = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening with your fleet.</p>
        </div>
        <Button variant="outline">
          <i className="fa-solid fa-calendar mr-2"></i>
          Today
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-6 bg-gradient-to-br from-background to-muted/50 border-0 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                {stat.icon}
              </div>
              <span className={cn(
                'text-xs font-medium flex items-center',
                stat.trend === 'up' ? 'text-emerald-500' : 'text-red-500'
              )}>
                {stat.trend === 'up' ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                {stat.change}
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-bold">{stat.value}</h3>
              <p className="text-sm font-medium text-foreground mt-1">{stat.label}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Vehicles Chart */}
        <Card className="p-6 col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Active Vehicles Today</h3>
            <div className="flex items-center text-sm text-muted-foreground">
              <div className="flex items-center mr-4">
                <div className="w-3 h-3 rounded-full bg-primary mr-2"></div>
                <span>Vehicles</span>
              </div>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={vehicleData}>
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="vehicles"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Vehicle Status Pie Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-6">Vehicle Status</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Second Row Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fuel Consumption */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Weekly Fuel Consumption</h3>
            <div className="text-sm text-muted-foreground">
              Total: 1,753 L
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={fuelData}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar 
                  dataKey="consumption" 
                  fill="hsl(var(--primary))" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className={cn(
                  'mt-0.5 rounded-full p-2',
                  activity.type === 'alert' ? 'bg-destructive/10 text-destructive' :
                  activity.type === 'info' ? 'bg-blue-500/10 text-blue-500' :
                  'bg-primary/10 text-primary'
                )}>
                  {activity.type === 'alert' ? <AlertTriangle className="h-4 w-4" /> :
                   activity.type === 'info' ? <MapPin className="h-4 w-4" /> :
                   <Battery className="h-4 w-4" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {activity.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Device Health Status */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-6">Device Health Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg">
            <div className="flex items-center mb-2">
              <Battery className="h-5 w-5 text-emerald-500 mr-2" />
              <span className="font-medium">Battery Health</span>
            </div>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-sm text-muted-foreground">Average across all devices</p>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="flex items-center mb-2">
              <Signal className="h-5 w-5 text-blue-500 mr-2" />
              <span className="font-medium">Signal Strength</span>
            </div>
            <div className="text-2xl font-bold">4.2/5</div>
            <p className="text-sm text-muted-foreground">Network connectivity</p>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="flex items-center mb-2">
              <Clock className="h-5 w-5 text-amber-500 mr-2" />
              <span className="font-medium">Uptime</span>
            </div>
            <div className="text-2xl font-bold">99.1%</div>
            <p className="text-sm text-muted-foreground">Last 30 days</p>
          </div>
        </div>
      </Card>
    </div>
  );
};