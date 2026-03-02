import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  Search,
  RefreshCcw,
  Eye,
  LayoutDashboard,
  Users,
  Mail,
  Phone,
  Wrench,
  Calendar,
  Clock,
  FileText,
  X,
  Menu,
  ChevronRight,
  TrendingUp,
  MessageSquare,
  LogOut
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";

const AdminDashboard = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [passwordInput, setPasswordInput] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        "https://howtobackend.onrender.com/contact/getcontact"
      );
      setEnquiries(res.data.data || []);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };
const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;
  const handleLogin = (e) => {
    e.preventDefault();
    if (passwordInput ===adminPassword) {
      setIsLoggedIn(true);
      setError("");
      fetchEnquiries();
    } else {
      setError("Incorrect password");
    }
  };

  const filteredEnquiries = enquiries.filter(
    (e) =>
      (e.name?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (e.email?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (e.service?.toLowerCase() || "").includes(search.toLowerCase())
  );

  const chartData = useMemo(() => {
    const counts = {};
    if (!enquiries) return [];
    enquiries.forEach((e) => {
      const date = new Date(e.createdAt).toLocaleDateString();
      counts[date] = (counts[date] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-7); // Last 7 days
  }, [enquiries]);

  const stats = useMemo(() => {
    const today = new Date().toLocaleDateString();
    const todayCount = enquiries.filter(e => new Date(e.createdAt).toLocaleDateString() === today).length;
    return [
      { label: "Total Enquiries", value: enquiries.length, icon: MessageSquare, color: "text-blue-600", bg: "bg-blue-50" },
      { label: "Today's Enquiries", value: todayCount, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
    ];
  }, [enquiries]);

  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl w-full max-w-md"
        >
          <div className="flex justify-center mb-6">
            <img src="/Images/image.png" alt="Logo" className="h-16 w-auto" />
          </div>
          <h2 className="text-3xl font-bold text-white text-center mb-8">Admin Portal</h2>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-slate-400 text-sm font-medium mb-2">Access Key</label>
              <input
                type="password"
                placeholder="••••••••"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-3 rounded-xl font-bold hover:bg-blue-700 active:scale-[0.98] transition-all"
            >
              Sign In
            </button>
            {error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-rose-500 text-center text-sm font-medium">
                {error}
              </motion.p>
            )}
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            className="fixed lg:static z-50 w-72 h-screen bg-white border-r border-slate-200 flex flex-col"
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <img src="/Images/image.png" alt="Logo" className="h-10 w-auto" />
              <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-400">
                <X size={20} />
              </button>
            </div>

            <nav className="flex-1 p-4 space-y-2">
              <div className="bg-blue-50 text-blue-600 flex items-center gap-3 px-4 py-3 rounded-xl font-semibold">
                <LayoutDashboard size={20} />
                Dashboard
              </div>
         
            </nav>

            <div className="p-4 border-t border-slate-100">
              <button
                onClick={() => setIsLoggedIn(false)}
                className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl font-medium transition"
              >
                <LogOut size={20} />
                Logout
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto max-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {!isSidebarOpen && (
              <button onClick={() => setIsSidebarOpen(true)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600">
                <Menu size={20} />
              </button>
            )}
            <h1 className="text-xl font-bold text-slate-900 hidden sm:block">Admin Overview</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition" size={18} />
              <input
                type="text"
                placeholder="Search anything..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full w-48 sm:w-64 focus:ring-2 focus:ring-blue-500 transition outline-none text-sm"
              />
            </div>
            <button
              onClick={fetchEnquiries}
              className={`p-2 hover:bg-slate-100 rounded-full text-slate-600 transition ${loading ? 'animate-spin' : ''}`}
            >
              <RefreshCcw size={18} />
            </button>
          </div>
        </header>

        <div className="p-4 lg:p-8 space-y-8 max-w-7xl mx-auto">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4"
              >
                <div className={`p-4 rounded-xl ${stat.bg} ${stat.color}`}>
                  <stat.icon size={24} />
                </div>
                <div>
                  <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Chart Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-slate-800">Enquiry Trends (Last 7 Days)</h2>
              <div className="flex items-center gap-2 text-emerald-600 text-sm font-semibold bg-emerald-50 px-3 py-1 rounded-full">
                <TrendingUp size={14} />
                <span>Live Data</span>
              </div>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#2563eb"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorCount)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Table Section */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-slate-800">Recent Enquiries</h2>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{filteredEnquiries.length} results</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-500 text-sm uppercase font-bold tracking-wider">
                    <th className="px-6 py-4">Client</th>
                    <th className="px-6 py-4">Service</th>
                    <th className="px-6 py-4 hidden sm:table-cell">Contact</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredEnquiries.map((e) => (
                    <tr key={e._id} className="hover:bg-blue-50/30 transition group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold group-hover:bg-blue-100 group-hover:text-blue-600 transition">
                            {e.name?.charAt(0) || "U"}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 line-clamp-1">{e.name}</p>
                            <p className="text-sm text-slate-500 line-clamp-1">{e.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold whitespace-nowrap">
                          {e.service}
                        </span>
                      </td>
                      <td className="px-6 py-4 hidden sm:table-cell">
                        <p className="text-sm text-slate-600 font-medium">{e.mobile}</p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setSelected(e)}
                          className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-600 transition shadow-sm"
                        >
                          <Eye size={16} />
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Details Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setSelected(null)} />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className="bg-slate-900 p-8 text-white relative">
                <button
                  onClick={() => setSelected(null)}
                  className="absolute top-6 right-6 text-white/50 hover:text-white hover:rotate-90 transition transform duration-200"
                >
                  <X size={24} />
                </button>
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-16 w-16 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                    <FileText size={32} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold">Enquiry Details</h2>
                    <p className="text-blue-400 font-medium">#{selected._id?.slice(-8)}</p>
                  </div>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 bg-white">
                <div className="space-y-6">
                  <DetailItem icon={Users} label="Client Name" value={selected.name} />
                  <DetailItem icon={Mail} label="Email Address" value={selected.email} />
                  <DetailItem icon={Phone} label="Phone Number" value={selected.mobile} />
                </div>
                <div className="space-y-6">
                  <DetailItem icon={Wrench} label="Requested Service" value={selected.service} badge />
                  <DetailItem icon={Calendar} label="Received Date" value={new Date(selected.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })} />
                  <DetailItem icon={Clock} label="Received Time" value={new Date(selected.createdAt).toLocaleTimeString()} />
                  <DetailItem icon={MessageSquare} label="Inquiry Message" value={selected.enquiry || "No message provided"} fullWidth />
                </div>
              </div>

              <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setSelected(null)}
                  className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition"
                >
                  Close View
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const DetailItem = ({ icon: Icon, label, value, badge, fullWidth }) => (
  <div className={fullWidth ? "col-span-full" : ""}>
    <label className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 block">{label}</label>
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-lg bg-slate-50 text-slate-500">
        <Icon size={18} />
      </div>
      <p className={`font-bold text-slate-900 ${badge ? "px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm" : ""}`}>
        {value}
      </p>
    </div>
  </div>
);

export default AdminDashboard;