"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  MapPin,
  QrCode,
  Download,
  ExternalLink,
  Copy,
  Check,
  Plus,
  Building2,
  User,
  Mail,
  Phone,
  Globe,
  Printer,
  Loader2,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Validation schema for Add Location form
const addLocationSchema = z.object({
  name: z.string().min(1, "Location name is required").max(100, "Name too long"),
  address: z.string().min(1, "Address is required").max(200, "Address too long"),
  city: z.string().min(1, "City is required").max(100, "City too long"),
  state: z.string().min(2, "State is required").max(2, "Use 2-letter state code"),
  zip: z.string().min(5, "Valid ZIP code required").max(10, "ZIP code too long").regex(/^\d{5}(-\d{4})?$/, "Invalid ZIP format"),
  phone: z.string().optional().refine((val) => !val || /^[\d\s\-\(\)\+]+$/.test(val), "Invalid phone format"),
  email: z.string().optional().refine((val) => !val || z.string().email().safeParse(val).success, "Invalid email format"),
  timezone: z.string().min(1, "Timezone is required"),
})

type AddLocationFormData = z.infer<typeof addLocationSchema>

// US Timezone options
const US_TIMEZONES = [
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "America/Anchorage", label: "Alaska Time (AKT)" },
  { value: "Pacific/Honolulu", label: "Hawaii Time (HT)" },
]

// US State options
const US_STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY", "DC"
]

interface Location {
  id: string
  locationName: string
  locationCode?: string | null
  isPrimary: boolean
  address: string
  city: string
  state: string
  zipCode: string
  country?: string | null
  contactName?: string | null
  contactEmail?: string | null
  contactPhone?: string | null
  contactRole?: string | null
  customSubdomain?: string | null
  qrCodeUrl?: string | null
  estimatedMonthlyParticipants?: number | null
  totalPolicies?: number | null
  status: string
}

interface LocationsData {
  locations: Location[]
  hasMultipleLocations: boolean
  microsite?: {
    subdomain?: string | null
    domain?: string | null
  } | null
}

export default function PartnerLocationsPage() {
  const router = useRouter()
  const [data, setData] = useState<LocationsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [generatingQr, setGeneratingQr] = useState<string | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Form setup with react-hook-form and zod validation
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AddLocationFormData>({
    resolver: zodResolver(addLocationSchema),
    defaultValues: {
      name: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      phone: "",
      email: "",
      timezone: "America/New_York",
    },
  })

  // Watch state and timezone for controlled select components
  const watchedState = watch("state")
  const watchedTimezone = watch("timezone")

  // Fetch locations function (extracted for reuse)
  const fetchLocations = async () => {
    try {
      const response = await fetch("/api/partner/locations")
      if (response.ok) {
        const result = await response.json()
        setData(result)
      } else {
        setError("Failed to load locations")
      }
    } catch (err) {
      console.error("Error fetching locations:", err)
      setError("Failed to load locations")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchLocations()
  }, [])

  // Handle form submission
  const onSubmit = async (formData: AddLocationFormData) => {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const response = await fetch("/api/partner/locations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locationName: formData.name,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zip,
          contactPhone: formData.phone || null,
          contactEmail: formData.email || null,
          timezone: formData.timezone,
        }),
      })

      if (response.ok) {
        // Success - close modal, reset form, refresh locations
        setIsAddModalOpen(false)
        reset()
        await fetchLocations()
      } else {
        const errorData = await response.json().catch(() => ({}))
        setSubmitError(errorData.error || "Failed to create location")
      }
    } catch (err) {
      console.error("Error creating location:", err)
      setSubmitError("An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle modal close - reset form state
  const handleModalOpenChange = (open: boolean) => {
    setIsAddModalOpen(open)
    if (!open) {
      reset()
      setSubmitError(null)
    }
  }

  const getLocationUrl = (location: Location) => {
    if (location.customSubdomain) {
      return `https://${location.customSubdomain}.dailyeventinsurance.com`
    }
    return null
  }

  const copyToClipboard = async (text: string, locationId: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(locationId)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const downloadQrCode = (qrCodeUrl: string, locationName: string) => {
    const link = document.createElement("a")
    link.href = qrCodeUrl
    link.download = `qr-code-${locationName.toLowerCase().replace(/\s+/g, "-")}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const printQrCode = (qrCodeUrl: string, locationName: string) => {
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>QR Code - ${locationName}</title>
          <style>
            body {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              font-family: system-ui, -apple-system, sans-serif;
            }
            img { width: 300px; height: 300px; }
            h2 { margin-top: 20px; color: #333; }
            p { color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <img src="${qrCodeUrl}" alt="QR Code" />
          <h2>${locationName}</h2>
          <p>Scan to get event insurance</p>
          <script>window.onload = function() { window.print(); }</script>
        </body>
        </html>
      `)
      printWindow.document.close()
    }
  }

  const generateQrCode = async (location: Location) => {
    setGeneratingQr(location.id)
    try {
      const url = getLocationUrl(location)
      if (!url) return

      const response = await fetch("/api/partners/qrcode/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          color: "#14B8A6",
        }),
      })

      if (response.ok) {
        const result = await response.json()
        // Update local state with new QR code
        setData((prev) => {
          if (!prev) return prev
          return {
            ...prev,
            locations: prev.locations.map((loc) =>
              loc.id === location.id
                ? { ...loc, qrCodeUrl: result.qrCodeUrl }
                : loc
            ),
          }
        })
      }
    } catch (err) {
      console.error("Error generating QR code:", err)
    } finally {
      setGeneratingQr(null)
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-48" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-64 bg-slate-200 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="p-6 lg:p-8">
        <div className="bg-red-50 text-red-600 p-4 rounded-xl">
          {error || "Failed to load locations"}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Locations</h1>
          <p className="text-slate-600 mt-1">
            Manage your business locations and QR codes
          </p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={handleModalOpenChange}>
          <DialogTrigger asChild>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
              <Plus className="w-5 h-5" />
              Add Location
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px] bg-white">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-slate-900">Add New Location</DialogTitle>
              <DialogDescription className="text-slate-600">
                Enter the details for your new business location.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
              {/* Error message */}
              {submitError && (
                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-200">
                  {submitError}
                </div>
              )}

              {/* Location Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-700">
                  Location Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="Main Office"
                  {...register("name")}
                  aria-invalid={errors.name ? "true" : "false"}
                  className="w-full"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name.message}</p>
                )}
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="address" className="text-slate-700">
                  Street Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="address"
                  placeholder="123 Main Street"
                  {...register("address")}
                  aria-invalid={errors.address ? "true" : "false"}
                  className="w-full"
                />
                {errors.address && (
                  <p className="text-red-500 text-sm">{errors.address.message}</p>
                )}
              </div>

              {/* City, State, Zip - Row */}
              <div className="grid grid-cols-6 gap-3">
                <div className="col-span-3 space-y-2">
                  <Label htmlFor="city" className="text-slate-700">
                    City <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="city"
                    placeholder="New York"
                    {...register("city")}
                    aria-invalid={errors.city ? "true" : "false"}
                    className="w-full"
                  />
                  {errors.city && (
                    <p className="text-red-500 text-sm">{errors.city.message}</p>
                  )}
                </div>
                <div className="col-span-1 space-y-2">
                  <Label htmlFor="state" className="text-slate-700">
                    State <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={watchedState}
                    onValueChange={(value) => setValue("state", value, { shouldValidate: true })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="--" />
                    </SelectTrigger>
                    <SelectContent>
                      {US_STATES.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.state && (
                    <p className="text-red-500 text-sm">{errors.state.message}</p>
                  )}
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="zip" className="text-slate-700">
                    ZIP Code <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="zip"
                    placeholder="10001"
                    {...register("zip")}
                    aria-invalid={errors.zip ? "true" : "false"}
                    className="w-full"
                  />
                  {errors.zip && (
                    <p className="text-red-500 text-sm">{errors.zip.message}</p>
                  )}
                </div>
              </div>

              {/* Phone and Email - Row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-slate-700">
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(555) 123-4567"
                    {...register("phone")}
                    aria-invalid={errors.phone ? "true" : "false"}
                    className="w-full"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm">{errors.phone.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="location@company.com"
                    {...register("email")}
                    aria-invalid={errors.email ? "true" : "false"}
                    className="w-full"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">{errors.email.message}</p>
                  )}
                </div>
              </div>

              {/* Timezone */}
              <div className="space-y-2">
                <Label htmlFor="timezone" className="text-slate-700">
                  Timezone <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={watchedTimezone}
                  onValueChange={(value) => setValue("timezone", value, { shouldValidate: true })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    {US_TIMEZONES.map((tz) => (
                      <SelectItem key={tz.value} value={tz.value}>
                        {tz.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.timezone && (
                  <p className="text-red-500 text-sm">{errors.timezone.message}</p>
                )}
              </div>

              <DialogFooter className="mt-6 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => handleModalOpenChange(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Create Location
                    </>
                  )}
                </button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Locations Grid */}
      {data.locations.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-50 rounded-2xl p-12 text-center"
        >
          <Building2 className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No locations yet</h3>
          <p className="text-slate-600 mb-6">
            Add your first location to get started with QR codes
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Your First Location
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {data.locations.map((location, index) => (
            <motion.div
              key={location.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
              onClick={() => router.push(`/partner/locations/${location.id}`)}
            >
              {/* Location Header */}
              <div className="p-6 border-b border-slate-100">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        {location.locationName}
                      </h3>
                      <p className="text-sm text-slate-500">
                        {location.city}, {location.state}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {location.isPrimary && (
                      <span className="px-2 py-1 text-xs font-medium bg-amber-100 text-amber-700 rounded-full">
                        Primary
                      </span>
                    )}
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        location.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {location.status === "active" ? "Active" : location.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Location Details */}
              <div className="p-6 space-y-4">
                {/* Address */}
                <div className="text-sm">
                  <span className="text-slate-500">Address: </span>
                  <span className="text-slate-900">
                    {location.address}, {location.city}, {location.state} {location.zipCode}
                  </span>
                </div>

                {/* Contact Info */}
                {location.contactName && (
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-900">{location.contactName}</span>
                      {location.contactRole && (
                        <span className="text-slate-500">({location.contactRole})</span>
                      )}
                    </div>
                    {location.contactEmail && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-slate-400" />
                        <a href={`mailto:${location.contactEmail}`} className="text-teal-600 hover:underline">
                          {location.contactEmail}
                        </a>
                      </div>
                    )}
                    {location.contactPhone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-900">{location.contactPhone}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Microsite URL */}
                {location.customSubdomain && (
                  <div className="bg-slate-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Globe className="w-4 h-4 text-teal-600" />
                      <span className="text-sm font-medium text-slate-700">Location URL</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 text-sm text-teal-700 bg-white px-3 py-2 rounded-lg border border-slate-200 font-mono truncate">
                        {getLocationUrl(location)}
                      </code>
                      <button
                        onClick={() => copyToClipboard(getLocationUrl(location)!, location.id)}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Copy URL"
                      >
                        {copiedId === location.id ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4 text-slate-500" />
                        )}
                      </button>
                      <a
                        href={getLocationUrl(location)!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Open in new tab"
                      >
                        <ExternalLink className="w-4 h-4 text-slate-500" />
                      </a>
                    </div>
                  </div>
                )}

                {/* QR Code Section */}
                <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <QrCode className="w-5 h-5 text-teal-600" />
                    <span className="text-sm font-medium text-slate-700">QR Code</span>
                  </div>

                  {location.qrCodeUrl ? (
                    <div className="flex items-start gap-4">
                      <div className="bg-white p-2 rounded-lg border border-teal-200 shadow-sm">
                        <img
                          src={location.qrCodeUrl}
                          alt={`QR Code for ${location.locationName}`}
                          className="w-32 h-32"
                        />
                      </div>
                      <div className="flex-1 space-y-2">
                        <p className="text-sm text-slate-600">
                          Scan to access insurance for this location
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => downloadQrCode(location.qrCodeUrl!, location.locationName)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                          >
                            <Download className="w-4 h-4" />
                            Download
                          </button>
                          <button
                            onClick={() => printQrCode(location.qrCodeUrl!, location.locationName)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                          >
                            <Printer className="w-4 h-4" />
                            Print
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-sm text-slate-500 mb-3">
                        No QR code generated yet
                      </p>
                      <button
                        onClick={() => generateQrCode(location)}
                        disabled={generatingQr === location.id || !location.customSubdomain}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white text-sm rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {generatingQr === location.id ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <QrCode className="w-4 h-4" />
                            Generate QR Code
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* Stats */}
                {(location.estimatedMonthlyParticipants || location.totalPolicies) && (
                  <div className="flex gap-6 pt-2">
                    {location.estimatedMonthlyParticipants && (
                      <div>
                        <p className="text-2xl font-bold text-slate-900">
                          {location.estimatedMonthlyParticipants.toLocaleString()}
                        </p>
                        <p className="text-sm text-slate-500">Est. Monthly Participants</p>
                      </div>
                    )}
                    {location.totalPolicies !== null && location.totalPolicies !== undefined && (
                      <div>
                        <p className="text-2xl font-bold text-slate-900">
                          {location.totalPolicies}
                        </p>
                        <p className="text-sm text-slate-500">Policies Sold</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
