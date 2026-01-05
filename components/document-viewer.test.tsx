import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DocumentViewer } from './document-viewer'

// Mock ReactMarkdown
vi.mock('react-markdown', () => ({
  default: ({ children }: { children: string }) => <div data-testid="markdown-content">{children}</div>,
}))

const mockDocument = {
  id: 'doc-1',
  type: 'partner_agreement',
  title: 'Partner Agreement',
  content: '# Agreement\n\nThis is the agreement content.',
  version: '1.0',
}

describe('DocumentViewer', () => {
  const mockOnClose = vi.fn()
  const mockOnSign = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering conditions', () => {
    it('returns null when isOpen is false', () => {
      const { container } = render(
        <DocumentViewer
          isOpen={false}
          onClose={mockOnClose}
          document={mockDocument}
          onSign={mockOnSign}
        />
      )

      expect(container.firstChild).toBeNull()
    })

    it('returns null when document is null', () => {
      const { container } = render(
        <DocumentViewer
          isOpen={true}
          onClose={mockOnClose}
          document={null}
          onSign={mockOnSign}
        />
      )

      expect(container.firstChild).toBeNull()
    })

    it('returns null when both isOpen is false and document is null', () => {
      const { container } = render(
        <DocumentViewer
          isOpen={false}
          onClose={mockOnClose}
          document={null}
          onSign={mockOnSign}
        />
      )

      expect(container.firstChild).toBeNull()
    })

    it('renders when isOpen is true and document is provided', () => {
      render(
        <DocumentViewer
          isOpen={true}
          onClose={mockOnClose}
          document={mockDocument}
          onSign={mockOnSign}
        />
      )

      expect(screen.getByText('Partner Agreement')).toBeInTheDocument()
    })
  })

  describe('Document display', () => {
    it('displays document title', () => {
      render(
        <DocumentViewer
          isOpen={true}
          onClose={mockOnClose}
          document={mockDocument}
          onSign={mockOnSign}
        />
      )

      expect(screen.getByText('Partner Agreement')).toBeInTheDocument()
    })

    it('displays document version', () => {
      render(
        <DocumentViewer
          isOpen={true}
          onClose={mockOnClose}
          document={mockDocument}
          onSign={mockOnSign}
        />
      )

      expect(screen.getByText('Version 1.0')).toBeInTheDocument()
    })

    it('renders document content with ReactMarkdown', () => {
      render(
        <DocumentViewer
          isOpen={true}
          onClose={mockOnClose}
          document={mockDocument}
          onSign={mockOnSign}
        />
      )

      const markdownContent = screen.getByTestId('markdown-content')
      expect(markdownContent).toBeInTheDocument()
      expect(markdownContent).toHaveTextContent('# Agreement')
    })
  })

  describe('Signed state', () => {
    it('shows "Document Signed" message when isSigned is true', () => {
      render(
        <DocumentViewer
          isOpen={true}
          onClose={mockOnClose}
          document={mockDocument}
          onSign={mockOnSign}
          isSigned={true}
        />
      )

      expect(screen.getByText('Document Signed')).toBeInTheDocument()
    })

    it('does not show signing form when isSigned is true', () => {
      render(
        <DocumentViewer
          isOpen={true}
          onClose={mockOnClose}
          document={mockDocument}
          onSign={mockOnSign}
          isSigned={true}
        />
      )

      expect(screen.queryByPlaceholderText('Type your full legal name to sign')).not.toBeInTheDocument()
      expect(screen.queryByText('Sign Document')).not.toBeInTheDocument()
    })
  })

  describe('Signing form', () => {
    it('shows signing form when isSigned is false', () => {
      render(
        <DocumentViewer
          isOpen={true}
          onClose={mockOnClose}
          document={mockDocument}
          onSign={mockOnSign}
          isSigned={false}
        />
      )

      expect(screen.getByPlaceholderText('Type your full legal name to sign')).toBeInTheDocument()
      expect(screen.getByText('Sign Document')).toBeInTheDocument()
    })

    it('shows signing form by default when isSigned is not provided', () => {
      render(
        <DocumentViewer
          isOpen={true}
          onClose={mockOnClose}
          document={mockDocument}
          onSign={mockOnSign}
        />
      )

      expect(screen.getByPlaceholderText('Type your full legal name to sign')).toBeInTheDocument()
    })

    it('has agreement checkbox', () => {
      render(
        <DocumentViewer
          isOpen={true}
          onClose={mockOnClose}
          document={mockDocument}
          onSign={mockOnSign}
        />
      )

      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toBeInTheDocument()
      expect(checkbox).not.toBeChecked()
    })

    it('has signature input field', () => {
      render(
        <DocumentViewer
          isOpen={true}
          onClose={mockOnClose}
          document={mockDocument}
          onSign={mockOnSign}
        />
      )

      const input = screen.getByPlaceholderText('Type your full legal name to sign')
      expect(input).toBeInTheDocument()
      expect(input).toHaveValue('')
    })

    it('sign button is disabled when signature is empty', () => {
      render(
        <DocumentViewer
          isOpen={true}
          onClose={mockOnClose}
          document={mockDocument}
          onSign={mockOnSign}
        />
      )

      const button = screen.getByRole('button', { name: /sign document/i })
      expect(button).toBeDisabled()
    })

    it('sign button is disabled when checkbox is not checked', async () => {
      const user = userEvent.setup()

      render(
        <DocumentViewer
          isOpen={true}
          onClose={mockOnClose}
          document={mockDocument}
          onSign={mockOnSign}
        />
      )

      const input = screen.getByPlaceholderText('Type your full legal name to sign')
      await user.type(input, 'John Doe')

      const button = screen.getByRole('button', { name: /sign document/i })
      expect(button).toBeDisabled()
    })

    it('sign button is enabled when signature is provided and checkbox is checked', async () => {
      const user = userEvent.setup()

      render(
        <DocumentViewer
          isOpen={true}
          onClose={mockOnClose}
          document={mockDocument}
          onSign={mockOnSign}
        />
      )

      const input = screen.getByPlaceholderText('Type your full legal name to sign')
      const checkbox = screen.getByRole('checkbox')

      await user.type(input, 'John Doe')
      await user.click(checkbox)

      const button = screen.getByRole('button', { name: /sign document/i })
      expect(button).not.toBeDisabled()
    })
  })

  // Note: Lines 37-38 and 41-42 contain defense-in-depth validation that sets
  // error messages. These cannot be triggered through normal UI interaction because
  // the button is disabled when validation conditions aren't met. This is intentional -
  // the validation provides an extra safety layer if someone bypasses the disabled state.
  // We test that the button IS disabled in those conditions instead.

  describe('Signing process', () => {
    it('calls onSign with correct arguments on valid submission', async () => {
      const user = userEvent.setup()
      mockOnSign.mockResolvedValue(undefined)

      render(
        <DocumentViewer
          isOpen={true}
          onClose={mockOnClose}
          document={mockDocument}
          onSign={mockOnSign}
        />
      )

      const input = screen.getByPlaceholderText('Type your full legal name to sign')
      const checkbox = screen.getByRole('checkbox')
      const button = screen.getByRole('button', { name: /sign document/i })

      await user.type(input, 'John Doe')
      await user.click(checkbox)
      await user.click(button)

      await waitFor(() => {
        expect(mockOnSign).toHaveBeenCalledWith('partner_agreement', 'John Doe')
      })
    })

    it('shows loading state while signing', async () => {
      const user = userEvent.setup()
      // Create a promise that won't resolve immediately
      let resolveSign: () => void
      mockOnSign.mockImplementation(() => new Promise((resolve) => {
        resolveSign = resolve
      }))

      render(
        <DocumentViewer
          isOpen={true}
          onClose={mockOnClose}
          document={mockDocument}
          onSign={mockOnSign}
        />
      )

      const input = screen.getByPlaceholderText('Type your full legal name to sign')
      const checkbox = screen.getByRole('checkbox')
      const button = screen.getByRole('button', { name: /sign document/i })

      await user.type(input, 'John Doe')
      await user.click(checkbox)
      await user.click(button)

      // Should show loading state
      await waitFor(() => {
        expect(screen.getByText('Signing...')).toBeInTheDocument()
      })

      // Resolve the promise
      resolveSign!()

      await waitFor(() => {
        expect(screen.queryByText('Signing...')).not.toBeInTheDocument()
      })
    })

    it('closes modal on successful sign', async () => {
      const user = userEvent.setup()
      mockOnSign.mockResolvedValue(undefined)

      render(
        <DocumentViewer
          isOpen={true}
          onClose={mockOnClose}
          document={mockDocument}
          onSign={mockOnSign}
        />
      )

      const input = screen.getByPlaceholderText('Type your full legal name to sign')
      const checkbox = screen.getByRole('checkbox')
      const button = screen.getByRole('button', { name: /sign document/i })

      await user.type(input, 'John Doe')
      await user.click(checkbox)
      await user.click(button)

      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalled()
      })
    })

    it('shows error on failed sign', async () => {
      const user = userEvent.setup()
      mockOnSign.mockRejectedValue(new Error('Network error'))

      render(
        <DocumentViewer
          isOpen={true}
          onClose={mockOnClose}
          document={mockDocument}
          onSign={mockOnSign}
        />
      )

      const input = screen.getByPlaceholderText('Type your full legal name to sign')
      const checkbox = screen.getByRole('checkbox')
      const button = screen.getByRole('button', { name: /sign document/i })

      await user.type(input, 'John Doe')
      await user.click(checkbox)
      await user.click(button)

      await waitFor(() => {
        expect(screen.getByText('Failed to sign document. Please try again.')).toBeInTheDocument()
      })
    })

    it('does not close modal on failed sign', async () => {
      const user = userEvent.setup()
      mockOnSign.mockRejectedValue(new Error('Network error'))

      render(
        <DocumentViewer
          isOpen={true}
          onClose={mockOnClose}
          document={mockDocument}
          onSign={mockOnSign}
        />
      )

      const input = screen.getByPlaceholderText('Type your full legal name to sign')
      const checkbox = screen.getByRole('checkbox')
      const button = screen.getByRole('button', { name: /sign document/i })

      await user.type(input, 'John Doe')
      await user.click(checkbox)
      await user.click(button)

      await waitFor(() => {
        expect(screen.getByText('Failed to sign document. Please try again.')).toBeInTheDocument()
      })

      expect(mockOnClose).not.toHaveBeenCalled()
    })
  })

  describe('Modal controls', () => {
    it('calls onClose when clicking backdrop', async () => {
      const user = userEvent.setup()

      render(
        <DocumentViewer
          isOpen={true}
          onClose={mockOnClose}
          document={mockDocument}
          onSign={mockOnSign}
        />
      )

      // The backdrop has bg-black/50 class
      const backdrop = document.querySelector('.bg-black\\/50')
      expect(backdrop).toBeInTheDocument()

      await user.click(backdrop!)

      expect(mockOnClose).toHaveBeenCalled()
    })

    it('calls onClose when clicking X button', async () => {
      const user = userEvent.setup()

      render(
        <DocumentViewer
          isOpen={true}
          onClose={mockOnClose}
          document={mockDocument}
          onSign={mockOnSign}
        />
      )

      // Find the X button (it's the button with the X icon in the header)
      const closeButtons = screen.getAllByRole('button')
      const xButton = closeButtons.find(btn => btn.querySelector('svg.lucide-x'))

      expect(xButton).toBeTruthy()
      await user.click(xButton!)

      expect(mockOnClose).toHaveBeenCalled()
    })
  })

  describe('Edge cases', () => {
    it('handles whitespace-only signature as invalid', async () => {
      const user = userEvent.setup()

      render(
        <DocumentViewer
          isOpen={true}
          onClose={mockOnClose}
          document={mockDocument}
          onSign={mockOnSign}
        />
      )

      const input = screen.getByPlaceholderText('Type your full legal name to sign')
      const checkbox = screen.getByRole('checkbox')

      await user.type(input, '   ')
      await user.click(checkbox)

      // Button should still be disabled because signature.trim() is empty
      const button = screen.getByRole('button', { name: /sign document/i })
      expect(button).toBeDisabled()
    })

    it('displays different document types correctly', () => {
      const w9Document = {
        id: 'doc-2',
        type: 'w9',
        title: 'W-9 Tax Form',
        content: 'W-9 tax form content here',
        version: '2.5',
      }

      render(
        <DocumentViewer
          isOpen={true}
          onClose={mockOnClose}
          document={w9Document}
          onSign={mockOnSign}
        />
      )

      expect(screen.getByText('W-9 Tax Form')).toBeInTheDocument()
      expect(screen.getByText('Version 2.5')).toBeInTheDocument()
    })

    it('handles long document content', () => {
      const longDocument = {
        ...mockDocument,
        content: 'A'.repeat(10000),
      }

      render(
        <DocumentViewer
          isOpen={true}
          onClose={mockOnClose}
          document={longDocument}
          onSign={mockOnSign}
        />
      )

      const content = screen.getByTestId('markdown-content')
      expect(content.textContent?.length).toBe(10000)
    })
  })
})
