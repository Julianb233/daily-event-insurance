/**
 * Excel Logger
 * Logs partner data and microsite information to Excel files
 */

import * as XLSX from 'xlsx'

export interface PartnerLogEntry {
  partnerId: string
  businessName: string
  businessType: string
  contactName: string
  contactEmail: string
  contactPhone?: string
  websiteUrl?: string
  directContactName?: string
  directContactEmail?: string
  directContactPhone?: string
  estimatedMonthlyParticipants?: number
  estimatedAnnualParticipants?: number
  micrositeUrl?: string
  qrCodeUrl?: string
  status: string
  createdAt: Date
}

export interface MicrositeLogEntry {
  micrositeId: string
  partnerId: string
  partnerName: string
  subdomain?: string
  customDomain?: string
  url: string
  qrCodeUrl?: string
  status: string
  launchedAt?: Date
  createdAt: Date
}

/**
 * Log partner data to Excel file
 */
export function logPartnerToExcel(
  entries: PartnerLogEntry[],
  filePath: string = './logs/partners.xlsx'
): void {
  // Create workbook
  const workbook = XLSX.utils.book_new()

  // Prepare data
  const data = entries.map(entry => ({
    'Partner ID': entry.partnerId,
    'Business Name': entry.businessName,
    'Business Type': entry.businessType,
    'Contact Name': entry.contactName,
    'Contact Email': entry.contactEmail,
    'Contact Phone': entry.contactPhone || '',
    'Website URL': entry.websiteUrl || '',
    'Direct Contact Name': entry.directContactName || '',
    'Direct Contact Email': entry.directContactEmail || '',
    'Direct Contact Phone': entry.directContactPhone || '',
    'Monthly Participants': entry.estimatedMonthlyParticipants || '',
    'Annual Participants': entry.estimatedAnnualParticipants || '',
    'Microsite URL': entry.micrositeUrl || '',
    'QR Code URL': entry.qrCodeUrl || '',
    'Status': entry.status,
    'Created At': entry.createdAt.toISOString()
  }))

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(data)

  // Set column widths
  worksheet['!cols'] = [
    { wch: 36 }, // Partner ID
    { wch: 25 }, // Business Name
    { wch: 15 }, // Business Type
    { wch: 20 }, // Contact Name
    { wch: 30 }, // Contact Email
    { wch: 15 }, // Contact Phone
    { wch: 40 }, // Website URL
    { wch: 20 }, // Direct Contact Name
    { wch: 30 }, // Direct Contact Email
    { wch: 15 }, // Direct Contact Phone
    { wch: 18 }, // Monthly Participants
    { wch: 18 }, // Annual Participants
    { wch: 50 }, // Microsite URL
    { wch: 50 }, // QR Code URL
    { wch: 15 }, // Status
    { wch: 25 }  // Created At
  ]

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Partners')

  // Write file
  XLSX.writeFile(workbook, filePath)
}

/**
 * Log microsite data to Excel file
 */
export function logMicrositeToExcel(
  entries: MicrositeLogEntry[],
  filePath: string = './logs/microsites.xlsx'
): void {
  // Create workbook
  const workbook = XLSX.utils.book_new()

  // Prepare data
  const data = entries.map(entry => ({
    'Microsite ID': entry.micrositeId,
    'Partner ID': entry.partnerId,
    'Partner Name': entry.partnerName,
    'Subdomain': entry.subdomain || '',
    'Custom Domain': entry.customDomain || '',
    'URL': entry.url,
    'QR Code URL': entry.qrCodeUrl || '',
    'Status': entry.status,
    'Launched At': entry.launchedAt ? entry.launchedAt.toISOString() : '',
    'Created At': entry.createdAt.toISOString()
  }))

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(data)

  // Set column widths
  worksheet['!cols'] = [
    { wch: 36 }, // Microsite ID
    { wch: 36 }, // Partner ID
    { wch: 25 }, // Partner Name
    { wch: 20 }, // Subdomain
    { wch: 30 }, // Custom Domain
    { wch: 50 }, // URL
    { wch: 50 }, // QR Code URL
    { wch: 15 }, // Status
    { wch: 25 }, // Launched At
    { wch: 25 }  // Created At
  ]

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Microsites')

  // Write file
  XLSX.writeFile(workbook, filePath)
}

/**
 * Append partner entry to existing Excel file
 */
export function appendPartnerToExcel(
  entry: PartnerLogEntry,
  filePath: string = './logs/partners.xlsx'
): void {
  try {
    // Try to read existing file
    const workbook = XLSX.readFile(filePath)
    const worksheet = workbook.Sheets['Partners']
    const existingData = XLSX.utils.sheet_to_json(worksheet) as any[]

    // Add new entry
    existingData.push({
      'Partner ID': entry.partnerId,
      'Business Name': entry.businessName,
      'Business Type': entry.businessType,
      'Contact Name': entry.contactName,
      'Contact Email': entry.contactEmail,
      'Contact Phone': entry.contactPhone || '',
      'Website URL': entry.websiteUrl || '',
      'Direct Contact Name': entry.directContactName || '',
      'Direct Contact Email': entry.directContactEmail || '',
      'Direct Contact Phone': entry.directContactPhone || '',
      'Monthly Participants': entry.estimatedMonthlyParticipants || '',
      'Annual Participants': entry.estimatedAnnualParticipants || '',
      'Microsite URL': entry.micrositeUrl || '',
      'QR Code URL': entry.qrCodeUrl || '',
      'Status': entry.status,
      'Created At': entry.createdAt.toISOString()
    })

    // Create new worksheet
    const newWorksheet = XLSX.utils.json_to_sheet(existingData)
    workbook.Sheets['Partners'] = newWorksheet

    // Write file
    XLSX.writeFile(workbook, filePath)
  } catch (error) {
    // File doesn't exist, create new one
    logPartnerToExcel([entry], filePath)
  }
}

