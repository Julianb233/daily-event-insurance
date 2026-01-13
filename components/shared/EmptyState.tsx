import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: "primary" | "secondary";
  };
  variant?: "default" | "compact";
  className?: string;
}

/**
 * Empty State Component
 * Displays an empty state with icon, title, description, and optional action
 */
export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  variant = "default",
  className,
}: EmptyStateProps) {
  const isCompact = variant === "compact";

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        isCompact ? "py-8" : "py-12",
        className
      )}
    >
      {/* Icon Circle */}
      <div
        className={cn(
          "mb-4 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800",
          isCompact ? "h-12 w-12" : "h-16 w-16"
        )}
      >
        <Icon
          className={cn(
            "text-gray-400 dark:text-gray-600",
            isCompact ? "h-6 w-6" : "h-8 w-8"
          )}
        />
      </div>

      {/* Title */}
      <h3
        className={cn(
          "font-semibold text-gray-900 dark:text-gray-100",
          isCompact ? "mb-1 text-base" : "mb-2 text-lg"
        )}
      >
        {title}
      </h3>

      {/* Description */}
      <p
        className={cn(
          "text-gray-600 dark:text-gray-400",
          isCompact ? "mb-4 text-sm" : "mb-6 max-w-sm text-sm"
        )}
      >
        {description}
      </p>

      {/* Action Button */}
      {action && (
        <button
          onClick={action.onClick}
          className={cn(
            "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
            action.variant === "secondary"
              ? "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              : "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600"
          )}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

/**
 * Named Export
 */
export { EmptyState };

/**
 * Pre-configured Empty State Variants
 */

export function EmptyStateNoData({
  title = "No data available",
  description = "There's nothing to show here yet.",
  action,
  className,
}: Omit<EmptyStateProps, "icon"> & { icon?: LucideIcon }) {
  const { Database } = require("lucide-react");
  return (
    <EmptyState
      icon={Database}
      title={title}
      description={description}
      action={action}
      className={className}
    />
  );
}

export function EmptyStateNoResults({
  title = "No results found",
  description = "Try adjusting your search or filter to find what you're looking for.",
  action,
  className,
}: Omit<EmptyStateProps, "icon"> & { icon?: LucideIcon }) {
  const { Search } = require("lucide-react");
  return (
    <EmptyState
      icon={Search}
      title={title}
      description={description}
      action={action}
      className={className}
    />
  );
}

export function EmptyStateError({
  title = "Something went wrong",
  description = "We encountered an error loading this data. Please try again.",
  action,
  className,
}: Omit<EmptyStateProps, "icon"> & { icon?: LucideIcon }) {
  const { AlertCircle } = require("lucide-react");
  return (
    <EmptyState
      icon={AlertCircle}
      title={title}
      description={description}
      action={action}
      className={className}
    />
  );
}

export function EmptyStateNoPermission({
  title = "Access denied",
  description = "You don't have permission to view this content.",
  action,
  className,
}: Omit<EmptyStateProps, "icon"> & { icon?: LucideIcon }) {
  const { Lock } = require("lucide-react");
  return (
    <EmptyState
      icon={Lock}
      title={title}
      description={description}
      action={action}
      className={className}
    />
  );
}
