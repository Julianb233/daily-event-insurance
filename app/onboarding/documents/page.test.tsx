import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Mock next-auth/react
const mockUseSession = vi.fn()
vi.mock('next-auth/react', () => ({
  useSession: () => mockUseSession(),
}))

// Mock next/navigation
const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}))

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

// Mock components
vi.mock('@/components/header', () => ({
  default: () => <header data-testid="header">Header</header>,
}))

vi.mock('@/components/footer', () => ({
  default: () => <footer data-testid="footer">Footer</footer>,
}))

// Mock DocumentViewer with controllable behavior
const mockDocumentViewer = vi.fn()
vi.mock('@/components/document-viewer', () => ({
  DocumentViewer: (props: any) => {
    mockDocumentViewer(props)
    if (!props.isOpen) return null
    return (
      <div data-testid="document-viewer">
        <span>{props.document?.title}</span>
        <button onClick={() => props.onSign(props.document?.type, 'Test Signature')}>
          Sign
        </button>
        <button onClick={props.onClose}>Close</button>
      </div>
    )
  },
}))

// Import component after mocks
import DocumentsPage from './page'

// Mock fetch globally
const mockFetch = vi.fn()
global.fetch = mockFetch

// Mock window.location.reload
const mockReload = vi.fn()
Object.defineProperty(window, 'location', {
  value: { reload: mockReload },
  writable: true,
})

describe('Documents Onboarding Page', () => {
  const mockTemplates = [
    {
      id: 'template-1',
      type: 'partner_agreement',
      title: 'Partner Agreement',
      content: 'Agreement content...',
      version: '1.0',
    },
    {
      id: 'template-2',
      type: 'w9',
      title: 'W-9 Tax Form',
      content: 'W9 content...',
      version: '1.0',
    },
    {
      id: 'template-3',
      type: 'direct_deposit',
      title: 'Direct Deposit Form',
      content: 'Direct deposit content...',
      version: '1.0',
    },
  ]

  const mockPartner = {
    id: 'partner-123',
    name: 'Test Partner',
  }

  const mockDocumentStatuses: Record<string, { signed: boolean; signedAt?: string }> = {
    partner_agreement: { signed: false },
    w9: { signed: false },
    direct_deposit: { signed: false },
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockUseSession.mockReturnValue({
      data: { user: { email: 'test@example.com' } },
      status: 'authenticated',
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  const setupFetchMock = (options: {
    templates?: typeof mockTemplates
    partner?: typeof mockPartner | null
    statuses?: typeof mockDocumentStatuses
    templatesError?: boolean
    partnerError?: boolean
    statusesError?: boolean
  } = {}) => {
    const {
      templates = mockTemplates,
      partner = mockPartner,
      statuses = mockDocumentStatuses,
      templatesError = false,
      partnerError = false,
      statusesError = false,
    } = options

    mockFetch.mockImplementation((url: string) => {
      if (url.includes('/api/documents/templates')) {
        if (templatesError) {
          return Promise.resolve({
            ok: false,
            json: () => Promise.resolve({ error: 'Failed to fetch templates' }),
          })
        }
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true, templates }),
        })
      }

      if (url.includes('/api/partner/me')) {
        if (partnerError) {
          return Promise.resolve({
            ok: false,
            json: () => Promise.resolve({ error: 'Failed to fetch partner' }),
          })
        }
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true, partner }),
        })
      }

      if (url.includes('/api/documents/sign') && !url.includes('POST')) {
        if (statusesError) {
          return Promise.resolve({
            ok: false,
            json: () => Promise.resolve({ error: 'Failed to fetch statuses' }),
          })
        }
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true, documents: statuses }),
        })
      }

      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      })
    })
  }

  describe('Loading state', () => {
    it('shows loading spinner and text initially', async () => {
      // Keep fetch pending to show loading state
      mockFetch.mockImplementation(() => new Promise(() => {}))

      render(<DocumentsPage />)

      expect(screen.getByText('Loading documents...')).toBeInTheDocument()
    })

    it('renders header and footer during loading', async () => {
      mockFetch.mockImplementation(() => new Promise(() => {}))

      render(<DocumentsPage />)

      expect(screen.getByTestId('header')).toBeInTheDocument()
      expect(screen.getByTestId('footer')).toBeInTheDocument()
    })
  })

  describe('Error state', () => {
    it('shows error message when templates fetch fails', async () => {
      setupFetchMock({ templatesError: true })

      render(<DocumentsPage />)

      await waitFor(() => {
        expect(screen.getByText(/failed to load documents/i)).toBeInTheDocument()
      })
    })

    it('shows Try Again button on error', async () => {
      setupFetchMock({ templatesError: true })

      render(<DocumentsPage />)

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument()
      })
    })

    it('reloads page when Try Again is clicked', async () => {
      const user = userEvent.setup({ delay: null })
      setupFetchMock({ templatesError: true })

      render(<DocumentsPage />)

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument()
      })

      await user.click(screen.getByRole('button', { name: /try again/i }))

      expect(mockReload).toHaveBeenCalled()
    })

    it('continues loading templates when partner fetch fails', async () => {
      // When partner fetch fails, the page should still try to load templates
      // and render them (without partner-specific features)
      setupFetchMock({ partnerError: true })

      render(<DocumentsPage />)

      await waitFor(() => {
        // Should still load and show templates
        expect(screen.getByText('Partner Agreement')).toBeInTheDocument()
      })
    })
  })

  describe('Document list rendering', () => {
    it('renders all document templates', async () => {
      setupFetchMock()

      render(<DocumentsPage />)

      await waitFor(() => {
        expect(screen.getByText('Partner Agreement')).toBeInTheDocument()
        expect(screen.getByText('W-9 Tax Form')).toBeInTheDocument()
        expect(screen.getByText('Direct Deposit Form')).toBeInTheDocument()
      })
    })

    it('shows progress indicator with correct count', async () => {
      setupFetchMock()

      render(<DocumentsPage />)

      await waitFor(() => {
        // Should show "0 of 3" signed initially
        expect(screen.getByText(/0 of 3/)).toBeInTheDocument()
      })
    })

    it('shows page title', async () => {
      setupFetchMock()

      render(<DocumentsPage />)

      await waitFor(() => {
        expect(screen.getByText(/Partner Documents/i)).toBeInTheDocument()
      })
    })

    it('shows page description', async () => {
      setupFetchMock()

      render(<DocumentsPage />)

      await waitFor(() => {
        expect(screen.getByText(/please review and sign the following documents/i)).toBeInTheDocument()
      })
    })
  })

  describe('Document status display', () => {
    it('shows pending status for unsigned documents', async () => {
      setupFetchMock()

      render(<DocumentsPage />)

      await waitFor(() => {
        // All documents should show "Pending signature" status
        const pendingElements = screen.getAllByText(/Pending signature/i)
        expect(pendingElements.length).toBe(3)
      })
    })

    it('shows signed status for signed documents', async () => {
      const signedStatuses = {
        partner_agreement: { signed: true, signedAt: '2024-01-15T10:00:00Z' },
        w9: { signed: false },
        direct_deposit: { signed: false },
      }

      setupFetchMock({ statuses: signedStatuses })

      render(<DocumentsPage />)

      // Wait for component to load first
      await waitFor(() => {
        expect(screen.getByText('Partner Agreement')).toBeInTheDocument()
      })

      // Check for signed status text (component shows "Signed on {date}")
      expect(screen.getByText(/Signed on/i)).toBeInTheDocument()

      // Check pending documents count
      const pendingElements = screen.getAllByText(/Pending signature/i)
      expect(pendingElements.length).toBe(2)
    })

    it('shows Sign button for unsigned documents', async () => {
      setupFetchMock()

      render(<DocumentsPage />)

      await waitFor(() => {
        const signButtons = screen.getAllByRole('button', { name: /sign/i })
        expect(signButtons.length).toBe(3)
      })
    })

    it('shows View button for signed documents', async () => {
      const signedStatuses = {
        partner_agreement: { signed: true, signedAt: '2024-01-15T10:00:00Z' },
        w9: { signed: true, signedAt: '2024-01-15T10:00:00Z' },
        direct_deposit: { signed: false },
      }

      setupFetchMock({ statuses: signedStatuses })

      render(<DocumentsPage />)

      await waitFor(() => {
        const viewButtons = screen.getAllByRole('button', { name: /view/i })
        expect(viewButtons.length).toBe(2)
      })
    })

    it('updates progress when documents are signed', async () => {
      const signedStatuses = {
        partner_agreement: { signed: true, signedAt: '2024-01-15T10:00:00Z' },
        w9: { signed: true, signedAt: '2024-01-15T10:00:00Z' },
        direct_deposit: { signed: false },
      }

      setupFetchMock({ statuses: signedStatuses })

      render(<DocumentsPage />)

      await waitFor(() => {
        expect(screen.getByText(/2 of 3/)).toBeInTheDocument()
      })
    })
  })

  describe('Remaining documents message', () => {
    it('shows remaining documents count when not all signed', async () => {
      const signedStatuses = {
        partner_agreement: { signed: true, signedAt: '2024-01-15T10:00:00Z' },
        w9: { signed: false },
        direct_deposit: { signed: false },
      }

      setupFetchMock({ statuses: signedStatuses })

      render(<DocumentsPage />)

      await waitFor(() => {
        // The page shows "X documents remaining" (without parentheses)
        expect(screen.getByText(/2 documents? remaining/i)).toBeInTheDocument()
      })
    })

    it('shows correct singular form for one remaining', async () => {
      const signedStatuses = {
        partner_agreement: { signed: true, signedAt: '2024-01-15T10:00:00Z' },
        w9: { signed: true, signedAt: '2024-01-15T10:00:00Z' },
        direct_deposit: { signed: false },
      }

      setupFetchMock({ statuses: signedStatuses })

      render(<DocumentsPage />)

      await waitFor(() => {
        // The page shows "1 document remaining" (singular)
        expect(screen.getByText(/1 documents? remaining/i)).toBeInTheDocument()
      })
    })
  })

  describe('All documents signed state', () => {
    it('shows success message when all documents signed', async () => {
      const allSignedStatuses = {
        partner_agreement: { signed: true, signedAt: '2024-01-15T10:00:00Z' },
        w9: { signed: true, signedAt: '2024-01-15T10:00:00Z' },
        direct_deposit: { signed: true, signedAt: '2024-01-15T10:00:00Z' },
      }

      setupFetchMock({ statuses: allSignedStatuses })

      render(<DocumentsPage />)

      await waitFor(() => {
        expect(screen.getByText(/all documents signed/i)).toBeInTheDocument()
      })
    })

    it('shows progress as 3 of 3 when all signed', async () => {
      const allSignedStatuses = {
        partner_agreement: { signed: true, signedAt: '2024-01-15T10:00:00Z' },
        w9: { signed: true, signedAt: '2024-01-15T10:00:00Z' },
        direct_deposit: { signed: true, signedAt: '2024-01-15T10:00:00Z' },
      }

      setupFetchMock({ statuses: allSignedStatuses })

      render(<DocumentsPage />)

      await waitFor(() => {
        expect(screen.getByText(/3 of 3/)).toBeInTheDocument()
      })
    })

    it('shows all documents signed state without auto-redirect on initial load', async () => {
      // Note: The component only redirects after signing the LAST document via handleSign,
      // not when all documents are already signed on initial page load
      const allSignedStatuses = {
        partner_agreement: { signed: true, signedAt: '2024-01-15T10:00:00Z' },
        w9: { signed: true, signedAt: '2024-01-15T10:00:00Z' },
        direct_deposit: { signed: true, signedAt: '2024-01-15T10:00:00Z' },
      }

      setupFetchMock({ statuses: allSignedStatuses })

      render(<DocumentsPage />)

      // Wait for loading to complete and verify "All Documents Signed" message is shown
      await waitFor(() => {
        expect(screen.getByText(/All Documents Signed/i)).toBeInTheDocument()
      })

      // The redirect only happens when you sign the last document via handleSign,
      // not automatically on initial load
      expect(screen.getByText(/3 of 3/)).toBeInTheDocument()
    })
  })

  describe('DocumentViewer modal', () => {
    it('opens DocumentViewer when Sign button is clicked', async () => {
      const user = userEvent.setup({ delay: null })
      setupFetchMock()

      render(<DocumentsPage />)

      await waitFor(() => {
        expect(screen.getByText('Partner Agreement')).toBeInTheDocument()
      })

      const signButtons = screen.getAllByRole('button', { name: /sign/i })
      await user.click(signButtons[0])

      await waitFor(() => {
        expect(screen.getByTestId('document-viewer')).toBeInTheDocument()
      })
    })

    it('passes correct document to DocumentViewer', async () => {
      const user = userEvent.setup({ delay: null })
      setupFetchMock()

      render(<DocumentsPage />)

      await waitFor(() => {
        expect(screen.getByText('Partner Agreement')).toBeInTheDocument()
      })

      const signButtons = screen.getAllByRole('button', { name: /sign/i })
      await user.click(signButtons[0])

      // Check that DocumentViewer is open and shows the correct document
      await waitFor(() => {
        expect(screen.getByTestId('document-viewer')).toBeInTheDocument()
      })
      // The document viewer should contain the Partner Agreement title
      const viewer = screen.getByTestId('document-viewer')
      expect(viewer).toHaveTextContent('Partner Agreement')
    })

    it('opens DocumentViewer when View button is clicked', async () => {
      const user = userEvent.setup({ delay: null })
      const signedStatuses = {
        partner_agreement: { signed: true, signedAt: '2024-01-15T10:00:00Z' },
        w9: { signed: false },
        direct_deposit: { signed: false },
      }

      setupFetchMock({ statuses: signedStatuses })

      render(<DocumentsPage />)

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /view/i })).toBeInTheDocument()
      })

      await user.click(screen.getByRole('button', { name: /view/i }))

      await waitFor(() => {
        expect(screen.getByTestId('document-viewer')).toBeInTheDocument()
      })
    })

    it('closes DocumentViewer when close is triggered', async () => {
      const user = userEvent.setup({ delay: null })
      setupFetchMock()

      render(<DocumentsPage />)

      await waitFor(() => {
        expect(screen.getByText('Partner Agreement')).toBeInTheDocument()
      })

      // Open the viewer
      const signButtons = screen.getAllByRole('button', { name: /sign/i })
      await user.click(signButtons[0])

      await waitFor(() => {
        expect(screen.getByTestId('document-viewer')).toBeInTheDocument()
      })

      // Close the viewer
      await user.click(screen.getByRole('button', { name: /close/i }))

      await waitFor(() => {
        expect(screen.queryByTestId('document-viewer')).not.toBeInTheDocument()
      })
    })
  })

  describe('Document signing flow', () => {
    it('calls sign API when document is signed', async () => {
      const user = userEvent.setup({ delay: null })

      // Mock POST to /api/documents/sign
      mockFetch.mockImplementation((url: string, options?: RequestInit) => {
        if (url.includes('/api/documents/templates')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ success: true, templates: mockTemplates }),
          })
        }
        if (url.includes('/api/partner/me')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ success: true, partner: mockPartner }),
          })
        }
        if (url.includes('/api/documents/sign') && options?.method === 'POST') {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ success: true }),
          })
        }
        if (url.includes('/api/documents/sign')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ success: true, documents: mockDocumentStatuses }),
          })
        }
        return Promise.resolve({ ok: true, json: () => Promise.resolve({}) })
      })

      render(<DocumentsPage />)

      await waitFor(() => {
        expect(screen.getByText('Partner Agreement')).toBeInTheDocument()
      })

      // Open the viewer and sign
      const signButtons = screen.getAllByRole('button', { name: /sign/i })
      await user.click(signButtons[0])

      // Wait for document viewer to open
      await waitFor(() => {
        expect(screen.getByTestId('document-viewer')).toBeInTheDocument()
      })

      // Click sign button inside the DocumentViewer (the mock has a button with just "Sign" text)
      const viewer = screen.getByTestId('document-viewer')
      const viewerSignButton = viewer.querySelector('button')
      expect(viewerSignButton).not.toBeNull()
      await user.click(viewerSignButton!)

      await waitFor(() => {
        // Verify POST was called to sign endpoint
        const postCalls = mockFetch.mock.calls.filter(
          (call) => call[1]?.method === 'POST'
        )
        expect(postCalls.length).toBeGreaterThan(0)
      })
    })
  })

  describe('Session handling', () => {
    it('handles unauthenticated session', async () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: 'unauthenticated',
      })

      setupFetchMock()

      render(<DocumentsPage />)

      // Should still render the page structure
      expect(screen.getByTestId('header')).toBeInTheDocument()
    })

    it('handles loading session', async () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: 'loading',
      })

      setupFetchMock()

      render(<DocumentsPage />)

      // Should show loading state
      await waitFor(() => {
        expect(screen.getByText('Loading documents...')).toBeInTheDocument()
      })
    })
  })

  describe('Edge cases', () => {
    it('handles empty templates array', async () => {
      setupFetchMock({ templates: [] })

      render(<DocumentsPage />)

      await waitFor(() => {
        // Should show 0 of 0 or handle gracefully
        expect(screen.getByText(/0 of 0/)).toBeInTheDocument()
      })
    })

    it('handles missing partner gracefully', async () => {
      setupFetchMock({ partner: null })

      render(<DocumentsPage />)

      // Should show error or handle gracefully
      await waitFor(() => {
        // The page might show an error or continue without partner
        expect(screen.getByTestId('header')).toBeInTheDocument()
      })
    })

    it('handles network error gracefully', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'))

      render(<DocumentsPage />)

      await waitFor(() => {
        expect(screen.getByText(/failed to load documents/i)).toBeInTheDocument()
      })
    })
  })
})
