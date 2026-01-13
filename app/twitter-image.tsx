import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Daily Event Insurance - Earn Revenue While Protecting Your Business'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundImage: 'linear-gradient(135deg, #0F766E 0%, #14B8A6 50%, #06B6D4 100%)',
          position: 'relative',
        }}
      >
        {/* Grid pattern overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Sports icons background pattern */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
            alignItems: 'center',
            opacity: 0.1,
            fontSize: 80,
          }}
        >
          {['🏃', '🚴', '🧗', '⛷️', '🏊', '🎿', '🏋️', '🧘', '🚣', '🏄'].map((emoji, i) => (
            <span key={i} style={{ margin: 20 }}>{emoji}</span>
          ))}
        </div>

        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 40,
            zIndex: 10,
          }}
        >
          {/* Logo text */}
          <div
            style={{
              fontSize: 72,
              fontWeight: 900,
              color: 'white',
              textTransform: 'uppercase',
              letterSpacing: '-2px',
              textShadow: '0 4px 20px rgba(0,0,0,0.3)',
              marginBottom: 30,
            }}
          >
            Daily Event Insurance
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: 36,
              color: 'rgba(255,255,255,0.95)',
              textAlign: 'center',
              maxWidth: 900,
              lineHeight: 1.4,
              fontWeight: 600,
            }}
          >
            Earn Extra Revenue While Protecting Your Business
          </div>

          {/* Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginTop: 40,
              padding: '16px 32px',
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: 50,
              border: '2px solid rgba(255,255,255,0.3)',
            }}
          >
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: '#4ade80',
              }}
            />
            <span
              style={{
                fontSize: 24,
                color: 'white',
                fontWeight: 600,
              }}
            >
              Partner Program Now Open
            </span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
