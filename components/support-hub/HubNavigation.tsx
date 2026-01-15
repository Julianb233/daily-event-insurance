"use client"

import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronRight, Home } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface NavigationItem {
  id: string
  title: string
  href?: string
  children?: NavigationItem[]
  isActive?: boolean
}

interface HubNavigationProps {
  items: NavigationItem[]
  breadcrumbs?: Array<{ label: string; href: string }>
  onItemClick?: (item: NavigationItem) => void
  className?: string
}

export function HubNavigation({
  items,
  breadcrumbs,
  onItemClick,
  className,
}: HubNavigationProps) {
  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumbs breadcrumbs={breadcrumbs} />
      )}

      {/* Navigation Tree */}
      <nav className="space-y-1">
        {items.map((item, index) => (
          <NavigationNode
            key={item.id}
            item={item}
            level={0}
            index={index}
            onClick={onItemClick}
          />
        ))}
      </nav>
    </div>
  )
}

interface BreadcrumbsProps {
  breadcrumbs: Array<{ label: string; href: string }>
}

function Breadcrumbs({ breadcrumbs }: BreadcrumbsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-2 text-sm px-4 py-3 bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200/50"
    >
      <Home className="w-4 h-4 text-slate-400" />
      {breadcrumbs.map((crumb, index) => (
        <div key={index} className="flex items-center gap-2">
          <ChevronRight className="w-4 h-4 text-slate-300" />
          <motion.a
            href={crumb.href}
            whileHover={{ x: 2 }}
            className={cn(
              "transition-colors",
              index === breadcrumbs.length - 1
                ? "text-slate-900 font-medium"
                : "text-slate-600 hover:text-teal-600"
            )}
          >
            {crumb.label}
          </motion.a>
        </div>
      ))}
    </motion.div>
  )
}

interface NavigationNodeProps {
  item: NavigationItem
  level: number
  index: number
  onClick?: (item: NavigationItem) => void
}

function NavigationNode({ item, level, index, onClick }: NavigationNodeProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const hasChildren = item.children && item.children.length > 0

  const handleClick = () => {
    if (hasChildren) {
      setIsExpanded(!isExpanded)
    }
    onClick?.(item)
  }

  return (
    <div>
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
        onClick={handleClick}
        className={cn(
          "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all group",
          item.isActive
            ? "bg-gradient-to-r from-teal-50 to-sky-50 text-teal-700 font-medium shadow-sm border border-teal-200/50"
            : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
        )}
        style={{ paddingLeft: `${level * 16 + 16}px` }}
      >
        {/* Expand/Collapse Icon */}
        {hasChildren && (
          <motion.div
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
            className="flex-shrink-0"
          >
            <ChevronRight
              className={cn(
                "w-4 h-4 transition-colors",
                item.isActive ? "text-teal-600" : "text-slate-400 group-hover:text-slate-600"
              )}
            />
          </motion.div>
        )}

        {/* Title */}
        <span className={cn(
          "flex-1 text-sm",
          !hasChildren && "ml-7"
        )}>
          {item.title}
        </span>

        {/* Active Indicator */}
        {item.isActive && (
          <motion.div
            layoutId="activeIndicator"
            className="w-2 h-2 rounded-full bg-teal-600"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
      </motion.button>

      {/* Children */}
      <AnimatePresence>
        {hasChildren && isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="py-1">
              {item.children!.map((child, childIndex) => (
                <NavigationNode
                  key={child.id}
                  item={child}
                  level={level + 1}
                  index={childIndex}
                  onClick={onClick}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
