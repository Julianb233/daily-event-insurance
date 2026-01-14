"use client";

import React, { useMemo } from 'react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface SparklineCardProps {
  title: string;
  value: number | React.ReactNode;
  format?: 'number' | 'currency' | 'percentage';
  change?: number | string;
  changeLabel?: string;
  subtitle?: string;
  sparklineData?: number[];
  data?: number[];
  // Some dashboards pass array as trend (legacy pattern)
  trend?: 'up' | 'down' | 'neutral' | number[];
  gradient?: string;
  icon?: React.ReactNode;
  iconColor?: string;
  sparklineColor?: string;
  color?: string;
  delay?: number;
  className?: string;
  // Comparison metrics for period-over-period
  previousPeriodValue?: number;
  showComparison?: boolean;
  comparisonLabel?: string;
}

const SparklineCard: React.FC<SparklineCardProps> = ({
  title,
  value,
  format = 'number',
  change,
  changeLabel,
  subtitle,
  sparklineData,
  data,
  trend,
  gradient = 'from-indigo-500 to-indigo-600',
  icon,
  iconColor,
  sparklineColor,
  color,
  delay = 0,
  className = '',
  previousPeriodValue,
  showComparison = false,
  comparisonLabel = 'vs previous period',
}) => {
  // Handle case where trend is passed as array (legacy pattern)
  const trendAsArray = Array.isArray(trend) ? trend : undefined;
  const trendDirection = Array.isArray(trend) ? undefined : trend;

  // Use sparklineData, data, or trend array for the chart
  const chartSourceData = sparklineData || data || trendAsArray || [];

  // Map color name to sparkline color
  const colorMap: Record<string, string> = {
    violet: '#8B5CF6',
    blue: '#3B82F6',
    emerald: '#10B981',
    amber: '#F59E0B',
    red: '#EF4444',
    green: '#22C55E',
    purple: '#A855F7',
    indigo: '#6366F1',
  };
  const finalSparklineColor = sparklineColor || (color ? colorMap[color] : undefined) || '#8B5CF6';

  // Transform data for Recharts
  const chartData = useMemo(() => {
    return chartSourceData.map((val, index) => ({
      index,
      value: val,
    }));
  }, [chartSourceData]);

  // Calculate trend and percentage change
  const { calculatedTrend, percentageChange } = useMemo(() => {
    if (chartSourceData.length < 2) {
      return { calculatedTrend: 'neutral' as const, percentageChange: 0 };
    }

    const firstValue = chartSourceData[0];
    const lastValue = chartSourceData[chartSourceData.length - 1];
    const changeVal = lastValue - firstValue;
    const percentage = firstValue !== 0 ? (changeVal / firstValue) * 100 : 0;

    let autoTrend: 'up' | 'down' | 'neutral' = 'neutral';
    if (changeVal > 0) autoTrend = 'up';
    else if (changeVal < 0) autoTrend = 'down';

    return {
      calculatedTrend: trendDirection || autoTrend,
      percentageChange: percentage,
    };
  }, [chartSourceData, trendDirection]);

  // Calculate period comparison metrics
  const comparisonMetrics = useMemo(() => {
    if (!showComparison || previousPeriodValue === undefined || typeof value !== 'number') {
      return null;
    }

    const currentValue = value as number;
    const diff = currentValue - previousPeriodValue;
    const percentChange = previousPeriodValue !== 0
      ? (diff / previousPeriodValue) * 100
      : 0;
    const compTrend: 'up' | 'down' | 'neutral' =
      diff > 0 ? 'up' : diff < 0 ? 'down' : 'neutral';

    return {
      previousValue: previousPeriodValue,
      difference: diff,
      percentChange,
      trend: compTrend,
    };
  }, [showComparison, previousPeriodValue, value]);

  // Generate gradient ID
  const gradientId = useMemo(() => {
    return `gradient-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  const getTrendIcon = () => {
    switch (calculatedTrend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      case 'neutral':
      default:
        return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const getTrendColor = () => {
    switch (calculatedTrend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      case 'neutral':
      default:
        return 'text-gray-500';
    }
  };

  const formatValue = (val: number | React.ReactNode) => {
    if (React.isValidElement(val)) return val;
    if (typeof val !== 'number') return val;

    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(val);
      case 'percentage':
        return `${val.toFixed(1)}%`;
      default:
        return new Intl.NumberFormat('en-US').format(val);
    }
  };

  const formatChange = (val: number | string | undefined) => {
    if (val === undefined) return null;
    if (typeof val === 'string') return val;
    return val > 0 ? `+${val.toFixed(1)}%` : `${val.toFixed(1)}%`;
  };

  return (
    <div
      className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 ${className}`}
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {formatValue(value)}
          </p>
          {subtitle && (
            <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className={`p-2 bg-gradient-to-br ${gradient} rounded-lg text-white ${iconColor || ''}`}>
            {icon}
          </div>
        )}
      </div>

      {chartSourceData.length > 0 && (
        <div className="w-full h-12 mb-3">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={finalSparklineColor} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={finalSparklineColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke={finalSparklineColor}
                strokeWidth={2}
                fill={`url(#${gradientId})`}
                animationDuration={800}
                animationEasing="ease-in-out"
                dot={false}
                activeDot={false}
                isAnimationActive={true}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {(change !== undefined || percentageChange !== 0) && (
        <div className="flex items-center gap-1.5 text-xs">
          {getTrendIcon()}
          <span className={`font-medium ${getTrendColor()}`}>
            {formatChange(change) || `${percentageChange > 0 ? '+' : ''}${percentageChange.toFixed(1)}%`}
          </span>
          {changeLabel && (
            <span className="text-gray-400">{changeLabel}</span>
          )}
        </div>
      )}

      {/* Period Comparison Metrics */}
      {comparisonMetrics && (
        <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">{comparisonLabel}</span>
            <div className="flex items-center gap-1.5">
              {comparisonMetrics.trend === 'up' ? (
                <TrendingUp className="w-3 h-3 text-green-500" />
              ) : comparisonMetrics.trend === 'down' ? (
                <TrendingDown className="w-3 h-3 text-red-500" />
              ) : (
                <Minus className="w-3 h-3 text-gray-400" />
              )}
              <span className={`font-medium ${
                comparisonMetrics.trend === 'up'
                  ? 'text-green-600'
                  : comparisonMetrics.trend === 'down'
                  ? 'text-red-600'
                  : 'text-gray-500'
              }`}>
                {comparisonMetrics.percentChange > 0 ? '+' : ''}
                {comparisonMetrics.percentChange.toFixed(1)}%
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs mt-1">
            <span className="text-gray-400">Previous: {formatValue(comparisonMetrics.previousValue)}</span>
            <span className={`font-medium ${
              comparisonMetrics.trend === 'up'
                ? 'text-green-600'
                : comparisonMetrics.trend === 'down'
                ? 'text-red-600'
                : 'text-gray-500'
            }`}>
              {comparisonMetrics.difference > 0 ? '+' : ''}
              {formatValue(comparisonMetrics.difference)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

const MemoizedSparklineCard = React.memo(SparklineCard);
export { MemoizedSparklineCard as SparklineCard };
export default MemoizedSparklineCard;
