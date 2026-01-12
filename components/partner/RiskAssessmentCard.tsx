"use client"

import { motion } from "framer-motion"
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Info,
  TrendingUp,
  Activity,
} from "lucide-react"
import type { RiskAssessment } from "@/lib/pricing"

interface RiskAssessmentCardProps {
  assessment: RiskAssessment
  showDetails?: boolean
}

export function RiskAssessmentCard({ assessment, showDetails = true }: RiskAssessmentCardProps) {
  const getRiskLevelConfig = (level: string) => {
    switch (level) {
      case "low":
        return {
          color: "text-green-600",
          bg: "bg-green-100",
          icon: CheckCircle2,
          label: "Low Risk",
          description: "Standard processing approved",
        }
      case "medium":
        return {
          color: "text-blue-600",
          bg: "bg-blue-100",
          icon: Shield,
          label: "Medium Risk",
          description: "Normal underwriting process",
        }
      case "high":
        return {
          color: "text-amber-600",
          bg: "bg-amber-100",
          icon: AlertTriangle,
          label: "High Risk",
          description: "Enhanced review recommended",
        }
      case "very-high":
        return {
          color: "text-red-600",
          bg: "bg-red-100",
          icon: AlertTriangle,
          label: "Very High Risk",
          description: "Manual review required",
        }
      default:
        return {
          color: "text-slate-600",
          bg: "bg-slate-100",
          icon: Info,
          label: "Unknown",
          description: "Assessment pending",
        }
    }
  }

  const getDecisionConfig = (decision: string) => {
    switch (decision) {
      case "auto-approve":
        return {
          color: "text-green-600",
          bg: "bg-green-100",
          icon: CheckCircle2,
          label: "Auto-Approved",
        }
      case "review-required":
        return {
          color: "text-amber-600",
          bg: "bg-amber-100",
          icon: AlertTriangle,
          label: "Review Required",
        }
      case "decline":
        return {
          color: "text-red-600",
          bg: "bg-red-100",
          icon: XCircle,
          label: "Declined",
        }
      default:
        return {
          color: "text-slate-600",
          bg: "bg-slate-100",
          icon: Info,
          label: "Pending",
        }
    }
  }

  const riskConfig = getRiskLevelConfig(assessment.overallRisk)
  const decisionConfig = getDecisionConfig(assessment.decision)
  const RiskIcon = riskConfig.icon
  const DecisionIcon = decisionConfig.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden"
    >
      {/* Header */}
      <div className={`${riskConfig.bg} px-6 py-4 border-b border-slate-200`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <RiskIcon className={`w-6 h-6 ${riskConfig.color}`} />
            <div>
              <h3 className={`text-lg font-bold ${riskConfig.color}`}>{riskConfig.label}</h3>
              <p className="text-sm text-slate-600">{riskConfig.description}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-600">Risk Score</p>
            <p className={`text-2xl font-bold ${riskConfig.color}`}>{assessment.riskScore}</p>
            <p className="text-xs text-slate-500">out of 100</p>
          </div>
        </div>
      </div>

      {/* Decision Banner */}
      <div className={`${decisionConfig.bg} px-6 py-3 border-b border-slate-200`}>
        <div className="flex items-center gap-2">
          <DecisionIcon className={`w-5 h-5 ${decisionConfig.color}`} />
          <span className={`font-semibold ${decisionConfig.color}`}>
            Underwriting Decision: {decisionConfig.label}
          </span>
        </div>
        {assessment.declineReasons && assessment.declineReasons.length > 0 && (
          <div className="mt-2 ml-7">
            <p className="text-sm text-slate-600 font-medium mb-1">Reasons:</p>
            <ul className="space-y-1">
              {assessment.declineReasons.map((reason, idx) => (
                <li key={idx} className="text-sm text-slate-700">
                  • {reason}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Details */}
      {showDetails && (
        <div className="p-6 space-y-6">
          {/* Risk Factors */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4 text-teal-600" />
              Risk Factor Analysis
            </h4>
            <div className="space-y-3">
              {assessment.factors.map((factor, idx) => {
                const impact = factor.severity > 7 ? "high" : factor.severity > 4 ? "medium" : "low"
                const impactColor =
                  impact === "high"
                    ? "text-red-600"
                    : impact === "medium"
                    ? "text-amber-600"
                    : "text-green-600"

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-slate-50 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h5 className="font-semibold text-slate-900">{factor.category}</h5>
                        <p className="text-sm text-slate-600 mt-1">{factor.description}</p>
                      </div>
                      <div className="text-right ml-4">
                        <p className={`text-lg font-bold ${impactColor}`}>
                          +{factor.severity.toFixed(1)}
                        </p>
                        <p className="text-xs text-slate-500">risk points</p>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                        <span>Impact Level</span>
                        <span className="capitalize">{impact}</span>
                      </div>
                      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(factor.severity / 10) * 100}%` }}
                          transition={{ delay: idx * 0.05 + 0.2, duration: 0.5 }}
                          className={`h-full ${
                            impact === "high"
                              ? "bg-red-500"
                              : impact === "medium"
                              ? "bg-amber-500"
                              : "bg-green-500"
                          }`}
                        />
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Recommendations */}
          {assessment.recommendations && assessment.recommendations.length > 0 && (
            <div>
              <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-teal-600" />
                Recommendations
              </h4>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <ul className="space-y-2">
                  {assessment.recommendations.map((rec, idx) => (
                    <li key={idx} className="text-sm text-blue-900 flex items-start gap-2">
                      <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Risk Summary */}
          <div className="bg-slate-50 rounded-lg p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-xs text-slate-600 mb-1">Risk Score</p>
                <p className={`text-xl font-bold ${riskConfig.color}`}>{assessment.riskScore}</p>
              </div>
              <div>
                <p className="text-xs text-slate-600 mb-1">Risk Level</p>
                <p className={`text-sm font-semibold ${riskConfig.color} uppercase`}>
                  {assessment.overallRisk}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-600 mb-1">Factors</p>
                <p className="text-xl font-bold text-slate-900">{assessment.factors.length}</p>
              </div>
              <div>
                <p className="text-xs text-slate-600 mb-1">Decision</p>
                <p className={`text-sm font-semibold ${decisionConfig.color} uppercase`}>
                  {assessment.decision}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}
