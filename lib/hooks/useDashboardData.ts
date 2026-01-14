"use client"

import { useState, useEffect, useCallback, useRef } from 'react'

type RefreshInterval = 30 | 60 | 300 | 0 // seconds, 0 = off

interface UseDashboardDataOptions<T> {
  fetchFn: () => Promise<T>
  initialData?: T
  autoRefreshInterval?: RefreshInterval
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
  revalidateOnFocus?: boolean
  revalidateOnReconnect?: boolean
  dedupingInterval?: number // ms to dedupe requests
}

interface UseDashboardDataReturn<T> {
  data: T | null
  error: Error | null
  isLoading: boolean
  isRefreshing: boolean
  isValidating: boolean
  lastUpdated: Date | null
  autoRefreshInterval: RefreshInterval
  setAutoRefreshInterval: (interval: RefreshInterval) => void
  refresh: () => Promise<void>
  mutate: (data: T | ((prev: T | null) => T)) => void
}

export function useDashboardData<T>({
  fetchFn,
  initialData,
  autoRefreshInterval: initialInterval = 0,
  onSuccess,
  onError,
  revalidateOnFocus = true,
  revalidateOnReconnect = true,
  dedupingInterval = 2000,
}: UseDashboardDataOptions<T>): UseDashboardDataReturn<T> {
  const [data, setData] = useState<T | null>(initialData ?? null)
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState(!initialData)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [autoRefreshInterval, setAutoRefreshInterval] = useState<RefreshInterval>(initialInterval)

  const lastFetchTime = useRef<number>(0)
  const isMounted = useRef(true)
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Core fetch function with deduplication
  const fetchData = useCallback(async (isManualRefresh = false) => {
    const now = Date.now()

    // Dedupe requests within interval
    if (now - lastFetchTime.current < dedupingInterval && !isManualRefresh) {
      return
    }

    lastFetchTime.current = now

    // Set loading states
    if (!data) {
      setIsLoading(true)
    } else if (isManualRefresh) {
      setIsRefreshing(true)
    } else {
      setIsValidating(true)
    }

    try {
      const result = await fetchFn()

      if (isMounted.current) {
        setData(result)
        setError(null)
        setLastUpdated(new Date())
        onSuccess?.(result)
      }
    } catch (err) {
      if (isMounted.current) {
        const error = err instanceof Error ? err : new Error('Failed to fetch data')
        setError(error)
        onError?.(error)
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false)
        setIsRefreshing(false)
        setIsValidating(false)
      }
    }
  }, [fetchFn, data, dedupingInterval, onSuccess, onError])

  // Manual refresh function
  const refresh = useCallback(async () => {
    await fetchData(true)
  }, [fetchData])

  // Optimistic update / mutate function
  const mutate = useCallback((newData: T | ((prev: T | null) => T)) => {
    setData((prev) => {
      if (typeof newData === 'function') {
        return (newData as (prev: T | null) => T)(prev)
      }
      return newData
    })
    setLastUpdated(new Date())
  }, [])

  // Initial fetch
  useEffect(() => {
    isMounted.current = true
    fetchData()

    return () => {
      isMounted.current = false
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-refresh timer
  useEffect(() => {
    if (refreshTimerRef.current) {
      clearInterval(refreshTimerRef.current)
      refreshTimerRef.current = null
    }

    if (autoRefreshInterval > 0) {
      refreshTimerRef.current = setInterval(() => {
        fetchData(false)
      }, autoRefreshInterval * 1000)
    }

    return () => {
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current)
      }
    }
  }, [autoRefreshInterval, fetchData])

  // Revalidate on focus
  useEffect(() => {
    if (!revalidateOnFocus) return

    const handleFocus = () => {
      fetchData(false)
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [revalidateOnFocus, fetchData])

  // Revalidate on reconnect
  useEffect(() => {
    if (!revalidateOnReconnect) return

    const handleOnline = () => {
      fetchData(false)
    }

    window.addEventListener('online', handleOnline)
    return () => window.removeEventListener('online', handleOnline)
  }, [revalidateOnReconnect, fetchData])

  return {
    data,
    error,
    isLoading,
    isRefreshing,
    isValidating,
    lastUpdated,
    autoRefreshInterval,
    setAutoRefreshInterval,
    refresh,
    mutate,
  }
}

// Specialized hook for multiple data sources
interface MultiSourceOptions<T extends Record<string, unknown>> {
  sources: {
    [K in keyof T]: {
      fetchFn: () => Promise<T[K]>
      autoRefresh?: boolean
    }
  }
  autoRefreshInterval?: RefreshInterval
}

export function useMultiSourceDashboard<T extends Record<string, unknown>>({
  sources,
  autoRefreshInterval = 0,
}: MultiSourceOptions<T>) {
  const [data, setData] = useState<Partial<T>>({})
  const [errors, setErrors] = useState<Partial<Record<keyof T, Error>>>({})
  const [loading, setLoading] = useState<Partial<Record<keyof T, boolean>>>({})
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [refreshInterval, setRefreshInterval] = useState<RefreshInterval>(autoRefreshInterval)

  const fetchAll = useCallback(async () => {
    const keys = Object.keys(sources) as (keyof T)[]

    // Set all to loading
    setLoading(keys.reduce((acc, key) => ({ ...acc, [key]: true }), {}))

    const results = await Promise.allSettled(
      keys.map(async (key) => {
        const result = await sources[key].fetchFn()
        return { key, result }
      })
    )

    const newData: Partial<T> = {}
    const newErrors: Partial<Record<keyof T, Error>> = {}

    results.forEach((result, index) => {
      const key = keys[index]
      if (result.status === 'fulfilled') {
        newData[key] = result.value.result
      } else {
        newErrors[key] = result.reason instanceof Error
          ? result.reason
          : new Error('Failed to fetch')
      }
    })

    setData(newData)
    setErrors(newErrors)
    setLoading(keys.reduce((acc, key) => ({ ...acc, [key]: false }), {}))
    setLastUpdated(new Date())
  }, [sources])

  // Initial fetch
  useEffect(() => {
    fetchAll()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-refresh
  useEffect(() => {
    if (refreshInterval === 0) return

    const timer = window.setInterval(fetchAll, refreshInterval * 1000)
    return () => window.clearInterval(timer)
  }, [refreshInterval, fetchAll])

  return {
    data,
    errors,
    loading,
    lastUpdated,
    autoRefreshInterval: refreshInterval,
    setAutoRefreshInterval: setRefreshInterval,
    refresh: fetchAll,
    isLoading: Object.values(loading).some(Boolean),
    hasErrors: Object.keys(errors).length > 0,
  }
}

// Hook for tracking comparison metrics
interface ComparisonMetrics {
  current: number
  previous: number
  change: number
  changePercent: number
  trend: 'up' | 'down' | 'neutral'
}

export function useComparisonMetrics(
  current: number,
  previous: number
): ComparisonMetrics {
  const change = current - previous
  const changePercent = previous !== 0 ? (change / previous) * 100 : 0
  const trend: 'up' | 'down' | 'neutral' =
    change > 0 ? 'up' : change < 0 ? 'down' : 'neutral'

  return {
    current,
    previous,
    change,
    changePercent,
    trend,
  }
}

// Calculate period over period comparison
export function calculatePeriodComparison(
  currentData: number[],
  previousData: number[]
): {
  currentTotal: number
  previousTotal: number
  change: number
  changePercent: number
  trend: 'up' | 'down' | 'neutral'
} {
  const currentTotal = currentData.reduce((sum, val) => sum + val, 0)
  const previousTotal = previousData.reduce((sum, val) => sum + val, 0)
  const change = currentTotal - previousTotal
  const changePercent = previousTotal !== 0 ? (change / previousTotal) * 100 : 0
  const trend: 'up' | 'down' | 'neutral' =
    change > 0 ? 'up' : change < 0 ? 'down' : 'neutral'

  return {
    currentTotal,
    previousTotal,
    change,
    changePercent,
    trend,
  }
}

export default useDashboardData
