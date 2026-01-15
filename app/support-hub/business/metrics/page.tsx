"use client";

import { motion } from "framer-motion";
import {
  Target,
  TrendingUp,
  Users,
  DollarSign,
  Award,
  AlertCircle,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  BarChart3,
  PieChart,
  Activity,
  Lightbulb,
  ArrowRight,
  Zap
} from "lucide-react";
import { GlassCard } from "@/components/support-hub/GlassCard";
import { Breadcrumbs } from "@/components/support-hub/Breadcrumbs";

export default function MetricsPage() {
  const kpis = [
    {
      icon: DollarSign,
      name: "Monthly Recurring Revenue (MRR)",
      description: "Predictable monthly income from memberships",
      target: "$10,000+",
      formula: "Active Members × Average Monthly Premium",
      importance: "Critical",
      color: "green"
    },
    {
      icon: Users,
      name: "Member Growth Rate",
      description: "Net new members added per month",
      target: "15%+",
      formula: "(New Members - Churned) / Total Members × 100",
      importance: "High",
      color: "blue"
    },
    {
      icon: Target,
      name: "Conversion Rate",
      description: "Percentage of prospects who purchase",
      target: "60%+",
      formula: "Purchases / Total Prospects × 100",
      importance: "High",
      color: "purple"
    },
    {
      icon: Award,
      name: "Retention Rate",
      description: "Members who stay month-over-month",
      target: "90%+",
      formula: "(1 - Churned Members / Total Members) × 100",
      importance: "Critical",
      color: "orange"
    },
    {
      icon: TrendingUp,
      name: "Average Revenue Per User (ARPU)",
      description: "Average earnings per member",
      target: "$50+",
      formula: "Total Revenue / Active Members",
      importance: "Medium",
      color: "indigo"
    },
    {
      icon: Activity,
      name: "Customer Lifetime Value (CLV)",
      description: "Total revenue from a member over time",
      target: "$600+",
      formula: "ARPU × Average Membership Duration",
      importance: "High",
      color: "teal"
    }
  ];

  const industryBenchmarks = [
    {
      category: "Fitness Studios",
      metrics: {
        conversion: "65-75%",
        retention: "88-92%",
        arpu: "$45-55",
        growth: "12-18%"
      }
    },
    {
      category: "Yoga Studios",
      metrics: {
        conversion: "70-80%",
        retention: "90-95%",
        arpu: "$50-60",
        growth: "10-15%"
      }
    },
    {
      category: "Dance Schools",
      metrics: {
        conversion: "60-70%",
        retention: "85-90%",
        arpu: "$40-50",
        growth: "15-20%"
      }
    },
    {
      category: "Martial Arts",
      metrics: {
        conversion: "55-65%",
        retention: "92-96%",
        arpu: "$55-65",
        growth: "8-12%"
      }
    }
  ];

  const growthOpportunities = [
    {
      icon: Zap,
      title: "Increase Conversion Rate",
      current: "45%",
      target: "65%",
      strategies: [
        "Simplify sign-up process",
        "Add testimonials at checkout",
        "Offer first-month discount",
        "Show value proposition clearly"
      ],
      impact: "High",
      effort: "Medium"
    },
    {
      icon: Users,
      title: "Reduce Churn",
      current: "12% monthly",
      target: "8% monthly",
      strategies: [
        "Send renewal reminders",
        "Improve customer support",
        "Add value-add features",
        "Create loyalty program"
      ],
      impact: "Critical",
      effort: "Medium"
    },
    {
      icon: DollarSign,
      title: "Increase ARPU",
      current: "$42",
      target: "$55",
      strategies: [
        "Introduce premium tiers",
        "Upsell annual plans",
        "Bundle additional services",
        "Add family plans"
      ],
      impact: "High",
      effort: "Low"
    },
    {
      icon: TrendingUp,
      title: "Accelerate Growth",
      current: "8% monthly",
      target: "15% monthly",
      strategies: [
        "Launch referral program",
        "Partner with local businesses",
        "Run seasonal promotions",
        "Increase marketing spend"
      ],
      impact: "High",
      effort: "High"
    }
  ];

  const optimizationTips = [
    {
      category: "Conversion Optimization",
      tips: [
        "Add live chat for immediate questions",
        "Display trust badges prominently",
        "Offer multiple payment options",
        "Show social proof (member count)",
        "Create urgency with limited-time offers"
      ]
    },
    {
      category: "Retention Strategies",
      tips: [
        "Automate renewal reminders 7 days before",
        "Send 'We miss you' emails to inactive members",
        "Offer pause option instead of cancellation",
        "Collect feedback from churning members",
        "Celebrate member milestones (anniversaries)"
      ]
    },
    {
      category: "Revenue Growth",
      tips: [
        "Promote annual plans (10-15% discount)",
        "Create family/group pricing",
        "Introduce add-on services",
        "Upsell during renewal process",
        "Partner with complementary businesses"
      ]
    },
    {
      category: "Member Acquisition",
      tips: [
        "Launch member referral rewards",
        "Run targeted Facebook/Instagram ads",
        "Host free community events",
        "Partner with corporate wellness programs",
        "Optimize for local SEO"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <Breadcrumbs
          items={[
            { label: "Support Hub", href: "/support-hub" },
            { label: "Business", href: "/support-hub/business" },
            { label: "Performance Metrics" }
          ]}
        />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="inline-block p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl shadow-lg">
            <Target className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Performance Metrics
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Track KPIs, benchmark against industry standards, and optimize your business
          </p>
        </motion.div>

        {/* Key Performance Indicators */}
        <GlassCard>
          <div className="flex items-start gap-3 mb-6">
            <Target className="w-6 h-6 text-orange-600 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Key Performance Indicators (KPIs)</h2>
              <p className="text-gray-600 mt-1">Essential metrics to track your success</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {kpis.map((kpi, index) => (
              <motion.div
                key={kpi.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-6 bg-gradient-to-br from-${kpi.color}-50 to-${kpi.color}-100 rounded-xl border-2 border-${kpi.color}-200 hover:shadow-lg transition-all`}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-12 h-12 bg-${kpi.color}-600 rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <kpi.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="text-lg font-semibold text-gray-900">{kpi.name}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        kpi.importance === "Critical" ? "bg-red-200 text-red-800" :
                        kpi.importance === "High" ? "bg-orange-200 text-orange-800" :
                        "bg-blue-200 text-blue-800"
                      } font-medium`}>
                        {kpi.importance}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{kpi.description}</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Target:</span>
                        <span className="font-semibold text-gray-900">{kpi.target}</span>
                      </div>
                      <div className="pt-2 border-t border-gray-300">
                        <p className="text-gray-500 mb-1">Formula:</p>
                        <p className="font-mono text-xs text-gray-700 bg-white p-2 rounded">{kpi.formula}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>

        {/* Industry Benchmarks */}
        <GlassCard>
          <div className="flex items-start gap-3 mb-6">
            <BarChart3 className="w-6 h-6 text-blue-600 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Industry Benchmarks</h2>
              <p className="text-gray-600 mt-1">Compare your performance to industry standards</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Category</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">Conversion</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">Retention</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">ARPU</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">Growth</th>
                </tr>
              </thead>
              <tbody>
                {industryBenchmarks.map((benchmark, index) => (
                  <tr key={benchmark.category} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4 font-medium text-gray-900">{benchmark.category}</td>
                    <td className="text-right py-4 px-4 text-gray-700">{benchmark.metrics.conversion}</td>
                    <td className="text-right py-4 px-4 text-gray-700">{benchmark.metrics.retention}</td>
                    <td className="text-right py-4 px-4 text-gray-700">{benchmark.metrics.arpu}</td>
                    <td className="text-right py-4 px-4 text-gray-700">{benchmark.metrics.growth}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900">Using Benchmarks</p>
                <p className="text-sm text-blue-800 mt-1">
                  These are industry averages. Your goals should be tailored to your specific business model,
                  location, and market conditions. Use benchmarks as guides, not rigid targets.
                </p>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Performance Comparison */}
        <GlassCard>
          <div className="flex items-start gap-3 mb-6">
            <PieChart className="w-6 h-6 text-purple-600 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Your Performance vs. Benchmarks</h2>
              <p className="text-gray-600 mt-1">See how you stack up</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Above Benchmark</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <span className="text-gray-700">Retention Rate</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-green-600">94%</span>
                    <ArrowUp className="w-4 h-4 text-green-600" />
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <span className="text-gray-700">ARPU</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-green-600">$58</span>
                    <ArrowUp className="w-4 h-4 text-green-600" />
                  </div>
                </div>
              </div>
              <p className="text-sm text-green-700 mt-4">
                ✅ Excellent! You're outperforming industry standards
              </p>
            </div>

            <div className="p-6 bg-gradient-to-br from-red-50 to-orange-50 rounded-xl border border-red-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Below Benchmark</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <span className="text-gray-700">Conversion Rate</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-red-600">52%</span>
                    <ArrowDown className="w-4 h-4 text-red-600" />
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <span className="text-gray-700">Growth Rate</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-red-600">9%</span>
                    <ArrowDown className="w-4 h-4 text-red-600" />
                  </div>
                </div>
              </div>
              <p className="text-sm text-red-700 mt-4">
                ⚠️ Opportunity to improve - see optimization tips below
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Growth Opportunities */}
        <GlassCard>
          <div className="flex items-start gap-3 mb-6">
            <Lightbulb className="w-6 h-6 text-yellow-600 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Growth Opportunities</h2>
              <p className="text-gray-600 mt-1">Actionable strategies to improve performance</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {growthOpportunities.map((opportunity, index) => (
              <motion.div
                key={opportunity.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 bg-gradient-to-br from-white to-yellow-50 rounded-xl border border-yellow-200 hover:shadow-lg transition-all"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <opportunity.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{opportunity.title}</h3>
                    <div className="flex items-center gap-4 text-sm mb-3">
                      <div>
                        <span className="text-gray-500">Current: </span>
                        <span className="font-medium text-red-600">{opportunity.current}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Target: </span>
                        <span className="font-medium text-green-600">{opportunity.target}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 mb-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        opportunity.impact === "Critical" ? "bg-red-100 text-red-800" :
                        "bg-orange-100 text-orange-800"
                      }`}>
                        {opportunity.impact} Impact
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        opportunity.effort === "Low" ? "bg-green-100 text-green-800" :
                        opportunity.effort === "Medium" ? "bg-yellow-100 text-yellow-800" :
                        "bg-red-100 text-red-800"
                      }`}>
                        {opportunity.effort} Effort
                      </span>
                    </div>
                  </div>
                </div>
                <div className="pl-16">
                  <p className="text-sm font-medium text-gray-700 mb-2">Strategies:</p>
                  <ul className="space-y-1">
                    {opportunity.strategies.map((strategy, idx) => (
                      <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>{strategy}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>

        {/* Optimization Tips */}
        <GlassCard>
          <div className="flex items-start gap-3 mb-6">
            <Zap className="w-6 h-6 text-indigo-600 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Optimization Tips</h2>
              <p className="text-gray-600 mt-1">Proven tactics to boost each metric</p>
            </div>
          </div>

          <div className="space-y-6">
            {optimizationTips.map((section, index) => (
              <motion.div
                key={section.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-200"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{section.category}</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {section.tips.map((tip, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200">
                      <CheckCircle className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{tip}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200">
            <div className="flex gap-3">
              <Lightbulb className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-purple-900">Implementation Priority</p>
                <p className="text-sm text-purple-800 mt-1">
                  Focus on 2-3 strategies at a time. Implement, measure results for 30 days, then adjust.
                  Quick wins: referral programs, renewal reminders, and annual plan promotions.
                </p>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Monthly Review Checklist */}
        <GlassCard>
          <div className="flex items-start gap-3 mb-6">
            <Activity className="w-6 h-6 text-teal-600 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Monthly Review Checklist</h2>
              <p className="text-gray-600 mt-1">Track your metrics consistently</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl border border-teal-200">
              <h3 className="font-semibold text-gray-900 mb-4">Week 1: Data Collection</h3>
              <ul className="space-y-2">
                {[
                  "Export monthly revenue report",
                  "Calculate new vs. churned members",
                  "Review conversion funnel stats",
                  "Check average transaction value"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-sm text-gray-700">
                    <div className="w-5 h-5 rounded border-2 border-teal-600"></div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <h3 className="font-semibold text-gray-900 mb-4">Week 2: Analysis</h3>
              <ul className="space-y-2">
                {[
                  "Compare to previous month",
                  "Identify trends and patterns",
                  "Benchmark against industry",
                  "List underperforming areas"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-sm text-gray-700">
                    <div className="w-5 h-5 rounded border-2 border-blue-600"></div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
              <h3 className="font-semibold text-gray-900 mb-4">Week 3: Strategy</h3>
              <ul className="space-y-2">
                {[
                  "Choose 2-3 improvement areas",
                  "Research best practices",
                  "Set specific targets",
                  "Create action plan with deadlines"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-sm text-gray-700">
                    <div className="w-5 h-5 rounded border-2 border-purple-600"></div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border border-orange-200">
              <h3 className="font-semibold text-gray-900 mb-4">Week 4: Implementation</h3>
              <ul className="space-y-2">
                {[
                  "Launch chosen initiatives",
                  "Brief team on new strategies",
                  "Set up tracking metrics",
                  "Schedule mid-month check-in"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-sm text-gray-700">
                    <div className="w-5 h-5 rounded border-2 border-orange-600"></div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </GlassCard>

        {/* Quick Actions */}
        <GlassCard>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <a href="/support-hub/business/reporting" className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg border border-purple-200 hover:shadow-lg transition-all group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 group-hover:text-purple-600 transition-colors">View Reports</p>
                  <p className="text-sm text-gray-600 mt-1">Generate detailed analytics</p>
                </div>
                <ArrowRight className="w-5 h-5 text-purple-600 group-hover:translate-x-1 transition-transform" />
              </div>
            </a>
            <a href="/support-hub/business/dashboard" className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border border-blue-200 hover:shadow-lg transition-all group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">Dashboard Guide</p>
                  <p className="text-sm text-gray-600 mt-1">Learn dashboard features</p>
                </div>
                <ArrowRight className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
              </div>
            </a>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
