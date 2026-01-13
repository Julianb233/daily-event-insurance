'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  FileText,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Copy,
  Trash2,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  Mail,
  FileSignature,
  File,
  ChevronRight,
  Settings,
} from 'lucide-react'

// Mock templates data
const mockTemplates = [
  {
    id: '1',
    name: 'Partner Welcome Email',
    type: 'email',
    category: 'Onboarding',
    status: 'active',
    version: '2.1',
    lastModified: '2 days ago',
    usageCount: 156,
  },
  {
    id: '2',
    name: 'Partnership Agreement',
    type: 'document',
    category: 'Legal',
    status: 'active',
    version: '3.0',
    lastModified: '1 week ago',
    usageCount: 89,
  },
  {
    id: '3',
    name: 'Commission Statement',
    type: 'email',
    category: 'Financial',
    status: 'active',
    version: '1.5',
    lastModified: '3 days ago',
    usageCount: 234,
  },
  {
    id: '4',
    name: 'Policy Confirmation',
    type: 'email',
    category: 'Policies',
    status: 'draft',
    version: '1.0',
    lastModified: '1 day ago',
    usageCount: 0,
  },
  {
    id: '5',
    name: 'Integration Guide',
    type: 'document',
    category: 'Technical',
    status: 'active',
    version: '2.3',
    lastModified: '5 days ago',
    usageCount: 67,
  },
]

const categories = ['All', 'Onboarding', 'Legal', 'Financial', 'Policies', 'Technical']
const types = ['All Types', 'Email', 'Document']

export default function TemplatesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedType, setSelectedType] = useState('All Types')
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)

  const filteredTemplates = mockTemplates.filter((template) => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory
    const matchesType = selectedType === 'All Types' || template.type === selectedType.toLowerCase()
    return matchesSearch && matchesCategory && matchesType
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email':
        return Mail
      case 'document':
        return FileSignature
      default:
        return File
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Document Templates</h1>
                <p className="text-gray-500">Manage email and document templates</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New Template
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
            >
              {types.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template, index) => {
            const TypeIcon = getTypeIcon(template.type)
            return (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      template.type === 'email' ? 'bg-blue-100' : 'bg-purple-100'
                    }`}>
                      <TypeIcon className={`w-5 h-5 ${
                        template.type === 'email' ? 'text-blue-600' : 'text-purple-600'
                      }`} />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        template.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {template.status}
                      </span>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <MoreVertical className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-1">{template.name}</h3>
                  <p className="text-sm text-gray-500 mb-4">{template.category} - v{template.version}</p>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {template.lastModified}
                    </span>
                    <span className="text-gray-500">{template.usageCount} uses</span>
                  </div>
                </div>

                <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                  <button className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    Preview
                  </button>
                  <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">
                    Edit Template
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )
          })}

          {/* Add New Template Card */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: filteredTemplates.length * 0.05 }}
            className="bg-white rounded-xl shadow-sm border-2 border-dashed border-gray-200 p-6 flex flex-col items-center justify-center min-h-[200px] hover:border-indigo-300 hover:bg-indigo-50/50 transition-colors group"
          >
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-indigo-100 transition-colors">
              <Plus className="w-6 h-6 text-gray-400 group-hover:text-indigo-600" />
            </div>
            <p className="font-medium text-gray-600 group-hover:text-indigo-600">Create New Template</p>
            <p className="text-sm text-gray-400 mt-1">Start from scratch or use a preset</p>
          </motion.button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold mb-1">Template Usage Stats</h2>
              <p className="text-indigo-100">This month&apos;s performance</p>
            </div>
            <div className="flex items-center gap-8">
              <div className="text-center">
                <p className="text-3xl font-bold">546</p>
                <p className="text-sm text-indigo-100">Emails Sent</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">89</p>
                <p className="text-sm text-indigo-100">Documents Generated</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">98.2%</p>
                <p className="text-sm text-indigo-100">Delivery Rate</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
