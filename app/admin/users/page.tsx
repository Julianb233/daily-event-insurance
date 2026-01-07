"use client"

import { useState, useEffect } from "react"
import { Shield, MoreHorizontal, Search, User, UserCog, Briefcase } from "lucide-react"
import { ROLES, type SystemRole } from "@/lib/rbac-config"

interface User {
    id: string
    name: string
    email: string
    role: SystemRole
    createdAt: string
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")

    useEffect(() => {
        // In a real app, fetch from API
        // const fetchUsers = async () => { ... }

        // Simulating data for NOW until API endpoint is created
        setTimeout(() => {
            setUsers([
                { id: "1", name: "Julian Bradley", email: "julian@dailyeventinsurance.com", role: "admin", createdAt: "2024-01-01" },
                { id: "2", name: "Sales Agent", email: "agent@sales.com", role: "sales_agent", createdAt: "2024-02-15" },
                { id: "3", name: "Gym Partner", email: "gym@partner.com", role: "partner", createdAt: "2024-03-10" },
                { id: "4", name: "Regular User", email: "john@example.com", role: "user", createdAt: "2024-04-20" },
            ] as User[])
            setLoading(false)
        }, 500)
    }, [])

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    )

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case ROLES.ADMIN: return "bg-purple-100 text-purple-700 border-purple-200"
            case ROLES.SALES_AGENT: return "bg-blue-100 text-blue-700 border-blue-200"
            case ROLES.PARTNER: return "bg-teal-100 text-teal-700 border-teal-200"
            default: return "bg-gray-100 text-gray-700 border-gray-200"
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <UserCog className="w-8 h-8 text-indigo-600" />
                            Staff & User Management
                        </h1>
                        <p className="text-gray-500 mt-1">Manage system access and roles</p>
                    </div>
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                        Invite New User
                    </button>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6 flex items-center gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Joined</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">Loading users...</td>
                                </tr>
                            ) : filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">{user.name}</div>
                                                <div className="text-sm text-gray-500">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleBadgeColor(user.role)}`}>
                                            {user.role.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {user.createdAt}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-gray-400 hover:text-gray-600 p-1">
                                            <MoreHorizontal className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
