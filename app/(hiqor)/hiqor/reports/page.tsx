'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  FileText,
  PieChart,
  Download,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  FileDown,
  Clock,
  Filter,
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPie,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Types
type PeriodType = '7D' | '30D' | '90D' | '1Y' | 'Custom';

interface KeyMetric {
  label: string;
  value: string;
  change: number;
  trend: 'up' | 'down';
  icon: React.ElementType;
  color: string;
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  lastGenerated: string;
  icon: React.ElementType;
}

// Mock Data
const premiumTrendData = [
  { month: 'Jan', premium: 45000, policies: 120, claims: 8000 },
  { month: 'Feb', premium: 52000, policies: 145, claims: 12000 },
  { month: 'Mar', premium: 48000, policies: 132, claims: 9500 },
  { month: 'Apr', premium: 61000, policies: 168, claims: 11000 },
  { month: 'May', premium: 58000, policies: 159, claims: 13500 },
  { month: 'Jun', premium: 67000, policies: 185, claims: 10500 },
  { month: 'Jul', premium: 73000, policies: 198, claims: 14000 },
];

const policyDistributionData = [
  { name: 'Event Liability', value: 45, count: 234 },
  { name: 'Equipment', value: 25, count: 130 },
  { name: 'Weather', value: 18, count: 94 },
  { name: 'Cancellation', value: 12, count: 63 },
];

const claimsStatusData = [
  { status: 'Approved', count: 45, amount: 125000 },
  { status: 'Pending', count: 23, amount: 67000 },
  { status: 'Rejected', count: 8, amount: 18000 },
  { status: 'Under Review', count: 12, amount: 34000 },
];

const monthlyComparisonData = [
  { month: 'Jan', current: 45000, previous: 38000 },
  { month: 'Feb', current: 52000, previous: 42000 },
  { month: 'Mar', current: 48000, previous: 45000 },
  { month: 'Apr', current: 61000, previous: 48000 },
  { month: 'May', current: 58000, previous: 52000 },
  { month: 'Jun', current: 67000, previous: 55000 },
];

const COLORS = ['#6366f1', '#8b5cf6', '#a855f7', '#c084fc'];

export default function HiqorReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('30D');
  const [isExporting, setIsExporting] = useState(false);

  // Key Metrics
  const keyMetrics: KeyMetric[] = useMemo(
    () => [
      {
        label: 'Total Premium Collected',
        value: '$404,000',
        change: 12.5,
        trend: 'up',
        icon: DollarSign,
        color: 'indigo',
      },
      {
        label: 'Policy Count',
        value: '1,201',
        change: 8.3,
        trend: 'up',
        icon: FileText,
        color: 'purple',
      },
      {
        label: 'Average Premium',
        value: '$336',
        change: -2.1,
        trend: 'down',
        icon: TrendingUp,
        color: 'violet',
      },
      {
        label: 'Claims Ratio',
        value: '18.2%',
        change: -5.4,
        trend: 'down',
        icon: BarChart3,
        color: 'indigo',
      },
      {
        label: 'Loss Ratio',
        value: '45.8%',
        change: 3.2,
        trend: 'up',
        icon: PieChart,
        color: 'purple',
      },
    ],
    []
  );

  // Report Templates
  const reportTemplates: ReportTemplate[] = [
    {
      id: 'premium-summary',
      name: 'Premium Summary Report',
      description: 'Comprehensive overview of premium collection and trends',
      lastGenerated: '2 hours ago',
      icon: DollarSign,
    },
    {
      id: 'claims-analysis',
      name: 'Claims Analysis Report',
      description: 'Detailed breakdown of claims status and patterns',
      lastGenerated: '5 hours ago',
      icon: BarChart3,
    },
    {
      id: 'partner-performance',
      name: 'Partner Performance Report',
      description: 'Partner-wise policy and revenue distribution',
      lastGenerated: '1 day ago',
      icon: TrendingUp,
    },
    {
      id: 'risk-assessment',
      name: 'Risk Assessment Report',
      description: 'Risk analysis and underwriting insights',
      lastGenerated: '3 days ago',
      icon: PieChart,
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: 'easeOut',
      },
    },
  };

  const handleExport = async (format: 'csv' | 'pdf') => {
    setIsExporting(true);
    // Simulate export
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsExporting(false);
    // In production, trigger actual download
    console.log(`Exporting as ${format.toUpperCase()}`);
  };

  const handleGenerateReport = (reportId: string) => {
    console.log(`Generating report: ${reportId}`);
    // In production, trigger report generation
  };

  const handleScheduleReport = () => {
    console.log('Opening schedule dialog');
    // In production, open schedule modal
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 md:p-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto space-y-6"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-indigo-900 mb-2">
              Analytics & Reports
            </h1>
            <p className="text-indigo-600">
              Comprehensive insights into your insurance operations
            </p>
          </div>

          {/* Export Actions */}
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleScheduleReport}
              className="px-4 py-2 bg-white border border-indigo-200 text-indigo-700 rounded-lg hover:bg-indigo-50 transition-colors flex items-center gap-2 text-sm font-medium"
            >
              <Clock className="w-4 h-4" />
              Schedule
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleExport('csv')}
              disabled={isExporting}
              className="px-4 py-2 bg-white border border-indigo-200 text-indigo-700 rounded-lg hover:bg-indigo-50 transition-colors flex items-center gap-2 text-sm font-medium disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              CSV
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleExport('pdf')}
              disabled={isExporting}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 text-sm font-medium disabled:opacity-50"
            >
              <FileDown className="w-4 h-4" />
              PDF
            </motion.button>
          </div>
        </motion.div>

        {/* Period Selector */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm border border-indigo-100 p-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              <span className="text-sm font-medium text-gray-700">Period:</span>
            </div>
            <div className="flex items-center gap-2">
              {(['7D', '30D', '90D', '1Y', 'Custom'] as PeriodType[]).map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedPeriod === period
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Key Metrics Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {keyMetrics.map((metric, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -4 }}
              className="bg-white rounded-xl shadow-sm border border-indigo-100 p-6 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 bg-${metric.color}-100 rounded-lg`}>
                  <metric.icon className={`w-6 h-6 text-${metric.color}-600`} />
                </div>
                <div
                  className={`flex items-center gap-1 text-sm font-medium ${
                    metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {metric.trend === 'up' ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  {Math.abs(metric.change)}%
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</p>
                <p className="text-sm text-gray-600">{metric.label}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Premium Trends Chart */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-sm border border-indigo-100 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              Premium Trends
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={premiumTrendData}>
                <defs>
                  <linearGradient id="colorPremium" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="premium"
                  stroke="#6366f1"
                  strokeWidth={2}
                  fill="url(#colorPremium)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Policy Distribution Pie Chart */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-sm border border-indigo-100 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-indigo-600" />
              Policy Distribution by Type
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPie>
                <Pie
                  data={policyDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {policyDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPie>
            </ResponsiveContainer>
          </motion.div>

          {/* Claims by Status Bar Chart */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-sm border border-indigo-100 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
              Claims by Status
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={claimsStatusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="status" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Monthly Comparison Chart */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-sm border border-indigo-100 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Filter className="w-5 h-5 text-indigo-600" />
              Monthly Comparison
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyComparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="current"
                  stroke="#6366f1"
                  strokeWidth={2}
                  name="Current Period"
                />
                <Line
                  type="monotone"
                  dataKey="previous"
                  stroke="#a855f7"
                  strokeWidth={2}
                  name="Previous Period"
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Report Templates Table */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl shadow-sm border border-indigo-100 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            Pre-Built Report Templates
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                    Report Name
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                    Description
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                    Last Generated
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {reportTemplates.map((report, index) => (
                  <motion.tr
                    key={report.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-gray-100 hover:bg-indigo-50/50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-100 rounded-lg">
                          <report.icon className="w-4 h-4 text-indigo-600" />
                        </div>
                        <span className="font-medium text-gray-900">{report.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">{report.description}</td>
                    <td className="py-4 px-4 text-sm text-gray-600">{report.lastGenerated}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleGenerateReport(report.id)}
                          className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                        >
                          Generate
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-3 py-1.5 bg-white border border-indigo-200 text-indigo-700 rounded-lg hover:bg-indigo-50 transition-colors text-sm font-medium"
                        >
                          <Download className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Footer Note */}
        <motion.div
          variants={itemVariants}
          className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 text-center"
        >
          <p className="text-sm text-indigo-700">
            All reports are generated in real-time. Data refreshes every 5 minutes.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
