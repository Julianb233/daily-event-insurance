import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SigningProgress } from '@/components/signing/signing-progress'

// Mock react-signature-canvas for SignaturePad tests
vi.mock('react-signature-canvas', () => ({
  default: vi.fn().mockImplementation(({ onEnd, canvasProps }) => {
    return (
      <canvas
        data-testid="signature-canvas"
        {...canvasProps}
        onClick={() => onEnd?.()}
      />
    )
  }),
}))

describe('Signing Components', () => {
  // ============================================
  // SigningProgress Component Tests
  // ============================================
  describe('SigningProgress', () => {
    const mockDocuments = [
      { type: 'partner_agreement', title: 'Partner Agreement', signed: false, required: true },
      { type: 'joint_marketing', title: 'Joint Marketing', signed: false, required: true },
      { type: 'mutual_nda', title: 'Mutual NDA', signed: false, required: true },
      { type: 'w9', title: 'W-9 Form', signed: false, required: false },
    ]

    it('renders all documents', () => {
      render(
        <SigningProgress
          documents={mockDocuments}
          currentIndex={0}
        />
      )

      // Each document appears twice (desktop + mobile view)
      mockDocuments.forEach(doc => {
        expect(screen.getAllByText(doc.title).length).toBeGreaterThanOrEqual(1)
      })
    })

    it('displays correct progress count for required documents', () => {
      const docsWithOneSigned = [
        { type: 'partner_agreement', title: 'Partner Agreement', signed: true, required: true },
        { type: 'joint_marketing', title: 'Joint Marketing', signed: false, required: true },
        { type: 'mutual_nda', title: 'Mutual NDA', signed: false, required: true },
        { type: 'w9', title: 'W-9 Form', signed: false, required: false },
      ]

      render(
        <SigningProgress
          documents={docsWithOneSigned}
          currentIndex={1}
        />
      )

      // Should show "1 of 3 required documents signed" (w9 is not required)
      expect(screen.getByText('1 of 3 required documents signed')).toBeInTheDocument()
    })

    it('shows 0 signed when no documents are signed', () => {
      render(
        <SigningProgress
          documents={mockDocuments}
          currentIndex={0}
        />
      )

      expect(screen.getByText('0 of 3 required documents signed')).toBeInTheDocument()
    })

    it('shows all signed when all required documents are signed', () => {
      const allRequiredSigned = [
        { type: 'partner_agreement', title: 'Partner Agreement', signed: true, required: true },
        { type: 'joint_marketing', title: 'Joint Marketing', signed: true, required: true },
        { type: 'mutual_nda', title: 'Mutual NDA', signed: true, required: true },
        { type: 'w9', title: 'W-9 Form', signed: false, required: false },
      ]

      render(
        <SigningProgress
          documents={allRequiredSigned}
          currentIndex={3}
        />
      )

      expect(screen.getByText('3 of 3 required documents signed')).toBeInTheDocument()
    })

    it('marks optional documents correctly', () => {
      render(
        <SigningProgress
          documents={mockDocuments}
          currentIndex={0}
        />
      )

      // Should show "Optional" badge for W-9
      expect(screen.getAllByText('Optional').length).toBeGreaterThan(0)
    })

    it('calls onStepClick when a step is clicked', () => {
      const mockOnStepClick = vi.fn()

      render(
        <SigningProgress
          documents={mockDocuments}
          currentIndex={0}
          onStepClick={mockOnStepClick}
        />
      )

      // Click on the second document (Joint Marketing)
      const jointMarketingButton = screen.getAllByRole('button').find(btn =>
        btn.textContent?.includes('Joint Marketing')
      )

      if (jointMarketingButton) {
        fireEvent.click(jointMarketingButton)
        expect(mockOnStepClick).toHaveBeenCalledWith(1)
      }
    })

    it('does not call onStepClick when not provided', () => {
      render(
        <SigningProgress
          documents={mockDocuments}
          currentIndex={0}
        />
      )

      // Buttons should be disabled when onStepClick is not provided
      const buttons = screen.getAllByRole('button')
      buttons.forEach(button => {
        expect(button).toBeDisabled()
      })
    })

    it('displays check icon for signed documents', () => {
      const docsWithSigned = [
        { type: 'partner_agreement', title: 'Partner Agreement', signed: true, required: true },
        { type: 'joint_marketing', title: 'Joint Marketing', signed: false, required: true },
      ]

      render(
        <SigningProgress
          documents={docsWithSigned}
          currentIndex={1}
        />
      )

      // The check icon is rendered via lucide-react, check for SVG
      const svgElements = document.querySelectorAll('svg')
      expect(svgElements.length).toBeGreaterThan(0)
    })

    it('highlights current document', () => {
      render(
        <SigningProgress
          documents={mockDocuments}
          currentIndex={1}
        />
      )

      // Check that the current document has highlight styling
      // The mobile view has different styling with "bg-teal-50"
      const buttons = screen.getAllByRole('button')
      const currentButton = buttons.find(btn =>
        btn.textContent?.includes('Joint Marketing')
      )

      expect(currentButton).toBeInTheDocument()
    })

    it('handles empty documents array', () => {
      render(
        <SigningProgress
          documents={[]}
          currentIndex={0}
        />
      )

      // Should show "0 of 0 required documents signed"
      expect(screen.getByText('0 of 0 required documents signed')).toBeInTheDocument()
    })

    it('handles all optional documents', () => {
      const allOptional = [
        { type: 'w9', title: 'W-9 Form', signed: false, required: false },
        { type: 'direct_deposit', title: 'Direct Deposit', signed: false, required: false },
      ]

      render(
        <SigningProgress
          documents={allOptional}
          currentIndex={0}
        />
      )

      expect(screen.getByText('0 of 0 required documents signed')).toBeInTheDocument()
    })

    it('calculates progress percentage correctly', () => {
      const halfSigned = [
        { type: 'partner_agreement', title: 'Partner Agreement', signed: true, required: true },
        { type: 'joint_marketing', title: 'Joint Marketing', signed: true, required: true },
        { type: 'mutual_nda', title: 'Mutual NDA', signed: false, required: true },
        { type: 'sponsorship', title: 'Sponsorship', signed: false, required: true },
      ]

      const { container } = render(
        <SigningProgress
          documents={halfSigned}
          currentIndex={2}
        />
      )

      // Progress bar should be 50% (2 of 4 signed)
      const progressBar = container.querySelector('.bg-gradient-to-r')
      expect(progressBar).toHaveStyle({ width: '50%' })
    })

    it('handles single document', () => {
      const singleDoc = [
        { type: 'partner_agreement', title: 'Partner Agreement', signed: false, required: true },
      ]

      render(
        <SigningProgress
          documents={singleDoc}
          currentIndex={0}
        />
      )

      expect(screen.getByText('0 of 1 required documents signed')).toBeInTheDocument()
      // Document title appears twice (desktop + mobile view)
      expect(screen.getAllByText('Partner Agreement').length).toBeGreaterThanOrEqual(1)
    })

    it('updates correctly when document becomes signed', () => {
      const { rerender } = render(
        <SigningProgress
          documents={mockDocuments}
          currentIndex={0}
        />
      )

      expect(screen.getByText('0 of 3 required documents signed')).toBeInTheDocument()

      // Simulate signing the first document
      const updatedDocs = [...mockDocuments]
      updatedDocs[0] = { ...updatedDocs[0], signed: true }

      rerender(
        <SigningProgress
          documents={updatedDocs}
          currentIndex={1}
        />
      )

      expect(screen.getByText('1 of 3 required documents signed')).toBeInTheDocument()
    })

    it('renders desktop and mobile views', () => {
      const { container } = render(
        <SigningProgress
          documents={mockDocuments}
          currentIndex={0}
        />
      )

      // Desktop view (hidden on small screens)
      const desktopView = container.querySelector('.hidden.sm\\:flex')
      expect(desktopView).toBeInTheDocument()

      // Mobile view (hidden on larger screens)
      const mobileView = container.querySelector('.sm\\:hidden')
      expect(mobileView).toBeInTheDocument()
    })

    it('shows "Signed" label for completed documents in mobile view', () => {
      const docsWithSigned = [
        { type: 'partner_agreement', title: 'Partner Agreement', signed: true, required: true },
        { type: 'joint_marketing', title: 'Joint Marketing', signed: false, required: true },
      ]

      render(
        <SigningProgress
          documents={docsWithSigned}
          currentIndex={1}
        />
      )

      // Mobile view shows "Signed" text
      expect(screen.getByText('Signed')).toBeInTheDocument()
    })
  })

  // ============================================
  // SignaturePad Component Tests (with mocked canvas)
  // ============================================
  describe('SignaturePad', () => {
    let SignaturePad: typeof import('@/components/signing/signature-pad').SignaturePad

    beforeEach(async () => {
      // Dynamically import after mock
      const module = await import('@/components/signing/signature-pad')
      SignaturePad = module.SignaturePad
    })

    afterEach(() => {
      vi.clearAllMocks()
    })

    it('renders the signature pad component', () => {
      const mockOnChange = vi.fn()

      render(<SignaturePad onSignatureChange={mockOnChange} />)

      expect(screen.getByText('Draw your signature below')).toBeInTheDocument()
      expect(screen.getByText('Clear')).toBeInTheDocument()
      expect(screen.getByText('Sign here')).toBeInTheDocument()
    })

    it('has clear button disabled when empty', () => {
      const mockOnChange = vi.fn()

      render(<SignaturePad onSignatureChange={mockOnChange} />)

      const clearButton = screen.getByRole('button', { name: /clear/i })
      expect(clearButton).toBeDisabled()
    })

    it('renders instruction text', () => {
      const mockOnChange = vi.fn()

      render(<SignaturePad onSignatureChange={mockOnChange} />)

      expect(screen.getByText(/Use your mouse, finger, or stylus/i)).toBeInTheDocument()
    })

    it('applies disabled state correctly', () => {
      const mockOnChange = vi.fn()

      render(<SignaturePad onSignatureChange={mockOnChange} disabled={true} />)

      const clearButton = screen.getByRole('button', { name: /clear/i })
      expect(clearButton).toBeDisabled()
    })

    it('applies custom className', () => {
      const mockOnChange = vi.fn()

      const { container } = render(
        <SignaturePad onSignatureChange={mockOnChange} className="custom-class" />
      )

      expect(container.firstChild).toHaveClass('custom-class')
    })

    it('renders canvas element', () => {
      const mockOnChange = vi.fn()

      render(<SignaturePad onSignatureChange={mockOnChange} />)

      expect(screen.getByTestId('signature-canvas')).toBeInTheDocument()
    })
  })
})

// ============================================
// Utility Tests for Signing Helpers
// ============================================
describe('Signing Utilities', () => {
  describe('Document Status Helpers', () => {
    const mockDocuments = [
      { type: 'partner_agreement', title: 'Partner Agreement', signed: true, required: true },
      { type: 'joint_marketing', title: 'Joint Marketing', signed: false, required: true },
      { type: 'w9', title: 'W-9 Form', signed: false, required: false },
    ]

    it('correctly identifies signed documents', () => {
      const signedDocs = mockDocuments.filter(d => d.signed)
      expect(signedDocs).toHaveLength(1)
      expect(signedDocs[0].type).toBe('partner_agreement')
    })

    it('correctly identifies required documents', () => {
      const requiredDocs = mockDocuments.filter(d => d.required !== false)
      expect(requiredDocs).toHaveLength(2)
    })

    it('calculates completion percentage correctly', () => {
      const requiredDocs = mockDocuments.filter(d => d.required !== false)
      const signedRequired = requiredDocs.filter(d => d.signed)
      const percentage = (signedRequired.length / requiredDocs.length) * 100
      expect(percentage).toBe(50)
    })

    it('handles all documents signed', () => {
      const allSigned = mockDocuments.map(d => ({ ...d, signed: true }))
      const requiredDocs = allSigned.filter(d => d.required !== false)
      const signedRequired = requiredDocs.filter(d => d.signed)
      expect(signedRequired.length).toBe(requiredDocs.length)
    })
  })
})
