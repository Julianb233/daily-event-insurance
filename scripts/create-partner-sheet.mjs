#!/usr/bin/env node
/**
 * Create Daily Event Insurance Partner Spreadsheet
 * Uses Application Default Credentials (gcloud auth)
 */

import { google } from 'googleapis'

async function main() {
  console.log('\n' + '═'.repeat(60))
  console.log('  Daily Event Insurance - Google Sheets Setup')
  console.log('═'.repeat(60) + '\n')

  try {
    // Use Application Default Credentials with quota project
    const auth = new google.auth.GoogleAuth({
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive.file'
      ],
      projectId: 'daily-event-insurance-app'
    })

    const authClient = await auth.getClient()

    // Set quota project header
    authClient.quotaProject = 'daily-event-insurance-app'

    const drive = google.drive({ version: 'v3', auth: authClient })
    const sheets = google.sheets({ version: 'v4', auth: authClient })

    console.log('📊 Creating spreadsheet...')

    // Create spreadsheet using Drive API
    const file = await drive.files.create({
      requestBody: {
        name: 'Daily Event Insurance - Partners',
        mimeType: 'application/vnd.google-apps.spreadsheet'
      },
      fields: 'id, webViewLink'
    })

    const spreadsheetId = file.data.id
    const spreadsheetUrl = file.data.webViewLink

    console.log('✅ Spreadsheet created:', spreadsheetId)

    // Get sheet ID and rename
    const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId })
    const sheetId = spreadsheet.data.sheets[0].properties.sheetId

    // Add headers
    const headers = [
      'Partner ID', 'Business Name', 'Business Type', 'Contact Name',
      'Contact Email', 'Contact Phone', 'Website URL', 'Direct Contact Name',
      'Direct Contact Email', 'Direct Contact Phone', 'Monthly Participants',
      'Annual Participants', 'Integration Type', 'Microsite URL', 'QR Code URL',
      'Status', 'Signup Date'
    ]

    // Batch update: rename sheet, add headers, format
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            updateSheetProperties: {
              properties: { sheetId, title: 'Partners' },
              fields: 'title'
            }
          }
        ]
      }
    })

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: 'Partners!A1:Q1',
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [headers] }
    })

    console.log('✅ Headers added!')

    // Format header row
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            repeatCell: {
              range: { sheetId, startRowIndex: 0, endRowIndex: 1 },
              cell: {
                userEnteredFormat: {
                  backgroundColor: { red: 0.08, green: 0.72, blue: 0.65 },
                  textFormat: { bold: true, foregroundColor: { red: 1, green: 1, blue: 1 } }
                }
              },
              fields: 'userEnteredFormat(backgroundColor,textFormat)'
            }
          },
          {
            updateSheetProperties: {
              properties: { sheetId, gridProperties: { frozenRowCount: 1 } },
              fields: 'gridProperties.frozenRowCount'
            }
          }
        ]
      }
    })

    console.log('✅ Formatting applied!')

    console.log('\n' + '═'.repeat(60))
    console.log('  ✅ SETUP COMPLETE!')
    console.log('═'.repeat(60))
    console.log('\n📋 Spreadsheet ID:')
    console.log(`   ${spreadsheetId}`)
    console.log('\n🔗 Spreadsheet URL:')
    console.log(`   ${spreadsheetUrl}`)
    console.log('\n📝 Add this to your .env.local:')
    console.log(`   GOOGLE_SHEETS_SPREADSHEET_ID=${spreadsheetId}`)
    console.log('\n' + '═'.repeat(60) + '\n')

  } catch (error) {
    console.error('❌ Error:', error.message)
    if (error.message.includes('quota')) {
      console.log('\n💡 Try running: gcloud auth application-default set-quota-project daily-event-insurance-app')
    }
    process.exit(1)
  }
}

main()
