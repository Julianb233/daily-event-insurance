# Daily Event Insurance

**B2B embedded insurance platform** enabling gyms, climbing facilities, and rental businesses to offer same-day coverage to their members.

> A [HiQOR](https://hiqor.com) Company

---

## Overview

Daily Event Insurance provides a seamless way for active lifestyle businesses to offer instant insurance protection to their members. Business owners can integrate our platform to:

- **Generate new revenue** through commission on every policy sold
- **Reduce liability** by ensuring members have proper coverage
- **Delight members** with convenient, one-click insurance at checkout

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16 (App Router) | React framework |
| React | 19 | UI library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 4 | Styling |
| Framer Motion | 12 | Animations |
| **Supabase** | - | Backend database (PostgreSQL) |
| **Pinecone** | - | Vector database for AI/search |
| Drizzle ORM | 0.45+ | Database ORM |
| NextAuth.js | 5 (beta) | Authentication |
| Stripe | 20+ | Payments |

> **Note:** This project uses **Supabase** as the sole backend database provider. Pinecone is used for vector embeddings and AI-powered search functionality.

---

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/daily-event-insurance.git
cd daily-event-insurance

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Build

```bash
# Production build
pnpm build

# Start production server
pnpm start
```

---

## Project Structure

```
daily-event-insurance/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Homepage (landing page)
│   ├── layout.tsx         # Root layout with metadata
│   ├── globals.css        # Global styles & CSS variables
│   ├── pricing/           # Pricing page
│   └── api/               # API routes
├── components/            # Reusable UI components
│   ├── header.tsx         # Navigation header
│   ├── footer.tsx         # Site footer
│   ├── hero-section.tsx   # Hero section
│   └── faq-section.tsx    # FAQ accordion
├── public/                # Static assets
│   └── images/            # Image assets (see IMAGES-NEEDED.md)
└── lib/                   # Utility functions
```

---

## Brand Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Primary Teal | `#14B8A6` | Buttons, accents, links |
| Dark Teal | `#0D9488` | Hover states, headers |
| Accent Sky | `#0EA5E9` | Highlights |
| Background Light | `#FFFFFF` | Page backgrounds |
| Background Section | `#F8FAFC` | Section alternates |
| Text Primary | `#1E293B` | Headings, body text |
| Text Secondary | `#64748B` | Captions, metadata |

---

## Target Markets

- **Gyms & Fitness Centers** - Day pass insurance, equipment liability
- **Rock Climbing Facilities** - Activity-specific coverage
- **Equipment Rentals** - Bikes, kayaks, sporting goods
- **Adventure Sports** - Zip lines, obstacle courses, trampoline parks

---

## Key Features

- **Instant Coverage** - Members get same-day insurance in seconds
- **Revenue Sharing** - Partners earn commission on every policy
- **Simple Integration** - API or standalone portal options
- **Mobile Responsive** - Works on any device
- **B2B Focused** - Built for business owners, not consumers

---

## Deployment

Recommended deployment platforms:

- **Vercel** (recommended for Next.js)
- **Netlify**
- **AWS Amplify**
- Any Next.js-compatible hosting

---

## Image Assets

See [IMAGES-NEEDED.md](./IMAGES-NEEDED.md) for a complete list of image assets that need to be created or replaced.

---

## Implementation Documentation

### VA Implementation Guide
Located in `/docs/va-implementation/`:
- [README.md](./docs/va-implementation/README.md) - Overview and quick links
- [Task Checklist](./docs/va-implementation/task-checklist.md) - Master task list for VAs
- [Image Prompts](./docs/va-implementation/image-generation-prompts.md) - AI image generation prompts

---

## License

Proprietary - Daily Event Insurance / HiQOR

---

## Contact

- **Website**: [dailyeventinsurance.com](https://dailyeventinsurance.com)
- **Parent Company**: [HiQOR](https://hiqor.com)
- **Support**: support@dailyeventinsurance.com
