/**
 * Google Sheets Integration Client
 * Syncs partner data to Google Sheets for tracking and reporting
 */

import { google } from 'googleapis'

export interface PartnerSheetRow {
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
  integrationType?: string
  micrositeUrl?: string
  qrCodeUrl?: string
  status: string
  signupDate: Date
}

/**
 * Get authenticated Google Sheets client
 */
async function getAuthenticatedClient() {
  const credentials = process.env.GOOGLE_SHEETS_CREDENTIALS

  if (!credentials) {
    throw new Error('GOOGLE_SHEETS_CREDENTIALS environment variable not set')
  }

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(credentials),
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    })

    return google.sheets({ version: 'v4', auth })
  } catch (error) {
    console.error('Error parsing Google credentials:', error)
    throw new Error('Invalid GOOGLE_SHEETS_CREDENTIALS format')
  }
}

/**
 * Append a new partner to the Google Sheet
 */
export async function appendPartnerToSheet(data: PartnerSheetRow): Promise<void> {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID

  if (!spreadsheetId) {
    console.warn('GOOGLE_SHEETS_SPREADSHEET_ID not set, skipping sheet sync')
    return
  }

  try {
    const sheets = await getAuthenticatedClient()

    const values = [[
      data.partnerId,
      data.businessName,
      data.businessType,
      data.contactName,
      data.contactEmail,
      data.contactPhone || '',
      data.websiteUrl || '',
      data.directContactName || '',
      data.directContactEmail || '',
      data.directContactPhone || '',
      data.estimatedMonthlyParticipants?.toString() || '',
      data.estimatedAnnualParticipants?.toString() || '',
      data.integrationType || '',
      data.micrositeUrl || '',
      data.qrCodeUrl || '',
      data.status,
      data.signupDate.toISOString()
    ]]

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Partners!A:Q', // Columns A through Q
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values
      }
    })

    console.log(`Partner ${data.partnerId} synced to Google Sheets`)
  } catch (error) {
    console.error('Error appending to Google Sheets:', error)
    // Don't throw - we don't want to fail the onboarding if sheet sync fails
  }
}

/**
 * Update an existing partner row in Google Sheet
 */
export async function updatePartnerInSheet(
  partnerId: string,
  updates: Partial<PartnerSheetRow>
): Promise<void> {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID

  if (!spreadsheetId) {
    console.warn('GOOGLE_SHEETS_SPREADSHEET_ID not set, skipping sheet update')
    return
  }

  try {
    const sheets = await getAuthenticatedClient()

    // First, find the row with this partnerId
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Partners!A:A' // Get all Partner IDs
    })

    const rows = response.data.values || []
    let rowIndex = -1

    for (let i = 0; i < rows.length; i++) {
      if (rows[i][0] === partnerId) {
        rowIndex = i + 1 // Sheet rows are 1-indexed
        break
      }
    }

    if (rowIndex === -1) {
      console.warn(`Partner ${partnerId} not found in sheet, cannot update`)
      return
    }

    // Get the current row data
    const currentRow = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `Partners!A${rowIndex}:Q${rowIndex}`
    })

    const currentValues = currentRow.data.values?.[0] || []

    // Merge updates with current values
    const updatedValues = [
      updates.partnerId ?? currentValues[0] ?? '',
      updates.businessName ?? currentValues[1] ?? '',
      updates.businessType ?? currentValues[2] ?? '',
      updates.contactName ?? currentValues[3] ?? '',
      updates.contactEmail ?? currentValues[4] ?? '',
      updates.contactPhone ?? currentValues[5] ?? '',
      updates.websiteUrl ?? currentValues[6] ?? '',
      updates.directContactName ?? currentValues[7] ?? '',
      updates.directContactEmail ?? currentValues[8] ?? '',
      updates.directContactPhone ?? currentValues[9] ?? '',
      updates.estimatedMonthlyParticipants?.toString() ?? currentValues[10] ?? '',
      updates.estimatedAnnualParticipants?.toString() ?? currentValues[11] ?? '',
      updates.integrationType ?? currentValues[12] ?? '',
      updates.micrositeUrl ?? currentValues[13] ?? '',
      updates.qrCodeUrl ?? currentValues[14] ?? '',
      updates.status ?? currentValues[15] ?? '',
      updates.signupDate?.toISOString() ?? currentValues[16] ?? ''
    ]

    // Update the row
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `Partners!A${rowIndex}:Q${rowIndex}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [updatedValues]
      }
    })

    console.log(`Partner ${partnerId} updated in Google Sheets`)
  } catch (error) {
    console.error('Error updating Google Sheets:', error)
    // Don't throw - we don't want to fail if sheet update fails
  }
}

/**
 * Initialize the sheet with headers if empty
 */
export async function initializePartnerSheet(): Promise<void> {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID

  if (!spreadsheetId) {
    console.warn('GOOGLE_SHEETS_SPREADSHEET_ID not set')
    return
  }

  try {
    const sheets = await getAuthenticatedClient()

    // Check if headers exist
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Partners!A1:Q1'
    })

    if (!response.data.values || response.data.values.length === 0) {
      // Add headers
      const headers = [[
        'Partner ID',
        'Business Name',
        'Business Type',
        'Contact Name',
        'Contact Email',
        'Contact Phone',
        'Website URL',
        'Direct Contact Name',
        'Direct Contact Email',
        'Direct Contact Phone',
        'Monthly Participants',
        'Annual Participants',
        'Integration Type',
        'Microsite URL',
        'QR Code URL',
        'Status',
        'Signup Date'
      ]]

      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: 'Partners!A1:Q1',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: headers
        }
      })

      console.log('Partner sheet headers initialized')
    }
  } catch (error) {
    console.error('Error initializing sheet:', error)
  }
}
