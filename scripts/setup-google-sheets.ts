/**
 * Google Sheets Setup Script
 * Creates the partner tracking spreadsheet and outputs configuration
 *
 * Run with: npx tsx scripts/setup-google-sheets.ts
 */

import { google } from 'googleapis'
import * as http from 'http'
import * as url from 'url'
import open from 'open'

const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive.file'
]

// OAuth2 client credentials (for local development only)
const CLIENT_ID = 'YOUR_CLIENT_ID' // Will prompt to enter
const CLIENT_SECRET = 'YOUR_CLIENT_SECRET'
const REDIRECT_URI = 'http://localhost:3333/oauth2callback'

async function getAuthenticatedClient(): Promise<any> {
  return new Promise((resolve, reject) => {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID || CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET || CLIENT_SECRET,
      REDIRECT_URI
    )

    // Generate auth URL
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    })

    console.log('\n🔐 Opening browser for Google authentication...\n')

    // Create temporary server to receive OAuth callback
    const server = http.createServer(async (req, res) => {
      try {
        const queryParams = new url.URL(req.url!, `http://localhost:3333`).searchParams
        const code = queryParams.get('code')

        if (code) {
          const { tokens } = await oauth2Client.getToken(code)
          oauth2Client.setCredentials(tokens)

          res.writeHead(200, { 'Content-Type': 'text/html' })
          res.end('<html><body><h1>✅ Authentication successful!</h1><p>You can close this window.</p></body></html>')

          server.close()
          resolve(oauth2Client)
        }
      } catch (err) {
        res.writeHead(500)
        res.end('Authentication failed')
        reject(err)
      }
    })

    server.listen(3333, () => {
      open(authUrl)
    })
  })
}

async function createPartnerSpreadsheet(auth: any): Promise<{ spreadsheetId: string; spreadsheetUrl: string }> {
  const sheets = google.sheets({ version: 'v4', auth })
  const drive = google.drive({ version: 'v3', auth })

  console.log('📊 Creating spreadsheet...')

  // Create the spreadsheet
  const spreadsheet = await sheets.spreadsheets.create({
    requestBody: {
      properties: {
        title: 'Daily Event Insurance - Partners',
      },
      sheets: [
        {
          properties: {
            title: 'Partners',
            gridProperties: {
              frozenRowCount: 1, // Freeze header row
            },
          },
        },
      ],
    },
  })

  const spreadsheetId = spreadsheet.data.spreadsheetId!
  const spreadsheetUrl = spreadsheet.data.spreadsheetUrl!

  console.log('✅ Spreadsheet created:', spreadsheetId)

  // Add headers
  const headers = [
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
    'Signup Date',
  ]

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: 'Partners!A1:Q1',
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [headers],
    },
  })

  console.log('✅ Headers added')

  // Format header row (bold, background color)
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [
        {
          repeatCell: {
            range: {
              sheetId: 0,
              startRowIndex: 0,
              endRowIndex: 1,
            },
            cell: {
              userEnteredFormat: {
                backgroundColor: { red: 0.08, green: 0.72, blue: 0.65 }, // Teal
                textFormat: {
                  bold: true,
                  foregroundColor: { red: 1, green: 1, blue: 1 },
                },
              },
            },
            fields: 'userEnteredFormat(backgroundColor,textFormat)',
          },
        },
        {
          autoResizeDimensions: {
            dimensions: {
              sheetId: 0,
              dimension: 'COLUMNS',
              startIndex: 0,
              endIndex: 17,
            },
          },
        },
      ],
    },
  })

  console.log('✅ Formatting applied')

  return { spreadsheetId, spreadsheetUrl }
}

async function main() {
  console.log('🚀 Daily Event Insurance - Google Sheets Setup\n')
  console.log('This script will:')
  console.log('  1. Authenticate with your Google account')
  console.log('  2. Create "Daily Event Insurance - Partners" spreadsheet')
  console.log('  3. Set up headers and formatting')
  console.log('  4. Output the Spreadsheet ID for your .env.local\n')

  try {
    const auth = await getAuthenticatedClient()
    const { spreadsheetId, spreadsheetUrl } = await createPartnerSpreadsheet(auth)

    console.log('\n' + '='.repeat(60))
    console.log('✅ SETUP COMPLETE!')
    console.log('='.repeat(60))
    console.log('\n📋 Add this to your .env.local:\n')
    console.log(`GOOGLE_SHEETS_SPREADSHEET_ID=${spreadsheetId}`)
    console.log('\n🔗 Spreadsheet URL:')
    console.log(spreadsheetUrl)
    console.log('\n⚠️  Note: You still need to set up a Service Account for')
    console.log('    production API access. See docs for instructions.')
    console.log('='.repeat(60) + '\n')

  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

main()
