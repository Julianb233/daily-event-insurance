import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Daily Event Insurance - Same-Day Coverage for Active Businesses'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  // Fetch the logo from the public folder
  const logoUrl = new URL('/images/logo-color.png', 'https://dailyeventinsurance.com').toString()

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #134e4a 50%, #0f766e 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px',
        }}
      >
        {/* Semi-transparent card */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '24px',
            padding: '60px 80px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          }}
        >
          {/* Logo */}
          <img
            src={logoUrl}
            alt="Daily Event Insurance"
            width={400}
            height={150}
            style={{
              objectFit: 'contain',
              marginBottom: '30px',
            }}
          />

          {/* Tagline */}
          <div
            style={{
              fontSize: '32px',
              fontWeight: 500,
              color: '#14B8A6',
              textAlign: 'center',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            Same-Day Coverage for Active Businesses
          </div>
        </div>

        {/* Bottom URL */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            fontSize: '24px',
            color: 'rgba(255, 255, 255, 0.7)',
            letterSpacing: '0.1em',
          }}
        >
          dailyeventinsurance.com
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
