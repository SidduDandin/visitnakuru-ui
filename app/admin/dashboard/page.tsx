"use client"

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
} from "recharts"

const pieData = [
  { name: "Tourism", value: 400 },
  { name: "Events", value: 300 },
  { name: "Visitors", value: 300 },
  { name: "Others", value: 200 },
]

const COLORS = ["#16a34a", "#2563eb", "#f59e0b", "#dc2626"]

const lineData = [
  { month: "Jan", visitors: 120 },
  { month: "Feb", visitors: 200 },
  { month: "Mar", visitors: 150 },
  { month: "Apr", visitors: 300 },
  { month: "May", visitors: 250 },
  { month: "Jun", visitors: 400 },
]

const eventsData = [
  { category: "Cultural", count: 12 },
  { category: "Sports", count: 8 },
  { category: "Music", count: 15 },
  { category: "Tourism", count: 10 },
]

const revenueData = [
  { day: "Mon", revenue: 1200 },
  { day: "Tue", revenue: 1500 },
  { day: "Wed", revenue: 900 },
  { day: "Thu", revenue: 1800 },
  { day: "Fri", revenue: 2200 },
  { day: "Sat", revenue: 1700 },
  { day: "Sun", revenue: 1400 },
]


export default function DashboardPage() {
  return (
    <div className="space-y-6">

 {/* Example Table */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-lg font-semibold mb-4">Latest Visitors</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Visit Date</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b hover:bg-gray-50">
              <td className="p-2">John Doe</td>
              <td className="p-2">john@example.com</td>
              <td className="p-2">2025-09-01</td>
            </tr>
            <tr className="border-b hover:bg-gray-50">
              <td className="p-2">Jane Smith</td>
              <td className="p-2">jane@example.com</td>
              <td className="p-2">2025-09-02</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Stat widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow text-center">
          <h3 className="text-gray-500 text-sm">Total Visitors</h3>
          <p className="text-2xl font-bold text-green-700">12,340</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow text-center">
          <h3 className="text-gray-500 text-sm">Active Events</h3>
          <p className="text-2xl font-bold text-blue-600">24</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow text-center">
          <h3 className="text-gray-500 text-sm">Revenue</h3>
          <p className="text-2xl font-bold text-yellow-600">$53,200</p>
        </div>
      </div>


      {/* Charts row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-lg font-semibold mb-4">Engagement Breakdown</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Visitors Line Chart */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-lg font-semibold mb-4">Visitors Over Time</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="visitors" stroke="#16a34a" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Events Bar Chart */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-lg font-semibold mb-4">Events by Category</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={eventsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#2563eb" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Daily Revenue Chart */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-lg font-semibold mb-4">Daily Revenue</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      </div>

    </div>
  )
}
