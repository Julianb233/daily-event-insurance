# Implement Document Storage and Access for Onboarding Partners

## Summary
This PR implements robust document storage and access control for the partner onboarding process. It ensures that all legal agreements (Partner Agreement, Joint Marketing Agreement, Mutual NDA, Sponsorship Agreement) are permanently stored with their signed content snapshots in Supabase. It also provides accessible interfaces for both Partners and Admins to view these signed documents.

## Key Changes

### Database
- **Schema Update**: Added `contentSnapshot` column (text) to the `partnerDocuments` table in `lib/db/schema.ts`. This stores the exact content of the document at the moment of signing, ensuring immutability.

### API
- **POST `/api/documents/sign`**:
  - Now generates a "snapshot" of the document content by replacing placeholders with actual partner data.
  - Appends a signature block containing the signature, timestamp, and IP address.
  - Saves this snapshot to the `contentSnapshot` column.
  - Updated logic to enforce signing of all 4 required legal agreements (Partner Agreement, Joint Marketing Agreement, Mutual NDA, Sponsorship Agreement).
- **GET `/api/documents/sign`**: Returns the `contentSnapshot` so the frontend displays the signed version.
- **New Endpoint**: `app/api/admin/partners/[id]/documents/route.ts` allows admins to fetch all signed documents for a specific partner.

### Partner Portal
- **Onboarding Page** (`app/onboarding/documents/page.tsx`): Updated to display the signed snapshot when viewing a completed document.
- **New Documents Page** (`app/(partner)/partner/documents/page.tsx`): A dedicated page in the partner dashboard for partners to view their signed agreements at any time.
- **Sidebar Update** (`components/partner/PartnerSidebar.tsx`): Added a "Documents" link for easy access.

### Admin Portal
- **Partner Management** (`app/admin/partners/page.tsx`):
  - Added a "View Documents" button to the partner list.
  - Implemented a modal to list all signed documents for a partner.
  - Implemented a viewer modal to read the full content of any signed document.

## Testing
- **E2E Tests**: Updated `e2e/onboarding-full-flow.spec.ts` to include the signing of the new Mutual NDA and Sponsorship Agreement, verifying the full 4-document flow.
- **Manual Verification**:
  - Verified the signing process generates a snapshot in local DB.
  - Verified partners can view their signed docs in the dashboard.
  - Verified admins can view partner docs in the admin panel.

## Checklist
- [x] Database migration created and pushed (`npx drizzle-kit push`)
- [x] API endpoints updated and tested
- [x] Partner Dashboard UI updated
- [x] Admin Dashboard UI updated
- [x] E2E tests passing
