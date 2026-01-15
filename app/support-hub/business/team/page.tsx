"use client";

import { motion } from "framer-motion";
import {
  Users,
  UserPlus,
  Shield,
  MapPin,
  Mail,
  CheckCircle,
  XCircle,
  AlertCircle,
  Crown,
  Eye,
  Edit,
  Trash2,
  ArrowRight,
  Lock,
  Settings
} from "lucide-react";
import { GlassCard } from "@/components/support-hub/GlassCard";
import { Breadcrumbs } from "@/components/support-hub/Breadcrumbs";
import { StepByStep } from "@/components/support-hub/StepByStep";

export default function TeamPage() {
  const roles = [
    {
      name: "Owner",
      icon: Crown,
      description: "Full access to all features and settings",
      permissions: [
        "Manage all locations",
        "Add/remove team members",
        "Change billing settings",
        "View all reports",
        "Delete account"
      ],
      color: "purple",
      limit: "1 per account"
    },
    {
      name: "Admin",
      icon: Shield,
      description: "Manage operations and team members",
      permissions: [
        "Manage assigned locations",
        "Add/edit team members",
        "View financial reports",
        "Configure integrations",
        "Manage members"
      ],
      color: "blue",
      limit: "Unlimited"
    },
    {
      name: "Manager",
      icon: Users,
      description: "Oversee daily operations",
      permissions: [
        "View assigned locations",
        "Add members",
        "View reports",
        "Download invoices",
        "Cannot change settings"
      ],
      color: "green",
      limit: "Unlimited"
    },
    {
      name: "Staff",
      icon: Eye,
      description: "View-only access for team members",
      permissions: [
        "View member list",
        "See basic reports",
        "Check coverage status",
        "Cannot edit anything",
        "Read-only dashboard"
      ],
      color: "gray",
      limit: "Unlimited"
    }
  ];

  const addMemberSteps = [
    {
      title: "Navigate to Team Settings",
      description: "Go to Dashboard → Settings → Team Management"
    },
    {
      title: "Click 'Add Team Member'",
      description: "Click the blue 'Add Team Member' button in the top right"
    },
    {
      title: "Enter User Details",
      description: "Provide email address, first name, and last name"
    },
    {
      title: "Assign Role",
      description: "Select appropriate role: Owner, Admin, Manager, or Staff"
    },
    {
      title: "Set Location Access",
      description: "Choose which locations this user can access (if multi-location)"
    },
    {
      title: "Send Invitation",
      description: "Click 'Send Invite' - user receives email with setup instructions"
    }
  ];

  const locationAccessExamples = [
    {
      member: "Sarah Johnson",
      role: "Admin",
      locations: ["Downtown Studio", "Brooklyn Branch"],
      permissions: "Full access to both locations"
    },
    {
      member: "Mike Chen",
      role: "Manager",
      locations: ["Downtown Studio"],
      permissions: "Manage only Downtown Studio"
    },
    {
      member: "Lisa Park",
      role: "Staff",
      locations: ["All Locations"],
      permissions: "View-only across all locations"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <Breadcrumbs
          items={[
            { label: "Support Hub", href: "/support-hub" },
            { label: "Business", href: "/support-hub/business" },
            { label: "Team Management" }
          ]}
        />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="inline-block p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Team Management
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Add team members, assign roles, and manage access permissions
          </p>
        </motion.div>

        {/* User Roles & Permissions */}
        <GlassCard>
          <div className="flex items-start gap-3 mb-6">
            <Shield className="w-6 h-6 text-blue-600 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">User Roles & Permissions</h2>
              <p className="text-gray-600 mt-1">Understand access levels for your team</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {roles.map((role, index) => (
              <motion.div
                key={role.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-6 bg-gradient-to-br from-${role.color}-50 to-${role.color}-100 rounded-xl border-2 border-${role.color}-200 hover:shadow-lg transition-all`}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-12 h-12 bg-${role.color}-600 rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <role.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-lg font-semibold text-gray-900">{role.name}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full bg-${role.color}-200 text-${role.color}-800 font-medium`}>
                        {role.limit}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{role.description}</p>
                  </div>
                </div>
                <ul className="space-y-2">
                  {role.permissions.map((permission) => (
                    <li key={permission} className="text-sm text-gray-700 flex items-start gap-2">
                      <CheckCircle className={`w-4 h-4 text-${role.color}-600 flex-shrink-0 mt-0.5`} />
                      <span>{permission}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900">Role Assignment Best Practices</p>
                <ul className="text-sm text-blue-800 mt-2 space-y-1 ml-4 list-disc">
                  <li>Only assign Admin role to trusted team members who need full access</li>
                  <li>Use Manager role for day-to-day operations staff</li>
                  <li>Staff role is perfect for front desk or customer service team members</li>
                  <li>You can change roles anytime without affecting user data</li>
                </ul>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Adding Team Members */}
        <GlassCard>
          <div className="flex items-start gap-3 mb-6">
            <UserPlus className="w-6 h-6 text-green-600 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Adding Team Members</h2>
              <p className="text-gray-600 mt-1">Step-by-step guide to inviting users</p>
            </div>
          </div>

          <StepByStep steps={addMemberSteps} />

          <div className="mt-6 space-y-4">
            <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Invitation Process</h3>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 mb-1">Email Invitation Sent</p>
                    <p className="text-sm text-gray-600">
                      User receives email with subject "You've been invited to join Daily Event Insurance"
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Lock className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 mb-1">Account Setup</p>
                    <p className="text-sm text-gray-600">
                      User clicks link, creates password, and sets up their profile
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 mb-1">Access Granted</p>
                    <p className="text-sm text-gray-600">
                      User can immediately log in with their assigned permissions
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <CheckCircle className="w-5 h-5 text-green-600 mb-2" />
                <p className="font-medium text-gray-900 mb-1">Invitation Tips</p>
                <ul className="text-sm text-gray-600 space-y-1 ml-4 list-disc">
                  <li>Invitations expire after 7 days</li>
                  <li>You can resend invitations anytime</li>
                  <li>Users must verify their email</li>
                  <li>Pending invites show in Team list</li>
                </ul>
              </div>

              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <AlertCircle className="w-5 h-5 text-orange-600 mb-2" />
                <p className="font-medium text-gray-900 mb-1">Common Issues</p>
                <ul className="text-sm text-gray-600 space-y-1 ml-4 list-disc">
                  <li>Check spam/junk folders</li>
                  <li>Verify email address spelling</li>
                  <li>User must use invite link</li>
                  <li>Contact support if blocked</li>
                </ul>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Location-Specific Access */}
        <GlassCard>
          <div className="flex items-start gap-3 mb-6">
            <MapPin className="w-6 h-6 text-purple-600 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Location-Specific Access</h2>
              <p className="text-gray-600 mt-1">Control which locations team members can access</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Access Control Examples</h3>

              <div className="space-y-3">
                {locationAccessExamples.map((example, index) => (
                  <div key={index} className="p-4 bg-white rounded-lg border border-gray-200">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium text-gray-900">{example.member}</p>
                        <span className="inline-block px-2 py-1 mt-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                          {example.role}
                        </span>
                      </div>
                      <button className="text-gray-500 hover:text-gray-700">
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-purple-600" />
                        <span>{example.locations.join(", ")}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">{example.permissions}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 bg-white rounded-xl border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">How to Set Location Access</h3>
                <ol className="space-y-3 text-sm text-gray-700">
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center font-semibold text-xs">1</span>
                    <span>Go to Team Management → Select user</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center font-semibold text-xs">2</span>
                    <span>Click "Edit Permissions"</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center font-semibold text-xs">3</span>
                    <span>Under "Location Access", select locations</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center font-semibold text-xs">4</span>
                    <span>Choose "All Locations" or specific ones</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center font-semibold text-xs">5</span>
                    <span>Save changes - takes effect immediately</span>
                  </li>
                </ol>
              </div>

              <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                <h3 className="font-semibold text-gray-900 mb-4">Access Scenarios</h3>
                <div className="space-y-3 text-sm">
                  <div className="p-3 bg-white rounded-lg">
                    <p className="font-medium text-gray-900 mb-1">Franchise Model</p>
                    <p className="text-gray-600">Give each franchisee Admin access to only their location(s)</p>
                  </div>
                  <div className="p-3 bg-white rounded-lg">
                    <p className="font-medium text-gray-900 mb-1">Regional Managers</p>
                    <p className="text-gray-600">Assign managers to multiple locations in their region</p>
                  </div>
                  <div className="p-3 bg-white rounded-lg">
                    <p className="font-medium text-gray-900 mb-1">Centralized Operations</p>
                    <p className="text-gray-600">Grant staff view-only access to all locations for reporting</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Managing Existing Users */}
        <GlassCard>
          <div className="flex items-start gap-3 mb-6">
            <Settings className="w-6 h-6 text-orange-600 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Managing Existing Team Members</h2>
              <p className="text-gray-600 mt-1">Edit roles, change permissions, and remove access</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border border-orange-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Actions</h3>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-white rounded-lg border border-gray-200">
                  <Edit className="w-6 h-6 text-blue-600 mb-3" />
                  <p className="font-medium text-gray-900 mb-2">Edit Details</p>
                  <p className="text-sm text-gray-600">Update name, email, or role assignments</p>
                </div>

                <div className="p-4 bg-white rounded-lg border border-gray-200">
                  <Shield className="w-6 h-6 text-purple-600 mb-3" />
                  <p className="font-medium text-gray-900 mb-2">Change Role</p>
                  <p className="text-sm text-gray-600">Promote or adjust access levels</p>
                </div>

                <div className="p-4 bg-white rounded-lg border border-gray-200">
                  <XCircle className="w-6 h-6 text-red-600 mb-3" />
                  <p className="font-medium text-gray-900 mb-2">Suspend Access</p>
                  <p className="text-sm text-gray-600">Temporarily disable without removing</p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 bg-white rounded-xl border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Changing User Roles</h3>
                <p className="text-sm text-gray-600 mb-4">
                  You can change any user's role at any time. Changes take effect immediately
                  and the user will see updated permissions on next login.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Staff → Manager</span>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Manager → Admin</span>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Admin → Manager</span>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="p-6 bg-gradient-to-br from-red-50 to-pink-50 rounded-xl border border-red-200">
                <h3 className="font-semibold text-gray-900 mb-4">Removing Team Members</h3>
                <p className="text-sm text-gray-600 mb-4">
                  When you remove a team member, they immediately lose access to your account.
                  This action cannot be undone - you'll need to re-invite them.
                </p>
                <div className="p-4 bg-white rounded-lg border border-red-300">
                  <div className="flex gap-3">
                    <Trash2 className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-red-900 mb-1">To Remove Access:</p>
                      <ol className="text-sm text-gray-700 space-y-1 ml-4 list-decimal">
                        <li>Go to Team Management</li>
                        <li>Find user in list</li>
                        <li>Click three-dot menu (⋮)</li>
                        <li>Select "Remove User"</li>
                        <li>Confirm removal</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-900">Important Notes</p>
                  <ul className="text-sm text-yellow-800 mt-2 space-y-1 ml-4 list-disc">
                    <li>Removed users lose access immediately and cannot log in</li>
                    <li>Their activity history is preserved for audit purposes</li>
                    <li>To temporarily disable access, use "Suspend" instead of remove</li>
                    <li>Only Owners and Admins can remove team members</li>
                    <li>You cannot remove yourself - transfer ownership first</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Team Size & Billing */}
        <GlassCard>
          <div className="flex items-start gap-3 mb-6">
            <Users className="w-6 h-6 text-teal-600 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Team Size & Billing</h2>
              <p className="text-gray-600 mt-1">Understand costs and limits</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl border border-teal-200">
              <h3 className="font-semibold text-gray-900 mb-4">Included Team Members</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Starter Plan</p>
                    <p className="text-sm text-gray-600">Basic partnership</p>
                  </div>
                  <span className="text-2xl font-bold text-teal-600">3 users</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-white rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Growth Plan</p>
                    <p className="text-sm text-gray-600">Growing business</p>
                  </div>
                  <span className="text-2xl font-bold text-teal-600">10 users</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-white rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Enterprise Plan</p>
                    <p className="text-sm text-gray-600">Large organization</p>
                  </div>
                  <span className="text-2xl font-bold text-teal-600">Unlimited</span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <h3 className="font-semibold text-gray-900 mb-4">Additional Users</h3>
              <p className="text-sm text-gray-600 mb-4">
                Need more team members than your plan includes? We've got you covered.
              </p>
              <div className="space-y-4">
                <div className="p-4 bg-white rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">Cost per additional user</span>
                    <span className="text-xl font-bold text-blue-600">$10/month</span>
                  </div>
                  <p className="text-sm text-gray-600">Billed monthly, cancel anytime</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    💡 <strong>Pro Tip:</strong> Consider upgrading to Growth or Enterprise plan
                    if you need 5+ additional users - it's more cost-effective.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Quick Actions */}
        <GlassCard>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <a href="/support-hub/business/dashboard" className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg border border-indigo-200 hover:shadow-lg transition-all group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">Dashboard Guide</p>
                  <p className="text-sm text-gray-600 mt-1">Learn dashboard features</p>
                </div>
                <ArrowRight className="w-5 h-5 text-indigo-600 group-hover:translate-x-1 transition-transform" />
              </div>
            </a>
            <a href="/support-hub/business/metrics" className="p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg border border-orange-200 hover:shadow-lg transition-all group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 group-hover:text-orange-600 transition-colors">Performance Metrics</p>
                  <p className="text-sm text-gray-600 mt-1">Track KPIs & benchmarks</p>
                </div>
                <ArrowRight className="w-5 h-5 text-orange-600 group-hover:translate-x-1 transition-transform" />
              </div>
            </a>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
