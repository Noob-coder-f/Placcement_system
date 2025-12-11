import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

const COLORS = ["#7A5CFF", "#39D0FF", "#4ADE80"]; // Purple, Cyan, Green

const AdminDashboardHome = () => {

  // ===== STATES =====
  const [stats, setStats] = useState({
    interns: 0,
    jobs: 0,
    mentors: 0,
    hr: 0,
  });

  const [purchaseGrowth, setPurchaseGrowth] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [weeklyJobs, setWeeklyJobs] = useState([]);
  const [plans, setPlans] = useState([]);
  const [users, setUsers] = useState({ mentors: [], hrs: [] });

  const getToken = () => localStorage.getItem("adminToken");

  // ===== USE EFFECT =====
  useEffect(() => {
    fetchDashboardStats();
    fetchPurchaseGrowth();
    fetchRevenue();
    fetchWeeklyJobs();
    fetchPlansData();
    fetchUsersData();
  }, []);

  // ============================
  // FETCH GENERAL STATISTICS
  // ============================
  const fetchDashboardStats = async () => {
    try {
      const token = getToken();
      const response = await axios.get("/api/admin/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setStats(response.data);
    } catch (err) {
      console.log("Error loading stats", err);
    }
  };

  // ============================
  // FETCH MONTHLY PURCHASE GROWTH
  // ============================
  const fetchPurchaseGrowth = async () => {
    try {
      const token = getToken();
      const res = await axios.get("/api/admin/purchases-monthly", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPurchaseGrowth(res.data);
    } catch (err) {
      console.log("Growth error:", err);
    }
  };

  // ============================
  // FETCH MONTHLY REVENUE
  // ============================
  const fetchRevenue = async () => {
    try {
      const token = getToken();
      const res = await axios.get("/api/admin/revenue-monthly", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRevenueData(res.data);
    } catch (err) {
      console.log("Revenue error:", err);
    }
  };

  // ============================
  // FETCH WEEKLY JOBS POSTED
  // ============================
  const fetchWeeklyJobs = async () => {
    try {
      const token = getToken();
      const res = await axios.get("/api/admin/jobs-weekly", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWeeklyJobs(res.data);
    } catch (err) {
      console.log("Jobs error:", err);
    }
  };

  // ============================
  // FETCH PLANS PIE CHART DATA
  // ============================
  const fetchPlansData = async () => {
    try {
      const token = getToken();
      const res = await axios.get("/api/admin/plans", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPlans(res.data);
    } catch (err) {
      console.log("Plans error:", err);
    }
  };

  // ============================
  // FETCH MENTORS + HRS LIST
  // ============================
  const fetchUsersData = async () => {
    try {
      const token = getToken();
      const res = await axios.get("/api/admin/users-list", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.log("User list error:", err);
    }
  };

  // =============== UI RETURN ======================
  return (
    <div className="space-y-6">

      {/* ======================= TOP CARDS ======================= */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card title="Interns" value={stats.interns} color="blue" />
        <Card title="Jobs Posted" value={stats.jobs} color="purple" />
        <Card title="Mentors" value={stats.mentors} color="green" />
        <Card title="Hiring Team" value={stats.hr} color="red" />
      </div>

      {/* ======================= MAIN TOP CHARTS ======================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* PURCHASE GROWTH */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-bold mb-2">Purchased Intern Growth (Monthly)</h2>

          <ResponsiveContainer width="100%" height={250}>
  <LineChart data={purchaseGrowth}>
    
    {/* Remove grid + axis = minimal modern look */}
    <XAxis dataKey="month" axisLine={false} tickLine={false} padding={{ left: 10, right: 10 }} />
    <YAxis hide />

    <Tooltip
      contentStyle={{
        background: "white",
        borderRadius: "10px",
        border: "none",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
      }}
    />

    {/* Smooth Premium Curve */}
    <defs>
      <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#7A5CFF" stopOpacity={1}/>
        <stop offset="100%" stopColor="#7A5CFF" stopOpacity={0.2}/>
      </linearGradient>
    </defs>

    <Line
      type="monotone"
      dataKey="count"
      stroke="url(#lineGradient)"
      strokeWidth={4}
      dot={{ r: 0 }}
      activeDot={{ r: 7, fill: "#7A5CFF", stroke: "white", strokeWidth: 3 }}
    />
  </LineChart>
</ResponsiveContainer>

        </div>

        {/* WEEKLY JOBS */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-bold mb-2">Weekly Job Postings</h2>

         <ResponsiveContainer width="100%" height={250}>
  <BarChart data={weeklyJobs} barSize={20}>
    <XAxis dataKey="week" axisLine={false} tickLine={false} />
    <YAxis hide />

    <Tooltip
      contentStyle={{
        background: "white",
        border: "none",
        borderRadius: "10px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.12)"
      }}
    />

    <defs>
      <linearGradient id="weeklyJobsGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#39D0FF" stopOpacity={0.9}/>
    <stop offset="100%" stopColor="#7A5CFF" stopOpacity={0.7}/>
      </linearGradient>
    </defs>

    <Bar
      dataKey="count"
      fill="url(#weeklyJobsGradient)"
      radius={[8, 8, 8, 8]}
      animationDuration={900}
    />
  </BarChart>
</ResponsiveContainer>


        </div>

      </div>

      {/* ======================= MIDDLE GRID ======================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* MONTHLY REVENUE */}
        <div className="bg-white p-6 rounded-xl shadow col-span-2">
          <h2 className="text-lg font-bold mb-2">Monthly Revenue</h2>

          <ResponsiveContainer width="100%" height={250}>
  <BarChart data={revenueData} barSize={25}>
    <XAxis dataKey="month" axisLine={false} tickLine={false} />
    <YAxis hide />

    <Tooltip
      contentStyle={{
        background: "white",
        border: "none",
        borderRadius: "12px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.12)"
      }}
    />

    <defs>
      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#A855F7" stopOpacity={1}/>
        <stop offset="100%" stopColor="#EC4899" stopOpacity={0.8}/>
      </linearGradient>
    </defs>

    <Bar
      dataKey="amount"
      fill="url(#revenueGradient)"
      radius={[10, 10, 10, 10]}
      animationDuration={1200}
    />
  </BarChart>
</ResponsiveContainer>

        </div>

        {/* PIE CHART */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-bold mb-2">Plans Purchased</h2>

         <ResponsiveContainer width="100%" height={250}>
  <PieChart>
    <Tooltip 
      contentStyle={{
        background: "white",
        border: "none",
        borderRadius: "10px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
      }} 
    />

    <Pie
      data={plans}
      dataKey="count"
      nameKey="plan"
      outerRadius={85}
      innerRadius={50}
      paddingAngle={4}
      stroke="white"
      strokeWidth={3}
    >
      {plans.map((_, index) => (
        <Cell 
          key={index} 
          fill={COLORS[index % COLORS.length]} 
        />
      ))}
    </Pie>

    <Legend verticalAlign="bottom" height={20} />
  </PieChart>
</ResponsiveContainer>

        </div>

      </div>

      {/* ======================= MENTORS + HR TABLE ======================= */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-bold mb-4">Mentors & Hiring Team</h2>

        <table className="w-full border-separate border-spacing-y-2">
          <thead>
            <tr className="text-left text-gray-600">
              <th className="p-2">Name</th>
              <th className="p-2">Role</th>
              <th className="p-2">Experience</th>
              <th className="p-2">Domain</th>
              <th className="p-2">Joined</th>
            </tr>
          </thead>

          <tbody>
            {[...users.mentors, ...users.hrs].map((user, i) => (
              <tr key={i} className="bg-gray-50 hover:bg-gray-100 rounded-lg">
                <td className="p-2 font-semibold">{user.name}</td>
                <td className="p-2">{user.role}</td>
                <td className="p-2">{user.experience || "—"} yrs</td>
                <td className="p-2">{user.domain || "—"}</td>
                <td className="p-2">{new Date(user.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>

    </div>
  );
};

export default AdminDashboardHome;

// =============== CARD COMPONENT ===============
const Card = ({ title, value, color }) => {
  const colorClasses = {
    blue: "from-blue-500 to-blue-700",
    purple: "from-purple-500 to-purple-700",
    green: "from-green-500 to-green-700",
    red: "from-red-500 to-red-700",
  };

  return (
    <div className={`p-5 text-white rounded-xl shadow bg-gradient-to-r ${colorClasses[color]}`}>
      <p className="text-lg font-semibold">{title}</p>
      <h2 className="text-3xl font-bold mt-2">{value}</h2>
    </div>
  );
};
